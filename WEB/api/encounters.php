<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Metodo non consentito.'], 405);
}

$patientId = requirePositiveInt((string) ($_GET['patient_id'] ?? ''), 'patient_id');

try {
    jsonResponse(['encounters' => listEncountersByPatient($patientId)]);
} catch (Throwable $throwable) {
    jsonResponse(['error' => 'Database non disponibile.'], 500);
}
