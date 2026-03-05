import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { getCorrelationId } from '@/shared/context/request-context.js';
import { CreatePaymentDto } from '@/presentation/payments/dto/create-payment.dto.js';
import {
  ProcessPaymentOutput,
  ProcessPaymentUseCase,
} from '@/application/use-cases/process-payment.use_case.js';

@ApiTags('Payments')
@Controller('v1/payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly processPayment: ProcessPaymentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process a card payment' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 200, description: 'Payment processed' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Processing error' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async create(@Body() dto: CreatePaymentDto): Promise<ProcessPaymentOutput> {
    const correlationId = getCorrelationId();
    this.logger.log(`[${correlationId}] POST /v1/payments | amount=${dto.amount}`);

    try {
      return await this.processPayment.execute({
        amount: dto.amount,
        cardNumber: dto.cardNumber,
        cvv: dto.cvv,
        expirationDate: dto.expirationDate,
        holderName: dto.holderName,
      });
    } catch (error) {
      this.logger.error(
        `[${correlationId}] Payment processing failed | error=${(error as Error).message}`,
      );
      throw new InternalServerErrorException('Payment processing failed');
    }
  }
}
