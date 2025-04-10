import { DollarType } from '@common/models/dollar.model';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Expose, Transform } from 'class-transformer';
import moment from 'moment';
import { DollarApiClient } from '../dollar-api.client';

export class ExchangeRateDto {
  @Expose({ name: 'compra' })
  buy: number;

  @Expose({ name: 'venta' })
  sell: number;

  @Expose({ name: 'casa' })
  @Transform(({ value }: { value: string }) => {
    const mapping: Record<string, DollarType> = {
      oficial: DollarType.OFFICIAL,
      blue: DollarType.BLUE,
      bolsa: DollarType.STOCK_DOLLAR,
      contadoconliqui: DollarType.CCL,
      tarjeta: DollarType.CARD,
      cripto: DollarType.CRYPTO,
      mayorista: DollarType.WHOLESALER,
    };
    return mapping[value] ?? DollarType.UNKNOWN;
  })
  type: DollarType;

  @Expose({ name: 'nombre' })
  description: string;

  @Expose({ name: 'moneda' })
  @Transform(({ value }: { value: string }) => {
    const mapping: Record<string, FiatCurrency> = {
      USD: FiatCurrency.USD,
      ARS: FiatCurrency.ARS,
      EUR: FiatCurrency.EUR,
    };
    return mapping[value] ?? FiatCurrency.OTHER; // Default to original value if not mapped
  })
  currency: FiatCurrency;

  @Expose({ name: 'fechaActualizacion' })
  @Transform(({ value }) =>
    moment(value).format(DollarApiClient.DATE_TIME_FORMAT),
  )
  lastUpdated: Date;
}
