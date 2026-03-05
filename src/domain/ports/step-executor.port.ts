import { StepResult } from '@/domain/value-objects/step-results.vo.js';

export interface StepConfig {
  name: string;
  minMs: number;
  maxMs: number;
}

export abstract class StepExecutorPort {
  abstract execute(config: StepConfig): Promise<StepResult>;
}
