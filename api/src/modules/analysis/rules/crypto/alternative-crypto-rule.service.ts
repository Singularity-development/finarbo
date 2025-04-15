import { Injectable } from '@nestjs/common';
import { IRule, RuleType } from '../rule';
import { portfolioHaveCryptos } from '../util';
import { Market } from '@common/models/market.model';
import { Result, Severity } from '../result';
import { CoinMarketService } from 'src/providers/coin-market-cap/coin-market-cap.service';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';

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

    const cryptos = portfolio.assets.filter((x) => x.market === Market.CRYPTO);

    // Fetch last prices
    const symbols = new Set(cryptos.map((x) => x.symbol)).add(mainSymbol);
    const cryptosPrices = await this.coinMarketService.getCryptoQuotesBySymbol({
      symbol: Array.from(symbols).join(','),
    });

    // Total invested in crypto
    const totalInvestedInCryptos = cryptos
      .map((x) => x.total.value)
      .reduce((a, b) => a + b);

    // Get main crypto investment
    const mainCrypto = cryptos.find((x) => x.symbol === mainSymbol);
    const quote = cryptosPrices[mainSymbol].quote;
    const price = quote ? quote.usd.price : (mainCrypto?.acp?.value ?? 0);
    const mainCryptoInvestment = mainCrypto ? mainCrypto.amount * price : 0;

    // Check rule
    const altCoinHoldingPercentage =
      (totalInvestedInCryptos - mainCryptoInvestment) / portfolio.total.value;

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

  checkIfRuleApply(portfolio: Portfolio): boolean {
    return portfolioHaveCryptos(portfolio);
  }

  getRuleName(): RuleType {
    return 'alternative-cryptos';
  }
}
