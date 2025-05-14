import { RuleType } from './rule';

export class Result {
  code: RuleType;
  severity: Severity;
  score?: number;
  threshold?: number;
  params?: Record<string, any>;

  constructor(
    code: RuleType,
    severity: Severity,
    score?: number,
    threshold?: number,
    params?: Record<string, any>,
  ) {
    this.code = code;
    this.severity = severity;
    this.score = score;
    this.threshold = threshold;
    this.params = params;
  }

  static calculateSeverity(
    value: number,
    threshold: number,
    maxThreshold: number = 1,
  ): Severity {
    const score = this.calculateScore(value, threshold, maxThreshold);

    if (score <= 0.3) {
      return Severity.LOW;
    } else if (score > 0.33 && score <= 0.66) {
      return Severity.MEDIUM;
    } else {
      return Severity.HIGHT;
    }
  }

  private static calculateScore(
    value: number,
    threshold: number,
    maxThreshold: number,
  ): number {
    return Math.pow((value - threshold) / (maxThreshold - threshold), 1.3);
  }
}

export enum Severity {
  HIGHT = 'HIGHT',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE',
}
