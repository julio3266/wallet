import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Payment } from '@/domain/entities/payment.entity.js';
import { CardInfo } from '@/domain/value-objects/card-info.vo.js';
import { PaymentStatus } from '@/domain/enums/payment-status.enum.js';
import { StepExecutorPort, StepConfig } from '@/domain/ports/step-executor.port.js';
import { PAYMENT_STEPS } from '@/infrastructure/config/steps.config.js';
import { getCorrelationId } from '@/shared/context/request-context.js';

export interface ProcessPaymentInput {
  amount: number;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  holderName: string;
}

export interface ProcessPaymentOutput {
  status: PaymentStatus;
  transactionId: string;
  totalTimeMs: number;
  correlationId: string;
  steps: { step: string; timeMs: number; status: string }[];
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(private readonly stepExecutor: StepExecutorPort) {}

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput> {
    const transactionId = `txn_${randomUUID()}`;
    const correlationId = getCorrelationId();
    const card = new CardInfo(input.cardNumber, input.cvv, input.expirationDate, input.holderName);
    const payment = new Payment(transactionId, input.amount, card);

    this.logger.log(
      `[${correlationId}] [${transactionId}] Starting pipeline | amount=${input.amount}`,
    );

    const steps = PAYMENT_STEPS;

    const parallelSteps = steps.filter((s) => this.isParallelizable(s));
    const sequentialSteps = steps.filter((s) => !this.isParallelizable(s));

    const parallelResults = await Promise.all(
      parallelSteps.map((config) => this.runStep(config, transactionId, correlationId)),
    );
    payment.addSteps(parallelResults);

    for (const config of sequentialSteps) {
      const result = await this.runStep(config, transactionId, correlationId);
      payment.addStep(result);
    }

    const status = payment.resolveStatus();

    this.logger.log(
      `[${correlationId}] [${transactionId}] Pipeline completed | status=${status} | totalTimeMs=${payment.totalTimeMs}`,
    );

    return {
      status,
      transactionId: payment.transactionId,
      totalTimeMs: payment.totalTimeMs,
      correlationId,
      steps: payment.steps,
    };
  }

  private async runStep(config: StepConfig, transactionId: string, correlationId: string) {
    this.logger.debug(`[${correlationId}] [${transactionId}] Step "${config.name}" started`);

    const result = await this.stepExecutor.execute(config);

    this.logger.debug(
      `[${correlationId}] [${transactionId}] Step "${config.name}" completed | timeMs=${result.timeMs}`,
    );

    return result;
  }

  private isParallelizable(config: StepConfig): boolean {
    const parallelStepNames = ['account_validation', 'card_validation'];
    return parallelStepNames.includes(config.name);
  }
}
