import { Request } from 'express';
import { Role } from './role/role.model';

export class SignInDto {
  login: string;
  password: string;
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
