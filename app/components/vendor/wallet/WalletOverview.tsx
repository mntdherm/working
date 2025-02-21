import type { WalletStats } from "~/types/wallet";

interface WalletOverviewProps {
  stats: WalletStats;
}

export function WalletOverview({ stats }: WalletOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Lompakon yhteenveto</h2>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Nykyinen saldo
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.currentBalance)}
            </dd>
          </div>

          <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Kuukauden tulot
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.periodEarnings.monthly)}
            </dd>
          </div>

          <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Kokonaistulot
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.totalEarnings)}
            </dd>
          </div>

          <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Komissiot yhteensä
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.totalCommissions)}
            </dd>
          </div>
        </dl>

        {stats.lastWithdrawal && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Viimeisin nosto</h3>
            <div className="mt-2 text-sm text-gray-900">
              <p>Summa: {formatCurrency(stats.lastWithdrawal.amount)}</p>
              <p>Päivämäärä: {new Date(stats.lastWithdrawal.date).toLocaleDateString("fi-FI")}</p>
              <p>Tila: {stats.lastWithdrawal.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
