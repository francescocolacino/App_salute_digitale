<?php
/*
    Controllo della sessione utente.

    Questo file viene chiamato da JavaScript per verificare
    se l'utente ha effettuato il login.
*/

session_start();

header("Content-Type: application/json");

if (isset($_SESSION["user_id"])) {
    echo json_encode(array(
        "logged" => true
    ));
} else {
    echo json_encode(array(
        "logged" => false
    ));
}
?>