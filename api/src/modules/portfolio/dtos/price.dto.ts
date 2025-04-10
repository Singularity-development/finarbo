import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Expose } from 'class-transformer';

export class PriceDto {
  @Expose()
  value: number;

  @Expose()
  currency: FiatCurrency;
}
