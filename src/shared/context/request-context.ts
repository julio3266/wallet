import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

export interface RequestContext {
  correlationId: string;
  startTime: number;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function createRequestContext(correlationId?: string): RequestContext {
  return {
    correlationId: correlationId ?? randomUUID(),
    startTime: Date.now(),
  };
}

export function getCorrelationId(): string {
  return requestContext.getStore()?.correlationId ?? 'no-context';
}
