import { TaxBracket, TaxResult } from "@/app/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  try {
    const { income, taxYear } = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tax-calculator/tax-year/${taxYear}`);

    if (!response.ok) {
      throw new Error("Failed to fetch tax brackets");
    }

    const data = await response.json();
    const taxBrackets: TaxBracket[] = data.tax_brackets;

    let totalTax = 0;
    let remainingIncome = Number(income);
    const taxPerBand = [];

    for (let i = 0; i < taxBrackets.length; i++) {
      const bracket = taxBrackets[i];
      const nextBracket = taxBrackets[i + 1];

      const taxableAmount = nextBracket ? Math.min(remainingIncome, nextBracket.min - bracket.min) : remainingIncome;

      const taxForBracket = taxableAmount * bracket.rate;
      totalTax += taxForBracket;
      remainingIncome -= taxableAmount;

      taxPerBand.push({
        min: bracket.min,
        max: bracket.max || "No limit",
        rate: bracket.rate,
        taxAmount: taxForBracket,
      });

      if (remainingIncome <= 0) break;
    }

    const effectiveRate = (totalTax / Number(income)) * 100;

    const result: TaxResult = {
      totalTax: totalTax.toFixed(2),
      effectiveRate: effectiveRate.toFixed(2),
      taxPerBand,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {

    console.error("Error in tax calculation:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}
