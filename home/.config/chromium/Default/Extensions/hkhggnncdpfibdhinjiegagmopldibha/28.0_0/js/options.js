var playing;
var justInstalled = getUrlValue(location.href, "action") == "install";
var userResponsedToPermissionWindow;
var donationClickedFlagForPreventDefaults;
let calendarMap;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.info("message rec", message);
    if (message.command == "featuresProcessed") {
        donationClickedFlagForPreventDefaults = true;
        $("[mustDonate]").each(function(i, element) {
            $(this).removeAttr("mustDonate");
        });
        sendResponse();
    } else if (message.command == "grantPermissionToCalendars") {
        showLoading();
        userResponsedToPermissionWindow = true;
        sendResponse();
    } else if (message.command == "grantPermissionToCalendarsAndPolledServer") {
        postGrantedPermissionsToCalendarsAndPolledServer(message.email);
        sendResponse();
    }
});

function reloadExtension() {
	if (chrome.runtime.reload) {
		chrome.runtime.reload();
	} else {
		niceAlert("You must disable/re-enable the extension in the extensions page or restart the browser");
	}
}

function firefoxPatchForCheckbox($node) {
	// patch for firefox missing checkbox outline
	if (DetectClient.isFirefox()) {
		if (!$node) {
			$node = $("paper-checkbox");
		}
		$node.each(function () {
			let shadowRoot = getShadowRoot($(this));
			shadowRoot.find("#checkbox").addClass("style-scope paper-checkbox");
			shadowRoot.find("#checkmark").addClass("style-scope paper-checkbox");
		});
	}
}

async function waitForStorageSync() {
    await sleep(200);
}

