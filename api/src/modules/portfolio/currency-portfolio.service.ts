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

    let dollarRate: number | undefined;
    let dollarExtRate: number | undefined;

    if (
      assets.some(
        (x) =>
          this.mapCurrencies(x) === FiatCurrency.USD ||
          this.mapCurrencies(x) === FiatCurrency.EXT,
      )
    ) {
      [dollarRate, dollarExtRate] = await Promise.all([
        this.dollarApiService.getAvgStockExchangeRate(),
        this.dollarApiService.getAvgStockExtExchangeRate(),
      ]);
    }

    // Map assets
    const currencyAssets: Asset[] = await Promise.all(
      assets.map((asset) =>
        this.mapAsset(asset, { dollarRate, dollarExtRate }),
      ),
    );

    return currencyAssets;
  }

  private mapAsset(
    asset: AssetEntity,
    context: { dollarRate?: number; dollarExtRate?: number },
  ): Asset {
    if (asset.type !== AssetType.CURRENCY) {
      throw new Error(`Asset type ${asset.type} is not a currency.`);
    }

    const broker = asset.broker ?? 'unknown';
    const currency = this.mapCurrencies(asset);
    const brokers = [new Broker(broker, asset.amount)];
    const lastPrice = this.getLastPrice(currency, context);

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

    if (asset.symbol === 'EXT') {
      return FiatCurrency.EXT;
    }

    return FiatCurrency.OTHER;
  }

  private getLastPrice(
    currency: FiatCurrency,
    context: { dollarRate?: number; dollarExtRate?: number },
  ) {
    if (currency === FiatCurrency.USD) {
      return context.dollarRate;
    }

    if (currency === FiatCurrency.EXT) {
      return context.dollarExtRate;
    }

    return 1; // Default price for other currencies
  }
}
