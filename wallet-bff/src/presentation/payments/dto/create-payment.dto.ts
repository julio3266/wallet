import { IsNumber, IsPositive, IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Payment amount in cents',
    example: 15000,
    minimum: 1,
  })
  @IsNumber({}, { message: 'amount must be a number' })
  @IsPositive({ message: 'amount must be greater than zero' })
  amount: number;

  @ApiProperty({
    description: 'Card number (13-19 digits)',
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty({ message: 'cardNumber is required' })
  @Matches(/^\d{13,19}$/, { message: 'cardNumber must be 13-19 digits' })
  cardNumber: string;

  @ApiProperty({
    description: 'Card CVV (3-4 digits)',
    example: '123',
  })
  @IsString()
  @IsNotEmpty({ message: 'cvv is required' })
  @Matches(/^\d{3,4}$/, { message: 'cvv must be 3-4 digits' })
  cvv: string;

  @ApiProperty({
    description: 'Expiration date (MM/YY)',
    example: '12/28',
  })
  @IsString()
  @IsNotEmpty({ message: 'expirationDate is required' })
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'expirationDate must be in MM/YY format',
  })
  expirationDate: string;

  @ApiProperty({
    description: 'Cardholder name',
    example: 'JULIO VALENTE',
  })
  @IsString()
  @IsNotEmpty({ message: 'holderName is required' })
  @Length(2, 100, {
    message: 'holderName must be between 2 and 100 characters',
  })
  holderName: string;
}
