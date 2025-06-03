import { Column } from 'typeorm';
import { FiatCurrency } from './fiat-currency.model';

export class Price {
  @Column('float', { nullable: true })
  value?: number;

  @Column({
    type: 'enum',
    enum: FiatCurrency,
    default: FiatCurrency.USD,
    nullable: true,
  })
  currency?: FiatCurrency;

  constructor(value: number, currency: FiatCurrency) {
    this.value = value;
    this.currency = currency;
  }
}
