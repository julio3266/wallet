import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { submitPayment, clearResult } from '@/store/slices/paymentSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ResultBottomSheet from '@/components/ResultBottomSheet';
import { paymentFormSchema } from '@/schemas/paymentSchema';
import { styles } from '@/screens/PaymentScreen.styles';

export default function PaymentScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, result, error } = useAppSelector((state) => state.payment);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [amount, setAmount] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const formatCurrency = (text: string, prevValue: string) => {
    const hasComma = text.includes(',');
    const parts = text.split(',');
    const intPart = parts[0].replace(/\D/g, '');
    const decPart = hasComma && parts[1] ? parts[1].replace(/\D/g, '').slice(0, 2) : '';
    const raw = decPart ? `${intPart}.${decPart}` : intPart;
    const prevRaw = prevValue.replace(/\./g, '').replace(',', '.');
    if (raw === prevRaw && intPart.length >= 4 && !text.includes('.')) {
      return decPart ? `${intPart},${decPart}` : intPart;
    }
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decPart ? `${formattedInt},${decPart}` : formattedInt;
  };

  const parseCurrencyForApi = (formatted: string) => {
    const cleaned = formatted.replace(/\./g, '').replace(',', '.');
    return cleaned || '0';
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
    if (fieldErrors.cardNumber) setFieldErrors((e) => ({ ...e, cardNumber: '' }));
  };

  const handleExpiryChange = (text: string) => {
    setExpiry(formatExpiry(text));
    if (fieldErrors.expirationDate) setFieldErrors((e) => ({ ...e, expirationDate: '' }));
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatCurrency(text, amount));
    if (fieldErrors.amount) setFieldErrors((e) => ({ ...e, amount: '' }));
  };

  const handleCloseBottomSheet = useCallback(() => {
    dispatch(clearResult());
  }, [dispatch]);

  const handlePay = () => {
    Keyboard.dismiss();
    setFieldErrors({});

    const formData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expirationDate: expiry,
      cvv,
      holderName: cardholderName.trim(),
      amount,
    };

    const parsed = paymentFormSchema.safeParse(formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString();
        if (path) errors[path] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    dispatch(clearResult());
    dispatch(
      submitPayment({
        cardNumber: formData.cardNumber,
        expirationDate: formData.expirationDate,
        cvv: formData.cvv,
        holderName: formData.holderName,
        amount: parseCurrencyForApi(formData.amount),
      })
    );
  };

  const getInputStyle = (field: string) => [
    styles.input,
    fieldErrors[field] && styles.inputError,
  ];

  return (
    <View style={styles.container} testID="payment-screen">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Pagamento</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Número do cartão</Text>
          <TextInput
            testID="input-card-number"
            style={getInputStyle('cardNumber')}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#999"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            maxLength={19}
          />
          {fieldErrors.cardNumber && (
            <Text testID="error-card-number" style={styles.fieldError}>{fieldErrors.cardNumber}</Text>
          )}

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Validade</Text>
              <TextInput
                testID="input-expiry"
                style={getInputStyle('expirationDate')}
                placeholder="MM/AA"
                placeholderTextColor="#999"
                value={expiry}
                onChangeText={handleExpiryChange}
                keyboardType="numeric"
                maxLength={5}
              />
              {fieldErrors.expirationDate && (
                <Text testID="error-expiry" style={styles.fieldError}>{fieldErrors.expirationDate}</Text>
              )}
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                testID="input-cvv"
                style={getInputStyle('cvv')}
                placeholder="123"
                placeholderTextColor="#999"
                value={cvv}
                onChangeText={(text) => {
                  setCvv(text);
                  if (fieldErrors.cvv) setFieldErrors((e) => ({ ...e, cvv: '' }));
                }}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
              {fieldErrors.cvv && (
                <Text testID="error-cvv" style={styles.fieldError}>{fieldErrors.cvv}</Text>
              )}
            </View>
          </View>

          <Text style={styles.label}>Nome do portador</Text>
          <TextInput
            testID="input-holder-name"
            style={getInputStyle('holderName')}
            placeholder="Nome como no cartão"
            placeholderTextColor="#999"
            value={cardholderName}
            onChangeText={(text) => {
              setCardholderName(text);
              if (fieldErrors.holderName) setFieldErrors((e) => ({ ...e, holderName: '' }));
            }}
            autoCapitalize="words"
          />
          {fieldErrors.holderName && (
            <Text testID="error-holder-name" style={styles.fieldError}>{fieldErrors.holderName}</Text>
          )}

          <Text style={styles.label}>Valor</Text>
          <TextInput
            testID="input-amount"
            style={getInputStyle('amount')}
            placeholder="R$ 0,00"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
          />
          {fieldErrors.amount && (
            <Text testID="error-amount" style={styles.fieldError}>{fieldErrors.amount}</Text>
          )}
        </View>
      </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            testID="btn-pay"
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handlePay}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator testID="loading-indicator" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Pagar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ResultBottomSheet
        result={result}
        error={error}
        onClose={handleCloseBottomSheet}
      />
    </View>
  );
}

