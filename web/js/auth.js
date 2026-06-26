/*
    Controllo accesso utente.

    Questo file controlla se l'utente ha effettuato il login.
    Se l'utente non è loggato, viene rimandato alla pagina login.html.
*/

document.addEventListener("DOMContentLoaded", function () {
    controllaAccesso();
});


function controllaAccesso() {

    fetch("php/check_session.php")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            if (data.logged !== true) {
                window.location.href = "login.html";
            }

        })
        .catch(function (errore) {
            window.location.href = "login.html";
        });
}