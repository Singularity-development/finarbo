import { Landmark, Flame, ChartPie, Bitcoin, Coins } from "lucide-react";

export type RuleType =
  | "public-risk"
  | "devaluation-exposure"
  | "asset-type-concentration"
  | "asset-concentration"
  | "shit-coins"
  | "alternative-cryptos";

export enum Severity {
  HIGHT = "HIGHT",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  NONE = "NONE",
}

export type RuleResult = {
  code: RuleType;
  severity: Severity;
  score?: number;
  threshold?: number;
};

export const RULE_ICONS: Record<
  RuleType,
  React.ComponentType<{ className?: string }>
> = {
  "public-risk": Landmark,
  "devaluation-exposure": Flame,
  "asset-type-concentration": ChartPie,
  "asset-concentration": ChartPie,
  "alternative-cryptos": Bitcoin,
  "shit-coins": Coins,
};

export const getRiskColors = (level: Severity) => {
  const colorMap = {
    [Severity.HIGHT]: {
      color: "#F87171",
      backgroundColor: "#341A24",
      focusBackgroundColor: "#3A151C",
    },
    [Severity.MEDIUM]: {
      color: "#f97316",
      backgroundColor: "#3d2000",
      focusBackgroundColor: "#3d2009",
    },
    [Severity.LOW]: {
      color: "#3b82f6",
      backgroundColor: "#172554",
      focusBackgroundColor: "#172559",
    },
    [Severity.NONE]: {
      color: "#10b981",
      backgroundColor: "#1a2e22",
      focusBackgroundColor: "#1a2e29",
    },
  };

  return colorMap[level];
};
