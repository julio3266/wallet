import { Injectable } from '@nestjs/common';
import { StepConfig, StepExecutorPort } from 'src/domain/ports/step-executor.port';
import { StepResult } from 'src/domain/value-objects/step-results.vo';

@Injectable()
export class MockStepExecutorAdapter extends StepExecutorPort {
  async execute(config: StepConfig): Promise<StepResult> {
    const start = Date.now();
    const delay = 1;

    await new Promise<void>((resolve) => setTimeout(resolve, delay));
    return new StepResult(config.name, Date.now() - start);
  }
}
