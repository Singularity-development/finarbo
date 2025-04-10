import { FiatCurrency } from './fiat-currency.model';

export class Price {
  value: number;
  currency: FiatCurrency;

  constructor(value: number, currency: FiatCurrency) {
    this.value = value;
    this.currency = currency;
  }
}
