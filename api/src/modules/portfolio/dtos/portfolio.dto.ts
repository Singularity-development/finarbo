import { Expose, Type } from 'class-transformer';
import { AssetDto } from './asset.dto';
import { PriceDto } from './price.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PortfolioMarketDto {
  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  cryptos?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  stocks?: PriceDto;
}

export class SavePortfolioDto {
  @ApiProperty()
  description?: string;
}

export class PortfolioDto {
  @Expose()
  @Type(() => AssetDto)
  @ApiProperty({ type: [AssetDto] })
  assets: AssetDto[];

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  total: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  @ApiProperty()
  result: PriceDto;

  @Expose()
  @ApiProperty()
  percentageResult: number;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  exchange: number;

  @Expose()
  @Type(() => PortfolioMarketDto)
  @ApiProperty()
  markets: PortfolioMarketDto;
}
