import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={56} color={colors.background} />
      </View>

      <Text style={styles.title}>Pedido confirmado!</Text>
      {id ? <Text style={styles.orderId}>Pedido #{String(id).slice(-6)}</Text> : null}
      <Text style={styles.subtitle}>
        Seu pedido foi recebido e já está sendo preparado. Você pode
        acompanhar o status a qualquer momento.
      </Text>

      <View style={styles.infoBox}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <Text style={styles.infoText}>Tempo estimado: 30-40 min</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace(id ? `/orders/${id}` : '/(app)/(tabs)')}
      >
        <Text style={styles.buttonText}>{id ? 'Acompanhar pedido' : 'Voltar para o início'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(app)/(tabs)')}>
        <Text style={styles.homeLink}>Voltar para o início</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },
  orderId: { color: colors.primary, fontSize: 14, fontWeight: '700', marginTop: 8 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 22,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 36,
  },
  buttonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
  homeLink: { color: colors.textLight, fontSize: 13, marginTop: 18 },
});
