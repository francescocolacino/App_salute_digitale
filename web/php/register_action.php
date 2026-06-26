<?php
/*
    Registrazione utente.

    Questo file riceve i dati dal form register.html.
    Salva l'utente nel database usando password_hash().
*/

require_once __DIR__ . "/db.php";

$nome = $_POST["firstName"];
$cognome = $_POST["lastName"];
$email = $_POST["email"];
$password = $_POST["password"];
$confermaPassword = $_POST["confirmPassword"];

if ($nome == "" || $cognome == "" || $email == "" || $password == "" || $confermaPassword == "") {
    echo "Compila tutti i campi.";
    echo "<br>";
    echo "<a href='../register.html'>Torna alla registrazione</a>";
    exit;
}

if ($password != $confermaPassword) {
    echo "Le password non coincidono.";
    echo "<br>";
    echo "<a href='../register.html'>Torna alla registrazione</a>";
    exit;
}

/* Controllo email già registrata */
$query = "SELECT * FROM users WHERE email = :email";

$stmt = $conn->prepare($query);

$stmt->bindParam(":email", $email);

$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "Email già registrata.";
    echo "<br>";
    echo "<a href='../register.html'>Torna alla registrazione</a>";
    exit;
}

/* Password criptata */
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

/* Inserimento nuovo utente */
$queryInsert = "
    INSERT INTO users (nome, cognome, email, password)
    VALUES (:nome, :cognome, :email, :password)
";

$stmtInsert = $conn->prepare($queryInsert);

$stmtInsert->bindParam(":nome", $nome);
$stmtInsert->bindParam(":cognome", $cognome);
$stmtInsert->bindParam(":email", $email);
$stmtInsert->bindParam(":password", $passwordHash);

if ($stmtInsert->execute()) {
    header("Location: ../login.html");
    exit;
} else {
    echo "Errore durante la registrazione.";
    echo "<br>";
    echo "<a href='../register.html'>Torna alla registrazione</a>";
    exit;
}
?>