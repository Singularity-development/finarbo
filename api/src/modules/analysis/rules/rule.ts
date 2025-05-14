import { Asset } from '@modules/portfolio/models/asset';
import { Result } from './result';
import { Portfolio } from '@modules/portfolio/models/portfolio';

export interface IRule {
  check(portfolio: Portfolio): Promise<Result | undefined> | Result | undefined;
  checkIfRuleApply(portfolio: Portfolio): boolean;
  getRuleName(): RuleType;
  getPortfolioAssetsInvolved(portfolio: Portfolio): Asset[] | Promise<Asset[]>;
}

export type RuleType =
  | 'public-risk'
  | 'devaluation-exposure'
  | 'asset-type-concentration'
  | 'asset-concentration'
  | 'shit-coins'
  | 'alternative-cryptos';

export const RULE_SERVICES = Symbol('IRuleServices');
