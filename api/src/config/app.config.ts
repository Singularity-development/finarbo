import { registerAs } from '@nestjs/config';

export const DEFAULT_HOST = '0.0.0.0';

export const DEFAULT_PORT = 3000;

export default registerAs('app', () => ({
  port: process.env.PORT ?? DEFAULT_PORT,
  hostname: process.env.HOST ?? DEFAULT_HOST,
}));
