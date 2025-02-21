import { Form } from '@remix-run/react';

interface CustomerDetailsFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function CustomerDetailsForm({ onSubmit, defaultValues }: CustomerDetailsFormProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Asiakastiedot
        </h3>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Etunimi
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              defaultValue={defaultValues?.firstName}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Sukunimi
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              defaultValue={defaultValues?.lastName}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Sähköposti
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={defaultValues?.email}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Puhelinnumero
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={defaultValues?.phone}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
