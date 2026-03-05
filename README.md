# Midway Wallet BFF

Backend-for-Frontend para processamento de pagamentos com cartão. Simula um pipeline completo de 6 etapas com resiliência, observabilidade e validação.

## Pré-requisitos

- Node.js >= 20
- Yarn

## Instalação

```bash
yarn install
```

## Como rodar

### Desenvolvimento

```bash
yarn start:dev
```

O servidor sobe em `http://localhost:3000` com hot-reload habilitado.

### Produção

```bash
yarn build
yarn start:prod
```

### Swagger / API Docs

Disponível em `http://localhost:3000/api/docs` após iniciar o servidor.

### Testes

```bash
yarn test

yarn test:watch

yarn test:cov

yarn test:e2e
```

### Lint e formatação

```bash
yarn lint
yarn lint:fix
yarn format
```

## Endpoint

```
POST /v1/payments
```

**Payload:**

```json
{
  "amount": 15000,
  "cardNumber": "4111111111111111",
  "cvv": "123",
  "expirationDate": "12/28",
  "holderName": "JULIO VALENTE"
}
```

**Resposta (200):**

```json
{
  "status": "approved",
  "transactionId": "txn_abc123...",
  "totalTimeMs": 3200,
  "correlationId": "uuid...",
  "steps": [
    { "step": "account_validation", "timeMs": 520, "status": "success" },
    { "step": "card_validation", "timeMs": 450, "status": "success" },
    { "step": "anti_fraud", "timeMs": 1100, "status": "success" },
    { "step": "acquirer_processing", "timeMs": 1800, "status": "success" },
    { "step": "payment", "timeMs": 900, "status": "success" },
    { "step": "notification", "timeMs": 250, "status": "success" }
  ]
}
```

## Estrutura do projeto

```
src/
├── main.ts
├── app.module.ts
├── domain/
│   ├── entities/          Payment (entidade raiz)
│   ├── value-objects/     CardInfo, StepResult
│   ├── enums/             PaymentStatus
│   └── ports/             StepExecutorPort (contrato)
├── application/
│   └── use-cases/         ProcessPaymentUseCase
├── infrastructure/
│   ├── adapters/          MockStepExecutorAdapter, ResilientStepExecutorDecorator
│   └── config/            steps.config (pipeline, resiliência)
├── presentation/
│   └── payments/
│       ├── payments.controller.ts
│       ├── payments.module.ts
│       └── dto/           CreatePaymentDto
└── shared/
    ├── context/           AsyncLocalStorage (correlationId)
    ├── filters/           AllExceptionsFilter
    ├── interceptors/      LoggingInterceptor
    └── middleware/         CorrelationIdMiddleware
```

## Decisões técnicas

### Arquitetura em camadas (Hexagonal + DDD)

O projeto separa responsabilidades em 4 camadas independentes:

- **Domain** — Entidades (`Payment`), Value Objects (`CardInfo`, `StepResult`), enums e ports. Zero dependência de framework. A entidade `Payment` encapsula a lógica de resolução de status: `approved` se todos os steps foram bem-sucedidos, `rejected` se algum falhou, `error` se nenhum step foi executado.
- **Application** — Use cases que orquestram o domínio. `ProcessPaymentUseCase` coordena o pipeline de steps, executa `account_validation` e `card_validation` em paralelo, e os demais sequencialmente.
- **Infrastructure** — Implementações concretas dos ports. O adapter concreto (`MockStepExecutorAdapter`) simula latência e falhas aleatórias (10% de chance). O decorator (`ResilientStepExecutorDecorator`) adiciona retry, timeout e backoff exponencial.
- **Presentation** — Controllers e DTOs com validação via `class-validator` e documentação Swagger.

### Ports & Adapters (inversão de dependência)

`StepExecutorPort` é uma classe abstrata que define o contrato de execução de steps. A camada de aplicação depende apenas do port; a implementação concreta é injetada via módulo de infraestrutura. Isso permite trocar o adapter (ex: integração real com acquirer) sem alterar o use case.

### Decorator Pattern (resiliência)

`ResilientStepExecutorDecorator` envolve o adapter real e adiciona:

- **Retry** com até 2 retentativas (3 tentativas no total)
- **Timeout** de `maxMs × 3` por step
- **Backoff exponencial** com base de 100ms

As constantes de resiliência ficam centralizadas em `steps.config.ts`.

### Observabilidade

- **Correlation ID** — Gerado (ou reutilizado do header `x-correlation-id`) via `CorrelationIdMiddleware`, propagado em toda a requisição usando `AsyncLocalStorage`. Presente em todos os logs e respostas de erro.
- **Logging estruturado** — `LoggingInterceptor` registra método, URL, status e tempo de cada request. O use case loga início e fim do pipeline com `correlationId` e `transactionId`.
- **Tratamento global de erros** — `AllExceptionsFilter` padroniza respostas de erro com `statusCode`, `message` e `correlationId`.

### Segurança

- **Helmet** para headers HTTP seguros (CSP desabilitado para compatibilidade com Swagger)
- **CORS** habilitado
- **ValidationPipe** global com `whitelist`, `transform` e `forbidNonWhitelisted` — rejeita campos desconhecidos e valida tipos automaticamente

### TypeScript / Module Resolution

- `moduleResolution: "nodenext"` para compatibilidade nativa com Node.js ESM
- Path alias `@/` mapeado para `src/` via `tsconfig.json` + `tsc-alias` no build
- Jest configurado com `moduleNameMapper` para resolver os aliases nos testes

### Qualidade de código

- **ESLint** (flat config) com `typescript-eslint` e regras de type-checking
- **Prettier** integrado ao ESLint
- **Husky + lint-staged** — pre-commit hook que roda ESLint e Prettier automaticamente nos arquivos staged
- **Jest** para testes unitários (cobertura de entidades, VOs, adapters, use cases, controllers, filters) e E2E (fluxo HTTP completo com validações de payload)

### Pipeline de steps

O pipeline simula 6 etapas de processamento de pagamento, configuradas em `steps.config.ts`:

| Step                  | Tempo (ms)  | Execução   |
| --------------------- | ----------- | ---------- |
| `account_validation`  | 450 – 730   | Paralelo   |
| `card_validation`     | 300 – 800   | Paralelo   |
| `anti_fraud`          | 700 – 1500  | Sequencial |
| `acquirer_processing` | 1000 – 2500 | Sequencial |
| `payment`             | 800 – 1250  | Sequencial |
| `notification`        | 200 – 300   | Sequencial |

Cada step pode falhar aleatoriamente (10%). O status final é determinado pela entidade `Payment` com base nos resultados individuais.
