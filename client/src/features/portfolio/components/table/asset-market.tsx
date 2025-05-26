import { Market } from "@/common/models/market.model";
import { ReactElement } from "react";
import { Bitcoin, Globe } from "lucide-react";
import Flag from "react-world-flags";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const MARKETS: Record<Market, ReactElement> = {
  [Market.ARG]: (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
      <Flag alt="Arg flag" code="AR" className="h-6 w-6 object-cover" />
    </span>
  ),
  [Market.USA]: (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
      <Flag alt="Usa flag" code="US" className="h-6 w-6 object-cover" />
    </span>
  ),
  [Market.CRYPTO]: <Bitcoin className="text-yellow-500 h-6 w-6" />,
  [Market.OTHER]: <Globe className="text-gray-500 h-6 w-6" />,
};

const AssetMarket = ({ market = Market.USA }: { market?: Market }) => {
  return (
    <span className="inline-flex">
      {
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{MARKETS[market]}</TooltipTrigger>
            <TooltipContent>
              <p>{market}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
    </span>
  );
};

export default AssetMarket;
