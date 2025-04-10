import { Injectable } from '@nestjs/common';
import { ExchangeRateDto } from './dtos/exchange-rate.dto';
import { Client } from '../util/client';

/**
 * Client for interacting with the DolarAPI service.
 *
 * This service provides access to exchange rate information for various
 * types of dollars in Argentina, such as the "Blue Dollar" or official
 * exchange rates, by consuming the [DolarAPI](https://dolarapi.com/docs/argentina).
 */
@Injectable()
export class DollarApiClient extends Client {
  public static DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  constructor() {
    super('https://dolarapi.com/v1', 'DolarApi');
  }

  async getAllExchangeRate(): Promise<ExchangeRateDto[]> {
    return this.get<ExchangeRateDto[], void>(`/dolares`);
  }

  async getExchangeRate(dollarType: string): Promise<ExchangeRateDto> {
    return this.get<ExchangeRateDto, void>(`/dolares/${dollarType}`);
  }
}
