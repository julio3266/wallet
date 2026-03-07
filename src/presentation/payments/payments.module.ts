import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module.js';
import { PaymentsController } from '@/presentation/payments/payments.controller.js';
import { ProcessPaymentUseCase } from '@/application/use-cases/process-payment.use-case.js';
import { ProcessPaymentUseCaseImpl } from '@/application/use-cases/process-payment.use-case.impl.js';

@Module({
  imports: [InfrastructureModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: ProcessPaymentUseCase,
      useClass: ProcessPaymentUseCaseImpl,
    },
  ],
})
export class PaymentsModule {}
