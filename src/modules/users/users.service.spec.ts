import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { SinginDto } from './dto/sing-in.dto';
import { ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: Partial<Repository<User>>;
  let mockJwtService: Partial<JwtService>;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should find a user by id', async () => {
      const mockUser = { id: 1, username: 'testuser' } as User;
      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOneById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        fullName: 'New User',
      };

      const mockUser = {
        id: 1,
        username: createUserDto.username,
        fullName: createUserDto.fullName,
      } as User;

      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockUsersRepository.create as jest.Mock).mockReturnValue(mockUser);
      (mockUsersRepository.save as jest.Mock).mockResolvedValue(mockUser);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');
      (mockConfigService.get as jest.Mock).mockReturnValueOnce('accessSecret').mockReturnValueOnce('accessExpiration');

      const result = await service.signUp(createUserDto);

      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('user');
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'password123',
        fullName: 'Existing User',
      };

      const existingUser = { id: 1, username: createUserDto.username } as User;
      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(existingUser);

      await expect(service.signUp(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('should sign in a user with correct credentials', async () => {
      const signInDto: SinginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        username: signInDto.username,
        password: await argon2.hash(signInDto.password),
      } as User;

      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');

      const result = await service.signIn(signInDto);

      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('user');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const signInDto: SinginDto = {
        username: 'nonexistentuser',
        password: 'password123',
      };

      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for incorrect password', async () => {
      const signInDto: SinginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        username: signInDto.username,
        password: await argon2.hash('correctpassword'),
      } as User;

      (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.signIn(signInDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens for a valid refresh token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        refreshToken: await argon2.hash('oldRefreshToken'),
      } as User;

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValueOnce('newAccessToken').mockResolvedValueOnce('newRefreshToken');

      const result = await service.refreshTokens(1, 'oldRefreshToken');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw ForbiddenException for invalid refresh token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        refreshToken: await argon2.hash('differentRefreshToken'),
      } as User;

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockUser);

      await expect(service.refreshTokens(1, 'wrongRefreshToken')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token on logout', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
      } as User;

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(mockUsersRepository, 'update').mockResolvedValue({} as any);

      await service.logout(1);

      expect(mockUsersRepository.update).toHaveBeenCalledWith(1, { refreshToken: null });
    });

    it('should throw ForbiddenException if user not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      await expect(service.logout(1)).rejects.toThrow(ForbiddenException);
    });
  });
});
