"use client";

import { TaxResult } from "@/app/utils/types";
import { useState, FormEvent } from "react";

export default function CalculateTax() {
  const [income, setIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2022");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateTax = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/calculate-tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ income, taxYear }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate tax");
      }

      const data: TaxResult = await response.json();
      setResult(data);
    } catch (error) {
      setError(`An error occurred. Please try again.${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={calculateTax} className="mb-6 space-y-4">
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
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
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

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {result && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Results:</h2>
          <p className="text-lg">
            Total Tax: <span className="font-semibold">${result.totalTax}</span>
          </p>
          <p className="text-lg">
            Effective Tax Rate: <span className="font-semibold">{result.effectiveRate}%</span>
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6">Tax per Band:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.taxPerBand.map((band, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${band.min.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {band.max === "No limit" ? band.max : `$${band.max.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(band.rate * 100).toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${band.taxAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
