import { Injectable } from '@nestjs/common';
import { DollarApiClient } from './dollar-api.client';
import { ExchangeRateDto } from './dtos/exchange-rate.dto';
import { Mapper } from '@common/util/mapper';

@Injectable()
export class DollarApiService {
  constructor(private readonly dollarApiClient: DollarApiClient) {}

  async getAllExchangeRate(): Promise<ExchangeRateDto[]> {
    const exchanges = await this.dollarApiClient.getAllExchangeRate();
    return Mapper.mapToDto(exchanges, ExchangeRateDto) as ExchangeRateDto[];
  }

  async getExchangeRate(dollarType: string): Promise<ExchangeRateDto> {
    const exchange = await this.dollarApiClient.getExchangeRate(dollarType);
    return Mapper.mapToDto(exchange, ExchangeRateDto) as ExchangeRateDto;
  }

  async getAvgStockExchangeRate() {
    const exchange = await this.getExchangeRate('bolsa');
    const diff = exchange.sell - exchange.buy;
    return exchange.buy + diff / 2;
  }

  async getAvgStockExtExchangeRate() {
    const exchange = await this.getExchangeRate('contadoconliqui');
    const diff = exchange.sell - exchange.buy;
    return exchange.buy + diff / 2;
  }
}
