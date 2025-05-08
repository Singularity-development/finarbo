import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthPayload } from '../auth.model';
import { User } from '../users/user.entity';
import { DevicesService } from '../device/device.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private devicesService: DevicesService,
  ) {}

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload: AuthPayload =
        await this.jwtService.verifyAsync<AuthPayload>(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });

      const existingToken = await this.getRefreshToken(refreshToken);

      if (!existingToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (existingToken.revoked) {
        throw new UnauthorizedException('Refresh token revoked');
      }

      if (existingToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      return {
        access_token: await this.generateAccessToken(payload),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async generateAccessToken(
    payload: Partial<AuthPayload>,
    algorithm: jwt.Algorithm = 'HS256',
  ): Promise<string> {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const expiresIn = `${this.configService.get<number>('JWT_ACCESS_SECRET_EXPIRATION_MINUTES') ?? 10}m`;

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
      algorithm,
    });
  }

  async generateRefreshToken(
    user: User,
    request: Request,
    payload: Partial<AuthPayload>,
    algorithm: jwt.Algorithm = 'HS256',
  ): Promise<string> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = `${this.configService.get<number>('JWT_REFRESH_SECRET_EXPIRATION_DAYS') ?? 30}d`;

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
      algorithm,
    });

    await this.saveRefreshToken(user, request, token);

    return token;
  }

  async getRefreshToken(token: string) {
    const tokenHash = await bcrypt.hash(token, 10);
    return await this.refreshTokenRepository.findOne({ where: { tokenHash } });
  }

  private async saveRefreshToken(user: User, request: Request, token: string) {
    const existingToken = await this.getRefreshToken(token);
    if (existingToken) {
      return existingToken;
    }

    const refreshToken = new RefreshToken();
    refreshToken.tokenHash = await bcrypt.hash(token, 10);
    refreshToken.user = user;

    const days =
      this.configService.get<number>('JWT_REFRESH_SECRET_EXPIRATION_DAYS') ??
      30;
    refreshToken.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const savedToken = await this.refreshTokenRepository.save(refreshToken);
    await this.devicesService.saveUserDevice(refreshToken, request);

    return savedToken;
  }
}
