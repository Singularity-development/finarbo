import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from '@common/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from 'src/providers/providers.module';
import { PortfolioModule } from '@modules/portfolio/portfolio.module';
import { AnalysisModule } from '@modules/analysis/analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV
        ? '.env.local'
        : `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRoot(databaseConfig),
    ProvidersModule,
    PortfolioModule,
    AnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
