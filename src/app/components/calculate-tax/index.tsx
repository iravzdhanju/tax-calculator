"use client";
import { TaxForm } from "./TaxForm";
import { TaxResults } from "./TaxResult";

export default function CalculateTax() {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <TaxForm />
      <TaxResults />
    </div>
  );
}