async function initPage(tabName) {
	console.log("initPage: " + tabName);
	if (!$("#" + tabName + "Page").length) {
		initTemplate(tabName + "PageTemplate");

		firefoxPatchForCheckbox();
		
		// patch for mac: because polymer dropdowns default values were not correctly populating
		setTimeout(() => {
			if (DetectClient.isFirefox()) {
				$("[hide-from-firefox]").remove();
			}
			initPaperElement($("#" + tabName + "Page [storage], #" + tabName + "Page [permissions]"));
		}, 1);

		$(".grantAccessButton, #grantAccessAgain").off().click(async () => {
			if (supportsChromeSignIn()) {
				await openPermissionsDialog();
                postGrantedPermissionsToCalendarsAndPolledServer(await storage.get("email"));
			} else {
                requestPermission({ useGoogleAccountsSignIn: true });
			}
		});

		if (tabName == "welcome") {
			const navLang = await storage.get("language");
			if ($("#lang").find("[value='" + navLang + "']").exists()) {
				$("#lang")[0].selected = navLang;
			} else if ($("#lang").find("[value='" + navLang.substring(0, 2) + "']").exists()) {
				$("#lang")[0].selected = navLang.substring(0, 2);
			} else {
				$("#lang").val("en");
			}

			$("#lang paper-item").click(async function () {
                try {
                    delete window.initMiscPromise;
                    await initUI();
                    await sendMessageToBG("resetInitMiscWindowVars");
                    await sendMessageToBG("checkEvents", {ignoreNotifications: true});
                } catch (error) {
                    showError(error);
                }
			});

			$("#notificationsGuide").click(function () {
				showOptionsSection("notifications");
				sendGA("guide", "notifications");
			});
		} else if (tabName == "notifications") {

			loadVoices();
			// seems we have to call chrome.tts.getVoices twice at a certain 
			if (DetectClient.isLinux()) {
				setTimeout(function () {
					loadVoices();
				}, seconds(1));
			}
			
			// placeholder for calendar-reminders

			if (await storage.get("notificationVoice")) {
				$("#voiceOptions").show();
			} else {
				$("#voiceOptions").hide();
			}

			$("#notificationVoice").on("click", "paper-item", function () {
				var voiceName = $("#voiceMenu")[0].selected;
				//var voiceName = $(this).val(); // commented because .val would not work for non-dynamically values like addVoice etc.

				if (voiceName) {
					if (voiceName == "addVoice") {
						openUrl("https://jasonsavard.com/wiki/Voice_Notifications");
					} else {

						if (voiceName.includes("Multilingual TTS Engine")) {
							$("#pitch, #rate").attr("disabled", "true");
						} else {
							$("#pitch, #rate").removeAttr("disabled");
						}

						playVoice();
					}
					$("#voiceOptions").fadeIn();
				} else {
					$("#voiceOptions").hide();
				}
			});

			$("#playVoice").click(function () {
				chrome.runtime.sendMessage({command: "chromeTTS", isSpeaking:true}, isSpeaking => {
                    if (isSpeaking) {
                        chrome.runtime.sendMessage({command: "chromeTTS", stop:true});
                        $("#playVoice").attr("icon", "av:stop");
                    } else {
                        playVoice();
                    }
                });
			});

			$("#voiceOptions paper-slider").on("change", async function () {
				await waitForStorageSync();
                playVoice();
			});

			$("#runInBackground").click(function () {
				var that = this;
				// timeout to let permissions logic determine check or uncheck the before
				setTimeout(function () {
					if (that.checked) {
						openDialog("runInBackgroundDialogTemplate");
					}
				}, 1);
			});

			if (await storage.get("notificationSound")) {
				$("#soundOptions").show();
			} else {
				$("#soundOptions").hide();
			}

			$("#notificationSound paper-item").click(function () {
				var soundName = $(this).attr("value");

				$("#playNotificationSound").css("display", "block");

				if (soundName == "custom") {
					$("#notificationSoundInputButton").click();
				} else {
					playSound(soundName);
				}

				if (soundName) {
					$("#soundOptions").fadeIn();
				} else {
					$("#soundOptions").hide();
				}
			});

			$("#playNotificationSound").click(function () {
				if (playing) {
                    sendMessageToBG("stopNotificationSound");
                    playing = false;
                    $(this).attr("icon", "av:play-arrow");
				} else {
					playSound();
				}
			});

			$("#notificationSoundVolume").on("change", function () {
				setTimeout(function () {
					playSound();
				}, 100);
			});

			$("#notificationSoundInputButton").change(function () {
				var file = this.files[0];
				var fileReader = new FileReader();

				fileReader.onloadend = function () {
					storage.set("notificationSoundCustom", this.result).then(() => {
						playSound();
					}).catch(error => {
						openGenericDialog({ content: "The file you have chosen is too large, please select a shorter sound alert." });
						storage.remove("notificationSoundCustom");
					});
				}

				fileReader.onabort = fileReader.onerror = function () {
					niceAlert("Problem loading file");
				}

				console.log("file", file)
				fileReader.readAsDataURL(file);
			});

			async function initNotifications(startup) {
				let showMethod;
				let hideMethod;
				if (startup) {
					showMethod = "show";
					hideMethod = "hide";
				} else {
					showMethod = "slideDown";
					hideMethod = "slideUp";
				}

				const desktopNotification = await storage.get("desktopNotification");
				if (desktopNotification == "") {
					$("#desktopNotificationOptions")[hideMethod]();
				} else if (desktopNotification == "text") {
					$("#desktopNotificationOptions")[showMethod]();
					$("#richNotificationOptions")[hideMethod]();
					$("#showCalendarNames")[hideMethod]();
					$("#popupWindowNotificationOptions")[hideMethod]();
				} else if (desktopNotification == "rich") {
					$("#desktopNotificationOptions")[showMethod]();
					$("#richNotificationOptions")[showMethod]();
					$("#showCalendarNames")[showMethod]();
					$("#popupWindowNotificationOptions")[hideMethod]();
				} else if (desktopNotification == "popupWindow") {
					$("#desktopNotificationOptions")[showMethod]();
					$("#richNotificationOptions")[hideMethod]();
					$("#showCalendarNames")[showMethod]();
					$("#popupWindowNotificationOptions")[showMethod]();
				}
			}

			initNotifications(true);

			function requestTextNotificationPermission(showTest) {
				Notification.requestPermission(permission => {
					if (permission == "granted") {
						if (showTest) {
                            sendMessageToBG("testNotification", { testType: "text" }).catch(error => {
                                showError("Error: " + error);
                            });
						}
					} else {
						openNotificationPermissionIssueDialog(permission);
					}
				});
			}

			$("#desktopNotification paper-item").click(async () => {
				initNotifications();
				if (await storage.get("desktopNotification") == "text") {
					requestTextNotificationPermission();
				}
			});

			$("#testNotification").click(async function () {
                const desktopNotification = await storage.get("desktopNotification");
				if (desktopNotification == "text") {
					requestTextNotificationPermission(true);
				} else {
                    sendMessageToBG("testNotification", { testType: desktopNotification }).catch(error => {
                        console.log("notifresponse: ", error)
                        openNotificationPermissionIssueDialog(error);
                    });
				}
			});

			$("#pendingNotificationsInterval").change(async function () {
				sendMessageToBG("forgottenReminder.stop");
			});

			$("#testPendingReminder").click(async function () {
                await openGenericDialog({ content: "Click OK to see the toolbar button animate :)" });
                sendMessageToBG("forgottenReminder.execute", {test: true }).catch(error => {
                    alert(error);
                });
			});

			$(".snoozeOption").each(function (index, option) {
				$(option).text(getMessage("snooze") + " " + $(option).text().replaceAll("\n", "").trim());
			});

			$("#refresh").click(async function () {
                showLoading();
                await sendMessageToBG("pollServer", {
                    source:	"refresh",
                    bypassCache: true,
                });
                location.reload();
			});

		} else if (tabName == "button") {
			$("#showEventTimeOnBadge, #showEventTimeOnBadgeOptions paper-checkbox, #showDayOnBadge, #showDayOnBadgeOptions paper-checkbox, #excludeRecurringEventsButtonIcon, #excludeHiddenCalendarsFromButton, #showButtonTooltip").change(async function () {
                await waitForStorageSync();
                await sendMessageToBG("checkEvents", { ignoreNotifications: true });
			});

			$("#showTimeSpecificEventsBeforeAllDay").change(async function () {
                await waitForStorageSync();
                await sendMessageToBG("pollServer", { source: "showTimeSpecificEventsBeforeAllDay" });
			});

			$("#browserButtonAction paper-item").click(async function () {
                await waitForStorageSync();
                initPopup();
			});

			if (await storage.get("showEventTimeOnBadge")) {
				$("#showEventTimeOnBadgeOptions").show();
			} else {
				$("#showEventTimeOnBadgeOptions").hide();
			}

			$("#showEventTimeOnBadge").change(function () {
				if (this.checked) {
					$("#showEventTimeOnBadgeOptions").slideDown();
				} else {
					$("#showEventTimeOnBadgeOptions").slideUp();
				}
			});

			if (await storage.get("showDayOnBadge")) {
				$("#showDayOnBadgeOptions").show();
			} else {
				$("#showDayOnBadgeOptions").hide();
			}

			$("#showDayOnBadge").change(function () {
				if (this.checked) {
					$("#showDayOnBadgeOptions").slideDown();
				} else {
					$("#showDayOnBadgeOptions").slideUp();
				}
			});

			$("#currentBadgeIcon").attr("src", await getBadgeIconUrl("", true));
			$("#badgeIcon paper-icon-item").click(async () => {
                $("#currentBadgeIcon").attr("src", await getBadgeIconUrl("", true));
                sendMessageToBG("updateBadge", { forceRefresh: true });
			});
		} else if (tabName == "general") {
			setTimeout(function () {
				if (location.href.match("highlight=customView")) {
					$("#customView").addClass("highlight");
				}
			}, 500);

            const listbox = await initCalendarDropDown("defaultCalendarTemplate");
            initPaperElement($("#defaultCalendar paper-listbox"));

			$("#maxDaysAhead paper-item, #24hourMode").click(async function () {
                await waitForStorageSync();
                twentyFourHour = await storage.get("24hourMode");
                await sendMessageToBG("resetInitMiscWindowVars");
                sendMessageToBG("checkEvents", { ignoreNotifications: true });
			});

			$("#showContextMenuItem").change(function (e) {
				if (this.checked) {
                    $("#showOnlyQuickWhenTextSelected").unhide();
                    sendMessageToBG("addChangeContextMenuItems");
				} else {
                    $("#showOnlyQuickWhenTextSelected").hidden();
					chrome.contextMenus.removeAll();
				}
            });

            if (!await storage.get("showContextMenuItem")) {
                $("#showOnlyQuickWhenTextSelected").hidden();
            }

            $("#showOnlyQuickWhenTextSelected").change(function (e) {
                sendMessageToBG("addChangeContextMenuItems");
            });
            
            async function initFirstDay() {
                const customView = await storage.get("customView");
                if (isCustomViewInDays(customView)) {
                    $("#firstDay").hidden();
                } else {
                    $("#firstDay").unhide();
                }
            }

            initFirstDay();

			$("#customView paper-item").click(async function () {
                await storage.set("calendarView", CalendarView.CUSTOM);
                initFirstDay();
			});

			if (await storage.get("openExistingCalendarTab")) {
				$("#openExistingCalendarTab").get(0).checked = true;
			}

			$("#openExistingCalendarTab").click(function () {
				var that = this;
				if (that.checked) {
					chrome.permissions.request({ origins: [Origins.OPEN_EXISTING_TABS] }, granted => {
						if (granted) {
							storage.enable("openExistingCalendarTab");
						} else {
							that.checked = false;
						}
					});
				} else {
					storage.disable("openExistingCalendarTab");
				}
            });
        } else if (tabName == "skinsAndThemes") {

            const $skinsListing = $("#skinsAndThemesListing");

            showLoading();
            try {
                const skins = await Controller.getSkins();
                skins.forEach(skin => {
                    const $row = $("<tr class='skinLine'><td class='name'>" + skin.name + "</td><td class='skinImageWrapper'><a class='skinImageLink'><img class='skinImage'/></a></td><td class='author'></td><td>" + skin.installs + "</td><td><paper-icon-button class='addSkin' icon='add'></paper-icon-button></td></tr>");
                    $row.data("skin", skin);
                    if (skin.image) {
                        $row.find(".skinImage")
                            .attr("src", skin.image)
                        ;
                        $row.find(".skinImageLink")
                            .attr("href", skin.image)
                            .attr("target", "_previewWindow")
                        ;
                    }
    
                    var $author = $("<a/>");
                    $author.text(skin.author);
                    if (skin.author_url) {
                        $author.attr("href", skin.author_url);
                        $author.attr("target", "_preview");
                        $row.find(".skinImage")
                            .css("cursor", "pointer")
                            //.click(function() {
                                //window.open(skin.author_url);
                            //})
                        ;
                    }
                    $row.find(".author").append($author);
                    $row.find(".addSkin").click(() => {
                        window.open("https://jasonsavard.com/wiki/Skins_and_Themes?ref=skinOptionsTab", "emptyWindow");
                    });
    
                    $skinsListing.append($row);
                });
            } catch (error) {
                $skinsListing.append("Problem loading skins: " + error);
            }

            hideLoading();            
		} else if (tabName == "accounts") {
			$("#revokeAccess").click(async function () {
                const email = await storage.get("email");
				storage.remove("snoozers");
                storage.remove("cachedFeeds");
                storage.remove("cachedFeedsDetails");
                
                resetTemporaryData();

                async function revokeAccess(oAuthForMethod, lastRevoke) {
                    const tokenResponse = await oAuthForMethod.findTokenResponse({ userEmail: email })
                    if (tokenResponse) {
                        removeCachedAuthToken(tokenResponse.access_token);
    
                        await oAuthForMethod.removeAllTokenResponses();
        
                        if (lastRevoke) {
                            $("#emailsGrantedPermissionToContacts").empty();
                            $("#defaultAccountEmail").text(email);
                            $("#oauthNotGranted").show();
                            $("#oauthOptions").hide();
                        }

                        return fetchJSON("https://jasonsavard.com/revokeOauthAccess?token=" + tokenResponse.access_token);
                    }
                }

                try {
                    await revokeAccess(oAuthForTasks);
                } catch (error) {
                    console.warn("Ignore task error", error);
                }

                revokeAccess(oAuthForDevices, true).then(() => {
					showLoggedOut();
					showMessage(getMessage("done"));
				}).catch(error => {
					console.error(error);
					niceAlert("Could not revoke access, revoke it manually more info: https://support.google.com/accounts/answer/3466521");
				});
			});
		} else if (tabName == "admin") {
			if (await storage.get("email") == "test@gmail.com") {
				$("#exportLocalStorage").click(function () {
					downloadObject(localStorage);
				})
				$("#importLocalStorage").click(function () {
					var localStorageText = $("#localStorageText").val();
					if (localStorageText) {
						var localStorageImportObj = JSON.parse(localStorageText);
						localStorage.clear();
						for (item in localStorageImportObj) {
							localStorage.setItem(item, localStorageImportObj[item]);
						}
						openGenericDialog({ title: "Done. Reload the extension to use these new settings!" });
					} else {
						openGenericDialog({ title: "Must enter localStorage JSON string!" });
					}
				})

				$("#testSection").show();
			}

			$("#showConsoleMessages").change(async () => {
                await waitForStorageSync();
                await niceAlert("Click OK to restart the extension");
				reloadExtension();
			});

			$("#fetchCalendarSettings").click(async () => {
                sendMessageToBG("fetchCalendarSettings", { bypassCache: true, email: await storage.get("email") }).then(response => {
					alert("Done");
				}).catch(error => {
					alert("problem: " + error)
				});
			});

			$("#clearData").click(async () => {
				var snoozers = await getFutureSnoozes(await getSnoozers(), {email: await storage.get("email")});
				if (snoozers.length) {
					openGenericDialog({
						content: "You have some snoozed events which will be fogotten after clearing the data.<br><br>Do you want to take note of them?",
						okLabel: getMessage("snoozedEvents"),
						cancelLabel: "Ignore"
					}).then(response => {
						if (response == "ok") {
							openReminders({ notifications: snoozers.shallowClone() });
						} else {
							clearData();
						}
					});
				} else {
					clearData();
				}
				return false;
			});

			$("#saveSyncOptions").click(function () {
				syncOptions.save("manually saved").then(function () {
					openGenericDialog({
						title: "Done",
						content: "Make sure you are signed into the browser for the sync to complete",
						cancelLabel: getMessage("moreInfo")
					}).then(response => {
						if (response == "cancel") {
							if (DetectClient.isFirefox()) {
								openUrl("https://support.mozilla.org/kb/access-mozilla-services-firefox-accounts");
							} else {
								openUrl("https://support.google.com/chrome/answer/185277");
							}
						}
					});
				}).catch(function (error) {
					showError("Error: " + error);
				});
				return false;
			});

			$("#loadSyncOptions").click(function () {
				syncOptions.fetch(function (response) {
					// do nothing last fetch will 
					console.log("syncoptions fetch response", response);
				}).catch(function (response) {
					console.log("catch reponse", response);
					// probably different versions
					if (response && response.items) {
						return new Promise(function (resolve, reject) {
							openGenericDialog({
								title: "Problem",
								content: response.error + "<br><br>" + "You can force it but it might create issues in the extension and the only solution will be to re-install without loading settings!",
								okLabel: "Force it",
								showCancel: true
							}).then(function (dialogResponse) {
								if (dialogResponse == "ok") {
									resolve(response.items);
								} else {
									reject("cancelledByUser");
								}
							});
						});
					} else {
						throw response;
					}
				}).then(function (items) {
					console.log("syncoptions then");
					return syncOptions.load(items);
				}).then(() => {
					openGenericDialog({
						title: "Click OK to restart the extension!"
					}).then(response => {
						if (response == "ok") {
							reloadExtension();
						}
					});
				}).catch(error => {
					console.log("syncoptions error: " + error);
					if (error != "cancelledByUser") {
						openGenericDialog({
							content: "error loading options: " + error
						});
					}
				});

				return false;
			});
		}

		// must be at end (at least after all templates have been exposed like default calendar dropdown)
		if (await storage.get("donationClicked")) {
			$("[mustDonate]").each(function (i, element) {
				$(this).removeAttr("mustDonate");
			});
		}
		
	}
}

