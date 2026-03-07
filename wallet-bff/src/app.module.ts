import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PaymentsModule } from '@/presentation/payments/payments.module.js';
import { CorrelationIdMiddleware } from '@/shared/middleware/correlation-id.middleware.js';

@Module({
  imports: [PaymentsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
