# Midway Wallet

Monorepo com o aplicativo mobile (wallet-app) e o BFF (Backend for Frontend) para processamento de pagamentos com cartão de crédito.

## Estrutura do projeto

```
wallet/
├── wallet-app/    # App React Native (Expo) - frontend mobile
├── wallet-bff/    # BFF NestJS - Bff de payments
└── README.md      # Esta documentação
```

O app consome a API do BFF. Para usar o fluxo completo de pagamento, é necessário rodar **o BFF primeiro** e depois o app.

---

## Pré-requisitos gerais

- **Node.js** 18+ (recomendado 20+ para o BFF)
- **Yarn** (usado no BFF) ou **npm** (usado no app)

Para rodar o app em dispositivos/simuladores:

- **iOS:** Xcode, CocoaPods
- **Android:** Android Studio, SDK Android
- **Detox (E2E):** Homebrew, `applesimutils`  
  `brew tap wix/brew && brew install applesimutils`

---

## 1. Rodar o BFF

O BFF é a API que o app chama para processar pagamentos. Ele deve estar em execução antes de usar o app.

### Instalação

```bash
cd wallet-bff
yarn install
```

### Variáveis de ambiente

Crie o arquivo `.env` na pasta `wallet-bff` (opcional; os valores abaixo são os padrões):

```bash
cd wallet-bff
cp .env.example .env
```

| Variável                        | Descrição                              | Padrão        |
| ------------------------------- | -------------------------------------- | ------------- |
| `PORT`                          | Porta do servidor                      | `3000`        |
| `NODE_ENV`                      | Ambiente                               | `development` |
| `LOG_LEVEL`                     | Nível de log                           | `debug`       |
| `STEP_FAILURE_RATE`             | Taxa de falha simulada dos steps (0–1) | `0.1`         |
| `RESILIENCE_MAX_RETRIES`        | Máximo de retentativas por step        | `2`           |
| `RESILIENCE_TIMEOUT_MULTIPLIER` | Multiplicador do timeout por step      | `3`           |
| `RESILIENCE_BACKOFF_BASE_MS`    | Base do backoff exponencial (ms)       | `100`         |

### Comandos

| Comando           | Descrição                                                 |
| ----------------- | --------------------------------------------------------- |
| `yarn start:dev`  | Desenvolvimento com hot-reload em `http://localhost:3000` |
| `yarn build`      | Build de produção                                         |
| `yarn start:prod` | Roda o build de produção                                  |
| `yarn test`       | Testes unitários                                          |
| `yarn test:e2e`   | Testes E2E                                                |
| `yarn lint`       | Lint                                                      |
| `yarn format`     | Formatação com Prettier                                   |

### Subir o BFF (desenvolvimento)

```bash
cd wallet-bff
yarn install
yarn start:dev
```

O servidor fica disponível em **http://localhost:3000**. A documentação Swagger está em **http://localhost:3000/api/docs**.

---

## 2. Rodar o App

O app é um projeto React Native com Expo (dev client) que se comunica com o BFF.

### Instalação

```bash
cd wallet-app
npm install
cd ios && pod install && cd ..
```

### Variáveis de ambiente

Crie o arquivo `.env` na pasta `wallet-app`:

```bash
cd wallet-app
cp .env.example .env
```

| Variável              | Descrição                         | Exemplo                    |
| --------------------- | --------------------------------- | -------------------------- |
| `EXPO_PUBLIC_API_URL` | URL base do BFF (incluindo `/v1`) | `http://localhost:3000/v1` |

- No **simulador iOS**: `http://localhost:3000/v1` funciona.
- No **emulador Android**: use `http://10.0.2.2:3000/v1` (localhost do host mapeado para o emulador).
- Em **dispositivo físico**: use o IP da sua máquina na rede, por exemplo `http://192.168.1.10:3000/v1`.

### Comandos

| Comando           | Descrição                                |
| ----------------- | ---------------------------------------- |
| `npm start`       | Inicia o Metro bundler (Expo dev client) |
| `npm run ios`     | Roda no simulador iOS                    |
| `npm run android` | Roda no emulador/dispositivo Android     |
| `npm run web`     | Roda na web (Expo)                       |

### Subir o App (desenvolvimento)

1. Deixe o BFF rodando (ver seção 1).
2. Em outro terminal:

```bash
cd wallet-app
npm install
cp .env.example .env
npm run ios

npm run android
```

---

## Fluxo completo (App + BFF)

1. **Terminal 1 – BFF**

   ```bash
   cd wallet-bff
   yarn install
   yarn start:dev
   ```

2. **Terminal 2 – App**

   ```bash
   cd wallet-app
   yarn
   cp .env.example .env
   yarn ios
   ou
   yarn android
   ```

3. No app, preencha a tela de pagamento e envie. O BFF processa o pagamento e retorna o resultado no modal.

---

## Testes E2E do App (Detox)

Os testes E2E do app que cobrem o fluxo de pagamento **dependem do BFF rodando** em `http://localhost:3000`.

1. Suba o BFF: `cd wallet-bff && yarn start:dev`
2. Build do app para o simulador (primeira vez ou após mudanças nativas):
   ```bash
   cd wallet-app
   npm run e2e:build:ios
   ```
3. Em um terminal: `npx expo start`
4. Em outro: `npm run e2e:test:ios`

---

## Resumo rápido

| Objetivo            | Onde         | Comando                                          |
| ------------------- | ------------ | ------------------------------------------------ |
| Rodar a API (BFF)   | `wallet-bff` | `yarn start:dev`                                 |
| Rodar o app iOS     | `wallet-app` | `yarn ios`                                       |
| Rodar o app Android | `wallet-app` | `yarn android`                                   |
| Documentação da API | Browser      | http://localhost:3000/api/docs (com BFF rodando) |

Para mais detalhes de cada projeto, consulte:

- **App:** [wallet-app/README.md](wallet-app/README.md)
- **BFF:** [wallet-bff/README.md](wallet-bff/README.md)
