import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createObservation, fetchObservations } from '../services/api';

export default function ObservationsScreen({ onBack, patient }) {
  const [observations, setObservations] = useState([]);
  const [observationText, setObservationText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadObservations();
  }, [patient.id]);

  // Carica tutte le osservazioni del paziente.
  async function loadObservations() {
    setLoading(true);
    setError('');

    try {
      setObservations(await fetchObservations(patient.id));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  // Salva una nuova osservazione e aggiorna la lista.
  async function handleCreateObservation() {
    if (!observationText.trim()) {
      setError('Scrivi prima un testo per l\'osservazione.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createObservation(patient.id, observationText.trim());
      setObservationText('');
      await loadObservations();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack}>
        <Text style={styles.backLink}>Torna al dettaglio</Text>
      </Pressable>

      <Text style={styles.title}>Osservazioni</Text>
      <Text style={styles.subtitle}>{patient.full_name}</Text>

      <TextInput
        value={observationText}
        onChangeText={setObservationText}
        placeholder="Inserisci una nuova osservazione clinica"
        multiline
        numberOfLines={5}
        style={styles.textArea}
      />

      <Pressable style={styles.primaryButton} onPress={handleCreateObservation} disabled={saving}>
        <Text style={styles.primaryButtonText}>
          {saving ? 'Salvataggio...' : 'Salva osservazione'}
        </Text>
      </Pressable>

      {loading ? <ActivityIndicator size="large" color="#0f766e" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && observations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nessuna osservazione disponibile.</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {observations.map((observation) => (
          <View key={observation.id} style={styles.card}>
            <Text style={styles.cardDate}>{observation.created_at}</Text>
            <Text style={styles.cardText}>{observation.observation_text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 6,
    marginBottom: 18,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
  },
  loader: {
    marginVertical: 24,
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyState: {
    marginTop: 18,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  emptyText: {
    color: '#1d4ed8',
  },
  list: {
    marginTop: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  cardDate: {
    color: '#0f766e',
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    color: '#0f172a',
    lineHeight: 22,
  },
});
