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
import { ApiProperty } from '@nestjs/swagger';

export class UserSaveDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@domain.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'name' })
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({ example: 'strongPassword' })
  password: string;
}

export class BasicUserDto {
  @Expose()
  @IsString()
  @ApiProperty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'email@domain.com' })
  login: string;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@domain.com' })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty()
  username: string;
}

export class UserDto extends BasicUserDto {
  @Expose()
  @IsArray()
  @IsOptional()
  @ApiProperty({ example: [Role.User] })
  roles: Role[];

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  emailVerified: boolean;
}
