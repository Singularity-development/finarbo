import { Role } from '../role/role.model';

export type User = {
  id: string;
  login: string;
  email: string;
  username: string;
  password: string;
  roles: Role[];
  emailVerified: boolean;
};
