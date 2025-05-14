import { formatPercentage } from "@/common/lib/number";
import {
  getRiskColors,
  RULE_ICONS,
  RuleResult,
} from "@/services/apis/analysis/rule.model";
import { ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Slider from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

const RuleResultCard = ({
  results,
}: {
  results?: Record<string, RuleResult>;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const slides = useMemo(() => {
    if (!results) {
      return;
    }

    return Object.values(results).map((result) => {
      const severity = result.severity;
      const Icon = RULE_ICONS[result.code];

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
          onClick={() => navigate(`/risks`)}
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
              {Icon && <Icon className="h-4 w-4" />}
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
