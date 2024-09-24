"use client";
import { TaxForm } from "./TaxForm";
import { TaxResults } from "./TaxResult";

export default function CalculateTax() {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h1 className="text-2xl">Tax Calculator</h1>
      <div className="max-w-2xl w-full p-4 bg-white shadow-md rounded-lg">
        <TaxForm />
        <TaxResults />
      </div>
    </div>
  );
}
