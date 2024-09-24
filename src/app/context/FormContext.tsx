import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaxBracket, TaxResult } from "@/app/utils/types";
import { toast } from "react-toastify";
import { calculateFederalTax, getMarginalRate } from "../utils";

interface TaxContextType {
  income: string;
  setIncome: (income: string) => void;
  taxYear: string;
  setTaxYear: (year: string) => void;
  result: TaxResult | null;
  error: string | null;
  loading: boolean;
  calculateTax: () => Promise<void>;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2022");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateTax = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    toast.info("Calculating tax...");

    try {
      const response = await fetch(`/api/calculate-tax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ income, taxYear }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tax brackets");
      }

      const data = await response.json();
      const taxBrackets: TaxBracket[] = data.taxBrackets;

      const incomeNumber = Number(income);
      const totalFedralTax = calculateFederalTax(incomeNumber, taxBrackets);

      const marginalRate = getMarginalRate(incomeNumber, taxBrackets);
      const effectiveRate = (totalFedralTax / incomeNumber) * 100;

      const result: TaxResult = {
        totalFedralTax: totalFedralTax.toFixed(2),
        effectiveRate: effectiveRate.toFixed(2),
        marginalRate: marginalRate,
        taxPerBand: taxBrackets.map((bracket) => ({
          min: bracket.min,
          max: bracket.max,
          rate: bracket.rate,
          taxAmount: (Math.min(incomeNumber, bracket.max) - bracket.min) * bracket.rate,
        })),
      };

      setResult(result);
      toast.success("Tax calculation completed");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaxContext.Provider
      value={{
        income,
        setIncome,
        taxYear,
        setTaxYear,
        result,
        error,
        loading,
        calculateTax,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error("useTax must be used within a TaxProvider");
  }
  return context;
};
