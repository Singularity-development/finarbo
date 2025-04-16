import { formatPercentage } from "@/common/lib/number";
import {
  getRiskColors,
  RuleResult,
  RuleType,
} from "@/services/apis/analysis/rule.model";
import {
  ChevronRight,
  ArrowUp,
  Landmark,
  ChartPie,
  Bitcoin,
  Banana,
  ArrowDown,
  Flame,
} from "lucide-react";
import { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Slider from "@/components/ui/slider";

const RULE_ICONS: Record<RuleType, ReactElement> = {
  "public-risk": <Landmark className="h-4 w-4" />,
  "devaluation-exposure": <Flame className="h-4 w-4" />,
  "asset-type-concentration": <ChartPie className="h-4 w-4" />,
  "asset-concentration": <ChartPie className="h-4 w-4" />,
  "alternative-cryptos": <Bitcoin className="h-4 w-4" />,
  "shit-coins": <Banana className="h-4 w-4" />,
};

const RuleResultCard = ({
  results,
}: {
  results?: Record<string, RuleResult>;
}) => {
  const { t } = useTranslation();

  const slides = useMemo(() => {
    if (!results) {
      return;
    }

    return Object.values(results).map((result) => {
      const severity = result.severity;

      // colors by severity
      const { color, backgroundColor, focusBackgroundColor } =
        getRiskColors(severity);
      const textColor = color;
      const borderColor = color;

      return (
        <div
          key={result.code}
          className="px-6 h-full flex flex-col relative overflow-hidden border rounded-lg cursor-pointer transition-colors"
          style={{ borderColor, backgroundColor }}
        >
          <header className="text-sm font-medium text-gray-400 mt-6">
            {t("cards.ruleResult.title", { ns: "portfolio" })}
          </header>

          <div className="flex items-center p-3">
            <div
              className="p-2 rounded-lg mr-3"
              style={{
                color: textColor,
                backgroundColor: focusBackgroundColor,
              }}
            >
              {RULE_ICONS[result.code]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h5 className="text-white font-medium">
                  {t(`result.${result.code}.title`, { ns: "rules" })}
                </h5>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      color: textColor,
                      backgroundColor: focusBackgroundColor,
                    }}
                  >
                    {t(`severity.${severity}`, { ns: "rules" })}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {t(`result.${result.code}.description`, { ns: "rules" })}
              </p>
            </div>
          </div>
          <div
            className="flex items-center justify-between px-3 py-2 rounded"
            style={{ color: textColor, backgroundColor: focusBackgroundColor }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: textColor }}>
                {formatPercentage(result.score * 100)}
              </span>
              <span className="text-gray-400 text-xs flex items-center">
                {result.score - result.threshold > 0 ? (
                  <ArrowUp
                    className="h-3 w-3 mr-1"
                    style={{ color: textColor }}
                  />
                ) : (
                  <>
                    {result.score - result.threshold !== 0 && (
                      <ArrowDown
                        className="h-3 w-3 mr-1"
                        style={{ color: textColor }}
                      />
                    )}
                  </>
                )}
                {formatPercentage((result.score - result.threshold) * 100)}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              {t(`attributes.threshold`, { ns: "rules" })}:{" "}
              {formatPercentage(result.threshold * 100)}
            </span>
          </div>
        </div>
      );
    });
  }, [results, t]);

  if (!slides) {
    return <></>;
  }

  return <Slider slides={slides} delay={5000} />;
};

export default RuleResultCard;