function showOptionsSection(tabName) {
	console.log("showtabName: " + tabName)
	$("#mainTabs")[0].selected = tabName;
	$("#pages").prop("selected", tabName);

	$(".page").removeClass("active");
	setTimeout(() => {
		$(".page.iron-selected").addClass("active");
	}, 1);

    //document.body.scrollTop = 0;
    $("app-header-layout app-header")[0].scrollTarget.scroll({top:0})

	initPage(tabName);
	// wait for tab animation
	setTimeout(() => {
		$("app-header").first()[0].notifyResize();
    }, 500);
    
    history.pushState({}, "blah", "#" + tabName);
}

function loadVoices() {
	console.log("loadVoices");
	if (chrome.tts) {
		chrome.tts.getVoices(function(voices) {
			
			var nativeFound = false;
			var options = [];
			
			for (var i=0; i<voices.length; i++) {
				if (voices[i].voiceName == "native") {
					nativeFound = true;
				} else {
					var optionsObj = {label:voices[i].voiceName, value:voices[i].voiceName};
					if (voices[i].extensionId) {
						optionsObj.value += "___" + voices[i].extensionId;
					}
					options.push(optionsObj);
				}
	      	}
			
			var t = document.querySelector('#t');
			// could only set this .data once and could not use .push on it or it breaks the bind
			
			if (t) {
				t.data = options;
			}
		});
	}
}

