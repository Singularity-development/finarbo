import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => {
  if (!process.env.DB_URL) {
    throw new Error('Missing Database URL in environment variables');
  }

  return {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : false,
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: '_migrations',
    migrationsRun: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
  };
};
