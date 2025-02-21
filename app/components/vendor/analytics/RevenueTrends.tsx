import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';

interface RevenueTrendsProps {
  data: Record<string, number>;
}

export function RevenueTrends({ data }: RevenueTrendsProps) {
  const chartData = Object.entries(data)
    .map(([date, amount]) => ({
      date,
      amount
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), 'd.M', { locale: fi })}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} €`, 'Tulot']}
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
  );
}
