import { StepResult } from '@/domain/value-objects/step-results.vo.js';

describe('StepResult Value Object', () => {
  it('should create with default status "success"', () => {
    const result = new StepResult('account_validation', 500);

    expect(result.step).toBe('account_validation');
    expect(result.timeMs).toBe(500);
    expect(result.status).toBe('success');
  });

  it('should accept explicit status "skipped"', () => {
    const result = new StepResult('notification', 300, 'skipped');

    expect(result.status).toBe('skipped');
  });

  it('should accept explicit status "failed"', () => {
    const result = new StepResult('anti_fraud', 800, 'failed');

    expect(result.step).toBe('anti_fraud');
    expect(result.timeMs).toBe(800);
    expect(result.status).toBe('failed');
  });
});
