import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { BankAccount } from "~/types/wallet";

interface WithdrawalFormProps {
  walletId: string;
  currentBalance: number;
}

export function WithdrawalForm({ walletId, currentBalance }: WithdrawalFormProps) {
  const fetcher = useFetcher();
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    accountHolder: "",
    iban: "",
    bic: "",
    bankName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      {
        walletId,
        amount,
        bankAccount: JSON.stringify(bankAccount),
      },
      { method: "post", action: "/api/withdrawals" }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Nosta varoja</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Summa (EUR)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="amount"
                name="amount"
                min="50"
                max={currentBalance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Minimisumma: 50 EUR. Käytettävissä: {currentBalance} EUR
            </p>
          </div>

          <div>
            <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700">
              Tilinomistaja
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="accountHolder"
                value={bankAccount.accountHolder}
                onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="iban" className="block text-sm font-medium text-gray-700">
              IBAN
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="iban"
                value={bankAccount.iban}
                onChange={(e) => setBankAccount({ ...bankAccount, iban: e.target.value })}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bic" className="block text-sm font-medium text-gray-700">
                BIC/SWIFT
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="bic"
                  value={bankAccount.bic}
                  onChange={(e) => setBankAccount({ ...bankAccount, bic: e.target.value })}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                Pankin nimi
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="bankName"
                  value={bankAccount.bankName}
                  onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={fetcher.state === "submitting"}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {fetcher.state === "submitting" ? "Käsitellään..." : "Tee nosto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
