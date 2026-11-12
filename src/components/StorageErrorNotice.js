import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

export default function StorageErrorNotice({ errors }) {
  const message = errors.find(Boolean);
  if (!message) return null;

  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <Text style={styles.text}>{message} Algumas alterações podem não persistir.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#FFF1F0',
    borderColor: colors.danger,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 12,
    marginTop: 6,
    padding: 10,
  },
  text: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
  },
});
