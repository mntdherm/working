import { supabase } from "~/lib/supabase.server";
import type {
  PaymentIntent,
  PaymentMethod,
  Commission,
  Refund,
  Invoice,
  TransactionLog
} from "~/types/payment";

const COMMISSION_RATE = 0.1; // 10% commission

export async function createPaymentIntent(
  bookingId: string,
  amount: number,
  paymentMethod: PaymentMethod
): Promise<PaymentIntent> {
  try {
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        booking_id: bookingId,
        amount,
        currency: "EUR",
        status: "pending",
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (error) throw error;

    await createTransactionLog({
      paymentId: payment.id,
      action: "payment",
      status: "success",
      amount,
    });

    return payment;
  } catch (error) {
    await createTransactionLog({
      paymentId: "failed",
      action: "payment",
      status: "failure",
      amount,
      error: error.message,
    });
    throw error;
  }
}

export async function processPayment(paymentId: string): Promise<PaymentIntent> {
  try {
    const { data: payment, error } = await supabase
      .from("payments")
      .update({ status: "processing" })
      .eq("id", paymentId)
      .select()
      .single();

    if (error) throw error;

    // Here you would integrate with actual payment providers
    // For example, Stripe or other payment gateway

    const { data: updatedPayment, error: updateError } = await supabase
      .from("payments")
      .update({ status: "completed" })
      .eq("id", paymentId)
      .select()
      .single();

    if (updateError) throw updateError;

    await calculateAndCreateCommission(paymentId);

    await createTransactionLog({
      paymentId,
      action: "payment",
      status: "success",
      amount: payment.amount,
    });

    return updatedPayment;
  } catch (error) {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", paymentId);

    await createTransactionLog({
      paymentId,
      action: "payment",
      status: "failure",
      amount: 0,
      error: error.message,
    });

    throw error;
  }
}

export async function calculateAndCreateCommission(
  paymentId: string
): Promise<Commission> {
  try {
    const { data: payment } = await supabase
      .from("payments")
      .select("*, bookings(vendor_id)")
      .eq("id", paymentId)
      .single();

    const commissionAmount = payment.amount * COMMISSION_RATE;

    const { data: commission, error } = await supabase
      .from("commissions")
      .insert({
        payment_id: paymentId,
        vendor_id: payment.bookings.vendor_id,
        amount: commissionAmount,
        percentage: COMMISSION_RATE * 100,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    await createTransactionLog({
      paymentId,
      action: "commission",
      status: "success",
      amount: commissionAmount,
    });

    return commission;
  } catch (error) {
    await createTransactionLog({
      paymentId,
      action: "commission",
      status: "failure",
      amount: 0,
      error: error.message,
    });
    throw error;
  }
}

export async function processRefund(
  paymentId: string,
  amount: number,
  reason: string
): Promise<Refund> {
  try {
    const { data: payment } = await supabase
      .from("payments")
      .select()
      .eq("id", paymentId)
      .single();

    if (payment.status !== "completed") {
      throw new Error("Payment must be completed to process refund");
    }

    if (amount > payment.amount) {
      throw new Error("Refund amount cannot exceed payment amount");
    }

    // Here you would integrate with payment provider's refund API

    const { data: refund, error } = await supabase
      .from("refunds")
      .insert({
        payment_id: paymentId,
        amount,
        reason,
        status: "processed",
      })
      .select()
      .single();

    if (error) throw error;

    const newStatus = amount === payment.amount ? "refunded" : "partially_refunded";
    await supabase
      .from("payments")
      .update({ status: newStatus })
      .eq("id", paymentId);

    await createTransactionLog({
      paymentId,
      action: "refund",
      status: "success",
      amount,
    });

    return refund;
  } catch (error) {
    await createTransactionLog({
      paymentId,
      action: "refund",
      status: "failure",
      amount,
      error: error.message,
    });
    throw error;
  }
}

export async function generateInvoice(paymentId: string): Promise<Invoice> {
  try {
    const { data: payment } = await supabase
      .from("payments")
      .select(`
        *,
        bookings(
          vendor_id,
          customer_id,
          booking_services(
            service:services(name, price)
          )
        )
      `)
      .eq("id", paymentId)
      .single();

    const invoiceNumber = await generateInvoiceNumber();
    const items = payment.bookings.booking_services.map((bs: any) => ({
      description: bs.service.name,
      quantity: 1,
      unitPrice: bs.service.price,
      tax: bs.service.price * 0.24, // 24% VAT
      total: bs.service.price * 1.24,
    }));

    const totalAmount = items.reduce((sum: number, item: any) => sum + item.total, 0);
    const totalTax = items.reduce((sum: number, item: any) => sum + item.tax, 0);

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        payment_id: paymentId,
        vendor_id: payment.bookings.vendor_id,
        customer_id: payment.bookings.customer_id,
        number: invoiceNumber,
        amount: totalAmount,
        tax: totalTax,
        items,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    await createTransactionLog({
      paymentId,
      action: "invoice",
      status: "success",
      amount: totalAmount,
    });

    return invoice;
  } catch (error) {
    await createTransactionLog({
      paymentId,
      action: "invoice",
      status: "failure",
      amount: 0,
      error: error.message,
    });
    throw error;
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact" });

  const year = new Date().getFullYear();
  return `INV-${year}-${(count || 0) + 1}`.padEnd(10, "0");
}

async function createTransactionLog(log: Omit<TransactionLog, "id" | "createdAt">) {
  await supabase.from("transaction_logs").insert(log);
}
