import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { requireVendor } from "~/lib/auth.server";
import { generateEarningsReport } from "~/models/wallet.server";
import { parseISO } from "date-fns";

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  const url = new URL(request.url);
  const walletId = url.searchParams.get("walletId");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!walletId || !startDate || !endDate) {
    throw new Error("Missing required parameters");
  }

  const report = await generateEarningsReport(
    walletId,
    parseISO(startDate),
    parseISO(endDate)
  );

  return json({ report });
};