async function playSound(soundName) {
	if (!soundName) {
		soundName = await storage.get("notificationSound");
	}
	$("#playNotificationSound").attr("icon", "av:stop");
    playing = true;
    await sendMessageToBG("playNotificationSoundFile", soundName);
    playing = false;
    $("#playNotificationSound").attr("icon", "av:play-arrow");
}

function playVoice() {
	$("#playVoice").attr("icon", "av:stop");
    
    chrome.runtime.sendMessage({command: "chromeTTS", text: $("#voiceTestText").val()}, response => {
        $("#playVoice").attr("icon", "av:play-arrow");
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            showError(chrome.runtime.lastError.message);
        }
	});
}

function initSelectedTab() {
	var tabId = location.href.split("#")[1];
	
	if (tabId) {
		showOptionsSection(tabId);
	} else {
		showOptionsSection("notifications");
	}
}

async function initGrantedAccountDisplay(startup) {
    console.log("initGrantedAccountDisplay");
    let showMethod;
    let hideMethod;
    if (startup) {
        showMethod = "show";
        hideMethod = "hide";
    } else {
        showMethod = "slideDown";
        hideMethod = "slideUp";
    }
    
    calendarMap = await initCalendarMap();

	initPage("welcome");
	initPage("notifications");
	initPage("accounts");

    const email = await storage.get("email");
    const loggedOut = await storage.get("loggedOut");
	if (!email || loggedOut) {
		hideMessage();
		$("#guideGrantAccessButton")[showMethod]();
		$("#guides")[hideMethod]();
		$("#oauthNotGranted")[showMethod]();
	} else if (!await oAuthForDevices.findTokenResponse({userEmail:email})) {	
		// only show warning if we did not arrive from popup warning already
		if (getUrlValue(location.href, "accessNotGranted")) {
			hideMessage();
		} else {
			if (!justInstalled && location.hash != "#accounts") {
				showMessage(getMessage("accessNotGrantedSeeAccountOptions", ["", getMessage("accessNotGrantedSeeAccountOptions_accounts")]), {
					text: getMessage("accounts"),
					onClick: function() {
						showOptionsSection("accounts");
						hideMessage();
					}
				});
			} else {
				hideMessage();
			}
		}
		
		setTimeout(() => {
			$("#defaultAccountEmail").text(email);
		}, 1);
		$("#defaultAccount").show();
		
		$("#guideGrantAccessButton")[showMethod]();
		$("#guides")[hideMethod]();
		$("#oauthNotGranted")[showMethod]();
	} else {
		hideMessage();
		$("#guideGrantAccessButton")[hideMethod]();
		$("#guides")[showMethod]();
		$("#oauthNotGranted")[hideMethod]();
	}

    const userEmails = await oAuthForDevices.getUserEmails();
    
    if (userEmails.length && !loggedOut) {
        $("#emailsGrantedPermissionToContacts").empty();
        $.each(userEmails, function(index, userEmail) {
            $("#emailsGrantedPermissionToContacts").append(userEmail + "&nbsp;");
        });
        $("#oauthOptions")[showMethod]();
        loadCalendarReminders();
    } else {
        $("#oauthOptions")[hideMethod]();
    }
}

