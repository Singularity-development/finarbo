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
import { AuthenticatedRequest, RefreshTokenDto, SignInDto } from './auth.model';
import { Public } from './auth.decorator';
import { Request as ExpressRequest } from 'express';
import { UserSaveDto } from './users/user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  @Post('signin')
  signIn(@Body() signInDto: SignInDto, @Req() req: ExpressRequest) {
    return this.authService.signIn(signInDto.login, signInDto.password, req);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserSaveDto })
  @Post('signup')
  signUp(@Body() saveDto: UserSaveDto) {
    return this.authService.signUp(saveDto);
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Public()
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh')
  refresh(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshToken.refreshToken);
  }
}
