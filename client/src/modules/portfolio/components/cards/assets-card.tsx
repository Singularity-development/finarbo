import { formatPercentage } from "@/common/lib/number";
import { Card, CardContent } from "@/components/ui/card";
import { Asset } from "@/services/apis/portfolio/portfolio.model";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const AssetsCard = ({ assets = [] }: { assets?: Asset[] }) => {
  const { t } = useTranslation();

  const total = assets.length ?? 0;
  const profit = useMemo(() => {
    return assets.filter((x) => (x.result?.value ?? 0) > 0).length;
  }, [assets]);
  const none = useMemo(() => {
    return assets.filter((x) => (x.result?.value ?? 0) === 0).length;
  }, [assets]);
  const losses = useMemo(() => {
    return assets.filter((x) => (x.result?.value ?? 0) < 0).length;
  }, [assets]);

  const profitPercentage = total !== 0 ? (profit / total) * 100 : 0;
  const nonePercentage = total !== 0 ? (none / total) * 100 : 0;
  const lossesPercentage = total !== 0 ? (losses / total) * 100 : 0;

  return (
    <Card className="bg-[#131620] border-[#1e2030] text-white">
      <CardContent className="px-6 h-full flex flex-col">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-400">
            {t("cards.assets.title", { ns: "portfolio" })}
          </div>
          <div className="text-3xl font-bold">{total}</div>
          <div className="mt-4 h-2 w-full rounded-full bg-[#1e2030]">
            <div className="flex h-full rounded-full">
              <div
                className="bg-green-500 rounded-l-full"
                style={{ width: `${profitPercentage}%` }}
              ></div>
              <div
                className="bg-gray-500"
                style={{ width: `${nonePercentage}%` }}
              ></div>
              <div
                className="bg-red-500 rounded-r-full"
                style={{ width: `${lossesPercentage}%` }}
              ></div>
            </div>
          </div>
          {total !== 0 && (
            <div className="flex text-xs mt-2">
              <div className="flex items-center mr-4">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-gray-400">
                  {formatPercentage(profitPercentage)}{" "}
                  {t("cards.assets.profit", { ns: "portfolio" })}
                </span>
              </div>
              <div className="flex items-center mr-4">
                <div className="h-2 w-2 rounded-full bg-gray-500 mr-1"></div>
                <span className="text-gray-400">
                  {formatPercentage(nonePercentage)}{" "}
                  {t("cards.assets.none", { ns: "portfolio" })}
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                <span className="text-gray-400">
                  {formatPercentage(lossesPercentage)}{" "}
                  {t("cards.assets.losses", { ns: "portfolio" })}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsCard;
