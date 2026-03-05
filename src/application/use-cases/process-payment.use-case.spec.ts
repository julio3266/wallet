import { Test, TestingModule } from '@nestjs/testing';
import { StepExecutorPort } from '../../domain/ports/step-executor.port.js';
import type { StepConfig } from '../../domain/ports/step-executor.port.js';
import { StepResult } from '../../domain/value-objects/step-results.vo.js';
import { ProcessPaymentUseCase } from './process-payment.use_case.js';

class FakeStepExecutor extends StepExecutorPort {
  execute(config: StepConfig): Promise<StepResult> {
    return Promise.resolve(new StepResult(config.name, 10));
  }
}

const validInput = {
  amount: 100,
  cardNumber: '4111111111111111',
  cvv: '123',
  expirationDate: '12/28',
  holderName: 'JULIO VALENTE',
};

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: StepExecutorPort,
          useClass: FakeStepExecutor,
        },
      ],
    }).compile();

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all 6 steps in the correct order', async () => {
    const result = await useCase.execute(validInput);

    expect(result.steps).toHaveLength(6);

    const stepNames = result.steps.map((s) => s.step);
    expect(stepNames).toEqual([
      'account_validation',
      'card_validation',
      'anti_fraud',
      'acquirer_processing',
      'payment',
      'notification',
    ]);
  });

  it('should return a valid transactionId', async () => {
    const result = await useCase.execute({ ...validInput, amount: 50 });
    expect(result.transactionId).toMatch(/^txn_/);
  });

  it('should return status as approved or rejected', async () => {
    const result = await useCase.execute(validInput);
    expect(['approved', 'rejected']).toContain(result.status);
  });

  it('should calculate totalTimeMs', async () => {
    const result = await useCase.execute(validInput);
    expect(result.totalTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('should generate unique transaction IDs', async () => {
    const [r1, r2] = await Promise.all([
      useCase.execute(validInput),
      useCase.execute({ ...validInput, amount: 200 }),
    ]);

    expect(r1.transactionId).not.toBe(r2.transactionId);
  });
});
