import { FiatCurrency } from '@common/models/fiat-currency.model';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PriceDto {
  @Expose()
  @ApiProperty()
  value: number;

  @Expose()
  @ApiProperty({ example: FiatCurrency.ARS })
  currency: FiatCurrency;
}
