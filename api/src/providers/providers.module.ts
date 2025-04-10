import { Module } from '@nestjs/common';
import { ArgDataModule } from 'src/providers/argentina-data/arg-data.module';
import { DollarApiModule } from './dollar-api/dollar-api.module';
import { CoinMarketCapModule } from './coin-market-cap/coin-market-cap.module';
import { BymaModule } from './byma/byma.module';

@Module({
  imports: [DollarApiModule, ArgDataModule, CoinMarketCapModule, BymaModule],
  exports: [DollarApiModule, ArgDataModule, CoinMarketCapModule, BymaModule],
})
export class ProvidersModule {}
