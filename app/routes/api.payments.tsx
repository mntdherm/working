import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createPaymentIntent, processPayment } from "~/models/payment.server";
import { requireUser } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const bookingId = formData.get("bookingId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentMethod = formData.get("paymentMethod") as string;

    if (!bookingId || !amount || !paymentMethod) {
      throw new Error("Missing required payment information");
    }

    const paymentIntent = await createPaymentIntent(bookingId, amount, paymentMethod);
    const payment = await processPayment(paymentIntent.id);

    return json({ success: true, payment });
  } catch (error) {
    return json(
      {
        success: false,
        error: error.message || "Payment processing failed",
      },
      { status: 400 }
    );
  }
};
