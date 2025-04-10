import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { PlatformDto } from './platform.dto';

export class CryptoDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'rank' })
  rank: number;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'symbol' })
  symbol: string;

  @Expose({ name: 'slug' })
  slug: string;

  @Expose({ name: 'first_historical_data' })
  @Transform(({ value }) => moment(value).toDate())
  firstHistoricalData: Date;

  @Expose({ name: 'last_historical_data' })
  @Transform(({ value }) => moment(value).toDate())
  lastHistoricalData: Date;

  @Expose({ name: 'is_active' })
  @Transform(({ value }) => value === 1)
  active: boolean;

  @Expose({ name: 'platform' })
  @Type(() => PlatformDto)
  platform?: PlatformDto;
}
