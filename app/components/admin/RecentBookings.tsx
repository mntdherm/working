import { useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";

interface RecentBookingsProps {
  bookings: Array<{
    id: string;
    vendor: { business_name: string };
    customer: { name: string; email: string };
    booking_services: Array<{ service: { name: string } }>;
    start_time: string;
    total_price: number;
    status: string;
  }>;
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const submit = useSubmit();
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setStatusFilter(newValue);
    submit({ status: newValue }, { replace: true });
  };

  return (
    <div>
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">Kaikki tilat</option>
          <option value="pending">Odottaa</option>
          <option value="confirmed">Vahvistettu</option>
          <option value="completed">Valmis</option>
          <option value="cancelled">Peruttu</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Varaus ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Palveluntarjoaja
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asiakas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Palvelut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aika
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hinta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tila
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.vendor.business_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.customer.name}</div>
                  <div className="text-sm text-gray-500">{booking.customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.booking_services.map(bs => bs.service.name).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(booking.start_time), 'd.M.yyyy HH:mm', { locale: fi })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(booking.total_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {booking.status === 'confirmed' ? 'Vahvistettu' :
                     booking.status === 'pending' ? 'Odottaa' :
                     booking.status === 'cancelled' ? 'Peruttu' :
                     booking.status === 'completed' ? 'Valmis' : booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
