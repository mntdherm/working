import type { OperatingHours as Hours } from "~/types/vendor";

interface OperatingHoursProps {
  hours: Hours[];
}

export default function OperatingHours({ hours }: OperatingHoursProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Aukioloajat</h2>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {hours.map((hour) => (
            <li key={hour.day} className="px-6 py-3">
              <div className="flex justify-between">
                <span className="text-gray-900">{hour.day}</span>
                <span className="text-gray-600">
                  {hour.isClosed ? "Suljettu" : `${hour.open} - ${hour.close}`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
