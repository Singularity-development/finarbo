import { Expose, Transform } from 'class-transformer';
import moment from 'moment';
import { ArgDataClient } from '../arg-data.client';

export class HistoricalValueDto {
  @Expose({ name: 'valor' })
  value: number;

  @Expose({ name: 'fecha' })
  @Transform(({ value }) => moment(value).format(ArgDataClient.DATE_FORMAT))
  date: Date;
}
