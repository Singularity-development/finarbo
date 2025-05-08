import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import dataBaseConfig from './data-base.config';

export const AppDataSource = new DataSource(
  dataBaseConfig() as DataSourceOptions,
);
