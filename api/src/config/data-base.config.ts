import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dataBaseConfig = (): TypeOrmModuleOptions => {
  if (!process.env.DB_URL) {
    throw new Error('Missing Database URL in environment variables');
  }

  return {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : false,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/data/migrations/*{.ts,.js}'],
    migrationsTableName: '_migrations',
    migrationsRun: true,
  };
};

export default dataBaseConfig;
