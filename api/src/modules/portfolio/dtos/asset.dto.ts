import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Expose, Type } from 'class-transformer';
import { PriceDto } from './price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

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

export class SaveAssetDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'AL30D' })
  symbol: string;

  @ApiProperty({ example: AssetType.BOND })
  type: AssetType;

  @ApiProperty()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: Market.ARG })
  market?: Market;

  @ApiProperty({ example: 'IOL, Binance, PPI, LBO, etc' })
  broker?: string;

  @Type(() => PriceDto)
  @ApiProperty()
  acp: PriceDto;

  @ApiProperty()
  operatedDate: Date;

  @ApiProperty()
  portfolioId: string;
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
