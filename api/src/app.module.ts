import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@common/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from 'src/providers/providers.module';
import { PortfolioModule } from '@modules/portfolio/portfolio.module';
import { AnalysisModule } from '@modules/analysis/analysis.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV
        ? '.env.local'
        : `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ProvidersModule,
    PortfolioModule,
    AnalysisModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
