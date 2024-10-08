export type TaxBracket = {
  min: number;
  max: number;
  rate: number;
}

export type TaxResult = {
  totalFedralTax: string;
  effectiveRate: string;
  marginalRate: string;
  totalIncomeAfterTax: string;
  taxPerBand: {
    min: number;
    max: number;
    rate: number;
    taxAmount: number;
  }[];
}
