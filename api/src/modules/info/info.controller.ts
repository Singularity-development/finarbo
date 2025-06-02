import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { Public } from 'src/auth/auth.decorator';

@Controller('info')
export class InfoController {
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  getInfo(@RealIP() ip: string) {
    return {
      version: process.env.npm_package_version,
      env: process.env.NODE_ENV,
      ip,
      date: new Date().toISOString(),
    };
  }
}
