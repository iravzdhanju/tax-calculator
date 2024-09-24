// app/api/tax-brackets/route.ts
import { TaxBracket } from "@/app/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const taxYear = request.nextUrl.searchParams.get('taxYear');

  if (!taxYear) {
    return NextResponse.json({ error: "Tax year is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tax-calculator/tax-year/${taxYear}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch tax brackets:", JSON.stringify(errorData));
      return NextResponse.json({ error: `Failed to fetch tax brackets: ${JSON.stringify(errorData)}` }, { status: response.status });
    }

    const data = await response.json();
    const taxBrackets: TaxBracket[] = data.tax_brackets;

    return NextResponse.json({ taxBrackets });
  } catch (error: unknown) {
    console.error("Error fetching tax brackets:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}