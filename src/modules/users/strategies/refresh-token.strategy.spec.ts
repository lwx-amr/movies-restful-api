import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { Request } from 'express';

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.refreshSecret') {
                return 'testRefreshSecret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return payload with refreshToken on validate', () => {
    const payload = { sub: 1, username: 'testuser' };
    const mockRequest = {
      get: jest.fn(() => 'Bearer mock-refresh-token'),
    } as unknown as Request;

    const result = strategy.validate(mockRequest, payload);
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
    expect(result).toEqual({ ...payload, refreshToken: 'mock-refresh-token' });
  });
});
