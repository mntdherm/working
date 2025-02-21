interface RetentionMetricsProps {
  data: {
    totalCustomers: number;
    returningCustomers: number;
    averageVisits: number;
  };
}

export function RetentionMetrics({ data }: RetentionMetricsProps) {
  const retentionRate = (data.returningCustomers / data.totalCustomers) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-blue-50 p-4 rounded-lg">
          <dt className="text-sm font-medium text-blue-600 truncate">
            Asiakkaita yhteensä
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-blue-900">
            {data.totalCustomers}
          </dd>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <dt className="text-sm font-medium text-green-600 truncate">
            Palaavat asiakkaat
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-green-900">
            {data.returningCustomers}
          </dd>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <dt className="text-sm font-medium text-purple-600 truncate">
            Käyntejä keskimäärin
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-purple-900">
            {data.averageVisits.toFixed(1)}
          </dd>
        </div>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Asiakaspysyvyys
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {retentionRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${retentionRate}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
