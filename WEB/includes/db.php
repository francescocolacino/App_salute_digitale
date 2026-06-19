<?php

// Dati base per la connessione al database locale.
$dbConfig = [
    'host' => '127.0.0.1',
    'port' => '3306',
    'database' => 'app_salute_digitale',
    'username' => 'root',
    'password' => '',
];

$lastDbConnectionError = null;

// Prova ad aprire la connessione e restituisce null se qualcosa non va.
function getDbConnection(): ?PDO
{
    global $dbConfig, $lastDbConnectionError;

    $lastDbConnectionError = null;
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
        $dbConfig['host'],
        $dbConfig['port'],
        $dbConfig['database']
    );

    try {
        return new PDO(
            $dsn,
            $dbConfig['username'],
            $dbConfig['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $exception) {
        $lastDbConnectionError = 'Impossibile connettersi al database MySQL.';
        error_log($lastDbConnectionError . ' Dettaglio: ' . $exception->getMessage());
        return null;
    }
}

// Restituisce l'ultimo errore di connessione, utile nelle pagine.
function getLastDbConnectionError(): ?string
{
    global $lastDbConnectionError;

    return $lastDbConnectionError;
}
