export type TaxBracket = {
  min: number;
  max: number;
  rate: number;
}

export type TaxResult = {
  totalTax: string;
  effectiveRate: string;
  taxPerBand: {
    min: number;
    max: number;
    rate: number;
    taxAmount: number;
  }[];
}
