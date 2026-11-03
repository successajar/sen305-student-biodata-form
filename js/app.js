/** Validate the form, then send approved data to the local SEN 305 backend. */
const form = document.getElementById('biodata-form');
const submitButton = document.getElementById('submit-button');
const formStatus = document.getElementById('form-status');
const admissionYear = document.getElementById('entry-year');

if (form && submitButton && formStatus) {
    // The HTML has a disabled submit button until JavaScript is ready.
    submitButton.disabled = false;

    if (admissionYear) {
        admissionYear.max = String(new Date().getFullYear());
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        const errorMessage = document.getElementById(`${field.id}-error`);
        if (errorMessage) errorMessage.textContent = '';
    }

    function clearAllErrors() {
        form.querySelectorAll('[required]').forEach(clearFieldError);
        formStatus.textContent = '';
        formStatus.className = '';
    }

    form.addEventListener('input', (event) => {
        if (event.target.matches('input, select, textarea')) {
            clearFieldError(event.target);
            formStatus.textContent = '';
            formStatus.className = '';
        }
    });

    form.addEventListener('change', (event) => {
        if (event.target.matches('input, select, textarea')) {
            clearFieldError(event.target);
            formStatus.textContent = '';
            formStatus.className = '';
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearAllErrors();

        const errors = [
            ...validateRequiredFields(form),
            ...validateFormats(form)
        ];

        function displayErrors(items) {
            items.forEach(({ field, message }) => {
                const element = typeof field === 'string'
                    ? form.elements.namedItem(field) : field;
                if (!element || !element.id) return;
                element.classList.add('error');
                element.setAttribute('aria-invalid', 'true');
                const errorElement = document.getElementById(element.id + '-error');
                if (errorElement) errorElement.textContent = message;
            });
            const firstField = items.length > 0
                ? (typeof items[0].field === 'string'
                    ? form.elements.namedItem(items[0].field)
                    : items[0].field)
                : null;
            if (firstField && typeof firstField.focus === 'function') firstField.focus();
        }

        if (errors.length > 0) {
            displayErrors(errors);
            formStatus.textContent = 'Please correct ' + errors.length +
                ' field' + (errors.length === 1 ? '' : 's') + ' and try again.';
            formStatus.className = 'error';
            return;
        }

        submitButton.disabled = true;
        formStatus.textContent = 'Saving biodata...';
        formStatus.className = '';

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
            });
            const result = await response.json();

            if (!response.ok) {
                const issues = Array.isArray(result.errors) ? result.errors : [];
                displayErrors(issues);
                formStatus.textContent = result.message ||
                    (issues.length ? issues[0].message : 'Unable to save biodata.');
                formStatus.className = 'error';
                return;
            }

            formStatus.textContent = 'Biodata saved successfully! Record #' + result.id + '.';
            formStatus.className = 'success';
        } catch (_error) {
            formStatus.textContent = 'Unable to connect to the server. Start the app with npm start.';
            formStatus.className = 'error';
        } finally {
            submitButton.disabled = false;
        }
    });
}
