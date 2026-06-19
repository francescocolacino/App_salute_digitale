# App Salute Digitale

Piattaforma di salute digitale per la consultazione e gestione di dati clinici.

## Avvio rapido

1. Importa `DB/database.sql` in MySQL o MariaDB.
2. Avvia il backend dalla root del progetto con `php -S 0.0.0.0:8000 -t WEB`.
3. Apri il sito su `http://localhost:8000`.
4. Avvia l'app React Native e verifica che `APP/config.js` punti all'host giusto.

## Backend condiviso

- Le pagine web usano `WEB/includes/repository.php`.
- L'app mobile usa le API JSON in `WEB/api`.
- Entrambi leggono e scrivono sulle tabelle `users`, `patients`, `observations` ed `encounters`.
