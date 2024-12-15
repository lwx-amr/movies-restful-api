import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { of, firstValueFrom } from 'rxjs';
import { CacheInterceptor } from './cache.interceptor';

describe('CacheInterceptor', () => {
  let interceptor: CacheInterceptor;
  let cacheManager: jest.Mocked<Cache>;
  let configService: jest.Mocked<ConfigService>;

  const mockRequest = {
    method: 'GET',
    originalUrl: '/api/test',
    query: { page: '1' },
    params: { id: '123' },
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    }),
  } as unknown as ExecutionContext;

  const mockCallHandler = {
    handle: jest.fn(),
  } as unknown as CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheInterceptor,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<CacheInterceptor>(CacheInterceptor);
    cacheManager = module.get(CACHE_MANAGER) as jest.Mocked<Cache>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should return cached response when cache hit', async () => {
      const cachedData = { data: 'cached' };
      cacheManager.get.mockResolvedValue(cachedData);

      const resultObservable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
      const result = await firstValueFrom(resultObservable);

      expect(result).toEqual(cachedData);
      expect(cacheManager.get).toHaveBeenCalledWith('GET:/api/test:{"page":"1"}:{"id":"123"}');
      expect(mockCallHandler.handle).not.toHaveBeenCalled();
    });

    it('should handle cache miss and store new response', async () => {
      const responseData = { data: 'fresh' };
      cacheManager.get.mockResolvedValue(null);
      (mockCallHandler.handle as any).mockReturnValue(of(responseData));
      configService.get.mockReturnValue(10);

      const resultObservable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
      const result = await firstValueFrom(resultObservable);

      expect(result).toEqual(responseData);
      expect(cacheManager.get).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('GET:/api/test:{"page":"1"}:{"id":"123"}', responseData, 60000);
      expect(mockCallHandler.handle).toHaveBeenCalled();
    });

    it('should generate correct cache key with different request parameters', async () => {
      const differentRequest = {
        method: 'POST',
        originalUrl: '/api/different',
        query: { filter: 'active' },
        params: { userId: '456' },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(differentRequest),
        }),
      } as unknown as ExecutionContext;

      cacheManager.get.mockResolvedValue(null);
      (mockCallHandler.handle as any).mockReturnValue(of({ data: 'test' }));

      const resultObservable = await interceptor.intercept(mockContext, mockCallHandler);
      await firstValueFrom(resultObservable);

      expect(cacheManager.get).toHaveBeenCalledWith('POST:/api/different:{"filter":"active"}:{"userId":"456"}');
    });

    it('should handle undefined query and params', async () => {
      const requestWithoutQueryAndParams = {
        method: 'GET',
        originalUrl: '/api/simple',
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(requestWithoutQueryAndParams),
        }),
      } as unknown as ExecutionContext;

      cacheManager.get.mockResolvedValue(null);
      (mockCallHandler.handle as any).mockReturnValue(of({ data: 'test' }));

      const resultObservable = await interceptor.intercept(mockContext, mockCallHandler);
      await firstValueFrom(resultObservable);

      expect(cacheManager.get).toHaveBeenCalledWith('GET:/api/simple:undefined:undefined');
    });

    it('should use correct TTL from config service', async () => {
      cacheManager.get.mockResolvedValue(null);
      (mockCallHandler.handle as any).mockReturnValue(of({ data: 'test' }));
      configService.get.mockReturnValue(20);

      const resultObservable = await interceptor.intercept(mockExecutionContext, mockCallHandler);
      await firstValueFrom(resultObservable);

      expect(cacheManager.set).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 120000);
    });
  });
});
