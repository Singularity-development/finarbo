import { Injectable } from '@nestjs/common';
import { HistoricalExchangeRateDto } from './dtos/historical-exchange-rate.dto';
import { Client } from '../util/client';

/**
 * Client for interacting with the [argentinadatos API](https://argentinadatos.com).
 */
@Injectable()
export class ArgDataClient extends Client {
  public static DATE_FORMAT = 'YYYY-MM-DD';

  constructor() {
    super('https://api.argentinadatos.com/v1', 'ArgentinaDatos');
  }

  async getHistoricalExchangeRate(
    dollarType: string,
  ): Promise<HistoricalExchangeRateDto[]> {
    return this.get<HistoricalExchangeRateDto[], void>(
      `/cotizaciones/dolares/${dollarType}`,
    );
  }
}
