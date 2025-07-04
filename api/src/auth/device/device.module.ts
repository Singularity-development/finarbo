import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { DevicesService } from './device.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
