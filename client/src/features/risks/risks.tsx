import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Grid from "@/layout/grid";
import { useGetRuleResultsQuery } from "@/services/apis/analysis/analysis.api";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatPercentage } from "@/common/lib/number";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { getRiskColors, RULE_ICONS } from "@/services/apis/analysis/rule.model";

const Risks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: ruleResults } = useGetRuleResultsQuery();

  const ruleCards = useMemo(() => {
    if (!ruleResults) {
      return [];
    }

    return Object.values(ruleResults).map((ruleResult) => {
      const Icon = RULE_ICONS[ruleResult.code];

      return (
        <Card
          key={ruleResult.code}
          className="text-white hover:shadow-lg transition-all duration-300 group h-full px-6 gap-2 justify-between"
        >
          <CardHeader
            className={
              "flex flex-row items-center justify-between space-y-0 pb-2"
            }
            style={{ paddingInline: 0 }}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3">
                {Icon && <Icon className="h-4 w-4" />}
              </div>
              <h5 className="text-white font-medium">
                {t(`result.${ruleResult.code}.title`, { ns: "rules" })}
              </h5>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs py-0.5 rounded"
                style={{ color: getRiskColors(ruleResult.severity).color }}
              >
                {t(`severity.${ruleResult.severity}`, { ns: "rules" })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex-1">
              <p className="text-gray-400 text-xs">
                {t(`result.${ruleResult.code}.description`, { ns: "rules" })}
              </p>
            </div>

            {ruleResult.score && ruleResult.threshold && (
              <div className="flex items-center justify-between px-3 py-2 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    {formatPercentage(ruleResult.score * 100)}
                  </span>
                  <span
                    className={`text-gray-400 text-xs flex items-center ${
                      ruleResult.score - ruleResult.threshold <= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {ruleResult.score - ruleResult.threshold > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <>
                        {ruleResult.score - ruleResult.threshold !== 0 && (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                      </>
                    )}
                    {formatPercentage(
                      (ruleResult.score - ruleResult.threshold) * 100
                    )}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {t(`attributes.threshold`, { ns: "rules" })}:{" "}
                  {formatPercentage(ruleResult.threshold * 100)}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center text-sm border-t border-gray-800 justify-end">
            <a
              className="text-gray-400 text-xs cursor-pointer flex items-center gap-2"
              onClick={() => navigate(`/risks/${ruleResult.code}`)}
            >
              {t(`actions.detail`, { ns: "global" })}
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </a>
          </CardFooter>
        </Card>
      );
    });
  }, [ruleResults, t]);

  return (
    <>
      <header>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {t("title", { ns: "risks" })}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("description", { ns: "risks" })}
            </p>
          </div>
        </div>
      </header>
      <Grid elements={ruleCards} />
    </>
  );
};

export default Risks;
