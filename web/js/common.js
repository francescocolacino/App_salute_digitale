/*
    File comune del sito.

    Questo file carica header e footer nelle pagine HTML.
*/

var HEADER_FALLBACK = `
<header class="site-header">
    <div class="site-header-top">
        <a href="index.html" class="brand-link">App Salute Digitale</a>
        <p class="site-tagline">Gestione di pazienti, medici e visite tramite FHIR</p>
    </div>
    <nav class="navbar" aria-label="Navigazione principale">
        <a href="index.html" data-nav-link="index.html">Home</a>
        <a href="dashboard.html" data-nav-link="dashboard.html">Dashboard</a>
        <a href="patients.html" data-nav-link="patients.html">Pazienti</a>
        <a href="doctors.html" data-nav-link="doctors.html">Medici</a>
        <a href="appointments.html" data-nav-link="appointments.html">Visite</a>
        <a href="login.html" data-nav-link="login.html">Login</a>
        <a href="register.html" data-nav-link="register.html">Registrati</a>
        <a href="php/logout.php">Logout</a>
    </nav>
</header>
`;

var FOOTER_FALLBACK = `
<footer class="site-footer">
    <p>App Salute Digitale - Progetto per la gestione di pazienti, medici e visite tramite FHIR.</p>
</footer>
`;

document.addEventListener("DOMContentLoaded", function () {
    caricaHeader();
    caricaFooter();
});


function caricaHeader() {

    var header = document.getElementById("header");

    if (header !== null) {

        fetch("includes/header.html")
            .then(function (response) {
                if (response.ok !== true) {
                    throw new Error("Header non trovato");
                }
                return response.text();
            })
            .then(function (data) {
                if (data.trim() === "") {
                    header.innerHTML = HEADER_FALLBACK;
                } else {
                    header.innerHTML = data;
                }

                evidenziaLinkAttivo();
            })
            .catch(function () {
                header.innerHTML = HEADER_FALLBACK;
                evidenziaLinkAttivo();
            });
    }
}


function caricaFooter() {

    var footer = document.getElementById("footer");

    if (footer !== null) {

        fetch("includes/footer.html")
            .then(function (response) {
                if (response.ok !== true) {
                    throw new Error("Footer non trovato");
                }
                return response.text();
            })
            .then(function (data) {
                if (data.trim() === "") {
                    footer.innerHTML = FOOTER_FALLBACK;
                } else {
                    footer.innerHTML = data;
                }
            })
            .catch(function () {
                footer.innerHTML = FOOTER_FALLBACK;
            });
    }
}


function evidenziaLinkAttivo() {

    var paginaCorrente = window.location.pathname.split("/").pop();
    var linkAttivi = document.querySelectorAll("[data-nav-link]");

    if (paginaCorrente === "") {
        paginaCorrente = "index.html";
    }

    linkAttivi.forEach(function (link) {
        if (link.getAttribute("data-nav-link") === paginaCorrente) {
            link.classList.add("active");
        }
    });
}
