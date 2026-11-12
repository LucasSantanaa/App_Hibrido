import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAddresses } from '../context/AddressContext';
import { useOrders } from '../context/OrdersContext';
import StorageErrorNotice from './StorageErrorNotice';

export default function RootNavigator() {
  const { storageError: authError } = useAuth();
  const { storageError: cartError } = useCart();
  const { storageError: favoriteError } = useFavorites();
  const { storageError: addressError } = useAddresses();
  const { storageError: orderError } = useOrders();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StorageErrorNotice
        errors={[authError, cartError, favoriteError, addressError, orderError]}
      />
    </>
  );
}
