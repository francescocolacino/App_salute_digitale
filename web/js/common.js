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
                header.innerHTML = data;
                evidenziaLinkAttivo();
            })
            .catch(function (error) {
                console.error("Errore durante il caricamento dell'header:", error);
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
                footer.innerHTML = data;
            })
            .catch(function (error) {
                console.error("Errore durante il caricamento del footer:", error);
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
