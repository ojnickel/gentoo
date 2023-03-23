var inWidget;
var autoSaveInterval;
var replyingToMail;
var currentTabletFrameEmail;
var mouseInPopup = false;
var mouseHasEnteredPopupAtleastOnce = false;
var POPUP_VIEW_TABLET = "tabletView";
var POPUP_VIEW_CHECKER_PLUS = "checkerPlus";
var popupView;
var fromToolbar;
var isDetached;
var isTemporaryPopup;
var renderAccountsInterval;
var windowOpenTime = new Date();
var initOpenEmailEventListenersLoaded;
var hiddenMails = [];
var drawerIsVisible;
var skinsSettings;
var closeWindowTimeout;
var contactsData;

const MAX_POPUP_WIDTH = 800;
const MAX_POPUP_HEIGHT = DetectClient.isFirefox() ? 550 : 600; /* must match height hardcoded in css */

var HEADER_HEIGHT = 64;
var ACCOUNT_HEADER_HEIGHT = 30;
var FAB_HEIGHT = 80; // 140

const SEND_DELAY_SECONDS = 2;

var accounts;
var zoomFactor;
var bgObjectsReady;
var accountAddingMethod;
var highlightDates;
var maxEmailsToShowPerAccount;
var emailPreview;
var keyboardException_R;
var openGmailInNewTab;
var enableSwiping;

console.time("zoomfactor");
var zoomPromise = getZoomFactor().then(function(thisZoomFactor) {
	console.timeEnd("zoomfactor");
	zoomFactor = thisZoomFactor;
})

if (location.href.includes("source=widget")) {
	inWidget = true;
} else if (location.href.includes("source=toolbar")) {
	fromToolbar = true;
} else {
	isDetached = true;
}

if (location.href.includes("source=notification")) {
	isTemporaryPopup = true;
}

// check if opening popup from notification and thus directly opening message
var previewMailId = getUrlValue("previewMailId");

// 25% CPU issue caused when calling window.close "before" the following execution stopped - inside previewing an email view and then trying to close it to show inbox view (which animates)
function closeWindow(params = {}) {
	console.log("closeWindow: " + params.source);
	
	if (fromToolbar || isTemporaryPopup) {
		if (params.delay) {
			closeWindowTimeout = setTimeout(() => {
				window.close();
			}, params.delay);
		} else {
			window.close();
		}
	} else {
		if (!isInboxView()) {
			openInbox();
		}
	}
}

function isInboxView() {
	return byId("inboxSection").classList.contains("active");
}

function isEmailView() {
    return byId("openEmailSection").classList.contains("active");
}

function isComposeView() {
    return byId("composeSection").classList.contains("active");
}

