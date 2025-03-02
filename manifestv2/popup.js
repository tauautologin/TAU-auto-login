// Compatibility Wrapper for chrome APIs
const api = typeof browser !== "undefined" ? browser : chrome;

// Elements
const usernameInput = document.getElementById("username");
const userIDInput = document.getElementById("userID");
const passwordInput = document.getElementById("password");
const enableAutoLoginCheckbox = document.getElementById("enableAutoLogin");
const enableAutoSubmitCheckbox = document.getElementById("enableAutoSubmit");
const statusText = document.getElementById("status");

// Load saved settings on popup open
api.storage.local.get(["credentials"], (data) => {
    let credentials = data.credentials || {};

    // Set input fields
    usernameInput.value = credentials.username || "";
    userIDInput.value = credentials.userID || "";
    passwordInput.value = credentials.password || "";

    // Ensure toggles default to ON if not previously set
    if (credentials.enableAutoLogin === undefined) {
        credentials.enableAutoLogin = true;
    }
    if (credentials.enableAutoSubmit === undefined) {
        credentials.enableAutoSubmit = true;
    }

    enableAutoLoginCheckbox.checked = credentials.enableAutoLogin;
    enableAutoSubmitCheckbox.checked = credentials.enableAutoSubmit;

    // Save defaults if they were missing
    api.storage.local.set({ credentials });
});

// Save settings when user clicks "Save"
document.getElementById("save").addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const userID = userIDInput.value.trim();
    const password = passwordInput.value.trim();
    const enableAutoLogin = enableAutoLoginCheckbox.checked;
    const enableAutoSubmit = enableAutoSubmitCheckbox.checked;

    if (!username || !userID || !password) {
        statusText.textContent = "Please fill in all fields!";
        return;
    }

    const credentials = { username, userID, password, enableAutoLogin, enableAutoSubmit };

    api.storage.local.set({ credentials }, () => {
        console.log("Credentials saved locally.");
        statusText.textContent = "Settings saved successfully!";
        setTimeout(() => { statusText.textContent = ""; }, 2000);
    });
});
