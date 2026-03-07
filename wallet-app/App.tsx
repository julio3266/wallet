import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '@/store';
import PaymentScreen from '@/screens/PaymentScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaymentScreen />
        <StatusBar style="dark" />
      </Provider>
    </GestureHandlerRootView>
  );
}
