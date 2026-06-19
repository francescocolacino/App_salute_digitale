<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/repository.php';

// Valori iniziali della dashboard.
$stats = [
    'patients' => 0,
    'observations' => 0,
    'encounters' => 0,
];
$errorMessage = '';
$successMessage = '';
$patientModalError = '';
$shouldOpenPatientModal = false;
$patientFormData = [
    'full_name' => '',
    'tax_code' => '',
    'birth_date' => '',
];

// Gestione del form nel popup per inserire un nuovo paziente.
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['form_action'] ?? '') === 'create_patient') {
    $patientFormData = [
        'full_name' => trim($_POST['full_name'] ?? ''),
        'tax_code' => strtoupper(trim($_POST['tax_code'] ?? '')),
        'birth_date' => trim($_POST['birth_date'] ?? ''),
    ];

    try {
        $birthDate = $patientFormData['birth_date'] === '' ? null : $patientFormData['birth_date'];

        createPatient(
            $patientFormData['full_name'],
            $patientFormData['tax_code'],
            $birthDate
        );

        $successMessage = 'Paziente salvato correttamente.';
        $patientFormData = [
            'full_name' => '',
            'tax_code' => '',
            'birth_date' => '',
        ];
    } catch (Throwable $throwable) {
        $patientModalError = $throwable->getMessage();
        $shouldOpenPatientModal = true;
    }
}

// Carica i numeri da mostrare nella dashboard.
try {
    $stats = getDashboardStats();
} catch (Throwable $throwable) {
    $errorMessage = $throwable->getMessage();
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="page-card">
    <h1>Dashboard</h1>
    <p>Area principale per ricerca pazienti, osservazioni e incontri clinici.</p>

    <?php if ($successMessage !== ''): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <?php if ($errorMessage !== ''): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php else: ?>
        <div class="stats-grid">
            <article class="stat-card">
                <span class="stat-label">Pazienti</span>
                <strong class="stat-value"><?php echo (int) $stats['patients']; ?></strong>
            </article>
            <article class="stat-card">
                <span class="stat-label">Osservazioni</span>
                <strong class="stat-value"><?php echo (int) $stats['observations']; ?></strong>
            </article>
            <article class="stat-card">
                <span class="stat-label">Incontri</span>
                <strong class="stat-value"><?php echo (int) $stats['encounters']; ?></strong>
            </article>
        </div>
    <?php endif; ?>

    <div class="actions">
        <a class="button" href="search_patient.php">Cerca paziente</a>
        <button type="button" class="button button-secondary" data-modal-open="patient-create-modal">Inserisci paziente</button>
        <a class="button" href="insert_observation.php">Inserisci osservazione</a>
    </div>
</section>

<div
    id="patient-create-modal"
    class="modal-shell <?php echo $shouldOpenPatientModal ? 'is-open' : ''; ?>"
    data-modal
>
    <div class="modal-backdrop" data-modal-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title">
        <div class="modal-header">
            <div>
                <h2 id="patient-modal-title">Inserisci paziente</h2>
                <p>Compila i dati anagrafici e salva direttamente dal popup.</p>
            </div>
            <button type="button" class="modal-close" aria-label="Chiudi popup" data-modal-close>&times;</button>
        </div>

        <?php if ($patientModalError !== ''): ?>
            <div class="alert alert-error"><?php echo htmlspecialchars($patientModalError, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>

        <form method="post" data-validate>
            <input type="hidden" name="form_action" value="create_patient">

            <label for="patient_full_name">Nome completo</label>
            <input
                id="patient_full_name"
                name="full_name"
                type="text"
                value="<?php echo htmlspecialchars($patientFormData['full_name'], ENT_QUOTES, 'UTF-8'); ?>"
                required
            >

            <label for="patient_tax_code">Codice fiscale</label>
            <input
                id="patient_tax_code"
                name="tax_code"
                type="text"
                maxlength="16"
                value="<?php echo htmlspecialchars($patientFormData['tax_code'], ENT_QUOTES, 'UTF-8'); ?>"
                required
            >

            <label for="patient_birth_date">Data di nascita</label>
            <input
                id="patient_birth_date"
                name="birth_date"
                type="date"
                value="<?php echo htmlspecialchars($patientFormData['birth_date'], ENT_QUOTES, 'UTF-8'); ?>"
            >

            <div class="modal-actions">
                <button type="submit" class="button">Salva paziente</button>
                <button type="button" class="button button-secondary" data-modal-close>Annulla</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
