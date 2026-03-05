export class CardInfo {
  readonly cardNumber: string;
  readonly cvv: string;
  readonly expirationDate: string;
  readonly holderName: string;

  constructor(cardNumber: string, cvv: string, expirationDate: string, holderName: string) {
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expirationDate = expirationDate;
    this.holderName = holderName;
  }
  get maskedCardNumber(): string {
    return `**** **** **** ${this.cardNumber.slice(-4)}`;
  }
}
