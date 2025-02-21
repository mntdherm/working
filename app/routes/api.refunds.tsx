import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { processRefund } from "~/models/payment.server";
import { requireUser } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const paymentId = formData.get("paymentId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const reason = formData.get("reason") as string;

    if (!paymentId || !amount || !reason) {
      throw new Error("Missing required refund information");
    }

    const refund = await processRefund(paymentId, amount, reason);

    return json({ success: true, refund });
  } catch (error) {
    return json(
      {
        success: false,
        error: error.message || "Refund processing failed",
      },
      { status: 400 }
    );
  }
};
