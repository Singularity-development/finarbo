import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { LocalPortfolioService } from './local-portfolio.service';
import { CurrencyPortfolioService } from './currency-portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './models/portfolio.entity';
import { Asset } from './models/asset.entity';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [
    ProvidersModule,
    UsersModule,
    TypeOrmModule.forFeature([Portfolio, Asset]),
  ],
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
