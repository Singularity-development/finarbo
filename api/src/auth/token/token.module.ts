import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './token.entity';
import { TokensService } from './token.service';
import { DevicesModule } from '../device/device.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    DevicesModule,
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
