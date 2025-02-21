import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireVendor } from "~/lib/auth.server";
import { getOrCreateWallet, getWalletStats, generateEarningsReport } from "~/models/wallet.server";
import { WalletOverview } from "~/components/vendor/wallet/WalletOverview";
import { TransactionHistory } from "~/components/vendor/wallet/TransactionHistory";
import { WithdrawalForm } from "~/components/vendor/wallet/WithdrawalForm";
import { EarningsChart } from "~/components/vendor/wallet/EarningsChart";
import { startOfMonth, endOfMonth } from "date-fns";

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  const wallet = await getOrCreateWallet(vendor.id);
  const stats = await getWalletStats(wallet.id);
  
  const now = new Date();
  const report = await generateEarningsReport(
    wallet.id,
    startOfMonth(now),
    endOfMonth(now)
  );

  return json({ wallet, stats, report });
};

export default function VendorWallet() {
  const { wallet, stats, report } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Lompakko</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <WalletOverview stats={stats} />
          <div className="mt-8">
            <WithdrawalForm walletId={wallet.id} currentBalance={stats.currentBalance} />
          </div>
        </div>

        <div>
          <EarningsChart report={report} />
        </div>
      </div>

      <div className="mt-8">
        <TransactionHistory walletId={wallet.id} />
      </div>
    </div>
  );
}
