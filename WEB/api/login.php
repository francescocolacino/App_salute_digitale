<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Metodo non consentito.'], 405);
}

$payload = getJsonInput();
$email = trim((string) ($payload['email'] ?? ''));
$password = trim((string) ($payload['password'] ?? ''));

if ($email === '' || $password === '') {
    jsonResponse(['error' => 'Email e password sono obbligatorie.'], 422);
}

try {
    $user = authenticateUser($email, $password);

    if ($user === null) {
        jsonResponse(['error' => 'Credenziali non valide.'], 401);
    }

    jsonResponse(['user' => $user]);
} catch (Throwable $throwable) {
    jsonResponse(['error' => 'Database non disponibile.'], 500);
}
