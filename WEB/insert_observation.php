<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/repository.php';

// Variabili usate nella pagina.
$errorMessage = '';
$successMessage = '';
$patientId = (int) ($_GET['patient_id'] ?? $_POST['patient_id'] ?? 0);
$observationText = trim($_POST['observation'] ?? '');
$selectedPatient = null;
$observations = [];

try {
    // Se c'e' un id paziente provo a caricare i suoi dati.
    if ($patientId > 0) {
        $selectedPatient = findPatientById($patientId);
        if ($selectedPatient !== null) {
            $observations = listObservationsByPatient($patientId);
        }
    }

    // Se il form e' stato inviato provo a salvare l'osservazione.
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($patientId <= 0) {
            $errorMessage = 'Inserisci un ID paziente valido.';
        } elseif ($observationText === '') {
            $errorMessage = 'Scrivi un testo per l\'osservazione.';
        } elseif ($selectedPatient === null) {
            $errorMessage = 'Il paziente selezionato non esiste.';
        } else {
            createObservation($patientId, $observationText);
            $successMessage = 'Osservazione salvata correttamente.';
            $observationText = '';
            $observations = listObservationsByPatient($patientId);
        }
    }
} catch (Throwable $throwable) {
    $errorMessage = $throwable->getMessage();
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="page-card">
    <h1>Inserisci osservazione</h1>
    <?php if ($errorMessage !== ''): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <?php if ($successMessage !== ''): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form method="post" data-validate>
        <label for="patient_id">ID paziente</label>
        <input id="patient_id" name="patient_id" type="number" min="1" value="<?php echo $patientId > 0 ? (int) $patientId : ''; ?>" required>

        <label for="observation">Osservazione</label>
        <textarea id="observation" name="observation" rows="5" required><?php echo htmlspecialchars($observationText, ENT_QUOTES, 'UTF-8'); ?></textarea>

        <button type="submit">Salva</button>
    </form>

    <?php if ($selectedPatient !== null): ?>
        <section class="page-section">
            <h2>Paziente selezionato</h2>
            <p>
                <strong><?php echo htmlspecialchars($selectedPatient['full_name'], ENT_QUOTES, 'UTF-8'); ?></strong><br>
                Codice fiscale: <?php echo htmlspecialchars($selectedPatient['tax_code'], ENT_QUOTES, 'UTF-8'); ?><br>
                Data di nascita: <?php echo htmlspecialchars($selectedPatient['birth_date'] ?? 'Non disponibile', ENT_QUOTES, 'UTF-8'); ?>
            </p>
        </section>

        <section class="page-section">
            <h2>Ultime osservazioni</h2>
            <?php if ($observations === []): ?>
                <div class="empty-state">Nessuna osservazione per questo paziente.</div>
            <?php else: ?>
                <div class="list-stack">
                    <?php foreach ($observations as $observation): ?>
                        <article class="result-card">
                            <strong><?php echo htmlspecialchars($observation['created_at'], ENT_QUOTES, 'UTF-8'); ?></strong>
                            <p><?php echo nl2br(htmlspecialchars($observation['observation_text'], ENT_QUOTES, 'UTF-8')); ?></p>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </section>
    <?php endif; ?>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