function showSelectedTab(url) {
	if (url) {
        selectorAll(".tab").forEach(el => el.classList.remove("selected"));
		
		if (url.endsWith("/%5Ei") || url.endsWith("/Inbox") || url.includes("/Inbox/")) {
			byId("tabInbox")?.classList.add("selected");
		} else if (url.endsWith("/Important") || url.includes("/Important/")) {
			byId("tabImportant")?.classList.add("selected");
		} else if (url.endsWith("/All%20Mail") || url.includes("/All%20Mail/")) {
			byId("tabAllMail")?.classList.add("selected");
		} else if (url.includes("smartlabel_personal")) {
			byId("tabPrimary")?.classList.add("selected");
		} else if (url.includes("smartlabel_receipt")) {
			byId("tabPurchases")?.classList.add("selected");
		} else if (url.includes("smartlabel_finance")) {
			byId("tabFinance")?.classList.add("selected");
		} else if (url.includes("smartlabel_social")) {
			byId("tabSocial")?.classList.add("selected");
		} else if (url.includes("smartlabel_promo")) {
			byId("tabPromotions")?.classList.add("selected");
		} else if (url.includes("smartlabel_notification")) {
			byId("tabUpdates")?.classList.add("selected");
		} else if (url.includes("smartlabel_group")) {
			byId("tabForums")?.classList.add("selected");
		} else {
			// viewing a label: #tl/apps
			// viewing an email inside a label: #cv/apps/47120957120498
			var label = url.match(/#tl\/(.*)/);
			if (!label) {
				label = url.match(/#cv\/(.*)\//);
			}
			if (label) {
				try {
					byId("label_" + label[1])?.classList.add("selected");
				} catch (e) {
					console.error("error with #label_ : " + label[1], e);
				}
			}
		}
	}
}

async function initTabs(email) {
	// init tabs
	var tabs;
	var account = getAccountByEmail(email);
	if (account) {
		tabs = await account.getSetting("tabs");
		
		// add enabled tabs only
		var tabsArray = [];
		for (tab in tabs) {
			if (tabs[tab]) { // check if enabled
				tabsArray.push(initTab(account, tab));
			}
		}
		
		tabsArray.sort(function($a, $b) {
			if (parseInt($a.getAttribute("sortIndex")) < parseInt($b.getAttribute("sortIndex"))) {
				return -1;
			} else if (parseInt($a.getAttribute("sortIndex")) > parseInt($b.getAttribute("sortIndex"))) {
				return 1;
			} else {
				return 0;
			}
		});
		
		var SHRINK_TABS_THRESHOLD = 6;
		if (tabsArray.length > SHRINK_TABS_THRESHOLD) {
			byId("tabs").classList.add("shrink");
		}
        emptyNode("#tabs");
        byId("tabs").append( tabsArray );
		
        htmlElement.classList.toggle("hasTabs", tabsArray.length);
		
		resizeFrameInExternalPopup();

		// sync labels after display them (because the callback might delay the tabs from initially showing) remove any renamed or deleted from the settings
		account.getLabels().then(async labels => {
            console.log("labels soft", labels);
			if (labels.length && tabs) {
				var tabsUnsynced;
				for (tab in tabs) {
					var tabFoundInLabels = false;
					for (var a=0; a<labels.length; a++) {
						if (labels[a].id.equalsIgnoreCase(tab)) {
							tabFoundInLabels = true;
							break;
						}
					}
					
					if (!isSystemLabel(tab) && !tabFoundInLabels) {
						console.log("remove this tab from settings: " + tab);
						delete tabs[tab];
						tabsUnsynced = true;
					}
				}
				
				if (tabsUnsynced) {
					console.log("rescyning tabs");
					var emailSettings = await storage.get("emailSettings");
					emailSettings[email].tabs = tabs;
					await storage.set("emailSettings", emailSettings);
					
					// force refresh of labels
					account.getLabels(true).then(labels => {
                        console.log("labels hard", labels);
						showMessage("You have renamed or removed some Gmail labels. You have to re-select them in the extension options.");
					});
				}
			}
		}).catch(error => {
			showError("Error loading labels: " + error);
		});
	
	}
	
	showSelectedTab(await storage.get("tabletViewUrl"));
}

function initTab(account, tabName) {
    const $tab = document.createElement("div");
    $tab.classList.add("tab", "visible");
	var tabId;
	var sortIndex;
	if (tabName == SYSTEM_INBOX) {
		tabId = "tabInbox";
		tabTitle = getMessage("inbox");
		sortIndex = 0;
	} else if (tabName == SYSTEM_IMPORTANT) {
		tabId = "tabImportant";
		tabTitle = getMessage("important");
		sortIndex = 1;
	} else if (tabName == SYSTEM_ALL_MAIL) {
		tabId = "tabAllMail";
		tabTitle = getMessage("allMail");
		sortIndex = 2;
	} else if (tabName == SYSTEM_PRIMARY) {
		tabId = "tabPrimary";
		tabTitle = getMessage("primary");
		sortIndex = 3;
	} else if (tabName == SYSTEM_PURCHASES) {
		tabId = "tabPurchases";
		tabTitle = getMessage("purchases");
		sortIndex = 4;
	} else if (tabName == SYSTEM_FINANCE) {
		tabId = "tabFinance";
		tabTitle = getMessage("finance");
		sortIndex = 5;
	} else if (tabName == SYSTEM_SOCIAL) {
		tabId = "tabSocial";
		tabTitle = getMessage("social");
		sortIndex = 6;
	} else if (tabName == SYSTEM_PROMOTIONS) {
		tabId = "tabPromotions";
		tabTitle = getMessage("promotions");
		sortIndex = 7;
	} else if (tabName == SYSTEM_UPDATES) {
		tabId = "tabUpdates";
		tabTitle = getMessage("updates");
		sortIndex = 8;
	} else if (tabName == SYSTEM_FORUMS) {
		tabId = "tabForums";
		tabTitle = getMessage("forums");
		sortIndex = 9;
	} else {
		if (tabName) {
			const labelName = account.getLabelName(tabName);
			console.log("names: ", tabName, labelName)
			// keep it lower case and insidew tablet.js also, seems that when clicking nonsystem labels it resets to inbox after a few seconds??
			if (labelName) {
				tabId = "label_" + labelName.toLowerCase();
				// Nested labels use / but the /mu/ uses -    ... so let's replace themm all from / to -
				tabId = tabId.replaceAll("/", "-");
				console.log("tabid: " + tabId);
				tabTitle = labelName;
				sortIndex = labelName.toLowerCase().charCodeAt(0);
			}
		}
	}

    $tab.id = tabId;
    $tab.title = tabTitle;
    $tab.textContent = tabTitle;
    $tab.setAttribute("sortIndex", sortIndex);
    onClickReplace($tab, function() {
        const thisTabId = this.id;
        tabletFramePort.postMessage({action: "goToLabel", label:thisTabId});
    });

	return $tab;
}

function initPopupView() {
	
	initSwitchMenuItem();
	
	console.log("initpopupview: " + popupView);
    (async () => {
        if (popupView == POPUP_VIEW_CHECKER_PLUS) {
            htmlElement.classList.remove("tabletView");
            htmlElement.classList.add("checkerPlusView");
        } else {
            htmlElement.classList.remove("checkerPlusView");
            htmlElement.classList.add("tabletView");
            
            // display any errors with accounts above
            if (accounts?.length) {
                accounts.some(account => {
                    if (account.error) {
                        setTimeout(() => {
                            showError(account.getEmail() + ": " + account.getError().niceError + " - " + account.getError().instructions);
                        }, 500)
                        return true;
                    }
                });
            } else {
                setTimeout(() => {
                    showError("Refresh or sign out and in!");
                }, 500)
            }
            
            /*
                mui (checkerPlusForGmail must also be hard coded in manifest include_globs) is passed to the context script
                the context script stores the mui value in the GMAIL_AT
                which then Gmail API calls pass it as the &at= in the urls of /u/0/s/ etc.
                I intercept those urls in the webrequests and set the correct at parameter (instead of the mui value)
            */
            const urlPrefix = "https://mail.google.com/mail/mu/mp/?mui=" + MUI + "&hl=" + await storage.get("language");

            let url;
            if (previewMailId) {
                const mail = findMailById(previewMailId);
                
                var mobileViewFolder;
                if (mail && mail.monitoredLabel == SYSTEM_PRIMARY) {
                    mobileViewFolder = "priority/%5Esmartlabel_personal";
                } else {
                    mobileViewFolder = "Inbox";
                }
                url = urlPrefix + "#cv/" + mobileViewFolder + "/" + previewMailId;
            } else {
                url = await storage.get("tabletViewUrl");
            }
            
            if (!url) {
                url = urlPrefix;
            }

            // required because popup window wouldn't display
            await sleep(1);

            const permissionsObj = {permissions: ["webRequest", "webRequestBlocking"]};
            chrome.permissions.contains(permissionsObj, async result => {
                new Promise((resolve, reject) => {
                    if (result) {
                        console.log("contains permissions")
                        resolve(true);
                    } else {
                        // mainly for Firefox users who already had inbox view as their default because it requires a user gesture
                        const $dialog = initTemplate("inboxViewPermissionDialogTemplate");
                        onClick($dialog.querySelector(".okDialog"), () => {
                            chrome.permissions.request(permissionsObj, async granted => {
                                if (granted) {
                                    showLoading();
                                    await sendMessageToBG("initWebRequest");
                                }
                                resolve(granted);
                            });
                        }, "inbox-view-permission-dialog");
                        openDialog($dialog);
                    }
                }).then(result => {
                    if (result) {
                        showLoading();
                        byId("tabletViewFrame").setAttribute("src", url);
                        replaceEventListeners("tabletViewFrame", "load", function() {
                            hideLoading();
                            console.log("frame loaded " + new Date());
                            // backup method: if could not detect current email from frame then let's default to first email from accounts detected
                            setTimeout(async () => {
                                console.log("detect email timeout reached " + new Date());
                                if (!currentTabletFrameEmail) {
                                    console.log("timeout default to first detected account");
                                    initTabs(getFirstEmail(accounts));
                                }
                            }, 500);
                        });
                        byId("tabletViewFrame").focus()

                        // backup method if user toggles back and foorth between views, the on load above might not be called
                        setTimeout(() => {
                            hideLoading();
                        }, 500);
                    } else {
                        showError("Could not obtain permissions to load Inbox view")
                    }
                });
            });

        }
	})();
}

async function reversePopupView(force, oneTime) {
	console.log("reversepopupview");
	if (force || !reversingView) {
		reversingView = true;

		if (oneTime) {
			// store previous button action to delete next time
			await storage.set("_oneTimeReversePopupView", await storage.get("browserButtonAction"));
		}
		
		// reverse view
		if (popupView == POPUP_VIEW_CHECKER_PLUS) {
			popupView = POPUP_VIEW_TABLET;
			await storage.set("browserButtonAction", BROWSER_BUTTON_ACTION_GMAIL_INBOX);
		} else {
			popupView = POPUP_VIEW_CHECKER_PLUS;
			await storage.set("browserButtonAction", BROWSER_BUTTON_ACTION_CHECKER_PLUS);
		}
		
		initPopupView();
	}
}

function resizeFrameInExternalPopup() {
	// Force resize to resize tabletviewframe
	if (isDetached && popupView == POPUP_VIEW_TABLET) {
		setTimeout(function() {
			resizeNodes();
		}, 10);
	}
}

function initSwitchMenuItem() {
    const switchViewLabel = selector(".switchViewLabel");
    if (switchViewLabel) {
        if (popupView == POPUP_VIEW_CHECKER_PLUS) {
            selector(".switchViewLabel").textContent = getMessage("switchToInbox");
        } else {
            selector(".switchViewLabel").textContent = getMessage("switchToCheckerPlus");
        }
    }
}

async function cacheContactsData() {
    if (!globalThis.cacheContactsDataPromise || !contactsData) {
        globalThis.cacheContactsDataPromise = new Promise(async (resolve, reject) => {
            if (!contactsData) {
                contactsData = await storage.get("contactsData");
            }
            resolve();
        });
    }
    return globalThis.cacheContactsDataPromise;
}

async function getBGObjects() {
	console.time("getBGObjects");
    
    console.time("initUI");
    await initUI();
    console.timeEnd("initUI");

    accountAddingMethod = await storage.get("accountAddingMethod");
    highlightDates = await storage.get("highlightDates");
    skinsSettings = await storage.get("skins");
    maxEmailsToShowPerAccount = await storage.get("maxEmailsToShowPerAccount")
    emailPreview = await storage.get("emailPreview");
    keyboardException_R = await storage.get("keyboardException_R");
    openGmailInNewTab = await storage.get("openGmailInNewTab");
    enableSwiping = await storage.get("enableSwiping");

	console.timeEnd("getBGObjects");
}

async function executeAccountAction(account, action, params = {}) {
    params.account = account;
    params.action = action;
    return sendMessageToBG("accountAction", params, true);
}

function executeMailAction(mail, action, params = {}) {
    params.mail = mail;
    params.action = action;

	return new Promise((resolve, reject) => {
		const $mail = getMailNode(params.mail);
		
		if (!params.actionParams) {
			params.actionParams = {};
		}
        
        if (params.maybeHide) {
            params.actionParams.instantlyUpdatedCount = true;
        }
        
        console.log("executeMailAction", params);
        // firefox gave error "The object could not be cloned." when trying to pass objects with functions declared, solution is stringify it manually
        sendMessageToBG("mailAction", params, true).then(response => {
			resolve();
		}).catch(async error => {
            console.error("mailaction error", error);
			let errorStr;
			if (error.errorCode == 503) {
                errorStr = error + ". " + getMessage("tryAgainLater");
			} else {
				if (await storage.get("accountAddingMethod") == "autoDetect") {
					errorStr = error + ". " + getMessage("signOutAndIn");
				} else {
					errorStr = error;
				}
            }
            
            clearCloseWindowTimeout(true);
            
            showError(errorStr);
			//reject(error);
		});
        
        if (params.maybeHide) {
            if (params.keepInInboxAsRead) {
                $mail.classList.remove("unread");
                updateUnreadCount(-1, $mail);
            } else {
                hideMail($mail, params.autoAdvance);
            }
        }
	});
}

function executeMailActionAndHide(mail, action, params = {}) {
    params.maybeHide = true;
    return executeMailAction(mail, action, params);
}

async function setContactPhoto(params, imageNode) {

	function setNoPhoto() {
		imageNode.setAttribute("src", "images/noPhoto.svg");
		imageNode.classList.add("noPhoto");
	}

	// contact photo
	const contactPhoto = await getContactPhoto(params);
    imageNode.setAttribute("setContactPhoto", "true");
    
    if (params.useNoPhoto && !contactPhoto.realContactPhoto) {
        setNoPhoto();
    } else if (contactPhoto.photoUrl) {
        imageNode.addEventListener("error", function() {
            setNoPhoto();
        });
        
        // used timeout because it was slowing the popup window from appearing
        requestIdleCallback(() => {
            if (isVisible(imageNode)) {
                imageNode.setAttribute("src", contactPhoto.photoUrl);
            }
        });
    } else {
        if (params.useNoPhoto) {
            setNoPhoto();
        } else {
            var name;			
            if (params.name) {
                name = params.name;
            } else if (params.mail) {
                name = params.mail.getName();
            }
            
            var letterAvatorWord;
            if (name) {
                letterAvatorWord = name;
            } else {
                letterAvatorWord = params.email;
            }
            imageNode.removeAttribute("fade");
            requestIdleCallback(async () => {
                imageNode.setAttribute("src", await letterAvatar(letterAvatorWord));
            });
        }
    }
}

async function letterAvatar(name, color) {
	var colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
	
	if (!name) {
		name = " ";
	}
	 
	var letter = name.charAt(0).toUpperCase();
	var letterCode = letter.charCodeAt();
	 
	var charIndex = letterCode - 64,
	    colourIndex = charIndex % 20;
	 
	var canvas;
	const CANVAS_XY = 256;
	if (typeof OffscreenCanvas != "undefined") {
		canvas = new OffscreenCanvas(CANVAS_XY, CANVAS_XY);
	} else if (typeof document != "undefined") {
		canvas = document.createElement("canvas");
		canvas.width = canvas.height = CANVAS_XY;
	}

	var context = canvas.getContext("2d");
	 
	if (color) {
		context.fillStyle = color;
	} else {
		context.fillStyle = colours[colourIndex];
	}
	context.fillRect (0, 0, canvas.width, canvas.height);
	context.font = "128px Arial";
	context.textAlign = "center";
	context.fillStyle = "#FFF";
    context.fillText(letter, CANVAS_XY / 2, CANVAS_XY / 1.5);
    
    let dataUrl;
    try {
        dataUrl = await getDataUrl(canvas);
    } catch (error) {
        // refer to https://jasonsavard.com/forum/discussion/6072/error-when-reading-from-canvas-is-disabled
        console.warn("Canvas writing disabled for privacy so returning empty");
        dataUrl = "";
    }
	
	return dataUrl;
}

function setPopupBgColor(color) {
	if (color) {
		addSkin({
			id: "background-color",
            css: `
                body:not(.background-skin) #inboxSection,
                body:not(.background-skin) #inboxSection app-header-layout #main-header-toolbar {
                    background-color: ${color};
                }
            `
		});
	}
}

function hideMail($mail, autoAdvance) {
	console.log("hideMail");
	const mail = $mail._mail;
	
	if (mail) {
		hiddenMails.push(mail.id);
	}
	
	const wasUnread = $mail.classList.contains("unread");
	
	var onlyMailAndInPreview = false;
	/*
	 * commented because we added an undo notification that we wanted to be show before closing
	// if in open email view and it's the only mail left then just close window with no animation 
	if ($(".mail").length == 1 && document.querySelector('neon-animated-pages').selected == 1) {
		onlyMailAndInPreview = true;
	}
	*/
	
	if (!onlyMailAndInPreview) {
        const SPEED = 200;
        slideUp($mail, SPEED);
        fadeOut($mail, SPEED);
        setTimeout(() => {
            // preserve account before removing $mail below
            const $account = $mail.closest(".account");
            $mail.remove();
            
            initAccountHeaderClasses($account);
            
            // had to wait till mail node was removed to init prev next buttons
            const openMail = getOpenEmail();
            if (openMail) {
                const $openMail = getMailNode(openMail);
                initPrevNextButtons($openMail);
            }
            
            if (mail) {
                console.log("pass exclude id: " + mail.title);
            }
            renderMoreAccountMails();
            
            if (!selector(".mail")) {
                closeWindow({source:"!onlyMailAndInPreview", delay:seconds(3)});
            }
        }, SPEED);
	}

    // for notifications
    sendMessageToBG("hideMailTriggeredInPopup");
	
	if (wasUnread) {
        updateUnreadCount(-1, $mail);
	}
	
	if (onlyMailAndInPreview) {
		closeWindow({source:"onlyMailAndInPreview"});
	} else {
		if (autoAdvance) {
			autoAdvanceMail($mail);
		}
	}
}

function getAccountAvatar(account) {
	var $retAccountAvatar;
	
	Array.from(selectorAll(".accountAvatar")).some($accountAvatar => {
		if ($accountAvatar._account.id == account.id) {
			//setAvatarUnreadCount($accountAvatar, unreadCount);
			$retAccountAvatar = $accountAvatar;
			return true;
		}
	});
	
	return $retAccountAvatar;
}

function setUnreadCountLabels($account) {
	var account = $account._account;
	var $unreadCount = $account.querySelector(".unreadCount");
	let unreadCount = $unreadCount._count;
	if (unreadCount == undefined) {
        unreadCount = account.unreadCount;
	}
	
	if (unreadCount >= 1) {
		$account.classList.add("hasUnread");
        $unreadCount.textContent = `(${unreadCount})`;
        show($unreadCount);
	} else {
		$account.classList.remove("hasUnread");
		hide($unreadCount);
	}
	
	const $accountAvatar = getAccountAvatar(account);
	if ($accountAvatar) {
		setAvatarUnreadCount($accountAvatar, unreadCount);
	}
}

async function setAccountAvatar($account, $accountAvatar) {
	const account = $accountAvatar._account;
	var $accountPhoto = $accountAvatar.querySelector(".accountPhoto");
	
	var profileInfo = await account.getSetting("profileInfo");
	if (profileInfo) {
		setTimeout(function() {
			$account.querySelector(".accountPhoto").setAttribute("src", profileInfo.imageUrl);
			$accountPhoto.setAttribute("src", profileInfo.imageUrl);
		}, 20);
	} else {
		hide($account.querySelector(".accountPhoto"));
		
		let color;
		if (await account.getSetting("accountColor") == "transparent") {
			color = "#ccc";
		} else {
			color = await account.getSetting("accountColor");
        }
        const emailDisplayName = await account.getEmailDisplayName();
        requestIdleCallback(async () => {
            $accountPhoto.setAttribute("src", await letterAvatar(emailDisplayName, color));
        });
	}
}

function setAvatarUnreadCount($accountAvatar, unreadCount) {
	var account = $accountAvatar._account;
	let $unreadCount = $accountAvatar.querySelector(".accountAvatarUnreadCount");
	if (unreadCount >= 1) {
		$unreadCount.textContent = unreadCount;
        show($unreadCount);
	} else {
		hide($unreadCount);
	}
}

async function updateUnreadCount(offset, $mail) {
	const $account = $mail.closest(".account");
	const account = $account._account;
    const $unreadCount = $account.querySelector(".unreadCount");

	let unreadCount = $unreadCount._count;
	if (unreadCount == undefined) {
		unreadCount = account.unreadCount;
	}
	unreadCount += offset;
	
	$unreadCount._count = unreadCount;
	
	setUnreadCountLabels($account);

    // update background unreadcount because it was out of sync after marking an email as read (since we don't poll immedaitely after), the count will be temporary because it will be overwritten on every poll
    await storage.set("unreadCount", await storage.get("unreadCount") + offset);

    sendMessageToBG("updateBadge");
}

// try to sync highlight BOTH mail and openEmail stars
async function initStar($star, mail) {
	const $mail = getMailNode(mail);
	const $mailStar = $mail.querySelector(".star");
	
	if ($mailStar.getAttribute("icon") == "star" || await mail.hasLabel(SYSTEM_STARRED)) {
        $mailStar.setAttribute("icon", "star");
        if ($star) {
            $star.setAttribute("icon", "star");
        }
	} else {
        $mailStar.setAttribute("icon", "star-border");
        if ($star) {
		    $star.setAttribute("icon", "star-border");
        }
	}
	
    replaceEventListeners($star, "mouseup", event => {
        if (event.target.getAttribute("icon") == "star") {
            event.target.setAttribute("icon", "star-border");
            if ($mailStar) {
                $mailStar.setAttribute("icon", "star-border");
            }
            if ($star) {
                $star.setAttribute("icon", "star-border");
            }
            executeMailAction(mail, "removeStar");
        } else {
            event.target.setAttribute("icon", "star");
            if ($mailStar) {
                $mailStar.setAttribute("icon", "star");
            }
            if ($star) {
                $star.setAttribute("icon", "star");
            }
            executeMailAction(mail, "star");
            storage.get("starringMarksAsRead").then(starringMarksAsRead => {
                if (starringMarksAsRead) {
                    hideMail($mail, false);
                }
            });
        }
        event.preventDefault();
        event.stopPropagation();
    });
}

function setContactPhotos(accounts, $mailNodes) {
	return ensureContactsWrapper(accounts).then(() => {
		$mailNodes.forEach(mailNode => {
			const mail = mailNode._mail;
			if (mail) {
				// photo
				const $imageNode = mailNode.querySelector(".contactPhoto");
				
				// if not already set
				if (!$imageNode.getAttribute("setContactPhoto")) {
					// function required to keep imageNode in scope
					setContactPhoto({mail:mail}, $imageNode);
				}
			}
		});
	});
}

function openMailInBrowser(mail, event) {
	const openParams = {
        actionParams: {}
    };

    if (event.button == MouseButton.RIGHT) {
        // right click do nothing
        return;
	} else if (isCtrlPressed(event) || event.button == MouseButton.MIDDLE) { // middle button
		openParams.actionParams.openInBackground = true;
    } else if (openGmailInNewTab) {
        openParams.actionParams.openInNewTab = true;
    }

    executeMailAction(mail, "open", openParams);
	if (!openParams.actionParams.openInBackground) {
		setTimeout(() => {
			closeWindow({ source: "openMailInBrowser" });
		}, 100);
	}
}

function openDialogWithSearch($dialog, $search, $selectionsWrapper, $selections) {
	setTimeout(() => {
		openDialog($dialog).then(response => {
			// because i DID NOT set autoCloseDisabled="true" then the .close happens automatically
		}).catch(error => {
			// on close
			showError("error: " + error);
		});
		$dialog.addEventListener("iron-overlay-opened", () => {
            $search.value = "";
            $search.style.opacity = "1";
            $search.focus();
            $search.addEventListener("keyup", function(e) {
                if (e.key == "ArrowDown") {
                    $selectionsWrapper.focus();
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    const str = this.value.toLowerCase();
                    $selections.forEach(el => {
                        if (el.textContent.trim().toLowerCase().includes(str)) {
                            el.removeAttribute("hidden");
                            el.removeAttribute("disabled");
                        } else {
                            el.setAttribute("hidden", "");
                            el.setAttribute("disabled", "");
                        }
                    });
                }
            });
		});
	}, 1);
}

function openDialogCalendarVersionNotSupported() {
    // not supported yet
    const content = new DocumentFragment();
    content.append("The extension Checker Plus for Google Calendar is required.");
    content.append(createBR());
    content.append("But your version does not currently support this feature.");

    openGenericDialog({
        title: "Not supported yet",
        content: content,
        showCancel: true,
        okLabel: "Update extension"
    }).then(response => {
        if (response == "ok") {
            openUrl("https://jasonsavard.com/wiki/Extension_Updates");
        }
    });
    
}

function initOpenEmailEventListeners() {
	
	onClick("#back", function() {
		openInbox();
	});

    addEventListeners("#openEmailSection", "mouseup", e => {
		if (e.button == MouseButton.BACK) { // Back button on mouse, ref: https://jasonsavard.com/forum/discussion/3405/hotkey-improvement
            openInbox();
		}
	});

	onClick("#prevMail", function() {
		if (this.classList.contains("visible")) {
			const mail = getOpenEmail();
			const $mail = getMailNode(mail);
			
			openPrevMail($mail);
		}
	});

	onClick("#nextMail", function() {
		if (this.classList.contains("visible")) {
			const mail = getOpenEmail();
			const $mail = getMailNode(mail);
	
			openNextMail($mail);
		}
	});

	onClick("#markAsNotSpam", function() {
        executeMailActionAndHide(getOpenEmail(), "markAsNotSpam", {autoAdvance:true});
	});

	onClick("#archive", function() {
        executeMailActionAndHide(getOpenEmail(), "archive", {autoAdvance:true});
	});

	onClick("#delete", function() {
		const mail = getOpenEmail();
        executeMailActionAndHide(mail, "deleteEmail", {autoAdvance:true});
		showUndo({mail:mail, text:getMessage("movedToTrash"), undoAction: "untrash"}).then(function() {
			openEmail({mail:mail});
		});
	});

	onClick("#markAsRead, #markAsUnread", async function() {
		const mail = getOpenEmail();
		const $mail = getMailNode(mail);

		if (this.id == "markAsRead") {
            executeMailActionAndHide(mail, "markAsRead", {autoAdvance:true});
			showUndo({mail:mail, text:getMessage("markedAsRead"), undoAction: "markAsUnread"}).then(function() {
				openEmail({mail:mail});
			});
		} else { // mark as UNread
			openInbox();
            
            const markAsUnreadResponse = executeMailAction(mail, "markAsUnread");

            if ($mail) {
                $mail.classList.add("unread");
                updateUnreadCount(+1, $mail);
            } else {
                // patch for unreadCount error, this happens when you undo a delete email that is not unread, you can reproduce when previewing email marks as read, then you delete the email from the email preview, then click undo, then mark as unread
                showLoading();
                await markAsUnreadResponse;
                await refresh();
            }
		}
	});

	onClick("#addToGoogleCalendar", function() {
		var mail = getOpenEmail();
		var $mail = getMailNode(mail);
		
		var newEvent = {};
		newEvent.allDay = true;
		newEvent.summary = mail.title;
		//newEvent.source = {title:mail.title, url:mail.getUrl()};
		newEvent.description = mail.getUrl() + "\n\n" + mail.messages.last().content.htmlToText(); //mail.getLastMessageText();
		
		console.log("newEvent", newEvent);
		
		sendMessageToCalendarExtension({action:"generateActionLink", eventEntry:JSON.stringify(newEvent)}).then(function(response) {
			console.log("response: ", response);
			if (response && response.url) {
				openUrl(response.url);
			} else if (response && response.error) {
				showError(response.error);
			} else {
                openDialogCalendarVersionNotSupported();
			}
		}).catch(response => {
			// not installed or disabled
			hideSaving();
			
			requiresCalendarExtension("addToGoogleCalendar");
		});

	});

	onClick("#moveLabel", function() {
		var mail = getOpenEmail();
		var $mail = getMailNode(mail);

		const $moveLabelDialog = initTemplate("moveLabelDialogTemplate");
		
		showLoading();
		mail.account.getLabels().then(async labels => {
			hideLoading();
			
			// labels
			const labelsTemplate = $moveLabelDialog.querySelector("#moveLabelTemplate");
			const $moveLabels = $moveLabelDialog.querySelector("#moveLabels");
			//$moveLabels.find(".moveLabel").remove();
			$moveLabels.querySelectorAll(".moveLabel").forEach(el => {
				el.parentNode.removeChild(el);
			});
			
			// shallow copy
			var labels = labels.slice(0);

			if (await storage.get("accountAddingMethod") == "oauth") {
				// Add categories at end of dropdown
				labels.push({id:GmailAPI.labels.CATEGORY_PERSONAL, name:getMessage("primary")});
				labels.push({id:GmailAPI.labels.CATEGORY_SOCIAL, name:getMessage("social")});
				labels.push({id:GmailAPI.labels.CATEGORY_PROMOTIONS, name:getMessage("promotions")});
				labels.push({id:GmailAPI.labels.CATEGORY_UPDATES, name:getMessage("updates")});
				labels.push({id:GmailAPI.labels.CATEGORY_FORUMS, name:getMessage("forums")});
			}
			
			labels.forEach(labelObj => {
                const $label = importTemplateNode(labelsTemplate)
				$moveLabels.append($label);
				// FYI need to wrap paper-item with a paper-menu to capture up/down keys
				// patch: Must use Polymer dom append to insert node into paper-menu's shadow dom <div selected... ref: https://github.com/PolymerElements/paper-menu/issues/21
                onClick($label, function() {
                    executeMailActionAndHide(mail, "moveLabel", {autoAdvance: true, actionParams: {newLabel:labelObj.id}}).then(() => {
                        showMessage("Moved to " + labelObj.name);
                    });
                    $moveLabelDialog.close();
                });
				$label.querySelector(".labelText").textContent = labelObj.name;
				
			});
			
			openDialogWithSearch($moveLabelDialog, byId("moveLabelSearch"), $moveLabels, selectorAll(".moveLabel"));
		}).catch(error => {
			hideLoading();
			showError("error: " + error);
		});
		
	});
	
	onClick("#changeLabels", function() {
		const mail = getOpenEmail();
		const $mail = getMailNode(mail);

		const $changeLabelsDialog = initTemplate("changeLabelsDialogTemplate");
		
		showLoading();
		mail.account.getLabels().then(async labels => {
			hideLoading();
			
			const labelsTemplate = $changeLabelsDialog.querySelector("#changeLabelTemplate");
			const $changeLabelsWrapper = $changeLabelsDialog.querySelector("#changeLabelsWrapper");
			//$changeLabelsWrapper.find(".labelWrapper").remove();
			$changeLabelsWrapper.querySelectorAll(".labelWrapper").forEach(el => {
				el.parentNode.removeChild(el);
			});
			
			// shallow copy
			var labels = labels.slice(0);

			if (await storage.get("accountAddingMethod") == "oauth") {
				// Add categories at end of dropdown
				labels.push({id:GmailAPI.labels.CATEGORY_PERSONAL, name:getMessage("primary")});
				labels.push({id:GmailAPI.labels.CATEGORY_SOCIAL, name:getMessage("social")});
				labels.push({id:GmailAPI.labels.CATEGORY_PROMOTIONS, name:getMessage("promotions")});
				labels.push({id:GmailAPI.labels.CATEGORY_UPDATES, name:getMessage("updates")});
				labels.push({id:GmailAPI.labels.CATEGORY_FORUMS, name:getMessage("forums")});
			}

            await asyncForEach(labels, async labelObj => {
                const $checkbox = importTemplateNode(labelsTemplate);
				$changeLabelsWrapper.appendChild($checkbox);
				$checkbox.checked = await mail.hasLabel(labelObj.id);
				
				$checkbox.addEventListener("change", function() {
                    if ($checkbox.checked) {
                        // add label
                        executeMailAction(mail, "applyLabel", {actionParams: labelObj.id}).then(() => {
                            showMessage(getMessage("labelAdded"));
                        });
                    } else {
                        // remove labels
                        executeMailAction(mail, "removeLabel", {actionParams: labelObj.id}).then(() => {
                            showMessage(getMessage("labelRemoved"));
                        });
                    }
                });
				$checkbox.textContent = labelObj.name;
				
			});
			
			openDialogWithSearch($changeLabelsDialog, byId("changeLabelSearch"), $changeLabelsWrapper, selectorAll(".labelWrapper"));
		}).catch(error => {
			hideLoading();
			showError("error: " + error);
		});
		
	});
	
	onClick("#markAsSpam, #markAsSpam-menu-item", function() {
        executeMailActionAndHide(getOpenEmail(), "markAsSpam", {autoAdvance: true});
	});

	onClick("#revertAutoSizing", function() {
        byId("openEmail").classList.toggle("resized");
	});

	onClick("#translateMessage", async function() {
		var mail = getOpenEmail();
		openUrl("https://translate.google.com/#auto/" + await storage.get("language") + "/" + encodeURIComponent(mail.getLastMessageText()));
	});

	onClick(".listenToEmail", function() {
		var mail = getOpenEmail();
		var $mail = getMailNode(mail);

		showToast({toastId:"playingEmail", text:"Playing email...", duration:9999, actionParams:{
			text:       "Stop",
			onClick:    () => {
                chrome.runtime.sendMessage({command: "chromeTTS", stop:true});
                dismissToast(byId("playingEmail"));
			}
		}});
        
        chrome.runtime.sendMessage({command: "chromeTTS", text:mail.getLastMessageText()}, response => {
            dismissToast(byId("playingEmail"));
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                showError(chrome.runtime.lastError.message);
            }
        });
	});
	
	byId("openEmailInBrowser").addEventListener("mouseup", event => {
		const mail = getOpenEmail();
		openMailInBrowser(mail, event);
		event.preventDefault();
        event.stopPropagation();
	});
	
	onClick("#openEmailClose", function() {
		closeWindow();
	});
	
	
	initOpenEmailEventListenersLoaded = true;
}

async function maxHeightOfPopup() {
	if (fromToolbar) {
		await zoomPromise;
        console.log("zoomfactor: " + zoomFactor);
        document.body.style.height = (MAX_POPUP_HEIGHT / zoomFactor) + "px";
	}
}

async function resizePopup() {
	console.log("resizePopup");
	if (fromToolbar) {
        const zoomFactor = await getZoomFactor();
        if (zoomFactor > 1 || popupView == POPUP_VIEW_TABLET) {
            maxHeightOfPopup();
        } else {
            if (accounts.length) {
                var allUnreadMails = getAllUnreadMail(accounts);
                
                var mailHeight;
                const displayDensity = await storage.get("displayDensity");
                if (displayDensity == "compact") {
                    mailHeight = 79;
                } else if (displayDensity == "cozy") {
                    mailHeight = 89;
                } else {
                    mailHeight = 107;
                }
                
                var newBodyHeight = HEADER_HEIGHT + (accounts.length * ACCOUNT_HEADER_HEIGHT) + (allUnreadMails.length * mailHeight) + FAB_HEIGHT + 25;
                if (newBodyHeight > MAX_POPUP_HEIGHT) {
                    newBodyHeight = MAX_POPUP_HEIGHT;
                }
                
                console.log("resizePopup2");
                // only need to set the height if it will be larger than exsiting, because we can't shrink the popup window - it will cause scrollbars
                if (document.body.clientHeight < newBodyHeight) {
                    // v2 removed timeout because of race issue with renderMoreAccountMails: the height of the window would be small when rendering and so not all emails would render
                    // v1 patch for mac issue popup clipped at top ref: https://bugs.chromium.org/p/chromium/issues/detail?id=428044
                    //setTimeout(() => {
                        console.info("setting height");
                        document.body.style.height = newBodyHeight + "px";
                    //}, 1); // tried 100, 150, then 250, back to 1 even for mac & pc
                }
            }
        }
	}
}

async function openEmail(params) {
    document.body.classList.add("page-loading-animation");
    await polymerPromise2;
    document.body.classList.remove("page-loading-animation");
    maxHeightOfPopup();
    
    if (params.mail) {
        try {
            await openEmailPromise(params);
            history.pushState({openEmail:true}, "", "#open-email");
        } catch (error) {
            logError(error);
            showError("error: " + error);
            throw error;
        }
    } else {
        const error = "Email might already be read!";
        showError(error);
        throw error;
    }
}

function initPrevNextButtons($mail) {
	const hasPrevMail = getNodeIndex($mail, ".mail") != 0;
	byId("prevMail").classList.toggle("visible", hasPrevMail);
	const hasNextMail = getNodeIndex($mail, ".mail") < selectorAll(".mail").length - 1;
	byId("nextMail").classList.toggle("visible", hasNextMail);
}

function processMessage(mail, $messageBody, index) {
	console.log("process message")
	if (accountAddingMethod == "oauth") {
		// must do this before interceptClicks
		var linkedText = Autolinker.link( $messageBody.innerHTML, {
			stripPrefix : false,
		} );
		$messageBody.innerHTML = linkedText;
	}
	
	if (highlightDates && mail.messages.length == (index+1)) {
        console.time("DateTimeHighlighter");
        
        if (!window.loadedDateTimeHighlighter) {
            DateTimeHighlighter();
            window.loadedDateTimeHighlighter = true;
        }
		
		var highlighterDetails;
		
		// only parse if not too big or else it hangs
		// .html() can be null !!
		if ($messageBody?.innerHTML.length < 10000) {
			highlighterDetails = DateTimeHighlighter.highlight($messageBody.innerHTML, function(myDateRegex) {
				console.log(myDateRegex);
				var obj = JSON.stringify(myDateRegex);
				obj = encodeURIComponent(obj);
				
				return "<a class='DTH' href='#' object=\"" + obj + "\">" + myDateRegex.match + "</a>";
			});
			console.log("highlighterDetails", highlighterDetails);
			console.timeEnd("DateTimeHighlighter");
		}
		
		if (highlighterDetails?.matchCount) {
			$messageBody.innerHTML = highlighterDetails.highlightedText;
			$messageBody.querySelectorAll(".DTH").forEach(el => {
				const $tooltip = document.createElement("paper-tooltip");
				el.append($tooltip);
                const $tooltipText = $tooltip.querySelector("#tooltip");
                if ($tooltipText) {
                    $tooltipText.textContent = getMessage("addToGoogleCalendar");
                }
				onClick(el, function(event) {
					showSaving();
					let newEvent = this.getAttribute("object");
					newEvent = decodeURIComponent(newEvent);
					newEvent = JSON.parse(newEvent);
					
					newEvent.summary = mail.title;
					newEvent.source = {title:mail.title, url:mail.getUrl()};
					newEvent.description = mail.messages.last().content;
					
					console.log("newEvent", newEvent);
					sendMessageToCalendarExtension({action:"createEvent", event:JSON.stringify(newEvent)}).then(function(response) {
						console.log("response: ", response);
						hideSaving();
						if (response?.success) {
							// nothing
						} else if (response?.error) {
							showError(response.error);
						} else {
                            openDialogCalendarVersionNotSupported();
						}
					}).catch(response => {
						// not installed or disabled
						hideSaving();
                        requiresCalendarExtension("dateTimeParsing");
					});

                    event.preventDefault();
                    event.stopPropagation();
				})
			});
		}
	}

	// must do this after DateTimeHighlighter
	interceptClicks($messageBody.querySelectorAll("a:not(.DTH)"));
	
	onClickReplace(".showTrimmedContent", function(event) {
		slideToggle(event.target.nextElementSibling, 200);
	});

	$messageBody._processMessage = true;
}

function setMailMessage($openEmailMessages, mail, message) {
	if (!message.to) {
		message.to = [];
	}
	if (!message.cc) {
		message.cc = [];
	}
	if (!message.bcc) {
		message.bcc = [];
	}
	
    const $message = importTemplateNode('#openEmailMessageTemplate');
	$openEmailMessages.append($message);
	
	$message._message = message;
	
	// sender
    const $openEmailSender = $message.querySelector(".openEmailSender");
	$openEmailSender.textContent = mail.getName(message.from);
    $openEmailSender.title = message.from.email;

	getContact({ mail:mail }).then(contact => {
		if (!contact || !contact["gContact$groupMembershipInfo"]) { // gContact$groupMembershipInfo means probably added as a contact (not just recently emailed)
			$message.querySelector(".openEmailSenderEmailAddress").textContent = `<${message.from.email}>`;
		}
	});
	
	// date
	let dateStr;						
	if (message.date) {
		dateStr = message.date.displayDate({relativeDays: true, long: true});
		$message.querySelector(".date").title = message.date.toLocaleStringJ();
	} else {
        dateStr = message.dateStr;
    }

	$message.querySelector(".date").textContent = dateStr;
	
    const $toCC = document.createElement("span");
    $toCC.textContent = `${getMessage("to")}: `;
    const $toCCFullDetails = document.createElement("span");
    $toCCFullDetails.append(`${getMessage("from").toLowerCase()}: ${message.from.email}`, document.createElement("br"));
	
	var firstTo = true;
	var firstCC = true;

	if (message.to.length) {
		$toCCFullDetails.append(`${getMessage("to")}: `);
		message.to.forEach(to => {
			if (!firstTo) {
				$toCC.append(", ");
				$toCCFullDetails.append(", ");
			}
			firstTo = false;
			
			$toCC.append(pretifyRecipientDisplay(to, mail.account.getEmail()));
			$toCCFullDetails.append(pretifyRecipientDisplay(to, mail.account.getEmail(), true));
		});
	}
	
	if (message.cc.length) {
		if (message.to.length) {
			$toCCFullDetails.append(document.createElement("br"));
		}
		$toCCFullDetails.append("cc: ");
		message.cc.forEach(cc => {
			if (!firstTo) {
				$toCC.append(", ");
			}
			firstTo = false;
			if (!firstCC) {
				$toCCFullDetails.append(", ");
			}
			firstCC = false;
			
			$toCC.append(pretifyRecipientDisplay(cc, mail.account.getEmail()));
			$toCCFullDetails.append(pretifyRecipientDisplay(cc, mail.account.getEmail(), true));
		});
	}
	
	if (message.bcc.length) {
		if (message.to.length || message.cc.length) {
            $toCC.append(", ");
			$toCCFullDetails.append(document.createElement("br"));
        }
		$toCC.append("bcc: ");
		$toCC.append(pretifyRecipientDisplay(message.bcc.first(), mail.account.getEmail()));
        
		$toCCFullDetails.append("bcc: ", pretifyRecipientDisplay(message.bcc.first(), mail.account.getEmail(), true));
	}

    onClick($message.querySelector(".viewMessageDetails"), function(event) {
		slideToggle($message.querySelector(".messageDetails"), "fast");
		event.preventDefault();
        event.stopPropagation();
	});
	
    emptyAppend($message.querySelector(".to"), $toCC);
	emptyAppend($message.querySelector(".messageDetails"), $toCCFullDetails);
	$message.querySelector(".snippet").textContent = message.textContent.htmlToText();
	
	const $messageBody = $message.querySelector(".messageBody");
	$messageBody.innerHTML = message.content;
	fixRelativeLinks($messageBody, mail);
	
	return $message;
}

function resizeMessageHeight() {
	console.log("resizeMessageHeight()")
	
	const $replyArea = byId("replyArea");
	if ($replyArea.classList.contains("clicked")) {
		setReplyAreaTop(($replyArea.clientHeight + 22) + "px");
	} else {
		setReplyAreaTop("52px");
	}
}

function previewVideo(source) {
	const $dialog = initTemplate("videoDialogTemplate");
	const video = selector("#videoDialog video");
	
	video.src = source;
	video.load();
	video.play();
	
	onClickReplace(video, function() {
		if (video.paused == false) {
			video.pause();
		} else {
			video.play();
		}
	});
	
    replaceEventListeners($dialog, "iron-overlay-closed", function() {
		video.pause();
		video.currentTime = 0;
	});
	
	onClickReplace($dialog.querySelector(".closeVideo"), function() {
		$dialog.close();
	});
	
	openDialog($dialog);
}

function getReplyTextArea() {
	return byId("replyTextareaWrapper").textarea;
}

function setReplyAreaTop(value) {
	selector("#openEmailSection app-header-layout").shadowRoot.querySelector("#contentContainer").style["margin-bottom"] = value;
}

function expandMessages(params = {}) {
    byId("openEmailProgress").classList.add("visible");
    // timeout required to show progress bar
    setTimeout(() => {
        openEmail(params);
    }, params.mail.messages.length < 10 ? 1 : 200); // smaller then 10 messages then no timeout needed 
}

function openEmailPromise(params) {
	return new Promise(function(resolve, reject) {

		const mail = params.mail;
		console.log("open email", mail);
		
		const $openEmailSection = initTemplate("openEmailSectionTemplate");

        // detect if already active or else causing incomplete transition when using back to inbox button
        if (!$openEmailSection.classList.contains("active")) {
            selectorAll(".page").forEach(el => el.classList.remove("active"));
            $openEmailSection.classList.add("active");
            $openEmailSection.addEventListener("transitionend", function(e) {
                // #openEmail must have a tabindex for this focus to work
                byId("openEmail").focus();
            }, {once: true});
        }

        addMyScrollbars($openEmailSection, document.querySelector("#openEmailSection app-header-layout")?.shadowRoot);

		setReplyAreaTop();

		resetOpenEmailScrollTop();

        const $openEmail = byId("openEmail");
        $openEmail._mail = mail;
        $openEmail.classList.add("resized");
		$openEmail.classList.toggle("facebook", mail.authorMail.includes("facebookmail.com"));
		
		selector(".u-url").textContent = mail.getUrl();
        const openEmailSubject = selector(".openEmailSubject");
        openEmailSubject.textContent = mail.title ? mail.title : `(${getMessage("noSubject")})`;
		replaceEventListeners(openEmailSubject, "mouseup", e => {
            openMailInBrowser(mail, e);
        });
		
		// labels
		const labelsTemplate = byId("openEmailLabelsTemplate");
		const $labels = byId("openEmailLabels");
        removeAllNodes($labels.querySelectorAll(".label"));
		
        const labelsFragment = new DocumentFragment();
		const labels = mail.getDisplayLabels();
		labels.forEach(labelObj => {
			const $label = importTemplateNode(labelsTemplate);
			$label.querySelector(".labelName").textContent = labelObj.name;

			if (labelObj.color) {
				css($label.querySelectorAll(".labelName, .removeLabel"), {
					"color": labelObj.color.textColor,
					"background-color": labelObj.color.backgroundColor
				});
			}

			onClick($label.querySelector(".removeLabel"), function() {
                executeMailAction(mail, "removeLabel", {actionParams: labelObj.id}).then(() => {
					showMessage(getMessage("labelRemoved"));
				});
				$label.remove();
			});

            labelsFragment.append($label);
		});

        $labels.append(labelsFragment);
		
		initStar(selector("#openEmail .star"), mail);

        if (mail.messages.length >= 2) {
            show("#expand-all");
            replaceEventListeners("#expand-all", "mouseup", () => {
                if (byId("messageExpander")) {
                    expandMessages({
                        mail: mail,
                        showEverything: true
                    });
                } else {
                    selectorAll("#openEmailMessages .message.collapsed .messageHeader").forEach(el => el.click());
                }
            });
        } else {
            hide("#expand-all");
        }

		const $attachmentIcon = selector("#openEmail .attachment-icon");
		if (mail.hasAttachments()) {
			show($attachmentIcon);
		} else {
			hide($attachmentIcon);
		}

		const $mail = getMailNode(mail);
		
		removeAllNodes(".message");
		byId("messageExpander")?.remove();
		
		byId("openEmailProgress").classList.add("visible");
		
		mail.getThread({forceDisplayImages:mail.forceDisplayImages}).then(async response => {
            const mail = response;
            
            const lastAccountEmailPreviewDates = await storage.get("_lastAccountEmailPreviewDates");
            lastAccountEmailPreviewDates[mail.account.getEmail()] = new Date();
            storage.set("_lastAccountEmailPreviewDates", lastAccountEmailPreviewDates);

            const autoCollapseConversations = await storage.get("autoCollapseConversations");
            const alwaysDisplayExternalContent = await storage.get("alwaysDisplayExternalContent");
            const showSendAndArchiveButton = await storage.get("showSendAndArchiveButton");
            const showSendAndDeleteButton = await storage.get("showSendAndDeleteButton");
            const replyingMarksAsRead = await storage.get("replyingMarksAsRead")

			if (mail.messages.last()) {
				initPrevNextButtons($mail);

                if (await storage.get("showSpam")) {
                    show("#markAsSpam");
                } else {
                    hide("#markAsSpam");
                }
				
				const markAsReadSetting = await storage.get("showfull_read");
				if (markAsReadSetting) {
					hide("#markAsRead");
                    show("#markAsUnread");

                    if (await mail.hasLabel(SYSTEM_SPAM)) {
                        show("#markAsNotSpam");
                    } else {
                        hide("#markAsNotSpam");
                    }

					if ($mail.classList.contains("unread")) {
                        executeMailActionAndHide(mail, "markAsRead", {keepInInboxAsRead: true});
					}
				} else {
					if ($mail.classList.contains("unread")) {
						show("#markAsRead");
						hide("#markAsUnread");
					} else {
						hide("#markAsRead");
						show("#markAsUnread");
					}
				}
				
				var $openEmailMessages = byId("openEmailMessages");
				var totalHiddenMessages = 0;

                let lastCheckedEmail = await storage.get("_lastCheckedEmail");
                let lastCheckedEmailinLS = localStorage["_lastCheckedEmail"];
                if (lastCheckedEmailinLS) {
                    lastCheckedEmailinLS = new Date(lastCheckedEmailinLS);
                    if (!lastCheckedEmail || lastCheckedEmailinLS.isAfter(lastCheckedEmail)) {
                        lastCheckedEmail = lastCheckedEmailinLS;
                    }
                }

				mail.messages.forEach(function(message, messageIndex) {
					var mustCollapse = false;
					var mustHide = false;

                    if (!params.showEverything) {
                        if (messageIndex < mail.messages.length-1) {
                            // it's an email from this user, so ignore/collapse it
                            if (message.from.email == mail.account.getEmail()) {
                                mustCollapse = true;
                            } else {
                               if (message.date) {
                                   if (lastCheckedEmail) {
                                       // more than 24 hours collapse it before last "supposedly" user checked emails
                                       if (message.date.diffInHours() <= -24 || message.date.diffInSeconds(lastCheckedEmail) < 0) {
                                           mustCollapse = true;
                                       }
                                   } else {
                                       // never last checked, might be first install or something so collapse all
                                       mustCollapse = true;
                                   }
                               } else {
                                   // can't parse the dtes so let's only collapse last
                                   mustCollapse = true;
                               }
                            }
                        }
                        
                        // hide middle messages
                        if (mail.messages.length >=4 && messageIndex >= 1 && messageIndex < mail.messages.length-1) {
                            // might not have been viewed yet (ie. not collapsed) so let's NOT hide it
                            if (mustCollapse) {
                                mustHide = true;
                            }
                        }
                        
                        // if should be hidden but user has clicked to expandMessages so don't hide them
                        if (mustHide && (params.expandMessages || !autoCollapseConversations)) {
                            mustHide = false;
                        }
                    }
					
					// for performance, let's not create hidden thread message nodes
					if (mustHide) {
						totalHiddenMessages++;
						if (totalHiddenMessages >= 2) {
							return;
						}
					}
					
					const $message = setMailMessage($openEmailMessages, mail, message);
					const $messageBody = $message.querySelector(".messageBody");
					
					if (alwaysDisplayExternalContent) {
						// put back the imghidden to img (note: we had to manually change these when retreving the message to avoid fetching the images)
						const filteredHTML = $messageBody.innerHTML;
						if (filteredHTML.includes(IMAGE_REPLACED_OPENER)) {
							showImages($messageBody);
						}
					} else {
						var externalContentHidden = false;

						if (!mail.forceDisplayImages) {
							$messageBody.querySelectorAll("img[src], meta[src], input[src]").forEach(el => {
                                el.removeAttribute("src");
                                externalContentHidden = true;
							});

							$messageBody.querySelectorAll("*[background]").forEach(el => {
								el.removeAttribute("background");
								externalContentHidden = true;
							});
							
							$messageBody.querySelectorAll("*[style*='background:'], *[style*='background-image:']").forEach(el => {
								var style = el.getAttribute("style");
								style = style.replace(/background/ig, "backgroundDISABLED");
								el.setAttribute("style", style);
								externalContentHidden = true;
							});
						} else if (mail.forceDisplayImages && accountAddingMethod == "oauth") {
							showImages($messageBody);
						}
						
						if (externalContentHidden) {
							showToast({toastId:"displayImages", text:"", duration:20, keepToastLinks:true});
							
                            async function displayImages(event) {
								// in autodetect - img is always converted to imghidden (refer to patch 101) so we must refetch the thread
								if (accountAddingMethod == "autoDetect") {
									mail.messages = [];
								}
								
								mail.forceDisplayImages = true;
								openEmail({mail:mail});
								
								if (event.target.id == "alwaysDisplayImages") {
									await storage.set("alwaysDisplayExternalContent", true);
								}
								
								dismissToast(event.target);
                            }

                            onClickReplace("#displayImagesLink", displayImages);
                            onClickReplace("#alwaysDisplayImages", displayImages);
						}
					}
					
					if (mustCollapse && autoCollapseConversations) {
						$message.classList.add("collapsed");
					}
					
					if (mustHide) {
						$message.classList.add("hide");
					}
					
					// last message
					if (messageIndex == mail.messages.length-1) {
						// just do this for last message for now - optimize
						// for h-event microformat: identify last messages as summary
						$message.classList.add("p-summary");
					} else {
						// previous messages
                        onClick($message.querySelector(".messageHeader"), function() {
							$message.classList.toggle("collapsed");
							const $messageBody = $message.querySelector(".messageBody");
							if (!$message.classList.contains("collapsed") && !$messageBody._processMessage) {
								setTimeout(function() {
									processMessage(mail, $messageBody, messageIndex);
								}, 1);
							}
						});
					}
					
					// if last child is block quote then hide else keep it
					Array.from($message.querySelectorAll("[class$=gmail_extra], blockquote:not(.gmail_quote):last-child")).some($trimmedContent => { // blockquote[type='cite'], [class$=gmail_quote], blockquote:not(.gmail_quote)
						
						// this is possibly a real quote inside the body so ignore it
						//if (this.nodeName == "BLOCKQUOTE" && this.className && this.className.includes("gmail_quote")) {
							// continue loop
							//return true;
						//}
						
						hide($trimmedContent);
                        const $elipsis = document.createElement("div");
                        $elipsis.classList.add("showTrimmedContent");
                        $elipsis.title = "Show trimmed content";
                        $elipsis.textContent = "...";
						/*
						$elipsis.click(function() {
							$trimmedContent.toggle();
						});
						*/
						$trimmedContent.before($elipsis);
						
						// if gmail_extra found then stop embedding any other ...
						if ($trimmedContent.className?.includes("gmail_extra")) {
							return true;
						}
					});
					
					// auto-detect files
					$message.querySelectorAll(".att > tbody > tr").forEach(el => {
						const $soundImage = el.querySelector("img[src*='sound']");
						if ($soundImage) {
							const soundSrc = $soundImage.parentElement.href;
							// make sure it's from the google or we might be picking up random links that made it all the way to this logic
							if (soundSrc?.includes("google.com")) {
                                const $td = document.createElement("td");

                                const $audio = document.createElement("audio");
                                $audio.setAttribute("controls", "");
                                $audio.setAttribute("preload", "metadata");
                                $audio.style["margin"] = "8px";

                                const $source = document.createElement("source");
                                $source.src = soundSrc;

                                $audio.append($source, "Your browser does not support the audio element.");

                                $td.append($audio);

								el.append($td);
							}
						} else if (/\.(mpg|mpeg|mp4|webm)\b/.test(el.querySelector("b")?.textContent)) {
							const videoSrc = el.querySelector("a").href;
                            const $videoWrapper = document.createElement("td");
                            $videoWrapper.classList.add("videoWrapper");

                            const $video = document.createElement("video");
                            $video.setAttribute("preload", "metadata");
                            $video.src = videoSrc;

                            const $playButton = document.createElement("iron-icon");
                            $playButton.classList.add("videoPlayButton");
                            $playButton.setAttribute("icon", "av:play-circle-outline");

                            $videoWrapper.append($video, $playButton);

							$video.addEventListener("loadedmetadata", function() {
                                $videoWrapper.classList.add("loaded");
                            });

                            onClick($video, function() {
                                previewVideo(videoSrc);
                            });

							el.append($videoWrapper);
						}
					});
					
					// manual files
					if (message.files?.length) {
						
						const $attachmentsWrapper = $message.querySelector(".attachmentsWrapper");

						message.files.forEach(function(file, fileIndex) {
							const contentDisposition = MyGAPIClient.getHeaderValue(file.headers, "Content-Disposition");
							// content id ex. "<image002.jpg@01CFC9BD.81F3BC70>"
							var contentId = MyGAPIClient.getHeaderValue(file.headers, "Content-Id");
							console.log("file", file);
							if (contentId) {
								// remove any < or > from start or end
								contentId = contentId.replace(/^</, "").replace(/>$/, "");
							}
							
							if (contentId && !/attachment\;/.test(contentDisposition)) {
								// means we have an inline image etc.
                                // see if we already queued this file for fetching
                                // we couldn't use attachmentid or even content id because they seemed always unique
								let queuedFile = mail.allFiles.find(allFile => allFile.filename == file.filename && allFile.size == file.body.size);
								
								// if not then added it to the queue
								if (!queuedFile) {
									queuedFile = mail.queueFile(message.id, file);
								}
								
								queuedFile.fetchPromise.then(function(response) {
									// $messageBody context is not lost because we are inside the loop function above... $.each(response.mail.messages, function(index, message)
									const blobUrl = generateBlobUrl(response.data, file.mimeType);
									
									$messageBody.querySelectorAll("img").forEach(el => {
										if (el.src?.includes(FOOL_SANITIZER_CONTENT_ID_PREFIX + contentId)) {
											el.src = blobUrl; // "data:" + file.mimeType + ";base64," + response.data
										}
									});
								}).catch(error => {
									console.error("error in fetchpromise", error);
                                    const span = document.createElement("span");
                                    span.textContent = `Error loading image: ${error}`;
									$messageBody.querySelectorAll("img").forEach(el => el.replaceWith(span));
								});
							} else {
                                const $attachmentDiv = importTemplateNode('#attachmentTemplate');
								$attachmentsWrapper.append($attachmentDiv);
								
								var attachmenutImageUrl;
								var attachmentType;
								if (file.mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
									attachmenutImageUrl = "/images/driveIcons/word.png";
								} else if ((file.mimeType == "application/pdf") || file.filename.includes(".pdf")) {
									attachmenutImageUrl = "/images/driveIcons/pdf.png";
									attachmentType = "pdf";
								} else if (file.mimeType?.includes("audio/")) {
									attachmenutImageUrl = "/images/driveIcons/audio.png";
									attachmentType = "audio";
								} else if (file.mimeType?.includes("video/")) {
									attachmenutImageUrl = "/images/driveIcons/video.png";
									attachmentType = "video";
								} else if (file.mimeType?.includes("image/")) {
									attachmenutImageUrl = "/images/driveIcons/image.png";
									attachmentType = "image";
								} else if (file.mimeType?.includes("application/vnd.ms-excel")) {
									attachmenutImageUrl = "/images/driveIcons/excel.png";
								} else {
									attachmenutImageUrl = "/images/driveIcons/generic.png";
								}
								
                                const $attachmentIcon = $attachmentDiv.querySelector(".attachmentIcon");
                                $attachmentIcon.src = attachmenutImageUrl;
                                $attachmentIcon.title = file.mimeType;

								$attachmentDiv.querySelector(".filename").textContent = file.filename;
								
                                onClick($attachmentDiv.querySelector(".downloadIcon"), function(e) {
									showLoading();
									mail.account.fetchAttachment({messageId:message.id, attachmentId:file.body.attachmentId, size:file.body.size, noSizeLimit:true}).then(function(response) {
										hideLoading();
										downloadFile(response.data, file.mimeType, file.filename);
									}).catch(error => {
										console.error(error);
										showError(error);
									});
									
									e.preventDefault();
									e.stopPropagation();
								});
								
                                onClick($attachmentDiv, function() {
									showLoading();
									mail.account.fetchAttachment({messageId:message.id, attachmentId:file.body.attachmentId, size:file.body.size, noSizeLimit:true}).then(function(response) {
										hideLoading();
										
										if (attachmentType == "audio") {
											const $dialog = initTemplate("audioDialogTemplate");
											selector("#audioDialog source").src = `data:${file.mimeType};base64,${response.data}`;

											const audio = $dialog.querySelector("audio");
											audio.load();
											audio.play();
											
                                            replaceEventListeners($dialog, "iron-overlay-closed", function() {
												audio.pause();
												audio.currentTime = 0;
											});
											
											openDialog($dialog);
										} else if (attachmentType == "video") {
											previewVideo(`data:${file.mimeType};base64,${response.data}`);
										} else if (attachmentType == "pdf" || attachmentType == "image") {
											const blob = generateBlob(response.data, file.mimeType);
											saveToLocalFile(blob, file.filename).then(function(url) {
												openUrl(url);
											})
										} else {
											downloadFile(response.data, file.mimeType, file.filename);
										}
									}).catch(error => {
										console.error(error);
										showError(error);
									});
								});
							}
						});
						
						show($attachmentsWrapper);
					}

					// set message photo
					const contactPhotoParams = shallowClone(message.from);
					contactPhotoParams.mail = mail;
					const $imageNode = $message.querySelector(".messageHeader .contactPhoto");
					setContactPhoto(contactPhotoParams, $imageNode);

				});
				
				const $hiddenMessages = selectorAll(".message.hide");
				if ($hiddenMessages.length) {
                    $hiddenMessages.forEach(el => {
                        const $expander = document.createElement("div");
                        $expander.id = "messageExpander";

                        const $messsagesHidden = document.createElement("div");
                        $messsagesHidden.id = "messagesHidden";
                        $messsagesHidden.textContent = totalHiddenMessages;

                        $expander.append($messsagesHidden);
                        onClick($expander, function() {
                            expandMessages({
                                mail: mail,
                                expandMessages:true
                            });
                        });
                        $hiddenMessages[0].before($expander);
                    });
				}

				// reply area
				var $replyArea = byId("replyArea");
				
				// reset
				hide($replyArea);
				
				function initReply() {
					$replyArea.classList.remove("clicked", "sending", "sendingComplete");
					
					$replyArea.querySelector("#send").textContent = getMessage("send");

                    const $sendAndArchive = $replyArea.querySelector("#sendAndArchive");
                    const $archiveIcon = document.createElement("iron-icon")
                    $archiveIcon.setAttribute("icon", "archive");
                    emptyAppend($sendAndArchive, `${getMessage("send")} + `, $archiveIcon);

                    const $sendAndDelete = $replyArea.querySelector("#sendAndDelete");
                    const $deleteIcon = document.createElement("iron-icon")
                    $deleteIcon.setAttribute("icon", "delete");
                    emptyAppend($sendAndDelete, `${getMessage("send")} + `, $deleteIcon);
                    
					getReplyTextArea().value = "";

					var totalRecipients = 0;
					if (mail.messages.last().to) {
						totalRecipients += mail.messages.last().to.length;
					}
					if (mail.messages.last().cc) {
						totalRecipients += mail.messages.last().cc.length;
					}
					
					if (totalRecipients <= 1) {
						$replyArea.removeAttribute("replyAll");
						byId("replyPlaceholder").textContent = getMessage("reply");
					} else {
						console.log("show reply all")
						$replyArea.setAttribute("replyAll", "true");
						byId("replyPlaceholder").textContent = getMessage("replyToAll");
					}
				}
				
				initReply();

                onClickReplace($replyArea, function() {
                    console.log("replyTextarea clicked");
					if (!$replyArea.classList.contains("clicked")) {
						$replyArea.classList.add("clicked");
						getReplyTextArea().focus();
					}
				});

				// reply only to sender
				onClickReplace("#replyOnlyToSender", function() {
					$replyArea.removeAttribute("replyAll");
				});

				// reply only to sender
                addEventListeners("#forward", "mouseup", event => {
					openMailInBrowser(mail, event);
					event.preventDefault();
                    event.stopPropagation();
				});

				var replyObj;
				
				// MUST USE .off() for every event

                replaceEventListeners(getReplyTextArea(), "keyup", function(e) {
                    resizeMessageHeight();
                });

                replaceEventListeners(getReplyTextArea(), "keydown", function(e) {
                    if (isCtrlPressed(e) && e.key == "Enter" && !e.isComposing) {
                        let $button;
                        if (showSendAndArchiveButton) {
                            $button = byId("sendAndArchive");
                        } else if (showSendAndDeleteButton) {
                            $button = byId("sendAndDelete");
                        } else {
                            $button = byId("send");
                        }
                        console.log("button focus click");
                        
                        $button.focus();
                        $button.click();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
				
                replaceEventListeners(getReplyTextArea(), "focus", async function(event) {
                    console.log("focus")

                    const mail = getOpenEmail();
                    
                    const $replyTo = byId("replyTo");
                    if ($replyArea.getAttribute("replyAll")) {
                        replyObj = await mail.generateReplyObject({replyAllFlag:true});
                        console.log(replyObj);
                        
                        emptyAppend($replyTo, `${getMessage("to")} `);

                        var firstTo = true;
                        replyObj.tos.forEach(to => {
                            if (!firstTo) {
                                $replyTo.append(", ");
                            }
                            firstTo = false;
                            $replyTo.append( pretifyRecipientDisplay(to, mail.account.getEmail()) );
                        });
                        
                        replyObj.ccs.forEach(cc => {
                            if (!firstTo) {
                                $replyTo.append(", ");
                            }
                            firstTo = false;
                            $replyTo.append( pretifyRecipientDisplay(cc, mail.account.getEmail()) );
                        });
                    } else {
                        replyObj = await mail.generateReplyObject();
                        console.log("replyobj", replyObj);
                        emptyNode($replyTo);
                        $replyTo.append(`${getMessage("to")} `);
                        $replyTo.append(pretifyRecipientDisplay(replyObj.tos[0]));
                    }
                    
                    $replyArea.classList.add("clicked");
                    replyingToMail = mail;
                    
                    resizeMessageHeight();
                    
                    clearInterval(autoSaveInterval);
                    autoSaveInterval = setInterval(function() {
                        autoSave();
                    }, seconds(3));
                });

                replaceEventListeners(getReplyTextArea(), "blur", function(e) {
                    console.log("blur", e);

                    const mail = getOpenEmail();
                    
                    if (!$replyArea.classList.contains("sendingComplete") && !getReplyTextArea().value) {
                        // if button is clicked inside reply area (ie Send) then don't reset reply area
                        if (e.relatedTarget?.nodeName == "PAPER-BUTTON" && e.relatedTarget.closest("#replyArea")) {
                            // do nothing
                        } else {
                            initReply();
                        }

                        clearInterval(autoSaveInterval);
                        autoSave();
                    }
                    
                    resizeMessageHeight();
                });
				
				if (showSendAndArchiveButton) {
					show($replyArea.querySelector("#sendAndArchive"));
				} else {
					hide($replyArea.querySelector("#sendAndArchive"));
				}

				if (showSendAndDeleteButton) {
					show($replyArea.querySelector("#sendAndDelete"));
				} else {
					hide($replyArea.querySelector("#sendAndDelete"));
				}

                function sendButton(event) {
					// save this varirable because apparently e.data was being lost inside callback of .postReply just below??
					const $sendButtonClicked = event.target;
					const sendAndArchive = $sendButtonClicked.id == "sendAndArchive";
					const sendAndDelete = $sendButtonClicked.id == "sendAndDelete";
					
					const replyMessageText = getReplyTextArea().value;
					
					$replyArea.classList.add("sending");
					
					// use Polymer.dom because in Firefox the paper-spinner was not instantianting
                    const $previousSendButton = $sendButtonClicked.cloneNode(true);

                    const $spinner = document.createElement("paper-spinner");
                    $spinner.classList.add("white");
                    $spinner.setAttribute("active", "");

					emptyAppend($sendButtonClicked, $spinner);
					
                    const postReplyParams = {
                        actionParams: {
                            message: replyMessageText,
                            replyAllFlag: $replyArea.getAttribute("replyAll"),
                            markAsRead: replyingMarksAsRead && $mail.classList.contains("unread")
                        }
                    }

                    showToast({toastId:"undoToast", duration:999, text: `${getMessage("sending")}...`, actionParams:{
                            onClick: function() {
                                clearTimeout(globalThis.replyTimeout);
                                dismissToast(byId("undoToast"));

                                $replyArea.classList.remove("sending");
                                $sendButtonClicked.replaceWith($previousSendButton);
                            }
                        }
                    });
                    
                    globalThis.replyTimeout = setTimeout(() => {

                        byId("undo").style.visibility = "hidden";

                        executeMailAction(mail, "postReply", postReplyParams).then(response => {
                            byId("undo").style.visibility = "visible";

                            $replyArea.classList.remove("sending");
                            
                            if (sendAndArchive) {
                                executeMailAction(mail, "archive");
                            } else if (sendAndDelete) {
                                executeMailAction(mail, "deleteEmail");
                            }
                            
                            // append message to top
                            const newMessage = {
                                alreadyRepliedTo: true,
                                from: {
                                    name: getMessage("me"),
                                    email: mail.account.getEmail()
                                },
                                date: new Date(),
                                to: replyObj.tos,
                                cc: replyObj.ccs,
                                textContent: replyMessageText,
                                content: convertPlainTextToInnerHtml(replyMessageText) // htmltotext because we didn't want <script> or other tags going back into the content
                            };
                            
                            mail.messages.push(newMessage);
                            
                            const $message = setMailMessage($openEmailMessages, mail, newMessage);
                            
                            $message.querySelector(".contactPhoto").setAttribute("src", $replyArea.querySelector(".contactPhoto").getAttribute("src"));
    
                            resizeMessageHeight();
                            
                            // scroll to bottom
                            getOpenEmailScrollTarget().scrollTop = getOpenEmailScrollTarget().scrollHeight;
                            
                            showMessage(getMessage("sent"));
                            
                            // this timeout MUST happen BEFORE the next timeout below for hiding the emails
                            setTimeout(function() {
                                // place this in a timeout to ensure autoSave is removed before it is added on blur event
                                console.log("autoSave remove: " + new Date());
                                clearInterval(autoSaveInterval);
                                storage.remove("autoSave");
                            }, 200);
    
                            setTimeout(function() {
                                if (replyingMarksAsRead) {
                                    if ($mail.classList.contains("unread")) {
                                        let keepInInboxAsRead;
                                        let autoAdvance;
                                        if (sendAndArchive || sendAndDelete) {
                                            keepInInboxAsRead = false;
                                            autoAdvance = true;
                                        } else {
                                            keepInInboxAsRead = true;
                                            autoAdvance = false;
                                        }
                                        if (keepInInboxAsRead) {
                                            $mail.classList.remove("unread");
                                            //updateUnreadCount(-1, $mail);
                                        } else {
                                            hideMail($mail, autoAdvance);
                                        }
                                        hide("#markAsRead");
                                        show("#markAsUnread");
                                    } else {
                                        if (sendAndArchive || sendAndDelete) {
                                            hideMail($mail, true);
                                        }
                                    }
                                }
                            }, 1000);
                            
                            initReply();
                            
                        }).catch(error => {
                            $replyArea.classList.remove("sending");
                            $replyArea.querySelector("#send").textContent = getMessage("send");
                            if (error?.sessionExpired) {
                                showError("There's a problem. Save your reply outside of this extension or try again.");
                            } else {
                                showError(error);
                            }
                        });                        
                    }, seconds(SEND_DELAY_SECONDS));
                }

                onClickReplace($replyArea.querySelector("#send"), sendButton);
                onClickReplace($replyArea.querySelector("#sendAndArchive"), sendButton);
                onClickReplace($replyArea.querySelector("#sendAndDelete"), sendButton);

				show($replyArea);
				
				// need extra time especially when loading email via notification popup click
				setTimeout(function() {
					resizeMessageHeight();
				}, 100)

				// set message photo, use profile first, else use contacts
				const $imageNode = $replyArea.querySelector(".contactPhoto");
				const profileInfo = await mail.account.getSetting("profileInfo");
				if (profileInfo?.imageUrl) {
					$imageNode.setAttribute("src", profileInfo.imageUrl);
				} else {
					const contactPhotoParams = {
                        useNoPhoto: true,
                        email: mail.account.getEmail()
                    };
					contactPhotoParams.mail = mail;
					setContactPhoto(contactPhotoParams, $imageNode);
				}
			} else {
				// happens sometimes if a single message from the thread was deleted (ie. using "Delete this message" from dropdown on the right of message in Gmail)
				const error = "Problem retrieving message, this could happen if you deleted an individual message!";
				showMessage(error, {
					text:"Disable conversation view",
					onClick:function() {
						openUrl("https://jasonsavard.com/wiki/Conversation_View_issue?ref=problemRetrievingMessage");
					}
				});
				logError(error);
				reject(error);
			}
			
			// need just a 1ms timeout apparently so that transitions starts ie. core-animated-pages-transition-prepare before detecting it
            // wait for certain events before processing message
            sleep(300).then(() => {
                requestIdleCallback(() => {
                    selectorAll(".message:not(.collapsed) .messageBody").forEach((el, index) => {
                        if (!el._processMessage) {
                            processMessage(mail, el, index);
                        }
                    });
                    renderMoreAccountMails({mailsToRender:1});
                })
            });
			
			byId("openEmailProgress").classList.remove("visible");
		}).catch(error => {
            showError(error + ", please try again later!");
            console.trace(error);
			logError("error in getThread: " + error);
			reject(error);
		});
		
		if (!initOpenEmailEventListenersLoaded) {
			initOpenEmailEventListeners();
		}
		
		byId("archive").setAttribute("icon", "archive");
		
		resolve();
	});		
}

function observe($node, className, processor) {
	if ($node) {
		var observer = new MutationObserver(function(mutations) {
			//console.log("mutation", mutations);
			mutations.forEach(function(mutation) {
				for (var a=0; a<mutation.addedNodes.length; a++) {
					if (mutation.addedNodes[a].className && mutation.addedNodes[a].className.hasWord && mutation.addedNodes[a].className.hasWord(className)) {
						processor(mutation.addedNodes[a]);
					}
				}
			});    
		});
		
		var config = { childList: true, subtree:true };
		observer.observe($node[0], config);
	}
}

function autoSave() {
	const $replyArea = byId("replyArea");
	const replyAll = $replyArea.getAttribute("replyAll");
	const message = getReplyTextArea().value;
	if (message) {
		console.log("autosave set: " + new Date());
		storage.set("autoSave", {mailId:replyingToMail.id, replyAll:replyAll, message:message});
	}
}

chrome.runtime.onConnect.addListener(function(port) {
	docReady(() => {
		tabletFramePort = port;
		if (tabletFramePort.name == "popupWindowAndTabletFrameChannel") {
			console.log("onconnect")
			
			if (window.darkTheme) {
				tabletFramePort.postMessage({action: "invert"});
			}
			
			tabletFramePort.onMessage.addListener(function(message) {
				console.log("onMessage: " + message.action);
				if (message.action == "tabletViewUrlChanged") {
					storage.set("tabletViewUrl", message.url);
					showSelectedTab(message.url);
				} else if (message.action == "getCurrentEmail") {
					console.log("current email in popup: " + message.email);
					if (message.email && message.email != currentTabletFrameEmail) {
						initTabs(message.email);
						currentTabletFrameEmail = message.email;
					}
				} else if (message.action == "reversePopupView") {
					reversePopupView();
				} else if (message.action == "openTabInBackground") {
					chrome.tabs.create({ url: message.url, active: false });
				}
			});
		}
	});
});

if (chrome.runtime.onMessage) {
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.command == "profileLoaded") {
			refresh();
			showMessage(getMessage("profileLoaded"));
		} else if (message.command == "grantPermissionToContacts") {
            const $fetchContacts = byId("fetchContacts");
            if ($fetchContacts && isVisible($fetchContacts)) {
                niceAlert(getMessage("contactsLoaded")).then(() => {
                    location.reload();
                });
            } else {
                refresh();
                showMessage(getMessage("contactsLoaded"));
                niceAlert("You can also enable them in notifications: Options > Notifications > Show Contact Photos");
            }
        } else if (message.command == "refreshPopup") {
            location.reload();
		} else if (message.command == "closeWindow") {
            closeWindow(message.params);
        }
		sendResponse();
	});
}
	
if (chrome.runtime.onMessageExternal) {
	chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
		// MUST declare this same action "getEventDetails" in the backbround so that it does not sendresponse before we sendresponse here
		if (message.action == "getEventDetails") {
			var mail = getOpenEmail();
			if (mail) {
				const responseObj = {
                    title: mail.title,
                    description: mail.messages.last().content,
                    url: mail.getUrl()
				}
				console.log("sendreponse", responseObj)
				sendResponse(responseObj);
			} else {
				// no details
				sendResponse();
			}
		}
	});
}
		
