<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$isAuthenticated = isset($_SESSION['user_id']);
$currentFile = basename($_SERVER['PHP_SELF'] ?? '');

function isCurrentPage(string $fileName, string $currentFile): bool
{
    return $fileName === $currentFile;
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Salute Digitale</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="site-header">
        <nav class="site-nav">
            <div class="site-brand">
                <a href="index.php">App Salute Digitale</a>
            </div>
            <div class="site-links">
                <a class="<?php echo isCurrentPage('index.php', $currentFile) ? 'active' : ''; ?>" href="index.php">Home</a>
                <?php if ($isAuthenticated): ?>
                    <a class="<?php echo isCurrentPage('dashboard.php', $currentFile) ? 'active' : ''; ?>" href="dashboard.php">Dashboard</a>
                    <a class="<?php echo isCurrentPage('search_patient.php', $currentFile) ? 'active' : ''; ?>" href="search_patient.php">Pazienti</a>
                    <a class="<?php echo isCurrentPage('insert_observation.php', $currentFile) ? 'active' : ''; ?>" href="insert_observation.php">Osservazioni</a>
                    <a href="logout.php">Logout</a>
                <?php else: ?>
                    <a class="<?php echo isCurrentPage('login.php', $currentFile) ? 'active' : ''; ?>" href="login.php">Login</a>
                    <a class="<?php echo isCurrentPage('register.php', $currentFile) ? 'active' : ''; ?>" href="register.php">Registrazione</a>
                <?php endif; ?>
            </div>
            <div class="site-status">
                <?php if ($isAuthenticated): ?>
                    <span>Connesso come <?php echo htmlspecialchars($_SESSION['full_name'] ?? 'utente', ENT_QUOTES, 'UTF-8'); ?></span>
                <?php else: ?>
                    <span>Modalita' ospite</span>
                <?php endif; ?>
            </div>
        </nav>
    </header>
    <main class="page-content">
