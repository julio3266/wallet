import { z } from 'zod';

const expirationDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

export const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(13, 'Número do cartão inválido')
    .max(19, 'Número do cartão inválido')
    .regex(/^\d+$/, 'Apenas números'),
  expirationDate: z
    .string()
    .regex(expirationDateRegex, 'Formato MM/AA inválido')
    .refine((val) => {
      const [monthStr, yearStr] = val.split('/');
      const expYear = 2000 + parseInt(yearStr, 10);
      const expMonth = parseInt(monthStr, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (expYear !== currentYear) return expYear > currentYear;
      return expMonth > currentMonth;
    }, 'Cartão expirado'),
  cvv: z
    .string()
    .min(3, 'CVV inválido')
    .max(4, 'CVV inválido')
    .regex(/^\d+$/, 'Apenas números'),
  holderName: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .trim(),
  amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine((val) => {
      const parsed = parseFloat(val.replace(/\./g, '').replace(',', '.'));
      return !isNaN(parsed) && parsed > 0;
    }, 'Valor inválido'),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
