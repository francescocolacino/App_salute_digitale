# App Salute Digitale

Progetto dimostrativo composto da:

- `web/`: sito in HTML, CSS, JavaScript e PHP
- `app/`: app mobile React Native con Expo
- `db/`: database SQLite per registrazione e login

I dati clinici non vengono salvati in un server locale del repository: sito e app usano il server FHIR pubblico `https://hapi.fhir.org/baseR4/`.

## Avvio rapido

Apri due terminali nella cartella del progetto.

### 1. Avvia il sito web

```powershell
php -S 127.0.0.1:8000 -t web
```

Poi apri:

```text
http://127.0.0.1:8000/index.html
```

### 2. Avvia l'app mobile

Se serve installare le dipendenze:

```powershell
cd app
npm install
```

Per avviare Expo:

```powershell
cd app
npx expo start
```

Da Expo puoi poi:

- premere `w` per aprire la versione web
- premere `a` per Android
- scansionare il QR code con Expo Go

## Server FHIR

Non c'e' un server FHIR locale da avviare in questo progetto.

Le richieste FHIR puntano direttamente a:

```text
https://hapi.fhir.org/baseR4/
```

Se durante la demo il professore ti chiede del backend FHIR, puoi dire che il progetto usa il server pubblico di test HAPI FHIR in versione R4.

## Login

Il database SQLite viene creato/usato automaticamente dal codice PHP nel file `web/php/db.php`.

Se parti da un database vuoto, puoi registrare un utente da:

```text
http://127.0.0.1:8000/register.html
```
