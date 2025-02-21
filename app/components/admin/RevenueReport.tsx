import { useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';

interface RevenueReportProps {
  bookings: Array<{
    created_at: string;
    total_price: number;
  }>;
  timeRange: string;
}

export function RevenueReport({ bookings, timeRange }: RevenueReportProps) {
  const submit = useSubmit();

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    submit({ timeRange: newValue }, { replace: true });
  };

  // Group bookings by date and calculate daily revenue
  const revenueData = bookings.reduce((acc: Record<string, number>, booking) => {
    const date = booking.created_at.split('T')[0];
    acc[date] = (acc[date] || 0) + booking.total_price;
    return acc;
  }, {});

  const chartData = Object.entries(revenueData).map(([date, amount]) => ({
    date,
    amount
  })).sort((a, b) => a.date.localeCompare(b.date));

  const totalRevenue = chartData.reduce((sum, day) => sum + day.amount, 0);
  const averageRevenue = totalRevenue / chartData.length || 0;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <select
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
        >
          <option value="week">Viikko</option>
          <option value="month">Kuukausi</option>
          <option value="year">Vuosi</option>
        </select>

        <div className="flex space-x-4">
          <div className="text-sm">
            <span className="text-gray-500">Yhteensä: </span>
            <span className="font-medium">
              {new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(totalRevenue)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Keskiarvo/päivä: </span>
            <span className="font-medium">
              {new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(averageRevenue)}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            const csv = [
              ['Päivämäärä', 'Tulot'].join(','),
              ...chartData.map(day => [
                format(parseISO(day.date), 'd.M.yyyy', { locale: fi }),
                day.amount.toFixed(2)
              ].join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `revenue-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lataa CSV
        </button>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'd.M', { locale: fi })}
            />
            <YAxis
              tickFormatter={(value) => new Intl.NumberFormat('fi-FI', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)}
            />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(value),
                'Tulot'
              ]}
              labelFormatter={(label) => format(parseISO(label), 'd.M.yyyy', { locale: fi })}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
