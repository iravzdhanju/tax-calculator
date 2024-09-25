import React, { memo, useMemo } from "react";
import { useTax } from "@/app/context/FormContext";

const skeletonItems = [1, 2, 3, 4];
const TaxResultsPreview: React.FC = memo(() => {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading tax results">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      {skeletonItems.map((item) => (
        <div key={`skeleton-item-${item}`} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
});

const TaxResultItem: React.FC<{ label: string; value: string }> = memo(({ label, value }) => (
  <p className="text-lg">
    {label}: <span className="font-semibold">{value}</span>
  </p>
));

const formatCurrency = (amount: string): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));

const formatPercentage = (rate: string): string =>
  new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2 }).format(Number(rate) / 100);

const TaxResults: React.FC = () => {
  const { result, isLoading } = useTax();

  const taxItems = useMemo(() => {
    if (!result) return [];
    return [
      ["Total Federal Tax", formatCurrency(result.totalFedralTax)],
      ["Marginal Tax Rate", formatPercentage(result.marginalRate)],
      ["Effective Tax Rate", formatPercentage(result.effectiveRate)],
      ["Income After Tax", formatCurrency(result.totalIncomeAfterTax)],
    ] as const;
  }, [result]);

  if (isLoading) return <TaxResultsPreview />;
  if (!result) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Results:</h2>
      {taxItems.map(([label, value], index) => (
        <TaxResultItem key={`tax-result-${index}`} label={label} value={value} />
      ))}
    </div>
  );
};

export default memo(TaxResults);
