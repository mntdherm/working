import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { useFetcher } from '@remix-run/react';
import type { Appointment } from '~/types/calendar';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

export function AppointmentDetails({ appointment, onClose }: AppointmentDetailsProps) {
  const fetcher = useFetcher();

  const handleStatusUpdate = (status: string) => {
    fetcher.submit(
      { status, appointmentId: appointment.id },
      { method: 'post', action: '/api/appointments/update-status' }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Varauksen tiedot</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Sulje</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Asiakas</h4>
          <p className="mt-1">{appointment.customer.name}</p>
          <p className="text-sm text-gray-500">{appointment.customer.email}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Aika</h4>
          <p className="mt-1">
            {format(new Date(appointment.start_time), 'EEEE d.M.yyyy', { locale: fi })}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(appointment.start_time), 'HH:mm')} - 
            {format(new Date(appointment.end_time), 'HH:mm')}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Palvelut</h4>
          <ul className="mt-1 space-y-1">
            {appointment.booking_services.map((service) => (
              <li key={service.id} className="text-sm">
                {service.name} - {service.price.toFixed(2)} €
              </li>
            ))}
          </ul>
          <p className="mt-2 font-medium">
            Yhteensä: {appointment.total_price.toFixed(2)} €
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Tila</h4>
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              onClick={() => handleStatusUpdate('confirmed')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                appointment.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vahvista
            </button>
            <button
              type="button"
              onClick={() => handleStatusUpdate('cancelled')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                appointment.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Peruuta
            </button>
          </div>
        </div>

        {appointment.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Lisätiedot</h4>
            <p className="mt-1 text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
