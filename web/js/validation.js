/*
    Validazione dei form di login e registrazione.
    I controlli principali vengono fatti prima dell'invio.
*/

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("loginForm") !== null) {
        document.getElementById("loginForm").addEventListener("submit", function (event) {
            validaLogin(event);
        });
    }

    if (document.getElementById("registerForm") !== null) {
        document.getElementById("registerForm").addEventListener("submit", function (event) {
            validaRegistrazione(event);
        });
    }

});


function validaLogin(event) {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var messaggio = document.getElementById("message");

    if (email === "" || password === "") {
        event.preventDefault();
        messaggio.innerText = "Compila tutti i campi.";
        return;
    }

    if (email.indexOf("@") === -1) {
        event.preventDefault();
        messaggio.innerText = "Inserisci una email valida.";
        return;
    }
}


function validaRegistrazione(event) {

    var nome = document.getElementById("firstName").value;
    var cognome = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confermaPassword = document.getElementById("confirmPassword").value;
    var messaggio = document.getElementById("message");

    if (nome === "" || cognome === "" || email === "" || password === "" || confermaPassword === "") {
        event.preventDefault();
        messaggio.innerText = "Compila tutti i campi.";
        return;
    }

    if (email.indexOf("@") === -1) {
        event.preventDefault();
        messaggio.innerText = "Inserisci una email valida.";
        return;
    }

    if (password !== confermaPassword) {
        event.preventDefault();
        messaggio.innerText = "Le password non coincidono.";
        return;
    }
}