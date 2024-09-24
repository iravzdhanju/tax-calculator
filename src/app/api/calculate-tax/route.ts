import { TaxBracket } from "@/app/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { taxYear } = await request.json();
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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}