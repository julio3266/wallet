# wallet-app

Aplicativo React Native para processamento de pagamentos com cartão de crédito, desenvolvido com Expo e integrado ao BFF da Midway Wallet.

## Tecnologias

- **React Native** 0.83.2 + **Expo** ~55.0.5
- **TypeScript** com paths absolutos via `@/`
- **Redux Toolkit** para gerenciamento de estado
- **Zod** para validação de formulário
- **react-native-modalize** para o modal de resultado
- **Detox** para testes E2E

## Pré-requisitos

- Node.js 18+
- Xcode (para iOS)
- CocoaPods
- Homebrew
- `applesimutils` (necessário para Detox)

```bash
brew tap wix/brew && brew install applesimutils
```

## Instalação

```bash
npm install
cd ios && pod install && cd ..
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto a partir do `.env.example`:

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | URL base do BFF | `http://localhost:3000/v1` |

> Variáveis prefixadas com `EXPO_PUBLIC_` são injetadas automaticamente pelo Expo em tempo de build.

## Rodando o app

```bash
# iOS
npm run ios

# Android
npm run android
```

## Estrutura do projeto

```
wallet-app/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ResultBottomSheet.tsx
│   │   └── ResultBottomSheet.styles.ts
│   ├── config/
│   │   └── api.ts          # URL base da API (lida do .env)
│   ├── schemas/
│   │   └── paymentSchema.ts # Validação Zod do formulário
│   ├── screens/
│   │   ├── PaymentScreen.tsx
│   │   └── PaymentScreen.styles.ts
│   ├── services/
│   │   └── paymentApi.ts   # Chamada HTTP ao BFF
│   ├── store/
│   │   ├── index.ts        # Configuração do Redux store
│   │   ├── hooks.ts        # useAppDispatch / useAppSelector tipados
│   │   └── slices/
│   │       └── paymentSlice.ts
│   └── types/
│       └── payment.ts      # Interfaces TypeScript
├── e2e/
│   ├── paymentForm.test.ts # Testes E2E com Detox
│   ├── jest.config.js
│   ├── jest-globals.d.ts
│   └── tsconfig.json
├── .detoxrc.js             # Configuração do Detox
├── .env                    # Variáveis de ambiente (não versionado)
├── .env.example            # Referência das variáveis
└── App.tsx                 # Entry point
```

## Funcionalidades da tela de pagamento

- Campos: número do cartão, validade (MM/AA), CVV, nome do portador e valor
- Máscara de cartão (`4111 1111 1111 1111`)
- Máscara de validade (`12/30`)
- Máscara de moeda brasileira (`1.233,00`)
- Validação via Zod com erros por campo
- Validação de data: aceita apenas validade **estritamente futura** (mês/ano maior que o atual)
- Botão "Pagar" fixo no footer
- Teclado fecha automaticamente ao submeter
- Modal de resultado com ícone de sucesso/erro, mensagem e tempos de processamento por step

## Payload enviado ao BFF

```json
{
  "amount": 150000,
  "cardNumber": "4111111111111111",
  "cvv": "123",
  "expirationDate": "12/30",
  "holderName": "JULIO VALENTE"
}
```

## Resposta esperada do BFF

```json
{
  "status": "approved",
  "transactionId": "txn_xxx",
  "correlationId": "yyy",
  "totalTimeMs": 4034,
  "steps": [
    { "step": "account_validation", "timeMs": 625, "status": "success" },
    { "step": "card_validation",    "timeMs": 649, "status": "success" },
    { "step": "anti_fraud",         "timeMs": 886, "status": "success" },
    { "step": "acquirer_processing","timeMs": 1237,"status": "failed"  },
    { "step": "payment",            "timeMs": 1056,"status": "success" },
    { "step": "notification",       "timeMs": 204, "status": "success" }
  ]
}
```

## Testes E2E (Detox)

### Pré-requisitos

O BFF deve estar rodando em `localhost:3000` para os testes de fluxo de pagamento.

### Build

Necessário apenas na primeira vez ou após mudanças nativas:

```bash
npm run e2e:build:ios
```

### Executar

```bash
# Inicie o Metro em um terminal separado
npx expo start

# Em outro terminal, rode os testes
npm run e2e:test:ios
```

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run e2e:build:ios` | Build debug para simulador iOS |
| `npm run e2e:test:ios` | Executa os testes no simulador (debug) |
| `npm run e2e:build:ios:release` | Build release para simulador iOS |
| `npm run e2e:test:ios:release` | Executa os testes no simulador (release) |

### Cobertura dos testes

| Suite | Testes |
|---|---|
| Renderização | Exibe todos os campos e botão de pagar |
| Validação | Erros em campos vazios, cartão inválido, validade expirada, limpeza de erro |
| Formatação | Máscara do número do cartão, máscara da validade |
| Fluxo de pagamento | Loading ao submeter, modal de resultado, ícone de sucesso/erro |

> Os testes de fluxo de pagamento requerem o BFF no ar. Os demais rodam de forma isolada.
