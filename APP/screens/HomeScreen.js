import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ onSearchPatient, onContinue, selectedPatient }) {
  const continueLabel = selectedPatient ? 'Apri ultimo paziente' : 'Apri ricerca';

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>App salute digitale</Text>
        <Text style={styles.title}>App collegata allo stesso database del sito</Text>
        <Text style={styles.description}>
          Da qui puoi cercare un paziente e vedere osservazioni e incontri.
        </Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={onSearchPatient}>
        <Text style={styles.primaryButtonText}>Cerca paziente</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={onContinue}>
        <Text style={styles.secondaryButtonText}>{continueLabel}</Text>
      </Pressable>

      {selectedPatient ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ultimo paziente aperto</Text>
          <Text style={styles.summaryText}>{selectedPatient.full_name}</Text>
          <Text style={styles.summaryMeta}>CF: {selectedPatient.tax_code}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  hero: {
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#0f766e',
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#0f766e',
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryMeta: {
    color: '#475569',
  },
});
