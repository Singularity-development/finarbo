import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Expose, Type } from 'class-transformer';
import { PriceDto } from './price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { PortfolioSummaryDto } from './portfolio.dto';
import { FiatCurrency } from '@common/models/fiat-currency.model';

export class BrokerDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  acp?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  result?: PriceDto;
}

export class SaveAssetDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'AL30D' })
  symbol: string;

  @ApiProperty()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: AssetType.BOND })
  assetType: AssetType;

  @Type(() => PriceDto)
  @ApiProperty()
  acp: PriceDto;

  @ApiProperty()
  operatedDate: Date;

  @ApiProperty({ example: Market.ARG })
  market?: Market;

  @ApiProperty({ type: String, example: ['IOL', 'Binance', 'PPI', 'LBO'] })
  broker?: string;
}

export class SaveCurrencyAssetDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'ARS' })
  symbol: string;

  @ApiProperty()
  @IsPositive()
  amount: number;

  @ApiProperty()
  operatedDate: Date;

  @ApiProperty({ type: String, example: ['BBVA', 'Galicia', 'Santander'] })
  broker?: string;

  @ApiProperty({
    description: 'Average Cost Price in the currency of the asset',
  })
  @IsPositive()
  @IsOptional()
  acp?: number;
}

export class AssetDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  symbol: string;

  @Expose()
  @ApiProperty({ example: AssetType.BOND })
  type: AssetType;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  acp: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  total: PriceDto;

  @Expose()
  @ApiProperty({ example: Market.ARG })
  market?: Market;

  @Expose()
  @Type(() => BrokerDto)
  @ApiProperty({ type: BrokerDto })
  broker: BrokerDto;

  @Expose()
  @ApiProperty()
  operatedDate: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @Type(() => PortfolioSummaryDto)
  @ApiProperty({ type: () => PortfolioSummaryDto })
  portfolio: PortfolioSummaryDto;
}

export class ResultAssetDto {
  @Expose()
  @ApiProperty()
  symbol: string;

  @Expose()
  @ApiProperty({ example: AssetType.BOND })
  type: AssetType;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @Expose()
  @IsOptional()
  @ApiProperty()
  slug?: string;

  @Expose()
  @ApiProperty({ example: Market.ARG })
  market?: Market;

  @Expose()
  @ApiProperty()
  updateDate?: Date;

  @Expose()
  @ApiProperty({ example: FiatCurrency.USD })
  currency?: FiatCurrency;

  @Expose()
  @ApiProperty()
  percentageResult?: number;

  @Expose()
  holding: number;

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
  @Type(() => BrokerDto)
  @ApiProperty({ type: [BrokerDto] })
  brokers: BrokerDto[];
}
