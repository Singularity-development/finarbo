process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // TODO - remove this in production
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/errors/http-exception.filter';
import { setupSwagger } from '@common/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableCors(); // make configurable
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? '0.0.0.0');
}
bootstrap();
