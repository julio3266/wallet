export class StepResult {
  readonly step: string;
  readonly timeMs: number;
  readonly status: 'success' | 'skipped';

  constructor(step: string, timeMs: number, status: 'success' | 'skipped' = 'success') {
    this.step = step;
    this.timeMs = timeMs;
    this.status = status;
  }
}
