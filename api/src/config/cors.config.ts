import { registerAs } from '@nestjs/config';
import { DEFAULT_PORT } from './app.config';
import { Logger } from '@nestjs/common';

const corsConfig = () => {
  const defaultOrigin =
    (process.env.HOST ?? 'http://localhost') +
    ':' +
    (process.env.PORT ?? DEFAULT_PORT);

  const cors: { origin: string | string[]; credentials: boolean } = {
    origin: process.env.CORS_ORIGIN?.includes(',')
      ? process.env.CORS_ORIGIN?.split(',')
      : (process.env.CORS_ORIGIN ?? [defaultOrigin]),
    credentials: process.env.CORS_CREDENTIALS === 'true',
  };

  if (cors.origin === '*' && cors.credentials) {
    Logger.warn(
      'CORS',
      "CORS cannot be '*' when credentials are true, setting to credentials false",
    );
    cors.credentials = false;
  }

  Logger.debug('CORS', `CORS config: ${JSON.stringify(cors)}`);
  return {
    ...cors,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
};

export default registerAs('cors', corsConfig);
