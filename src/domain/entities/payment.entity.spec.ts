import { PaymentStatus } from '../enums/payment-status.enum';
import { CardInfo } from '../value-objects/card-info.vo';
import { StepResult } from '../value-objects/step-results.vo.js';
import { Payment } from './payment.entity.js';

const mockCard = new CardInfo('4111111111111111', '123', '12/28', 'JULIO VALENTE');

describe('Payment Entity', () => {
  it('should create a payment with transactionId, amount and card', () => {
    const payment = new Payment('txn_123', 100, mockCard);

    expect(payment.transactionId).toBe('txn_123');
    expect(payment.amount).toBe(100);
    expect(payment.card.maskedCardNumber).toBe('**** **** **** 1111');
    expect(payment.steps).toEqual([]);
  });

  it('should add a single step', () => {
    const payment = new Payment('txn_123', 100, mockCard);
    const step = new StepResult('account_validation', 500);

    payment.addStep(step);

    expect(payment.steps).toHaveLength(1);
    expect(payment.steps[0].step).toBe('account_validation');
  });

  it('should add multiple steps at once', () => {
    const payment = new Payment('txn_123', 100, mockCard);
    const steps = [
      new StepResult('account_validation', 500),
      new StepResult('card_validation', 400),
    ];

    payment.addSteps(steps);

    expect(payment.steps).toHaveLength(2);
  });

  it('should return a defensive copy of steps', () => {
    const payment = new Payment('txn_123', 100, mockCard);
    payment.addStep(new StepResult('account_validation', 500));

    const steps = payment.steps;
    steps.push(new StepResult('hacked', 0));

    expect(payment.steps).toHaveLength(1);
  });

  it('should calculate totalTimeMs from creation', () => {
    const payment = new Payment('txn_123', 100, mockCard);

    expect(payment.totalTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('should resolve status as approved or rejected', () => {
    const payment = new Payment('txn_123', 100, mockCard);
    const status = payment.resolveStatus();

    expect([PaymentStatus.APPROVED, PaymentStatus.REJECTED]).toContain(status);
  });
});
