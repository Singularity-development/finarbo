import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { LocalPortfolioService } from './local-portfolio.service';
import { CurrencyPortfolioService } from './currency-portfolio.service';

@Module({
  imports: [ProvidersModule],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    CryptoPortfolioService,
    LocalPortfolioService,
    CurrencyPortfolioService,
  ],
  exports: [PortfolioService],
})
export class PortfolioModule {}
