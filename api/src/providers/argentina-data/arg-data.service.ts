import { Injectable } from '@nestjs/common';
import { ArgDataClient } from './arg-data.client';
import { HistoricalExchangeRateDto } from './dtos/historical-exchange-rate.dto';
import { Mapper } from '@common/util/mapper';

@Injectable()
export class ArgDataService {
  constructor(private readonly argDataClient: ArgDataClient) {}

  async getHistoricalExchangeRate(dollarType: string) {
    const historical =
      await this.argDataClient.getHistoricalExchangeRate(dollarType);
    return Mapper.mapToDto(historical, HistoricalExchangeRateDto);
  }
}
