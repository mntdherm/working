import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { WalletTransaction } from "~/types/wallet";

interface TransactionHistoryProps {
  walletId: string;
}

export function TransactionHistory({ walletId }: TransactionHistoryProps) {
  const [page, setPage] = useState(1);
  const fetcher = useFetcher<{ transactions: WalletTransaction[] }>();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      earning: "Tulo",
      withdrawal: "Nosto",
      commission: "Komissio",
      refund: "Palautus",
      adjustment: "Korjaus",
    };
    return types[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tapahtumahistoria</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Päivämäärä
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tyyppi
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kuvaus
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summa
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fetcher.data?.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.createdAt).toLocaleDateString("fi-FI")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTransactionTypeLabel(transaction.type)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(transaction.balanceAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Edellinen
          </button>
          <span className="text-sm text-gray-700">Sivu {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={fetcher.data?.transactions.length < 20}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Seuraava
          </button>
        </div>
      </div>
    </div>
  );
}
