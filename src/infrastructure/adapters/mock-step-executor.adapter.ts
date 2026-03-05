import { Injectable } from '@nestjs/common';
import { StepConfig, StepExecutorPort } from '@/domain/ports/step-executor.port.js';
import { StepResult, StepStatus } from '@/domain/value-objects/step-results.vo.js';
import { STEP_FAILURE_RATE } from '@/infrastructure/config/steps.config.js';

@Injectable()
export class MockStepExecutorAdapter extends StepExecutorPort {
  async execute(config: StepConfig): Promise<StepResult> {
    const { maxMs, minMs, name } = config;
    const start = Date.now();
    const delay = this.randomBetween(minMs, maxMs);

    await new Promise<void>((resolve) => setTimeout(resolve, delay));

    const status: StepStatus = Math.random() < STEP_FAILURE_RATE ? 'failed' : 'success';
    return new StepResult(name, Date.now() - start, status);
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