function showImages($node) {
	var html = $node.innerHTML;
	html = html.replaceAll(IMAGE_REPLACED_OPENER, IMAGE_RESTORED_OPENER);
	html = html.replaceAll(IMAGE_REPLACED_CLOSER, IMAGE_RESTORED_CLOSER);
	$node.innerHTML = html;
}

function resetOpenEmailScrollTop() {
	const openEmailScrollTarget = getOpenEmailScrollTarget();
	if (openEmailScrollTarget) {
		openEmailScrollTarget.scrollTop = 0;
	}
}

function getInboxScrollTarget() {
	return selector("#inboxSection app-header-layout app-header").scrollTarget;
}

function getOpenEmailScrollTarget() {
	return selector("#openEmailSection app-header-layout app-header")?.scrollTarget;
}

function openInbox() {
	history.replaceState({openInbox:true}, "", "#inbox");
	selectorAll(".page").forEach(el => el.classList.remove("active"));
	byId("inboxSection").classList.add("active");

	// need a slight pause or else the render would not work
	setTimeout(function() {
		renderMoreAccountMails();
	}, 10);
	
	setTimeout(function() {
		resetOpenEmailScrollTop();
	}, 100)

    // to remove any weird <style> that might affect my markup
    emptyNode(".messageBody");
}

