import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { Role } from '../role/role.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '1',
      login: 'federicofruiz@hotmail.com',
      email: 'federicofruiz@hotmail.com',
      username: 'Federico Ruiz',
      password: 'test1234',
      roles: [Role.Admin],
      emailVerified: true,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async saveUser(user: User): Promise<User | undefined> {
    const hash = await bcrypt.hash(user.password, 10);

    return this.users.find((user) => user.username === username);
  }
}
