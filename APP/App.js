import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import SearchPatientScreen from './screens/SearchPatientScreen';
import PatientDetailScreen from './screens/PatientDetailScreen';
import ObservationsScreen from './screens/ObservationsScreen';
import EncountersScreen from './screens/EncountersScreen';

export default function App() {
  // screen decide quale schermata mostrare.
  const [screen, setScreen] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState(null);

  function handlePatientSelected(patient) {
    setSelectedPatient(patient);
    setScreen('detail');
  }

  // In base alla schermata scelta mostro il contenuto giusto.
  function getScreenContent() {
    if (screen === 'search') {
      return (
        <SearchPatientScreen
          onBack={() => setScreen('home')}
          onSelectPatient={handlePatientSelected}
        />
      );
    }

    if (screen === 'detail' && selectedPatient) {
      return (
        <PatientDetailScreen
          patient={selectedPatient}
          onBack={() => setScreen('search')}
          onOpenEncounters={() => setScreen('encounters')}
          onOpenObservations={() => setScreen('observations')}
          onPatientLoaded={setSelectedPatient}
        />
      );
    }

    if (screen === 'observations' && selectedPatient) {
      return (
        <ObservationsScreen
          patient={selectedPatient}
          onBack={() => setScreen('detail')}
        />
      );
    }

    if (screen === 'encounters' && selectedPatient) {
      return (
        <EncountersScreen
          patient={selectedPatient}
          onBack={() => setScreen('detail')}
        />
      );
    }

    return (
      <HomeScreen
        selectedPatient={selectedPatient}
        onContinue={() => setScreen(selectedPatient ? 'detail' : 'search')}
        onSearchPatient={() => setScreen('search')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {getScreenContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
