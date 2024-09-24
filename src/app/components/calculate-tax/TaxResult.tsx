import { useTax } from "@/app/context/FormContext";
import React from "react";

export const TaxResults: React.FC = () => {
  const { result, income } = useTax();

  if (!result) return null;

  const incomeNumber = parseFloat(income);
  const federalTax = parseInt(result.totalFedralTax);
  const marginalRate = result.marginalRate;
  const incomeAfterTax = incomeNumber - federalTax;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Results:</h2>
      <p className="text-lg">
        Total Federal Tax: <span className="font-semibold">${federalTax.toFixed(2)}</span>
      </p>
      <p className="text-lg">
        Marginal Tax Rate: <span className="font-semibold">{marginalRate}</span>
      </p>
      <p className="text-lg">
        Effective Tax Rate: <span className="font-semibold">{result.effectiveRate}%</span>
      </p>
      <p className="text-lg">
        Income After Tax: <span className="font-semibold">${incomeAfterTax.toFixed(2)}</span>
      </p>
    </div>
  );
};
