<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Metodo non consentito.'], 405);
}

$patientId = requirePositiveInt((string) ($_GET['id'] ?? ''), 'id');

try {
    $patient = findPatientById($patientId);

    if ($patient === null) {
        jsonResponse(['error' => 'Paziente non trovato.'], 404);
    }

    jsonResponse(['patient' => $patient]);
} catch (Throwable $throwable) {
    jsonResponse(['error' => 'Database non disponibile.'], 500);
}
