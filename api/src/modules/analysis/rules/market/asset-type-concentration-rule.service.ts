import { Injectable } from '@nestjs/common';
import { Result, Severity } from '../result';
import { convertCurrency } from '@common/models/fiat-currency.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';
import { IRule, RuleType } from '../rule';
import { AssetType } from '@common/models/asset.model';
import { Asset } from '@modules/portfolio/models/asset';

@Injectable()
export class AssetTypeConcentrationRuleService implements IRule {
  private CONFIG = {
    maxHoldingPercentage: 0.5, // 50%
  };

  check(portfolio: Portfolio): Result | undefined {
    if (!this.checkIfRuleApply(portfolio)) {
      return;
    }

    const { maxHoldingPercentage } = this.CONFIG;
    const { assets, total, exchange } = portfolio;

    // Group assets by type
    const assetsByType: Record<AssetType, Asset[]> = assets.reduce(
      (acc, value) => {
        // Initialization
        if (!acc[value.type]) {
          acc[value.type] = [];
        }

        // Grouping
        acc[value.type].push(value);

        return acc;
      },
      {} as Record<AssetType, Asset[]>,
    );

    let exceedAssetByType: Record<AssetType, number> = {} as Record<
      AssetType,
      number
    >;
    let distributedAssetByType: Record<AssetType, number> = {} as Record<
      AssetType,
      number
    >;

    // Check rule
    Object.entries(assetsByType).forEach((value) => {
      const [type, asset] = value;

      const totalByType =
        asset
          .map((x) =>
            convertCurrency(
              x.total.value ?? 0,
              x.total.currency,
              total.currency,
              exchange,
            ),
          )
          .reduce((a, b) => a + b) ?? 0;

      const score = totalByType / (total.value ?? 1);

      if (score > maxHoldingPercentage) {
        exceedAssetByType = {
          ...exceedAssetByType,
          [type]: score,
        };
      } else {
        distributedAssetByType = {
          ...distributedAssetByType,
          [type]: score,
        };
      }
    });

    if (Object.keys(exceedAssetByType).length === 0) {
      return new Result(
        this.getRuleName(),
        Severity.NONE,
        undefined,
        undefined,
        {
          distributedAssetByType,
        },
      );
    }

    const maxAssetType = Object.entries(exceedAssetByType).reduce(
      (maxEntry, currentEntry) => {
        const [, maxValue] = maxEntry;
        const [, currentValue] = currentEntry;
        return currentValue > maxValue ? currentEntry : maxEntry;
      },
    );

    const [assetType, score] = maxAssetType;

    const severity = Result.calculateSeverity(score, maxHoldingPercentage);

    return new Result(this.getRuleName(), severity, undefined, undefined, {
      distributedAssetByType,
      exceedAssetByType,
      maxExceedAssetType: assetType,
    });
  }

  // Ignore
  getPortfolioAssetsInvolved(): Asset[] {
    return [];
  }

  checkIfRuleApply(portfolio: Portfolio): boolean {
    return portfolio.assets.length > 0;
  }

  getRuleName(): RuleType {
    return 'asset-type-concentration';
  }
}
