import { AssetType } from '@common/models/asset.model';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Market } from '@common/models/market.model';
import { Price } from '@common/models/price.model';
import { getNominalValueByType } from 'src/providers/byma/instrument.util';

export class Asset {
  private _symbol: string;
  private _type: AssetType;
  private _name?: string;
  private _slug?: string;
  private _market?: Market;
  private _amount: number;
  private _lastPrice?: Price;
  private _acp?: Price;
  private _total: Price;
  private _result?: Price;
  private _percentageResult?: number;
  private _updateDate?: Date;
  private _currency?: FiatCurrency;
  private _brokers: Broker[];

  constructor(
    symbol: string,
    type: AssetType,
    amount: number,
    brokers: Broker[],
    name?: string,
    slug?: string,
    market?: Market,
    result?: Price,
    lastPrice?: Price,
    updateDate?: Date,
    currency?: FiatCurrency,
  ) {
    this._symbol = symbol;
    this._type = type;
    this._amount = amount;
    this._brokers = brokers;
    this._name = name;
    this._slug = slug;
    this._market = market;
    this._result = result;
    this._lastPrice = lastPrice;
    this._updateDate = updateDate;
    this._currency = currency ?? FiatCurrency.USD;
    this._total = new Price(
      amount * this.getNominalPriceValue(),
      this._currency,
    );

    this.calculatePercentageResult();
  }

  /** Getters */
  get symbol() {
    return this._symbol;
  }
  get type() {
    return this._type;
  }
  get name() {
    return this._name;
  }
  get slug() {
    return this._slug;
  }
  get market() {
    return this._market;
  }
  get amount() {
    return this._amount;
  }
  get lastPrice() {
    return this._lastPrice;
  }
  get acp() {
    return this._acp;
  }
  get total() {
    return this._total;
  }
  get result() {
    return this._result;
  }
  get percentageResult() {
    return this._percentageResult;
  }
  get currency() {
    return this._currency;
  }
  get updateDate() {
    return this._updateDate;
  }
  get brokers() {
    return this._brokers;
  }

  setAcp(acp: number, currency: FiatCurrency) {
    this._acp = new Price(acp, currency);
    this.recalculate(currency);
  }

  setLastPrice(lastPrice: number, currency: FiatCurrency) {
    this._lastPrice = new Price(lastPrice, currency);
    this.recalculate(currency);
  }

  setResult(result: number, currency: FiatCurrency) {
    this._result = new Price(result, currency);
    this.recalculate(currency);
  }

  setUpdateDate(date?: Date) {
    this._updateDate = date;
  }

  getLastPriceValue() {
    if (this._lastPrice && this._lastPrice.value !== 0) {
      return this._lastPrice.value;
    }

    return this._acp?.value ?? 0;
  }

  getNominalPriceValue() {
    return getNominalValueByType(this.getLastPriceValue(), this._type);
  }

  private calculatePercentageResult() {
    if (this._amount > 0 && this._lastPrice?.value) {
      this._percentageResult =
        ((this._lastPrice.value ?? 0) / (this._acp?.value ?? 1) - 1) * 100;
    } else {
      this._percentageResult = 0;
    }
  }

  private recalculate(currency: FiatCurrency) {
    this._total = new Price(
      this._amount * this.getNominalPriceValue(),
      currency,
    );
    this.calculatePercentageResult();
  }
}

export class Broker {
  private _name: string;
  private _amount: number;
  private _result?: Price;

  constructor(name: string, amount: number, result?: Price) {
    this._name = name;
    this._amount = amount;
    this._result = result;
  }

  /** Getters to provide read-only access */
  get name(): string {
    return this._name;
  }

  get amount(): number {
    return this._amount;
  }

  get result(): Price | undefined {
    return this._result;
  }

  set setResult(result: Price) {
    this._result = result;
  }
}
