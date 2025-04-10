import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

export class UsdQuote {
  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'market_cap' })
  marketCap: number;

  @Expose({ name: 'market_cap_dominance' })
  marketCapDominance: number;

  @Expose({ name: 'last_updated' })
  @Transform(({ value }) => moment(value).toDate())
  lastUpdated: Date;

  currency: FiatCurrency = FiatCurrency.USD;
}

export class QuoteDto {
  @Expose({ name: 'USD' })
  @Type(() => UsdQuote)
  usd: UsdQuote;
}
