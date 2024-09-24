import { useTax } from "@/app/context/FormContext";
import React from "react";

export const TaxForm: React.FC = () => {
  const { income, setIncome, taxYear, setTaxYear, loading, calculateTax } = useTax();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("e", e);
    e.preventDefault();

    calculateTax();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
          Annual Income:
        </label>
        <input
          type="number"
          id="income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="taxYear" className="block text-sm font-medium text-gray-700 mb-1">
          Tax Year:
        </label>
        <select
          id="taxYear"
          value={taxYear}
          onChange={(e) => setTaxYear(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        }`}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate Tax"}
      </button>
    </form>
  );
};
