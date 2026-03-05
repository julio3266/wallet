import { PaymentStatus } from '@/domain/enums/payment-status.enum.js';
import { CardInfo } from '@/domain/value-objects/card-info.vo.js';
import { StepResult } from '@/domain/value-objects/step-results.vo.js';

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
    if (this._steps.length === 0) {
      return PaymentStatus.ERROR;
    }

    const hasFailed = this._steps.some((s) => s.status === 'failed');
    return hasFailed ? PaymentStatus.REJECTED : PaymentStatus.APPROVED;
  }
}
