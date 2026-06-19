import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchPatient } from '../services/api';

export default function PatientDetailScreen({
  onBack,
  onOpenEncounters,
  onOpenObservations,
  onPatientLoaded,
  patient,
}) {
  const [currentPatient, setCurrentPatient] = useState(patient);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    // Ricarica i dati del paziente quando apro la schermata.
    async function loadPatient() {
      setLoading(true);
      setError('');

      try {
        const result = await fetchPatient(patient.id);
        if (active) {
          setCurrentPatient(result);
          onPatientLoaded(result);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPatient();

    return () => {
      active = false;
    };
  }, [onPatientLoaded, patient.id]);

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack}>
        <Text style={styles.backLink}>Torna alla ricerca</Text>
      </Pressable>

      <Text style={styles.title}>Dettaglio paziente</Text>

      {loading ? <ActivityIndicator size="large" color="#0f766e" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && currentPatient ? (
        <View style={styles.card}>
          <Text style={styles.patientName}>{currentPatient.full_name}</Text>
          <Text style={styles.meta}>ID: {currentPatient.id}</Text>
          <Text style={styles.meta}>Codice fiscale: {currentPatient.tax_code}</Text>
          <Text style={styles.meta}>
            Data di nascita: {currentPatient.birth_date || 'Non disponibile'}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={onOpenObservations}>
              <Text style={styles.primaryButtonText}>Osservazioni</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={onOpenEncounters}>
              <Text style={styles.secondaryButtonText}>Incontri</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backLink: {
    color: '#0f766e',
    fontWeight: '700',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  loader: {
    marginTop: 24,
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  meta: {
    color: '#475569',
    marginBottom: 6,
  },
  actions: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: '700',
  },
});
