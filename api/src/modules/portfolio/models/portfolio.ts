import {
  convertCurrency,
  FiatCurrency,
} from '@common/models/fiat-currency.model';
import { Price } from '@common/models/price.model';
import { Asset } from './asset';
import { Market } from '@common/models/market.model';

export class Portfolio {
  private _assets: Asset[];
  private _total: Price;
  private _result: Price;
  private _percentageResult: number;
  private _date: Date;
  private _exchange: number;
  private _markets?: PortfolioMarket;

  constructor(
    assets: Asset[],
    dollarExchange: number,
    targetCurrency = FiatCurrency.USD,
  ) {
    this._assets = assets;
    this._exchange = dollarExchange;
    this._date = new Date();

    const { total, result, percentageResult } = this.calculateTotals(
      assets,
      dollarExchange,
      targetCurrency,
    );

    this._result = result;
    this._percentageResult = percentageResult;
    this._total = total;

    this._markets = this.calculateByMarket(
      assets,
      dollarExchange,
      targetCurrency,
    );
  }

  /** Getters to provide read-only access */
  get assets(): Asset[] {
    return this._assets;
  }

  get total(): Price {
    return this._total;
  }

  get result(): Price {
    return this._result;
  }

  get percentageResult(): number {
    return this._percentageResult;
  }

  get date(): Date {
    return this._date;
  }

  get exchange(): number {
    return this._exchange;
  }

  get markets(): PortfolioMarket | undefined {
    return this._markets;
  }

  private calculateTotals(
    assets: Asset[],
    dollarExchange: number,
    targetCurrency: FiatCurrency = FiatCurrency.USD,
  ) {
    const result = this.calculateResult(assets, dollarExchange, targetCurrency);

    const totalUsd =
      assets
        .map((x) => {
          const nominalValue = x.getNominalPriceValue();

          const lastPrice = convertCurrency(
            nominalValue,
            x.total.currency,
            targetCurrency,
            dollarExchange,
          );

          const total = x.amount * lastPrice;
          return total;
        })
        .reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0;

    const percentageResult = totalUsd > 0 ? result.value / totalUsd : 0;
    const total = new Price(totalUsd, targetCurrency);

    return { total, result, percentageResult };
  }

  private calculateResult(
    assets: Asset[],
    dollarExchange: number,
    targetCurrency: FiatCurrency = FiatCurrency.USD,
  ) {
    const result =
      assets
        .map((x) => x.result)
        .filter((x) => x !== undefined)
        .map((x) =>
          convertCurrency(
            x.value ?? 0,
            x.currency,
            targetCurrency,
            dollarExchange,
          ),
        )
        .reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0;

    return new Price(result, targetCurrency);
  }

  private calculateByMarket(
    assets: Asset[],
    dollarExchange: number,
    targetCurrency: FiatCurrency = FiatCurrency.USD,
  ): PortfolioMarket {
    const cryptos = assets
      .filter((x) => x.market === Market.CRYPTO)
      .map((x) => {
        const total = convertCurrency(
          x.total.value ?? 0,
          x.total.currency,
          targetCurrency,
          dollarExchange,
        );

        return new Price(total, targetCurrency);
      })
      .reduce((a, b) => new Price(a.value + b.value, targetCurrency));

    const stocks = assets
      .filter((x) => x.market !== Market.CRYPTO)
      .map((x) => {
        const total = convertCurrency(
          x.total.value ?? 0,
          x.total.currency,
          targetCurrency,
          dollarExchange,
        );

        return new Price(total, targetCurrency);
      })
      .reduce((a, b) => new Price(a.value + b.value, targetCurrency));

    return new PortfolioMarket(cryptos, stocks);
  }
}

export class PortfolioMarket {
  cryptos?: Price;
  stocks?: Price;

  constructor(cryptos?: Price, stocks?: Price) {
    this.cryptos = cryptos;
    this.stocks = stocks;
  }
}

export enum PortfolioCurrency {
  USD = 'USD',
  ARS = 'ARS',
}

export function toFiatCurrency(
  portfolioCurrency: PortfolioCurrency,
): FiatCurrency {
  if (portfolioCurrency in FiatCurrency) {
    return portfolioCurrency as unknown as FiatCurrency;
  }

  throw new Error(`Unsupported currency: ${portfolioCurrency}`);
}
