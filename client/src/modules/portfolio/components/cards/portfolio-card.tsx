import { DATE_TIME_LOCALIZED } from "@/common/constants/date";
import { formatCurrency } from "@/common/lib/number";
import { FiatCurrency } from "@/common/models/fiat-currency.model";
import { Price } from "@/common/models/price.model";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { Clock, Bitcoin, BarChart4, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const PortfolioCard = ({
  total = 0,
  cryptos,
  stocks,
  currency = FiatCurrency.USD,
  date,
  exchange,
}: {
  total?: number;
  cryptos?: Price;
  stocks?: Price;
  currency?: FiatCurrency;
  date?: Date;
  exchange?: number;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-[#131620] border-[#1e2030] text-white">
      <CardContent className="px-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-400">
            {t("cards.portfolio.title", { ns: "portfolio" })}
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(total, currency)}
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm">
            {cryptos && (
              <div className="flex items-center">
                <Bitcoin className="mr-1 h-4 w-4 text-yellow-500" />
                <span className="text-gray-400">
                  {formatCurrency(cryptos.value, cryptos.currency)}
                </span>
              </div>
            )}
            {stocks && (
              <div className="flex items-center">
                <BarChart4 className="mr-1 h-4 w-4 text-blue-500" />
                <span className="text-gray-400">
                  {formatCurrency(stocks.value, stocks.currency)}
                </span>
              </div>
            )}
          </div>
          {exchange && (
            <div className="flex items-center text-sm">
              <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
              <span className="text-gray-400">
                {t("cards.portfolio.exchange", { ns: "portfolio" })}:{" "}
                {formatCurrency(exchange, FiatCurrency.ARS)}
              </span>
            </div>
          )}
          {date && (
            <div className="flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4 text-gray-400" />
              <span className="text-gray-400">
                {t("cards.portfolio.updateDate", { ns: "portfolio" })}:{" "}
                {dayjs(date).format(DATE_TIME_LOCALIZED)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
