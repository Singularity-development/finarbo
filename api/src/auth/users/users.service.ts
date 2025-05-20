import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Role } from '../role/role.model';
import * as bcrypt from 'bcrypt';
import { UserSaveDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_ERRORS } from './errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { login } });
  }

  async saveUser(userData: UserSaveDto): Promise<User | undefined> {
    const emailAlreadyUsed =
      (await this.usersRepository.findOne({
        where: { email: userData.email },
      })) !== null;

    if (emailAlreadyUsed) {
      throw USER_ERRORS.EMAIL_ALREADY_USED;
    }

    const user = new User();
    user.login = userData.email;
    user.email = userData.email;
    user.username = userData.username;
    user.passwordHash = await bcrypt.hash(userData.password, 10);
    user.roles = [Role.User];
    user.emailVerified = true; // TODO: #4 Implement Email Verification System - see https://github.com/Singularity-development/finarbo/issues/4

    return await this.usersRepository.save(user);
  }
}
