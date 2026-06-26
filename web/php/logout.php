<?php
/*
    Logout utente.

    Questo file chiude la sessione e riporta
    l'utente alla pagina di login.
*/

session_start();

session_unset();

session_destroy();

header("Location: ../login.html");

exit;
?>