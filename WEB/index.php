<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$isAuthenticated = isset($_SESSION['user_id']);
require_once __DIR__ . '/includes/header.php';
?>

<section class="page-card">
    <h1>App Salute Digitale</h1>
    <p>Sito web e app mobile condividono lo stesso backend PHP e lo stesso database MySQL.</p>
    <div class="actions">
        <?php if ($isAuthenticated): ?>
            <a class="button" href="dashboard.php">Apri dashboard</a>
            <a class="button button-secondary" href="search_patient.php">Cerca pazienti</a>
        <?php else: ?>
            <a class="button" href="login.php">Login</a>
            <a class="button button-secondary" href="register.php">Registrazione</a>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
