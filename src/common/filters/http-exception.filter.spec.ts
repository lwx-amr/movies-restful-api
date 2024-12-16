import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockArgumentsHost: any;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const mockRequest = {
      url: '/test-url',
      method: 'GET',
      connection: { remoteAddress: '127.0.0.1' },
      user: { uid: 'test-user' },
      body: { test: 'data' },
    };

    const mockResponse = {
      status: mockStatus,
    };

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    filter = new HttpExceptionFilter();
    // Move logger spy setup to beforeEach
    loggerSpy = jest.spyOn(filter['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should handle HttpException correctly', () => {
    const mockMessage = { message: 'Test error' };
    const exception = new HttpException(mockMessage, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-url',
        error: mockMessage,
      }),
    );
  });

  it('should handle non-HttpException as Internal Server Error', () => {
    const exception = new Error('Some internal error');

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-url',
        error: 'Internal Server Error',
      }),
    );
  });

  it('should include metadata in logged error', () => {
    const exception = new Error('Test error');

    filter.catch(exception, mockArgumentsHost);

    // Check if the logger was called with metadata containing httpRequest
    expect(loggerSpy).toHaveBeenCalled();
    const lastCallArgs = loggerSpy.mock.calls[0];
    const metadataArg = lastCallArgs[2];
    expect(metadataArg).toContain('"httpRequest"');
  });

  it('should handle exception with response data', () => {
    // Create an exception with response data
    const exception = {
      message: 'Test error',
      response: {
        data: { detail: 'More information' },
      },
      getStatus: () => HttpStatus.BAD_REQUEST,
      getResponse: () => ({ message: 'Test error' }),
    };

    filter.catch(exception, mockArgumentsHost);

    // Verify the logger was called with the expected metadata
    expect(loggerSpy).toHaveBeenCalled();
    const lastCallArgs = loggerSpy.mock.calls[0];
    const metadataArg = lastCallArgs[2];
    expect(metadataArg).toContain('"httpResponse"');
  });

  it('should handle missing user data', () => {
    // Create a mock request without user data
    const mockRequestWithoutUser = {
      url: '/test-url',
      method: 'GET',
      connection: { remoteAddress: '127.0.0.1' },
      body: { test: 'data' },
    };

    const mockArgumentsHostWithoutUser = {
      switchToHttp: () => ({
        getResponse: () => ({ status: mockStatus }),
        getRequest: () => mockRequestWithoutUser,
      }),
    };

    const exception = new Error('Test error');

    filter.catch(exception, mockArgumentsHostWithoutUser as any);

    // Verify the logger was called with the expected metadata
    expect(loggerSpy).toHaveBeenCalled();
    const lastCallArgs = loggerSpy.mock.calls[0];
    const metadataArg = lastCallArgs[2];
    expect(metadataArg).toContain('"httpRequest"');
  });

  it('should include stack trace in metadata', () => {
    const exception = new Error('Test error');

    filter.catch(exception, mockArgumentsHost);

    expect(loggerSpy).toHaveBeenCalled();
    const lastCallArgs = loggerSpy.mock.calls[0];
    const metadataArg = lastCallArgs[2];
    expect(metadataArg).toContain('"stack_trace"');
  });
});
