import { Module } from '@nestjs/common';
import { CoinMarketCapClient } from './coin-market-cap.client';
import { CoinMarketService } from './coin-market-cap.service';

@Module({
  providers: [CoinMarketCapClient, CoinMarketService],
  controllers: [],
  exports: [CoinMarketService],
})
export class CoinMarketCapModule {}
