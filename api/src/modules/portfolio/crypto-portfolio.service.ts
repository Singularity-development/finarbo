import { Injectable } from '@nestjs/common';
import { CoinMarketService } from 'src/providers/coin-market-cap/coin-market-cap.service';
import { toRecord } from '@common/util/array.util';
import { CryptoDto } from 'src/providers/coin-market-cap/dtos/crypto.dto';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { AssetType } from '@common/models/asset.model';
import { CryptoPriceDto } from 'src/providers/coin-market-cap/dtos/crypto-price.dto';
import { Market } from '@common/models/market.model';
import { Asset, Broker } from './models/asset';
import { InputAssetDto } from './dtos/input-portfolio.dto';

@Injectable()
export class CryptoPortfolioService {
  private cryptosBySymbol: Record<string, CryptoDto>;

  constructor(private readonly coinMarketService: CoinMarketService) {}

  async mapCryptoAssets(assets: InputAssetDto[]): Promise<Asset[]> {
    const cryptosBySymbol = await this.getCryptos();
    const portfolioAssetsBySymbol = toRecord(assets, (x) => x.symbol);

    // Map assets
    const cryptoAssets: Asset[] = assets.map((asset) =>
      this.createAsset(asset, cryptosBySymbol),
    );

    // Fetch crypto quotes
    const cryptosQuoteBySymbol =
      await this.coinMarketService.getCryptoQuotesBySymbol({
        symbol: cryptoAssets.map((x) => x.symbol).join(','),
      });

    // Process asset price and performance calculations
    cryptoAssets.forEach((cryptoAsset) => {
      this.updateAssetWithMarketData(
        cryptoAsset,
        portfolioAssetsBySymbol,
        cryptosQuoteBySymbol,
      );
    });

    return cryptoAssets;
  }

  private createAsset(
    asset: InputAssetDto,
    cryptosBySymbol: Record<string, CryptoDto>,
  ): Asset {
    const crypto = cryptosBySymbol[asset.symbol];
    const broker = asset.broker ?? 'unknown';
    const assetType = asset.type ?? AssetType.OTHER;
    const brokers = [new Broker(broker, asset.amount)];

    return new Asset(
      asset.symbol,
      assetType,
      asset.amount,
      brokers,
      crypto?.name,
      crypto?.slug,
      Market.CRYPTO,
    );
  }

  private updateAssetWithMarketData(
    cryptoAsset: Asset,
    portfolioAssetsBySymbol: Record<string, InputAssetDto>,
    cryptosQuoteBySymbol: Record<string, CryptoPriceDto>,
  ): void {
    const currency = FiatCurrency.USD;
    const portfolioAsset = portfolioAssetsBySymbol[cryptoAsset.symbol];
    const cryptosQuote = cryptosQuoteBySymbol[cryptoAsset.symbol];
    const lastPrice = cryptosQuote?.quote?.usd?.price ?? 0;
    const acp = portfolioAsset?.acp ?? 0;
    const amount = portfolioAsset?.amount ?? 0;
    const result = (lastPrice - acp) * amount;

    cryptoAsset.setAcp(acp, currency);
    cryptoAsset.setLastPrice(lastPrice, currency);
    cryptoAsset.setResult(result, currency);
    cryptoAsset.setUpdateDate(cryptosQuote?.quote?.usd.lastUpdated);
  }

  private async getCryptos() {
    if (this.cryptosBySymbol) {
      return this.cryptosBySymbol;
    }

    const cryptos = await this.coinMarketService.getAllCryptos();

    this.cryptosBySymbol = toRecord(
      cryptos.filter(
        (value, index, self) =>
          index === self.findIndex((x) => x.symbol === value.symbol),
      ),
      (x) => x.symbol,
    );
    return this.cryptosBySymbol;
  }
}
