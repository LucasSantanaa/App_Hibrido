import React from 'react';
import { Alert, Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { ActionButton, MenuLink, Screen } from '../components/Screen';
import usePersistentValue from '../hooks/usePersistentValue';
import colors from '../theme/colors';

export function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled, loading, storageError] =
    usePersistentValue('sabor-express:notifications', true);

  return (
    <Screen title="Configurações" subtitle="Preferências do aplicativo" showBack>
      <View style={styles.settingRow}>
        <View style={styles.settingCopy}>
          <Text style={styles.settingTitle}>Notificações de pedidos</Text>
          <Text style={styles.settingDetail}>Preferência salva neste aparelho</Text>
        </View>
        <Switch
          accessibilityLabel="Ativar notificações de pedidos"
          disabled={loading}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? colors.primary : '#F4F3F4'}
          trackColor={{ false: colors.border, true: '#FFD4C4' }}
          value={notificationsEnabled}
        />
      </View>
      {storageError ? <Text accessibilityRole="alert" style={styles.error}>{storageError}</Text> : null}
      <MenuLink icon="shield-checkmark-outline" label="Privacidade" detail="Dados armazenados localmente" />
      <MenuLink icon="information-circle-outline" label="Sobre o app" detail="SaborExpress · demonstração acadêmica" />
    </Screen>
  );
}

export function SupportScreen() {
  function contactSupport() {
    Linking.openURL('mailto:suporte@saborexpress.example?subject=Ajuda%20SaborExpress')
      .catch((error) => {
        console.error('Não foi possível abrir o aplicativo de e-mail.', error);
        Alert.alert('Não foi possível abrir o e-mail', 'Envie sua dúvida para suporte@saborexpress.example.');
      });
  }

  return (
    <Screen title="Ajuda e suporte" subtitle="Respostas rápidas para você" showBack>
      <View style={styles.faqCard}>
        <Text style={styles.settingTitle}>Como acompanho meu pedido?</Text>
        <Text style={styles.faqAnswer}>Acesse “Meus pedidos” no perfil para consultar o status e os detalhes.</Text>
      </View>
      <View style={styles.faqCard}>
        <Text style={styles.settingTitle}>Onde meus dados ficam salvos?</Text>
        <Text style={styles.faqAnswer}>Carrinho, favoritos, endereços e pedidos ficam no armazenamento local do aparelho.</Text>
      </View>
      <View style={styles.faqCard}>
        <Text style={styles.settingTitle}>O pagamento é real?</Text>
        <Text style={styles.faqAnswer}>Não. O fluxo de pagamento é demonstrativo e não cobra valores.</Text>
      </View>
      <ActionButton label="Falar com suporte" onPress={contactSupport} secondary />
    </Screen>
  );
}

const styles = StyleSheet.create({
  settingRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', paddingVertical: 16 },
  settingCopy: { flex: 1 },
  settingTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  settingDetail: { color: colors.textLight, fontSize: 12, marginTop: 4 },
  error: { color: colors.danger, fontSize: 12, marginTop: 12 },
  faqCard: { backgroundColor: colors.surface, borderRadius: 14, marginBottom: 12, padding: 16 },
  faqAnswer: { color: colors.textLight, fontSize: 13, lineHeight: 20, marginTop: 8 },
});
