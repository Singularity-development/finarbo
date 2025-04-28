import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../role/role.model';

export class UserSaveDto {
  @Expose()
  @IsString()
  login: string;

  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}

export class UserDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  login: string;

  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsArray()
  @IsOptional()
  roles: Role[];

  @Expose()
  @IsBoolean()
  @IsOptional()
  emailVerified: boolean;
}
