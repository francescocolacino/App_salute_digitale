<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Metodo non consentito.'], 405);
}

$payload = getJsonInput();
$fullName = trim((string) ($payload['full_name'] ?? ''));
$email = trim((string) ($payload['email'] ?? ''));
$password = trim((string) ($payload['password'] ?? ''));

if ($fullName === '' || $email === '' || $password === '') {
    jsonResponse(['error' => 'Tutti i campi sono obbligatori.'], 422);
}

if (strlen($password) < 6) {
    jsonResponse(['error' => 'La password deve contenere almeno 6 caratteri.'], 422);
}

try {
    $userId = createUser($fullName, $email, $password);
    jsonResponse([
        'user' => [
            'id' => $userId,
            'full_name' => $fullName,
            'email' => $email,
        ],
    ], 201);
} catch (InvalidArgumentException $exception) {
    jsonResponse(['error' => $exception->getMessage()], 409);
} catch (Throwable $throwable) {
    jsonResponse(['error' => 'Database non disponibile.'], 500);
}
