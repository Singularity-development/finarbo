import { DATE_TIME_LOCALIZED } from "@/common/constants/date";
import { formatCurrency, formatPercentage } from "@/common/lib/number";
import { FiatCurrency } from "@/common/models/fiat-currency.model";
import { Price } from "@/common/models/price.model";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import {
  Clock,
  Bitcoin,
  BarChart4,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PortfolioCard = ({
  total = 0,
  cryptos,
  stocks,
  currency = FiatCurrency.USD,
  result = 0,
  percentageResult = 0,
  date,
}: {
  total?: number;
  cryptos?: Price;
  stocks?: Price;
  currency?: FiatCurrency;
  result?: number;
  percentageResult?: number;
  date?: Date;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="text-white">
      <CardContent className="px-6">
        <div className="flex flex-col gap-2">
          <header className="text-sm font-medium text-gray-400">
            {t("cards.portfolio.title", { ns: "portfolio" })}
          </header>

          <section className="flex justify-between items-start">
            <h3 className="text-3xl font-bold">
              {formatCurrency(total, currency)}
            </h3>
            <div className="flex flex-col items-end">
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">
                  {formatPercentage(percentageResult * 100, 2)}
                </h3>
              </div>
            </div>
          </section>

          <section className="flex justify-between items-start">
            <div className="mt-2 flex items-center gap-4 text-sm">
              {cryptos && (
                <p className="flex items-center">
                  <Bitcoin className="mr-1 h-4 w-4 text-yellow-500" />
                  <span className="text-gray-400">
                    {formatCurrency(cryptos.value, cryptos.currency)}
                  </span>
                </p>
              )}
              {stocks && (
                <p className="flex items-center">
                  <BarChart4 className="mr-1 h-4 w-4 text-blue-500" />
                  <span className="text-gray-400">
                    {formatCurrency(stocks.value, stocks.currency)}
                  </span>
                </p>
              )}
            </div>
            <div className="mt-2 flex flex-col items-end">
              <div className="flex items-center gap-4 text-sm">
                <p className="flex items-center">
                  {result >= 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className="text-gray-400">
                    {formatCurrency(result, currency)}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {date && (
            <footer className="flex items-center text-sm pt-2 border-t border-gray-800">
              <Clock className="mr-1 h-4 w-4 text-gray-400" />
              <p className="text-gray-400">
                {t("cards.portfolio.updateDate", { ns: "portfolio" })}:{" "}
                {dayjs(date).format(DATE_TIME_LOCALIZED)}
              </p>
            </footer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
