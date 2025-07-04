import { Injectable } from '@nestjs/common';
import { portfolioHaveCryptos } from '../util';
import { Market } from '@common/models/market.model';
import { Result, Severity } from '../result';
import { CoinMarketService } from 'src/providers/coin-market-cap/coin-market-cap.service';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';
import { IRule, RuleType } from '../rule';
import { Asset } from '@modules/portfolio/models/asset';

@Injectable()
export class ShitCoinRuleService implements IRule {
  constructor(private readonly coinMarketService: CoinMarketService) {}

  private CONFIG = {
    minCapitalDominance: 0.001, // 0.1%
    maxHoldingPercentage: 0.05, // 5%
  };

  async check(portfolio: Portfolio): Promise<Result | undefined> {
    if (!this.checkIfRuleApply(portfolio)) {
      return;
    }

    const { minCapitalDominance, maxHoldingPercentage } = this.CONFIG;

    const cryptos = this.getCryptoAssets(portfolio);

    // Fetch last prices
    const cryptosPrices = await this.coinMarketService.getCryptoQuotesBySymbol({
      symbol: cryptos.map((x) => x.symbol).join(','),
    });

    // Total invested in crypto
    const totalInvestedInCryptos = cryptos
      .map((x) => x.total.value)
      .reduce((a, b) => a + b);

    // Get shit coins
    const shitCoinPrices = Object.values(cryptosPrices)
      .filter((x) => x.quote)
      .filter((x) => {
        const quote = x.quote?.usd;
        return (quote?.marketCapDominance ?? 0) / 100 < minCapitalDominance;
      });

    if (shitCoinPrices.length <= 0) {
      return new Result(
        this.getRuleName(),
        Severity.NONE,
        0,
        maxHoldingPercentage,
        {
          totalInvestedInCryptos,
          totalInvestedInShitCoins: 0,
          shitCoinHoldingPercentage: 0,
          minCapitalDominance,
          currency: FiatCurrency.USD,
          market: Market.CRYPTO,
        },
      );
    }

    // Calculate shit coin investment
    const totalInvestedInShitCoins = shitCoinPrices
      .map((x) => {
        const quote = cryptosPrices[x.symbol].quote;
        const portfolioAsset = cryptos.find((y) => y.symbol === x.symbol);
        return (
          (portfolioAsset?.amount ?? 0) *
          (quote ? quote.usd.price : (portfolioAsset?.acp?.value ?? 0))
        );
      })
      ?.reduce((a, b) => a + b);

    // Check rule
    const shitCoinHoldingPercentage =
      totalInvestedInShitCoins / portfolio.total.value;

    const severity =
      shitCoinHoldingPercentage < maxHoldingPercentage
        ? Severity.NONE
        : Result.calculateSeverity(
            shitCoinHoldingPercentage,
            maxHoldingPercentage,
          );

    return new Result(
      this.getRuleName(),
      severity,
      shitCoinHoldingPercentage,
      maxHoldingPercentage,
      {
        totalInvestedInCryptos,
        totalInvestedInShitCoins,
        shitCoinHoldingPercentage,
        minCapitalDominance,
        currency: FiatCurrency.USD,
        market: Market.CRYPTO,
      },
    );
  }

  async getPortfolioAssetsInvolved(portfolio: Portfolio): Promise<Asset[]> {
    if (!this.checkIfRuleApply(portfolio)) {
      return [];
    }

    const { minCapitalDominance } = this.CONFIG;

    const cryptos = this.getCryptoAssets(portfolio);

    // Fetch last prices
    const cryptosPrices = await this.coinMarketService.getCryptoQuotesBySymbol({
      symbol: cryptos.map((x) => x.symbol).join(','),
    });

    // Get shit coins
    const shitCoinPrices = Object.values(cryptosPrices)
      .filter((x) => x.quote)
      .filter((x) => {
        const quote = x.quote?.usd;
        return (quote?.marketCapDominance ?? 0) / 100 < minCapitalDominance;
      });

    const shitCoinSymbols = shitCoinPrices.map((x) => x.symbol);

    return cryptos.filter((x) => shitCoinSymbols.includes(x.symbol));
  }

  checkIfRuleApply(portfolio: Portfolio): boolean {
    return portfolioHaveCryptos(portfolio);
  }

  getRuleName(): RuleType {
    return 'shit-coins';
  }

  private getCryptoAssets(portfolio: Portfolio): Asset[] {
    return portfolio.assets.filter((x) => x.market === Market.CRYPTO);
  }
}