function getMailNode(mail) {
    const mailNodes = Array.from(selectorAll(".mail"));

    let $node = mailNodes.find(el => el._mail.id == mail.id);
	
	if (!$node) {
        $node = mailNodes.find(el => el._mail.threadId == mail.id);
	}

	return $node;
}

function getOpenEmail() {
	return byId("openEmail")?._mail;
}

function openPrevMail($mail) {
	console.log("openPrevMail");
	openOtherMail($mail, "prev");
}

function openNextMail($mail) {
	console.log("openNextMail");
	openOtherMail($mail, "next");
}

function openOtherMail($mail, direction) {
	console.log("openOtherMail");
	let $nextMail;

    const $allMail = selectorAll(".mail");
	const mailIndex = getNodeIndex($mail, $allMail);

	if (direction == "prev" && mailIndex >= 1) {
		$nextMail = $allMail[mailIndex-1];
	} else if (direction == "next" && mailIndex+1 < $allMail.length) {
		$nextMail = $allMail[mailIndex+1];
	}
    
    const mail = $mail._mail;
    const nextMail = $nextMail?._mail;

    const mailAccount = mail ? mail.account : null;
	if (nextMail?.account && mailAccount && mailAccount.id == nextMail.account.id) {
		openEmail({mail:nextMail});
	} else {
		if (!$mail.classList.contains("unread") && $allMail.length == 1) {
			console.log("in autoAdvanceMail before close");
			openInbox();
			// commented because seems the closeWindow is called via hideMail
			// MAKE SURE to use a delay before closing window or CPU issue - maybe!
			//closeWindow({source:"openOtherMail", delay:seconds(2)});
		} else {
			openInbox();
		}
	}
}

//auto-advance - find newest email
async function autoAdvanceMail($mail) {
    console.log("autoAdvanceMail");
    const autoAdvance = await storage.get("autoAdvance");
	if (autoAdvance == "newer") {
		openPrevMail($mail);
	} else if (autoAdvance == "older") {
		openNextMail($mail);
	} else {
		openInbox();
	}
}

async function refresh(hardRefresh) {
    // prevent multiple refresh by waiting for previous one to finish
    if (globalThis.refreshPromise) {
        await globalThis.refreshPromise;
    }

    globalThis.refreshPromise = new Promise((resolve, reject) => {
        showLoading();
        
        sendMessageToBG("refreshAccounts", {hardRefreshFlag: hardRefresh, source: "popup"}).then(async () => {
            await initAllAccounts();
            resizePopup();

            // avoid null when fetching $account.data("account");
            clearTimeout(window.renderAccountsTimeout);
			window.renderAccountsTimeout = setTimeout(async () => {
				await renderAccounts();
				// must resolve inside timeout because we need to make sure renderAccounts (which is synchronous) is run before
				resolve();
			}, 50);
			hideLoading();
        });
    });

    globalThis.refreshPromise.then(() => {
        delete globalThis.refreshPromise;
    });

    return globalThis.refreshPromise;
}

async function prepareMarkAllAsX($account, account, action) {
	var content;
	var tooManyAlternativeButton;
	var tooManyMarkAsX;
	if (action == "markAsRead") {
		content = getMessage("markAllAsReadWarning");
		tooManyAlternativeButton = getMessage("markAllAsReadTitle");
		tooManyMarkAsX = getMessage("readLinkTitle");
	} else if (action == "archive") {
		content = getMessage("archiveAllWarning");
		tooManyAlternativeButton = getMessage("archive");
		tooManyMarkAsX = getMessage("archive");
	} else if (action == "markAsSpam") {
		content = getMessage("markAllAsSpamWarning");
		tooManyAlternativeButton = getMessage("reportSpam");
		tooManyMarkAsX = getMessage("reportSpam");
    }
	
	if (await storage.get("usedMarkAllAsReadButton")) {
        let markAllAsXFlag = false;
		if (account.unreadCount > MAX_EMAILS_TO_ACTION) {
			const $dialog = initTemplate("tooManyActionsTemplate");
            
            // wait for polymer buttons to render
            await sleep(1);

            $dialog.querySelector("#tooManyActionsDescription").textContent = getMessage("tooManyUnread", MAX_EMAILS_TO_ACTION);
            $dialog.querySelector(".tooManyAlternative").textContent = `${tooManyAlternativeButton} (${MAX_EMAILS_TO_ACTION}+)`;
            $dialog.querySelector(".tooManyMarkAsX").textContent = `${tooManyMarkAsX} (< ${MAX_EMAILS_TO_ACTION})`;
            const response = await openDialog($dialog);
            if (response == "ok") {
                markAllAsXFlag = true;
            } else if (response == "cancel") {
                // nothing
            } else {
                openUrl("https://jasonsavard.com/wiki/Mark_all_unread_emails_as_read?ref=markAllAsReadDialog");
            }
		} else {
            markAllAsXFlag = true;
        }
        
        if (markAllAsXFlag) {
            showLoading();
            sendMessageToBG("markAllAsX", {
                account: account,
                action: action,
                closeWindow: true
            }, true).then(() => {
				refresh();
			}).catch(error => {
				showError(error);
			});
        }
	} else {
		openGenericDialog({
			title: "Warning",
			content: content,
			showCancel: true,
			okLabel: getMessage("continue")
		}).then(async response => {
			if (response == "ok") {
				await storage.setDate("usedMarkAllAsReadButton");
				$account.querySelector(".markAllAsReadButton").dispatchEvent(new Event("mouseup"));
			}
		});
	}
}

function closeMenu(thisNode) {
	var node = thisNode.closest("paper-menu-button");
	if (node) {
		node.close();
	}
}

function scrollAccountIntoView(accountDiv) {
	// forced to use jquery animate in Chrome 71 because was causing whole popout window to scroll
    if (true) { // DetectClient.isFirefox()

        // patch had to call all these methods when switching from inbox view to checker plus
        getInboxScrollTarget().scrollTop = accountDiv.offsetTop;
        selector("#inboxSection app-drawer-layout").scrollTop = accountDiv.offsetTop;

        /*
        selector("#inboxSection app-drawer-layout").scroll({
            top: accountDiv.offsetTop,
        });
        */

        /*
        originalAnimate.call(selector("#inboxSection app-drawer-layout"), {
            scrollTop: accountDiv.offsetTop.top
        })

        // patch for inbox view
        originalAnimate.call(selector("#inboxSection app-header[slot='header']"), {
            _scrollTop: accountDiv.offsetTop.top
        })
        */
	} else {
		accountDiv.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
	}
}

function updateAccountHeaderColor(account, $account, newColor) {
	account.saveSetting("accountColor", newColor);
	
	$account.querySelector(".accountHeader").style["background-color"] = newColor;
	
	const $accountAvatar = getAccountAvatar(account);
	setAccountAvatar($account, $accountAvatar);
}

