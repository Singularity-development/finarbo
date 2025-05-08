import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Role } from '../role/role.model';
import * as bcrypt from 'bcrypt';
import { UserSaveDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      throw new Error('Email already used');
    }

    const user = new User();
    user.login = userData.login;
    user.email = userData.email;
    user.username = userData.username;
    user.passwordHash = await bcrypt.hash(userData.password, 10);
    user.roles = [Role.User];
    user.emailVerified = false;

    return await this.usersRepository.save(user);
  }
}
