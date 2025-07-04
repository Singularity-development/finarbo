import { Injectable } from '@nestjs/common';
import { Result, Severity } from '../result';
import { convertCurrency } from '@common/models/fiat-currency.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';
import { IRule, RuleType } from '../rule';
import { Asset } from '@modules/portfolio/models/asset';

@Injectable()
export class AssetConcentrationRuleService implements IRule {
  private CONFIG = {
    maxHoldingPercentageByAsset: 0.1, // 10%
    ruleThreshold: 0.2, // 20%
  };

  check(portfolio: Portfolio): Result | undefined {
    if (!this.checkIfRuleApply(portfolio)) {
      return;
    }

    const { maxHoldingPercentageByAsset } = this.CONFIG;
    const { total, exchange } = portfolio;

    // Check rule
    const exceedAssets = this.getPortfolioAssetsInvolved(portfolio);

    const totalExceed =
      exceedAssets
        .map((x) =>
          convertCurrency(
            x.total.value,
            x.total.currency,
            total.currency,
            exchange,
          ),
        )
        .reduce((a, b) => a + b, 0) ?? 0;

    const totalExceedAvg = totalExceed / exceedAssets.length;

    const score = totalExceedAvg / total.value;

    const severity =
      exceedAssets.length > 0
        ? Result.calculateSeverity(
            score,
            maxHoldingPercentageByAsset * exceedAssets.length,
          )
        : Severity.NONE;

    return new Result(this.getRuleName(), severity, undefined, undefined, {
      exceedAssets: exceedAssets.map((x) => x.symbol),
      totalExceed,
      currency: total.currency,
    });
  }

  getPortfolioAssetsInvolved(portfolio: Portfolio): Asset[] {
    if (!this.checkIfRuleApply(portfolio)) {
      return [];
    }

    const { maxHoldingPercentageByAsset } = this.CONFIG;
    const { assets, total, exchange } = portfolio;

    return (
      assets.filter((asset) => {
        const { total: totalAsset } = asset;

        const totalAssetMapped = convertCurrency(
          totalAsset.value,
          totalAsset.currency,
          total.currency,
          exchange,
        );

        const score = totalAssetMapped / (total.value ?? 1);

        if (score > maxHoldingPercentageByAsset) {
          return asset;
        }
      }) ?? []
    );
  }

  checkIfRuleApply(portfolio: Portfolio): boolean {
    return portfolio.assets.length > 0;
  }

  getRuleName(): RuleType {
    return 'asset-concentration';
  }
}
