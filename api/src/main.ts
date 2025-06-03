import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/errors/http-exception.filter';
import { setupSwagger } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableCors(configService.get('cors'));
  setupSwagger(app);

  const appConfig = configService.get<{
    port: number;
    hostname: string;
  }>('app');

  if (!appConfig) {
    throw new Error('Missing "app" config');
  }

  await app.listen(appConfig.port, appConfig.hostname);

  Logger.log('App', `App is running on: "${await app.getUrl()}/api".`);
}

bootstrap().catch((error) => Logger.error('App', error));
