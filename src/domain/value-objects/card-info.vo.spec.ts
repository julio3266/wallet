import { CardInfo } from './card-info.vo.js';

describe('CardInfo Value Object', () => {
  it('should create with all card fields', () => {
    const card = new CardInfo('4111111111111111', '123', '12/28', 'JULIO VALENTE');

    expect(card.cardNumber).toBe('4111111111111111');
    expect(card.cvv).toBe('123');
    expect(card.expirationDate).toBe('12/28');
    expect(card.holderName).toBe('JULIO VALENTE');
  });

  it('should mask the card number showing only last 4 digits', () => {
    const card = new CardInfo('5500000000000004', '456', '06/27', 'MARIA SILVA');

    expect(card.maskedCardNumber).toBe('**** **** **** 0004');
  });
});
