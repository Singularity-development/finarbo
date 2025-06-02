import { Expose, Type } from 'class-transformer';
import { ResultAssetDto } from './asset.dto';
import { PriceDto } from './price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BasicUserDto } from 'src/auth/users/user.dto';
import { IsString, Length } from 'class-validator';

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

export class RenamePortfolioDto {
  @IsString()
  @Length(1, 32)
  @ApiProperty()
  description: string;
}

export class PortfolioDto {
  @Expose()
  @Type(() => ResultAssetDto)
  @ApiProperty({ type: [ResultAssetDto] })
  assets: ResultAssetDto[];

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

export class PortfolioSummaryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @Type(() => BasicUserDto)
  @ApiProperty()
  createdBy: BasicUserDto;

  @Expose()
  @ApiProperty()
  description?: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
