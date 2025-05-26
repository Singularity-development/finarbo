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
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/common/lib/number";
import { useTranslation } from "react-i18next";
import { Asset } from "@/services/apis/portfolio/portfolio.model";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import AssetBadge from "@/features/portfolio/components/table/asset-badge";
import AssetMarket from "@/features/portfolio/components/table/asset-market";
import AssetName from "@/features/portfolio/components/table/asset-name";

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

    return assets.map(asset => (
      <TableRow key={`${asset.symbol}`} style={{ height: 53 }}>
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
          <Badge variant="outline" className="text-gray-400">
            {asset.symbol}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-300 text-right">
          {formatNumber(asset.amount)}
        </TableCell>
        <TableCell className="text-gray-300 text-right">
          {asset.total
            ? formatCurrency(asset.total.value, asset.total.currency)
            : "-"}
        </TableCell>
        <TableCell className="text-white text-right">
          <strong>{formatPercentage(asset.holding * 100)}</strong>
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
                {t("attributes.total", { ns: "portfolio" })}
              </TableHead>
              <TableHead className="text-gray-400 text-right">
                {t("attributes.holding", { ns: "portfolio" })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderRow(assets)}</TableBody>
        </Table>
      </>
    );
  }, [assets, i18n.language, loading.isLoading]);

  if (!loading.isLoading && assets.length === 0) {
    return <></>;
  }

  return <Card className="text-white overflow-hidden p-4">{table}</Card>;
};

export default AssetTable;