function openComposeSection(params) {
	var voiceEmail = params.voiceEmail;
	var videoEmail = params.videoEmail;
	var account = params.account;
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	
	if (accountAddingMethod == "autoDetect") {
		openGenericDialog({
			content: getMessage("switchToAddAccounts"),
			okLabel: getMessage("addAccount"),
			showCancel: true
		}).then(function(response) {
			if (response == "ok") {
				openUrl("options.html?ref=voiceEmailFromAutoDetectUser&highlight=addAccount#accounts");
			}
		});
		return;
	}
	
    removeAllNodes(".chip");
	
	maxHeightOfPopup();
	
	const $composeSection = initTemplate("composeSectionTemplate");
	
	if (voiceEmail) {
		show(".recordSoundWrapper");
		hide("#recordVideoWrapper");
	} else {
		hide(".recordSoundWrapper");
		hide("#recordVideoWrapper");
	}
	
    onClickReplace($composeSection, function(e) {
		if (!e.target.closest(".acSuggestions")) {
			console.log("Hiding suggestions because clicked away");
			hide($acSuggestions);
		}
	});
	
	onClickReplace("#composeBack", function() {
		// stop microphone and camera
		if (mediaStream) {
			mediaStream.getTracks().forEach(track => {
				track.stop();
			});
		}
		
		selectorAll(".page").forEach(el => el.classList.remove("active"));
		byId("inboxSection").classList.add("active");
	});
	
	onClickReplace(".contacts", function() {
		openUrl("https://contacts.google.com/u/" + account.id + "/");
	});

	onClickReplace(".syncContacts", function() {
		showSaving();
		updateContacts().then(() => {
			showMessage(getMessage("done"));
		}).catch(error => {
			showError(error);
		}).then(function() {
			hideSaving();
		})
	});
	
	onClickReplace($composeSection.querySelector(".close"), function() {
		window.close();
	});

	function addChip($inputNode, $acSuggestions) {
		const $chip = document.createElement("div");
        $chip.classList.add("chip", "layout", "horizontal", "center");

        const $contactPhoto = document.createElement("iron-image");
        $contactPhoto.classList.add("contactPhoto");
        $contactPhoto.setAttribute("sizing", "cover");
        $contactPhoto.setAttribute("preload", "");
        $contactPhoto.setAttribute("placeholder", '/images/noPhoto.svg');

        const $chipName = document.createElement("span");
        $chipName.classList.add("chipName");

        const $removeChip = document.createElement("iron-icon");
        $removeChip.classList.add("removeChip");
        $removeChip.setAttribute("icon", "close");

        $chip.append($contactPhoto, $chipName, $removeChip);

		var name;
		var email;
		
        const $selected = $acSuggestions.querySelector(".selected")
		if (isVisible($acSuggestions) && $selected) {
			const chipData = $selected._data;
			name = chipData.name;
			email = chipData.email;
			hide($acSuggestions);
		} else {
			email = $inputNode.value;
		}
		
		$chip._data = {name:name, email:email};
		
		const data = {account:account, name:name, email:email};
		setContactPhoto(data, $contactPhoto);
		
        $chipName.textContent = name || email;
        $chipName.title = email;
		
        onClick($removeChip, function() {
			$chip.remove();
			byId("composeTo").focus();
		});
		
		selector(".chips").append($chip);
		$inputNode.value = "";
        $inputNode.setAttribute("placeholder", "");
	}
	
	const $fetchContacts = byId("fetchContacts");
    onClickReplace($fetchContacts, function() {
        requestPermission({ email: account.getEmail(), initOAuthContacts: true, useGoogleAccountsSignIn: true });
	});
	
	const MAX_SUGGESTIONS = 4;
	const MAX_SUGGESTIONS_BY_CLICK = 8;
	var performAutocomplete;
	let suggestions = [];
	let lastSuggestions = [];
	
	const $acSuggestions = selector(".acSuggestions");
	let contacts = [];
	
	function addSuggestion(params) {
        const $acItem = document.createElement("div");
        $acItem.classList.add("acItem", "layout", "horizontal", "center");

        const $contactPhoto = document.createElement("iron-image");
        $contactPhoto.classList.add("contactPhoto");
        $contactPhoto.setAttribute("sizing", "cover");
        $contactPhoto.setAttribute("preload", "");
        $contactPhoto.setAttribute("placeholder", '/images/noPhoto.svg');

        const $acName = document.createElement("div");
        $acName.classList.add("acName");
        $acName.textContent = params.name || params.email.split("@")[0];

        const $acEmail = document.createElement("div");
        $acEmail.classList.add("acEmail");
        $acEmail.textContent = params.email;

        $acItem.append($contactPhoto, $acName, $acEmail);

		$acItem._data = params;

        $acItem.addEventListener("mouseenter", function() {
            $acSuggestions.querySelector(".selected")?.classList.remove("selected");
            this.classList.add("selected");
        });

        $acItem.addEventListener("mouseleave", function() {
            this.classList.remove("selected");
        })

        onClick($acItem, function() {
            addChip(byId("composeTo"), $acSuggestions);
            byId("composeTo").focus();
        });
		
		params.delay = 1; // I tried 100 before
		setContactPhoto(params, $contactPhoto);
		
		$acSuggestions.append($acItem);
	}
	
	function showSuggestions() {
		suggestions.forEach(function(suggestion) {
			addSuggestion(suggestion);
		});
		lastSuggestions.forEach(function(suggestion) {
			addSuggestion(suggestion);
		});
		
		$acSuggestions.querySelector(".acItem")?.classList.add("selected");
		show($acSuggestions);
	}
	
	function generateSuggestionDataFromContact(account, contact, emailIndex) {
		var email = contact.emails[emailIndex].address;
		var name = contact.name;
		var updated = contact.updatedDate;
		return { account: account, email: email, name: name, updated: updated };
	}
	
	// prefetch for speed
	getContacts({account:account}).then(thisContacts => {
        if (thisContacts) {
            contacts = thisContacts;
        }
    });

    const $composeTo = byId("composeTo");

    $composeTo.setAttribute("placeholder", getMessage("to").capitalize());
    onClickReplace($composeTo, function(event) {
        suggestions = [];
        emptyNode($acSuggestions);
        contacts.every(function(contact, index) {
            if (index < MAX_SUGGESTIONS_BY_CLICK) {
                for (var b = 0; contact.emails && b < contact.emails.length; b++) {
                    var suggestion = generateSuggestionDataFromContact(account, contact, b);
                    if (contact.emails[b].primary) {
                        suggestions.push(suggestion);
                    }
                }
                return true;
            } else {
                return false;
            }
        });
        showSuggestions();
        event.preventDefault();
        event.stopPropagation();
    });
	
    replaceEventListeners($composeTo, "keydown", function(e) {
        if (e.key == "Tab" || e.key == "Enter" && !e.isComposing) {
            if (e.target.value) {
                addChip(e.target, $acSuggestions);
                e.preventDefault();
                e.stopPropagation();
            }
            performAutocomplete = false;
        } else if (e.key == "Backspace") {
            if (e.target.value == "") {
                const chips = selectorAll(".chips .chip");
                if (chips.length) {
                    chips[chips.length - 1].remove();
                }
                performAutocomplete = false;
            } else {
                performAutocomplete = true;
            }
        } else if (e.key == "ArrowUp") {
            const $current = $acSuggestions.querySelector(".selected");
            if ($current) {
                const $prev = $current.previousElementSibling;
                if ($prev) {
                    $current.classList.remove("selected");
                    $prev.classList.add("selected");
                }
            }
            performAutocomplete = false;
            e.preventDefault();
            e.stopPropagation();
        } else if (e.key == "ArrowDown") {
            var $current = $acSuggestions.querySelector(".selected");
            if ($current) {
                const $next = $current.nextElementSibling;
                if ($next) {
                    $current.classList.remove("selected");
                    $next.classList.add("selected");
                }
            }
            performAutocomplete = false;
            e.preventDefault();
            e.stopPropagation();
        } else {
            performAutocomplete = true;
        }
    });

    replaceEventListeners($composeTo, "keyup", function(e) {
        if (performAutocomplete) {
            if (contacts.length) {
                suggestions = [];
                lastSuggestions = [];
                emptyNode($acSuggestions);
                if (e.target.value) {
                    var firstnameRegex = new RegExp("^" +e.target.value, "i");
                    var lastnameRegex = new RegExp(" " + e.target.value, "i");
                    var emailRegex = new RegExp("^" + e.target.value, "i");
                    var matchedContacts = 0;
                    for (var a=0; a<contacts.length; a++) {
                        var contact = contacts[a];
                        var firstnameFound = firstnameRegex.test(contact.name);
                        var lastnameFound;
                        if (!firstnameFound) {
                            lastnameFound = lastnameRegex.test(contact.name);
                        }
                        if (firstnameFound || lastnameFound) {
                            if (contact.emails && contact.emails.length) {
                                //console.log("contact", contact);
                                matchedContacts++;
                                for (var b = 0; b < contact.emails.length; b++) {
                                    var suggestion = generateSuggestionDataFromContact(account, contact, b);
                                    if (contact.emails[b].primary && firstnameFound) {
                                        suggestions.push(suggestion);
                                    } else {
                                        lastSuggestions.push(suggestion);
                                    }
                                }
                            }
                        } else {
                            if (contact.emails && contact.emails.length) {
                                for (var b = 0; b < contact.emails.length; b++) {
                                    if (emailRegex.test(contact.emails[b].address)) {
                                        //console.log("contact email", contact);
                                        matchedContacts++;
                                        var suggestion = generateSuggestionDataFromContact(account, contact, b);
                                        if (contact.emails[b].primary && contact.name) {
                                            suggestions.push(suggestion);
                                        } else {
                                            lastSuggestions.push(suggestion);
                                        }
                                    }
                                }
                            }
                        }
                        
                        if (matchedContacts >= MAX_SUGGESTIONS) {
                            break;
                        }
                    }
                    
                    showSuggestions();
                } else {
                    hide($acSuggestions);
                }
            } else {
                show($fetchContacts);
            }
        }
    });
	
    const $composeSubject = byId("composeSubject");
    $composeSubject.value = voiceEmail ? getMessage("voiceMessage") : getMessage("videoMessage")
    replaceEventListeners($composeSubject, "focus", function() {
        if ($composeTo.value) {
            addChip($composeTo, $acSuggestions);
        }
    });
	
	if (params.skipAnimation) {
        selectorAll(".page").forEach(el => el.classList.add("disableTransition"));
	}

    selectorAll(".page").forEach(el => el.classList.remove("active"));
	$composeSection.classList.add("active");

	// my page transitions bugged if focus on an input was set during animation
	$composeSection.addEventListener("transitionend", function(e) {
		$composeTo.focus();
        selectorAll(".page").forEach(el => el.classList.remove("disableTransition"));
	}, {once: true});

	var mediaStream;
	var mediaRecorder;
	var chunks = [];
	var blob;
	var base64Data;
	
	var recorder;
	
	var AUDIO_CONTENT_TYPE = "audio/wav";
	var VIDEO_CONTENT_TYPE = "video/webm";
	
	var videoMimeTypeAndCodec;
	
	var $recordSoundWrapper = selector(".recordSoundWrapper");
	var $recordSoundButton = byId("recordSoundButton");
	
	function ensureRecordingIsSaved(params = {}) {
		console.log("ensureRecordingIsSaved");

		return new Promise(function(resolve, reject) {
			
			if (voiceEmail) {
				if ($recordSoundWrapper.classList.contains("recording")) {
					
					recorder.stop();
					
					recorder.exportWAV(function(blobFromExport) {
						blob = blobFromExport;
						blobToBase64(blob).then(function(response) {
							
							$recordSoundWrapper.querySelector("source").setAttribute("type", AUDIO_CONTENT_TYPE);
							$recordSoundWrapper.querySelector("source").src = response;
							
							base64Data = response;
							
							$recordSoundWrapper.classList.remove("recording");
							$recordSoundWrapper.classList.add("recordedSound");
							
							if (params.autoplay !== false) {
								$recordSoundWrapper.querySelector("audio").load();
								$recordSoundWrapper.querySelector("audio").play();
							}
							resolve();
							
						}).catch(error => {
							reject(error);
						});
					}, AUDIO_CONTENT_TYPE, 44100);
				} else {
					resolve();
				}
			} else {
				if ($recordVideoWrapper.classList.contains("recording")) {
					
					mediaRecorder.stop();
					
					mediaRecorder.onstop = function(e) {

						/*
						mediaStream.getTracks().forEach(function(track) {
							track.stop();
						});
						*/
					
						blob = new Blob(chunks, { 'type' : VIDEO_CONTENT_TYPE });
				        video.muted = false;
						video.src = window.URL.createObjectURL(blob);
						video.srcObject = null;

                        onClickReplace(video, function() {
                            if (video.paused == false) {
                                video.pause();
                            } else {
                                video.play();
                            }
                        });

                        replaceEventListeners("playing", function() {
                            if (!$recordVideoWrapper.classList.contains("recording")) {
                                $recordVideoWrapper.classList.add("playing");
                            }
                        });

                        ["pause", "ended"].forEach(state => {
                            replaceEventListeners(video, state, function() {
				        		$recordVideoWrapper.classList.remove("playing");
				        	});
                        });

                        replaceEventListeners("mouseenter", function() {
                            video.controls = true;
                        });

                        replaceEventListeners("mouseleave", function() {
                            video.controls = false;
                        });

			        	video.controls = true;

			        	blobToBase64(blob).then(function(response) {
			        		base64Data = response;
					        $recordVideoWrapper.classList.remove("recording");
					        $recordVideoWrapper.classList.add("recordedVideo");
					        resolve();
						}).catch(error => {
							reject(error);
						});
			        	
				    }
				} else {
					resolve();
				}
			}
		});
	}
	
	// Video stuff
	var $recordVideoWrapper = byId("recordVideoWrapper");
	var $recordVideoButton = byId("recordVideoButton");
	var mediaRecorder;
	var chunks;
	var video = byId("video");
	
	/*
	navigator.mediaDevices.enumerateDevices().then(function(response) {
		console.log("devices", response);
	});
	*/
	
	var userMediaParams = {};
	if (voiceEmail) {
		userMediaParams.audio = true;
	} else {
		userMediaParams.audio = true;
		userMediaParams.video = { facingMode: "user" };
	}
	
	navigator.mediaDevices.getUserMedia(userMediaParams).then(stream => {
		mediaStream = stream;
		
		if (voiceEmail) {
            onClickReplace($recordSoundButton, function() {
				if ($recordSoundWrapper.classList.contains("recording")) {
					ensureRecordingIsSaved().catch(function(error) {
						showError(error);
					});
				} else {
					const audio_context = new AudioContext;
					const input = audio_context.createMediaStreamSource(mediaStream);
				    // Uncomment if you want the audio to feedback directly
				    //input.connect(audio_context.destination);
				    //__log('Input connected to audio context destination.');
				    recorder = new Recorder(input, {numChannels:1}); // bufferLen: 1024, 
				    recorder.record();
					
					$recordSoundWrapper.classList.add("recording");
				}
			});
		} else {
			// Video
			function initVideoStream() {
			    $recordVideoWrapper.classList.remove("recordedVideo");
				
				video.srcObject = stream;
				video.muted = true;
				video.controls = false;
				video.play();
			}

			initVideoStream();

            replaceEventListeners(video, "canplay", function() {
                show("#recordVideoWrapper");
            });

            onClickReplace(video, function() {
                $recordVideoButton.click();
            });
			
            onClickReplace($recordVideoButton, function() {
				if ($recordVideoWrapper.classList.contains("recording")) {
					ensureRecordingIsSaved({autoplay:false}).then(function() {
						// nothing
					}).catch(error => {
						showError(error);
					});
				} else {
					initVideoStream();
				    
					chunks = [];
					
					/*
					videoMimeTypeAndCodec = VIDEO_CONTENT_TYPE + ";codecs=vp9,opus"; // codes=vp9 was very slow while recording
					if (!MediaRecorder.isTypeSupported(videoMimeTypeAndCodec)) {
						videoMimeTypeAndCodec = VIDEO_CONTENT_TYPE + ";codecs=vp9";
						if (!MediaRecorder.isTypeSupported(videoMimeTypeAndCodec)) {
							videoMimeTypeAndCodec = VIDEO_CONTENT_TYPE;
						}
					}
					*/
					
					var options = {mimeType : VIDEO_CONTENT_TYPE}
					mediaRecorder = new MediaRecorder(stream, options);
					mediaRecorder.start();
					mediaRecorder.ondataavailable = function(e) {
						chunks.push(e.data);
					}
					mediaRecorder.onwarning = function(e) {
					    console.warn('mediarecord wraning: ' + e);
					};
					mediaRecorder.onerror = function(e) {
						console.error('mediarecord error: ' + e);
						throw e;
					};
				    
				    $recordVideoWrapper.classList.add("recording");
				}
			});
		}
		
	}).catch(error => {
		console.error("media error", error);
		if (error.name == "PermissionDismissedError") {
			openGenericDialog({
				content: "You must grant access to use this feature.",
				okLabel: getMessage("grantAccess"),
				showCancel: true
			}).then(function(response) {
				if (response == "ok") {
					location.reload();
				}
			});
		} else if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError") {
			if (isDetached) {
				if (location.href.includes("action=getUserMediaDenied") || location.href.includes("action=getUserMediaFailed")) {
					openGenericDialog({
						title: "You must grant access to use this feature",
						content: "Click Allow to grant access."
					}).then(response => {
						if (response == "ok") {
                            onClickReplace([$recordSoundButton, $recordVideoButton], function() {
								openGenericDialog({
									content: "I assume you granted access now let's refresh the page",
									okLabel: getMessage("refresh")
								}).then(response => {
									if (response == "ok") {
										location.reload();
									}
								});
							});
						}
					});
				}
			} else {
				openUrl(getPopupFile() + "?action=getUserMediaDenied&mediaType=" + (voiceEmail ? "voiceEmail" : "videoEmail") + "&accountEmail=" + encodeURIComponent(account.getEmail()));
			}
		} else if (error.name == "MediaDeviceFailedDueToShutdown") {
			openUrl(getPopupFile() + "?action=getUserMediaDenied&mediaType=" + (voiceEmail ? "voiceEmail" : "videoEmail") + "&accountEmail=" + encodeURIComponent(account.getEmail()));
		} else {
			showError(error.name);
		}
	});
	
	function resetSending() {
		$composeSection.classList.remove("sending");

        const $sendComposeEmail = document.createElement("paper-button");
        $sendComposeEmail.id = "sendComposeEmail";
        $sendComposeEmail.classList.add("colored", "sendButton");
        $sendComposeEmail.setAttribute("raised", "");
        $sendComposeEmail.textContent = getMessage("send");

		byId("sendComposeEmail").replaceWith($sendComposeEmail);
	}
	
	resetSending();
	
    onClickReplace("#sendComposeEmail", function(event) {
        if ($composeTo.value) {
            addChip($composeTo, $acSuggestions);
        }
        
        const tos = Array.from(selectorAll(".chip")).map(el => el._data);
        
        if (tos.length == 0) {
            openGenericDialog({
                content: "Please specify at least one recipient."
            });
            return;
        }
        
        if (((voiceEmail && !$recordSoundWrapper.classList.contains("recording")) || (videoEmail && !$recordVideoWrapper.classList.contains("recording"))) && !base64Data) {
            openGenericDialog({
                content: "You forgot to record a message."
            });
            return;
        }

        $composeSection.classList.add("sending");

        const $spinner = document.createElement("paper-spinner");
        $spinner.classList.add("white");
        $spinner.setAttribute("active", "");
        emptyAppend(event.target, $spinner);

        ensureRecordingIsSaved({autoplay:false}).then(async function() {
            const sendEmailParams = {};
            if (await storage.get("donationClicked")) {
                sendEmailParams.tos = tos;
            } else {
                sendEmailParams.tos = [{email:account.getEmail()}];
            }
            sendEmailParams.subject = $composeSubject.value;
            
            sendEmailParams.htmlMessage = "";
            sendEmailParams.htmlMessage += "<span style='color:gray;font-size:90%'>To play this message:<br>Download file > Select a program > Choose <b>Google Chrome</b> or any other browser. <a href='https://jasonsavard.com/wiki/Opening_email_attachments?ref=havingTrouble'>Having trouble?</a></span><br><br>";
            sendEmailParams.htmlMessage += "Sent via Checker Plus for Gmail";
            
            sendEmailParams.attachment = {
                filename: voiceEmail ? VOICE_MESSAGE_FILENAME_PREFIX + ".wav" : VIDEO_MESSAGE_FILENAME_PREFIX + ".webm",
                contentType: voiceEmail ? AUDIO_CONTENT_TYPE : VIDEO_CONTENT_TYPE,
                data: base64Data.split("base64,")[1]
            };
            if (voiceEmail) {
                sendEmailParams.attachment.duration = parseFloat($recordSoundWrapper.querySelector("audio").duration).toFixed(2);
            }
            
            sendGA('sendAttachment', 'start');
            
            if (!await storage.get("donationClicked") && await storage.get("_sendAttachmentTested")) {
                openContributeDialog("sendAttachment", true);
                resetSending();
            } else {
                // insert slight delay because seems sendEmail bottlenecks when sending large attachments
                setTimeout(async () => {
                    executeAccountAction(account, "sendEmail", {actionParams: sendEmailParams}).then(async () => {
                        showMessage("Sent");
                        
                        if (!await storage.get("donationClicked")) {
                            openContributeDialog("sendAttachment", true, "<i style='color:gray'>For testing this message will be sent to yourself at " + account.getEmail() + "</i>");
                        }
                        
                        await storage.setDate("_sendAttachmentTested");
                        setTimeout(function() {
                            byId("composeBack").click();
                        }, 1200);
                        sendGA('sendAttachment', 'success');
                    }).catch(error => {
                        console.error(error);
                        openGenericDialog({
                            title: error,
                            content: "There was problem sending the email. Don't worry you can still download the message and attach it yourself in Gmail",
                            okLabel: getMessage("download"),
                            showCancel: true
                        }).then(response => {
                            if (response == "ok") {
                                var url = window.URL.createObjectURL(blob);
                                var link = window.document.createElement('a');
                                link.href = url;
                                link.download = sendEmailParams.attachment.filename;
                                link.dispatchEvent(new Event("click"));
                            }
                        });
                        sendGA('sendAttachment', 'error', error);
                    }).then(function() {
                        resetSending();
                    });					
                }, 1);
            }
        }).catch(error => {
            resetSending();
            showError(error);
        });
    });
}

function initAccountHeaderClasses($account) {
    $account.classList.toggle("hasMail", $account.querySelector(".mail"));
}

function showBackToInboxMessage() {
    const hardRefresh = accountAddingMethod == "oauth";
    showMessage("", {
        text: getMessage("backToInbox"),
        onClick: async () => {
            await storage.remove("_accountsCheckingSpam");
            await refresh(hardRefresh);
            hideMessage();
        }
    }, 100);
}

