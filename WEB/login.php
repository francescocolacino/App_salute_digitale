<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/includes/repository.php';

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$errorMessage = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($email === '' || $password === '') {
        $errorMessage = 'Compila email e password.';
    } else {
        try {
            $user = authenticateUser($email, $password);

            if ($user === null) {
                $errorMessage = 'Credenziali non valide.';
            } else {
                $_SESSION['user_id'] = (int) $user['id'];
                $_SESSION['full_name'] = $user['full_name'];

                header('Location: dashboard.php');
                exit;
            }
        } catch (Throwable $throwable) {
            $errorMessage = $throwable->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="page-card">
    <h1>Login</h1>
    <p>Usa le credenziali registrate sul sito. Le stesse tabelle saranno lette anche dalle API usate dall'app mobile.</p>

    <?php if ($errorMessage !== ''): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form method="post" data-validate>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value="<?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?>" required>

        <label for="password">Password</label>
        <input id="password" name="password" type="password" required>

        <button type="submit">Accedi</button>
    </form>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
