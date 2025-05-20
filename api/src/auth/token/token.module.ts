import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { TokensService } from './token.service';
import { DevicesModule } from '../device/device.module';
import { JwtModule } from '@nestjs/jwt';
import { TokensConfigService } from './token-config.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    DevicesModule,
  ],
  providers: [TokensService, TokensConfigService],
  exports: [TokensService],
})
export class TokensModule {}
