<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/repository.php';

// Legge il testo scritto nella barra di ricerca.
$query = trim($_GET['query'] ?? '');
$patients = [];
$errorMessage = '';

// Cerca i pazienti nel database.
try {
    $patients = searchPatients($query);
} catch (Throwable $throwable) {
    $errorMessage = $throwable->getMessage();
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="page-card">
    <h1>Ricerca paziente</h1>
    <form method="get">
        <label for="query">Nome, cognome o codice fiscale</label>
        <input id="query" name="query" type="text" value="<?php echo htmlspecialchars($query, ENT_QUOTES, 'UTF-8'); ?>" placeholder="Cerca un paziente">
        <button type="submit">Cerca</button>
    </form>

    <?php if ($errorMessage !== ''): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php elseif ($patients === []): ?>
        <div class="empty-state">Nessun paziente trovato.</div>
    <?php else: ?>
        <div class="result-grid">
            <?php foreach ($patients as $patient): ?>
                <article class="result-card">
                    <h2><?php echo htmlspecialchars($patient['full_name'], ENT_QUOTES, 'UTF-8'); ?></h2>
                    <ul class="meta-list">
                        <li>ID: <?php echo (int) $patient['id']; ?></li>
                        <li>Codice fiscale: <?php echo htmlspecialchars($patient['tax_code'], ENT_QUOTES, 'UTF-8'); ?></li>
                        <li>Data di nascita: <?php echo htmlspecialchars($patient['birth_date'] ?? 'Non disponibile', ENT_QUOTES, 'UTF-8'); ?></li>
                    </ul>
                    <div class="actions">
                        <a class="button" href="insert_observation.php?patient_id=<?php echo (int) $patient['id']; ?>">Aggiungi osservazione</a>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
