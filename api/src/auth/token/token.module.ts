import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './token.model';
import { TokensService } from './token.service';
import { DevicesModule } from '../device/device.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), DevicesModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
