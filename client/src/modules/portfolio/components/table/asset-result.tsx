import { formatCurrency, formatPercentage } from "@/common/lib/number";
import { FiatCurrency } from "@/common/models/fiat-currency.model";
import { ArrowDown, ArrowUp } from "lucide-react";

const AssetResult = ({
  performance,
  result,
  currency = FiatCurrency.ARS,
}: {
  performance?: number;
  result?: number;
  currency?: FiatCurrency;
}) => {
  if (!performance || !result) {
    return (
      <div className={`flex flex-col text-gray-500 `}>
        <div className="flex items-center justify-end gap-1">
          {formatPercentage(0)}
        </div>
        <div className="text-xs text-right">-</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${
        performance > 0 ? "text-green-500" : "text-red-500"
      }`}
    >
      <div className="flex items-center justify-end gap-1">
        {performance > 0 && <ArrowUp className="h-4 w-4" />}
        {performance < 0 && <ArrowDown className="h-4 w-4" />}
        {formatPercentage(performance)}
      </div>
      <div className="text-xs text-right">
        {formatCurrency(result, currency)}
      </div>
    </div>
  );
};

export default AssetResult;
