import type { Service } from '~/types/vendor';

interface BookingSummaryProps {
  services: Service[];
  selectedServices: string[];
  selectedSlot?: { startTime: Date; endTime: Date };
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function BookingSummary({
  services,
  selectedServices,
  selectedSlot,
  customerDetails,
}: BookingSummaryProps) {
  const selectedServiceDetails = services.filter(service => 
    selectedServices.includes(service.id)
  );

  const totalPrice = selectedServiceDetails.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const totalDuration = selectedServiceDetails.reduce(
    (sum, service) => sum + service.duration,
    0
  );

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Varauksen yhteenveto
        </h3>

        <div className="mt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Valitut palvelut</dt>
              <dd className="mt-1">
                <ul className="list-disc pl-5">
                  {selectedServiceDetails.map(service => (
                    <li key={service.id} className="text-sm text-gray-900">
                      {service.name} - {service.price.toFixed(2)} €
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            {selectedSlot && (
              <div className="py-4">
                <dt className="text-sm font-medium text-gray-500">Ajankohta</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedSlot.startTime.toLocaleDateString('fi-FI', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  <br />
                  {selectedSlot.startTime.toLocaleTimeString('fi-FI', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {selectedSlot.endTime.toLocaleTimeString('fi-FI', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
            )}

            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Asiakas</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {customerDetails.firstName} {customerDetails.lastName}
                <br />
                {customerDetails.email}
                <br />
                {customerDetails.phone}
              </dd>
            </div>

            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Kesto yhteensä</dt>
              <dd className="mt-1 text-sm text-gray-900">{totalDuration} minuuttia</dd>
            </div>

            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Hinta yhteensä</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {totalPrice.toFixed(2)} €
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
