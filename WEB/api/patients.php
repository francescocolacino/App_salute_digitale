<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Metodo non consentito.'], 405);
}

$query = trim((string) ($_GET['query'] ?? ''));

try {
    jsonResponse(['patients' => searchPatients($query)]);
} catch (Throwable $throwable) {
    jsonResponse(['error' => 'Database non disponibile.'], 500);
}
