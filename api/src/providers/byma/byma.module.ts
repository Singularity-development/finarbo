import { Module } from '@nestjs/common';
import { BymaClient } from './byma.client';
import { BymaService } from './byma.service';

@Module({
  providers: [BymaClient, BymaService],
  controllers: [],
  exports: [BymaService],
})
export class BymaModule {}
