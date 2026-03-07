import { API_BASE_URL } from '@/config/api';
import type { PaymentRequest, PaymentResponse } from '@/types/payment';

export const processPayment = async (
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(parseFloat(paymentData.amount.replace(/\./g, '').replace(',', '.') || '0') || 0),
      cardNumber: paymentData.cardNumber,
      cvv: paymentData.cvv,
      expirationDate: paymentData.expirationDate,
      holderName: paymentData.holderName,
    }),
  });

  let data: PaymentResponse;
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida do servidor');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Erro ao processar pagamento');
  }

  return data;
};
