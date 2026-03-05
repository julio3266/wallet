import { Module } from '@nestjs/common';
import { StepExecutorPort } from '../domain/ports/step-executor.port.js';
import { MockStepExecutorAdapter } from './adapters/mock-step-executor.adapter.js';
import { ResilientStepExecutorDecorator } from './adapters/resilient-step-executor.decorator.js';

@Module({
  providers: [
    MockStepExecutorAdapter,
    {
      provide: StepExecutorPort,
      useClass: ResilientStepExecutorDecorator,
    },
  ],
  exports: [StepExecutorPort],
})
export class InfrastructureModule {}
