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

- **Node.js** 18+ (recomendado 20.20.0+)
- **Yarn**

Para rodar o app em dispositivos/simuladores:

- **iOS:** Xcode, CocoaPods
- **Android:** Android Studio, SDK Android
- **Detox (E2E):** Homebrew, `applesimutils`  


- **App:** [wallet-app/README.md](wallet-app/README.md)
- **BFF:** [wallet-bff/README.md](wallet-bff/README.md)
