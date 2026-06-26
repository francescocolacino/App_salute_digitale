// Definisci l'indirizzo base del server FHIR
const FHIR_BASE_URL = 'https://hapi.fhir.org/baseR4/'; // Cambia con l'indirizzo base del tuo server FHIR

// Tag usato per distinguere le risorse create da questa applicazione
const APP_TAG = 'app-salute-digitale-francesco';
const DEFAULT_SEARCH_LIMIT = 50;


// Funzione per mostrare i messaggi sullo schermo
function showMessage(text, color) {
  const messageDiv = document.getElementById('message');

  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.style.backgroundColor = color;
    messageDiv.style.color = '#ffffff';
    messageDiv.style.padding = '10px';
  }
}


function buildTaggedSearchUrl(resourceType, limit = DEFAULT_SEARCH_LIMIT) {
  return `${FHIR_BASE_URL}${resourceType}?_tag=${encodeURIComponent(APP_TAG)}&_sort=-_lastUpdated&_count=${limit}`;
}


// Funzione per ottenere i primi n pazienti, con n passato come parametro limit
async function getPatients(limit = DEFAULT_SEARCH_LIMIT) {
  const patientUrl = buildTaggedSearchUrl('Patient', limit);

  try {
    // Effettua la richiesta HTTP al server FHIR usando fetch
    const response = await fetch(patientUrl);

    if (!response.ok) {
      // Se la risposta non è OK, lancia un'eccezione
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Estrai i dati JSON dalla risposta
    const data = await response.json();

    // Ottieni i primi limit pazienti
    const patients = data.entry;

    // Trova l'elemento HTML con ID 'patients'
    const patientsList = document.getElementById('patients');

    if (!patientsList) {
      return;
    }

    // Cancella eventuali elementi precedenti dalla lista
    patientsList.innerHTML = '';

    if (!patients) {
      showMessage('Nessun paziente trovato', 'red');
      return;
    }

    // Aggiungi i pazienti alla lista come elementi HTML
    patients.forEach((patient) => {
      // Crea un nuovo elemento `li` per ogni paziente
      const patientItem = document.createElement('li');

      const nome = patient.resource.name
        ? patient.resource.name[0].given + ' ' + patient.resource.name[0].family
        : 'Nome sconosciuto';

      const dataNascita = patient.resource.birthDate
        ? ' - Data nascita: ' + patient.resource.birthDate
        : '';

      const telefono = patient.resource.telecom
        ? ' - Telefono: ' + patient.resource.telecom[0].value
        : '';

      const codiceFiscale = patient.resource.identifier
        ? ' - Codice fiscale: ' + patient.resource.identifier[0].value
        : '';

      // Imposta il testo dell'elemento
      patientItem.textContent = nome + dataNascita + telefono + codiceFiscale;

      // Aggiungi l'elemento alla lista
      patientsList.appendChild(patientItem);
    });

  } catch (error) {
    console.error('Errore nel recuperare i pazienti:', error);
  }
}


// Funzione per creare un nuovo paziente
async function createPatient() {
  // Ottieni i dettagli del paziente inseriti dall'utente
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const birthDate = document.getElementById('birthDate').value;
  const phone = document.getElementById('phone').value;
  const fiscalCode = document.getElementById('fiscalCode').value;

  if (!firstName || !lastName || !birthDate || !phone || !fiscalCode) {
    showMessage('Tutti i campi sono obbligatori', 'red');
    return;
  }

  // Crea i dati del paziente in formato FHIR
  const patientData = {
    resourceType: 'Patient',
    meta: {
      tag: [{
        code: APP_TAG,
        display: 'App Salute Digitale'
      }]
    },
    identifier: [{
      system: 'http://hl7.it/sid/codiceFiscale',
      value: fiscalCode
    }],
    name: [{
      given: [firstName],
      family: lastName
    }],
    telecom: [{
      system: 'phone',
      value: phone
    }],
    birthDate: birthDate
  };

  try {
    // Effettua la richiesta POST al server FHIR usando fetch
    const response = await fetch(`${FHIR_BASE_URL}Patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(patientData)
    });

    if (!response.ok) {
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Ottieni l'ID del paziente creato dal server
    const result = await response.json();
    const patientId = result.id;

    sessionStorage.setItem('patientCreatedMessage', `Paziente creato con successo! ID: ${patientId}`);
    window.location.href = 'patients.html';

  } catch (error) {
    showMessage(`Errore nella creazione del paziente: ${error.message}`, 'red');
  }
}


// Funzione per ottenere i primi n medici, con n passato come parametro limit
async function getDoctors(limit = DEFAULT_SEARCH_LIMIT) {
  const doctorUrl = buildTaggedSearchUrl('Practitioner', limit);

  try {
    // Effettua la richiesta HTTP al server FHIR usando fetch
    const response = await fetch(doctorUrl);

    if (!response.ok) {
      // Se la risposta non è OK, lancia un'eccezione
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Estrai i dati JSON dalla risposta
    const data = await response.json();

    // Ottieni i primi limit medici
    const doctors = data.entry;

    // Trova l'elemento HTML con ID 'doctors'
    const doctorsList = document.getElementById('doctors');

    // Cancella eventuali elementi precedenti dalla lista
    doctorsList.innerHTML = '';

    if (!doctors) {
      showMessage('Nessun medico trovato', 'red');
      return;
    }

    // Aggiungi i medici alla lista come elementi HTML
    doctors.forEach((doctor) => {
      // Crea un nuovo elemento `li` per ogni medico
      const doctorItem = document.createElement('li');

      const doctorName = doctor.resource.name
        ? doctor.resource.name[0].given + ' ' + doctor.resource.name[0].family
        : 'Nome sconosciuto';

      const telefono = doctor.resource.telecom
        ? ' - Telefono: ' + doctor.resource.telecom[0].value
        : '';

      // Imposta il testo dell'elemento
      doctorItem.textContent = doctorName + telefono;

      // Aggiungi l'elemento alla lista
      doctorsList.appendChild(doctorItem);
    });

  } catch (error) {
    console.error('Errore nel recuperare i medici:', error);
  }
}


// Funzione per creare un nuovo medico
async function createDoctor() {
  // Ottieni i dettagli del medico inseriti dall'utente
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const phone = document.getElementById('phone').value;

  if (!firstName || !lastName || !phone) {
    showMessage('Tutti i campi sono obbligatori', 'red');
    return;
  }

  // Crea i dati del medico in formato FHIR
  const doctorData = {
    resourceType: 'Practitioner',
    meta: {
      tag: [{
        code: APP_TAG,
        display: 'App Salute Digitale'
      }]
    },
    name: [{
      given: [firstName],
      family: lastName
    }],
    telecom: [{
      system: 'phone',
      value: phone
    }]
  };

  try {
    // Effettua la richiesta POST al server FHIR usando fetch
    const response = await fetch(`${FHIR_BASE_URL}Practitioner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Ottieni l'ID del medico creato dal server
    const result = await response.json();
    const doctorId = result.id;

    showMessage(`Medico creato con successo! ID: ${doctorId}`, 'green');

  } catch (error) {
    showMessage(`Errore nella creazione del medico: ${error.message}`, 'red');
  }
}


// Funzione per caricare pazienti e medici nei menu a tendina
async function getPatientsAndDoctors(limit = DEFAULT_SEARCH_LIMIT) {
  const patientUrl = buildTaggedSearchUrl('Patient', limit);
  const doctorUrl = buildTaggedSearchUrl('Practitioner', limit);

  try {
    // Effettua la richiesta HTTP al server FHIR per i pazienti
    const patientResponse = await fetch(patientUrl);

    if (!patientResponse.ok) {
      throw new Error(`Errore: ${patientResponse.statusText}`);
    }

    // Estrai i dati JSON dalla risposta
    const patientData = await patientResponse.json();

    // Effettua la richiesta HTTP al server FHIR per i medici
    const doctorResponse = await fetch(doctorUrl);

    if (!doctorResponse.ok) {
      throw new Error(`Errore: ${doctorResponse.statusText}`);
    }

    // Estrai i dati JSON dalla risposta
    const doctorData = await doctorResponse.json();

    // Trova gli elementi HTML
    const patientSelect = document.getElementById('patientSelect');
    const doctorSelect = document.getElementById('doctorSelect');

    // Cancella eventuali elementi precedenti
    patientSelect.innerHTML = '';
    doctorSelect.innerHTML = '';

    // Aggiungi opzione iniziale
    const patientOptionDefault = document.createElement('option');
    patientOptionDefault.value = '';
    patientOptionDefault.textContent = 'Seleziona un paziente';
    patientSelect.appendChild(patientOptionDefault);

    const doctorOptionDefault = document.createElement('option');
    doctorOptionDefault.value = '';
    doctorOptionDefault.textContent = 'Seleziona un medico';
    doctorSelect.appendChild(doctorOptionDefault);

    // Aggiungi i pazienti al menu a tendina
    if (patientData.entry) {
      patientData.entry.forEach((patient) => {
        const patientOption = document.createElement('option');

        const patientName = patient.resource.name
          ? patient.resource.name[0].given + ' ' + patient.resource.name[0].family
          : 'Nome sconosciuto';

        patientOption.value = patient.resource.id;
        patientOption.textContent = patientName;

        patientSelect.appendChild(patientOption);
      });
    }

    // Aggiungi i medici al menu a tendina
    if (doctorData.entry) {
      doctorData.entry.forEach((doctor) => {
        const doctorOption = document.createElement('option');

        const doctorName = doctor.resource.name
          ? doctor.resource.name[0].given + ' ' + doctor.resource.name[0].family
          : 'Nome sconosciuto';

        doctorOption.value = doctor.resource.id;
        doctorOption.textContent = doctorName;

        doctorSelect.appendChild(doctorOption);
      });
    }

  } catch (error) {
    console.error('Errore nel recuperare pazienti e medici:', error);
  }
}


// Funzione per ottenere le prime n visite, con n passato come parametro limit
async function getAppointments(limit = DEFAULT_SEARCH_LIMIT) {
  const appointmentUrl = buildTaggedSearchUrl('Appointment', limit);

  try {
    // Effettua la richiesta HTTP al server FHIR usando fetch
    const response = await fetch(appointmentUrl);

    if (!response.ok) {
      // Se la risposta non è OK, lancia un'eccezione
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Estrai i dati JSON dalla risposta
    const data = await response.json();

    // Ottieni le prime limit visite
    const appointments = data.entry;

    // Trova l'elemento HTML con ID 'appointments'
    const appointmentsList = document.getElementById('appointments');

    if (!appointmentsList) {
      return;
    }

    // Cancella eventuali elementi precedenti dalla lista
    appointmentsList.innerHTML = '';

    if (!appointments) {
      showMessage('Nessuna visita trovata', 'red');
      return;
    }

    // Aggiungi le visite alla lista come elementi HTML
    appointments.forEach((appointment) => {
      // Crea un nuovo elemento `li` per ogni visita
      const appointmentItem = document.createElement('li');

      const dataVisita = appointment.resource.start
        ? appointment.resource.start
        : '';

      const tipologia = appointment.resource.serviceType
        ? appointment.resource.serviceType[0].text
        : '';

      const note = appointment.resource.description
        ? appointment.resource.description
        : '';

      let paziente = '';
      let medico = '';

      if (appointment.resource.participant) {
        appointment.resource.participant.forEach((participant) => {
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

      // Imposta il testo dell'elemento
      appointmentItem.textContent =
        dataVisita +
        ' - ' +
        tipologia +
        ' - Paziente: ' +
        paziente +
        ' - Medico: ' +
        medico +
        ' - Note: ' +
        note;

      // Aggiungi l'elemento alla lista
      appointmentsList.appendChild(appointmentItem);
    });

  } catch (error) {
    console.error('Errore nel recuperare le visite:', error);
  }
}


// Funzione per creare una nuova visita
async function createAppointment() {
  // Ottieni i dettagli della visita inseriti dall'utente
  const visitType = document.getElementById('visitType').value;
  const visitDate = document.getElementById('visitDate').value;
  const notes = document.getElementById('notes').value;

  const patientSelect = document.getElementById('patientSelect');
  const doctorSelect = document.getElementById('doctorSelect');

  const patientId = patientSelect.value;
  const doctorId = doctorSelect.value;

  const patientName = patientSelect.options[patientSelect.selectedIndex].text;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;

  if (!visitType || !visitDate || !patientId || !doctorId) {
    showMessage('Compila tutti i campi obbligatori', 'red');
    return;
  }

  // Crea i dati della visita in formato FHIR
  const appointmentData = {
    resourceType: 'Appointment',
    meta: {
      tag: [{
        code: APP_TAG,
        display: 'App Salute Digitale'
      }]
    },
    status: 'booked',
    description: notes,
    start: visitDate + 'T09:00:00',
    end: visitDate + 'T09:30:00',
    serviceType: [{
      text: visitType
    }],
    participant: [
      {
        actor: {
          reference: 'Patient/' + patientId,
          display: patientName
        },
        status: 'accepted'
      },
      {
        actor: {
          reference: 'Practitioner/' + doctorId,
          display: doctorName
        },
        status: 'accepted'
      }
    ]
  };

  try {
    // Effettua la richiesta POST al server FHIR usando fetch
    const response = await fetch(`${FHIR_BASE_URL}Appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(appointmentData)
    });

    if (!response.ok) {
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Ottieni l'ID della visita creata dal server
    const result = await response.json();
    const appointmentId = result.id;

    sessionStorage.setItem('appointmentCreatedMessage', `Visita creata con successo! ID: ${appointmentId}`);
    window.location.href = 'appointments.html';

  } catch (error) {
    showMessage(`Errore nella creazione della visita: ${error.message}`, 'red');
  }
}


// Funzione per aggiornare i contatori della pagina iniziale
async function getDashboardCounts() {
  const patientUrl = `${FHIR_BASE_URL}Patient?_tag=` + APP_TAG + `&_summary=count`;
  const doctorUrl = `${FHIR_BASE_URL}Practitioner?_tag=` + APP_TAG + `&_summary=count`;
  const appointmentUrl = `${FHIR_BASE_URL}Appointment?_tag=` + APP_TAG + `&_summary=count`;

  try {
    // Richiesta pazienti
    const patientResponse = await fetch(patientUrl);

    if (!patientResponse.ok) {
      throw new Error(`Errore: ${patientResponse.statusText}`);
    }

    const patientData = await patientResponse.json();

    // Richiesta medici
    const doctorResponse = await fetch(doctorUrl);

    if (!doctorResponse.ok) {
      throw new Error(`Errore: ${doctorResponse.statusText}`);
    }

    const doctorData = await doctorResponse.json();

    // Richiesta visite
    const appointmentResponse = await fetch(appointmentUrl);

    if (!appointmentResponse.ok) {
      throw new Error(`Errore: ${appointmentResponse.statusText}`);
    }

    const appointmentData = await appointmentResponse.json();

    // Inserisci i valori nella pagina HTML
    document.getElementById('patientsCount').textContent = patientData.total;
    document.getElementById('doctorsCount').textContent = doctorData.total;
    document.getElementById('appointmentsCount').textContent = appointmentData.total;

  } catch (error) {
    console.error('Errore nel recuperare i contatori:', error);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const createdMessage = sessionStorage.getItem('patientCreatedMessage');
  const appointmentCreatedMessage = sessionStorage.getItem('appointmentCreatedMessage');

  if (createdMessage && document.getElementById('patients')) {
    showMessage(createdMessage, 'green');
    sessionStorage.removeItem('patientCreatedMessage');
  }

  if (appointmentCreatedMessage && document.getElementById('appointments')) {
    showMessage(appointmentCreatedMessage, 'green');
    sessionStorage.removeItem('appointmentCreatedMessage');
  }
});
