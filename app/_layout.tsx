import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { AddressProvider } from '../src/context/AddressContext';
import { OrdersProvider } from '../src/context/OrdersContext';
import RootNavigator from '../src/components/RootNavigator';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <AddressProvider>
                <OrdersProvider>
                  <RootNavigator />
                </OrdersProvider>
              </AddressProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
