import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import colors from '../theme/colors';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['top']}>
        <Ionicons name="cart-outline" size={72} color={colors.border} />
        <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
        <Text style={styles.emptySubtitle}>
          Adicione itens no cardápio para vê-los aqui.
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.replace('/(app)/(tabs)')}
        >
          <Text style={styles.checkoutText}>Ver receitas</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Meu Carrinho</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <Ionicons name={item.icon} size={26} color={colors.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  accessibilityLabel="Diminuir quantidade"
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="remove" size={16} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.itemQty}>{item.quantity}</Text>
                <TouchableOpacity
                  accessibilityLabel="Aumentar quantidade"
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.itemPrice}>
              R$ {(item.price * item.quantity).toFixed(2)}
            </Text>
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutText}>Finalizar pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  itemQty: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    color: colors.textLight,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  browseButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    marginTop: 22,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  quantityControls: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 6 },
  quantityButton: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
  },
});
