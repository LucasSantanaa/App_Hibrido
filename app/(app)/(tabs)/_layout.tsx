import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../src/context/CartContext';
import colors from '../../../src/theme/colors';

export default function TabsLayout() {
  const { itemCount } = useCart();

  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 8 },
      tabBarIcon: ({ color, size, focused }) => {
        const icons = { index: 'home', cart: 'cart', profile: 'person' };
        const icon = icons[route.name] || 'ellipse';
        return <Ionicons name={focused ? icon : `${icon}-outline`} size={size} color={color} />;
      },
    })}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="cart" options={{ title: 'Carrinho', tabBarBadge: itemCount > 0 ? itemCount : undefined }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