async function renderAccounts() {

    await cacheContactsData();

	const $inbox = byId("inbox");
	
    removeAllNodes($inbox.querySelectorAll(".account"));
    removeAllNodes(".accountAvatar");
	
	const $accountAvatars = byId("accountAvatars");
    
    await asyncForEach(accounts, async (account, accountIndex, thisArray) => {

		if (accountIndex != 0 && accountIndex == (thisArray.length-1) && !account.hasBeenIdentified()) {
			console.error("has not been identified: " + account.getEmail());
		} else {
			const $account = importTemplateNode("#accountTemplate");
			
			$inbox.append($account);
			
			initMessages($account.querySelectorAll("*"));

			$account.setAttribute("email", account.getEmail());
			$account._account = account;
			
			const $accountErrorWrapper = $account.querySelector(".accountErrorWrapper");
			//account.error = JError.ACCESS_REVOKED;
			if (account.error) {
				$accountErrorWrapper.removeAttribute("hidden");
                const $accountError = $accountErrorWrapper.querySelector(".accountError");
				emptyNode($accountError);
                $accountError.append(account.getError().niceError, " ", account.getError(true).$instructions);
                $accountError.title = account.getError().niceError;
				onClick($accountErrorWrapper.querySelector(".refreshAccount"), () => {
					refresh();
				});
			} else {
				$accountErrorWrapper.setAttribute("hidden", "");
			}
            
            const accountColor = await account.getSetting("accountColor");
            if (accountColor == DEFAULT_SETTINGS.accountColor) {
                $account.querySelector(".accountHeader").setAttribute("default-color", "true");
            }

			$account.querySelector(".accountHeader").style["background-color"] = accountColor;
			
			const accountTitleArea = $account.querySelector(".accountTitleArea");
            accountTitleArea.title = getMessage("open");
            addEventListeners(accountTitleArea, "mouseup", event => {
                const openParams = {};
                if (event.button == MouseButton.RIGHT) {
                    // do nothing
                    return;
                } else if (isCtrlPressed(event) || event.button == MouseButton.MIDDLE) {
                    openParams.openInBackground = true;
                } else if (openGmailInNewTab) {
                    openParams.openInNewTab = true;
                }
                executeAccountAction(account, "openInbox", {actionParams: openParams});
                closeWindow({source:"accountTitleArea"});
            });

            if (await storage.get("showMarkAllAsSpam")) {
                const markAllAsSpamButton = $account.querySelector(".markAllAsSpamButton");
                show(markAllAsSpamButton);
                addEventListeners(markAllAsSpamButton, "mouseup", () => {
                    prepareMarkAllAsX($account, account, "markAsSpam");
                });
            }
            
			addEventListeners($account.querySelector(".markAllAsReadButton"), "mouseup", () => {
                prepareMarkAllAsX($account, account, "markAsRead");
            });

			if (await storage.get("showArchiveAll")) {
                const showArchiveAll = $account.querySelector(".archiveAll");
				show(showArchiveAll);
                addEventListeners(showArchiveAll, "mouseup", () => {
                    prepareMarkAllAsX($account, account, "archive");
                });
			}

			addEventListeners($account.querySelector(".compose"), "mouseup", () => {
                // new: uing transport: 'beacon' ensures the data is sent even if window closes, old: using bg. because open compose closes this window and compose wasn't being registered in time
                sendGA('accountBar', 'compose', {transport: 'beacon'});
                executeAccountAction(account, "openCompose");
                closeWindow();
            });
			
			addEventListeners($account.querySelector(".voiceEmail"), "mouseup", () => {
                openComposeSection({voiceEmail:true, account:account});
                sendGA('accountBar', 'voiceEmail');
            });

			addEventListeners($account.querySelector(".videoEmail"), "mouseup", () => {
                openComposeSection({videoEmail:true, account:account});
                sendGA('accountBar', 'videoEmail');
            });

			addEventListeners($account.querySelector(".search"), "mouseup", () => {
                htmlElement.classList.add("searchInputVisible");
                byId("searchInput")._account = account;
                byId("searchInput").focus();
            });
			
			$account.querySelector(".accountOptionsMenuButton").addEventListener("mouseup", async function() { // MUST use .one because mousedown will also be called when menu items *inside the dropdown all are also clicked
                this.closest(".accountHeader").classList.remove("sticky");

                // patch for dark them when using account dropdown
                if (window.darkTheme) {
                    selectorAll(".accountHeader").forEach(el => el.style.filter = "initial");
                    selectorAll(".accountHeader iron-image").forEach(el => el.style.filter = "invert(100%)");
                }

                // patch for reveal background image blur when using account dropdown
                if (window.revealImage) {
                    selectorAll(".account").forEach(el => el.style["backdrop-filter"] = "initial");
                }
                
                maxHeightOfPopup();
                var $accountOptions = initTemplate(this.querySelector(".accountOptionsMenuItemsTemplate"));

                $account.querySelector(".markAllAsSpamButton").title = getMessage("markAllAsSpam");
                $account.querySelector(".markAllAsReadButton").title = getMessage("markAllAsRead");
                
                onClick($account.querySelector(".markAllAsRead"), function(event) {
                    closeMenu(this);
                    prepareMarkAllAsX($account, account, "markAsRead");
                });
                
                onClick($account.querySelector(".sendPageLink"), event => {
                    getActiveTab().then(tab => {
                        sendGA("inboxLabelArea", "sendPageLink");
                        sendMessageToBG("sendPageLink", {tab: tab, account: account}, true);
                        closeWindow({source: "sendPageLink"});
                    });
                });

                onClick($account.querySelector(".contacts"), function() {
                    openUrl("https://contacts.google.com/u/" + account.id + "/");
                });

                onClick($account.querySelector(".copyEmailAddress"), function() {
                    const hiddenText = byId("hiddenText");
                    hiddenText.value = account.getEmail();
                    hiddenText.focus();
                    hiddenText.select();
                    document.execCommand('Copy');
                    showMessage(getMessage("done"));
                    closeMenu(this);
                });

                async function updateAlias(alias) {
                    await account.saveSetting("alias", alias);
                    $account.querySelector(".accountTitle").textContent = await account.getEmailDisplayName();
                }
                
                onClick($account.querySelector(".alias"), async function() {
                    closeMenu(this);
                    if (await donationClicked("alias")) {
                        const $dialog = initTemplate("aliasDialogTemplate");
                        const newAlias = $dialog.querySelector("#newAlias");
                        newAlias.value = await account.getEmailDisplayName();
                        replaceEventListeners(newAlias, "keydown", function(e) {
                            if (e.key == 'Enter' && !e.isComposing) {
                                updateAlias(newAlias.value);
                                $dialog.close();
                            }
                        });
                        try {
                            const response = await openDialog($dialog);
                            if (response == "ok") {
                                updateAlias(newAlias.value);
                            }
                        } catch (error) {
                            showError("error: " + error);
                        }
                    }
                });

                onClick($account.querySelector(".colors"), async function() {
                    closeMenu(this);
                    if (await donationClicked("colors")) {
                        const $dialog = initTemplate("colorPickerDialogTemplate");
                        const $paperSwatchPicker = $dialog.querySelector("paper-swatch-picker");
                        $paperSwatchPicker.setAttribute("color", await account.getSetting("accountColor"));
                        replaceEventListeners($paperSwatchPicker, "color-changed", e => {
                            const color = e.detail.value;
                            updateAccountHeaderColor(account, $account, color);
                        });
                        openDialog($dialog);
                    }
                });
                
                const profileInfo = await account.getSetting("profileInfo");
                if (profileInfo) {
                    onClick($account.querySelector(".setAccountIcon"), function() {
                        account.deleteSetting("profileInfo");
                        refresh();
                    });
                    // little tricky here because we process the [msg] nodes with a call initMessages way below we must change the msg here or else it will be overwritten later
                    $account.querySelector(".setAccountIconLabel").setAttribute("msg", "removeAccountIcon");
                } else {
                    onClick($account.querySelector(".setAccountIcon"), async function() {
                        closeMenu(this);
                        if (await donationClicked("setAccountIcon")) {
                            // hard coded to useGoogleAccountsSignIn because Chrome sign in can only use default account
                            requestPermission({ email: account.getEmail(), initOAuthProfiles: true, useGoogleAccountsSignIn: true });
                        }
                    });
                }

                getContacts({account:account}).then(thisContacts => {
                    if (thisContacts) {
                        $account.querySelector(".showContactPhotos").classList.add("done");
                        $account.querySelector(".showContactPhotos iron-icon").setAttribute("icon", "check");
                    }
                });
                
                onClick($account.querySelector(".showContactPhotos"), function() {
                    closeMenu(this);
                    // hard coded to useGoogleAccountsSignIn because Chrome sign in can only use default account
                    requestPermission({ email: account.getEmail(), initOAuthContacts: true, useGoogleAccountsSignIn: true });
                });

                onClick($account.querySelector(".checkSpam"), async function() {
                    closeMenu(this);

                    const hardRefresh = accountAddingMethod == "oauth";
                    const originalMonitoredLabels = await account.getMonitorLabels();

                    const foundSpamMonitoredLabel = originalMonitoredLabels.indexOf(SYSTEM_SPAM);
                    const accountsCheckingSpam = await storage.get("_accountsCheckingSpam") || {};

                    if (foundSpamMonitoredLabel != -1 || accountsCheckingSpam[account.getEmail()]) {
                        if (foundSpamMonitoredLabel != -1) {
                            originalMonitoredLabels.splice(foundSpamMonitoredLabel, 1);
                            await account.saveSetting("monitorLabel", originalMonitoredLabels);
                        }
                        delete accountsCheckingSpam[account.getEmail()];
                        await storage.set("_accountsCheckingSpam", accountsCheckingSpam);
                        await refresh(true); // using true here because had polymer error with cancel animation?
                    } else {
                        await account.saveSetting("monitorLabel", [SYSTEM_SPAM]);
                        accountsCheckingSpam[account.getEmail()] = true;
                        await storage.set("_accountsCheckingSpam", accountsCheckingSpam);
                        try {
                            await refresh(hardRefresh);
                            showBackToInboxMessage();
                            chrome.alarms.create(Alarms.RESET_SPAM_CHECKING, {delayInMinutes: 1});
                        } finally {
                            await account.saveSetting("monitorLabel", originalMonitoredLabels);
                        }
                    }
                });

                if (accounts.length <= 1) {
                    hide($account.querySelector(".ignore"));
                } else {
                    $account.querySelector(".ignoreAccountText").textContent = accountAddingMethod == "autoDetect" ? getMessage("ignoreThisAccount") : getMessage("removeAccount");
                    show($account.querySelector(".ignore"));
                }

                onClick($account.querySelector(".ignore"), async function() {
                    showLoading();
                    await executeAccountAction(account, "remove");
                    
                    try {
                        await sendMessageToBG("pollAccounts", {showNotification:true});
                        location.reload();
                    } catch (error) {
                        showError(error);
                    } finally {
                        hideLoading();
                    }
                });

                onClick($account.querySelector(".accountOptions"), function() {
                    openUrl("options.html?ref=accountOptions&accountEmail=" + encodeURIComponent(account.getEmail()) + "#accounts")
                });
            
                // must be last
                initMessages(".accountOptionsMenu *");

            }, {once: true});

			// avatars
			const $accountAvatar = importTemplateNode("#accountAvatarTemplate");
			$accountAvatars.append($accountAvatar);
			
            $accountAvatar._account = account;
            $accountAvatar.title = await account.getEmailDisplayName();
			
            setAccountAvatar($account, $accountAvatar);
            
            // place this below setaccountavatar because of fouc when no avatar
			$account.querySelector(".accountTitle").textContent = await account.getEmailDisplayName();

			// must be done after avatar to update avatar count
			setUnreadCountLabels($account);

            onClick($accountAvatar, async function() {
				if (popupView == POPUP_VIEW_CHECKER_PLUS) {
					showSaving();
					setTimeout(function() {
						renderMoreAccountMails({renderAll:true});
						scrollAccountIntoView($account);
						hideSaving();
					}, 50);
				} else {
					if (await storage.firstTime("onlyCheckerPlusSupportsClickToScroll")) {
						openGenericDialog({
							content: "Only the Checker Plus view supports click to scroll to account",
							okLabel: getMessage("switchToCheckerPlus"),
							showCancel: true
						}).then(response => {
							if (response == "ok") {
								reversePopupView(true, true);
								renderMoreAccountMails();
							}
						});
					} else {
						reversePopupView(true, true);
						renderMoreAccountMails({ renderAll: true });
						setTimeout(() => {
							scrollAccountIntoView($account);
						}, 50);
					}
				}
            });
            
            const renderMailsParams = {
                $account: $account
            }
            if (!await storage.get("progressivelyLoadEmails")) {
                renderMailsParams.renderAll = true;
            }
            renderMails(renderMailsParams);
            
            initAccountHeaderClasses($account);
		}
	});
	
	// used to keep a skeleton scrollbar (windows only) there so the action buttons don't shift when the scrollbar normally disappear
	polymerPromise2.then(function() {
		if (hasVerticalScrollbar(getInboxScrollTarget(), 8)) {
			byId("inboxSection").classList.add("hasVerticalScrollbars");
		}
	});

	setContactPhotos(accounts, selectorAll(".mail"));
}

function showUndo(params) {
	return new Promise((resolve, reject) => {
		if (params.$mail && params.$mail.getBoundingClientRect().top >= window.innerHeight - 150) {
			byId("undoToast").setAttribute("vertical-align", "top");
		} else {
			byId("undoToast").setAttribute("vertical-align", "bottom");
		}
		showToast({toastId:"undoToast", duration:5, text:params.text, actionParams:{
				onClick: function() {
                    clearCloseWindowTimeout();
                    showLoading();
                    executeMailAction(params.mail, params.undoAction).then(async response => {
						const hiddenMailIndex = hiddenMails.indexOf(params.mail.id);
						if (hiddenMailIndex != -1) {
							hiddenMails.splice(hiddenMailIndex, 1);
						}
						
						if (params.undoAction == "untrash" && accountAddingMethod == "oauth") {
                            // seems the polling logic would not resurface the deleted email so had to delete historyid
                            await executeAccountAction(params.mail.account, "reset");
						}
						
						refresh().then(() => {
                            hideLoading();
							resolve();
						});
                    });
                    dismissToast(byId("undoToast"));
				}
			}
		});
	});
}

function initInboxMailActionButtons($mail) {
	if ($mail) {
		const mail = $mail._mail;
		const account = mail.account;
		
		// paper-icon-button were slow to initially load so decided to dynamically load them via template and mouseover
		const $inboxMailActionButtonsTemplate = $mail.querySelector(".inboxMailActionButtonsTemplate");
		if ($inboxMailActionButtonsTemplate) {
			initTemplate($inboxMailActionButtonsTemplate);

            function initButton(selector, msgName, action, showHide, fn) {
                const $button = $mail.querySelector(selector);
                $button.title = getMessage(msgName);
                $button.addEventListener("mouseup", event => {
                    if (showHide == "hide") {
                        executeMailActionAndHide(mail, action);
                    } else if (showHide == "show") {
                        executeMailAction(mail, action);
                    }
                    if (fn) {
                        fn(event);
                    }
                    event.preventDefault();
                    event.stopPropagation();
                });
            }

            initButton(".archive", "archive", "archive", "hide");
            initButton(".markAsSpam", "reportSpam", "markAsSpam", "hide");
            initButton(".markAsNotSpam", "notSpam", "markAsNotSpam", "hide");
            
            initButton(".delete", "delete", "deleteEmail", "hide", () => {
                showUndo({mail: mail, text: getMessage("movedToTrash"), undoAction: "untrash"});
            });

            initButton(".markAsRead", "readLinkTitle", "markAsRead", "hide", () => {
                showUndo({$mail:$mail, mail:mail, text:getMessage("markedAsRead"), undoAction:"markAsUnread"});
            });

            initButton(".markAsUnread", "unreadLinkTitle", "markAsUnread", "show", () => {
                $mail.classList.add("unread");
                updateUnreadCount(+1, $mail);
            });

			initButton(".reply", "reply", "reply", "show", () => {
                setTimeout(() => {
                    closeWindow();
                }, 100);
            });

            initButton(".openMail", "openGmailTab", null, null, event => {
                openMailInBrowser(mail, event);
            });
		}
	}
}

function renderMails(params) {
	var $account = params.$account;
	var maxIssuedDate = params.maxIssuedDate;

	// Load mails
	var account = $account._account;
	var mails = account.getMails().slice(0);
	
	mails.sort(function (a, b) {
	   if (a.issued > b.issued)
		   return -1;
	   if (a.issued < b.issued)
		   return 1;
	   return 0;
	});
	
	const $mails = $account.querySelector(".mails");
	
	var mailNodesBelowFold = 0;
	var newlyRenderedMails = 0;
	
	if (skinsSettings) {
		window.buttonsAlwaysShow = skinsSettings.some(function(skin) {
			// [Buttons] Always show
			if (skin.id == 29) {
				return true;
			}
		});
		window.darkTheme = skinsSettings.some(function(skin) {
			if (skin.id == 4) {
				return true;
			}
		});
		window.revealImage = skinsSettings.some(function(skin) {
			if (skin.id == 120) {
				return true;
			}
		});
	}
	
	const existingMailsCount = selectorAll(".mail").length;
	
	console.time("renderMails");
	mails.some((mail, mailIndex) => {
		if (hiddenMails.includes(mail.id)) {
			console.log("exclude: " + mail.title);
			return false;
		}
		
		const $lastMail = Array.from(selectorAll(".mail")).last();
		if ($lastMail && !isVisibleInScrollArea($lastMail, byId("inbox"), existingMailsCount + mailIndex)) {
			mailNodesBelowFold++;
		}
		
		// skip mails that have newer then the max issued date
		if (maxIssuedDate && mail.issued >= maxIssuedDate) {
            // same as "continue" ie. to skip this mail
			return false;
		} else if (mailNodesBelowFold >= 2) { // if 1 or more mail are below fold (ie. not visible) then stop loading the rendering the rest; do it later so that popup loads initially faster
			if (params.renderAll) {
				// just continue below
			} else if (params.mailsToRender) {
				if (newlyRenderedMails >= params.mailsToRender) {
					// we can break out now
					console.log("newlyRenderedMails >= params.mailsToRender");
					return true;
				} else {
					// just continue
				}
			} else {
				console.log("below fold: " + mailNodesBelowFold);
				return true;
			}
		} else {
			console.log("mail", mail.title + " " + maxIssuedDate + " " + mail.issued);
		}
		
		if (!params.showMore && mailIndex+1 > maxEmailsToShowPerAccount) {
			if (!$mails.querySelector(".showMoreEmails")) {
                const $showMoreEmails = document.createElement("div");
                $showMoreEmails.classList.add("showMoreEmails");
                $showMoreEmails.title = "Show more emails";

                const $expandMore = document.createElement("paper-icon-button");
                $expandMore.setAttribute("icon", "expand-more");

                $showMoreEmails.append($expandMore);
				onClick($showMoreEmails, function() {
                    this.remove();
                    // had to resassign $account because params.$account was always referencing last account
                    params.$account = $account;
					params.showMore = true;
					params.mailsToRender = 20;
					renderMoreMails(params);
				});
				$mails.append( $showMoreEmails );
			}
			return true;
		}
		
		newlyRenderedMails++;
		
		const $mail = importTemplateNode($account.querySelector(".mailTemplate"));
        console.log("mailnode", $mail);
        $mail._mail = mail;

		$mails.append($mail);
        
		// sender
		let sender = mail.generateAuthorsNode();
		if (!sender) {
			sender = getMessage("unknownSender");
		}
		
        const $sender = $mail.querySelector(".sender");
        emptyAppend($sender, sender);
		
		$mail.querySelector(".date").textContent = mail.getDate();
		
		if (mail.issued) {
			$mail.querySelector(".date").title = mail.issued.toLocaleStringJ();
		}
		
		$mail.querySelector(".subject").textContent = mail.title;
		
		// snippet
		var maxSummaryLetters;
		
		if ($mail.getBoundingClientRect().width == 0) { // sometimes happens then use default
			maxSummaryLetters = 180;
		} else {
			maxSummaryLetters = $mail.getBoundingClientRect().width / (drawerIsVisible ? 4.2 : 4);
		}
		
        const $EOM_Message = document.createElement("span");
        $EOM_Message.classList.add("eom");
        $EOM_Message.title = getMessage("EOMToolTip");
        $EOM_Message.textContent = `[${getMessage("EOM")}]`;
		
		mail.getLastMessageText({maxSummaryLetters:maxSummaryLetters, htmlToText:true, targetNode:$mail.querySelector(".snippet"), EOM_Message:$EOM_Message});
		
		// labels
		const labelsTemplate = $mail.querySelector(".labelsTemplate");
		
		if (labelsTemplate?.content) {
            const labelsFragment = new DocumentFragment();

			const labels = mail.getDisplayLabels(true, true);
			labels.forEach(labelObj => {
				const $label = importTemplateNode(labelsTemplate);
				$label._label = labelObj;
				$label.querySelector(".labelName").textContent = labelObj.name;
				if (labelObj.color) {
					css($label.querySelector(".labelName"), {
						"color": labelObj.color.textColor,
						"background-color": labelObj.color.backgroundColor
					});
				}

                labelsFragment.append($label);
			});

            const $labels = $mail.querySelector(".labels");
            $labels.append(labelsFragment);
        }
        
        mail.hasLabel(SYSTEM_SPAM).then(spam => {
            if (spam) {
                $mail.classList.add("is-spam");
            }
        });
		
		initStar($mail.querySelector(".star"), mail);

		if (mail.hasAttachments()) {
			show($mail.querySelector(".attachment-icon"));
		}
		
		if (buttonsAlwaysShow) {
			initInboxMailActionButtons($mail);
		}
		
		// click
        addEventListeners($mail, "mouseup", event => {
            if (emailPreview && !isCtrlPressed(event) && (!event.button || event.button == MouseButton.MAIN)) {
                // ** for auto-detect only because i think oauth already fills up .messages: openEmail must be called atleast once to generate the messages! for them to appear
                openEmail({mail:mail});
            } else {
                openMailInBrowser(mail, event);
                event.preventDefault();
                event.stopPropagation();
            }
        });

        addEventListeners($mail, "mouseenter", function() {
            if (!buttonsAlwaysShow) {
                initInboxMailActionButtons($mail);
            }
        });


        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;

        const gesturedZone = $mail;

        if (enableSwiping) {
            gesturedZone.addEventListener('touchstart', function(event) {
                gesturedZone.classList.add("swiping");
    
                initInboxMailActionButtons($mail);
    
                console.log("start", event)
                touchstartX = event.changedTouches[0].screenX;
                touchstartY = event.changedTouches[0].screenY;
            }, false);
            
            gesturedZone.addEventListener('touchmove', function(event) {
                console.log("move", event)
                touchmoveX = event.changedTouches[0].screenX;
                touchmoveY = event.changedTouches[0].screenY;
    
                const factor = 1.2;
                let xmove = Math.abs(touchmoveX - touchstartX);
                xmove = Math.pow(xmove, factor);
                if (touchmoveX < touchstartX) {
                    xmove *= -1;
                }
    
                const transform = `translate(${xmove}px)`;
                console.log(transform);
                this.style.transform = transform;
            }, false);
    
            gesturedZone.addEventListener('touchend', function(event) {
                console.log("end", event)
                touchendX = event.changedTouches[0].screenX;
                touchendY = event.changedTouches[0].screenY;
                
                const BUFFER = 50;
    
                if (touchendX + BUFFER < touchstartX) {
                    gesturedZone.querySelector(".delete").dispatchEvent(new Event("mouseup"));
                    this.style.transform = `translate(-${this.clientWidth + 10}px)`;
                } else if (touchendX - BUFFER > touchstartX) {
                    if (gesturedZone.classList.contains("unread")) {
                        gesturedZone.querySelector(".markAsRead").dispatchEvent(new Event("mouseup"));
                        this.style.transform = `translate(${this.clientWidth + 10}px)`;
                    } else {
                        gesturedZone.querySelector(".markAsUnread").dispatchEvent(new Event("mouseup"));
                        this.style.transform = `translate(0px)`;
                    }
                } else {
                    // reset
                    gesturedZone.classList.remove("swiping");
                    this.style.transform = `translate(0px)`;
                }
    
            }, false);
        }
	});
	
	console.timeEnd("renderMails");
}

function isVisibleInScrollArea($node, $scroll, mailIndex) {
    // patch seems firefox was not returning :visible on scroll or Y value for newly rendered nodes
    if (DetectClient.isFirefox()) {
    	return true;
    } else {
		var vpH = getInboxViewportHeight(), // Viewport Height
			//st = $scroll[0].scroller.scrollTop,
			//st = $scroll.scrollTop(), // Scroll Top
			y = $node.offsetTop;// + getInboxTop();
		console.info(isVisible($scroll) + " y: " + y + " vph: " + vpH);
		// when machine is slow it seems visible == false and y == 0
		// commented: also included vpH <= 0 refer to bug https://jasonsavard.com/forum/discussion/comment/15849#Comment_15849
    	return (!isVisible($scroll) && y == 0) || isVisible($scroll) && y < vpH;
    }
}

