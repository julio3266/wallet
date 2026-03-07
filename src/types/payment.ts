export interface PaymentRequest {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  holderName: string;
  amount: string;
}

export interface PaymentStep {
  step: string;
  timeMs: number;
  status: 'success' | 'failed';
}

export interface PaymentResponse {
  status: 'approved' | 'rejected';
  transactionId?: string;
  correlationId?: string;
  totalTimeMs?: number;
  steps?: PaymentStep[];
  message?: string;
  error?: string;
}
