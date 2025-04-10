import { Inject, Injectable } from '@nestjs/common';
import { IRule, RULE_SERVICES } from './rule';
import { Result } from './result';
import { Portfolio } from '@modules/portfolio/models/portfolio';

@Injectable()
export class RulesService {
  constructor(@Inject(RULE_SERVICES) private readonly ruleServices: IRule[]) {}

  async analyzePortfolio(portfolio: Portfolio): Promise<Result[]> {
    const alerts: Result[] = (
      await Promise.all(
        this.ruleServices.map(async (rule) => await rule.check(portfolio)),
      )
    ).filter((alert): alert is Result => alert !== undefined);

    return alerts;
  }
}
