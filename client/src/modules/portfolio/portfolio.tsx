import { useGetPortfolioQuery } from "@/services/apis/portfolio/portfolio.api";
import AssetTable from "./asset-table";
import { PortfolioHeader } from "./portfolio-header";
import { PortfolioCurrency } from "@/services/apis/portfolio/portfolio.model";

const Portfolio = () => {
  const {
    data: portfolio,
    isLoading,
    isFetching,
  } = useGetPortfolioQuery(
    PortfolioCurrency.USD // TODO - dynamic
  );

  return (
    <>
      <PortfolioHeader portfolio={portfolio} />
      <AssetTable portfolio={portfolio} isLoading={isLoading || isFetching} />
    </>
  );
};

export default Portfolio;
