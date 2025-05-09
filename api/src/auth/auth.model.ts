import { Request } from 'express';
import { Role } from './role/role.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@domain.com' })
  login: string;

  @IsString()
  @ApiProperty({ example: 'strongPassword' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export type AuthenticatedRequest = Request & { user: AuthPayload };

export type AuthPayload = {
  sub: string;
  username?: string;
  email?: string;
  roles?: Role[];
  iat: number;
  exp: number;
  emailVerified: boolean;
};
