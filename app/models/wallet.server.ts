import { supabase } from "~/lib/supabase.server";
import type {
  VendorWallet,
  WalletTransaction,
  WithdrawalRequest,
  WalletStats,
  EarningsReport,
  WalletTransactionType
} from "~/types/wallet";
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from "date-fns";

const MINIMUM_WITHDRAWAL = 50; // Minimum withdrawal amount in EUR
const MAXIMUM_WITHDRAWAL = 5000; // Maximum withdrawal amount in EUR

export async function getOrCreateWallet(vendorId: string): Promise<VendorWallet> {
  const { data: wallet } = await supabase
    .from("vendor_wallets")
    .select()
    .eq("vendor_id", vendorId)
    .single();

  if (wallet) return wallet;

  const { data: newWallet, error } = await supabase
    .from("vendor_wallets")
    .insert({
      vendor_id: vendorId,
      balance: 0,
      total_earnings: 0,
      total_withdrawals: 0,
      total_commissions: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return newWallet;
}

export async function addTransaction(
  walletId: string,
  type: WalletTransactionType,
  amount: number,
  description: string,
  reference?: string,
  metadata?: Record<string, any>
): Promise<WalletTransaction> {
  const { data: wallet } = await supabase
    .from("vendor_wallets")
    .select()
    .eq("id", walletId)
    .single();

  const newBalance = wallet.balance + amount;

  const { data: transaction, error } = await supabase
    .from("wallet_transactions")
    .insert({
      wallet_id: walletId,
      type,
      amount,
      description,
      reference,
      metadata,
      balance_after: newBalance,
    })
    .select()
    .single();

  if (error) throw error;

  // Update wallet balance and totals
  await supabase
    .from("vendor_wallets")
    .update({
      balance: newBalance,
      total_earnings: type === 'earning' ? wallet.total_earnings + amount : wallet.total_earnings,
      total_withdrawals: type === 'withdrawal' ? wallet.total_withdrawals + Math.abs(amount) : wallet.total_withdrawals,
      total_commissions: type === 'commission' ? wallet.total_commissions + Math.abs(amount) : wallet.total_commissions,
      ...(type === 'withdrawal' ? { last_withdrawal_date: new Date() } : {}),
    })
    .eq("id", walletId);

  return transaction;
}

export async function requestWithdrawal(
  walletId: string,
  amount: number,
  bankAccount: any
): Promise<WithdrawalRequest> {
  const { data: wallet } = await supabase
    .from("vendor_wallets")
    .select()
    .eq("id", walletId)
    .single();

  if (amount < MINIMUM_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal amount is ${MINIMUM_WITHDRAWAL} EUR`);
  }

  if (amount > MAXIMUM_WITHDRAWAL) {
    throw new Error(`Maximum withdrawal amount is ${MAXIMUM_WITHDRAWAL} EUR`);
  }

  if (amount > wallet.balance) {
    throw new Error("Insufficient funds");
  }

  const { data: withdrawal, error } = await supabase
    .from("withdrawal_requests")
    .insert({
      wallet_id: walletId,
      amount,
      status: "pending",
      bank_account: bankAccount,
    })
    .select()
    .single();

  if (error) throw error;

  // Add withdrawal transaction
  await addTransaction(
    walletId,
    "withdrawal",
    -amount,
    "Withdrawal request",
    withdrawal.id
  );

  return withdrawal;
}

export async function getWalletStats(walletId: string): Promise<WalletStats> {
  const now = new Date();
  const { data: wallet } = await supabase
    .from("vendor_wallets")
    .select()
    .eq("id", walletId)
    .single();

  const { data: lastWithdrawal } = await supabase
    .from("withdrawal_requests")
    .select()
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: pendingWithdrawals } = await supabase
    .from("withdrawal_requests")
    .select()
    .eq("wallet_id", walletId)
    .eq("status", "pending");

  const pendingAmount = pendingWithdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

  // Get period earnings
  const dailyEarnings = await getPeriodEarnings(walletId, startOfDay(now), endOfDay(now));
  const weeklyEarnings = await getPeriodEarnings(walletId, startOfWeek(now), endOfWeek(now));
  const monthlyEarnings = await getPeriodEarnings(walletId, startOfMonth(now), endOfMonth(now));

  return {
    currentBalance: wallet.balance,
    totalEarnings: wallet.total_earnings,
    totalWithdrawals: wallet.total_withdrawals,
    totalCommissions: wallet.total_commissions,
    pendingWithdrawals: pendingAmount,
    lastWithdrawal: lastWithdrawal ? {
      amount: lastWithdrawal.amount,
      date: lastWithdrawal.created_at,
      status: lastWithdrawal.status,
    } : undefined,
    periodEarnings: {
      daily: dailyEarnings,
      weekly: weeklyEarnings,
      monthly: monthlyEarnings,
    },
  };
}

async function getPeriodEarnings(walletId: string, startDate: Date, endDate: Date): Promise<number> {
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select()
    .eq("wallet_id", walletId)
    .eq("type", "earning")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  return transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
}

export async function generateEarningsReport(
  walletId: string,
  startDate: Date,
  endDate: Date
): Promise<EarningsReport> {
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select()
    .eq("wallet_id", walletId)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  const earnings = transactions
    ?.filter(t => t.type === "earning")
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const commissions = transactions
    ?.filter(t => t.type === "commission")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

  const withdrawals = transactions
    ?.filter(t => t.type === "withdrawal")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

  const earningTransactions = transactions?.filter(t => t.type === "earning") || [];

  return {
    period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
    earnings,
    commissions,
    withdrawals,
    netEarnings: earnings - commissions,
    transactionCount: earningTransactions.length,
    averageTransactionValue: earningTransactions.length > 0 
      ? earnings / earningTransactions.length 
      : 0,
  };
}
