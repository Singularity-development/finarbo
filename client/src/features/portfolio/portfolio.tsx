import { useGetPortfolioQuery } from "@/services/apis/portfolio/portfolio.api";
import AssetTable from "./components/table/asset-table";
import { PortfolioHeader } from "./portfolio-header";
import {
  Asset,
  PortfolioCurrency,
} from "@/services/apis/portfolio/portfolio.model";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { t } from "i18next";
import { Market } from "@/common/models/market.model";
import { useState, useEffect } from "react";

type TAB_TYPE = "all" | "crypto" | "local" | "external";

const TABS: { value: TAB_TYPE }[] = [
  { value: "all" },
  { value: "crypto" },
  { value: "local" },
  { value: "external" },
];

const Portfolio = () => {
  const DEFAULT = {
    tab: "all" as TAB_TYPE,
    assets: [],
  };

  const {
    data: portfolio,
    isLoading,
    isFetching,
  } = useGetPortfolioQuery(
    PortfolioCurrency.USD // TODO - dynamic
  );

  const [assets, setAssets] = useState<Asset[]>([]);

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

  return (
    <>
      <PortfolioHeader portfolio={portfolio} />
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
            <AssetTable
              assets={assets}
              loading={{ isLoading: isLoading || isFetching }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Portfolio;
