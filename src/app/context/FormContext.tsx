import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";
import { TaxBracket, TaxResult } from "@/app/utils/types";
import { toast } from "react-toastify";
import { calculateFederalTax, getMarginalRate } from "../utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TaxContextType {
  income: string;
  setIncome: (income: string) => void;
  taxYear: string;
  setTaxYear: (year: string) => void;
  result: TaxResult | null;
  isLoading: boolean;
  calculateTax: () => void;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

const fetchTaxBrackets = async (income: string, taxYear: string): Promise<TaxBracket[]> => {
  const response = await fetch(`/api/calculate-tax`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ income, taxYear }),
  });

  if (!response.ok) {
    const data = await response.json();
    let errorMessage = "Failed to fetch tax brackets";
    if (data.error) {
      if (data.error.includes("Database not found!")) {
        errorMessage = "Unable to calculate tax. The tax database is currently unavailable. Please try again later.";
      } else {
        errorMessage = data.error;
      }
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.taxBrackets;
};

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2022");
  const [result, setResult] = useState<TaxResult | null>(null);
  const queryClient = useQueryClient();

  const calculateTaxResult = useCallback(
    (brackets: TaxBracket[]): TaxResult => {
      const incomeNumber = Number(income);
      const totalFedralTax = calculateFederalTax(incomeNumber, brackets);
      const marginalRate = getMarginalRate(incomeNumber, brackets);
      const effectiveRate = (totalFedralTax / incomeNumber) * 100;

      return {
        totalFedralTax: totalFedralTax.toFixed(2),
        effectiveRate: effectiveRate.toFixed(2),
        marginalRate: marginalRate,
        totalIncomeAfterTax: (incomeNumber - totalFedralTax).toFixed(2),
        taxPerBand: brackets.map((bracket) => ({
          min: bracket.min,
          max: bracket.max,
          rate: bracket.rate,
          taxAmount: (Math.min(incomeNumber, bracket.max) - bracket.min) * bracket.rate,
        })),
      };
    },
    [income]
  );

  const { isLoading: isFetchingBrackets, refetch } = useQuery({
    queryKey: ["taxBrackets", income, taxYear],
    queryFn: () => fetchTaxBrackets(income, taxYear),
    enabled: false,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    onSuccess: (data: TaxBracket[]) => {
      const calculatedResult = calculateTaxResult(data);
      setResult(calculatedResult);
      toast.success("Tax calculation completed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to fetch tax brackets");
    },
  });

  const calculateTax = useCallback(() => {
    const cachedData = queryClient.getQueryData<TaxBracket[]>(["taxBrackets", income, taxYear]);
    if (cachedData) {
      const calculatedResult = calculateTaxResult(cachedData);
      setResult(calculatedResult);
      toast.success("Tax calculation completed (from cache)");
    } else {
      refetch().then((response) => {
        if (response.data) {
          const calculatedResult = calculateTaxResult(response.data);
          setResult(calculatedResult);
          toast.success("Tax calculation completed");
        }
      });
    }
  }, [income, taxYear, queryClient, calculateTaxResult, refetch]);

  useEffect(() => {
    console.log("resultss", result);
  }, [result]);
  return (
    <TaxContext.Provider
      value={{
        income,
        setIncome,
        taxYear,
        setTaxYear,
        result,
        isLoading: isFetchingBrackets,
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