function getCalendarFromNode(node) {
    const calendars = $("calendar-reminders").prop("calendars");
    const calendarId = $(node).closest("[calendar-id]").attr("calendar-id");
    return calendars.find(calendar => calendar.id == calendarId);
}

async function sendPatchCommand(calendarReminderModified) {
    console.log("saving: ", calendarReminderModified.defaultReminders)
    
    const sendParams = {
        userEmail: await storage.get("email"),
        type: "patch",
        url: "/users/me/calendarList/" + encodeURIComponent(calendarReminderModified.id),
        data: {
            defaultReminders: calendarReminderModified.defaultReminders
        }
    };
    
    oauthDeviceSend(sendParams).then(async response => {
        await storage.remove("cachedFeeds");
        showMessage("Synced with Google Calendar");
        return sendMessageToBG("pollServer", {reInitCachedFeeds: true});
    }).catch(error => {
        showError("Error saving: " + error, {
            text: getMessage("refresh"),
            onClick: function() {
                showLoading();
                sendMessageToBG("pollServer", {source: "refresh"}).then(() => {
                    location.reload();
                });
            }
        });
    });        
}

var saveCalendarRemindersTimeout;

function saveCalendarReminders(node) {
    if (hasCalendarReadWritePermissions()) {
        clearTimeout(saveCalendarRemindersTimeout);
	
        saveCalendarRemindersTimeout = setTimeout(function() {
            var $reminderMinutes = $(node).find(".reminderMinutes");
            var $reminderValuePerPeriod = $(node).find(".reminderValuePerPeriod");
            var $reminderPeriod = $(node).find(".reminderPeriod");
            var $lastUpdated = $(node).find(".lastUpdated");
            
            updateReminderMinutes($reminderPeriod, $reminderMinutes, $reminderValuePerPeriod)
            
            $lastUpdated.prop("value", new Date());
            
            var calendarReminderModified = getCalendarFromNode(node);
            
            console.log("calendarReminderModified", calendarReminderModified);
    
            sendPatchCommand(calendarReminderModified);
        }, seconds(2));
    }
}

