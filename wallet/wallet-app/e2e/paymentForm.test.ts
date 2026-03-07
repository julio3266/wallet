describe('Tela de Pagamento', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('deve exibir a tela de pagamento corretamente', async () => {
    await expect(element(by.id('payment-screen'))).toBeVisible();
    await expect(element(by.id('input-card-number'))).toBeVisible();
    await expect(element(by.id('input-expiry'))).toBeVisible();
    await expect(element(by.id('input-cvv'))).toBeVisible();
    await expect(element(by.id('input-holder-name'))).toBeVisible();
    await expect(element(by.id('input-amount'))).toBeVisible();
    await expect(element(by.id('btn-pay'))).toBeVisible();
  });

  describe('Validação de formulário', () => {
    it('deve exibir erros ao tentar pagar com campos vazios', async () => {
      await element(by.id('btn-pay')).tap();

      await expect(element(by.id('error-card-number'))).toBeVisible();
      await expect(element(by.id('error-expiry'))).toBeVisible();
      await expect(element(by.id('error-cvv'))).toBeVisible();
      await expect(element(by.id('error-holder-name'))).toBeVisible();
      await expect(element(by.id('error-amount'))).toBeVisible();
    });

    it('deve exibir erro ao informar número de cartão inválido', async () => {
      await element(by.id('input-card-number')).typeText('1234');
      await element(by.id('btn-pay')).tap();

      await expect(element(by.id('error-card-number'))).toBeVisible();
    });

    it('deve exibir erro ao informar validade expirada', async () => {
      await element(by.id('input-expiry')).typeText('0120');
      await element(by.id('btn-pay')).tap();

      await expect(element(by.id('error-expiry'))).toBeVisible();
    });

    it('deve limpar erro do campo ao corrigir o valor', async () => {
      await element(by.id('btn-pay')).tap();
      await expect(element(by.id('error-card-number'))).toBeVisible();

      await element(by.id('input-card-number')).typeText('4111111111111111');
      await expect(element(by.id('error-card-number'))).not.toExist();
    });
  });

  describe('Preenchimento do formulário', () => {
    it('deve formatar o número do cartão com espaços', async () => {
      await element(by.id('input-card-number')).typeText('4111111111111111');
      await expect(element(by.id('input-card-number'))).toHaveText('4111 1111 1111 1111');
    });

    it('deve formatar a validade com barra', async () => {
      await element(by.id('input-expiry')).typeText('1230');
      await expect(element(by.id('input-expiry'))).toHaveText('12/30');
    });
  });

  describe('Fluxo de pagamento', () => {
    const fillValidForm = async () => {
      await element(by.id('input-card-number')).typeText('4111111111111111');
      await element(by.id('input-expiry')).typeText('1230');
      await element(by.id('input-cvv')).typeText('123');
      await element(by.id('input-holder-name')).typeText('JULIO VALENTE');
      await element(by.id('input-amount')).typeText('15000');
    };

    it('deve exibir loading ao submeter o formulário', async () => {
      await fillValidForm();
      await element(by.id('btn-pay')).tap();

      await expect(element(by.id('loading-indicator'))).toBeVisible();
    });

    it('deve exibir o modal de resultado após a resposta', async () => {
      await fillValidForm();
      await element(by.id('btn-pay')).tap();

      await waitFor(element(by.id('result-modal')))
        .toBeVisible()
        .withTimeout(15000);

      await expect(element(by.id('result-status-title'))).toBeVisible();
    });

    it('deve exibir ícone de sucesso para pagamento aprovado', async () => {
      await fillValidForm();
      await element(by.id('btn-pay')).tap();

      await waitFor(element(by.id('result-modal')))
        .toBeVisible()
        .withTimeout(15000);

      await expect(element(by.id('result-icon-success'))).toBeVisible();
      await expect(element(by.id('result-status-title'))).toHaveText('Pagamento aprovado');
    });
  });
});
