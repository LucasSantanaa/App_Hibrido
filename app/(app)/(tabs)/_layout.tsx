import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../src/context/CartContext';
import colors from '../../../src/theme/colors';

const icons: Record<
  string,
  {
    active: React.ComponentProps<typeof Ionicons>['name'];
    inactive: React.ComponentProps<typeof Ionicons>['name'];
  }
> = {
  index: { active: 'home', inactive: 'home-outline' },
  cart: { active: 'cart', inactive: 'cart-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export default function TabsLayout() {
  const { itemCount } = useCart();

  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 8 },
      tabBarIcon: ({ color, size, focused }) => {
        const icon = icons[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
        return (
          <Ionicons
            name={focused ? icon.active : icon.inactive}
            size={size}
            color={String(color)}
          />
        );
      },
    })}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="cart" options={{ title: 'Carrinho', tabBarBadge: itemCount > 0 ? itemCount : undefined }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
