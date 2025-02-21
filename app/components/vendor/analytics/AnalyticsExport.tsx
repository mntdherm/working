import { useState } from 'react';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';

interface AnalyticsExportProps {
  data: {
    bookings: any[];
    services: any[];
  };
}

export function AnalyticsExport({ data }: AnalyticsExportProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const generateCSV = () => {
    const headers = [
      'Varaus ID',
      'Asiakas',
      'Palvelut',
      'Päivämäärä',
      'Aika',
      'Hinta',
      'Tila'
    ].join(',');

    const rows = data.bookings.map(booking => [
      booking.id,
      booking.customer.name,
      booking.booking_services.map((s: any) => s.name).join('; '),
      format(new Date(booking.start_time), 'd.M.yyyy', { locale: fi }),
      format(new Date(booking.start_time), 'HH:mm', { locale: fi }),
      booking.total_price.toFixed(2),
      booking.status
    ].join(','));

    return [headers, ...rows].join('\n');
  };

  const generateJSON = () => {
    return JSON.stringify(data.bookings, null, 2);
  };

  const downloadFile = () => {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
    const content = exportFormat === 'csv' ? generateCSV() : generateJSON();
    const type = exportFormat === 'csv' ? 'text/csv' : 'application/json';
    const extension = exportFormat === 'csv' ? 'csv' : 'json';
    const filename = `analytics-${timestamp}.${extension}`;

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center space-x-4">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
      </select>
      
      <button
        onClick={downloadFile}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Lataa raportti
      </button>
    </div>
  );
}
