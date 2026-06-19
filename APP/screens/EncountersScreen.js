import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchEncounters } from '../services/api';

export default function EncountersScreen({ onBack, patient }) {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEncounters();
  }, [patient.id]);

  // Carica gli incontri clinici del paziente.
  async function loadEncounters() {
    setLoading(true);
    setError('');

    try {
      setEncounters(await fetchEncounters(patient.id));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack}>
        <Text style={styles.backLink}>Torna al dettaglio</Text>
      </Pressable>

      <Text style={styles.title}>Incontri clinici</Text>
      <Text style={styles.subtitle}>{patient.full_name}</Text>

      {loading ? <ActivityIndicator size="large" color="#0f766e" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && encounters.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nessun incontro disponibile.</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {encounters.map((encounter) => (
          <View key={encounter.id} style={styles.card}>
            <Text style={styles.cardDate}>{encounter.encounter_date}</Text>
            <Text style={styles.cardDepartment}>{encounter.department}</Text>
            <Text style={styles.cardText}>{encounter.notes || 'Nessuna nota disponibile.'}</Text>
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
  loader: {
    marginVertical: 24,
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 12,
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
    marginBottom: 6,
  },
  cardDepartment: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    color: '#334155',
    lineHeight: 22,
  },
});
