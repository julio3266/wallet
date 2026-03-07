import { PaymentStatus } from '@/domain/enums/payment-status.enum.js';

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

export abstract class ProcessPaymentUseCase {
  abstract execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput>;
}
