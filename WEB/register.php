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
$fullName = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($fullName === '' || $email === '' || $password === '') {
        $errorMessage = 'Compila tutti i campi.';
    } elseif (strlen($password) < 6) {
        $errorMessage = 'La password deve contenere almeno 6 caratteri.';
    } else {
        try {
            $userId = createUser($fullName, $email, $password);
            $_SESSION['user_id'] = $userId;
            $_SESSION['full_name'] = $fullName;

            header('Location: dashboard.php');
            exit;
        } catch (InvalidArgumentException $exception) {
            $errorMessage = $exception->getMessage();
        } catch (Throwable $throwable) {
            $errorMessage = $throwable->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<section class="page-card">
    <h1>Registrazione</h1>
    <?php if ($errorMessage !== ''): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form method="post" data-validate>
        <label for="full_name">Nome completo</label>
        <input id="full_name" name="full_name" type="text" value="<?php echo htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8'); ?>" required>

        <label for="register_email">Email</label>
        <input id="register_email" name="email" type="email" value="<?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?>" required>

        <label for="register_password">Password</label>
        <input id="register_password" name="password" type="password" required>

        <button type="submit">Crea account</button>
    </form>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
