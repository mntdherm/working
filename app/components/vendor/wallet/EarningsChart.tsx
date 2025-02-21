import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { EarningsReport } from "~/types/wallet";

interface EarningsChartProps {
  report: EarningsReport;
}

export function EarningsChart({ report }: EarningsChartProps) {
  const data = [
    {
      name: "Tulot",
      amount: report.earnings,
    },
    {
      name: "Komissiot",
      amount: report.commissions,
    },
    {
      name: "Nostot",
      amount: report.withdrawals,
    },
    {
      name: "Nettotulot",
      amount: report.netEarnings,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Kuukauden yhteenveto</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => 
                  new Intl.NumberFormat("fi-FI", {
                    style: "currency",
                    currency: "EUR",
                  }).format(value)
                }
              />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Tapahtumia yhteensä</p>
            <p className="font-medium">{report.transactionCount}</p>
          </div>
          <div>
            <p className="text-gray-500">Keskimääräinen tapahtuma</p>
            <p className="font-medium">
              {new Intl.NumberFormat("fi-FI", {
                style: "currency",
                currency: "EUR",
              }).format(report.averageTransactionValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
