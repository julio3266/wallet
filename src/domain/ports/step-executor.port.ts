import { StepResults } from '../value-objects/step-results';

export interface StepConfig {
  name: string;
  minMs: number;
  maxMs: number;
}

export abstract class StepExecutorPort {
  abstract execute(config: StepConfig): Promise<StepResults>;
}
