import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Expose, Type } from 'class-transformer';
import { PriceDto } from './price.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  result?: PriceDto;
}

export class AssetDto {
  @Expose()
  @ApiProperty()
  symbol: string;

  @Expose()
  @ApiProperty({ example: AssetType.BOND })
  type: AssetType;

  @Expose()
  @ApiProperty()
  name?: string;

  @Expose()
  @ApiProperty()
  slug?: string;

  @Expose()
  @ApiProperty({ example: Market.ARG })
  market?: Market;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  lastPrice?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  acp?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  total: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  result?: PriceDto;

  @Expose()
  @ApiProperty()
  percentageResult?: number;

  @Expose()
  @ApiProperty()
  updateDate?: Date;

  @Expose()
  @Type(() => BrokerDto)
  @ApiProperty({ type: [BrokerDto] })
  brokers: BrokerDto[];

  @Expose()
  holding: number;
}
