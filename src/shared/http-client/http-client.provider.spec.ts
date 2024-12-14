import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpClientProvider } from './http-client.provider';

const createMockAxiosInstance = () => {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };
};

describe('HttpClientProvider', () => {
  let httpClientProvider: HttpClientProvider;
  let mockAxiosInstance: ReturnType<typeof createMockAxiosInstance>;
  let mockConfigService;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue(5000),
    };

    mockAxiosInstance = createMockAxiosInstance();

    jest.spyOn(axios, 'create').mockReturnValue(mockAxiosInstance as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpClientProvider, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    httpClientProvider = module.get<HttpClientProvider>(HttpClientProvider);
  });

  describe('Interceptors', () => {
    beforeEach(async () => {
      mockAxiosInstance = createMockAxiosInstance();
      jest.spyOn(axios, 'create').mockReturnValue(mockAxiosInstance as any);

      const module: TestingModule = await Test.createTestingModule({
        providers: [HttpClientProvider, { provide: ConfigService, useValue: mockConfigService }],
      }).compile();

      httpClientProvider = module.get<HttpClientProvider>(HttpClientProvider);
    });

    let mockAxiosInstance: ReturnType<typeof createMockAxiosInstance>;

    it('should set up request interceptor', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1);

      const requestInterceptor = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
      const mockConfig = { url: 'https://example.com' };

      const result = requestInterceptor(mockConfig);
      expect(result).toBe(mockConfig);
    });

    it('should set up response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1);

      const responseInterceptor = (mockAxiosInstance.interceptors.response.use as jest.Mock).mock.calls[0][0];
      const mockResponse = { config: { url: 'https://example.com' } };

      const result = responseInterceptor(mockResponse);
      expect(result).toBe(mockResponse);
    });

    it('should handle request interceptor errors', async () => {
      const errorHandler = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][1];
      const mockError = new Error('Request Error');

      await expect(errorHandler(mockError)).rejects.toThrow('Request Error');
    });

    it('should handle response interceptor errors', async () => {
      const errorHandler = (mockAxiosInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];
      const mockError = new Error('Response Error');

      await expect(errorHandler(mockError)).rejects.toThrow('Response Error');
    });
  });

  describe('HTTP Methods', () => {
    const mockUrl = 'https://example.com/api';
    const mockData = { key: 'value' };
    const mockConfig = { headers: { Authorization: 'Bearer token' } };
    const mockResponse = { data: { result: 'success' } };

    beforeEach(() => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      mockAxiosInstance.put.mockResolvedValue(mockResponse);
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
    });

    it('should call axios get method correctly', async () => {
      const response = await httpClientProvider.get(mockUrl, mockConfig);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(mockUrl, mockConfig);
      expect(response).toEqual(mockResponse);
    });

    it('should call axios post method correctly', async () => {
      const response = await httpClientProvider.post(mockUrl, mockData, mockConfig);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(mockUrl, mockData, mockConfig);
      expect(response).toEqual(mockResponse);
    });

    it('should call axios put method correctly', async () => {
      const response = await httpClientProvider.put(mockUrl, mockData, mockConfig);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(mockUrl, mockData, mockConfig);
      expect(response).toEqual(mockResponse);
    });

    it('should call axios delete method correctly', async () => {
      const response = await httpClientProvider.delete(mockUrl, mockConfig);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(mockUrl, mockConfig);
      expect(response).toEqual(mockResponse);
    });
  });
});
