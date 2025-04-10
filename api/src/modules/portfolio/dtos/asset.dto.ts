import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Expose, Type } from 'class-transformer';
import { PriceDto } from './price.dto';

export class BrokerDto {
  @Expose()
  name: string;

  @Expose()
  amount: number;

  @Expose()
  result?: PriceDto;
}

export class AssetDto {
  @Expose()
  symbol: string;

  @Expose()
  type: AssetType;

  @Expose()
  name?: string;

  @Expose()
  slug?: string;

  @Expose()
  market?: Market;

  @Expose()
  amount: number;

  @Expose()
  @Type(() => PriceDto)
  lastPrice?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  acp?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  total: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  result?: PriceDto;

  @Expose()
  percentageResult?: number;

  @Expose()
  updateDate?: Date;

  @Expose()
  @Type(() => BrokerDto)
  brokers: BrokerDto[];
}
