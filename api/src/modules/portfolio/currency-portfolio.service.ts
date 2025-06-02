import { Injectable } from '@nestjs/common';
import { CurrencyName, FiatCurrency } from '@common/models/fiat-currency.model';
import { Market } from '@common/models/market.model';
import { DollarApiService } from 'src/providers/dollar-api/dollar-api.service';
import { Price } from '@common/models/price.model';
import { Asset, Broker } from './models/asset';
import { AssetEntity } from './db/asset.entity';
import { AssetType } from '@common/models/asset.model';

@Injectable()
export class CurrencyPortfolioService {
  constructor(private readonly dollarApiService: DollarApiService) {}

  async mapCurrenciesAssets(assets: AssetEntity[]): Promise<Asset[]> {
    if (assets.length <= 0) {
      return [];
    }

    const dollarRate = assets.some(
      (x) => this.mapCurrencies(x) === FiatCurrency.USD,
    )
      ? await this.dollarApiService.getAvgStockExchangeRate()
      : undefined;

    // Map assets
    const currencyAssets: Asset[] = await Promise.all(
      assets.map((asset) => this.mapAsset(asset, { dollarRate })),
    );

    return currencyAssets;
  }

  private mapAsset(
    asset: AssetEntity,
    context: { dollarRate?: number },
  ): Asset {
    if (asset.type !== AssetType.CURRENCY) {
      throw new Error(`Asset type ${asset.type} is not a currency.`);
    }

    const broker = asset.broker ?? 'unknown';
    const currency = this.mapCurrencies(asset);
    const acp = asset.acp;
    const brokers = [new Broker(broker, asset.amount, acp)];
    const lastPrice = currency === FiatCurrency.USD ? context.dollarRate : 1;

    const currencyAsset = new Asset(
      asset.symbol,
      asset.type,
      asset.amount,
      brokers,
      CurrencyName[currency],
      undefined,
      Market.OTHER,
      undefined,
      lastPrice ? new Price(lastPrice, FiatCurrency.ARS) : undefined,
      undefined,
      FiatCurrency.ARS,
    );

    if (currency !== FiatCurrency.ARS || acp.value > 1) {
      currencyAsset.setAcp(acp.value, FiatCurrency.ARS);

      if (context.dollarRate) {
        const result = (context.dollarRate - acp.value) * asset.amount;
        currencyAsset.setResult(result, FiatCurrency.ARS, broker);
      }
    }

    return currencyAsset;
  }

  private mapCurrencies(asset: AssetEntity): FiatCurrency {
    if (asset.symbol === 'ARS') {
      return FiatCurrency.ARS;
    }

    if (
      asset.symbol === 'USD' ||
      asset.symbol === 'U$D' ||
      asset.symbol === 'U$S'
    ) {
      return FiatCurrency.USD;
    }

    return FiatCurrency.OTHER;
  }
}
