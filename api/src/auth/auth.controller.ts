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
import {
  AuthenticatedRequest,
  RefreshTokenDto,
  SignInDto,
  TokensResponseDto,
} from './auth.model';
import { Public } from './auth.decorator';
import { Request as ExpressRequest } from 'express';
import { UserDto, UserSaveDto } from './users/user.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: TokensResponseDto })
  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @Post('signin')
  signIn(@Body() signInDto: SignInDto, @Req() req: ExpressRequest) {
    return this.authService.signIn(signInDto.login, signInDto.password, req);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserSaveDto })
  @ApiOkResponse({ type: UserDto })
  @Post('signup')
  signUp(@Body() saveDto: UserSaveDto) {
    return this.authService.signUp(saveDto);
  }

  @Post('logout')
  logout(@Req() req: AuthenticatedRequest) {
    return this.authService.logout(req);
  }

  @Public()
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokensResponseDto })
  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @Post('refresh')
  refresh(@Body() refreshToken: RefreshTokenDto, @Req() req: ExpressRequest) {
    return this.authService.refreshAccessToken(refreshToken.refreshToken, req);
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
