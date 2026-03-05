import { Injectable, Logger } from '@nestjs/common';
import { StepExecutorPort, StepConfig } from '@/domain/ports/step-executor.port.js';
import { MockStepExecutorAdapter } from '@/infrastructure/adapters/mock-step-executor.adapter.js';
import { StepResult } from '@/domain/value-objects/step-results.vo.js';
import { RESILIENCE } from '@/infrastructure/config/steps.config.js';

@Injectable()
export class ResilientStepExecutorDecorator extends StepExecutorPort {
  private readonly logger = new Logger(ResilientStepExecutorDecorator.name);

  constructor(private readonly inner: MockStepExecutorAdapter) {
    super();
  }

  async execute(config: StepConfig): Promise<StepResult> {
    const timeoutMs = config.maxMs * RESILIENCE.TIMEOUT_MULTIPLIER;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= RESILIENCE.MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          const backoff = RESILIENCE.BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
          this.logger.warn(
            `Step "${config.name}" retry #${String(attempt)} after ${String(backoff)}ms`,
          );
          await new Promise<void>((r) => setTimeout(r, backoff));
        }

        return await this.withTimeout(() => this.inner.execute(config), timeoutMs, config.name);
      } catch (error) {
        lastError = error as Error;
        this.logger.error(
          `Step "${config.name}" attempt ${String(attempt + 1)} failed: ${lastError.message}`,
        );
      }
    }

    throw new Error(
      `Step "${config.name}" failed after ${String(RESILIENCE.MAX_RETRIES + 1)} attempts: ${lastError?.message ?? 'unknown'}`,
    );
  }

  private async withTimeout(
    fn: () => Promise<StepResult>,
    timeoutMs: number,
    stepName: string,
  ): Promise<StepResult> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Step "${stepName}" timed out after ${String(timeoutMs)}ms`)),
          timeoutMs,
        ),
      ),
    ]);
  }
}
