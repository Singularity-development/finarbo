import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.URL,
  synchronize: process.env.DB_SYNC === 'true',
  migrations: ['/migrations/*{.ts,.js}'],
  migrationsTableName: '_migrations',
  migrationsRun: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};

export default new DataSource({
  type: 'postgres',
  url: process.env.URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
});
