import { UnauthorizedException } from '@nestjs/common';

export const AUTH_ERRORS = Object.freeze({
  INVALID_CREDENTIALS: new UnauthorizedException({
    message: 'Invalid credentials',
    code: 'INVALID_CREDENTIALS',
  }),
  EMAIL_NOT_VERIFIED: new UnauthorizedException({
    message: 'Email not verified',
    code: 'EMAIL_NOT_VERIFIED',
  }),
});
