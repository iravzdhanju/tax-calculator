import { TaxBracket } from "@/app/utils/types";

export const calculateFederalTax = (income: number, taxBrackets: TaxBracket[]): number => {
  let remainingIncome = income;
  let totalTax = 0;

  for (const bracket of taxBrackets) {
    if (remainingIncome <= 0) break;

    const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    totalTax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }

  return totalTax;
};

export const getMarginalRate = (income: number, taxBrackets: TaxBracket[]): string => {
  for (const bracket of taxBrackets) {
    if (income <= bracket.max) {
      return (bracket.rate * 100).toFixed(2) + "%";
    }
  }
  return (taxBrackets[taxBrackets.length - 1].rate * 100).toFixed(2) + "%";
};
