import { DollarType } from '@common/models/dollar.model';
import { Expose, Transform } from 'class-transformer';
import moment from 'moment';
import { ArgDataClient } from '../arg-data.client';

export class HistoricalExchangeRateDto {
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

  @Expose({ name: 'fecha' })
  @Transform(({ value }) => moment(value).format(ArgDataClient.DATE_FORMAT))
  date: Date;
}