async function hasCalendarReadWritePermissions() {
    const tokenResponse = await oAuthForDevices.findTokenResponse({ userEmail: await storage.get("email") });
    const oldUsersWithFullPermissions = !tokenResponse.scopes;

    if (oldUsersWithFullPermissions || tokenResponse.scopes == Scopes.CALENDARS_READ_WRITE) {
        return true;
    } else {
        await niceAlert(getMessage("permissionIsRequired"));
        try {
            requestPermission({
                email: tokenResponse.userEmail,
                useGoogleAccountsSignIn: !tokenResponse.chromeProfile,
                scopes: Scopes.CALENDARS_READ_WRITE
            });    
        } catch (error) {
            showError(error);
        } finally {
            hideLoading();
        }
    }
}

function initCalendarReminders() {
	getShadowRoot("calendar-reminders").find(".calendarReminder").each(function() {
		var that = this;

        var $calendarReminder = $(this);
		var $reminderMethod = $calendarReminder.find(".reminderMethod");
		var $reminderMinutes = $calendarReminder.find(".reminderMinutes");
		var $reminderValuePerPeriod = $calendarReminder.find(".reminderValuePerPeriod");
		var $reminderPeriod = $calendarReminder.find(".reminderPeriod");
		var $deleteReminder = $calendarReminder.find(".deleteReminder");

		initReminderPeriod($reminderValuePerPeriod, $reminderPeriod, $reminderMinutes);
		
		// MUST USE .off for all events here

		$reminderMethod.find("paper-item").off().click(function() {
			saveCalendarReminders(that);
		});

		$reminderValuePerPeriod.off().keyup(function() {
			saveCalendarReminders(that);
		});

		$reminderPeriod.find("paper-item").off().click(function() {
			saveCalendarReminders(that);
		});
		
		$deleteReminder.off().click(function() {
            if (hasCalendarReadWritePermissions()) {
                // must fetch this reminderMinutes because the varaiable above is passed by value and not reference so it might have changes ince
                const reminderMinutes = $(this).closest(".calendarReminder").find(".reminderMinutes")[0].value;
                
                const calendarReminderModified = getCalendarFromNode(that);
                calendarReminderModified.defaultReminders.some(function(defaultReminder, index) {
                    if (defaultReminder.method == $reminderMethod[0].selected && defaultReminder.minutes == reminderMinutes) {
                        calendarReminderModified.defaultReminders.splice(index, 1);
                        return true;
                    }
                });
                
                $calendarReminder.slideUp();
                
                sendPatchCommand(calendarReminderModified);
            }
		});
		
	});
	
	getShadowRoot("calendar-reminders").find(".calendarReminderLineCheckbox").off().on("click", async function() {
		const calendar = getCalendarFromNode(this);
		const excludedCalendars = await storage.get("excludedCalendars");
		
		if (this.checked) {
            excludedCalendars[calendar.id] = false;
			$(this).closest(".calendarReminderLine").removeAttr("excluded");

			showMessage("Note: To see this calendar use the ≡ menu in the popup", 5);
		} else {
            excludedCalendars[calendar.id] = true;
			$(this).closest(".calendarReminderLine").attr("excluded", true);
			
            showMessage("Notifications removed! To hide this calendar use the ≡ menu in the popup", 5);
            
            const email = await storage.get("email");
            const selectedCalendars = await storage.get("selectedCalendars");

            if (!isCalendarSelectedInExtension(calendar, email, selectedCalendars)) {
                console.info("optimize and remove from cache: " + calendar.id);
                const cachedFeeds = await storage.get("cachedFeeds");
                delete cachedFeeds[calendar.id];
                await storage.set("cachedFeeds", cachedFeeds);
                await sendMessageToBG("reInitCachedFeeds");
            }
		}

        await storage.set("excludedCalendars", excludedCalendars);

        await sendMessageToBG("checkEvents", {ignoreNotifications: true});
	});
}

