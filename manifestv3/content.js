const api = typeof browser !== "undefined" ? browser : chrome;

function setInputValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(element, value);

    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
}


api.storage.local.get(["credentials"], (data) => {
    if (!data.credentials) {
        return;
    }

    const { username, userID, password, enableAutoLogin, enableAutoSubmit } = data.credentials;


    if (!enableAutoLogin) {
        return;
    }

    const usernameField = document.getElementById('Ecom_User_ID');
    const userIDField = document.getElementById('Ecom_User_Pid');
    const passwordField = document.getElementById('Ecom_Password');
    const loginButton = document.getElementById('loginButton');

    if (usernameField && userIDField && passwordField && loginButton) {

        setInputValue(usernameField, username);
        setInputValue(userIDField, userID);
        setInputValue(passwordField, password);

        if (enableAutoSubmit) {
            setTimeout(() => loginButton.click(), 500);
        }
    } else {

        const observer = new MutationObserver(() => {
            const usernameFieldRetry = document.getElementById('Ecom_User_ID');
            const userIDFieldRetry = document.getElementById('Ecom_User_Pid');
            const passwordFieldRetry = document.getElementById('Ecom_Password');
            const loginButtonRetry = document.getElementById('loginButton');

            if (usernameFieldRetry && userIDFieldRetry && passwordFieldRetry && loginButtonRetry) {

                setInputValue(usernameFieldRetry, username);
                setInputValue(userIDFieldRetry, userID);
                setInputValue(passwordFieldRetry, password);

                if (enableAutoSubmit) {
                    setTimeout(() => loginButtonRetry.click(), 500);
                }

                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
});
