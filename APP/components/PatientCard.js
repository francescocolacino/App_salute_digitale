import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function PatientCard({ onPress, patient }) {
  const birthDate = patient.birth_date || 'Non disponibile';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.title}>{patient.full_name}</Text>
        <Text style={styles.subtitle}>CF: {patient.tax_code}</Text>
        <Text style={styles.meta}>Nato il: {birthDate}</Text>
      </View>
      <Text style={styles.cta}>Apri</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#64748b',
  },
  meta: {
    marginTop: 4,
    color: '#475569',
  },
  cta: {
    color: '#0f766e',
    fontWeight: '700',
  },
});
