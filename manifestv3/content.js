const api = typeof browser !== "undefined" ? browser : chrome;

// Function to set input values and dispatch an input event
function setInputValue(element, value) {
    if (!element) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(element, value);

    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
}

// Retrieve stored credentials and attempt login
api.storage.local.get(["credentials"], (data) => {
    if (!data.credentials) return;

    const { username, userID, password, enableAutoLogin, enableAutoSubmit } = data.credentials;

    if (!enableAutoLogin) return;

    let usernameField, userIDField, passwordField, loginButton;
    let attemptCount = 0;
    const maxAttempts = 5; // Stop after 5 tries

    function tryFillLoginForm() {
        attemptCount++;
        
        if (window.location.hostname.includes("nidp.tau.ac.il")) {
            if (document.querySelector(".SmartCard__form")) {
                // SmartCard-style nidp.tau.ac.il page
                usernameField = document.querySelector('input[name="user_name"]');
                userIDField = document.querySelector('input[name="id_number"]');
                passwordField = document.querySelector('input[name="password"]');
                loginButton = document.querySelector('.btn_wrapper button.Button');
            } else {
                // Standard nidp.tau.ac.il page
                usernameField = document.getElementById('Ecom_User_ID');
                userIDField = document.getElementById('Ecom_User_Pid');
                passwordField = document.getElementById('Ecom_Password');
                loginButton = document.getElementById('loginButton');
            }
        } else if (window.location.hostname.includes("iims.tau.ac.il")) {
            // iims.tau.ac.il page
            usernameField = document.querySelector('input[name="txtUser"]');
            userIDField = document.querySelector('input[name="txtId"]');
            passwordField = document.querySelector('input[name="txtPass"]');
            loginButton = document.querySelector('input[name="enter"]');
        }

        // If all fields are found, fill them and optionally submit
        if (usernameField && userIDField && passwordField && loginButton) {
            setInputValue(usernameField, username);
            setInputValue(userIDField, userID);
            setInputValue(passwordField, password);

            if (enableAutoSubmit) {
                setTimeout(() => loginButton.click(), 500);
            }

            observer.disconnect(); // Stop observing since login fields were found
        } else if (attemptCount >= maxAttempts) {
            console.warn("TAU Auto Login: Failed to detect login fields after 5 attempts. Stopping.");
            observer.disconnect();
        }
    }

    // Run the function immediately
    tryFillLoginForm();

    // Use MutationObserver to retry filling the form if fields aren't found immediately
    const observer = new MutationObserver(() => {
        if (attemptCount < maxAttempts) {
            tryFillLoginForm();
        } else {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
