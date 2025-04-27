import { formatPercentage } from "@/common/lib/number";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import RiskQuotes from "./risk-quotes";
import RiskAdvices from "./risk-advices";
import {
  useGetPortfolioAssetsQuery,
  useGetRuleResultsQuery,
} from "@/services/apis/analysis/analysis.api";
import { RULE_ICONS, RuleType } from "@/services/apis/analysis/rule.model";
import AssetTable from "./asset-table";
import { useMemo } from "react";

const NO_ASSETS_RULES: RuleType[] = ["asset-type-concentration"];

const RiskDetail = () => {
  const { t } = useTranslation();
  const { risk } = useParams<{ risk: string }>();
  const { data: ruleResults } = useGetRuleResultsQuery();
  const skipAssetsTable = NO_ASSETS_RULES.includes(risk as RuleType);

  const { data: assets, isLoading } = useGetPortfolioAssetsQuery(
    risk as RuleType,
    {
      skip: skipAssetsTable,
    }
  );

  const assetsAmount = useMemo(() => {
    return assets?.length ?? 0;
  }, [assets]);

  const portfolioPercentage = useMemo(() => {
    return formatPercentage(
      (assets?.reduce((acc, asset) => acc + asset.holding, 0) ?? 0) * 100
    );
  }, [assets]);

  if (!ruleResults || !risk) {
    return <></>;
  }

  const riskResult = ruleResults[risk];
  const Icon = RULE_ICONS[riskResult.code];

  return (
    <article className="w-5xl justify-self-center">
      <header>
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="p-2 rounded-lg mr-3 text-white">
              {Icon && <Icon className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {t(`result.${riskResult.code}.title`, { ns: "rules" })}
              </h1>
              <p className="text-gray-400 text-sm">
                {t(`result.${riskResult.code}.description`, { ns: "rules" })}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {riskResult.score && (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-white font-bold">
                    {formatPercentage(riskResult.score * 100)}
                  </span>
                </div>
              )}

              {riskResult.threshold && (
                <span className="text-gray-400 text-xs">
                  ({t("attributes.threshold", { ns: "rules" })}:{" "}
                  {formatPercentage(riskResult.threshold * 100)})
                </span>
              )}
            </div>

            <h2 className="text-2xl text-white py-0.5 px-4 rounded">
              {t(`severity.${riskResult.severity}`, { ns: "rules" })}
            </h2>
          </div>
        </div>
      </header>

      <article>
        <p className="text-white text-sm">
          {t(`result.${riskResult.code}.resume`, { ns: "rules" })}
        </p>

        {!skipAssetsTable && (
          <div className="my-6">
            <h3 className="text-xl font-bold text-white mb-1">
              {t(`assetsInvolved`, { ns: "risks" })}
            </h3>

            <p className="text-white text-sm mb-4">
              {t(`result.${riskResult.code}.analysis`, {
                ns: "rules",
                value: formatPercentage((riskResult?.score ?? 0) * 100),
                assetsAmount,
                portfolioPercentage,
              })}
            </p>

            <AssetTable
              assets={assets}
              loading={{ isLoading: isLoading ?? true, skeletonRows: 5 }}
            />
          </div>
        )}

        <RiskQuotes riskResult={riskResult} />

        <RiskAdvices riskResult={riskResult} />
      </article>
    </article>
  );
};

export default RiskDetail;
