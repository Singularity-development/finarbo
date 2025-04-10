import { Expose, Type } from 'class-transformer';
import { AssetDto } from './asset.dto';
import { PriceDto } from './price.dto';

export class PortfolioMarketDto {
  @Expose()
  @Type(() => PriceDto)
  cryptos?: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  stocks?: PriceDto;
}

export class PortfolioDto {
  @Expose()
  @Type(() => AssetDto)
  assets: AssetDto[];

  @Expose()
  @Type(() => PriceDto)
  total: PriceDto;

  @Expose()
  @Type(() => PriceDto)
  result: PriceDto;

  @Expose()
  percentageResult: number;

  @Expose()
  date: Date;

  @Expose()
  exchange: number;

  @Expose()
  @Type(() => PortfolioMarketDto)
  markets: PortfolioMarketDto;
}
