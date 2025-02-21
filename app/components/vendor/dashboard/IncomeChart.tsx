import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';

interface Booking {
  created_at: string;
  total_price: number;
}

interface IncomeChartProps {
  bookings: Booking[];
}

export function IncomeChart({ bookings }: IncomeChartProps) {
  // Process data for the chart
  const dailyData = bookings.reduce((acc: any[], booking) => {
    const date = format(parseISO(booking.created_at), 'dd.MM', { locale: fi });
    const existingDay = acc.find(d => d.date === date);
    
    if (existingDay) {
      existingDay.amount += booking.total_price;
    } else {
      acc.push({ date, amount: booking.total_price });
    }
    
    return acc;
  }, []);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={dailyData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)} €`, 'Tulot']}
            labelFormatter={(label) => `Päivä: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#3B82F6" 
            fill="#93C5FD" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
