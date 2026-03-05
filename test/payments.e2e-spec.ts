import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/shared/filters/all-exceptions.filter';

interface PaymentResponse {
  transactionId: string;
  status: string;
  totalTimeMs: number;
  correlationId: string;
  steps: { step: string; timeMs: number; status: string }[];
}

interface ErrorResponse {
  statusCode: number;
  message: string[];
}

const validPayload = {
  amount: 15000,
  cardNumber: '4111111111111111',
  cvv: '123',
  expirationDate: '12/28',
  holderName: 'JULIO VALENTE',
};

describe('POST /v1/payments (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with 6 steps for a valid payment', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/payments')
      .send(validPayload)
      .expect(200);

    const body = res.body as PaymentResponse;
    expect(body.transactionId).toMatch(/^txn_/);
    expect(body.status).toMatch(/^(approved|rejected)$/);
    expect(body.totalTimeMs).toBeGreaterThanOrEqual(0);
    expect(body.correlationId).toBeDefined();
    expect(body.steps).toHaveLength(6);

    const stepNames = body.steps.map((s) => s.step);
    expect(stepNames).toEqual([
      'account_validation',
      'card_validation',
      'anti_fraud',
      'acquirer_processing',
      'payment',
      'notification',
    ]);
  }, 15000);

  it('should return 400 when amount is 0', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/payments')
      .send({ ...validPayload, amount: 0 })
      .expect(400);

    const body = res.body as ErrorResponse;
    expect(body.message).toEqual(expect.arrayContaining([expect.stringContaining('amount')]));
  });

  it('should return 400 when amount is negative', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/payments')
      .send({ ...validPayload, amount: -50 })
      .expect(400);

    const body = res.body as ErrorResponse;
    expect(body.message).toEqual(expect.arrayContaining([expect.stringContaining('amount')]));
  });

  it('should return 400 when body is empty', async () => {
    await request(app.getHttpServer()).post('/v1/payments').send({}).expect(400);
  });

  it('should return 400 when amount is a string', async () => {
    await request(app.getHttpServer())
      .post('/v1/payments')
      .send({ ...validPayload, amount: 'abc' })
      .expect(400);
  });

  it('should return 400 when unknown fields are sent', async () => {
    await request(app.getHttpServer())
      .post('/v1/payments')
      .send({ ...validPayload, unknownField: 'hacker' })
      .expect(400);
  });
});
