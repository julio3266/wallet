import { Injectable } from '@nestjs/common';
import { StepConfig, StepExecutorPort } from '../../domain/ports/step-executor.port.js';
import { StepResult } from '../../domain/value-objects/step-results.vo.js';

@Injectable()
export class MockStepExecutorAdapter extends StepExecutorPort {
  async execute(config: StepConfig): Promise<StepResult> {
    const { maxMs, minMs, name } = config;
    const start = Date.now();
    const delay = this.randonBetween(minMs, maxMs);

    await new Promise<void>((resolve) => setTimeout(resolve, delay));

    return new StepResult(name, Date.now() - start);
  }

  private randonBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
