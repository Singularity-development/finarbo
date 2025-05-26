import { AssetType } from "@/common/models/asset.model";
import { Badge } from "@/components/ui/badge";
import { Coins, Landmark, Handshake, LineChart, Banknote } from "lucide-react";
import { ReactElement } from "react";
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

const ICONS_BY_TYPES: Record<AssetType, ReactElement> = {
  [AssetType.CRYPTO]: <Coins className="h-4 text-yellow-500" />,

  [AssetType.BOND]: <Landmark className="h-4 text-purple-500" />,
  [AssetType.ON]: <Handshake className="h-4 text-purple-500" />,
  [AssetType.LETTER]: <Landmark className="h-4 text-purple-500" />,

  [AssetType.CEDEAR]: <LineChart className="h-4 text-blue-500" />,
  [AssetType.STOCK]: <LineChart className="h-4 text-blue-500" />,
  [AssetType.ADR]: <LineChart className="h-4 text-blue-500" />,
  [AssetType.ETF]: <LineChart className="h-4 text-blue-500" />,
  [AssetType.ETV]: <LineChart className="h-4 text-blue-500" />,
  [AssetType.ETN]: <LineChart className="h-4 text-blue-500" />,

  [AssetType.CURRENCY]: <Banknote className="h-4 text-green-500" />,

  [AssetType.OTHER]: <LineChart className="h-4 text-gray-500" />,
};

const AssetBadge = ({ type }: { type: AssetType }) => {
  const { t } = useTranslation();

  return (
    <Badge
      className={`${
        BADGE_TYPES[type] ?? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
      } border-0`}
    >
      {ICONS_BY_TYPES[type]}
      {t(type, { ns: "assets" })}
    </Badge>
  );
};

export default AssetBadge;
