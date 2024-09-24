import { useTax } from "@/app/context/FormContext";
import React from "react";

export const TaxResults: React.FC = () => {
  const { result, isLoading } = useTax();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!result) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Results:</h2>
      <p className="text-lg">
        Total Federal Tax: <span className="font-semibold">${result.totalFedralTax}</span>
      </p>
      <p className="text-lg">
        Marginal Tax Rate: <span className="font-semibold">{result.marginalRate}%</span>
      </p>
      <p className="text-lg">
        Effective Tax Rate: <span className="font-semibold">{result.effectiveRate}%</span>
      </p>
      <p className="text-lg">
        Income After Tax: <span className="font-semibold">${result.totalIncomeAfterTax}</span>
      </p>
    </div>
  );
};
