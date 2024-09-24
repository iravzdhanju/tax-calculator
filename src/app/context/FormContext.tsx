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
  loading: boolean;
  calculateTax: () => Promise<void>;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2022");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateTax = async () => {
    setResult(null);
    setLoading(true);
    const toastId = toast.loading("Calculating tax...");

    try {
      const payloadTax = await fetch(`/api/calculate-tax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ income, taxYear }),
      });

      const data = await payloadTax.json();

      if (!payloadTax.ok) {
        let errorMessage = "Failed to fetch tax brackets";

        if (data.error) {
          try {
            if (data.error.includes("Database not found!")) {
              errorMessage = "Unable to calculate tax. The tax database is currently unavailable. Please try again later.";
            } else {
              errorMessage = data.error;
            }
          } catch {
            errorMessage = data.error;
          }
        }
        throw new Error(errorMessage);
      }

      const taxBrackets: TaxBracket[] = data.taxBrackets;

      const incomeNumber = Number(income);
      const totalFedralTax = calculateFederalTax(incomeNumber, taxBrackets);

      const marginalRate = getMarginalRate(incomeNumber, taxBrackets);
      const effectiveRate = (totalFedralTax / incomeNumber) * 100;

      const result: TaxResult = {
        totalFedralTax: totalFedralTax.toFixed(2),
        effectiveRate: effectiveRate.toFixed(2),
        marginalRate: marginalRate,
        totalIncomeAfterTax: (parseInt(income) - totalFedralTax).toFixed(2),
        taxPerBand: taxBrackets.map((bracket) => ({
          min: bracket.min,
          max: bracket.max,
          rate: bracket.rate,
          taxAmount: (Math.min(incomeNumber, bracket.max) - bracket.min) * bracket.rate,
        })),
      };

      setResult(result);
      toast.update(toastId, { render: "Tax calculation completed", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.update(toastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 5000 });
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
