import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1d1d1f',
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  fieldError: {
    fontSize: 12,
    color: '#ff3b30',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  button: {
    backgroundColor: '#0071e3',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
