import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/common/lib/number";
import AssetBadge from "./asset-badge";
import AssetName from "./asset-name";
import AssetResult from "./asset-result";
import AssetMarket from "./asset-market";
import { useTranslation } from "react-i18next";
import { Asset } from "@/services/apis/portfolio/portfolio.model";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ONLY_DATE, ONLY_TIME } from "@/common/constants/date";
import { Card } from "@/components/ui/card";
import EmptyState from "./empty-state";

const SkeletonAssetTable = ({ rows = 16 }: { rows?: number }) => {
  return [...Array(rows)].map((_, i) => (
    <TableRow key={`empty-row-${i}`}>
      {[...Array(10)].map((_, j) => (
        <TableCell key={`empty-cell-${j}`} style={{ height: 53 }}>
          <Skeleton className="h-4" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

const AssetTable = ({
  assets = [],
  loading,
}: {
  assets?: Asset[];
  loading: {
    isLoading: boolean;
    skeletonRows?: number;
  };
}) => {
  const { t, i18n } = useTranslation();

  const renderRow = (assets: Asset[] = []) => {
    if (loading.isLoading) {
      return <SkeletonAssetTable rows={loading.skeletonRows} />;
    }

    return assets.map((asset) => (
      <TableRow key={`${asset.symbol}`} style={{ height: 53 }}>
        <TableCell className="font-medium text-white">
          <AssetName symbol={asset.symbol} name={asset.name} />
        </TableCell>
        <TableCell>
          <AssetBadge type={asset.type} />
        </TableCell>
        <TableCell className="text-center">
          <AssetMarket market={asset.market} />
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="text-gray-400">
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
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">
                {t("attributes.asset", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400">
                {t("attributes.type", { ns: "portfolio" })}
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
        {!loading.isLoading && assets?.length === 0 && <EmptyState />}
      </>
    );
  }, [assets, i18n.language, loading.isLoading]);

  return <Card className="text-white overflow-hidden p-4">{table}</Card>;
};

export default AssetTable;
