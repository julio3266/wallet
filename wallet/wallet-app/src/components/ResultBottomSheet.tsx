import React, { useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Modalize } from 'react-native-modalize';
import type { PaymentResponse } from '@/types/payment';
import { styles } from '@/components/ResultBottomSheet.styles';

interface ResultBottomSheetProps {
  result: PaymentResponse | null;
  error: string | null;
  onClose?: () => void;
}

export default function ResultBottomSheet({
  result,
  error,
  onClose,
}: ResultBottomSheetProps) {
  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    if (result || error) {
      modalizeRef.current?.open();
    }
  }, [result, error]);

  const success = !error && result?.status === 'approved';

  return (
    <Modalize
      ref={modalizeRef}
      onClosed={onClose}
      adjustToContentHeight
      handlePosition="inside"
    >
      <View testID="result-modal" style={styles.content}>
        <View style={styles.header}>
          <View
            testID={success ? 'result-icon-success' : 'result-icon-error'}
            style={[styles.iconCircle, success ? styles.iconCircleSuccess : styles.iconCircleError]}
          >
            <Text style={styles.iconText}>{success ? '✓' : '✕'}</Text>
          </View>
          <Text
            testID="result-status-title"
            style={[styles.statusTitle, success ? styles.successTitle : styles.errorTitle]}
          >
            {success ? 'Pagamento aprovado' : 'Pagamento recusado'}
          </Text>
          {error && (
            <Text testID="result-error-message" style={styles.errorMessage}>{error}</Text>
          )}
        </View>

        {result?.steps && result.steps.length > 0 && (
          <View testID="result-times" style={styles.stepsContainer}>
            <View style={styles.stepsHeader}>
              <Text style={styles.stepsTitle}>Tempos de processamento</Text>
              {result.totalTimeMs !== undefined && (
                <Text style={styles.totalTime}>{result.totalTimeMs}ms total</Text>
              )}
            </View>
            {result.steps.map((item, index) => (
              <View
                key={item.step}
                style={[styles.stepRow, index === result.steps!.length - 1 && styles.stepRowLast]}
              >
                <View style={styles.stepLeft}>
                  <View style={[
                    styles.stepDot,
                    item.status === 'success' ? styles.stepDotSuccess : styles.stepDotFailed,
                  ]} />
                  <Text style={styles.stepName}>{item.step.replace(/_/g, ' ')}</Text>
                </View>
                <Text style={[
                  styles.stepTime,
                  item.status === 'success' ? styles.stepTimeSuccess : styles.stepTimeFailed,
                ]}>
                  {item.timeMs}ms
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Modalize>
  );
}
