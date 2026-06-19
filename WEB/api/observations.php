<?php

require_once __DIR__ . '/bootstrap.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $patientId = requirePositiveInt((string) ($_GET['patient_id'] ?? ''), 'patient_id');
        jsonResponse(['observations' => listObservationsByPatient($patientId)]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = getJsonInput();
        $patientId = requirePositiveInt((string) ($payload['patient_id'] ?? ''), 'patient_id');
        $observationText = trim((string) ($payload['observation_text'] ?? ''));

        if ($observationText === '') {
            jsonResponse(['error' => 'Il testo dell\'osservazione e\' obbligatorio.'], 422);
        }

        $observationId = createObservation($patientId, $observationText);

        jsonResponse([
            'observation' => [
                'id' => $observationId,
                'patient_id' => $patientId,
                'observation_text' => $observationText,
            ],
        ], 201);
    }

    jsonResponse(['error' => 'Metodo non consentito.'], 405);
} catch (InvalidArgumentException $exception) {
    jsonResponse(['error' => $exception->getMessage()], 404);
} catch (Throwable $throwable) {
    jsonResponse(['error' => 'Database non disponibile.'], 500);
}
