import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton, MenuLink, Screen } from '../components/Screen';
import { useAddresses } from '../context/AddressContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import colors from '../theme/colors';

const paymentOptions = [
  { id: 'pix', label: 'Pix', icon: 'flash-outline', detail: 'Pagamento na confirmação' },
  { id: 'card', label: 'Cartão na entrega', icon: 'card-outline', detail: 'Crédito ou débito' },
  { id: 'cash', label: 'Dinheiro', icon: 'cash-outline', detail: 'Pague ao receber' },
];

export function PaymentScreen() {
  const { addressId } = useLocalSearchParams();
  const { addresses } = useAddresses();
  const { items, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const router = useRouter();
  const [method, setMethod] = useState('pix');

  function finishOrder() {
    const address = addresses.find((item) => item.id === String(addressId));
    if (!address || !items.length) {
      Alert.alert('Não foi possível continuar', 'Confira o endereço de entrega e o conteúdo do carrinho.');
      router.replace('/checkout');
      return;
    }

    const order = placeOrder({
      items,
      total,
      address,
      payment: method,
    });
    clearCart();
    router.replace({ pathname: '/order-confirmation', params: { id: order.id } });
  }

  return (
    <Screen title="Pagamento" subtitle="Como deseja pagar?" showBack>
      {paymentOptions.map((option) => {
        const selected = method === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => setMethod(option.id)}
            style={[styles.paymentOption, selected && styles.selectedOption]}
          >
            <Ionicons name={option.icon} size={24} color={colors.primary} />
            <View style={styles.paymentCopy}>
              <Text style={styles.paymentLabel}>{option.label}</Text>
              <Text style={styles.paymentDetail}>{option.detail}</Text>
            </View>
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        );
      })}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>R$ {total.toFixed(2)}</Text>
      </View>
      <ActionButton label="Confirmar pedido" onPress={finishOrder} />
    </Screen>
  );
}

export function PaymentMethodsScreen() {
  return (
    <Screen title="Formas de pagamento" subtitle="Opções disponíveis no app" showBack>
      {paymentOptions.map((option) => (
        <MenuLink
          key={option.id}
          detail={option.detail}
          icon={option.icon}
          label={option.label}
        />
      ))}
      <Text style={styles.localPaymentNote}>
        Este projeto é uma demonstração: nenhum pagamento real é processado.
      </Text>
    </Screen>
  );
}

export function OrdersScreen() {
  const { orders, loading } = useOrders();
  const router = useRouter();

  return (
    <Screen title="Meus pedidos" subtitle="Acompanhe suas compras" showBack>
      {loading ? <Text style={styles.emptyText}>Carregando pedidos salvos...</Text> : null}
      {!loading && !orders.length ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={46} color={colors.primary} />
          <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
          <ActionButton label="Ver cardápio" onPress={() => router.replace('/(app)/(tabs)')} />
        </View>
      ) : null}
      {orders.map((order) => (
        <TouchableOpacity
          key={order.id}
          onPress={() => router.push(`/orders/${order.id}`)}
          style={styles.orderCard}
        >
          <View style={styles.orderTop}>
            <Text style={styles.orderNumber}>Pedido #{order.id.slice(-6)}</Text>
            <Text style={styles.orderStatus}>{order.status}</Text>
          </View>
          <Text style={styles.paymentDetail}>
            {new Date(order.createdAt).toLocaleDateString('pt-BR')} · {order.items.length} item(ns)
          </Text>
          <Text style={styles.orderTotal}>R$ {order.total.toFixed(2)}</Text>
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

export function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { orders } = useOrders();
  const order = orders.find((item) => item.id === String(id));

  if (!order) {
    return (
      <Screen title="Pedido" showBack>
        <Text style={styles.emptyText}>Este pedido não está salvo neste aparelho.</Text>
      </Screen>
    );
  }

  return (
    <Screen title={`Pedido #${order.id.slice(-6)}`} subtitle={order.status} showBack>
      <View style={styles.orderCard}>
        <Text style={styles.sectionTitle}>Itens</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.paymentDetail}>{item.quantity} × {item.name}</Text>
            <Text style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.orderCard}>
        <Text style={styles.sectionTitle}>Entrega</Text>
        <Text style={styles.paymentDetail}>
          {order.address.label}: {order.address.street}, {order.address.number}
        </Text>
        <Text style={styles.paymentDetail}>
          {order.address.neighborhood} · {order.address.city} · CEP {order.address.zip}
        </Text>
      </View>
      <View style={styles.orderCard}>
        <Text style={styles.sectionTitle}>Pagamento</Text>
        <Text style={styles.paymentDetail}>
          {paymentOptions.find((option) => option.id === order.payment)?.label || order.payment}
        </Text>
        <Text style={styles.orderTotal}>Total: R$ {order.total.toFixed(2)}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  paymentOption: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14,
  },
  selectedOption: { borderColor: colors.primary, borderWidth: 2 },
  paymentCopy: { flex: 1 },
  paymentLabel: { color: colors.text, fontSize: 14, fontWeight: '700' },
  paymentDetail: { color: colors.textLight, fontSize: 12, marginTop: 4 },
  totalRow: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingVertical: 18 },
  totalLabel: { color: colors.textLight, fontSize: 14 },
  totalAmount: { color: colors.text, fontSize: 18, fontWeight: '800' },
  localPaymentNote: { color: colors.textLight, fontSize: 12, lineHeight: 18, marginTop: 18, textAlign: 'center' },
  emptyState: { alignItems: 'center', gap: 14, paddingVertical: 32 },
  emptyText: { color: colors.textLight, fontSize: 14, lineHeight: 20, marginVertical: 12, textAlign: 'center' },
  orderCard: { backgroundColor: colors.surface, borderRadius: 14, marginBottom: 12, padding: 16 },
  orderTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  orderNumber: { color: colors.text, fontSize: 14, fontWeight: '700' },
  orderStatus: { color: colors.success, fontSize: 12, fontWeight: '700' },
  orderTotal: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 10 },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  itemPrice: { color: colors.text, fontSize: 12, fontWeight: '700' },
});
