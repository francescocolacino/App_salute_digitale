<?php
/*
    Connessione al database SQLite.

    Il database viene usato solo per:
    - registrazione utente
    - login
    - password

    I dati sanitari vengono salvati su FHIR.
*/

$dbPath = __DIR__ . "/../../db/app_salute_digitale.sqlite";

try {
    $conn = new PDO("sqlite:" . $dbPath);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cognome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            data_registrazione TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ";

    $conn->exec($query);

} catch (PDOException $e) {
    die("Errore di connessione al database.");
}
?>