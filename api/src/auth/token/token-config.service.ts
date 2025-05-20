import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokensConfigService {
  constructor(private configService: ConfigService) {}

  static DEFAULT_ALGORITHM: jwt.Algorithm = 'HS256';

  getJwtAccessConfig(): { secret: string; expiresIn: string } {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    const expiresIn = `${this.configService.get<number>('JWT_ACCESS_SECRET_EXPIRATION_MINUTES') ?? 10}m`;
    return { secret, expiresIn };
  }

  getJwtRefreshConfig(): { secret: string; expiresIn: string } {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    const expiresIn = `${this.configService.get<number>('JWT_REFRESH_SECRET_EXPIRATION_DAYS') ?? 30}d`;
    return { secret, expiresIn };
  }
}
