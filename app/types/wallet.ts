export type WalletTransactionType = 
  | 'earning'
  | 'withdrawal'
  | 'commission'
  | 'refund'
  | 'adjustment';

export type WithdrawalStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface VendorWallet {
  id: string;
  vendorId: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  totalCommissions: number;
  lastWithdrawalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  reference?: string;
  description: string;
  metadata?: Record<string, any>;
  balanceAfter: number;
  createdAt: Date;
}

export interface WithdrawalRequest {
  id: string;
  walletId: string;
  amount: number;
  status: WithdrawalStatus;
  bankAccount: BankAccount;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccount {
  accountHolder: string;
  iban: string;
  bic: string;
  bankName: string;
}

export interface WalletStats {
  currentBalance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  totalCommissions: number;
  pendingWithdrawals: number;
  lastWithdrawal?: {
    amount: number;
    date: Date;
    status: WithdrawalStatus;
  };
  periodEarnings: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface EarningsReport {
  period: string;
  earnings: number;
  commissions: number;
  withdrawals: number;
  netEarnings: number;
  transactionCount: number;
  averageTransactionValue: number;
}
