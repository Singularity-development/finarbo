import { AssetType } from "@/common/models/asset.model";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const BADGE_TYPES: Record<AssetType, string | undefined> = {
  [AssetType.CRYPTO]: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30",

  [AssetType.BOND]: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
  [AssetType.ON]: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
  [AssetType.LETTER]: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",

  [AssetType.CEDEAR]: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
  [AssetType.STOCK]: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
  [AssetType.ADR]: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
  [AssetType.ETF]: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
  [AssetType.ETV]: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
  [AssetType.ETN]: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",

  [AssetType.CURRENCY]: "bg-green-500/20 text-green-400 hover:bg-green-500/30",

  [AssetType.OTHER]: "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30",
};

const AssetBadge = ({ type }: { type: AssetType }) => {
  const { t } = useTranslation();

  return (
    <Badge
      className={`${
        BADGE_TYPES[type] ?? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
      } border-0`}
    >
      {t(type, { ns: "assets" })}
    </Badge>
  );
};

export default AssetBadge;
