interface PaymentSectionProps {
  amount: number;
  onPaymentComplete: () => void;
}

export default function PaymentSection({ amount, onPaymentComplete }: PaymentSectionProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Maksu
        </h3>
        
        <div className="mt-5">
          <p className="text-sm text-gray-500">
            Maksettava summa: <span className="font-semibold">{amount.toFixed(2)} €</span>
          </p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={onPaymentComplete}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Maksa kortilla
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              MobilePay
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 text-center">
              Maksut käsittelee turvallisesti Stripe. Kaikki maksutiedot ovat salattuja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
