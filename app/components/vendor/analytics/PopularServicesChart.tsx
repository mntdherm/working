import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PopularServicesChartProps {
  data: Record<string, number>;
  services: Array<{ id: string; name: string; }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function PopularServicesChart({ data, services }: PopularServicesChartProps) {
  const chartData = Object.entries(data).map(([serviceId, count]) => ({
    name: services.find(s => s.id === serviceId)?.name || 'Tuntematon',
    value: count
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} varausta`, 'Varaukset']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
