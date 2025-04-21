import { Portfolio } from "@/services/apis/portfolio/portfolio.model";
import { AnalyzeButton } from "./components/analyze-button";
import { useTranslation } from "react-i18next";
import PortfolioCard from "./components/cards/portfolio-card";
import AssetsCard from "./components/cards/assets-card";
import { Button } from "@/components/ui/button";
import { useGetRuleResultsQuery } from "@/services/apis/analysis/analysis.api";
import RuleResultCard from "./components/cards/rule-result-card";

export function PortfolioHeader({ portfolio }: { portfolio?: Portfolio }) {
  const { t } = useTranslation();
  const { data: ruleResults } = useGetRuleResultsQuery();

  return (
    <header>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {t("title", { ns: "portfolio" })}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("description", { ns: "portfolio" })}
          </p>
        </div>

        <div className="flex gap-4">
          <Button>{t("actions.addOrder", { ns: "portfolio" })}</Button>
          <AnalyzeButton />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 pb-4">
        <PortfolioCard
          total={portfolio?.total.value}
          cryptos={portfolio?.markets.cryptos}
          stocks={portfolio?.markets.stocks}
          date={portfolio?.date}
          currency={portfolio?.total.currency}
          result={portfolio?.result.value}
          percentageResult={portfolio?.percentageResult}
        />
        <AssetsCard assets={portfolio?.assets} />
        <RuleResultCard results={ruleResults} />
      </div>
    </header>
  );
}
