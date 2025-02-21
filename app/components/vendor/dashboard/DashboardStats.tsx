import { CurrencyEuroIcon, CalendarIcon, StarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  stats: {
    totalIncome: number;
    totalBookings: number;
    averageBookingValue: number;
    pendingReviewsCount: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statsItems = [
    {
      name: 'Kuukauden tulot',
      value: `${stats.totalIncome.toFixed(2)} €`,
      icon: CurrencyEuroIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Varaukset',
      value: stats.totalBookings,
      icon: CalendarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Keskiarvo/varaus',
      value: `${stats.averageBookingValue.toFixed(2)} €`,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Odottavat arvostelut',
      value: stats.pendingReviewsCount,
      icon: StarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsItems.map((item) => (
        <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{item.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
