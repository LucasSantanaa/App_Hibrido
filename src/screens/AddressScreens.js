import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton, MenuLink, Screen } from '../components/Screen';
import { useAddresses } from '../context/AddressContext';
import { useCart } from '../context/CartContext';
import colors from '../theme/colors';

export function AddressBookScreen() {
  const { addresses, removeAddress } = useAddresses();
  const router = useRouter();

  function confirmRemoval(address) {
    Alert.alert('Remover endereço', `Deseja remover ${address.label}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeAddress(address.id) },
    ]);
  }

  return (
    <Screen title="Meus endereços" subtitle="Gerencie seus locais de entrega" showBack>
      {addresses.map((address) => (
        <View key={address.id} style={styles.addressCard}>
          <View style={styles.addressIcon}>
            <Ionicons name="location-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.addressCopy}>
            <Text style={styles.addressLabel}>{address.label}</Text>
            <Text style={styles.addressText}>
              {address.street}, {address.number} · {address.neighborhood}
            </Text>
            <Text style={styles.addressText}>{address.city} · CEP {address.zip}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Remover ${address.label}`}
            onPress={() => confirmRemoval(address)}
          >
            <Ionicons name="trash-outline" size={19} color={colors.danger} />
          </TouchableOpacity>
        </View>
      ))}
      {!addresses.length ? (
        <Text style={styles.emptyText}>Você ainda não cadastrou um endereço.</Text>
      ) : null}
      <ActionButton label="Adicionar endereço" onPress={() => router.push('/address-form')} />
    </Screen>
  );
}

export function AddressFormScreen() {
  const { saveAddress } = useAddresses();
  const router = useRouter();
  const [values, setValues] = useState({
    label: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    zip: '',
  });
  const [error, setError] = useState('');

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function submit() {
    if (Object.values(values).some((value) => !value.trim())) {
      setError('Preencha todos os campos para salvar o endereço.');
      return;
    }
    setError('');
    saveAddress(values);
    router.back();
  }

  return (
    <Screen title="Novo endereço" subtitle="Onde devemos entregar?" showBack>
      <Text style={styles.fieldLabel}>Identificação</Text>
      <TextInput
        onChangeText={(value) => update('label', value)}
        placeholder="Ex.: Casa"
        style={styles.input}
        value={values.label}
      />
      <Text style={styles.fieldLabel}>Rua / avenida</Text>
      <TextInput
        onChangeText={(value) => update('street', value)}
        placeholder="Nome da rua"
        style={styles.input}
        value={values.street}
      />
      <View style={styles.inputRow}>
        <View style={styles.inputColumn}>
          <Text style={styles.fieldLabel}>Número</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(value) => update('number', value)}
            placeholder="123"
            style={styles.input}
            value={values.number}
          />
        </View>
        <View style={styles.inputColumn}>
          <Text style={styles.fieldLabel}>CEP</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(value) => update('zip', value)}
            placeholder="00000-000"
            style={styles.input}
            value={values.zip}
          />
        </View>
      </View>
      <Text style={styles.fieldLabel}>Bairro</Text>
      <TextInput
        onChangeText={(value) => update('neighborhood', value)}
        placeholder="Seu bairro"
        style={styles.input}
        value={values.neighborhood}
      />
      <Text style={styles.fieldLabel}>Cidade</Text>
      <TextInput
        onChangeText={(value) => update('city', value)}
        placeholder="Sua cidade"
        style={styles.input}
        value={values.city}
      />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <ActionButton label="Salvar endereço" onPress={submit} />
    </Screen>
  );
}

export function CheckoutScreen() {
  const { addresses } = useAddresses();
  const { items, total } = useCart();
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    if (!selectedAddressId && addresses.length) setSelectedAddressId(addresses[0].id);
  }, [addresses, selectedAddressId]);

  function continueToPayment() {
    if (!items.length) {
      Alert.alert('Carrinho vazio', 'Adicione ao menos uma receita antes de finalizar o pedido.');
      router.replace('/(app)/(tabs)/cart');
      return;
    }
    if (!selectedAddressId) {
      Alert.alert('Endereço necessário', 'Cadastre um endereço para continuar.');
      router.push('/address-form');
      return;
    }
    router.push({ pathname: '/payment', params: { addressId: selectedAddressId } });
  }

  return (
    <Screen title="Entrega" subtitle="Escolha onde receber seu pedido" showBack>
      {addresses.map((address) => {
        const selected = address.id === selectedAddressId;
        return (
          <TouchableOpacity
            key={address.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => setSelectedAddressId(address.id)}
            style={[styles.addressCard, selected && styles.selectedAddress]}
          >
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={colors.primary}
            />
            <View style={styles.addressCopy}>
              <Text style={styles.addressLabel}>{address.label}</Text>
              <Text style={styles.addressText}>
                {address.street}, {address.number} · {address.city}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <MenuLink
        icon="add-circle-outline"
        label="Adicionar endereço"
        onPress={() => router.push('/address-form')}
      />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total do pedido</Text>
        <Text style={styles.totalAmount}>R$ {total.toFixed(2)}</Text>
      </View>
      <ActionButton label="Continuar para pagamento" onPress={continueToPayment} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addressCard: {
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
  selectedAddress: { borderColor: colors.primary, borderWidth: 2 },
  addressIcon: { alignItems: 'center', backgroundColor: colors.background, borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  addressCopy: { flex: 1 },
  addressLabel: { color: colors.text, fontSize: 14, fontWeight: '700' },
  addressText: { color: colors.textLight, fontSize: 12, lineHeight: 18, marginTop: 3 },
  emptyText: { color: colors.textLight, fontSize: 14, marginBottom: 18, marginTop: 6 },
  fieldLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    height: 48,
    paddingHorizontal: 14,
  },
  inputRow: { flexDirection: 'row', gap: 12 },
  inputColumn: { flex: 1 },
  error: { color: colors.danger, fontSize: 12, marginBottom: 12, marginTop: 10 },
  totalRow: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingVertical: 18 },
  totalLabel: { color: colors.textLight, fontSize: 14 },
  totalAmount: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
