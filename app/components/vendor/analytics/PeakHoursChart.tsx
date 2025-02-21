import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeakHoursChartProps {
  data: Record<number, number>;
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const chartData = Object.entries(data).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`${value} varausta`, 'Varaukset']}
            labelFormatter={(label) => `Kello ${label}`}
          />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
