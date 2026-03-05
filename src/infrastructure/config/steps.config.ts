import type { StepConfig } from '../../domain/ports/step-executor.port.js';

export const PAYMENT_STEPS: StepConfig[] = [
  { name: 'account_validation', minMs: 450, maxMs: 730 },
  { name: 'card_validation', minMs: 300, maxMs: 800 },
  { name: 'anti_fraud', minMs: 700, maxMs: 1500 },
  { name: 'acquirer_processing', minMs: 1000, maxMs: 2500 },
  { name: 'payment', minMs: 800, maxMs: 1250 },
  { name: 'notification', minMs: 200, maxMs: 300 },
];
