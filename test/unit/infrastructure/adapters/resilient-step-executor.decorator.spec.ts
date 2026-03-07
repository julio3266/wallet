import { StepConfig } from '@/domain/ports/step-executor.port.js';
import { StepResult } from '@/domain/value-objects/step-results.vo.js';
import { MockStepExecutorAdapter } from '@/infrastructure/adapters/mock-step-executor.adapter.js';
import { ResilientStepExecutorDecorator } from '@/infrastructure/adapters/resilient-step-executor.decorator.js';

const baseConfig: StepConfig = { name: 'test-step', minMs: 10, maxMs: 50 };

function createDecorator(inner: MockStepExecutorAdapter) {
  return new ResilientStepExecutorDecorator(inner);
}

describe('ResilientStepExecutorDecorator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the result when inner succeeds on first attempt', async () => {
    const inner = new MockStepExecutorAdapter();
    const expected = new StepResult('test-step', 20);
    const spy = jest.spyOn(inner, 'execute').mockResolvedValue(expected);

    const decorator = createDecorator(inner);
    const result = await decorator.execute(baseConfig);

    expect(result).toBe(expected);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should retry and succeed on second attempt', async () => {
    const inner = new MockStepExecutorAdapter();
    const expected = new StepResult('test-step', 20);
    const spy = jest
      .spyOn(inner, 'execute')
      .mockRejectedValueOnce(new Error('transient'))
      .mockResolvedValueOnce(expected);

    const decorator = createDecorator(inner);
    const promise = decorator.execute(baseConfig);

    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;
    expect(result).toBe(expected);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should retry and succeed on third attempt', async () => {
    const inner = new MockStepExecutorAdapter();
    const expected = new StepResult('test-step', 20);
    const spy = jest
      .spyOn(inner, 'execute')
      .mockRejectedValueOnce(new Error('fail-1'))
      .mockRejectedValueOnce(new Error('fail-2'))
      .mockResolvedValueOnce(expected);

    const decorator = createDecorator(inner);
    const promise = decorator.execute(baseConfig);

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const result = await promise;
    expect(result).toBe(expected);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should throw after exhausting all retries', async () => {
    const inner = new MockStepExecutorAdapter();
    const spy = jest.spyOn(inner, 'execute').mockRejectedValue(new Error('permanent'));

    const decorator = createDecorator(inner);
    const promise = decorator.execute(baseConfig);
    const assertion = expect(promise).rejects.toThrow(
      'Step "test-step" failed after 3 attempts: permanent',
    );

    await jest.runAllTimersAsync();
    await assertion;

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should throw on timeout when inner takes too long', async () => {
    const inner = new MockStepExecutorAdapter();
    const timeoutMs = baseConfig.maxMs * 3;
    jest
      .spyOn(inner, 'execute')
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(new StepResult('test-step', 999)), timeoutMs + 1000),
          ),
      );

    const decorator = createDecorator(inner);
    const promise = decorator.execute(baseConfig);
    const assertion = expect(promise).rejects.toThrow('Step "test-step" failed after 3 attempts');

    await jest.runAllTimersAsync();
    await assertion;
  });

  it('should apply exponential backoff between retries', async () => {
    const inner = new MockStepExecutorAdapter();
    const expected = new StepResult('test-step', 20);
    const calls: number[] = [];

    jest.spyOn(inner, 'execute').mockImplementation(() => {
      calls.push(Date.now());
      if (calls.length < 3) {
        return Promise.reject(new Error('fail'));
      }
      return Promise.resolve(expected);
    });

    const decorator = createDecorator(inner);
    const promise = decorator.execute(baseConfig);

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const result = await promise;
    expect(result).toBe(expected);
    expect(calls).toHaveLength(3);
    expect(calls[1] - calls[0]).toBeGreaterThanOrEqual(100);
    expect(calls[2] - calls[1]).toBeGreaterThanOrEqual(200);
  });
});