async function loadCalendarReminders() {
	console.log("loadCalendarReminders");
	//var t = document.querySelector('#calendarRemindersBind');
	// could only set this .data once and could not use .push on it or it breaks the bind
	
	const calendars = await getArrayOfCalendars();
	
	if (calendars.length == 0) {
		console.log("no calendars found");
		return;
	}
	
	calendars.forEach(calendar => {
		calendar.defaultReminders?.sort((a, b) => {
			if (parseInt(a.minutes) < parseInt(b.minutes)) {
				return -1;
			} else {
				return +1;
			}
		});
	});

	let calendarColorsCSS = generateCalendarColors(await storage.get("cachedFeeds"), calendars);
	getShadowRoot("calendar-reminders").find("style").append(calendarColorsCSS);

    window.excludedCalendars = await storage.get("excludedCalendars");
	$("calendar-reminders").prop("calendars", calendars);
	
	setTimeout(function() {
		initCalendarReminders();
		firefoxPatchForCheckbox(getShadowRoot("calendar-reminders").find("paper-checkbox"));
	}, 1);
}

function openNotificationPermissionIssueDialog(error) {
	openGenericDialog({
		title: "Permission denied!",
		content: "You might have disabled the notifications. Error: " + error,
		cancelLabel: getMessage("moreInfo")
	}).then(response => {
		if (response != "ok") {
			openUrl("https://support.google.com/chrome/answer/3220216");
		}
	});

}

function postGrantedPermissionsToCalendarsAndPolledServer(email) {
	if (!$("#emailsGrantedPermissionToContacts").html().includes(email)) {
		$("#emailsGrantedPermissionToContacts").append("&nbsp;" + email);
	}

	initGrantedAccountDisplay();

	hideLoading();
	showMessage(getMessage("accessGranted"));
}

async function clearData() {
	localStorage.clear();
	await storage.clear();

	storage.setDate("installDate");
	storage.set("installVersion", chrome.runtime.getManifest().version);

	openGenericDialog({
		title: "Data cleared!",
		content: "You will have to re-exclude your excluded calendars again!<br><br>Click OK to restart extension.",
	}).then(response => {
		if (response == "ok") {
			reloadExtension();
		}
	});
}

