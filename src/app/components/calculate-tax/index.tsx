"use client";

import { TaxResult } from "@/app/utils/types";
import { useState, FormEvent } from "react";

export default function CalculateTax() {
  const [income, setIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2023");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const taxBrackets2023 = [
    { min: 0, max: 53359, rate: 0.15 },
    { min: 53359, max: 106717, rate: 0.205 },
    { min: 106717, max: 165430, rate: 0.26 },
    { min: 165430, max: 235675, rate: 0.29 },
    { min: 235675, max: Infinity, rate: 0.33 },
  ];

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate tax");
      }

      setResult(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getMarginalRate = (income: number): string => {
    for (const bracket of taxBrackets2023) {
      if (income <= bracket.max) {
        return (bracket.rate * 100).toFixed(2) + "%";
      }
    }
    return "33%"; // Default to highest rate if income exceeds all brackets
  };

  const calculateFederalTax = (income: number): number => {
    let remainingIncome = income;
    let totalTax = 0;

    for (const bracket of taxBrackets2023) {
      if (remainingIncome <= 0) break;

      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      totalTax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
    }

    return totalTax;
  };

  const calculateIncomeAfterTax = (income: number): number => {
    const federalTax = calculateFederalTax(income);
    return income - federalTax;
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
            <option value="2023">2023</option>
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

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          {error.includes("Database not found") && (
            <p className="mt-2">
              It seems there&apos;s an issue with our database. Please try again later or contact support if the problem persists.
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Results:</h2>
          <p className="text-lg">
            Total Federal Tax: <span className="font-semibold">${calculateFederalTax(parseFloat(income)).toFixed(2)}</span>
          </p>
          <p className="text-lg">
            Marginal Tax Rate: <span className="font-semibold">{getMarginalRate(parseFloat(income))}</span>
          </p>
          <p className="text-lg">
            Effective Tax Rate: <span className="font-semibold">{result.effectiveRate}%</span>
          </p>
          <p className="text-lg">
            Income After Tax: <span className="font-semibold">${calculateIncomeAfterTax(parseFloat(income)).toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
