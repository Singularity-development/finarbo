import { Injectable } from '@nestjs/common';
import { CurrencyName, FiatCurrency } from '@common/models/fiat-currency.model';
import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { DollarApiService } from 'src/providers/dollar-api/dollar-api.service';
import { Price } from '@common/models/price.model';
import { Asset, Broker } from './models/asset';
import { InputAssetDto } from './dtos/input-portfolio.dto';

@Injectable()
export class CurrencyPortfolioService {
  constructor(private readonly dollarApiService: DollarApiService) {}

  async mapCurrenciesAssets(assets: InputAssetDto[]): Promise<Asset[]> {
    if (assets.length <= 0) {
      return [];
    }

    // Map assets
    const currencyAssets: Asset[] = await Promise.all(
      assets.map(async (asset) => await this.createAsset(asset)),
    );

    return currencyAssets;
  }

  private async createAsset(asset: InputAssetDto): Promise<Asset> {
    const broker = asset.broker ?? 'unknown';
    const assetType = AssetType.CURRENCY;
    const currency = this.mapCurrencies(asset);
    const brokers = [new Broker(broker, asset.amount)];
    const lastPrice =
      currency === FiatCurrency.USD
        ? await this.dollarApiService.getAvgStockExchangeRate()
        : undefined;
    const acp = asset.acp;

    const currencyAsset = new Asset(
      asset.symbol,
      assetType,
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

    if (currency !== FiatCurrency.ARS || acp > 1) {
      currencyAsset.setAcp(acp, FiatCurrency.ARS);
    }

    if (lastPrice) {
      currencyAsset.setLastPrice(lastPrice, FiatCurrency.ARS);
    }

    return currencyAsset;
  }

  private mapCurrencies(asset: InputAssetDto): FiatCurrency {
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
