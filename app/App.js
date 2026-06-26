import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  AppState
} from 'react-native';


// Definisci l'indirizzo base del server FHIR
const FHIR_BASE_URL = 'https://hapi.fhir.org/baseR4/';

// Stesso tag usato nel sito web
const APP_TAG = 'app-salute-digitale-francesco';
const DEFAULT_SEARCH_LIMIT = 50;


function buildTaggedSearchUrl(resourceType, limit = DEFAULT_SEARCH_LIMIT) {
  return `${FHIR_BASE_URL}${resourceType}?_tag=${encodeURIComponent(APP_TAG)}&_sort=-_lastUpdated&_count=${limit}`;
}


export default function App() {

  const [visite, setVisite] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errore, setErrore] = useState('');

  useEffect(function () {
    loadAppointments(true);

    const subscription = AppState.addEventListener('change', function (nextAppState) {
      if (nextAppState === 'active') {
        loadAppointments(false);
      }
    });

    return function () {
      subscription.remove();
    };
  }, []);


  // Funzione per ottenere le visite salvate su FHIR
  async function loadAppointments(isInitialLoad) {
    const appointmentUrl = buildTaggedSearchUrl('Appointment');

    if (isInitialLoad === true) {
      setCaricamento(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await fetch(appointmentUrl);

      if (!response.ok) {
        throw new Error(`Errore: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.entry) {
        setVisite(data.entry);
      } else {
        setVisite([]);
      }

      setErrore('');

    } catch (error) {
      console.log('Errore nel recuperare le visite:', error);
      setErrore('Impossibile aggiornare le visite dal server FHIR.');
    } finally {
      setCaricamento(false);
      setRefreshing(false);
    }
  }


  // Funzione per estrarre i dati principali della visita
  function getAppointmentData(item) {
    const appointment = item.resource;

    let dataVisita = '';
    let tipologia = '';
    let note = '';
    let paziente = '';
    let medico = '';

    if (appointment.start) {
      dataVisita = appointment.start.substring(0, 10);
    }

    if (appointment.serviceType && appointment.serviceType.length > 0) {
      tipologia = appointment.serviceType[0].text;
    }

    if (appointment.description) {
      note = appointment.description;
    }

    if (appointment.participant) {
      appointment.participant.forEach(function (participant) {

        if (
          participant.actor &&
          participant.actor.reference &&
          participant.actor.reference.indexOf('Patient/') === 0
        ) {
          paziente = participant.actor.display;
        }

        if (
          participant.actor &&
          participant.actor.reference &&
          participant.actor.reference.indexOf('Practitioner/') === 0
        ) {
          medico = participant.actor.display;
        }

      });
    }

    return {
      dataVisita: dataVisita,
      tipologia: tipologia,
      paziente: paziente,
      medico: medico,
      note: note
    };
  }


  // Card singola visita
  function renderVisita({ item }) {
    const visita = getAppointmentData(item);

    return (
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{visita.tipologia}</Text>
          <Text style={styles.cardDate}>{visita.dataVisita}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Paziente</Text>
          <Text style={styles.value}>{visita.paziente}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Medico</Text>
          <Text style={styles.value}>{visita.medico}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.value}>
            {visita.note ? visita.note : 'Nessuna nota'}
          </Text>
        </View>

      </View>
    );
  }


  if (caricamento) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Visite prenotate</Text>
        <Text style={styles.subtitle}>Caricamento in corso...</Text>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>Visite prenotate</Text>

      <Text style={styles.subtitle}>
        Elenco delle visite salvate dal sito web
      </Text>

      {errore ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errore}</Text>
        </View>
      ) : null}

      <FlatList
        data={visite}
        renderItem={renderVisita}
        keyExtractor={function (item) {
          return item.resource.id;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={function () {
              loadAppointments(false);
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nessuna visita prenotata.</Text>
          </View>
        }
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 20
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f5f8b',
    marginBottom: 8
  },

  subtitle: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 20
  },

  listContainer: {
    paddingBottom: 20
  },

  errorBox: {
    backgroundColor: '#ffe5e5',
    borderWidth: 1,
    borderColor: '#f0b4b4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },

  errorText: {
    color: '#8f1d1d',
    fontSize: 14
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d9e2ec',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },

  cardHeader: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e6edf5',
    paddingBottom: 10
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f5f8b',
    marginBottom: 4
  },

  cardDate: {
    fontSize: 14,
    color: '#666666'
  },

  infoBox: {
    marginBottom: 12,
    backgroundColor: '#f8fbfe',
    padding: 10,
    borderRadius: 10
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f5f8b',
    marginBottom: 4
  },

  value: {
    fontSize: 15,
    color: '#222222'
  },

  emptyBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d9e2ec'
  },

  emptyText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center'
  }

});
