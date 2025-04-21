import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './auth.model';
import { User } from './users/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    login: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(login);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.checkPassword(password, user);

    const payload: Partial<AuthPayload> = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      emailVerified: user.emailVerified,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async checkPassword(password?: string, user?: User) {
    if (!password || !user) {
      throw new UnauthorizedException();
    }

    const hash = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(user.password, hash);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
  }
}
