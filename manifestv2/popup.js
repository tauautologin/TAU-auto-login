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
    if (data.credentials) {
        const { username, userID, password, enableAutoLogin, enableAutoSubmit } = data.credentials;
        usernameInput.value = username || "";
        userIDInput.value = userID || "";
        passwordInput.value = password || "";
        enableAutoLoginCheckbox.checked = enableAutoLogin ?? true;  // Default ON
        enableAutoSubmitCheckbox.checked = enableAutoSubmit ?? true;  // Default ON
    } else {
        // Defaults if no data
        enableAutoLoginCheckbox.checked = true;
        enableAutoSubmitCheckbox.checked = true;
    }
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
