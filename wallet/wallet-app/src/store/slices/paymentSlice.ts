import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processPayment } from '@/services/paymentApi';
import type { PaymentRequest, PaymentResponse } from '@/types/payment';

export const submitPayment = createAsyncThunk<
  PaymentResponse,
  PaymentRequest,
  { rejectValue: string }
>(
  'payment/submit',
  async (paymentData, { rejectWithValue }) => {
    try {
      const result = await processPayment(paymentData);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Erro ao processar pagamento'
      );
    }
  }
);

interface PaymentState {
  isLoading: boolean;
  result: PaymentResponse | null;
  error: string | null;
}

const initialState: PaymentState = {
  isLoading: false,
  result: null,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.pending, (state) => {
        state.isLoading = true;
        state.result = null;
        state.error = null;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
        state.error = null;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.result = null;
        state.error = action.payload ?? null;
      });
  },
});

export const { clearResult } = paymentSlice.actions;
export default paymentSlice.reducer;
