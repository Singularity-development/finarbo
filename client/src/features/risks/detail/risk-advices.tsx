import { RuleResult } from "@/services/apis/analysis/rule.model";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const RiskAdvices = ({ riskResult }: { riskResult: RuleResult }) => {
  const { t } = useTranslation();

  const advices = t(`result.${riskResult.code}.advices`, {
    ns: "rules",
    returnObjects: true,
  }) as string[];

  if (!advices || !Array.isArray(advices)) {
    return <></>;
  }

  return (
    <div className="mt-2">
      <h3 className="text-xl font-bold text-white mb-1">
        {t(`advices`, { ns: "risks" })}
      </h3>

      <ul>
        {advices.map((advice, i) => {
          return (
            <li key={i} className="flex gap-2 text-gray-400">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />{" "}
              <span>{advice}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RiskAdvices;
