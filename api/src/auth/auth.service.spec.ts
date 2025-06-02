import { Request } from 'express';
import { AuthService } from './auth.service';
import { AUTH_ERRORS } from './errors';
import { Role } from './role/role.model';
import { TokensService } from './token/token.service';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService - signIn', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let tokensService: Partial<TokensService>;
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    login: 'test@example.com',
    passwordHash: 'hashedpassword',
    emailVerified: true,
    roles: [Role.User],
    createdAt: new Date(),
    isActive: false,
  };

  beforeEach(() => {
    usersService = {
      findOneByLogin: jest.fn(),
    };

    tokensService = {
      generateAccessToken: jest.fn(),
      rotateRefreshToken: jest.fn(),
    };

    authService = new AuthService(
      usersService as UsersService,
      tokensService as TokensService,
    );
  });

  it('should throw INVALID_CREDENTIALS if user password or email is wrong', async () => {
    const hashPassword = await bcrypt.hash('realPassword', 10);
    mockUser.passwordHash = hashPassword;

    (usersService.findOneByLogin as jest.Mock).mockImplementation(
      (login: string) => {
        if (login === mockUser.login) {
          return Promise.resolve(mockUser);
        } else {
          return Promise.resolve(null);
        }
      },
    );

    const mockReq = {} as Request;

    // Wrong login
    await expect(
      authService.signIn(mockUser.login + '?', 'realPassword', mockReq),
    ).rejects.toEqual(AUTH_ERRORS.INVALID_CREDENTIALS);

    // Wrong password
    await expect(
      authService.signIn(mockUser.login, 'fakePassword', mockReq),
    ).rejects.toEqual(AUTH_ERRORS.INVALID_CREDENTIALS);

    // Successful login
    await expect(
      authService.signIn(mockUser.login, 'realPassword', mockReq),
    ).resolves.not.toThrow();
  });

  it('should throw EMAIL_NOT_VERIFIED if user email is not verified', async () => {
    mockUser.emailVerified = false; // Simulate unverified email

    (usersService.findOneByLogin as jest.Mock).mockResolvedValue(mockUser);
    // To skip password check
    jest.spyOn(authService as any, 'checkPassword').mockResolvedValue(true);

    const mockReq = {} as Request;

    await expect(
      authService.signIn('testuser', 'password123', mockReq),
    ).rejects.toEqual(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
  });
});
