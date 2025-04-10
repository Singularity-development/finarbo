import { Module } from '@nestjs/common';
import { ArgDataClient } from './arg-data.client';
import { ArgDataService } from './arg-data.service';

@Module({
  providers: [ArgDataClient, ArgDataService],
  controllers: [],
  exports: [ArgDataService],
})
export class ArgDataModule {}
