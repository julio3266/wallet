import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller.js';

import { PaymentStatus } from '../../domain/enums/payment-status.enum.js';
import {
  ProcessPaymentOutput,
  ProcessPaymentUseCase,
} from '../../application/use-cases/process-payment.use_case.js';

const validDto = {
  amount: 150,
  cardNumber: '4111111111111111',
  cvv: '123',
  expirationDate: '12/28',
  holderName: 'JULIO VALENTE',
};

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let useCase: ProcessPaymentUseCase;

  const mockOutput: ProcessPaymentOutput = {
    status: PaymentStatus.APPROVED,
    transactionId: 'txn_test-123',
    totalTimeMs: 2100,
    correlationId: 'test-correlation-id',
    steps: [
      { step: 'account_validation', timeMs: 500, status: 'success' },
      { step: 'card_validation', timeMs: 400, status: 'success' },
      { step: 'anti_fraud', timeMs: 800, status: 'success' },
      { step: 'acquirer_processing', timeMs: 1200, status: 'success' },
      { step: 'payment', timeMs: 900, status: 'success' },
      { step: 'notification', timeMs: 250, status: 'success' },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: ProcessPaymentUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockOutput),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate to ProcessPaymentUseCase with correct input', async () => {
    const executeSpy = jest.spyOn(useCase, 'execute');

    await controller.create(validDto);

    expect(executeSpy).toHaveBeenCalledWith({
      amount: 150,
      cardNumber: '4111111111111111',
      cvv: '123',
      expirationDate: '12/28',
      holderName: 'JULIO VALENTE',
    });
  });

  it('should return the use case output', async () => {
    const result = await controller.create(validDto);

    expect(result).toEqual(mockOutput);
    expect(result.steps).toHaveLength(6);
  });

  it('should throw InternalServerErrorException when use case fails', async () => {
    (useCase.execute as jest.Mock).mockRejectedValue(new Error('boom'));

    await expect(controller.create(validDto)).rejects.toThrow('Payment processing failed');
  });
});
