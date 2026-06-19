<?php

require_once dirname(__DIR__) . '/includes/repository.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonInput(): array
{
    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || trim($rawInput) === '') {
        return [];
    }

    $decoded = json_decode($rawInput, true);

    if (!is_array($decoded)) {
        jsonResponse(['error' => 'Payload JSON non valido.'], 400);
    }

    return $decoded;
}

function requirePositiveInt(string $value, string $fieldName): int
{
    if (!ctype_digit($value) || (int) $value <= 0) {
        jsonResponse(['error' => sprintf('Il campo %s deve essere un intero positivo.', $fieldName)], 422);
    }

    return (int) $value;
}
