import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestContext, createRequestContext } from '@/shared/context/request-context.js';

const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incomingId = req.headers[CORRELATION_ID_HEADER] as string | undefined;
    const ctx = createRequestContext(incomingId);

    res.setHeader(CORRELATION_ID_HEADER, ctx.correlationId);

    requestContext.run(ctx, () => {
      next();
    });
  }
}
