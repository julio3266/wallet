export class StepResults {
  readonly step: string;
  readonly timeMs: number;
  readonly status: 'success' | 'skipper';

  constructor(step: string, timeMs: number, status: 'success' | 'skipper' = 'success') {
    this.step = step;
    this.timeMs = timeMs;
    this.status = status;
  }
}
