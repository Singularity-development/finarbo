import { Result } from './result';
import { Portfolio } from '@modules/portfolio/models/portfolio';

export interface IRule {
  check(portfolio: Portfolio): Promise<Result | undefined> | Result | undefined;
  checkIfRuleApply(portfolio: Portfolio): boolean;
  getRuleName(): RuleType;
}

export type RuleType =
  | 'public-risk'
  | 'inflation-exposure'
  | 'asset-type-concentration'
  | 'asset-concentration'
  | 'shit-coins'
  | 'alternative-cryptos';

export const RULE_SERVICES = Symbol('IRuleServices');
