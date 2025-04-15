import { Injectable } from '@nestjs/common';
import { Result, Severity } from '../result';
import { convertCurrency } from '@common/models/fiat-currency.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';
import { IRule, RuleType } from '../rule';
import { AssetType } from '@common/models/asset.model';

@Injectable()
export class PublicRiskRuleService implements IRule {
  private CONFIG = {
    maxHoldingPercentage: 0.3, // 30%
  };

  check(portfolio: Portfolio): Result | undefined {
    if (!this.checkIfRuleApply(portfolio)) {
      return;
    }

    const { maxHoldingPercentage } = this.CONFIG;
    const { assets, total, exchange } = portfolio;

    const exposedAssets = assets.filter((x) =>
      [AssetType.LETTER, AssetType.BOND].includes(x.type),
    );

    const totalExposed =
      exposedAssets
        .map((x) =>
          convertCurrency(
            x.total.value,
            x.total.currency,
            total.currency,
            exchange,
          ),
        )
        .reduce((a, b) => a + b) ?? 0;

    const score = totalExposed / total.value;

    const severity =
      score < maxHoldingPercentage
        ? Severity.NONE
        : Result.calculateSeverity(score, maxHoldingPercentage);

    return new Result(
      this.getRuleName(),
      severity,
      score,
      maxHoldingPercentage,
    );
  }

  checkIfRuleApply(portfolio: Portfolio): boolean {
    return portfolio.assets.length > 0;
  }

  getRuleName(): RuleType {
    return 'public-risk';
  }
}
