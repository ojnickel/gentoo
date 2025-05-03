"use strict";

var extensionName = getMessage("nameNoTM");

function closeWindow() {
    document.body.classList.remove("page-loading-animation");

    setTimeout(() => {
        document.body.append(getMessage("done"), createBR(), createBR(), `You can close this window!`);

        try {
            window.close();
        } catch (error) {
            console.warn("couldn't close window: ", error);
        }
    }, 500);
}

(async () => {
    selectorAll("title, .titleLink").forEach(el => el.textContent = extensionName);

    await initUI();

    byId("email-account").textContent = getUrlValue("email");

    onClick("#help", () => {
		location.href = "https://jasonsavard.com/forum/categories/checker-plus-for-gmail-feedback?ref=grant-access";
	});

    onClick("#grant-access", async function () {
        const tokenResponse = await requestPermission({
            email: getUrlValue("email"),
            useGoogleAccountsSignIn: true
        });

        if (tokenResponse) {
            await sendMessageToBG("initOauthHybridAccount", {tokenResponse: tokenResponse});
            hideLoading();
            try {
                await chrome.action.openPopup();
            } catch (error) {
                console.error("error opening popup", error);
                // for firefox cause it requires a user gesture
                await niceAlert("Click the extension icon to open the popup window");
                chrome.action.openPopup();
            }
            await niceAlert("Click to close window", true);
            closeWindow();
        }
    });

})();