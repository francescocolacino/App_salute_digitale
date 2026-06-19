<?php

require_once __DIR__ . '/db.php';

// Restituisce sempre una connessione valida oppure blocca con errore.
function requireDbConnection(): PDO
{
    $connection = getDbConnection();

    if ($connection !== null) {
        return $connection;
    }

    throw new RuntimeException(getLastDbConnectionError() ?? 'Database non disponibile.');
}

// Cerca un utente partendo dalla mail.
function findUserByEmail(string $email): ?array
{
    $connection = requireDbConnection();
    $statement = $connection->prepare('SELECT id, full_name, email, password_hash FROM users WHERE email = :email LIMIT 1');
    $statement->execute(['email' => $email]);
    $user = $statement->fetch();

    return $user === false ? null : $user;
}

// Crea un nuovo utente.
function createUser(string $fullName, string $email, string $password): int
{
    if (findUserByEmail($email) !== null) {
        throw new InvalidArgumentException('Email gia\' registrata.');
    }

    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'INSERT INTO users (full_name, email, password_hash) VALUES (:full_name, :email, :password_hash)'
    );
    $statement->execute([
        'full_name' => $fullName,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    return (int) $connection->lastInsertId();
}

// Controlla se email e password sono corrette.
function authenticateUser(string $email, string $password): ?array
{
    $user = findUserByEmail($email);

    if ($user === null || !password_verify($password, $user['password_hash'])) {
        return null;
    }

    unset($user['password_hash']);

    return $user;
}

// Conta i record principali da mostrare in dashboard.
function getDashboardStats(): array
{
    $connection = requireDbConnection();

    return [
        'patients' => (int) $connection->query('SELECT COUNT(*) FROM patients')->fetchColumn(),
        'observations' => (int) $connection->query('SELECT COUNT(*) FROM observations')->fetchColumn(),
        'encounters' => (int) $connection->query('SELECT COUNT(*) FROM encounters')->fetchColumn(),
    ];
}

// Cerca i pazienti per nome o codice fiscale.
function searchPatients(string $query = ''): array
{
    $connection = requireDbConnection();
    $query = trim($query);

    if ($query === '') {
        $statement = $connection->query(
            'SELECT id, full_name, tax_code, birth_date FROM patients ORDER BY full_name ASC LIMIT 25'
        );

        return $statement->fetchAll();
    }

    $statement = $connection->prepare(
        'SELECT id, full_name, tax_code, birth_date
         FROM patients
         WHERE full_name LIKE :full_name_term OR tax_code LIKE :tax_code_term
         ORDER BY full_name ASC
         LIMIT 25'
    );
    $searchTerm = '%' . $query . '%';
    $statement->execute([
        'full_name_term' => $searchTerm,
        'tax_code_term' => $searchTerm,
    ]);

    return $statement->fetchAll();
}

// Cerca un paziente tramite id.
function findPatientById(int $patientId): ?array
{
    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'SELECT id, full_name, tax_code, birth_date FROM patients WHERE id = :patient_id LIMIT 1'
    );
    $statement->execute(['patient_id' => $patientId]);
    $patient = $statement->fetch();

    return $patient === false ? null : $patient;
}

// Cerca un paziente tramite codice fiscale.
function findPatientByTaxCode(string $taxCode): ?array
{
    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'SELECT id, full_name, tax_code, birth_date FROM patients WHERE tax_code = :tax_code LIMIT 1'
    );
    $statement->execute(['tax_code' => strtoupper(trim($taxCode))]);
    $patient = $statement->fetch();

    return $patient === false ? null : $patient;
}

// Inserisce un nuovo paziente dopo alcuni controlli semplici.
function createPatient(string $fullName, string $taxCode, ?string $birthDate): int
{
    $fullName = trim($fullName);
    $taxCode = strtoupper(trim($taxCode));
    $birthDate = $birthDate !== null ? trim($birthDate) : '';

    if ($fullName === '') {
        throw new InvalidArgumentException('Il nome del paziente e\' obbligatorio.');
    }

    if ($taxCode === '') {
        throw new InvalidArgumentException('Il codice fiscale e\' obbligatorio.');
    }

    if (strlen($taxCode) !== 16) {
        throw new InvalidArgumentException('Il codice fiscale deve contenere 16 caratteri.');
    }

    if (findPatientByTaxCode($taxCode) !== null) {
        throw new InvalidArgumentException('Esiste gia\' un paziente con questo codice fiscale.');
    }

    if ($birthDate !== '') {
        $parsedDate = DateTime::createFromFormat('Y-m-d', $birthDate);

        if ($parsedDate === false || $parsedDate->format('Y-m-d') !== $birthDate) {
            throw new InvalidArgumentException('La data di nascita non e\' valida.');
        }
    }

    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'INSERT INTO patients (full_name, tax_code, birth_date)
         VALUES (:full_name, :tax_code, :birth_date)'
    );
    $statement->execute([
        'full_name' => $fullName,
        'tax_code' => $taxCode,
        'birth_date' => $birthDate === '' ? null : $birthDate,
    ]);

    return (int) $connection->lastInsertId();
}

// Restituisce la lista delle osservazioni di un paziente.
function listObservationsByPatient(int $patientId): array
{
    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'SELECT id, patient_id, observation_text, created_at
         FROM observations
         WHERE patient_id = :patient_id
         ORDER BY created_at DESC'
    );
    $statement->execute(['patient_id' => $patientId]);

    return $statement->fetchAll();
}

// Salva una nuova osservazione.
function createObservation(int $patientId, string $observationText): int
{
    if (findPatientById($patientId) === null) {
        throw new InvalidArgumentException('Paziente non trovato.');
    }

    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'INSERT INTO observations (patient_id, observation_text) VALUES (:patient_id, :observation_text)'
    );
    $statement->execute([
        'patient_id' => $patientId,
        'observation_text' => $observationText,
    ]);

    return (int) $connection->lastInsertId();
}

// Restituisce gli incontri clinici di un paziente.
function listEncountersByPatient(int $patientId): array
{
    $connection = requireDbConnection();
    $statement = $connection->prepare(
        'SELECT id, patient_id, encounter_date, department, notes, created_at
         FROM encounters
         WHERE patient_id = :patient_id
         ORDER BY encounter_date DESC, created_at DESC'
    );
    $statement->execute(['patient_id' => $patientId]);

    return $statement->fetchAll();
}
