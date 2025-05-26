import { Column } from 'typeorm';
import { FiatCurrency } from './fiat-currency.model';

export class Price {
  @Column('float')
  value: number;

  @Column({
    type: 'enum',
    enum: FiatCurrency,
    default: FiatCurrency.USD,
  })
  currency: FiatCurrency;

  constructor(value: number, currency: FiatCurrency) {
    this.value = value;
    this.currency = currency;
  }
}