function renderMoreAccountMails(params = {}) {
	console.log("renderMoreAccountMails");
	selectorAll(".account").forEach($account => {
		params.$account = $account;
		renderMoreMails(params);
	});
}

function renderMoreMails(params) {
	var maxIssuedDate;
	const $lastMail = Array.from(params.$account.querySelectorAll(".mail")).last();
	if ($lastMail) {
		maxIssuedDate = $lastMail._mail.issued;
	}
	
	params.maxIssuedDate = maxIssuedDate;

	renderMails(params);
	setContactPhotos(accounts, selectorAll(".mail"));
}

function getInboxTop() {
	// because inbox is inside paper-header-panel [main] so the inbox.top can be negative so we must add the scrollTop of paper-headerpanel
	return byId("inbox").getBoundingClientRect().top; // + $("[main]")[0].scroller.scrollTop;
}

function getInboxViewportHeight() {
	// $(window) in firefox gave me different results??
	let windowHeight;
	if (DetectClient.isFirefox()) {
		windowHeight = window.outerHeight;
	} else {
		windowHeight = window.innerHeight;
	}
	return windowHeight - getInboxTop() - 4;
}

function resizeNodes() {
	console.log("resizeNodes");
	
	if (isDetached) {
		if (popupView == POPUP_VIEW_CHECKER_PLUS) {
			renderMoreAccountMails();
		} else {
			byId("tabletViewFrame").style.height = `${window.innerHeight - byId("tabletViewFrame").getBoundingClientRect().top - 10}px`;
		}
	}
}

function shouldWatermarkImage(skin) {
	//if (skin.name && skin.name.startsWith("[img:") && skin.author != "Jason") {
	if (skin.image && skin.author != "Jason") {
		return true;
	}
}

function addSkinPiece(id, css) {
	polymerPromise.then(() => {
		byId(id).append(css);
	});
}

