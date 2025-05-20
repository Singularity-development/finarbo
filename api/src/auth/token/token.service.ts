import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthPayload } from '../auth.model';
import { User } from '../users/user.entity';
import { DevicesService } from '../device/device.service';
import { TokensConfigService } from './token-config.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private devicesService: DevicesService,
    private tokensConfigService: TokensConfigService,
  ) {}

  async refreshAccessToken(plainRefreshToken: string, request: Request) {
    try {
      const payload: AuthPayload =
        await this.jwtService.verifyAsync<AuthPayload>(plainRefreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });

      const userId = payload.sub;
      const userAgent = request.get('User-Agent');
      const currentDevice = await this.devicesService.getUserDeviceByAgent(
        userId,
        userAgent!,
      );

      if (!currentDevice) {
        throw new UnauthorizedException('Unrecognized device');
      }

      const existingToken = await this.getLastRefreshTokenByDevice(
        userId,
        currentDevice.id,
      );

      if (!existingToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (existingToken.revoked) {
        throw new UnauthorizedException('Refresh token revoked');
      }

      if (existingToken.expiresAt < new Date()) {
        existingToken.revoked = false;
        await this.refreshTokenRepository.save(existingToken);
        throw new UnauthorizedException('Refresh token expired');
      }

      const isMatch = await bcrypt.compare(
        plainRefreshToken,
        existingToken?.tokenHash,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const authPayload: Partial<AuthPayload> = {
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
        roles: payload.roles,
        emailVerified: payload.emailVerified,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(authPayload),
        this.rotateRefreshToken(existingToken.user, request, authPayload),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async generateAccessToken(
    payload: Partial<AuthPayload>,
    algorithm: jwt.Algorithm = TokensConfigService.DEFAULT_ALGORITHM,
  ): Promise<string> {
    const { secret, expiresIn } = this.tokensConfigService.getJwtAccessConfig();
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
      algorithm,
    });
  }

  async rotateRefreshToken(
    user: User,
    request: Request,
    payload: Partial<AuthPayload>,
    algorithm: jwt.Algorithm = TokensConfigService.DEFAULT_ALGORITHM,
  ) {
    // generate a new refresh token
    const token = await this.generateRefreshToken(payload, algorithm);

    // revoke the last refresh token
    await this.revokeLastRefreshToken(user.id, request);

    // save the new refresh token
    await this.saveRefreshToken(user, request, token);

    return token;
  }

  async getLastRefreshTokenByDevice(userId: string, deviceId: string) {
    return await this.refreshTokenRepository.findOne({
      where: { user: { id: userId }, device: { id: deviceId } },
      order: { createdAt: 'DESC' },
    });
  }

  async revokeLastRefreshToken(userId: string, req: Request) {
    const userAgent = req.get('User-Agent');
    const currentDevice = await this.devicesService.getUserDeviceByAgent(
      userId,
      userAgent!,
    );

    if (!currentDevice) {
      return;
    }

    const existingToken = await this.getLastRefreshTokenByDevice(
      userId,
      currentDevice.id,
    );

    if (existingToken && !existingToken.revoked) {
      existingToken.revoked = true;
      await this.refreshTokenRepository.save(existingToken);
    }
  }

  private async generateRefreshToken(
    payload: Partial<AuthPayload>,
    algorithm: jwt.Algorithm = TokensConfigService.DEFAULT_ALGORITHM,
  ): Promise<string> {
    const { secret, expiresIn } =
      this.tokensConfigService.getJwtRefreshConfig();
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
      algorithm,
    });

    return token;
  }

  private async saveRefreshToken(user: User, request: Request, token: string) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    const days =
      this.configService.get<number>('JWT_REFRESH_SECRET_EXPIRATION_DAYS') ??
      30;
    refreshToken.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    refreshToken.tokenHash = await bcrypt.hash(token, 10);
    refreshToken.device = await this.devicesService.saveUserDevice(
      user,
      request,
    );

    return this.refreshTokenRepository.save(refreshToken);
  }
}
