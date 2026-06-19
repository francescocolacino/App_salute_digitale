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
import PatientCard from '../components/PatientCard';
import { fetchPatients } from '../services/api';

export default function SearchPatientScreen({ onBack, onSelectPatient }) {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  // Carica i pazienti dal backend.
  async function loadPatients(searchQuery = '') {
    setLoading(true);
    setError('');

    try {
      setPatients(await fetchPatients(searchQuery));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack}>
        <Text style={styles.backLink}>Torna alla home</Text>
      </Pressable>

      <Text style={styles.title}>Ricerca paziente</Text>
      <Text style={styles.description}>Le informazioni arrivano dallo stesso database del sito.</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Nome o codice fiscale"
          style={styles.input}
        />
        <Pressable style={styles.searchButton} onPress={() => loadPatients(query)}>
          <Text style={styles.searchButtonText}>Cerca</Text>
        </Pressable>
      </View>

      {loading ? <ActivityIndicator size="large" color="#0f766e" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && patients.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nessun paziente trovato.</Text>
        </View>
      ) : null}

      <View style={styles.results}>
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onPress={() => onSelectPatient(patient)}
          />
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
    marginBottom: 8,
  },
  description: {
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
  searchRow: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
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
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  emptyText: {
    color: '#1d4ed8',
  },
  results: {
    marginTop: 8,
  },
});
