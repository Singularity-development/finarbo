import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { PlatformDto } from './platform.dto';
import { QuoteDto } from './quote.dto';

export class CryptoPriceDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'symbol' })
  symbol: string;

  @Expose({ name: 'slug' })
  slug: string;

  @Expose({ name: 'is_active' })
  @Transform(({ value }) => value === 1)
  active: boolean;

  @Expose({ name: 'total_supply' })
  totalSupply: number;

  @Expose({ name: 'max_supply' })
  maxSupply: number;

  @Expose({ name: 'cmc_rank' })
  rank: number;

  @Expose({ name: 'last_updated' })
  @Transform(({ value }) => moment(value).toDate())
  lastUpdated: Date;

  @Expose({ name: 'platform' })
  @Type(() => PlatformDto)
  platform?: PlatformDto;

  @Expose({ name: 'quote' })
  quote?: QuoteDto;
}
