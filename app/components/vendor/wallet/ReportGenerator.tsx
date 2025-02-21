import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import type { EarningsReport } from "~/types/wallet";

interface ReportGeneratorProps {
  walletId: string;
}

export function ReportGenerator({ walletId }: ReportGeneratorProps) {
  const fetcher = useFetcher<{ report: EarningsReport }>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateReport = () => {
    if (!startDate || !endDate) return;

    fetcher.load(
      `/api/wallet/report?walletId=${walletId}&startDate=${startDate}&endDate=${endDate}`
    );
  };

  const downloadReport = () => {
    if (!fetcher.data?.report) return;

    const report = fetcher.data.report;
    const reportData = {
      ...report,
      period: {
        start: startDate,
        end: endDate,
      },
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Luo raportti</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Alkupäivä
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Loppupäivä
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={!startDate || !endDate || fetcher.state === "loading"}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {fetcher.state === "loading" ? "Luodaan..." : "Luo raportti"}
            </button>

            {fetcher.data?.report && (
              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Lataa raportti
              </button>
            )}
          </div>

          {fetcher.data?.report && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Raportin yhteenveto</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Kokonaistulot</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("fi-FI", {
                      style: "currency",
                      currency: "EUR",
                    }).format(fetcher.data.report.earnings)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Nettotulot</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("fi-FI", {
                      style: "currency",
                      currency: "EUR",
                    }).format(fetcher.data.report.netEarnings)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Komissiot</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("fi-FI", {
                      style: "currency",
                      currency: "EUR",
                    }).format(fetcher.data.report.commissions)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Tapahtumia</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {fetcher.data.report.transactionCount}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
