import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingTop: 36,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleSuccess: {
    backgroundColor: '#34c759',
  },
  iconCircleError: {
    backgroundColor: '#ff3b30',
  },
  iconText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  successTitle: {
    color: '#1d1d1f',
  },
  errorTitle: {
    color: '#1d1d1f',
  },
  errorMessage: {
    fontSize: 14,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 4,
  },
  stepsContainer: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    padding: 16,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#86868b',
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  stepRowLast: {
    borderBottomWidth: 0,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    flexShrink: 0,
  },
  stepDotSuccess: {
    backgroundColor: '#34c759',
  },
  stepDotFailed: {
    backgroundColor: '#ff3b30',
  },
  stepName: {
    fontSize: 14,
    color: '#1d1d1f',
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  stepTime: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 0,
  },
  stepTimeSuccess: {
    color: '#34c759',
  },
  stepTimeFailed: {
    color: '#ff3b30',
  },
});
