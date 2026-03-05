import { PaymentStatus } from '../enums/payment-status.enum.js';
import { CardInfo } from '../value-objects/card-info.vo.js';
import { StepResult } from '../value-objects/step-results.vo.js';

const REJECTION_RATE = 0.1;

export class Payment {
  private readonly _steps: StepResult[] = [];
  private readonly _startTime: number;

  constructor(
    public readonly transactionId: string,
    public readonly amount: number,
    public readonly card: CardInfo,
  ) {
    this._startTime = Date.now();
  }

  addStep(step: StepResult): void {
    this._steps.push(step);
  }

  addSteps(steps: StepResult[]): void {
    steps.forEach((s) => this._steps.push(s));
  }

  get steps(): StepResult[] {
    return [...this._steps];
  }

  get totalTimeMs(): number {
    return Date.now() - this._startTime;
  }

  resolveStatus(): PaymentStatus {
    return Math.random() < REJECTION_RATE ? PaymentStatus.REJECTED : PaymentStatus.APPROVED;
  }
}
