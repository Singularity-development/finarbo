import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProvidersModule } from 'src/providers/providers.module';
import { PortfolioModule } from '@modules/portfolio/portfolio.module';
import { AnalysisModule } from '@modules/analysis/analysis.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import dataBaseConfig from '@config/data-base.config';
import { RequestContextService } from '@common/middleware/request-context.service';
import corsConfig from '@config/cors.config';
import appConfig from '@config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV
        ? '.env'
        : `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      expandVariables: true,
      load: [dataBaseConfig, corsConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>('database');

        if (!config) {
          throw new Error('Missing database config');
        }

        return { ...config, autoLoadEntities: true };
      },
    }),
    ProvidersModule,
    PortfolioModule,
    AnalysisModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextService);
  }
}
