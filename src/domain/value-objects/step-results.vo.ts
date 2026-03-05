export type StepStatus = 'success' | 'skipped' | 'failed';

export class StepResult {
  readonly step: string;
  readonly timeMs: number;
  readonly status: StepStatus;

  constructor(step: string, timeMs: number, status: StepStatus = 'success') {
    this.step = step;
    this.timeMs = timeMs;
    this.status = status;
  }
}
