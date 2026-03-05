import { StepResult } from './step-results.vo';

describe('StepResult Value Object', () => {
  it('should create with default status "success"', () => {
    const result = new StepResult('account_validation', 500);

    expect(result.step).toBe('account_validation');
    expect(result.timeMs).toBe(500);
    expect(result.status).toBe('success');
  });

  it('should accept explicit status', () => {
    const result = new StepResult('notification', 300, 'skipped');

    expect(result.status).toBe('skipped');
  });
});
