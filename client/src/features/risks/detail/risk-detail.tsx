import { formatPercentage } from "@/common/lib/number";
import { RULE_ICONS } from "@/features/portfolio/components/cards/rule-result-card";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import RiskQuotes from "./risk-quotes";
import RiskAdvices from "./risk-advices";
import { useGetRuleResultsQuery } from "@/services/apis/analysis/analysis.api";

const RiskDetail = () => {
  const { t } = useTranslation();
  const { risk } = useParams<{ risk: string }>();
  const { data: ruleResults } = useGetRuleResultsQuery();

  if (!ruleResults || !risk) {
    return <></>;
  }

  const riskResult = ruleResults[risk];

  return (
    <article className="w-5xl justify-self-center">
      <header>
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="p-2 rounded-lg mr-3 text-white">
              {RULE_ICONS[riskResult.code]}
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
              <div className="flex items-center gap-2">
                <span className="text-xl text-white font-bold">
                  {formatPercentage(riskResult.score * 100)}
                </span>
              </div>

              <span className="text-gray-400 text-xs">
                {"("}
                {t(`attributes.threshold`, { ns: "rules" })}:{" "}
                {formatPercentage(riskResult.threshold * 100)}
                {")"}
              </span>
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

        <RiskQuotes riskResult={riskResult} />

        <RiskAdvices riskResult={riskResult} />
      </article>
    </article>
  );
};

export default RiskDetail;
