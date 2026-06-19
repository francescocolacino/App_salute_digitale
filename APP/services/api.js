import { API_BASE_URL } from '../config';

// Funzione base usata da tutte le chiamate verso il backend.
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error('Il server ha restituito una risposta non valida.');
    }
  }

  if (!response.ok) {
    throw new Error(data.error || 'Errore di comunicazione con il server.');
  }

  return data;
}

// Legge la lista dei pazienti.
export async function fetchPatients(query = '') {
  const suffix = query ? `?query=${encodeURIComponent(query)}` : '';
  const data = await request(`/patients.php${suffix}`);
  return data.patients || [];
}

// Legge il dettaglio di un paziente.
export async function fetchPatient(patientId) {
  const data = await request(`/patient.php?id=${encodeURIComponent(String(patientId))}`);
  return data.patient;
}

// Legge le osservazioni di un paziente.
export async function fetchObservations(patientId) {
  const data = await request(`/observations.php?patient_id=${encodeURIComponent(String(patientId))}`);
  return data.observations || [];
}

// Salva una nuova osservazione.
export async function createObservation(patientId, observationText) {
  const data = await request('/observations.php', {
    method: 'POST',
    body: JSON.stringify({
      patient_id: patientId,
      observation_text: observationText,
    }),
  });

  return data.observation;
}

// Legge gli incontri clinici del paziente.
export async function fetchEncounters(patientId) {
  const data = await request(`/encounters.php?patient_id=${encodeURIComponent(String(patientId))}`);
  return data.encounters || [];
}
