import { formatCurrency, formatPercentage } from "@/common/lib/number";
import { FiatCurrency } from "@/common/models/fiat-currency.model";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const ResultCard = ({
  result = 0,
  percentageResult = 0,
  currency = FiatCurrency.USD,
}: {
  result?: number;
  percentageResult?: number;
  currency?: FiatCurrency;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-[#131620] border-[#1e2030] text-white">
      <CardContent className="px-6 h-full flex flex-col">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-400">
            {t("cards.result.title", { ns: "portfolio" })}
          </div>
          <div className="text-3xl font-bold">
            {formatPercentage(percentageResult * 100, 2)}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm mt-4">
          <div className="flex items-center">
            {result >= 0 ? (
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className="text-gray-400">
              {formatCurrency(result, currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