function addSkin(skin, id) {
	if (!id) {
		id = "skin_" + skin.id;
	}
    byId(id)?.remove();

    const $body = document.body;
    
    $body.classList.add(id);
	
	let css = "";
	
	if (skin.image) {
		$body.classList.add("background-skin");

        let defaultBackgroundColorCSS = "";
		// normally default is black BUT if image exists than default is white, unless overwritten with text_color
		if (skin.text_color != "dark") {
            defaultBackgroundColorCSS = "background-color:black;";
            css += `
                html:not(.searchInputVisible) #inboxSection app-header-layout app-toolbar paper-icon-button:not(#menu),
                #topLeft,
                #searchIcon,
                #searchInput,
                #skinWatermark,
                .showMoreEmails {
                    color:white;
                }
            `;
        }

		var resizedImageUrl;
		if (/blogspot\./.test(skin.image) || /googleusercontent\./.test(skin.image)) {
			resizedImageUrl = skin.image.replace(/\/s\d+\//, "\/s" + parseInt($body.clientWidth) + "\/");
		} else {
			resizedImageUrl = skin.image;
		}
		
		//| += "[main] {background-size:cover;background-image:url('" + resizedImageUrl + "');background-position-x:50%;background-position-y:50%} [main] paper-toolbar {background-color:transparent} .accountHeader {background-color:transparent}";
		// Loading the background image "after" initial load for 2 reasons: 1) make sure it loads after the mails. 2) to trigger opacity transition
        addSkinPiece(id, `
            #inboxSection app-header-layout::before {
                opacity: 1;
                background-size: cover;
                background-image: url('${resizedImageUrl}');
                ${defaultBackgroundColorCSS}
                background-position-x: 50%;
                background-position-y: 50%;
            }
            #inboxSection app-header-layout app-toolbar#main-header-toolbar {
                background-color:transparent;
            }
            #inboxSection app-header-layout app-toolbar[default-color] {
                background-color: ${DEFAULT_SETTINGS.accountColorWithBackgroundImage} !important;
            }
        `);

		if (shouldWatermarkImage(skin)) {
            const $skinWatermark = byId("skinWatermark");
			$skinWatermark.classList.add("visible");
			$skinWatermark.textContent = skin.author;
			if (skin.author_url) {
				$skinWatermark.href = skin.author_url;
			} else {
				$skinWatermark.removeAttribute("href");
			}
		}
	}
	if (skin.css) {
		css += " " + skin.css;
	}
	
	addCSS(id, css);
}

function removeSkin(skin) {
    byId("skin_" + skin.id)?.remove();
    document.body.classList.remove("skin_" + skin.id);

	if (shouldWatermarkImage(skin)) {
		byId("skinWatermark").classList.remove("visible");
	}
}

function setSkinDetails($dialog, skin) {
	
    onClickReplace($dialog.querySelector("#skinCSS"), function(event) {
        const $textarea = document.createElement("textarea");
        $textarea.setAttribute("readonly", "");
        $textarea.style.cssText = "width:400px;height:200px";
		$textarea.textContent = skin.css;
		
		openGenericDialog({
			title: "Skin details",
			content: $textarea
		});

		event.preventDefault();
        event.stopPropagation();
	});

	show("#skinAuthorInner");

	if (skin.css) {
		$dialog.querySelector("#skinCSS").href = "#";
	} else {
		$dialog.querySelector("#skinCSS").removeAttribute("href");
	}
	
	$dialog.querySelector("#skinAuthor").textContent = skin.author;
	if (skin.author_url) {
		$dialog.querySelector("#skinAuthor").href = skin.author_url;
	} else {
		$dialog.querySelector("#skinAuthor").removeAttribute("href");
	}
}

function getSkin(skins, $paperItem) {
	return skins.find(skin => skin.id == $paperItem.getAttribute("skin-id"));
}

function maybeRemoveBackgroundSkin(skinsSettings) {
	const oneSkinHasAnImage = skinsSettings.some(skin => {
	   if (skin.image) {
		   return true;
	   }
   });

   if (!oneSkinHasAnImage) {
	   document.body.classList.remove("background-skin");
   }
}

function showSkinsDialog() {
	showLoading();
	
	Controller.getSkins().then(async skins => {
        const donationClickedFlag = await storage.get("donationClicked");
		
		var attemptedToAddSkin = false;
		
		const $dialog = initTemplate("skinsDialogTemplate");
		const $availableSkins = $dialog.querySelector("#availableSkins");
        emptyNode($availableSkins);

        if (!$availableSkins._attachedEvents) {
            onDelegate($availableSkins, "click", ".addButton", function(e) {
				attemptedToAddSkin = true;

				const $addButton = e.target;
				const $paperItem = $addButton.closest("paper-item");
				const skin = getSkin(skins, $paperItem);

                function preventPreview() {
					$paperItem.removeAttribute("focused");
					$paperItem.blur();

					e.preventDefault();
					e.stopImmediatePropagation();
                }

				byId("previewSkin")?.remove();

				if ($addButton.classList.contains("selected")) {
					console.log("remove skin: ", skin);
					$addButton.classList.remove("selected");
					$addButton.setAttribute("icon", "add");
					removeSkin(skin);
					skinsSettings.some(function (thisSkin, index) {
						if (skin.id == thisSkin.id) {
							skinsSettings.splice(index, 1);
							return true;
						}
					});

					maybeRemoveBackgroundSkin(skinsSettings);

					storage.set("skins", skinsSettings).then(() => {
						Controller.updateSkinInstalls(skin.id, -1);
					}).catch(error => {
						showError(error);
					});

                    preventPreview();
				} else if (donationClickedFlag) {
                    console.log("add skin");
                    $addButton.classList.add("selected");
                    $addButton.setAttribute("icon", "check");
                    addSkin(skin);
                    skinsSettings.push(skin);
                    storage.set("skins", skinsSettings).then(() => {
                        Controller.updateSkinInstalls(skin.id, 1);
                    }).catch(error => {
                        showError(error);
                    });
				} else {
                    openContributeDialog("skins");
                    preventPreview();
                }
            });

            onDelegate($availableSkins, "click", "paper-item", function(e) {
                const $paperItem = e.target.closest("paper-item");
                // patch to remove highlighed gray
                $paperItem.removeAttribute("focused");
                $paperItem.blur();

                byId("skinWatermark").classList.remove("visible");
                const skin = getSkin(skins, $paperItem);
                console.log("$paperItem", $paperItem);
                addSkin(skin, "previewSkin");
                setSkinDetails($dialog, skin);
                e.preventDefault();
                e.stopPropagation();
            });

            $availableSkins._attachedEvents = true;
        }

        const availableSkinsFragment = new DocumentFragment();
		skins.forEach(skin => {
			const paperItem = document.createElement("paper-item");
            paperItem.setAttribute("skin-id", skin.id);
            
			const skinAdded = skinsSettings.some(thisSkin => skin.id == thisSkin.id);
			
			const addButton = document.createElement("paper-icon-button");
			let className = "addButton";
			if (skinAdded) {
				className += " selected";
				addButton.setAttribute("icon", "check");
			} else {
				addButton.setAttribute("icon", "add");
			}
			addButton.setAttribute("class", className);
			addButton.setAttribute("title", "Add it");
			paperItem.appendChild(addButton);

			const textNode = document.createTextNode(skin.name);
			paperItem.appendChild(textNode);

			availableSkinsFragment.appendChild(paperItem);
        });
        $availableSkins.append(availableSkinsFragment);
        
        onClickReplace($dialog.querySelector(".resetSkins"), async function() {
            await storage.remove("skins");
            await storage.remove("customSkin");
            await storage.remove("popup-bg-color");
            await niceAlert(getMessage("reset"));
			location.reload();
		});
		
        onClickReplace($dialog.querySelector(".updateSkins"), async function() {
			skinsSettings.forEach(function(skinSetting) {
				skins.forEach(function(skin) {
					if (skinSetting.id == skin.id) {
						copyObj(skin, skinSetting);
						
						// refresh skin
						addSkin(skin);
					}
				});
			});
			await storage.set("skins", skinsSettings);
			showMessage(getMessage("done"));
		});

        const $backgroundColor = $dialog.querySelector("#background-color");
        $backgroundColor.setAttribute("color",  "#999");
        replaceEventListeners($backgroundColor, "color-changed", async e => {
            if (await donationClicked("background-color")) {
                const color = e.detail.value;
                setPopupBgColor(color);
                await storage.set("popup-bg-color", color);
                if (document.body.classList.contains("background-skin")) {
                    showMessage("Remove image to see background color.");
                }
            }
        });
		
        onClickReplace($dialog.querySelector(".customSkin"), async function() {
			byId("previewSkin")?.remove();
			
			const $dialog = initTemplate("customSkinDialogTemplate");

			const customSkin = await storage.get("customSkin");

			$dialog.querySelector("textarea").value = customSkin.css || "";
			$dialog.querySelector("#customBackgroundImageUrl").value = customSkin.image;

            onClickReplace($dialog.querySelector(".shareSkin"), function() {
				openUrl("https://jasonsavard.com/forum/categories/checker-plus-for-gmail-feedback?ref=shareSkin");
			});

            onClickReplace($dialog.querySelector(".updateSkin"), async function() {
				byId("customSkin")?.remove();
				addSkin({id:"customSkin", css: $dialog.querySelector("textarea").value, image: $dialog.querySelector("#customBackgroundImageUrl").value});
				if (!await storage.get("donationClicked")) {
					showMessage(getMessage("donationRequired"));
				}
			});
			
			openDialog($dialog).then(async function(response) {
				if (response == "ok") {
					if (donationClickedFlag) {
						customSkin.css = $dialog.querySelector("textarea").value;
						customSkin.image = $dialog.querySelector("#customBackgroundImageUrl").value;
						
						addSkin(customSkin);
						await storage.set("customSkin", customSkin);
					} else {
						$dialog.querySelector("textarea").value = "";
						removeSkin(customSkin);
						if (!donationClickedFlag) {
							showMessage(getMessage("donationRequired"));
						}
					}
					
					$dialog.close();
				}
			});
		});

		openDialog($dialog).then(async response => {
			if (response == "ok") {
				if (byId("previewSkin")) {
					byId("previewSkin").remove();

					maybeRemoveBackgroundSkin(skinsSettings);

					if (!attemptedToAddSkin) {
                        const content = new DocumentFragment();

                        const $icon = document.createElement("paper-icon-button");
                        $icon.setAttribute("icon", "add");
                        $icon.setAttribute("style", "vertical-align: middle");
                        
                        content.append("Use the", $icon, "to add skins!");

						openGenericDialog({
							content: content
						}).then(response => {
							if (response == "ok") {
								// make sure next time the skins dialog closes when clicking done
								$dialog.querySelector(".okDialog").setAttribute("dialog-confirm", "true");
							}
						});
						const $addButton = selector("#skinsDialog #availableSkins paper-item.iron-selected .addButton");
						$addButton.addEventListener("transitionend", () => {
							$addButton.classList.toggle("highlight");
						}, {once: true});
						$addButton.classList.toggle("highlight");
					} else {
						$dialog.close();
					}
					
				} else {
					$dialog.close();
				}
			}
		});

		hideLoading();

	}).catch(error => {
		console.error(error);
		showError("There's a problem, try again later or contact the developer!");
	});
}

async function resizeInboxPatch() {
    await sleep(1);
    hide("body");
    show("body");
    //hide().show(0); // must set parameter to 0
}

// ensure clearing timeout done after it's set (race condition)
function clearCloseWindowTimeout(withDelay) {
    setTimeout(() => {
        clearTimeout(closeWindowTimeout);
    }, withDelay ? 200 : 1);
}

async function init() {
    bgObjectsReady = await getBGObjects();

    document.body.classList.add(
        "ui-v2",
        await storage.get("displayDensity")
    );

    const _oneTimeReversePopupView = await storage.get("_oneTimeReversePopupView");
    const browserButtonAction = await storage.get("browserButtonAction");
	if (_oneTimeReversePopupView) {
		await storage.set("browserButtonAction", _oneTimeReversePopupView);
		storage.remove("_oneTimeReversePopupView");
	}
	if (browserButtonAction == BROWSER_BUTTON_ACTION_GMAIL_INBOX || browserButtonAction == BROWSER_BUTTON_ACTION_GMAIL_INBOX_POPOUT) {
		if (location.href.includes("noSignedInAccounts")) {
			popupView = POPUP_VIEW_TABLET;
		} else {
			if (await storage.get("unreadCount") === 0 && await storage.get("gmailPopupBrowserButtonActionIfNoEmail") == BROWSER_BUTTON_ACTION_CHECKER_PLUS) {
				popupView = POPUP_VIEW_CHECKER_PLUS;
			} else {
				popupView = POPUP_VIEW_TABLET;
			}
		}
	} else {
		if (location.href.includes("noSignedInAccounts")) {
			popupView = POPUP_VIEW_CHECKER_PLUS;
		} else {
            const checkerPlusBrowserButtonActionIfNoEmail = await storage.get("checkerPlusBrowserButtonActionIfNoEmail");
			if (await storage.get("unreadCount") === 0 && (checkerPlusBrowserButtonActionIfNoEmail == BROWSER_BUTTON_ACTION_GMAIL_INBOX || checkerPlusBrowserButtonActionIfNoEmail == BROWSER_BUTTON_ACTION_GMAIL_INBOX_POPOUT)) {
				popupView = POPUP_VIEW_TABLET;
			} else {
				popupView = POPUP_VIEW_CHECKER_PLUS;
			}
		}
	}
    
    console.log("view: " + popupView);

    // resizepopup requires popupView to be declared is delcared
    // must use await, refer to this issue within resizePopup: "height of the window would be small when rendering and so not all emails would render"
    await resizePopup();
    
	var $body = document.body;

    // had to move this up in the code or else scrollbars were appearing regardless
    new Promise(async (resolve, reject) => {
        // should have prefected getZoomFactor before ready, if not do it again, but might have FOUC
        if (!zoomFactor) {
            zoomFactor = await getZoomFactor();
        }
        resolve();
    }).then(() => {
		if (fromToolbar && zoomFactor > 1) {
            css($body, {
                "width": `${MAX_POPUP_WIDTH / zoomFactor}px`,
                "height": `${MAX_POPUP_HEIGHT / zoomFactor}px`
            });
		}
    });

	if (fromToolbar) {
		htmlElement.classList.add("fromToolbar");
    }
	
	$body.classList.add(await storage.get("accountAddingMethod"));

	if (DetectClient.isMac()) {
		$body.classList.add("mac");
	}
	
	if (getMessage("dir") == "rtl") {
		selector("app-drawer").setAttribute("align", "end");

		// patch for incomplete transition
		selectorAll(".page").forEach(el => el.classList.add("disableTransition"));
    }

    const scrollArea = selector("#inboxSection app-header-layout");
    addMyScrollbars(scrollArea, scrollArea.shadowRoot);

    if (skinsSettings) {
		//pageVisible.then(() => {
			skinsSettings.forEach(skin => {
				addSkin(skin);
			});
			addSkin(await storage.get("customSkin"));

			const popupBgColor = await storage.get("popup-bg-color");
			setPopupBgColor(popupBgColor);
		//});
    }

    // Had to move this code here for some reason (probably before polymer loaded)
    if (accounts.length >= 2) {
        show("#menu");

        if (await storage.get("drawer") != "closed") {
            drawerIsVisible = true;
            selector("app-drawer-layout").removeAttribute("force-narrow");
            if (DetectClient.isFirefox()) {
                byId("drawerPanel").setAttribute("opened", "true");
            }
            setTimeout(() => {
                selector("app-drawer-layout").classList.add("delay");
            }, 1500);
        }
    }
    
	if (!await storage.get("donationClicked")) {
		$body.classList.add("donationNotClicked");

        const CONTRIBUTE_SELECTOR = "[contribute]";
        onDelegate(document.body, "mouseenter", CONTRIBUTE_SELECTOR, function(e) {
			const $donationRequired = byId("donationRequired");

            let $contributeItem = e.target;
            if (!$contributeItem.matches(CONTRIBUTE_SELECTOR)) {
                $contributeItem = $contributeItem.closest(CONTRIBUTE_SELECTOR);
            }
			
			let left;
			const SPACING = 15;

            show($donationRequired);

			if (getMessage("dir") == "rtl") {
				left = $contributeItem.getBoundingClientRect().left + $contributeItem.getBoundingClientRect().width + SPACING;
			} else {
				left = $contributeItem.getBoundingClientRect().left - $donationRequired.clientWidth - SPACING;
			}
			css($donationRequired, {
                left: `${left}px`,
                top: `${$contributeItem.getBoundingClientRect().top + 5}px`
            });
		}, true);
        
        onDelegate(document.body, "mouseleave", CONTRIBUTE_SELECTOR, function(e) {
            const $contributeItem = e.target;
            if ($contributeItem.matches(CONTRIBUTE_SELECTOR)) {
                hide("#donationRequired");
            }
		}, true);
	}
	
	if (isDetached) {
		htmlElement.classList.add("detached");
		resizeNodes();
	}

	// do this right away to skip the transition when calling openEmail
	if (previewMailId && (await storage.get("browserButtonAction") != BROWSER_BUTTON_ACTION_GMAIL_INBOX && await storage.get("browserButtonAction") != BROWSER_BUTTON_ACTION_GMAIL_INBOX_POPOUT)) {
        document.body.classList.add("page-loading-animation");
        
        selectorAll(".page").forEach(el => {
            el.classList.add("disableTransition");
            el.classList.remove("active");
        });
        // commented because it was causing incomplete transition https://jasonsavard.com/forum/discussion/5149/issue-with-checker-gmails-popup-ignoring-mouse-v21-5-1-v21-5-2
        //$("#openEmailSection").classList.add("active");
	} else if (location.href.includes("action=getUserMediaDenied") || location.href.includes("action=getUserMediaFailed")) {
		polymerPromise2.then(function() {
			setTimeout(function() {
				const params = {};
				
				const accountEmail = getUrlValue("accountEmail");
				params.account = getAccountByEmail(accountEmail);
				params.skipAnimation = true;
				
				if (getUrlValue("mediaType") == "voiceEmail") {
					params.voiceEmail = true;
				} else {
					params.videoEmail = true;
				}
				
				openComposeSection(params);
			}, 1)
		});
	}
	
    window.addEventListener("resize", function() {
		console.log("window.resize");
		if (windowOpenTime.diffInSeconds() > -1) {
			console.log("skip resize - too quick");
		} else {
			// in firefox this would loop alot and crash
			if (DetectClient.isChromium()) {
				resizeNodes();
			}
		}
	});
	
	resizeFrameInExternalPopup();

    [
        "showArchive",
        "showSpam",
        "showDelete",
        "showMoveLabel",
        "showMarkAsRead",
        "showArchiveAll",
        "showMarkAllAsSpam",
        "showMarkAllAsRead",
        "showMarkAsUnread",
        "showReply",
        "showOpen",
        "showAddToCalendar",
        "showListenToEmail"
    ].forEach(setting => {
        storage.get(setting).then(enabled => {
            if (!enabled) {
                $body.classList.add(setting.replace("show", "hide"));
            }
        });
    });

    // must use same "event" ie. mouseup as mail actions
    document.body.addEventListener("mouseup", () => {
        clearCloseWindowTimeout(true);

        // reset interval everytime user clicks in popup
        if (isDetached) {
            clearInterval(renderAccountsInterval);
            renderAccountsInterval = setIntervalSafe(() => {
                renderAccounts();
            }, seconds(30));
        }
    })

    document.body.addEventListener("keydown", function(e) {
        //console.log("key: ", e);

        if (e.key == "Escape") {
            const $dialog = e.target.closest("paper-dialog");
            if ($dialog) {
                $dialog.close();
                e.preventDefault();
            } else {
                // ignore and Chrome close window
            }        
        } else if (isFocusOnInputElement()) {
            //return true;
        } else {
            const $selectedMail = selector(".mail");
            
            initInboxMailActionButtons($selectedMail);
            
            if (e.key == 'c' && !isCtrlPressed(e)) {
                selector(".account").querySelector(".compose").dispatchEvent(new Event("mouseup"));
            } else if (e.key == 'o' || e.key == "Enter") {
                if (!isComposeView()) {
                    if ($selectedMail) { // found unread email so open the email
                        if (e.key == "Enter") {
                            // enter toggles between preview mode
                            if (isEmailView()) {
                                //openInbox();
                            } else {
                                $selectedMail.dispatchEvent(new Event("mouseup"));
                            }
                        } else {
                            $selectedMail.querySelector(".openMail").dispatchEvent(new Event("mouseup"));
                        }
                    } else { // no unread email so open the inbox instead
                        executeAccountAction(accounts[0], "openInbox");
                        closeWindow({source:"openInboxShortcutKey"});
                    }
                }
            } else if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
                if (isEmailView()) {
                    openInbox();
                } else {
                    $selectedMail.dispatchEvent(new Event("mouseup"));
                }
            } else if (e.key == 'j') { // next/down
                if (isEmailView()) {
                    byId("nextMail").click();
                }
            } else if (e.key == 'k') { // prev/up
                if (isEmailView()) {
                    byId("prevMail").click();
                }
            } else if (e.key == '#') { // delete
                if (isEmailView()) {
                    byId("delete").click();
                } else {
                    $selectedMail.querySelector(".delete").dispatchEvent(new Event("mouseup"));
                }
            } else if (e.key == 'e') { // archive
                if (isEmailView()) {
                    byId("archive").click();
                } else {
                    $selectedMail.querySelector(".archive").dispatchEvent(new Event("mouseup"));
                }
            } else if (e.key == '!') { // spam
                if (isEmailView()) {
                    byId("markAsSpam").click();
                } else {
                    $selectedMail.querySelector(".markAsSpam").dispatchEvent(new Event("mouseup"));
                }
            } else if (e.key == 's') { // star
                if (isEmailView()) {
                    selector("#openEmail .star").dispatchEvent(new Event("mouseup"));
                } else {
                    $selectedMail.querySelector(".star").dispatchEvent(new Event("mouseup"));
                }
            } else if (e.key == 'v' && !isCtrlPressed(e)) { // move
                if (isEmailView()) {
                    byId("moveLabel").click();
                }
            // r = reply (if setting set for this)
            } else if ((keyboardException_R == "reply" && !isCtrlPressed(e) && e.key == 'r') || (!isCtrlPressed(e) && e.key == 'a')) {
                if ($selectedMail) {
                    function clickReplyArea(e) {
                        if (e.key == 'r') {
                            byId("replyArea").removeAttribute("replyAll");
                        } else {
                            byId("replyArea").setAttribute("replyAll", "true");
                        }
                        byId("replyArea").click();

                    }

                    if (isEmailView()) {
                        clickReplyArea(e);
                    } else {
                        $selectedMail.dispatchEvent(new Event("mouseup"));
                        byId("openEmailSection").addEventListener("transitionend", function(e) {
                            setTimeout(() => {
                                clickReplyArea(e);
                            }, 1);
                        }, {once: true});
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            } else if (e.key == 'I' || (keyboardException_R == "markAsRead" && e.key == 'r')) {
                if (isEmailView()) {
                    byId("markAsRead").click();
                } else {
                    $selectedMail.querySelector(".markAsRead").dispatchEvent(new Event("mouseup"));
                }
            } else if (e.key == "?") {
                maxHeightOfPopup();
                openDialog("keyboardShortcutDialogTemplate").then(response => {
                    if (response == "other") {
                        openUrl("https://jasonsavard.com/wiki/Keyboard_shortcuts?ref=gmailShortcutDialogMoreInfo");
                    }
                });
            } else if (isCtrlPressed(e) && e.key == 'r') {
                refresh();
                e.preventDefault();
                e.stopPropagation();
            } else {
                if (e.key == "Control") {
                    // ignore
                } else {
                    console.warn("key not recognized: ", e);
                }
            }
        }
    });
	
	onClick("#titleClickArea", async function() {
		if (await storage.get("clickingCheckerPlusLogo") == "openHelp") {
			openUrl("https://jasonsavard.com/wiki/Checker_Plus_for_Gmail?ref=GmailChecker");
		} else {
            await sendMessageToBG("openGmail");
			closeWindow({source:"titleClickArea"});
		}
	});

	if (await storage.get("removeShareLinks")) {
		// hide actual share button
        const shareButtons = selectorAll(".share-button");
		shareButtons.forEach(el => el.closest("paper-menu-button")?.remove());
		// hide share button (placeholder)
		removeAllNodes(shareButtons);
	}

    const $shareButton = selector(".share-button-real .share-button");
    if ($shareButton) {
        $shareButton.addEventListener("mouseup", function() {
            maxHeightOfPopup();
        });
    
        $shareButton.addEventListener("click", async function() {
            await storage.enable("followMeClicked");
            initTemplate("shareMenuItemsTemplate");
            
            onClick("#share-menu paper-item", event => {
                const value = event.currentTarget.id;
                sendGA('shareMenu', value);
                
                if (value == "facebook") {
                    openUrl("https://www.facebook.com/thegreenprogrammer");
                } else if (value == "twitter") {
                    openUrl("https://twitter.com/JasonSavard");
                } else if (value == "linkedin") {
                    openUrl("https://www.linkedin.com/in/jasonsavard");
                } else if (value == "email-subscription") {
                    openUrl("https://jasonsavard.com/blog/?show-email-subscription=true");
                }
            });
        }, {once: true});
    }

	onClick("#refresh", function() {
        // double click
        if (window.lastRefresh && Date.now() - window.lastRefresh.getTime() <= 800) {
            refresh(true);
        } else {
            refresh();
        }
        window.lastRefresh = new Date();
	});

    addEventListeners("#maximize", "mouseup", async function(e) {
		if (isCtrlPressed(e)) {
            const createWindowParams = await getPopupWindowSpecs({
                width: await storage.get("popupWidth"),
                height: await storage.get("popupHeight"),
                url: chrome.runtime.getURL("popup.html"),
            })
            const newWindow = await createWindow(createWindowParams);
            await storage.set(LS_POPUP_WINDOW_ID, newWindow.id);
            closeWindow({source:"maximize"});
		} else {
			var currentAccount;
			if (currentTabletFrameEmail) {
				currentAccount = getAccountByEmail(currentTabletFrameEmail);
			}

            const actionParams = {};
            if (openGmailInNewTab) {
                actionParams.openInNewTab = true;
            }

			if (currentAccount) {
                const tabletViewUrl = await storage.get("tabletViewUrl");

				if (tabletViewUrl) {
					const messageId = extractMessageIdFromOfflineUrl(tabletViewUrl);
					if (messageId) {
                        actionParams.messageId = messageId;
                        executeAccountAction(currentAccount, "openMessageById", actionParams);
					} else { // NOT viewing a message, probably in the inbox or something
                        executeAccountAction(currentAccount, "openInbox", actionParams);
					}
				} else {
                    executeAccountAction(currentAccount, "openInbox", actionParams);
				}
			} else {
                await sendMessageToBG("openGmail", actionParams);
			}
			sendGA("maximize", "click");
			closeWindow({source:"maximize"});
		}
	});
	
	if (await storage.get("quickComposeEmail")) {
		const quickComposeEmailAlias = await storage.get("quickComposeEmailAlias");
		if (quickComposeEmailAlias) {
            polymerPromise.then(() => {
                byId("quickContactLabel").textContent = quickComposeEmailAlias;
            });
		}
		
		const contactPhotoParams = {
            useNoPhoto: true,
            account: accounts[0],
            email: await storage.get("quickComposeEmail")
        };
		const $imageNode = byId("quickContactPhoto");
		setContactPhoto(contactPhotoParams, $imageNode);
	}
	
	onClick("#quickContact", async function() {
        await openQuickCompose();
        closeWindow();
	});
	
    onClick("#compose", function() {
        selector(".account").querySelector(".compose").dispatchEvent(new Event("mouseup"));
    });
	
    addEventListeners("#mainOptions", "mouseup", function() {
		maxHeightOfPopup();
	});
	
	// must use .one because we don't want to queue these .click inside (was lazy and didn't want to code .off .on :)
	byId("mainOptions").addEventListener("click", function() {
		maxHeightOfPopup();
		
		onClick(".switchView", function() {
            closeMenu(this);
            
            const permissionsObj = {permissions: ["webRequest", "webRequestBlocking"]};
            chrome.permissions.request(permissionsObj, async granted => {
                if (granted) {
                    reversePopupView(true);
                    renderMoreAccountMails();
                } else {
                    showError("Problem with permission for inbox view")
                }
            });
		});
		
		initSwitchMenuItem();
		
		onClick(".popout", function() {
			openUrl(getPopupFile());
		});
		
		onClick(".dnd", function() {
            const $dialog = initTemplate("dndDialogTemplate");
            const $radioButtons = $dialog.querySelectorAll("paper-radio-button");
            
            $radioButtons.forEach((el, index) => {
                replaceEventListeners(el, "change", function(event) {
                    const value = event.target.getAttribute("name");
                    if (value == "today") {
                        setDND_today();
                    } else if (value == "indefinitely") {
                        setDND_indefinitely();
                    } else {
                        setDND_minutes(value);
                    }
                    setTimeout(() => {
                        closeWindow();
                    }, 200);
                });
            });

            openDialog($dialog).then(response => {
                if (response == "ok") {
                    // nothing
                } else if (response == "other") {
                    openDNDScheduleOptions();
                } else if (response != "cancel") {
                    openDNDOptions();
                }
            });
            
            closeMenu(this);
        });
		
        onClick(".dndOff", function() {
            setDND_off();
            
            // wait for message sending to other extension to sync dnd option
            setTimeout(() => {
                closeWindow();
            }, 10);
        });

		isDNDbyDuration().then(DNDflag => {
            if (DNDflag) {
                hide(".dnd");
            } else {
                hide(".dndOff");
            }
        });
			
		onClick(".displayDensity", async function() {
			closeMenu(this);
			
			const $dialog = initTemplate("displayDensityDialogTemplate");
			const $radioButtons = $dialog.querySelectorAll("paper-radio-button");
			
			$dialog.querySelector("paper-radio-group").setAttribute("selected", await storage.get("displayDensity"));
			
            $radioButtons.forEach((el, index) => {
                replaceEventListeners(el, "change", function(event) {
                    const value = event.target.getAttribute("name");
                    storage.set("displayDensity", value);
                    
                    //location.reload();
                    document.body.classList.remove("comfortable", "cozy", "compact")
                    document.body.classList.add(value);
                    
                    resizeInboxPatch();
                });
            });
			
			openDialog($dialog);
		});
		
		onClick(".skins", function() {
            closeMenu(this);
            showSkinsDialog();
            sendGA('topbar', 'skins');
        });

		onClick(".options", function() {
			openUrl("options.html?ref=popup");
		});

		onClick(".changelog", async function() {
            await storage.remove("_lastBigUpdate");
            openChangelog("GmailCheckerOptionsMenu");
		});

		onClick(".contribute", function() {
			openUrl("contribute.html?ref=GmailCheckerOptionsMenu");
		});

		onClick(".discoverMyApps", function() {
			openUrl("https://jasonsavard.com?ref=GmailCheckerOptionsMenu");
		});

		onClick(".feedback", function() {
			openUrl("https://jasonsavard.com/forum/categories/checker-plus-for-gmail-feedback?ref=GmailCheckerOptionsMenu");
		});

		onClick(".followMe", function() {
			openUrl("https://jasonsavard.com/?followMe=true&ref=GmailCheckerOptionsMenu");
		});

		onClick(".aboutMe", function() {
			openUrl("https://jasonsavard.com/about?ref=GmailCheckerOptionsMenu");
		});

		onClick(".help", function() {
			openUrl("https://jasonsavard.com/wiki/Checker_Plus_for_Gmail?ref=GmailCheckerOptionsMenu");
		});
	}, {once: true});
	
	onClick(".close", function() {
		window.close();
	});
	
	if (await daysElapsedSinceFirstInstalled() >= UserNoticeSchedule.DAYS_BEFORE_SHOWING_FOLLOW_ME && !await storage.get("followMeClicked")) {
        let expired = false;
        const followMeShownDate = await storage.get("followMeShownDate");
		if (followMeShownDate) {
			if (followMeShownDate.diffInDays() <= -UserNoticeSchedule.DURATION_FOR_SHOWING_FOLLOW_ME) {
				expired = true;
			}
		} else {
			storage.setDate("followMeShownDate");
		}
		if (!expired) {
			selector(".share-button-real .share-button")?.classList.add("swing");
		}
	}

	polymerPromise.then(async () => {
        const $newsNotification = byId("newsNotification");
        const $newsNotificationReducedDonationMessage = byId("newsNotificationReducedDonationMessage")

		if (await shouldShowExtraFeature()) {
            $newsNotification.setAttribute("icon", "myIcons:theme");
            onClick($newsNotification, () => {
                maxHeightOfPopup();
                showSkinsDialog();
            });
            show($newsNotification);
            $newsNotificationReducedDonationMessage.textContent = getMessage("addSkinsOrThemes");
            show($newsNotificationReducedDonationMessage);
		} else if (await shouldShowReducedDonationMsg(true)) {
            onClick($newsNotification, () => {
                openUrl("contribute.html?ref=reducedDonationFromPopup");
            });
            show($newsNotification);
            show($newsNotificationReducedDonationMessage);
		} else if (await storage.get("_lastBigUpdate")) {
            onClick($newsNotification, async () => {
                await storage.remove("_lastBigUpdate");
                openChangelog("bigUpdateFromPopupWindow")
            });
            show($newsNotification);
            show("#newsNotificationBigUpdateMessage");
        }
	});

	getDNDState().then(dndState => {
		if (dndState) {
            const DND_CLASSNAME = "dnd-enabled";
            document.body.classList.add(DND_CLASSNAME);

			polymerPromise2.then(() => {
				showMessage(getMessage("DNDisEnabled"), {
					text: getMessage("turnOff"),
					onClick: () => {
						setDND_off();
                        document.body.classList.remove(DND_CLASSNAME);
						hideMessage();
					}
				});
			});
		}
    });
    
    if (await isAnAccountCheckingSpam()) {
        showBackToInboxMessage();
    }
	
	// FYI whole block below used to be above document.ready
	await polymerPromise;

	document.body.removeAttribute("jason-unresolved");

    sendMessageToBG("stopAllSounds");
	
    if (isDetached
        && !await storage.get("popoutMessage")
        && !previewMailId
        && !location.href.includes("action=getUserMediaDenied")
        && !location.href.includes("action=getUserMediaFailed")
        && !location.href.includes("source=grantedAccess")) {
		polymerPromise2.then(async () => {
			const $dialog = initTemplate("popoutDialogTemplate");
			const response = await openDialog($dialog);
            if (response != "ok") {
                openUrl("https://jasonsavard.com/wiki/Popout?ref=gmailPopoutDialog");
                $dialog.close();
            }
			storage.enable("popoutMessage");
		});
	}
	
	initPopupView();

	onClick("#menu", function() {
		const drawerLayout = selector("app-drawer-layout");

		if ((drawerLayout.forceNarrow || !drawerLayout.narrow)) {
			drawerLayout.forceNarrow = !drawerLayout.forceNarrow;
		}

		if (drawerLayout.drawer.opened) {
			drawerLayout.drawer.close();
			storage.set("drawer", "closed");
		} else {
			drawerLayout.drawer.open();
			storage.set("drawer", "open");
		}
	});
	
    addEventListeners("#searchInput", "blur", function() {
        htmlElement.classList.remove("searchInputVisible");
    });

    addEventListeners("#searchInput", "keydown", function(e) {
        if (e.key == "Enter" && !e.isComposing) {
            const account = e.target._account;
            executeAccountAction(account, "openSearch", {actionParams: e.target.value});
            closeWindow({source:"onlyMailAndInPreview"});
        }
    });

	if (accounts.length == 0 || (accounts.length == 1 && accounts[0].error && accounts[0].error != "timeout" && accounts[0].getMailUrl().includes("/mail/"))) {
        if (await isOnline()) {
            let $dialog;

            const mustUseAddAccount = accounts.some(account => account.errorCode == JError.CANNOT_ENSURE_MAIN_AND_INBOX_UNREAD);
            const accountsSummary = await getAccountsSummary(accounts);
    
            polymerPromise2.then(async () => { // polymerPromise2 required to fix paper-dialog-scrollable issue with 0 height

                if (accountAddingMethod == "autoDetect" && !await hasGmailHostPermission()) {
                    await openDialog("hostPermissionsDialogTemplate");
                    openUrl("options.html#accounts");
                } else {
                    if (accountAddingMethod == "autoDetect" && !mustUseAddAccount) {
                        $dialog = initTemplate("signInTemplate");
                    } else {
                        $dialog = initTemplate("addAccountTemplate");
                    }
        
                    if (accounts.length == 1 && accounts.first().error) {
                        if (accounts.first().getError().niceError && !/error/i.test(accounts.first().getError().niceError)) {
                            $dialog.querySelector("#signInError").textContent = accounts.first().getError().niceError;
                        } else {
                            $dialog.querySelector("#signInError").textContent = getMessage("networkProblem");
                        }
                        $dialog.querySelector("#signInErrorInstructions").textContent = accounts.first().getError().instructions;
                    } else {
                        console.log("accountsSummary", accountsSummary);
                        if (accountAddingMethod == "autoDetect") {
                            if (accountsSummary.allSignedOut) {
                                $dialog.querySelector("#signInError").textContent = "Must sign in!";
                            } else {
                                if (accountsSummary.firstNiceError) {
                                    $dialog.querySelector("#signInError").textContent = accountsSummary.firstNiceError;
                                } else {
                                    $dialog.querySelector("#signInError").textContent = getMessage("networkProblem");
                                }
                            }
                        } else {
                            $dialog.querySelector("#signInError").textContent = "Must add an account!";
                        }
                    }
        
                    if (accountAddingMethod == "autoDetect" && !mustUseAddAccount) {
                        openDialog($dialog).then(response => {
                            if (response == "ok") {
                                openUrl(Urls.SignOut);
                            } else if (response == "other") {
                                openUrl("https://jasonsavard.com/wiki/Auto-detect_sign_in_issues");
                            } else if (response == "other2") {
                                $dialog.close();
                                refresh().then(() => {
                                    if (accounts.length == 0 || getAccountsWithErrors(accounts).length) {
                                        location.reload();
                                    }
                                });
                            } else {
                                openUrl("options.html#accounts");
                            }
                        }).catch(error => {
                            showError("error: " + error);
                        });
                    } else {
                        openDialog($dialog).then(response => {
                            if (response == "ok") {
                                let url = "options.html";
                                if (mustUseAddAccount) {
                                    url += "?highlight=addAccount";
                                }
                                url += "#accounts";
                                openUrl(url);
                            } else {
                                $dialog.close();
                                refresh().then(() => {
                                    location.reload();
                                });
                            }
                        }).catch(error => {
                            showError("error: " + error);
                        });
                    }
                }
            });
        }
	} else {
        console.time("renderAccounts");
        await renderAccounts();
        console.timeEnd("renderAccounts");

        // patch for https://jasonsavard.com/forum/discussion/comment/22430#Comment_22430
        // patch2 above
        if (selector("#inboxSection app-header-layout").clientHeight < document.body.clientHeight) {
            console.info("Brave patch");
            //console.info($("#inboxSection app-header-layout").height())
            //console.info(document.body.height())
            await sleep(1);
            resizeInboxPatch();
        }
		
		if (previewMailId && (await storage.get("browserButtonAction") != BROWSER_BUTTON_ACTION_GMAIL_INBOX && await storage.get("browserButtonAction") != BROWSER_BUTTON_ACTION_GMAIL_INBOX_POPOUT)) {
			var mail = findMailById(previewMailId);
			openEmail({mail:mail});
		}
	}

	// patch for mac issue popup clipped at top ref: https://bugs.chromium.org/p/chromium/issues/detail?id=428044
	// must make sure rendermoreaccounts still works
	// v3 commented in Chrome 66 because was showing vertical scroll bars
	// v2 add code here after rendering accounts
	// v1 settimeout in resizePopup when changing height
	/*
	if (DetectClient.isMac()) {
		let h = $("body").height();
		$("body").height(h + 1);
	}
	*/
	window.addEventListener("unload", function() {
		if (mouseHasEnteredPopupAtleastOnce) {
            // temporarily register to localstorage for synchronous and then move it to storage area
            localStorage["_lastCheckedEmail"] = new Date();
		}
		sendMessageToBG("stopAllSounds");
	});
	
    document.body.addEventListener("mousemove", function () {
		mouseInPopup = true;
		if (!mouseHasEnteredPopupAtleastOnce) {
			console.log("stop any speaking")
			sendMessageToBG("stopAllSounds");
		}
		mouseHasEnteredPopupAtleastOnce = true;
	}, {passive: true});

    document.body.addEventListener("mouseout", function () {
		mouseInPopup = false;
	}, {passive: true});
	
	polymerPromise2.then(function () {
		var currentlyRenderingMails = false;
		// getInboxScrollTarget() works for polymer
		// #inboxSection app-drawer-layout works when I use overflow-y:scroll
		// patch need to add (#inboxSection app-drawer-layout) because when i set the hasVerticalScrollbars ... {overflow-y:scroll} then the polymer scroll event does not trigger anymore so default

        [getInboxScrollTarget(), selector("#inboxSection app-drawer-layout")].forEach(el => {
            el.addEventListener("scroll", function(e) {
                const target = e.target;
                if (target.scrollTop != 0) {
                    if (!currentlyRenderingMails) {
                        currentlyRenderingMails = true;
                        renderMoreAccountMails();
                        currentlyRenderingMails = false;
                    }
                }
            });
        });
	});

    polymerPromise2.then(function () {
        storage.clearCache();
    });

	/*
	var accountsTemplate = document.querySelector('#accountsTemplate');
	if (accountsTemplate) {
		// template-bound event is called when an auto-binding element is ready
		accountsTemplate.addEventListener('template-bound', function () {
			console.log("accounts template-bound")
			
			setMailDetails(accounts, $(".mail"));
		});
		
		syncMails();
		
		accountsTemplate.accounts = accounts;
	}
	*/

	const autoSaveObj = await storage.get("autoSave");
	if (autoSaveObj?.message) {
		polymerPromise2.then(() => {
			const $dialog = initTemplate("draftSavedTemplate");
			const $draftSavedTextarea = $dialog.querySelector("#draftSavedTextarea");
			$draftSavedTextarea.value = autoSaveObj.message;
			
			// delay after loading poymer or else dialog would not center properly
			setTimeout(() => {
				openDialog($dialog).then(response => {
					console.log("response: " + response);
					if (response == "ok") {
						$draftSavedTextarea.focus();
						$draftSavedTextarea.select();
						if (document.execCommand('Copy')) {
							$dialog.close();
							showMessage(getMessage("done"));
						} else {
							niceAlert("Please select the text and right click > Copy");
						}
					}
					storage.remove("autoSave");
					// v2: autoclosedisable had nothing to do with it, the issue was related to putting span tags inside the cancel and ok buttons (don't do that, just put text). v1:because i set autoCloseDisabled="true" we have to explicitly close the dialog
					//$dialog.close();
				}).catch(error => {
					showError("error: " + error);
				});
            }, 1) // 800 before
        });
    }
    
    // Delay some
    requestIdleCallback(() => {
        const $optionsMenu = initTemplate("optionsMenuItemsTemplate");
        initMessages("#options-menu *");
    }, {
        timeout: seconds(2)
    });

    requestIdleCallback(() => {
        storage.setDate("_lastClickedButtonIcon").then(() => {
            sendMessageToBG("updateBadge");
        });
    }, {
        timeout: seconds(1)
    });

    if (!await isOnline()) {
        showError(getMessage("yourOffline"));
    }
}

console.time("init");
init().then(() => {
	console.timeEnd("init");
});

window.onpopstate = function(event) {
	console.log("pop", location.href, event.state);
	if (!event.state || event.state.openInbox) {
		openInbox();
	}
};