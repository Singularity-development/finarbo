import { BadRequestException } from '@nestjs/common';

export const USER_ERRORS = Object.freeze({
  EMAIL_ALREADY_USED: new BadRequestException({
    message: 'Email already used',
    code: 'EMAIL_ALREADY_USED',
  }),
});
