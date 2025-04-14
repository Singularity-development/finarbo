import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatNumber } from "@/common/lib/number";
import AssetBadge from "./asset-badge";
import AssetName from "./asset-name";
import AssetResult from "./asset-result";
import AssetMarket from "./asset-market";
import { useTranslation } from "react-i18next";
import { Asset, Portfolio } from "@/services/apis/portfolio/portfolio.model";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ONLY_DATE, ONLY_TIME } from "@/common/constants/date";
import { Market } from "@/common/models/market.model";
import EmptyState from "./empty-state";

type TAB_TYPE = "all" | "crypto" | "local" | "external";

const TABS: { value: TAB_TYPE }[] = [
  { value: "all" },
  { value: "crypto" },
  { value: "local" },
  { value: "external" },
];

const SkeletonAssetTable = () => {
  return [...Array(16)].map((_, i) => (
    <TableRow
      key={`empty-row-${i}`}
      className="border-[#1e2030] hover:bg-[#1a1d2d]"
    >
      {[...Array(10)].map((_, j) => (
        <TableCell key={`empty-cell-${j}`} style={{ height: 53 }}>
          <Skeleton className="h-4" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

const AssetTable = ({
  portfolio,
  isLoading,
}: {
  portfolio?: Portfolio;
  isLoading: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const DEFAULT = {
    tab: "all" as TAB_TYPE,
    assets: [],
  };

  const [assets, setAssets] = useState(portfolio?.assets ?? []);

  useEffect(() => {
    setAssets(portfolio?.assets ?? []);
  }, [portfolio?.assets]);

  const filterTable = (tab: TAB_TYPE) => {
    if (tab === "all") {
      setAssets(portfolio?.assets ?? []);
      return;
    }

    if (tab === "crypto") {
      setAssets(
        portfolio?.assets.filter((x) => x.market === Market.CRYPTO) ?? []
      );
      return;
    }

    if (tab === "local") {
      setAssets(portfolio?.assets.filter((x) => x.market === Market.ARG) ?? []);
      return;
    }

    if (tab === "external") {
      setAssets(portfolio?.assets.filter((x) => x.market === Market.USA) ?? []);
      return;
    }
  };

  const renderRow = (assets: Asset[] = []) => {
    if (isLoading) {
      return <SkeletonAssetTable />;
    }

    return assets.map((asset) => (
      <TableRow
        key={`${asset.symbol}`}
        className="border-[#1e2030] hover:bg-[#1a1d2d]"
      >
        <TableCell>
          <AssetBadge type={asset.type} />
        </TableCell>
        <TableCell className="font-medium text-white">
          <AssetName
            symbol={asset.symbol}
            name={asset.name}
            type={asset.type}
          />
        </TableCell>
        <TableCell className="text-center">
          <AssetMarket market={asset.market} />
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="border-[#1e2030] text-gray-400">
            {asset.symbol}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-300 text-right">
          {formatNumber(asset.amount)}
        </TableCell>
        <TableCell className="text-gray-300 text-right">
          {asset.acp
            ? formatCurrency(asset.acp.value, asset.acp.currency)
            : "-"}
        </TableCell>
        <TableCell className="text-gray-300 text-right">
          {asset.lastPrice
            ? formatCurrency(asset.lastPrice.value, asset.lastPrice.currency)
            : "-"}
        </TableCell>
        <TableCell className="text-gray-300 text-right">
          {asset.total
            ? formatCurrency(asset.total.value, asset.total.currency)
            : "-"}
        </TableCell>
        <TableCell>
          <AssetResult
            performance={asset.percentageResult}
            result={asset.result?.value}
            currency={asset.result?.currency}
          />
        </TableCell>
        <TableCell className="text-xs text-gray-500 text-right">
          {asset.updateDate ? (
            <div className={`flex flex-col text-gray-500`}>
              <div className="gap-1">
                {dayjs(asset.updateDate).format(ONLY_DATE)}
              </div>
              <div className="text-xs">
                {dayjs(asset.updateDate).format(ONLY_TIME)}
              </div>
            </div>
          ) : (
            "-"
          )}
        </TableCell>
      </TableRow>
    ));
  };

  const table = useMemo(() => {
    return (
      <>
        <Table>
          <TableHeader className="bg-[#0a0c10]">
            <TableRow className="border-[#1e2030] hover:bg-[#1a1d2d]">
              <TableHead className="text-gray-400">
                {t("attributes.type", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400">
                {t("attributes.asset", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-center">
                {t("attributes.market", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400">
                {t("attributes.symbol", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.amount", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.buyPrice", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.currentPrice", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.total", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.performance", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.date", { ns: "portfolio" })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderRow(assets)}</TableBody>
        </Table>
        {!isLoading && assets?.length === 0 && <EmptyState />}
      </>
    );
  }, [assets, i18n.language]);

  return (
    <Tabs defaultValue={DEFAULT.tab} className="space-y-2">
      <div className="flex items-center justify-between">
        <TabsList className="bg-[#0a0c10] text-gray-400">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-[#131620] data-[state=active]:text-white"
              onClick={() => filterTable(tab.value)}
            >
              {t(`tabs.${tab.value}`, { ns: "portfolio" })}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <Card className="bg-[#131620] border-[#1e2030] text-white overflow-hidden">
            {table}
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AssetTable;
