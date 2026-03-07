import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { getCorrelationId } from '@/shared/context/request-context.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = getCorrelationId();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    this.logger.error(
      `[${correlationId}] Exception | status=${String(status)} | ${
        exception instanceof Error ? exception.message : String(exception)
      }`,
    );

    const body =
      typeof message === 'string'
        ? { statusCode: status, message, correlationId }
        : { ...message, correlationId };

    response.status(status).json(body);
  }
}
