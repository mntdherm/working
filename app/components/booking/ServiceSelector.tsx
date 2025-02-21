import type { Service } from "~/types/vendor";

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: string[];
  onServiceSelect: (serviceIds: string[]) => void;
}

export default function ServiceSelector({
  services,
  selectedServices,
  onServiceSelect,
}: ServiceSelectorProps) {
  const handleServiceToggle = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    onServiceSelect(newSelection);
  };

  const totalDuration = services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.duration, 0);

  const totalPrice = services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Valitse palvelut</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {services.map((service) => (
          <div
            key={service.id}
            className="px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`service-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`service-${service.id}`}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {service.name}
                <span className="block text-sm text-gray-500">
                  {service.duration} min
                </span>
              </label>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {service.price.toFixed(2)} €
            </span>
          </div>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <div className="text-sm text-gray-700">
            Kokonaiskesto: {totalDuration} min
          </div>
          <div className="text-lg font-medium text-gray-900">
            Yhteensä: {totalPrice.toFixed(2)} €
          </div>
        </div>
      )}
    </div>
  );
}
