import { Injectable } from '@nestjs/common';
import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Asset, Broker } from './models/asset';
import { InputAssetDto } from './dtos/input-portfolio.dto';
import { BymaAssetType, BymaService } from 'src/providers/byma/byma.service';
import { toRecord } from '@common/util/array.util';
import { InstrumentDto } from 'src/providers/byma/dtos/instrument.dto';
import {
  getNominalValueByType,
  mapToAssetType,
} from 'src/providers/byma/instrument.util';

@Injectable()
export class LocalPortfolioService {
  constructor(private readonly bymaService: BymaService) {}

  async mapLocalAssets(assets: InputAssetDto[]): Promise<Asset[]> {
    if (assets.length <= 0) {
      return [];
    }

    // Map assets
    const localAssets: Asset[] = assets.map((asset) => this.createAsset(asset));
    const portfolioAssetsBySymbol = toRecord(assets, (x) => x.symbol);

    // Fetch assets quotes
    const portfolioTypes = new Set(
      localAssets
        .filter((x) => x.market === Market.ARG)
        .filter((x) => x.type !== AssetType.OTHER)
        .map((x) => x.type as unknown as BymaAssetType),
    );

    const bymaResults = (
      await Promise.all(
        Array.from(portfolioTypes).map(
          async (type) => await this.bymaService.getAssetsByType(type),
        ),
      )
    ).flatMap((x) => x);

    const bymaAssetsBySymbol = toRecord(bymaResults, (x) => x.symbol);

    // Process asset price and performance calculations
    localAssets.forEach((localAsset) => {
      this.updateAssetWithMarketData(
        localAsset,
        portfolioAssetsBySymbol,
        bymaAssetsBySymbol,
      );
    });

    return localAssets;
  }

  private createAsset(asset: InputAssetDto): Asset {
    const broker = asset.broker ?? 'unknown';
    const assetType = asset.type ?? AssetType.OTHER;
    const brokers = [new Broker(broker, asset.amount)];

    const localAsset = new Asset(
      asset.symbol,
      assetType,
      asset.amount,
      brokers,
      undefined,
      undefined,
      Market.ARG,
    );

    return localAsset;
  }

  private updateAssetWithMarketData(
    asset: Asset,
    portfolioAssetsBySymbol: Record<string, InputAssetDto>,
    bymaAssetsBySymbol: Record<string, InstrumentDto>,
  ): void {
    const portfolioAsset = portfolioAssetsBySymbol[asset.symbol];
    const assetQuote = bymaAssetsBySymbol[asset.symbol];

    if (!assetQuote) {
      return;
    }

    const lastPrice = assetQuote.getLastPrice();
    const currency = assetQuote.denominationCurrency;
    const acp = portfolioAsset?.acp ?? 0;
    const amount = portfolioAsset?.amount ?? 0;
    const result = getNominalValueByType(
      (lastPrice - acp) * amount,
      mapToAssetType(assetQuote),
    );

    asset.setAcp(acp, currency);
    asset.setLastPrice(lastPrice, currency);
    asset.setResult(result, currency);
    asset.setUpdateDate(new Date()); // TODO
  }
}
