function closeWindow() {
	var windowId = localStorage["_permissionWindowId"];
	if (windowId) {
		localStorage.removeItem("_permissionWindowId");
		chrome.windows.remove(parseInt(windowId));
	}
	$("body").removeClass("page-loading-animation").append("You can close this window!");
	window.close();
}

async function processOAuthUserResponse(oAuthForMethod, accessTokenParams, oauthFollowupMethod) {
    const accessTokenResponse = await oAuthForMethod.getAccessToken(accessTokenParams);
    const tokenResponse = accessTokenResponse.tokenResponse;
	const sendMessageParams = await oauthFollowupMethod(tokenResponse);
    return new Promise((resolve, reject) => {
        if (isPopupOrOptionsOpen()) {
            // append oauth token in case needed
            sendMessageParams.tokenResponse = tokenResponse;
            chrome.runtime.sendMessage(sendMessageParams, () => {
                closeWindow();
                resolve();
            });
        } else {
            location.href = chrome.runtime.getURL("popup.html?source=grantedAccess");
            resolve();
        }
    });
}

function isPopupOrOptionsOpen() {
	return chrome.extension.getViews().some(thisWindow => {
        if (thisWindow.location.href.includes("popup.html")
            || thisWindow.location.href.includes("options.html")) {
			return true;
		}
	});
}

function showError(error) {
    console.error("showError", error);
    $("body").removeClass("page-loading-animation");
    $("body").css("color", "red");
    if (error.jError == JError.NETWORK_ERROR) {
        $("body").html(`${getMessage("networkProblem")} <a target='_blank' href='https://jasonsavard.com/wiki/Network_problem?ref=calendar'>${getMessage("moreInfo")}</a>`);
    } else {
        $("body").text(error);
    }
}

$(document).ready(() => {

    (async () => {

        await initUI();

        var code = getUrlValue(location.href, "code", true);
        if (code) {
            const securityToken = getUrlValue(location.href, "security_token");
            let scopes = getUrlValue(location.href, "scopes", true);
            if (scopes) {
                // patch for Google server response using +
                scopes = scopes.replaceAll("+", " ");
            }
    
            const accessTokenParams = {
                code:   code,
                scopes: scopes
            }

            try {
                if (securityToken == await oAuthForDevices.getSecurityToken()) {
                    await processOAuthUserResponse(oAuthForDevices, accessTokenParams, async tokenResponse => {
                        await postPermissionsGranted(tokenResponse.userEmail)
                        return {
                            command: "grantPermissionToCalendarsAndPolledServer",
                            email: tokenResponse.userEmail
                        };
                    });
                } else if (securityToken == await oAuthForTasks.getSecurityToken()) {
                    await processOAuthUserResponse(oAuthForTasks, accessTokenParams, async tokenResponse => {
                        await postTasksGranted(tokenResponse.userEmail)
                        return {
                            command: "grantPermissionToTasksAndPolledServer",
                            email: tokenResponse.userEmail
                        };
                    });
                } else if (securityToken == await oAuthForContacts.getSecurityToken()) {
                    await processOAuthUserResponse(oAuthForContacts, accessTokenParams, async tokenResponse => {
                        await postPermissionsGrantedForContacts(tokenResponse.userEmail);
                        return {
                            command: "grantPermissionToContacts"
                        };
                    });
                } else {
                    throw "security_token not matched!";
                }
            } catch (error) {
                showError(error);
            }
        } else {
            const url = "https://jasonsavard.com/wiki/Granting_access?ref=permissionDenied&ext=gmail";
            
            if (isPopupOrOptionsOpen()) {
                await openUrl(url);
            } else {
                await openUrl(url, parseInt(localStorage._currentWindowId));
            }
            
            closeWindow();
        }
    })(); // end async
});