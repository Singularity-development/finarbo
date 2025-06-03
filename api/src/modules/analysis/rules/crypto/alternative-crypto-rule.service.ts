import { Injectable } from '@nestjs/common';
import { IRule, RuleType } from '../rule';
import { portfolioHaveCryptos } from '../util';
import { Market } from '@common/models/market.model';
import { Result, Severity } from '../result';
import { CoinMarketService } from 'src/providers/coin-market-cap/coin-market-cap.service';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';
import { Asset } from '@modules/portfolio/models/asset';

@Injectable()
export class AlternativeCryptoRuleService implements IRule {
  constructor(private readonly coinMarketService: CoinMarketService) {}

  private CONFIG = {
    mainSymbol: 'BTC',
    maxHoldingPercentage: 0.1, // 10%
  };

  async check(portfolio: Portfolio): Promise<Result | undefined> {
    if (!this.checkIfRuleApply(portfolio)) {
      return;
    }

    const { mainSymbol, maxHoldingPercentage } = this.CONFIG;

    // Get alternative cryptos
    const alternativesCryptos = this.getPortfolioAssetsInvolved(portfolio);

    // Get man crypto
    const mainCrypto = portfolio.assets.find(
      (x) => x.market === Market.CRYPTO && x.symbol === mainSymbol,
    );

    const allCryptos = mainCrypto
      ? [...alternativesCryptos, mainCrypto]
      : alternativesCryptos;

    // Fetch last prices
    const symbols = new Set(alternativesCryptos.map((x) => x.symbol)).add(
      mainSymbol,
    );
    const cryptosPrices = await this.coinMarketService.getCryptoQuotesBySymbol({
      symbol: Array.from(symbols).join(','),
    });

    // Total invested in crypto
    const totalInvestedInCryptos: number =
      allCryptos
        .map((x) => x.total.value)
        .reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;

    // Get main crypto investment
    const quote = cryptosPrices[mainSymbol].quote;
    const price = quote ? quote.usd.price : (mainCrypto?.acp?.value ?? 0);
    const mainCryptoInvestment = mainCrypto ? mainCrypto.amount * price : 0;

    // Check rule
    const altCoinHoldingPercentage =
      (totalInvestedInCryptos - mainCryptoInvestment) /
      (portfolio.total.value ?? 1);

    const severity =
      altCoinHoldingPercentage < maxHoldingPercentage
        ? Severity.NONE
        : Result.calculateSeverity(
            altCoinHoldingPercentage,
            maxHoldingPercentage,
          );

    return new Result(
      this.getRuleName(),
      severity,
      altCoinHoldingPercentage,
      maxHoldingPercentage,
      {
        symbol: mainSymbol,
        [mainSymbol]: mainCryptoInvestment,
        totalInvestedInCryptos,
        altCoinHoldingPercentage,
        currency: FiatCurrency.USD,
        market: Market.CRYPTO,
      },
    );
  }

  getPortfolioAssetsInvolved(portfolio: Portfolio): Asset[] {
    if (!this.checkIfRuleApply(portfolio)) {
      return [];
    }

    const { mainSymbol } = this.CONFIG;

    return this.getCryptoAssets(portfolio).filter(
      (x) => x.symbol !== mainSymbol,
    );
  }

  checkIfRuleApply(portfolio: Portfolio): boolean {
    return portfolioHaveCryptos(portfolio);
  }

  getRuleName(): RuleType {
    return 'alternative-cryptos';
  }

  private getCryptoAssets(portfolio: Portfolio): Asset[] {
    return portfolio.assets.filter((x) => x.market === Market.CRYPTO);
  }
}
