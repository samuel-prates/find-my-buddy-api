import { HttpExceptionFilter } from '../../../src/presentation/filters/http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockLogger: Partial<Logger>;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      url: '/test-url',
    };
    
    mockResponse = {
      status: mockStatus,
    };
    
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ArgumentsHost;

    // Mock the Logger to avoid actual logging during tests
    mockLogger = {
      error: jest.fn(),
    };

    filter = new HttpExceptionFilter();
    // Replace the real logger with our mock
    (filter as any).logger = mockLogger;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException', () => {
      // Arrange
      const message = 'Test error message';
      const status = HttpStatus.BAD_REQUEST;
      const exception = new HttpException(
        {
          message,
          error: 'Bad Request',
        },
        status,
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(status);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: status,
          path: mockRequest.url,
          error: 'Bad Request',
          message: [message],
        }),
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle HttpException with string response', () => {
      // Arrange
      const message = 'Test error message';
      const status = HttpStatus.BAD_REQUEST;
      const exception = new HttpException(message, status);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(status);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: status,
          path: mockRequest.url,
          error: 'Error',
          message: [message],
        }),
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle non-HttpException errors', () => {
      // Arrange
      const exception = new Error('Unexpected error');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: mockRequest.url,
          error: 'Internal Server Error',
          message: ['Internal server error'],
        }),
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      // Arrange
      const exception = 'String exception';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: mockRequest.url,
          error: 'Internal Server Error',
          message: ['Internal server error'],
        }),
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle array of messages', () => {
      // Arrange
      const messages = ['Error 1', 'Error 2'];
      const status = HttpStatus.BAD_REQUEST;
      const exception = new HttpException(
        {
          message: messages,
          error: 'Bad Request',
        },
        status,
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(status);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: status,
          path: mockRequest.url,
          error: 'Bad Request',
          message: messages,
        }),
      );
    });
  });
});