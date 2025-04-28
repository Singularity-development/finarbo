import { Controller, Get, Param } from '@nestjs/common';
import { DollarApiService } from 'src/providers/dollar-api/dollar-api.service';
import { ArgDataService } from 'src/providers/argentina-data/arg-data.service';
import { CoinMarketService } from 'src/providers/coin-market-cap/coin-market-cap.service';
import { BymaAssetType, BymaService } from 'src/providers/byma/byma.service';

@Controller()
export class AppController {
  constructor(
    private readonly dollarApiService: DollarApiService,
    private readonly argDataService: ArgDataService,
    private readonly coinMarketService: CoinMarketService,
    private readonly bymaService: BymaService,
  ) {}

  @Get('dollars')
  async getAllExchangeRate() {
    const dollars = await this.dollarApiService.getAllExchangeRate();
    return dollars;
  }

  @Get('dollars/:dollarType')
  async getExchangeRate(@Param('dollarType') dollarType: string) {
    const dollar = await this.dollarApiService.getExchangeRate(dollarType);
    return dollar;
  }

  @Get('dollars/:dollarType/historical')
  async getHistoricalExchangeRate(@Param('dollarType') dollarType: string) {
    return await this.argDataService.getHistoricalExchangeRate(dollarType);
  }

  @Get('cryptos')
  async getAllCryptos() {
    return await this.coinMarketService.getAllCryptos();
  }

  @Get('cryptos/prices')
  async getAllCryptoPrices() {
    return await this.coinMarketService.getCryptoQuotesBySymbol();
  }

  @Get('byma/:type')
  async getAllBonds(@Param('type') type: BymaAssetType) {
    return await this.bymaService.getAssetsByType(type);
  }
}
