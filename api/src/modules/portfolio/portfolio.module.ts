import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { LocalPortfolioService } from './local-portfolio.service';
import { CurrencyPortfolioService } from './currency-portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioEntity } from './db/portfolio.entity';
import { AssetEntity } from './db/asset.entity';
import { UsersModule } from 'src/auth/users/users.module';
import { AssetService } from './asset.service';

@Module({
  imports: [
    ProvidersModule,
    UsersModule,
    TypeOrmModule.forFeature([PortfolioEntity, AssetEntity]),
  ],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    AssetService,
    CryptoPortfolioService,
    LocalPortfolioService,
    CurrencyPortfolioService,
  ],
  exports: [PortfolioService, AssetService],
})
export class PortfolioModule {}
