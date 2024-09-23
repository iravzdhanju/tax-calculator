export type TaxBracket= {
    min: number;
    max?: number;
    rate: number;
  }
  
  export type TaxResult ={
    totalTax: string;
    effectiveRate: string;
    taxPerBand: {
      min: number;
      max: number | string;
      rate: number;
      taxAmount: number;
    }[];
  }
  