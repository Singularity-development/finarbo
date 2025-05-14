import { AssetType } from "@/common/models/asset.model";
import { Banknote, Coins, Handshake, Landmark, LineChart } from "lucide-react";
import { ReactElement } from "react";

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

const AssetName = ({
  symbol,
  name,
  type,
}: {
  symbol: string;
  name?: string;
  type: AssetType;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {ICONS_BY_TYPES[type]}
        {symbol}
      </div>
      {name && name !== symbol && (
        <p className="text-xs text-gray-500">{name}</p>
      )}
    </div>
  );
};

export default AssetName;
