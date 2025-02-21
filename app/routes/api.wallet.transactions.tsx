import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { requireVendor } from "~/lib/auth.server";
import { supabase } from "~/lib/supabase.server";

const ITEMS_PER_PAGE = 20;

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const walletId = url.searchParams.get("walletId");

  if (!walletId) {
    throw new Error("Wallet ID is required");
  }

  const { data: transactions, error } = await supabase
    .from("wallet_transactions")
    .select()
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false })
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (error) {
    throw error;
  }

  return json({ transactions });
};
