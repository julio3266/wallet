import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { getCorrelationId } from '../context/request-context.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const correlationId = getCorrelationId();
    const start = Date.now();

    this.logger.log(`[${correlationId}] → ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        const res = context.switchToHttp().getResponse<{ statusCode: number }>();
        this.logger.log(
          `[${correlationId}] ← ${method} ${url} ${String(res.statusCode)} ${String(elapsed)}ms`,
        );
      }),
    );
  }
}
