import { MockStepExecutorAdapter } from './mock-step-executor.adapter.js';
import type { StepConfig } from '../../domain/ports/step-executor.port.js';

describe('MockStepExecutorAdapter', () => {
  let adapter: MockStepExecutorAdapter;

  beforeEach(() => {
    adapter = new MockStepExecutorAdapter();
  });

  it('should return a StepResult with the correct step name', async () => {
    const config: StepConfig = { name: 'test_step', minMs: 10, maxMs: 20 };
    const result = await adapter.execute(config);

    expect(result.step).toBe('test_step');
    expect(result.status).toBe('success');
  });

  it('should take at least minMs to execute', async () => {
    const config: StepConfig = { name: 'slow_step', minMs: 50, maxMs: 60 };
    const start = Date.now();

    await adapter.execute(config);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45); // small tolerance
  });

  it('should record timeMs accurately', async () => {
    const config: StepConfig = { name: 'timed_step', minMs: 30, maxMs: 50 };
    const result = await adapter.execute(config);

    expect(result.timeMs).toBeGreaterThanOrEqual(25);
    expect(result.timeMs).toBeLessThanOrEqual(100);
  });
});
