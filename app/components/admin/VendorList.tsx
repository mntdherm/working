import { useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";

interface VendorListProps {
  vendors: Array<{
    id: string;
    business_name: string;
    email: string;
    phone: string;
    created_at: string;
    bookings: { count: number }[];
    services: { count: number }[];
  }>;
}

export function VendorList({ vendors }: VendorListProps) {
  const submit = useSubmit();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    submit({ vendor: newValue }, { replace: true });
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Etsi palveluntarjoajaa..."
          value={searchTerm}
          onChange={handleSearch}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yritys
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yhteystiedot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liittynyt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Varaukset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Palvelut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Toiminnot
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vendor.business_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vendor.email}</div>
                  <div className="text-sm text-gray-500">{vendor.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(vendor.created_at), 'd.M.yyyy', { locale: fi })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vendor.bookings[0]?.count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vendor.services[0]?.count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/vendors/${vendor.id}`} className="text-blue-600 hover:text-blue-900">
                    Muokkaa
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
