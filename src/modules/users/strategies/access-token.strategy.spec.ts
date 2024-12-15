import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './access-token.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('AccessTokenStrategy', () => {
  let strategy: AccessTokenStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.accessSecret') {
                return 'testAccessSecret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return the payload on validate', () => {
    const payload = { sub: 1, username: 'testuser' };
    const result = strategy.validate(payload);
    expect(result).toEqual(payload);
  });

  it('should throw an UnauthorizedException if payload is invalid', () => {
    const invalidPayload = null;
    try {
      strategy.validate(invalidPayload);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
