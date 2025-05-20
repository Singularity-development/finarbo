import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dataBaseConfig = (): TypeOrmModuleOptions => {
  if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
    throw new Error('Missing Database credentails in environment variables');
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'finarbo_database',
    synchronize: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : false,
  };
};

export default registerAs('database', dataBaseConfig);
