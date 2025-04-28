import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest, SignInDto } from './auth.model';
import { Public } from './auth.decorator';
import { Request as ExpressRequest } from 'express';
import { UserSaveDto } from './users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto, @Req() req: ExpressRequest) {
    return this.authService.signIn(signInDto.login, signInDto.password, req);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() saveDto: UserSaveDto) {
    return this.authService.signUp(saveDto);
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('refresh')
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