$(document).ready(function() {

    (async () => {

        await initUI();
        await polymerPromise;

        donationClickedFlagForPreventDefaults = await storage.get("donationClicked");
            
        $("#mainTabs paper-tab").click(function(e) {
            var tabName = $(this).attr("value");
            showOptionsSection(tabName);
        });
        
        $(window).focus(function(event) {
            console.log("window.focus");
            // reload voices
            loadVoices();
        });
    
        if (justInstalled || (!await storage.get("_optionsOpened") && gtVersion(await storage.get("installVersion"), "26.2"))) {
            storage.setDate("_optionsOpened");
            showOptionsSection("welcome");
            
            if (DetectClient.isOpera()) {
                if (!window.Notification) {
                    openGenericDialog({title: "Desktop notifications are not yet supported in this browser!"});
                }
                if (window.chrome && !window.chrome.tts) {
                    openGenericDialog({title: "Voice notifications are not yet supported in this browser!"});
                }
                openGenericDialog({
                    title: "You are not using the stable channel of Chrome!",
                    content:"Bugs might occur, you can use this extension, however, for obvious reasons,<br>these bugs and reviews will be ignored unless you can replicate them on stable channel of Chrome.",
                    cancelLabel:getMessage("moreInfo")
                }).then(response => {
                    if (response != "ok") {
                        openUrl("https://jasonsavard.com/wiki/Unstable_browser_channel");
                    }
                });
            }
    
            // check for sync data
            syncOptions.fetch().then(function(items) {
                console.log("fetch response", items);
                openGenericDialog({
                    title: "Restore settings",
                    content: "Would you like to use your previous extension options? <div style='margin-top:4px;font-size:12px;color:gray'>(If you had previous issues you should do this later)</div>",
                    showCancel: true
                }).then(function(response) {
                    if (response == "ok") {
                        syncOptions.load(items).then(function(items) {
                            openGenericDialog({
                                title: "Options restored!",
                                okLabel: "Restart extension"
                            }).then(response => {
                                reloadExtension();
                            });
                        }).catch(function(error) {
                            openGenericDialog({
                                title: "Error loading settings", 
                                content: error
                            });
                        });
                    }
                });
            }).catch(function(error) {
                console.error("error fetching: ", error);
            });
        } else {
            initSelectedTab();
        }
        
        window.onpopstate = function(event) {
            console.log(event);
            initSelectedTab();
        }
        
        initGrantedAccountDisplay(true);
        
        $("#logo").dblclick(async () => {
            await storage.toggle("donationClicked");
            location.reload();
        });
        
        $("#version").text("v." + chrome.runtime.getManifest().version);
        $("#version").click(function() {
            showLoading();
            if (chrome.runtime.requestUpdateCheck) {
                chrome.runtime.requestUpdateCheck(function(status, details) {
                    hideLoading();
                    console.log("updatechec:", details)
                    if (status == "no_update") {
                        openGenericDialog({title:"No update!", otherLabel: "More info"}).then(function(response) {
                            if (response == "other") {
                                location.href = "https://jasonsavard.com/wiki/Extension_Updates";
                            }
                        })
                    } else if (status == "throttled") {
                        openGenericDialog({title:"Throttled, try again later!"});
                    } else {
                        openGenericDialog({title:"Response: " + status + " new version " + details.version});
                    }
                });
            } else {
                location.href = "https://jasonsavard.com/wiki/Extension_Updates";
            }
        });

        $("#changelog").click(function() {
            openChangelog("CalendarOptions");
            return false;
        });

        // detect x
        document.getElementById("search").addEventListener("search", function(e) {
            if (!this.value) {
                $("*").removeClass("search-result");
            }
        });

        function highlightTab(node) {
            const page = $(node).closest(".page");
            const tabName = page.attr("value");
            // :not(.iron-selected)
            $("paper-tab[value='" + tabName + "']").addClass("search-result");
        }

        function highlightPriorityNode(highlightNode) {
            return [
                "paper-dropdown-menu",
                "paper-button",
                "paper-checkbox",
                "select"
            ].some(priorityNodeName => {
                const $priorityNode = $(highlightNode).closest(priorityNodeName);
                if ($priorityNode.length) {
                    $priorityNode[0].classList.add("search-result");
                    return true;
                }
            });
        }

        async function search(search) {
            if (!window.initTabsForSearch) {
                await asyncForEach(document.querySelectorAll("paper-tab"), async (tab) => {
                    await initPage(tab.getAttribute("value"));
                });
                window.initTabsForSearch = true;
            }

            $("*").removeClass("search-result");
            if (search.length >= 2) {
                search = search.toLowerCase();
                var elms = document.getElementsByTagName("*"),
                len = elms.length;
                for(var ii = 0; ii < len; ii++) {

                    let label = elms[ii].getAttribute("label");
                    if (label && label.toLowerCase().includes(search)) {
                        elms[ii].classList.add("search-result");
                        highlightTab(elms[ii]);
                    }

                    var myChildred = elms[ii].childNodes;
                    len2 = myChildred.length;
                    for (var jj = 0; jj < len2; jj++) {
                        if (myChildred[jj].nodeType === 3) {
                            if (myChildred[jj].nodeValue.toLowerCase().includes(search)) {
                                let highlightNode = myChildred[jj].parentNode;
                                if (highlightNode.nodeName != "STYLE") {
                                    let foundPriorityNode = highlightPriorityNode(highlightNode);
                                    if (!foundPriorityNode) {
                                        const $priorityNode = $(highlightNode).closest("paper-tooltip");
                                        if ($priorityNode.length) {
                                            foundPriorityNode = highlightPriorityNode($priorityNode[0].target);
                                            if (!foundPriorityNode) {
                                                $priorityNode[0].target.classList.add("search-result");
                                            }
                                        } else {
                                            highlightNode.classList.add("search-result");
                                        }
                                    }

                                    console.log("highlightNode", highlightNode);
                                    
                                    highlightTab(myChildred[jj]);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        $("#search").keyup(function(e) {
            const searchValue = this.value;
            clearTimeout(window.searchTimeout);
            searchTimeout = setTimeout(() => {
                search(searchValue);
            }, window.initTabsForSearch ? 0 : 300);

            clearTimeout(window.analyticsTimeout);
            analyticsTimeout = setTimeout(async () => {
                while (!window.initTabsForSearch) {
                    await sleep(200);
                }
                if (searchValue) {
                    sendGA("optionsSearch", searchValue);
                    console.log("search results: " + $(".search-result").length);
                    if (!$(".search-result").length) {
                        openGenericDialog({
                            title: "No results found in options",
                            showCancel: true,
                            okLabel: "Search FAQ & Forum"
                        }).then(response => {
                            if (response == "ok") {
                                window.open("https://jasonsavard.com/search?q=" + encodeURIComponent(searchValue), "emptyWindow");
                            }
                        });
                    }
                }
            }, 1000);
        });

        setTimeout(function() {
            $("body").removeAttr("jason-unresolved");
            $("body").addClass("explode");
        }, 200)
    
    })();
});