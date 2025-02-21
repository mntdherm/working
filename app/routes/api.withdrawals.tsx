import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { requireVendor } from "~/lib/auth.server";
import { requestWithdrawal } from "~/models/wallet.server";
import type { BankAccount } from "~/types/wallet";

export const action: ActionFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  
  try {
    const formData = await request.formData();
    const walletId = formData.get("walletId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const bankAccount = JSON.parse(formData.get("bankAccount") as string) as BankAccount;

    if (!walletId || !amount || !bankAccount) {
      throw new Error("Missing required withdrawal information");
    }

    const withdrawal = await requestWithdrawal(walletId, amount, bankAccount);

    return json({ success: true, withdrawal });
  } catch (error) {
    return json(
      {
        success: false,
        error: error.message || "Withdrawal request failed",
      },
      { status: 400 }
    );
  }
};
