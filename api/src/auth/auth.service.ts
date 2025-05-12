import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { AuthenticatedRequest, AuthPayload } from './auth.model';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';
import { TokensService } from './token/token.service';
import { Request } from 'express';
import { Mapper } from '@common/util/mapper';
import { UserDto, UserSaveDto } from './users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async signIn(
    login: string,
    password: string,
    req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOneByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.checkPassword(password, user);

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const payload: Partial<AuthPayload> = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      emailVerified: user.emailVerified,
    };

    const [access_token, refresh_token] = await Promise.all([
      await this.tokensService.generateAccessToken(payload),
      await this.tokensService.rotateRefreshToken(user, req, payload),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async signUp(userData: UserSaveDto): Promise<UserDto> {
    const user = await this.usersService.saveUser(userData);
    return Mapper.mapToDto(user, UserDto) as UserDto;
  }

  async logout(req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.tokensService.revokeLastRefreshToken(userId, req);
  }

  async refreshAccessToken(refreshToken: string, request: Request) {
    return await this.tokensService.refreshAccessToken(refreshToken, request);
  }

  private async checkPassword(password?: string, user?: User) {
    if (!password || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
