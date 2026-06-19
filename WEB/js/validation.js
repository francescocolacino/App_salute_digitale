document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-validate]');
    const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('[data-modal]');

    // Blocca lo scroll della pagina quando un popup e' aperto.
    function updateBodyScroll() {
        const openModal = Array.from(modals).some((modal) => modal.classList.contains('is-open'));
        document.body.style.overflow = openModal ? 'hidden' : '';
    }

    // Apre il popup scelto.
    function openModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.add('is-open');
        updateBodyScroll();
    }

    // Chiude il popup scelto.
    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove('is-open');
        updateBodyScroll();
    }

    modalOpenButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = document.getElementById(button.getAttribute('data-modal-open'));
            openModal(modal);
        });
    });

    modalCloseButtons.forEach((button) => {
        button.addEventListener('click', () => {
            closeModal(button.closest('[data-modal]'));
        });
    });

    // Chiude il popup con il tasto ESC.
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
            return;
        }

        modals.forEach((modal) => {
            if (modal.classList.contains('is-open')) {
                closeModal(modal);
            }
        });
    });

    updateBodyScroll();

    // Controlla in modo semplice i campi obbligatori.
    forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            const requiredFields = form.querySelectorAll('[required]');
            let hasErrors = false;

            requiredFields.forEach((field) => {
                if (!field.value.trim()) {
                    hasErrors = true;
                    field.style.borderColor = '#dc2626';
                } else {
                    field.style.borderColor = '#cbd5e1';
                }
            });

            if (hasErrors) {
                event.preventDefault();
            }
        });
    });
});
