import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { PaymentMethod } from "~/types/payment";

interface PaymentProcessorProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function PaymentProcessor({
  bookingId,
  amount,
  onSuccess,
  onError,
}: PaymentProcessorProps) {
  const fetcher = useFetcher();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");

  const handleSubmit = async () => {
    fetcher.submit(
      {
        bookingId,
        amount: amount.toString(),
        paymentMethod: selectedMethod,
      },
      { method: "post", action: "/api/payments" }
    );
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Maksutapa
        </h3>
        
        <div className="mt-5">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="card"
                name="payment-method"
                type="radio"
                checked={selectedMethod === "card"}
                onChange={() => setSelectedMethod("card")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="card" className="ml-3">
                <span className="block text-sm font-medium text-gray-700">
                  Maksukortti
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="mobilepay"
                name="payment-method"
                type="radio"
                checked={selectedMethod === "mobilepay"}
                onChange={() => setSelectedMethod("mobilepay")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="mobilepay" className="ml-3">
                <span className="block text-sm font-medium text-gray-700">
                  MobilePay
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="invoice"
                name="payment-method"
                type="radio"
                checked={selectedMethod === "invoice"}
                onChange={() => setSelectedMethod("invoice")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="invoice" className="ml-3">
                <span className="block text-sm font-medium text-gray-700">
                  Lasku
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-gray-700">
                    Maksettava summa:{" "}
                    <span className="font-semibold">
                      {new Intl.NumberFormat("fi-FI", {
                        style: "currency",
                        currency: "EUR",
                      }).format(amount)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={fetcher.state === "submitting"}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {fetcher.state === "submitting" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Käsitellään...
                </>
              ) : (
                "Maksa"
              )}
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 text-center">
              Maksut käsittelee turvallisesti Stripe. Kaikki maksutiedot ovat
              salattuja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
