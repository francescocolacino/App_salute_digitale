<?php
/*
    Login utente.

    Questo file riceve email e password dal form login.html.
    Controlla l'utente nel database e avvia la sessione.
*/

session_start();

require_once __DIR__ . "/db.php";

$email = $_POST["email"];
$password = $_POST["password"];

if ($email == "" || $password == "") {
    echo "Compila tutti i campi.";
    echo "<br>";
    echo "<a href='../login.html'>Torna al login</a>";
    exit;
}

/* Ricerca utente */
$query = "SELECT * FROM users WHERE email = :email";

$stmt = $conn->prepare($query);

$stmt->bindParam(":email", $email);

$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo "Email o password non corretti.";
    echo "<br>";
    echo "<a href='../login.html'>Torna al login</a>";
    exit;
}

/* Verifica password */
if (password_verify($password, $user["password"])) {

    $_SESSION["user_id"] = $user["id"];
    $_SESSION["user_nome"] = $user["nome"];
    $_SESSION["user_cognome"] = $user["cognome"];
    $_SESSION["user_email"] = $user["email"];

    header("Location: ../dashboard.html");
    exit;

} else {

    echo "Email o password non corretti.";
    echo "<br>";
    echo "<a href='../login.html'>Torna al login</a>";
    exit;
}
?>