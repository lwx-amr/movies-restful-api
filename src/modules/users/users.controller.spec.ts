import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SinginDto } from './dto/sing-in.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'password123',
        fullName: 'Test User',
      };

      const mockUserResponse = {
        id: 1,
        username: createUserDto.username,
        fullName: createUserDto.fullName,
      };

      (mockUsersService.signUp as jest.Mock).mockResolvedValue(mockUserResponse);

      const result = await controller.signup(createUserDto);

      expect(mockUsersService.signUp).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const signInDto: SinginDto = {
        username: 'test',
        password: 'password123',
      };

      const mockLoginResponse = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      (mockUsersService.signIn as jest.Mock).mockResolvedValue(mockLoginResponse);

      const result = await controller.login(signInDto);

      expect(mockUsersService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens for a user', async () => {
      const mockRequest = {
        user: {
          sub: '1',
          refreshToken: 'old_refresh_token',
        },
      };

      const mockTokenResponse = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };

      (mockUsersService.refreshTokens as jest.Mock).mockResolvedValue(mockTokenResponse);

      const result = await controller.refreshTokens(mockRequest);

      expect(mockUsersService.refreshTokens).toHaveBeenCalledWith('1', 'old_refresh_token');
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      const mockRequest = {
        user: {
          sub: '1',
        },
      };

      (mockUsersService.logout as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest);

      expect(mockUsersService.logout).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'successfully logged out' });
    });
  });
});
