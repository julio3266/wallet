import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import * as requestContextModule from '@/shared/context/request-context.js';
import { AllExceptionsFilter } from '@/shared/filters/all-exceptions.filter.js';

function createMockHost(responseMock: { status: jest.Mock; json: jest.Mock }): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => responseMock,
      getRequest: () => ({}),
    }),
  } as unknown as ArgumentsHost;
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let responseMock: { status: jest.Mock; json: jest.Mock };
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    host = createMockHost(responseMock);
    jest.spyOn(requestContextModule, 'getCorrelationId').mockReturnValue('test-correlation-id');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle HttpException with string message', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Not Found',
      correlationId: 'test-correlation-id',
    });
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { statusCode: 400, message: 'Bad Request', error: 'Validation failed' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Bad Request',
        correlationId: 'test-correlation-id',
      }),
    );
  });

  it('should handle unknown exception as 500', () => {
    const exception = new Error('something broke');

    filter.catch(exception, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      correlationId: 'test-correlation-id',
    });
  });

  it('should handle non-Error exception as 500', () => {
    filter.catch('unexpected string error', host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      correlationId: 'test-correlation-id',
    });
  });

  it('should include correlationId in all error responses', () => {
    jest.spyOn(requestContextModule, 'getCorrelationId').mockReturnValue('abc-123');

    filter.catch(new Error('fail'), host);

    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({ correlationId: 'abc-123' }),
    );
  });
});
