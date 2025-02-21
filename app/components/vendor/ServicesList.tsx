import type { Service } from "~/types/vendor";

interface ServicesListProps {
  services: Service[];
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Palvelut</h2>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {services.map((service) => (
            <li key={service.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {service.description}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Kesto: {service.duration} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {service.price.toFixed(2)} €
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
