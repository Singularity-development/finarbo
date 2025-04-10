import { Module } from '@nestjs/common';
import { DollarApiClient } from './dollar-api.client';
import { DollarApiService } from './dollar-api.service';

@Module({
  providers: [DollarApiClient, DollarApiService],
  controllers: [],
  exports: [DollarApiService],
})
export class DollarApiModule {}
