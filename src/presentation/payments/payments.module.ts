import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module.js';
import { PaymentsController } from '@/presentation/payments/payments.controller.js';
import { ProcessPaymentUseCase } from '@/application/use-cases/process-payment.use_case.js';

@Module({
  imports: [InfrastructureModule],
  controllers: [PaymentsController],
  providers: [ProcessPaymentUseCase],
})
export class PaymentsModule {}
