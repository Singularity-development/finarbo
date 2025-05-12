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

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: TokensResponseDto })
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
  @Post('refresh')
  refresh(@Body() refreshToken: RefreshTokenDto, @Req() req: ExpressRequest) {
    return this.authService.refreshAccessToken(refreshToken.refreshToken, req);
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
