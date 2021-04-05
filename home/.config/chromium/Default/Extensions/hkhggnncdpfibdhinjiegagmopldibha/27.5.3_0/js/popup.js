var openingSite = false;
var autoSaveInterval;

var eventTitle = null;
var description = null;
var descriptionFromPage;

// bgobjects
var email;
var cachedFeeds;
var colors;
var writeableCalendars = [];

var betaCalendarFirstLoad = true;
var inWidget;
var fromToolbar;
var isDetached;
var fromGrantedAccess;
var skinsSettings;
var calendarShowingCurrentDate = true;
var scrollTarget;
const ffPatchForResizeAndMorePopoutDisappearing = DetectClient.isFirefox();
var WHEEL_THRESHOLD = DetectClient.isFirefox() ? 3 : 100;
var contactsData;
let calendarMap;
const FULL_CALENDAR_SOURCE_ID = "main-source";
let fullCalendar;
var fetchingAgendaEvents;

//if (DetectClient.isChrome()) { // only because in Firefox this local onMessage would be called when local sendMessage was sent (instead I want the background.js > onMessage to get the local sendMessage
	chrome.runtime.onMessage.addListener(/* DONT USE ASYNC HERE because of return true */function(message, sender, sendResponse) {
		console.log("onMessage.addListener", message);
		if (message.command == "grantPermissionToCalendarsAndPolledServer") {
            storage.disable("loggedOut").then(() => {
                location.reload();
            })
        } else if (message.command == "grantPermissionToTasksAndPolledServer") {
            location.reload();
            /*
            initCalendarMap().then(calendarMap => {
                globalThis.calendarMap = calendarMap;
                getArrayOfCalendars().then(arrayOfCalendars => {
                    setSelectedCalendars(TASKS_CALENDAR_OBJECT, arrayOfCalendars).then(async () => {
                        sendResponse();
                    });
                });
            });
            */
		} else if (message.command == "grantPermissionToContacts") {
            hideLoading();
            if ($("#inviteGuestsDialog").length) {
                $("#inviteGuestsDialog")[0].close();
            }
            $("#inviteGuests").click();
            sendResponse();
		} else if (message.command == "gcmUpdate") {
			console.log("gcm update");
			// required to re-initialize variable events
			getBGObjects().then(() => {
				fullCalendar?.refetchEvents();
			});
		} else if (message.command == "getPopupDetails") {
			sendResponse({
				fromToolbar: fromToolbar
			});
		}
	});
//}

if (location.href.includes("source=widget")) {
	inWidget = true;
} else if (location.href.includes("source=toolbar")) {
	fromToolbar = true;
} else if (location.href.includes("source=grantedAccess")) {
	fromGrantedAccess = true;
} else {
	isDetached = true;
}

async function getEventsWrapper() {
    const events = await getEvents();

    if (!window.cacheEventsForGettingSnoozers) {
        window.cacheEventsForGettingSnoozers = true;
        const futureSnoozes = await getFutureSnoozes(await getSnoozers(events), {email:await storage.get("email")});
        if (futureSnoozes.length) {
            console.log("snozzes", futureSnoozes);
    
            $(".openSnoozedEvents").click(function() {
                openReminders({notifications:futureSnoozes.shallowClone()}).then(function() {
                    close();
                });
            });
        } else {
            $(".openSnoozedEvents").prev(".separator").hide();
            $(".openSnoozedEvents").hide();
        }
    }

    return events;
}

function closeWindow() {
	if (fromToolbar) {
		window.close();
	}
}

function showSaving() {
	$("#progress").css("opacity", 1);
}

function hideSaving() {
	$("#progress").css("opacity", 0);
}

function showLoadingError(error) {
	polymerPromise2.then(() => {
		if (error.stack) {
			showError(error + " " + error.stack);
		} else {
			showError(error);
		}
	});
}

function showCalendarError(error) {
	// todo need to show a link to re-grant
    console.error("showCalendarError", error);

    if (!isOnline() || error.code == 0) { // must check this before access errors below
        showError(getMessage("yourOffline"));
    } else if (error.toString().includes("401")
        || error.toString().includes("OAuth2 not granted or revoked")
        || error.code == 401) { // invalid grant
		storage.enable("loggedOut");
		showError(getMessage("accessNotGrantedSeeAccountOptions", ["", getMessage("accessNotGrantedSeeAccountOptions_accounts")]), {
			text: getMessage("accounts"),
			onClick: function() {
				openUrl("options.html?accessNotGranted=true#accounts");
			}
		});
	} else {
		showError(error);
	}
}

function generateAccountStub(email) {
	return {
		getAddress: function() {
			return email;
		}
	}
}

async function cacheContactsData() {
    if (!globalThis.cacheContactsDataPromise || !contactsData) {
        globalThis.cacheContactsDataPromise = new Promise(async (resolve, reject) => {
            if (!contactsData) {
                contactsData = await storage.get("contactsData");
            }
            contactsTokenResponse = await oAuthForContacts.findTokenResponse({ userEmail: email });
            resolve();
        });
    }
    return globalThis.cacheContactsDataPromise;
}

async function getBGObjects() {
    console.time("getBGObjects");
    
    await initUI();
    
    email = await storage.get("email");
    cachedFeeds = await storage.get("cachedFeeds");
    colors = cachedFeeds["colors"];
    calendarMap = await initCalendarMap();
    
    console.timeEnd("getBGObjects");
        
    skinsSettings = await storage.get("skins");

    window.blackFontEvents = skinsSettings.some(function (skin) {
        if (skin.id == SkinIds.BLACK_FONT_EVENTS) {
            return true;
        }
    });
    window.matchFontColorWithEventColor = skinsSettings.some(function (skin) {
        if (skin.id == SkinIds.MATCH_FONT_COLOR_WITH_EVENT_COLOR) {
            return true;
        }
    });
}

async function getCalendarView() {
	let calendarView;

	/* must match min-width 500 */
	if (document.body.clientWidth >= 500) {
		calendarView = await storage.get("calendarView");
	} else {
		calendarView = CalendarView.AGENDA;
	}
	
	return calendarView;
}

function shouldWatermarkImage(skin) {
	//if (skin.name && skin.name.startsWith("[img:") && skin.author != "Jason") {
	if (skin.image && skin.author != "Jason") {
		return true;
	}
}

function addSkinPiece(id, css) {
	polymerPromise.then(function() {
		$("#" + id).append(css);
	});
}

function addSkin(skin, id) {
	if (!id) {
		id = "skin_" + skin.id;
	}
	$("#" + id).remove();
    
    const $body = $("body");
    
	$body.addClass("skin_" + skin.id);
	
	var css = "";
	
	if (skin.image) {
		$body.addClass("background-skin");

        let defaultBackgroundColorCSS = "";
		// normally default is black BUT if image exists than default is white, unless overwritten with text_color
		if (skin.text_color != "dark") {
            defaultBackgroundColorCSS = "background-color:black;";
			//css += " html:not(.searchInputVisible) [main] paper-toolbar paper-icon-button, #topLeft, #skinWatermark, .showMoreEmails iron-icon {color:white} ";
		}

		var resizedImageUrl;
		if (/blogspot\./.test(skin.image) || /googleusercontent\./.test(skin.image)) {
			resizedImageUrl = skin.image.replace(/\/s\d+\//, "\/s" + parseInt($body.width()) + "\/");
		} else {
			resizedImageUrl = skin.image;
		}
		
		//css += "[main] {background-size:cover;background-image:url('" + resizedImageUrl + "');background-position-x:50%;background-position-y:50%} [main] paper-toolbar {background-color:transparent} .accountHeader {background-color:transparent}";
		// Loading the background image "after" initial load for 2 reasons: 1) make sure it loads after the mails. 2) to trigger opacity transition
        addSkinPiece(id, `
            app-header-layout::before {
                opacity: 0.5;
                background-size: cover;
                background-image: url('${resizedImageUrl}');
                ${defaultBackgroundColorCSS}
                background-position-x: 50%;
                background-position-y: 50%;
            }
            app-header-layout app-toolbar,
            .accountHeader {
                background-color:transparent !important
            }
        `);
		
		if (shouldWatermarkImage(skin)) {
            const $skinWatermark = $("#skinWatermark");
			$skinWatermark.addClass("visible");
			$skinWatermark.text(skin.author);
			if (skin.author_url) {
				$skinWatermark.attr("href", skin.author_url); 
			} else {
				$skinWatermark.removeAttr("href");
			}
		}
	}
	if (skin.css) {
		css += " " + skin.css;
	}
	
	addCSS(id, css);
}

function removeSkin(skin) {
	$("#skin_" + skin.id).remove();
	$("body").removeClass("skin_" + skin.id);

	if (shouldWatermarkImage(skin)) {
		$("#skinWatermark").removeClass("visible");
	}
}

function setSkinDetails($dialog, skin) {
	
	$dialog.find("#skinCSS").off().on("click", function() {
		
		var $textarea = $("<textarea readonly style='width:400px;height:200px'></textarea>");
		$textarea.text(skin.css);
		
		openGenericDialog({
			title: "Skin details",
			content: $textarea
		});

		return false;
	});

	$("#skinAuthorInner").unhide();

	if (skin.css) {
		$dialog.find("#skinCSS").attr("href", "#");
	} else {
		$dialog.find("#skinCSS").removeAttr("href");
	}
	
	$dialog.find("#skinAuthor").text(skin.author);
	if (skin.author_url) {
		$dialog.find("#skinAuthor").attr("href", skin.author_url);
	} else {
		$dialog.find("#skinAuthor").removeAttr("href");
	}
}

async function isGmailCheckerInstalled(callback) {
	// use cached response for true
	if (await storage.get("gmailCheckerInstalled")) {
		callback(true);
	} else {
		sendMessageToGmailExtension({action:"getInfo"}).then(response => {
			var installed = false;
			if (response && response.installed) {
				installed = true;
				storage.enable("gmailCheckerInstalled");
			}
			callback(installed)
		}).catch(error => {
			callback();
		});
	}
}

function convertEventToFullCalendarEvent(params) {
    let fcEvent = {};
    
    const eventEntry = params.eventEntry;
	
	fcEvent.id = getEventID(eventEntry);
	
	fcEvent.title = eventEntry.title;
	if (!fcEvent.title) {
		fcEvent.title = getSummary(eventEntry);
	}
	
	//fcEvent.url = getEventUrl(eventEntry);

	if (hasUserDeclinedEvent(eventEntry, email)) {
		fcEvent.isDeclined = true;
	}
	
	if (params.snoozeTime) {		
		fcEvent.isSnoozer = true;
		fcEvent.id += "_snooze";
        
        // v2 let's force the snoozed event to allday - so that the time does not appear, v1 let's force the snoozed event to allday if not today
        if (params.snoozeTime.getHours() == 0 && params.snoozeTime.getMinutes() == 0) {
            fcEvent.allDay = true;
        }
		fcEvent.start = params.snoozeTime;
		fcEvent.end = params.snoozeTime.addDays(1);
		// required for fullcalendar or else it would spread the event across many days
		resetTime(fcEvent.end);
	} else {
        fcEvent.allDay = eventEntry.allDay;
        fcEvent.start = new Date(eventEntry.startTime);
        fcEvent.end = new Date(eventEntry.endTime);
	}

	const eventColors = getEventColors({
        event: eventEntry,
        cachedFeeds: params.cachedFeeds,
        arrayOfCalendars: params.arrayOfCalendars
    });
	fcEvent.textColor = eventColors.fgColor;
    fcEvent.color = eventColors.bgColor;
	fcEvent.jEvent = eventEntry;

	return fcEvent;
}

async function convertAllEventsToFullCalendarEvents(events) {
    const cachedFeeds = await storage.get("cachedFeeds");
    const arrayOfCalendars = await getArrayOfCalendars();
    const calendarSettings = await storage.get("calendarSettings");
    const showDeclinedEvents = calendarSettings.showDeclinedEvents;
    const hideInvitations = calendarSettings.hideInvitations;
    const selectedCalendars = await storage.get("selectedCalendars");

	const fullCalendarEvents = [];
	
	events.forEach(event => {
		let snoozeTime;
		if (event.isSnoozer) {
			jEvent = event.event;			
			snoozeTime = event.time;
		} else {
			jEvent = event;
		}
		
		const calendar = getEventCalendar(jEvent);

		const selected = isCalendarSelectedInExtension(calendar, email, selectedCalendars);
		if (selected && passedShowDeclinedEventsTest(jEvent, showDeclinedEvents, email) && passedHideInvitationsTest(jEvent, hideInvitations, email)) {
            const fcEvent = convertEventToFullCalendarEvent({
                eventEntry: jEvent,
                snoozeTime: snoozeTime,
                cachedFeeds: cachedFeeds,
                arrayOfCalendars: arrayOfCalendars
            });
			fullCalendarEvents.push(fcEvent);
		}
    });
	return fullCalendarEvents;
}

function openSiteInsteadOfPopup() {
	openingSite = true;
	openGoogleCalendarWebsite();
}

var tooLateForShortcut = false;
setInterval(function() {tooLateForShortcut=true}, 500);
window.addEventListener ("keydown", async e => {
	console.log("activenode", document.activeElement.nodeName);
	// for bypassing popup and opening google calendar webpage
	if (fromToolbar && !tooLateForShortcut && isCtrlPressed(e)) {
		tooLateForShortcut = true;
		if (await donationClicked("CtrlKeyOnIcon")) {
			openSiteInsteadOfPopup();
			return;
		}
	}
	
	if (isCtrlPressed(e)) {
		$("#betaCalendar").addClass("ctrlKey");
	}
	
	if (e.key === "Escape") {
		if ($(e.target).closest("paper-dialog").length) {
            e.preventDefault();
        } else if ($("#back").is(":visible")) {
            $("#back").click();
            e.preventDefault();
        } else if ($("html").hasClass("quickAddVisible")) {
            closeQuickAdd();
            e.preventDefault();
		} else {
			// do nothing and let it chrome close it
		}
	} else if (!isFocusOnInputElement()) {
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			fullCalendar?.next();
			e.preventDefault();
		} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { // up arrow or left arrrow
			fullCalendar?.prev();
			e.preventDefault();
		} else if (e.key === "Home") {
			fcChangeView(await getCalendarView());
			fullCalendar?.today();
            e.preventDefault();
        } else if (e.ctrlKey && e.key == "g") {
            openGoToDate();
            e.preventDefault();
        } else if (e.key == "/") {
            showSearch();
            e.preventDefault();
        } else if (isCtrlPressed(e) && e.key == "1") {
            changeCalendarView(CalendarView.DAY);
            e.preventDefault();
        } else if (isCtrlPressed(e) && e.key == "2") {
            changeCalendarView(CalendarView.WEEK);
            e.preventDefault();
        } else if (isCtrlPressed(e) && e.key == "3") {
            changeCalendarView(CalendarView.MONTH);
            e.preventDefault();
        } else if (isCtrlPressed(e) && e.key == "4") {
            changeCalendarView(CalendarView.CUSTOM);
            e.preventDefault();
        } else if (isCtrlPressed(e) && e.key == "5") {
            changeCalendarView(CalendarView.AGENDA);
            e.preventDefault();
        } else if (isCtrlPressed(e) && e.key == "6") {
            changeCalendarView(CalendarView.LIST_WEEK);
            e.preventDefault();
        } else if (e.key == "?") {
            openDialog("keyboardShortcutDialogTemplate");
		} else {
			if (!isCtrlPressed(e) && e.key != "Shift" && e.key != "Alt") {
				console.log("keydown", e);
				console.log("active", document.activeElement.nodeName);
                await initQuickAdd();
                $("#quickAddWrapper").addClass("inputEntered");
				// patch because sometimes when the keydown happens to quickly while the popup/polymer is loading it would not be communicated to the input tag
				//$("#quickAdd").val( $("#quickAdd").val() + e.key );
				//return false;
			}
        }
	}
	
	// for Dismissing events
	if (e.altKey && e.key == "d") {
		chrome.runtime.sendMessage({action: "dismissAll"}, function() {
			closeWindow();
		});		
	}

}, false);

window.addEventListener ("keyup", function(e) {
	if (!isCtrlPressed(e)) {
		$("#betaCalendar").removeClass("ctrlKey");
	}
}, false);

window.addEventListener("wheel", async e => {
    var inFullCalendar = $(e.target).closest("#betaCalendar").length;
    const calendarView = await getCalendarView();
    const customView = await storage.get("customView");
	if ((calendarView == CalendarView.MONTH || (calendarView == CalendarView.CUSTOM && isCustomViewInWeeks(customView))) && inFullCalendar) {
        if (!isFocusOnInputElement()
            && !$(e.target).hasVerticalScrollbar()
            && !$(e.target).hasHorizontalScrollbar()
            && !$(".fc-scroller").hasVerticalScrollbar()) {
			if (e.deltaX <= -WHEEL_THRESHOLD || e.deltaY <= -WHEEL_THRESHOLD) {
				fullCalendar.prev();
			} else if (e.deltaX >= WHEEL_THRESHOLD || e.deltaY >= WHEEL_THRESHOLD) {
				fullCalendar.next();
			}
		}
	}
});

window.addEventListener('paste', event => {
    if (!isFocusOnInputElement()) {
        initQuickAdd();
        $("#quickAddWrapper").addClass("inputEntered");
    }
});

async function reloadCalendar(params) {
    // default atleast in the context of this popup window is to ignorenotification for performance
    params.ignoreNotifications = true;
    
    try {
        const response = await sendMessageToBG("pollServer", params);
        console.log("pollserver response", response);
        await getBGObjects();
    } catch (error) {
        showCalendarError(error);
    } finally {
        if ($("html").hasClass("searchInputVisible")) {
            searchEvents();
        } else {
            if (params.refetchEvents) {
                fullCalendar?.refetchEvents();
            }
            if (await getCalendarView() == CalendarView.AGENDA) {
                initAgenda();
                hideLoading();
            }
        }
    }
}

function setStatusMessage(params) {
	var $toast = $("#eventToast");
	var duration = params.onEditClick || params.onUndoClick ? 6 : 2;

	function processOnAction(clickHandler, toastButton) {
		let $toastButton = $toast.find(toastButton);
		if (clickHandler) {
			$toastButton
				.removeAttr("hidden")
				.off()
				.click(function() {
					$toast[0].hide();
					clickHandler();
				})
			;
		} else {
			$toastButton.attr("hidden", true);
		}
	}

	processOnAction(params.onEditClick, ".toastEditEvent");
	processOnAction(params.onUndoClick, ".toastUndoEvent");
	processOnAction(params.onSetAsDefaultCalendar, ".toastSetAsDefaultCalendar");
	
	showToast({toastId:"eventToast", text:params.message, duration:duration, keepToastLinks:true});
}

async function setEventDateMessage(eventEntry) {
	let $message;

	if (eventEntry.inputSource == InputSource.QUICK_ADD) {
		var message = await formatEventAddedMessage("<span class='eventTitle' style='color:#fff38a;font-size:120%'>" + $.trim(eventEntry.summary) + "</span>", eventEntry);
	
		// for safe Firefox DOM insertion
		var messageNode = new DOMParser().parseFromString(message, "text/html").body;
		$message = $("<span/>");
		Array.from(messageNode.childNodes).forEach(node => {
			var $eventTitle = $("<span/>");
			$eventTitle.text(node.textContent);
			if (node.className) {
				$eventTitle.addClass(node.className);
			}
			if (node.style && node.style.cssText) {
				$eventTitle.attr("style", node.style.cssText);
			}
			$message.append( $eventTitle );
		});
	} else {
		$message = $("<span style='display:inline-block;min-width:100px'>" + getMessage("eventSaved") + "</span>");
	}

	let statusMessageParams = {
		message: $message,
		eventEntry: eventEntry,
		onEditClick: function() {
			showCreateBubble({event:eventEntry, editing:true});
		},
		onUndoClick: function() {
			showSaving();
			deleteEvent(eventEntry).then(async response => {
                if (fullCalendar) {
                    if (eventEntry.recurrence) {
                        fullCalendar.getEvents().forEach(event => {
                            if (eventEntry.id == event.extendedProps.jEvent.recurringEventId) {
                                event.remove();
                            }
                        });
                    } else {
                        fullCalendar.getEventById(getEventID(eventEntry)).remove();
                    }
                }
				setStatusMessage({message:getMessage("eventDeleted")});
				
				if (await getCalendarView() == CalendarView.AGENDA) {
					initAgenda();
				}
			}).catch(error => {
				showError("Error deleting event: " + error);
			}).then(() => {
				hideSaving();
			});
		}
    }
    const arrayOfCalendars = await getArrayOfCalendars();
	if (eventEntry.kind != TASKS_KIND && eventEntry.calendarId != await getDefaultCalendarId(arrayOfCalendars)) {
		statusMessageParams.onSetAsDefaultCalendar = async () => {
			if (await donationClicked("defaultCalendar")) {
				await storage.set("defaultCalendarId", eventEntry.calendarId);

				let calendar = getCalendarById(eventEntry.calendarId);
				let calendarName = getCalendarName(calendar);

				setStatusMessage({message: getMessage("defaultCalendar") + ": " + calendarName});
			}
		}
	}
	
	setStatusMessage(statusMessageParams);
}

function maybePerformUnlock(processor, callback) {
	callback();
}

function cleanICal(str) {
	if (str) {
		return str.replace(/\\/g, "");
	}
}

function initReminderLine($createEventDialog, $calendarReminder, allDay) {
	let eventReminders = $createEventDialog.find("event-reminders")[0].shadowRoot;
	let $eventReminders = $(eventReminders);

	var $reminderMinutes = $calendarReminder.find(".reminderMinutes");
	var $reminderValuePerPeriod = $calendarReminder.find(".reminderValuePerPeriod");
	var $reminderPeriod = $calendarReminder.find(".reminderPeriod");

	initReminderPeriod($reminderValuePerPeriod, $reminderPeriod, $reminderMinutes, allDay);
	
	$calendarReminder.find("paper-item").off().click(function() {
		updateReminderMinutes($reminderPeriod, $reminderMinutes, $reminderValuePerPeriod);
		$createEventDialog.data("remindersChanged", true);
	});
	
	$calendarReminder.find("paper-input").off().change(function() {
		updateReminderMinutes($reminderPeriod, $reminderMinutes, $reminderValuePerPeriod);
		$createEventDialog.data("remindersChanged", true);
	});
	
	$calendarReminder.find(".deleteReminder").off().click(function() {
		var index = $eventReminders.find(".calendarReminder").index($calendarReminder);
		// patch using .splice would corectly remove right item in the polymer object but was visually removing the last node, so must call initAllReminders
		$createEventDialog.find("event-reminders")[0].splice("reminders", index, 1);
		initAllReminders($createEventDialog, allDay).then(() => {
			$createEventDialog.data("remindersChanged", true);
		});
	});
}

function initAllReminders($createEventDialog, allDay) {
	return new Promise((resolve, reject) => {
		setTimeout(function () {

			let eventReminders = $createEventDialog.find("event-reminders")[0].shadowRoot;
			let $eventReminders = $(eventReminders);

			$createEventDialog.data("remindersChanged", false);
			$eventReminders.find(".calendarReminder").each(function () {
				var $calendarReminder = $(this);
				initReminderLine($createEventDialog, $calendarReminder, allDay);
			});

			$eventReminders.find("#addReminder").off().on("click", function () {
				var reminder;
				if (allDay) {
					reminder = { method: "popup", minutes: 1440 }; // 1 day
				} else {
					reminder = { method: "popup", minutes: 10 };
				}

				$createEventDialog.find("event-reminders")[0].push("reminders", reminder);
				$createEventDialog.data("remindersChanged", true);

				setTimeout(function () {
					initReminderLine($createEventDialog, $eventReminders.find(".calendarReminder").last(), allDay);
					$createEventDialog.find("paper-dialog-scrollable")[0].scrollTarget.scrollTop = 99999;
				}, 1)
			});

			resolve();
		}, 1);
	});
}

// created patch method to "change" reminders to maintain polymer array binding
function changeReminders(allDay, $createEventDialog, allDayReminders, timedReminders) {
	if (allDay) {
		$createEventDialog.find("event-reminders")[0].splice("reminders", 0, 99);
		allDayReminders.forEach(function(reminder) {
			$createEventDialog.find("event-reminders")[0].push("reminders", reminder);
		});
		initAllReminders($createEventDialog, true);
		$createEventDialog.data("allDay", true);
	} else {
		$createEventDialog.find("event-reminders")[0].splice("reminders", 0, 99);
		timedReminders.forEach(function(reminder) {
			$createEventDialog.find("event-reminders")[0].push("reminders", reminder);
		});
		initAllReminders($createEventDialog, false);
		$createEventDialog.data("allDay", false);
	}
}

function initColorChoice($content, colorId, color) {
	var $color = $("<div class='colorChoice'><paper-ripple center style='color:white'></paper-ripple></div>");
	$color
		.css("background", color)
		.data("colorId", colorId)
	;
	$color.click(function() {
		$("#eventColor")
			.css("background", color)
			.data("colorId", colorId)
		;
		$("#eventColorsDialog")[0].close();
	});
	$content.append($color);
}

function showEventColors(colors, calendar) {
	var $content = $("<div/>");
	
	var bgColor = colors.calendar[calendar.colorId].background;
	initColorChoice($content, null, bgColor);
	
	$content.append($("<div style='background:#aaa;width:1px;height:16px;display:inline-block;margin-right:7px'/>"));
	
	for (a in colors.event) {
		initColorChoice($content, a, colors.event[a].background);
	}
	
	var $dialog = initTemplate("eventColorsDialogTemplate");
	$dialog.find("h2").text( getMessage("eventColor") );
	$dialog.find(".dialogDescription").empty().append( $content );
	
	openDialog($dialog).then(response => {
		$dialog[0].close();
	});
	
	return $dialog;
}

function doesEventTitleHaveTime() {
	if ($("#detectTime")[0].checked) {
		const text = $("#eventTitle").val();
		return text && text.match(/\b\d/);
	}
}

function sortReminders(reminders) {
	reminders.sort(function(a, b) {
		if (parseInt(a.minutes) < parseInt(b.minutes)) {
			return -1;
		} else {
			return +1;
		}
	});
}

function isEventTimeSlotted(event) {
    const currentView = fullCalendar?.view.type;
	return !event.allDay && (currentView == getFCViewName(CalendarView.WEEK) || currentView == getFCViewName(CalendarView.DAY));
}

function showExtraFeaturesDialog() {
	return openGenericDialog({
		title: getMessage("extraFeatures"),
		content: "Creating events by clicking in the calendar is an extra feature.<br>Use the big red button instead to add events if you don't want to contribute.",
		otherLabel: getMessage("extraFeatures")
	}).then(response => {
		if (response == "other") {
			openUrl("contribute.html?action=createEvent");
		}
	});
}

function resetInviteGuestsDialog() {
    $("#inviteGuestsDialog").data("guestsLoaded", false);
	$("#inviteGuestsDialog .chip").remove();
}

async function grantContactPermission(event) {
    const tokenResponses = await storage.getEncryptedObj("tokenResponses", dateReviver);
    const tokenResponse = tokenResponses[0];
    if (tokenResponse.chromeProfile) {
        requestPermission({ email: tokenResponse.userEmail, initOAuthContacts:true }).then(() => {
            hideLoading();
            showInviteGuestsDialog(event);
        }).catch(error => {
            showError(error);
        });
    } else {
        requestPermission({ email: tokenResponse.userEmail, initOAuthContacts:true, useGoogleAccountsSignIn: true });
    }
}

async function showCreateBubble(params) {
	console.time("create");
    console.log("showCreateBubble", params);
    
    function autoSave() {
        const eventEntry = initEventEntry();
        if (eventEntry.summary || eventEntry.description) {
            console.log("autosave set: " + new Date(), params);
            storage.set("autoSave", {
                autoRestore: true,
                event: eventEntry,
                editing: params.editing
            });
        }
    }

    clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if ($("#createEventDialog").is(":visible")) {
            autoSave();
        } else {
            clearInterval(autoSaveInterval);
        }
    }, seconds(3));

    // reset guests dialog
    resetInviteGuestsDialog();

	var reminders;
	var event = params.event;

	var allDayReminders = [{
        method: "popup",
        minutes: 0
    }];

	var timedReminders = [];

	var $createEventDialog = initTemplate("createEventDialogTemplate");
	$createEventDialog.data("event", event);

	if (params.editing) {
		let calendar = getEventCalendar(event);
		if (calendar) {
			timedReminders = deepClone(calendar.defaultReminders);
		}
		$("#saveEvent").removeClass("extraFeature");
	} else {
        const arrayOfCalendars = await getArrayOfCalendars();
		let calendar = getPrimaryCalendar(arrayOfCalendars)
		if (calendar) {
			timedReminders = deepClone(calendar.defaultReminders); // used to be writeableCalendars.first()
		}
		if (!await storage.get("donationClicked")) {
			$("#saveEvent").addClass("extraFeature");
		}
	}

	function initAllDay(allDay) {
		if (allDay) {
			$("#eventStartTime").hide();
			$("#eventEndTime").hide();
		} else {
			$("#eventStartTime").show();
			$("#eventEndTime").show();
		}
	}
	
	function initEndTime(deltaMinutes) {
		var start = $("#eventStartTime").timepicker("getTime");
		var end = $("#eventEndTime").timepicker("getTime");
		
		var endTime = start.addMinutes(deltaMinutes);
		$("#eventEndTime").timepicker("setTime", endTime);
		
		// if duration times goes over the midnight then +1 to the end date
		if (!start.isSameDay(endTime)) {
			$("#eventEndDate").datepicker("setDate", $("#eventEndDate").datepicker("getDate").addDays(1));
		}
	}
	
	function initEventRemindersNode() {
		if (params.editing) {
			if (!event.reminders || event.reminders.useDefault) {
				if (event.allDay) {
					reminders = deepClone(allDayReminders);
				} else {
					reminders = deepClone(timedReminders);
				}
			} else {
				reminders = event.reminders.overrides;
			}
		} else {
			if (event.allDay) {
				reminders = deepClone(allDayReminders);
			} else {
				reminders = deepClone(timedReminders);
			}
		}
		
		if (!reminders) {
			reminders = [];
		}
		
		sortReminders(reminders);
		
		$createEventDialog.find("event-reminders").prop("reminders", reminders);
	}

	// need to re-initialize Date object here because .format was not found
	event.startTime = new Date(event.startTime);

	let selectedCalendarId;

    if (params.autoRestore || !params.copying) {
        selectedCalendarId = getEventCalendarId(event);
    }
    await initCalendarDropDown("createEventCalendarTemplate", selectedCalendarId );

    async function initTaskLists(event) {
        const taskLists = cachedFeeds["taskLists"];
        let taskListToSelect = getTaskList(event);
        if (!taskListToSelect) {
            taskListToSelect = taskLists.items.first();
        }

        // template will only exist the first time because i overwrite it with the dom once initiated
        const taskListTemplateId = "createEventTaskListTemplate";
        const $template = $("#" + taskListTemplateId);
        if ($template.length) {
            var template = $template[0];
            listbox = template.content.querySelector("paper-listbox");
            
            taskLists.items.forEach(taskList => {
                var paperItem = document.createElement("paper-item");
                var textNode = document.createTextNode(taskList.title);
                paperItem.appendChild(textNode);
                paperItem.setAttribute("value", taskList.id);
                listbox.appendChild(paperItem);
            });
    
            listbox.setAttribute("selected", taskListToSelect.id);
            
            var node = document.importNode(template.content, true);
            $template.replaceWith(node);
            // need to wait for dropdown to be inserted into DOM
            await sleep(1);
        } else {
            const divId = taskListTemplateId.replace("Template", "");
            const $div = $("#" + divId);
            const $listbox = $div.find("paper-listbox");
            if ($listbox.length) {
                listbox = $listbox[0];
                listbox.selected = taskListToSelect.id;
            } else {
                throw new Error("initCalendarDropDown error: " + divId);
            }
        }
    }

    $("#createEventCalendar").attr("label", getMessage("calendar"));
	$("#createEventCalendar").find("paper-item").off().click(function() {
		initEventColor(event);
		
		// init reminders
		var allDay;
		if (params.editing) {
			allDay = $("#eventAllDay")[0].checked;
		} else {
			if (isEventTimeSlotted(event)) {
				allDay = false;
			} else {
				allDay = !doesEventTitleHaveTime();
			} 
		}
		
		var calendarId = $("#createEventCalendar").find("paper-listbox")[0].selected;
		var calendar = getCalendarById(calendarId);
		
        allDayReminders = [{
            method: "popup",
            minutes:0
        }];

		if (calendar.defaultReminders) {
			timedReminders = deepClone(calendar.defaultReminders);
		}
		
		console.log("timedReminders", timedReminders);
		
		sortReminders(timedReminders);
		
		initEventRemindersNode();
		
		changeReminders(allDay, $createEventDialog, allDayReminders, timedReminders);
	});
	
	$createEventDialog.data("allDay", event.allDay);

	let eventEndTime = event.endTime;
	if (!eventEndTime) {
		eventEndTime = new Date(event.startTime);
		if (event.allDay) {
            eventEndTime.setDate(event.startTime.getDate() + 1);
		} else {
			eventEndTime.setMinutes(eventEndTime.getMinutes() + await getDefaultEventLength());
		}
	}

	var deltaDays = Math.round(eventEndTime.diffInDays(event.startTime));
    var deltaMinutes = eventEndTime.diffInMinutes(event.startTime);
	if (deltaMinutes >= 60 * 24) { // if 1+ days then just use default length
        deltaMinutes = await getDefaultEventLength();
    }

	var datePickerStartParams = await generateDatePickerParams();
	datePickerStartParams.onSelect = function () {
		const start = $("#eventStartDate").datepicker("getDate");
		const end = $("#eventEndDate").datepicker("getDate");

		// google calendar all day events actually end the next day, so for displaying purposes we display the day before
		const date = start.addDays(deltaDays);
		if ($("#eventAllDay")[0].checked) {
			date.setDate(date.getDate() - 1);
		}
		$("#eventEndDate").datepicker("setDate", date);
	}

	// must re-init (because we could have created dialog twice by clicking several events in the same popup window session and compounding datepicker calls)
	$("#eventStartDate").datepicker("destroy");
	$("#eventStartDate").datepicker(datePickerStartParams);
	$("#eventStartDate").datepicker("setDate", event.startTime);

	var timePickerStartParams = await generateTimePickerParams();
	$("#eventStartTime").timepicker(timePickerStartParams);
	if (event.allDay) {
		$("#eventStartTime").timepicker('setTime', getNearestHalfHour());
	} else {
		$("#eventStartTime").timepicker('setTime', event.startTime);
	}
	$('#eventStartTime').off('changeTime').on('changeTime', function (e) {
		initEndTime(deltaMinutes);
	});

	var datePickerEndParams = await generateDatePickerParams();
	$("#eventEndDate").datepicker("destroy");
    $("#eventEndDate").datepicker(datePickerEndParams);
    let newEndDate;
	if (event.allDay) {
		// google calendar all day events actually end the next day, so for displaying purposes we display the day before
		const date = new Date(eventEndTime);
        date.setDate(date.getDate() - 1);
        newEndDate = date;
	} else {
        newEndDate = eventEndTime;
    }
    $("#eventEndDate").datepicker("setDate", newEndDate);
    $("#eventEndDate").data("originalDate", newEndDate);

	var timePickerEndParams = await generateTimePickerParams();
	$("#eventEndTime").timepicker(timePickerEndParams);
	if (event.allDay) {
		initEndTime(0);
	} else {
		$("#eventEndTime").timepicker('setTime', eventEndTime);
	}

	$("#eventAllDay")[0].checked = event.allDay;
	initAllDay(event.allDay);

    $("#eventAllDay").data("originalAllDayFlag", event.allDay);

	$("#eventAllDay").change(function () {
        const originalDate = $("#eventEndDate").data("originalDate");
        $("#eventEndDate").datepicker("setDate", originalDate);

        event.allDay = $("#eventAllDay")[0].checked;
        if (event.allDay) {
            initEndTime(0);
        } else {
            initEndTime(deltaMinutes);
        }
		initAllDay(event.allDay);
		changeReminders(event.allDay, $createEventDialog, allDayReminders, timedReminders);
	});

	function initDetectTimeAndReminders(showDetectTime, skipReminders, skipRecurringInit) {
        let recurrenceDropdownValue;
        
        if (params.editing) {
            recurrenceDropdownValue = $("#clickedEventDialog").data("recurrenceDropdownValue");
        } else {
            $("#clickedEventDialog").data("recurrenceDropdownValue", "");
        }

        if (!recurrenceDropdownValue) {
            recurrenceDropdownValue = "";
        }
        
        const $repeatDropdown = $("#repeat-dropdown-wrapper");
        if (recurrenceDropdownValue == "other") {
            $repeatDropdown.find("paper-item[value='other']").unhide();
        } else {
            $repeatDropdown.find("paper-item[value='other']").hidden();
        }

        if (!skipRecurringInit) {
            $repeatDropdown.find("paper-listbox")[0].selected = recurrenceDropdownValue;
        }

		if (showDetectTime) {
            $("#detectTimeWrapper .repeat-placeholder").append($repeatDropdown);

			$("#eventStartEndTimeWrapper").hidden();
			$("#detectTimeWrapper").unhide();
			if (!skipReminders && $createEventDialog.data("allDay")) {
				changeReminders(false, $createEventDialog, allDayReminders, timedReminders);
			}
		} else {
            $("#eventStartEndTimeWrapper .repeat-placeholder").append($repeatDropdown);

			$("#eventStartEndTimeWrapper").unhide();
			$("#detectTimeWrapper").hidden();
			if (!skipReminders && !$createEventDialog.data("allDay")) {
				changeReminders(true, $createEventDialog, allDayReminders, timedReminders);
			}
		}
	}

	// remember this because we can't detect time using quickadd when spanning multiple days
    const spansMultipeDays = event.allDay && event.startTime && event.endTime && !event.startTime.isSameDay(event.endTime);
    const detectTime = await storage.get("detectTime") && !params.autoRestore;

	if (params.editing) {
		initDetectTimeAndReminders(false, true);
	} else {
		const detectTimeFlag = detectTime && !spansMultipeDays && !isEventTimeSlotted(event);
        initDetectTimeAndReminders(detectTimeFlag, true);

		// default to checked
		$("#detectTime")[0].checked = true;
		$("#detectTime").change(function (e) {
			if (!$(this)[0].checked) {
				$("#eventTitle").prop("placeholder", getMessage("quickAddDefaultTextMultipleDays"));
				initDetectTimeAndReminders(false);
				$("#eventTitle").focus();
			}
		});
	}
	
	console.timeEnd("create")
	
    // must use keypress to detect enter (not keyup because ime japanense issue: https://jasonsavard.com/forum/discussion/comment/8236#Comment_8236)
    // v2 hopefully resolved by checking isComposing
	$createEventDialog.find("#eventTitle").off()
		.keyup(function(e) { // use keyup to detect backspace/cleared text
			if (e.key === "Escape") {
				$createEventDialog[0].close();
			} else {
				// check that we are not in weekview ie. must be a allDay event
				if (event.allDay && $(this).attr("id") == "eventTitle") {
					if (detectTime && !spansMultipeDays && doesEventTitleHaveTime()) {
						initDetectTimeAndReminders(true, false, true);
					} else {
						initDetectTimeAndReminders(false, false, true);
					}
				}
			}
		})
		.keydown(function(e) {
            console.log("keydown", e);
			if (e.key === "Enter" && !e.originalEvent.isComposing) {
				$createEventDialog.find("paper-button[dialog-confirm]").trigger("click");
				// patch: seems when select time slots in weekview and pressing enter, that the dialog would not close
				$createEventDialog[0].close();
            } else if (e.ctrlKey && e.key == "s") {
                if ($("#saveEvent").is(":visible")) {
                    $("#saveEvent").trigger("click");
                    e.preventDefault();
                }
            }
		})
	;
	
	$createEventDialog.off("iron-overlay-opened").on("iron-overlay-opened", function() {
		// patch: seems iron-overlay-opened was also being called after selecting a drop dron in the dialog (ie. the notifications)
		console.log("iron-overlay-opened");
		if (window.eventDialogStatus != "opened") {

            if (event.kind != TASKS_KIND) {
                initEventColor(event);
            }

			$createEventDialog.find("#eventTitle").focus();
			window.eventDialogStatus = "opened";
		}
	});

	$createEventDialog.off("iron-overlay-closed").on("iron-overlay-closed", function(e) {
		console.log("iron-overlay-closed", e.originalEvent.detail);
		// patch: refer to iron-overly-opened
		// detect that we really closed the overlay: canceled = false
		if (!e.originalEvent.detail.canceled) {
			window.eventDialogStatus = "closed";
        }
        storage.remove("autoSave");
	});

	function initEventEntry() {
		let eventEntry;

		if ($("#detectTime").is(":visible") && doesEventTitleHaveTime()) {
			eventEntry = new EventEntry();
			eventEntry.startTime = event.startTime;
		} else {
            eventEntry = deepClone(event);
			eventEntry.allDay = $("#eventAllDay")[0].checked;
			eventEntry.startTime = $("#eventStartDate").datepicker("getDate");
            if (!$("#createEventDialog").hasClass("task-selected")) {
                eventEntry.endTime = $("#eventEndDate").datepicker("getDate");

                // google calendar all day events actually end the next day, so for displaying purposes we display the day before - now we must submit as next day
                if ($("#eventAllDay")[0].checked) {
                    eventEntry.endTime.setDate(eventEntry.endTime.getDate() + 1);
                }
            }

			function mergeTime(date, time) {
				date.setHours(time.getHours());
				date.setMinutes(time.getMinutes());
				date.setSeconds(time.getSeconds());
				date.setMilliseconds(time.getMilliseconds());
			}
			// since timepicker always returns current date we must instead use the date from the date picked and merge the time from the time picked
			mergeTime(eventEntry.startTime, $("#eventStartTime").timepicker("getTime"));
            if (!$("#createEventDialog").hasClass("task-selected")) {
			    mergeTime(eventEntry.endTime, $("#eventEndTime").timepicker("getTime"));
            }
        }
        
        eventEntry.summary = $("#eventTitle")[0].value;

        const originalDescHtml = $("#eventDescription").html(); //.replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'')
        const descriptionWithNewLines = originalDescHtml.replace(/<br\s*[\/]?>/gi, "\n"); // replace BRs with newline
        if (hasHtml(descriptionWithNewLines)) { // if there is still html code than revert to original html with BRs
            eventEntry.description = originalDescHtml;
        } else {
            eventEntry.description = descriptionWithNewLines
        }
        
        if ($("#createEventDialog").hasClass("task-selected")) {
            eventEntry.calendarId = TASKS_CALENDAR_OBJECT.id;
            eventEntry.taskListId = getDropDownValue($("#createEventTaskList"));
        } else {
            eventEntry.calendarId = getDropDownValue($("#createEventCalendar"));
        }
        
        const conferenceData = $("#eventConference").data("conferenceData")
        if (conferenceData === null || conferenceData) {
            eventEntry.conferenceData = conferenceData;
        }

		eventEntry.location = $("#eventLocation")[0].value;
        eventEntry.colorId = $("#eventColor").data("colorId");

        const previousRecurrenceDropdownValue = $("#clickedEventDialog").data("recurrenceDropdownValue") ?? "";
        const newRecurrenceDropdownValue = $("#repeat-dropdown-wrapper paper-listbox")[0].selected;

        if (previousRecurrenceDropdownValue != newRecurrenceDropdownValue) {
            if (newRecurrenceDropdownValue == "") {
                eventEntry.recurrence = [];
            } else if (newRecurrenceDropdownValue == "daily") {
                eventEntry.recurrence = ["RRULE:FREQ=DAILY"];
            } else if (newRecurrenceDropdownValue == "weekly") {
                eventEntry.recurrence = ["RRULE:FREQ=WEEKLY"];
            } else if (newRecurrenceDropdownValue == "monthly") {
                eventEntry.recurrence = ["RRULE:FREQ=MONTHLY"];
            } else if (newRecurrenceDropdownValue == "yearly") {
                eventEntry.recurrence = ["RRULE:FREQ=YEARLY"];
            } else if (newRecurrenceDropdownValue == "other") {
                // nothing
            }
        }

		return eventEntry;
	}
	
	$createEventDialog.find("#saveEvent").off().click(async () => {
		$createEventDialog[0].close();

        let eventEntry = initEventEntry();

        if ($("#createEventDialog").hasClass("task-selected")) {
            if (params.editing) {
                showSaving();

                const updateEventParams = {
                    eventEntry: eventEntry,
                    event: event
                };

                try {

                    const taskList = getTaskList(eventEntry);

                    // Changing task list: since API doesn't support this action, we must delete and recreate it.
                    if (taskList.id != eventEntry.taskListId) {
                        await deleteEvent(eventEntry);
                        fullCalendar.getEventById(eventEntry.id).remove();
                        insertAndLoadInCalendar(eventEntry).catch(error => {
                            // do nothing already caught inside
                        });
                    } else {
                        const response = await updateEvent(updateEventParams);
                        if (!response.cancel) {
                            fullCalendar?.refetchEvents();
    
                            setStatusMessage({ message: getMessage("eventUpdated") });
        
                            // then must pass bypassCache or else we would override the updated event seconds later
                            // seems we need this line if we move and event and then edit it - or else the display is not refreshed in the betacalendar??
                            const reloadParams = {
                                source: "editEvent",
                                bypassCache: true,
                                refetchEvents: true,
                            }
        
                            reloadParams.skipSync = true;
        
                            await reloadCalendar(reloadParams);
                        }
                    }
                } catch (error) {
                    showCalendarError(error);
                } finally {
                    hideSaving();
                }
            } else {
                insertAndLoadInCalendar(eventEntry).catch(error => {
                    // do nothing already caught inside
                });
            }
        } else {
            var source = $createEventDialog.data("source");
            if (source) {
                eventEntry.source = source;
            }
    
            if ($createEventDialog.data("remindersChanged")) {
                const reminders = $createEventDialog.find("event-reminders").prop("reminders");
                console.log("reminder: ", reminders);
                eventEntry.reminders = { useDefault: false, overrides: reminders };
            }
    
            if ($("#currentPage").data("currentPageClicked")) {
                const favIconUrl = $("#currentPage").attr("src");
                if (favIconUrl) {
                    eventEntry.extendedProperties = {};
                    eventEntry.extendedProperties.private = { favIconUrl: favIconUrl };
                }
            }
    
            // guests
            let $inviteGuestsChips = $("#inviteGuestsDialog .chip");
            if ($inviteGuestsChips.length) {
                eventEntry.attendees = [];
                $inviteGuestsChips.each(function () {
                    let attendeeChipData = $(this).data("attendee");
                    let attendee;
                    if (attendeeChipData) { // directly from google event data
                        attendee = attendeeChipData;
                    } else { // from contacts data object
                        attendeeChipData = $(this).data("data");
                        attendee = {
                            displayName: attendeeChipData.name,
                            email: attendeeChipData.email
                        }
                        if (attendeeChipData.organizer != undefined) {
                            attendee.organizer = attendeeChipData.organizer;
                        }
                        if (attendeeChipData.responseStatus != undefined) {
                            attendee.responseStatus = attendeeChipData.responseStatus;
                        }
                    }
                    eventEntry.attendees.push(attendee);
                });
            }
    
            console.log("evententry", eventEntry);
    
            const editing = params.editing && !params.copying;
            // passing eventEntry instead because want to detect attendee
            const sendNotificationsResponse = await ensureSendNotificationDialog({ event: eventEntry, action: editing ? SendNotificationsAction.EDIT : SendNotificationsAction.CREATE });
            if (!sendNotificationsResponse.cancel) {
                if (editing) {
                    showSaving();
    
                    let timeChanged = true;
    
                    if ($("#eventAllDay").data("originalAllDayFlag") == eventEntry.allDay) {
                        if (eventEntry.allDay) {
                            if (event.startTime.isSameDay(eventEntry.startTime) && event.endTime.isSameDay(eventEntry.endTime)) {
                                timeChanged = false;
                            }
                        } else {
                            if (event.startTime.isEqual(eventEntry.startTime) && event.endTime.isEqual(eventEntry.endTime)) {
                                timeChanged = false;
                            }
                        }
                    }
    
                    const updateEventParams = {
                        eventEntry: eventEntry,
                        event: event
                    };
    
                    // patch #1 to avoid deleting recurring events when specifying a start date, do not set dates and only PATCH other details
                    if (event.recurringEventId && !timeChanged) {
                        console.log("patch update for recurring events");
                        const patchFields = deepClone(eventEntry);
                        delete patchFields.start;
                        delete patchFields.end;
                        delete patchFields.recurringEventId;
                        delete patchFields.etag;
                        delete patchFields.originalStartTime;
        
                        updateEventParams.patchFields = patchFields;
                    }
    
                    updateEventParams.eventEntry.sendNotifications = sendNotificationsResponse.sendNotifications;
                    try {
                        const response = await updateEvent(updateEventParams);
                        if (!response.cancel) {
                            fullCalendar?.refetchEvents();
    
                            setStatusMessage({ message: getMessage("eventUpdated") });
        
                            // then must pass bypassCache or else we would override the updated event seconds later
                            // seems we need this line if we move and event and then edit it - or else the display is not refreshed in the betacalendar??
                            const reloadParams = {
                                source: "editEvent",
                                bypassCache: true,
                                refetchEvents: true,
                            }
        
                            // seems when modifying a recurring event to non-recurring that it would not refresh, possibly because the event id goes from id_instance to just id
                            if (eventEntry.recurrence?.length == 0) {
                                reloadParams.skipSync = true;
                            }
        
                            await reloadCalendar(reloadParams);
                        }
                    } catch (error) {
                        showCalendarError(error);
                    } finally {
                        hideSaving();
                    }
                } else {
                    eventEntry.sendNotifications = sendNotificationsResponse.sendNotifications;
    
                    insertAndLoadInCalendar(eventEntry).catch(error => {
                        // do nothing already caught inside
                    });
    
                    if (!await storage.get("donationClicked")) {
                        setTimeout(() => {
                            showExtraFeaturesDialog();
                        }, 2200);
                    }
                    storage.setDate("_createEventTested");
                }
            }
        }
	});

	$createEventDialog.find("#openEventInCalendar").off().click(async () => {
		var eventEntry = initEventEntry();

		if (params.editing) {
			openUrl(getEventUrl(event));
		} else {
            // user has NOT "selected" the time in the calendar - so parse the time from string
			if ($("#detectTime").is(":visible") && doesEventTitleHaveTime()) {
                try {
                    const response = await googleCalendarParseString({
                        text: $("#eventTitle").val(),
                        startTime: event.startTime,
                        endTime: event.endTime
                    });
                    eventEntry.summary = response.summary;
                    eventEntry.allDay = response.allDay;
                    if (response.startTime) {
                        eventEntry.startTime = response.startTime;
                        eventEntry.endTime = response.endTime;
                    }
                } catch (error) {
                    console.warn("googleCalendarParseString: " + error);
                    eventEntry.allDay = true;
                    eventEntry.startTime = event.startTime;
                }
			}
            openGoogleCalendarEventPage(eventEntry);
		}
	});

	$createEventDialog.find("#inviteGuests").off().click(async () => {
		const event = $createEventDialog.data("event");

        await cacheContactsData();
		if (contactsData && contactsTokenResponse) {
            showInviteGuestsDialog(event);
		} else {
            grantContactPermission(event);
		}
	});

	$createEventDialog.find("#cancelEvent").off().click(() => {
		$createEventDialog[0].close();
	});

    openDialog($createEventDialog);
    
    if (!params.editing && !await storage.get("donationClicked") && await storage.get("_createEventTested")) {
        showExtraFeaturesDialog().then(() => {
            $createEventDialog[0].close();
        });
    }
	
	initEventRemindersNode();
	initAllReminders($createEventDialog, event.allDay);
	
    $createEventDialog.find("#eventTitle")[0].value = event.summary;

    const selectedCalendars = await storage.get("selectedCalendars");
    const tasksSelected = isCalendarSelectedInExtension(TASKS_CALENDAR_OBJECT, email, selectedCalendars);
    
    if (tasksSelected && !params.editing) {
        $("#event-task-selection").unhide();
    } else {
        $("#event-task-selection").hidden();
    }

    function selectEvent() {
        $("#createEventDialog").removeClass("task-selected");
        $("#task-selection").removeAttr("active");
        $("#event-selection").attr("active", true);
    }

    function selectTask() {
        $("#createEventDialog").addClass("task-selected");
        $("#event-selection").removeAttr("active");
        $("#task-selection").attr("active", true);
        $("#detectTime")[0].checked = false;
        initDetectTimeAndReminders(false, true, true);
        initTaskLists(event);
    }

    if (event.kind == TASKS_KIND) {
        selectTask();
    } else {
        selectEvent();
    }

    $("#event-selection").off().on("click", function() {
        selectEvent();
    });

    $("#task-selection").off().on("click", function() {
        selectTask();
        $("#eventTitle").trigger("focus");
    });
    
    if (event.conferenceData?.conferenceSolution) {
        $("#event-conference-icon").removeAttr("icon");
        $("#event-conference-icon").attr("src", event.conferenceData.conferenceSolution.iconUri);

        const video = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "video");
        const phone = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "phone");
        const more = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "more");

        if (video) {
            $("#eventConferenceWrapper").unhide();
            $("#eventConference").text(getMessage("joinWithX", event.conferenceData.conferenceSolution.name));
            $("#eventVideoLabel").text(video.label);

            $(".copy-conference-link").off().click(() => {
                navigator.clipboard.writeText(video.uri);
                showMessage(getMessage("copiedToClipboard"));
            });
        } else {
            $("#eventConferenceWrapper").hidden();
        }
    } else {
        $("#eventVideoLabelWrapper").hidden();
    }

    $createEventDialog.find("#eventLocation")[0].value = event.location;
    let htmlDescription;
    if (event.description) {
        htmlDescription = prepareForContentEditable(event.description);
    } else {
        htmlDescription = "";
    }
    $createEventDialog.find("#eventDescription").html(htmlDescription);

	function initEventColor(event) {
		if (params.editing && event.colorId) {
			var color = colors.event[event.colorId].background;
			$createEventDialog.find("#eventColor")
				.css("background", color)
				.data("colorId", event.colorId)
			;
		} else {
			const calendar = getSelectedCalendar( $("#createEventCalendar") );
            const calendarColorObj = colors.calendar[calendar.colorId];
            if (calendarColorObj) {
                const bgColor = calendarColorObj.background;
                $createEventDialog.find("#eventColor")
                    .css("background", bgColor)
                    .data("colorId", null)
                ;
            }
		}
	}

	const tab = await getActiveTab();
    if (tab && tab.favIconUrl) {
        $("#currentPage").off();
        $("#currentPage").attr("src", tab.favIconUrl);
    } else {
        $("#currentPage").attr("icon", "link");
    }
    
    if (tab) {
        $("#currentPage").off().click(async () => {
            $(this).data("currentPageClicked", true);
            const response = await getEventDetailsFromPage(tab);
            if (!$("#eventTitle")[0].value) {
                $("#eventTitle")[0].value = response.title;
            }
            descriptionFromPage = response.description;
            let url = response.url;
            if (!url) {
                url = tab.url;
            }
            $("#eventLocation")[0].value = url;
            if (url != response.description) {
                $("#eventDescription").html(response.description);
            }
            $createEventDialog.data("source", {title:response.title, url:url});
        });
    }

	var placeHolder;
	if (event.endTime) {
		if (event.allDay) {
			placeHolder = getMessage("quickAddDefaultTextMultipleDays");
		} else {
			placeHolder = getMessage("quickAddDefaultTextMultipleHours");
		}
	} else {
		placeHolder = getMessage("quickAddDefaultText");
	}
	$("#eventTitle").prop("placeholder", placeHolder);
	
	$("#eventColor").off().click(function() {
		var calendar = getSelectedCalendar( $("#createEventCalendar") );
		showEventColors(colors, calendar);
    });

    function initConferenceDisplay(enabled, allowedConferenceType) {
        const $eventConference = $("#eventConference");

        if (enabled) {
            if (event.conferenceData) {
                // already created
                $eventConference
                    .data("conferenceData", event.conferenceData)
                    .removeAttr("disabled")
                    .attr("raised", true)
                    .text(getMessage("joinWithX", event.conferenceData.conferenceSolution.name))
                ;

                const video = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "video");
                $(".copy-conference-link").unhide();
                $("#eventVideoLabelWrapper").unhide();
                $("#eventVideoLabel")
                    .text(video.label)
                ;
            } else { // newly created
                $eventConference
                    .data("conferenceData", {
                        createRequest: {
                            requestId: getUniqueId()
                        },
                        conferenceSolutionKey: {
                            type: allowedConferenceType
                        }
                    })
                    .attr("disabled", true)
                    .removeAttr("raised")
                    .text(getMessage("videoConferencingAdded"))
                ;
                $(".copy-conference-link").hidden();
                $("#eventVideoLabelWrapper").hidden();
            }
            
            $(".eventConferenceRemove").unhide();
        } else {
            $eventConference
                .data("conferenceData", null)
                .removeAttr("disabled")
                .attr("raised", true)
                .text(getMessage("addVideoConferencing"))
            ;
            $(".copy-conference-link").hidden();
            $(".eventConferenceRemove").hidden();
            $("#eventVideoLabelWrapper").hidden();
        }
    }

    const calendar = getSelectedCalendar( $("#createEventCalendar") );
    const allowedConferenceType = calendar?.conferenceProperties?.allowedConferenceSolutionTypes?.[0];

    initConferenceDisplay(event.conferenceData?.conferenceSolution, allowedConferenceType);

    if (allowedConferenceType) {
        $("#eventConference").off().click(function() {
            initConferenceDisplay(true, allowedConferenceType);
        });

        $(".eventConferenceRemove").off().click(function() {
            initConferenceDisplay(false, allowedConferenceType);
        });

        $("#eventConferenceWrapper").unhide();
    } else {
        $("#eventConferenceWrapper").hidden();
    }

	$("#eventLocation").off().focus(function() {
		console.log("focus location")
		if (!window.initWhereAutocomplete) {
			window.initWhereAutocomplete = function() {
				console.log("initWhereAutocomplete");
				autocomplete = new google.maps.places.Autocomplete(($("#eventLocation")[0].inputElement.inputElement));
				
				// patch to activate autocomplete when focused is on input before loading code above.
				$("#eventLocation").focus();
				setTimeout(() => {
					$("#eventLocation")[0].inputElement.inputElement.focus();
				}, 50);
				
			    // When the user selects an address from the dropdown, populate the address, fields in the form.
			    autocomplete.addListener('place_changed', function() {
					console.log("place_changed");
			    	// copy the native value to the paper-input value
					$("#eventLocation")[0].value = $("#eventLocation")[0].inputElement.inputElement.value;
			    });
			}

			if (!DetectClient.isFirefox()) {
				ajax({
					type: "GET",
					url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDXReaPD426Bgnt4Aw83HGKKDdpjDFHKiQ&libraries=places&callback=initWhereAutocomplete",
					dataType: "jsonp",
					jsonp: "jsoncallback",
					timeout: seconds(5)
				}).catch(error => {
					// do nothing since it's jsonp
				});
			}
		}
    })
}

function fetchAndDisplayEvent(url) {
	// must use this method because $.getScript uses eval and is produces unsafe-eval errors
	const link = document.createElement('script');
    link.src = '/js/jquery.icalendar.js'
	link.onload = function() {
		fetchJSON(url).then(data => {
            console.log("fbdata", data);
			polymerPromise2.then(async () => {
				const $fbOverlay = initTemplate("fbOverlayTemplate");
            
                try {
                    const ical = $.icalendar.parse(data);
                    console.log(ical, ical.vevent)
                
                    const events = await getEventsWrapper();

                    // look for specific event - might have several with same name, but just copies ref https://jasonsavard.com/forum/discussion/comment/23963
                    let foundEvent = events.find(event => {
                        let fbUID;
                        if (event.extendedProperties && event.extendedProperties.private) {
                            fbUID = event.extendedProperties.private.fbUID;
                        }
                        if (ical.vevent.uid && ical.vevent.uid == fbUID) {
                            return event;
                        }
                    });

                    if (!foundEvent) {
                        foundEvent = events.find(event => event.summary == ical.vevent.summary);
                    }

                    console.log("parse fb event");
                    var start = data.indexOf("DTSTART");
                    var end = data.indexOf("DTEND");
                    
                    var dtStart;
                    var startDateOnly;
                    
                    var eventEntry = new EventEntry();

                    try {
                        dtStart = data.substring(start+8, end-2);
                        // date only found ie. DTSTART:20121016
                        if (dtStart.length <= 10) {
                            startDateOnly = parseDate(dtStart);
                            startDateOnly.setDate(startDateOnly.getDate() + 1);
                        }
                    } catch (e) {
                        console.warn("coud not parse for dtstart: ", e);
                    }
                    
                    $("#fbEventTitle").text(ical.vevent.summary);
                    
                    if (startDateOnly) {
                        ical.vevent.dtstart = startDateOnly;
                        ical.vevent.dtend = new Date(startDateOnly);
                        ical.vevent.dtend.setDate(ical.vevent.dtend.getDate() + 1);
                        eventEntry.allDay = true;
                    }

                    if (foundEvent) {
                        
                        console.log("foundEvent", foundEvent)
                        console.warn("facebook event already exists!")

                        if (foundEvent.startTime.toString() != ical.vevent.dtstart.toString()
                            || foundEvent.description != cleanICal(ical.vevent.description)
                            || foundEvent.location != cleanICal(ical.vevent.location)) {

                            const calendar = getEventCalendar(foundEvent);
                            if (isCalendarWriteable(calendar)) {
                                var $toast = $("#fbUpdateEvent");
                            
                                let $toastButton = $toast.find(".toastFBUpdateEvent");
                                $toastButton
                                    .off()
                                    .click(function() {
                                        $toast[0].hide();

                                        showSaving();
                                        updateEvent({
                                            event: foundEvent,
                                            patchFields: {
                                                startTime: ical.vevent.dtstart,
                                                description: cleanICal(ical.vevent.description),
                                                location: cleanICal(ical.vevent.location)
                                            }
                                        }).then(response => {
                                            hideSaving();
                                            if (!response.cancel) {
                                                showMessage(getMessage("done"));
                                            }
                                        }).catch(error => {
                                            showError("Error: " + error);
                                            hideSaving();
                                        });
                                    })
                                ;
                            
                                showToast({toastId:"fbUpdateEvent", text:"Facebook event details are different", duration:6, keepToastLinks:true});
                            } else {
                                console.warn("not showing fb update because calendar is not writeable")
                            }
                        }
                    } else {
                        if (await getCalendarView() == CalendarView.AGENDA) {
                            $("#fbFindDate").hidden();
                        } else {
                            $("#fbFindDate").unhide();
                            $("#fbFindDate").off().click(() => {
                                $fbOverlay.css("opacity", "0.9");
                                gotoDate({date: ical.vevent.dtstart});
                                setTimeout(() => {
                                    window.recentlySelected = true;
                                    fullCalendar?.select(ical.vevent.dtstart, ical.vevent.dtend);
                                    window.recentlySelected = false;
                                }, 800);
                            });
                        }

                        $("#fbEventDate").text(startDateOnly ? ical.vevent.dtstart.toLocaleDateStringJ() : ical.vevent.dtstart.toLocaleStringJ());

                        await initCalendarDropDown("fbAddCalendarsTemplate");

                        openDialog($fbOverlay).then(function (response) {
                            if (response == "ok") {
                                eventEntry.quickAdd = false;
                                eventEntry.summary = cleanICal(ical.vevent.summary);
                                eventEntry.description = cleanICal(ical.vevent.description);
                                eventEntry.location = cleanICal(ical.vevent.location);

                                eventEntry.startTime = ical.vevent.dtstart;
                                eventEntry.endTime = ical.vevent.dtend;

                                eventEntry.calendarId = getDropDownValue($("#fbAddCalendarsMenu"));

                                eventEntry.extendedProperties = {
                                    private: {
                                        fbUID: ical.vevent.uid
                                    }
                                };

                                insertAndLoadInCalendar(eventEntry).catch(error => {
                                    // do nothing already caught inside
                                });
                            }
                        }).catch(error => {
                            console.error(error);
                            showError("error: " + error);
                        });
                    }
                } catch (error) {
                    console.error("fb fetch error: ", error);
                    if (DetectClient.isFirefox()) {
                        showMessage("To detect Facebook events you need to disable third-party cookie blocking in Firefox", {
                            text: getMessage("moreInfo"),
                            onClick: function() {
                                openUrl("https://support.mozilla.org/kb/content-blocking");
                            }
                        });
                    } else {
                        showError("Could not detect Facebook event");
                    }
                }
			 });
		});		
	};
	link.onerror = function(e) {
		console.log("jerror loading icalendar: ", e);
	};
	document.head.appendChild(link);
}

async function insertAndLoadInCalendar(eventEntry) {
    fullCalendar?.unselect();

    console.log("insertAndLoadInCalendar: ", eventEntry);

    showSaving();
    try {
        const response = await saveEvent(eventEntry);

        setEventDateMessage(eventEntry);
        
        $("#eventTitle").val("");

        // add to events
        //events.push(eventEntry);
        //await sortEvents(events);

        const cachedFeeds = await storage.get("cachedFeeds");
        const arrayOfCalendars = await getArrayOfCalendars();

        if (eventEntry.recurrence) {
            reloadCalendar({source:"recurringEventAdded", bypassCache:true, refetchEvents:true});
        } else {
            if (await getCalendarView() == CalendarView.AGENDA) {
                initAgenda();
            } else {
                const calendar = getEventCalendar(eventEntry);
                const fcEvent = convertEventToFullCalendarEvent({
                    eventEntry: eventEntry,
                    cachedFeeds: cachedFeeds,
                    arrayOfCalendars: arrayOfCalendars
                });
                fullCalendar.addEvent(fcEvent, FULL_CALENDAR_SOURCE_ID);
            }
            
            await updateCachedFeed(eventEntry, {
                operation: "add",
                cachedFeeds: cachedFeeds
            });
        }

        return response;
    } catch (error) {
        // seems like status 500 errors are not returning details about the error and so the oauth just returns the statusText "error"
        if (error == "error") {
            showError("Intermittent error, please try again!");
        } else {
            showCalendarError(error);
        }
        throw error;
    } finally {
        hideSaving();
    }
}

async function fetchEvents(events, start, end) {
    console.log("fetchEvents");
    if (events.length == 0 || start.isBefore(getStartDateBeforeThisMonth()) || end.isAfter(await getEndDateAfterThisMonth())) {
        showLoading();
        
        console.time("fetchAllCalendarEvents");
        try {
            const response = await sendMessageToBG("fetchAllCalendarEvents", {email:email, startDate:start, endDate:end, source:"popup", bypassCache:false});
            console.timeEnd("fetchAllCalendarEvents");
            var newEvents = [];
            if (response && response.events) {
                newEvents = response.events.slice();
                newEvents.forEach(event => {
                    parseEventDates(event);
                });
            } else if (events) {
                newEvents = events.slice();
            }
            return newEvents;
        } catch (error) {
            hideLoading();
            showError("Try reload button or " + getMessage("accessNotGrantedSeeAccountOptions_accounts") + " options!", {
                text: getMessage("accessNotGrantedSeeAccountOptions_accounts"),
                onClick: function() {
                    openUrl("options.html?accessNotGranted=true#accounts");
                }
            });
            console.error("fetchEvents error", error);
        }
    } else {
        return events.shallowClone();
    }
}

function getDropDownValue($node) {
	var node = $node[0].selectedItem;
	return $(node).attr("value");
}

function getSelectedCalendar($node) {
	var calendarId = getDropDownValue($node);
	return getCalendarById(calendarId);
}

function convertFullCalendarCurrentDateToDate() {
	const date = fullCalendar.getDate();
	return date.addMinutes( date.getTimezoneOffset() );
}

async function saveQuickAdd() {
	$("#save").addClass("disabled");
	
	// Must match what timeFilte and formatContent returns
	var eventEntry = new EventEntry();
	
	if (await getCalendarView() == CalendarView.DAY) {
		// use currently selected day in day view
		eventEntry.startTime = convertFullCalendarCurrentDateToDate();
	}
	
	var summary = $("#quickAdd").val();
	if (!summary) {
		summary = getMessage("noTitle");
	}
	eventEntry.summary = summary;
	eventEntry.userInputSummary = summary;
	eventEntry.allDay = true; // default to this
	eventEntry.calendarId = getDropDownValue($("#quickAddCalendarsMenu"));
	eventEntry.inputSource = InputSource.QUICK_ADD;

	sendGA('quickadd', 'click');
	
	insertAndLoadInCalendar(eventEntry).then(response => {
		$("#quickAdd")
			.attr("placeholder", "")
			.val("")
		;
	}).catch(error => {
        // do nothing because error is handled in insertAndLoadInCalendar
        console.log("error", error);
	}).then(() => {
        closeQuickAdd();
	});
}

function closeQuickAdd() {
    $("#save").removeClass("disabled");
    $("html").removeClass("quickAddVisible");
    $("#quickAddWrapper").removeClass("inputEntered");
}

async function searchEvents() {
    showSaving();

    const calendarId = getDropDownValue($("#searchCalendarsMenu"));

    let calendarIdsToSearch = [];
    if (calendarId == "active-calendars") {
        const calendars = await getSelectedCalendarsInGoogleCalendar();
        calendarIdsToSearch = calendars.map(calendar => calendar.id);
    } else if (calendarId == "all-calendars") {
        const arrayOfCalendars = await getArrayOfCalendars({excludeTasks: true});
        calendarIdsToSearch = arrayOfCalendars.map(calendar => calendar.id);
    } else {
        calendarIdsToSearch.push(calendarId);
    }

    const promises = calendarIdsToSearch.map(calendarId => {
        return oauthDeviceSend({
            userEmail: email,
            url: "/calendars/" + encodeURIComponent(calendarId) + "/events",
            data: {
                q: $("#searchInput").val(),
                singleEvents: true,
                orderBy: "startTime",
                maxResults: 1000
            }
        })
    });

    Promise.all(promises).then(responses => {
        const searchResultEvents = [];
        responses.forEach((response, index) => {
            if (response.items.length) {
                response.items.forEach(event => {
                    console.log("result", event);
                    initEventObj(event);
                    event.calendarId = calendarIdsToSearch[index];
                    searchResultEvents.push(event);
                });
            }
        });

        if (searchResultEvents.length) {
            searchResultEvents.sort((eventA, eventB) => {
                return eventA.startTime - eventB.startTime;
            });
            displayAgenda({events:searchResultEvents, showPastEvents:true, hideMultipleDayEvents:true, hideCurrentDay:true, search:true});
        } else {
            showError("No results");
        }
    }).catch(error => {
		showCalendarError(error);
	}).then(() => {
		hideSaving();
	});
}

async function fetchAgendaEvents(params) {
	showLoading();
    console.log("start: " + params.start + " end: " + params.end);
    const events = await getEventsWrapper();
    let newEvents = await fetchEvents(events, params.start, params.end);
    if (newEvents) {
        // deep down ... fetchCalendarEvents could pull events (cached, invisible etc.) that are outside of the start/stop parameters here
        // so let's restrict it here
        var indexOfEventWhichObeysStartTime = null;
        newEvents.some(function(newEvent, index) {
            if (indexOfEventWhichObeysStartTime == null && (newEvent.startTime.toJSON() == params.start.toJSON() || newEvent.startTime.isAfter(params.start))) {
                indexOfEventWhichObeysStartTime = index;
                return true;
            }
        });
        
        console.log("indexOfEventWhichObeysStartTime: " + indexOfEventWhichObeysStartTime);
        if (indexOfEventWhichObeysStartTime != null) {
            newEvents = newEvents.slice(indexOfEventWhichObeysStartTime);
        }
        
        params.newEvents = newEvents;
        displayAgenda(params);
        hideLoading();
    }
}

async function initAgenda() {
    fetchingAgendaEvents = true;
    // tried using asyncs for displayAgenda but caused flicker issue when scrollToToday
	displayAgenda({showStartingToday:true});
	await polymerPromise2;
    // IF agenda has more events then load all the rest
    if (scrollTarget && scrollTarget.scrollHeight > $("body").height()) {
        await displayAgenda({scrollToToday:true});
    }
    fetchingAgendaEvents = false;
}

async function displayAgenda(params = {}) {
   	// patch to prevent empty scrollbar in Chrome 72
	$("#mainContent").height(calculateCalendarHeight());

    const cachedFeeds = await storage.get("cachedFeeds");
	const selectedCalendars = await storage.get("selectedCalendars");
    const calendarSettings = await storage.get("calendarSettings");
    const showDeclinedEvents = calendarSettings.showDeclinedEvents;
    const hideInvitations = calendarSettings.hideInvitations;
    const arrayOfCalendars = await getArrayOfCalendars();
    const defaultCalendarId = await getDefaultCalendarId(arrayOfCalendars);
    const dimPastDays = await storage.get("pastDays");
    const showEventIcons = await storage.get("showEventIcons");

	console.log("displayagenda params", params);

	// to enable waterfall effect
	$("app-header-layout app-header")[0].scrollTarget = scrollTarget;
	
	var eventsToDisplay;
	var dateToDisplay;
	if (params.newEvents) {
		eventsToDisplay = params.newEvents;
		if (eventsToDisplay.length) {
			dateToDisplay = eventsToDisplay.first().startTime;
		} else {
			dateToDisplay = new Date();
		}
	} else {
		if (params.events) {
			eventsToDisplay = params.events;
		} else {
			/*
			eventsToDisplay = events.filter(function(event) {
				if (event.endTime.diffInDays() >= -2) { //  && event.endTime.diffInDays() <= 7
					return true;
				}
			});
			*/
			/*
			eventsToDisplay = [];
			events.some((event) => {
				if (event.startTime.diffInDays() >= -2) {
					eventsToDisplay.push(event);
				}
				if (eventsToDisplay.length > 50) {
					return true;
				}
			});
			*/
			eventsToDisplay = await getEventsWrapper();
		}
		dateToDisplay = new Date();
	}

	displayAgendaHeaderDetails(dateToDisplay);
	
	$("#calendarTitleToolTip").text("");
	
	var $agendaEvents = $("#agendaEvents");
	var $agendaEventsForThisFetch = $("<div></div>");

	if ((!params.append && !params.prepend) || params.forceEmpty) {
		$agendaEvents.empty();
	}
	
	var previousEvent;
	var $agendaDay;
	var $firstEventOfTheDay;
	var hasAnEventToday;
	var addedPlaceHolderForToday;

    if (dimPastDays) {
        $agendaEvents.addClass("highlightPastDays");
    } else {
        $agendaEvents.removeClass("highlightPastDays");
    }

    function displayAgendaEvents(eventParams) {
        const events = eventParams.events;
        
        $.each(events, (index, event) => {
			
			if (params.hideCurrentDay !== true && !params.newEvents && !hasAnEventToday && !addedPlaceHolderForToday && (event.startTime.isTomorrow() || event.startTime.isAfter(tomorrow()))) {
				addedPlaceHolderForToday = true;
				
				const placeHolderForTodayEvent = new EventEntry();
				placeHolderForTodayEvent.summary = getMessage("nothingPlanned");
				placeHolderForTodayEvent.startTime = today();
				placeHolderForTodayEvent.endTime = tomorrow();
				placeHolderForTodayEvent.allDay = true;
				placeHolderForTodayEvent.calendarId = defaultCalendarId;
				placeHolderForTodayEvent.placeHolderForToday = true;
				
				displayAgendaEvents({events:[placeHolderForTodayEvent]});
			}
			
			if (index >= 20) {
				//return false;
			}
			
			// optimize for speed by skipping over before today events
			if (params.showStartingToday && event.endTime?.isBefore(today())) {
				return true;
			}
			
			var calendarSelected;
			var calendar = getEventCalendar(event);
			var eventTitle = getSummary(event);
			
			calendarSelected = isCalendarSelectedInExtension(calendar, email, selectedCalendars);
			
			if ((eventTitle && (calendarSelected || params.search) && passedShowDeclinedEventsTest(event, showDeclinedEvents, email) && passedHideInvitationsTest(event, hideInvitations, email)) || event.placeHolderForToday) {

				if (event.startTime.isToday()) {
					hasAnEventToday = true;
				}
				
				if (!eventParams.multipleDayEventsFlag) {
					if (!previousEvent || event.startTime.toDateString() != previousEvent.startTime.toDateString()) {
						
						// different month detection
						if (!previousEvent) {
							if (!params.prepend) {
								var lastEventData = $agendaEvents.find(".agendaDay").last().data();
								if (lastEventData) {
									previousEvent = lastEventData.event;
									console.log("previous event", previousEvent.summary);
								}
							}
						}
						
						if (previousEvent && previousEvent.startTime.isBefore(event.startTime) && (previousEvent.startTime.getMonth() != event.startTime.getMonth() || previousEvent.startTime.getYear() != event.startTime.getYear())) {
							console.log("prev event: ", previousEvent.summary, event.startTime.format("mmm"));
							
							const formatOptions = {
                                month: "short"
                            }

							if (event.startTime.getYear() != new Date().getYear()) {
								formatOptions.year = "numeric";
                            }
                            
							$agendaEventsForThisFetch.append( $("<div class='agendaMonthHeader'/>").append(event.startTime.toLocaleDateString(locale, formatOptions) ) );
						}
						
						var $agendaDateWrapper = $("<div class='agendaDateWrapper'/>");
						var $agendaDate = $("<div class='agendaDate'/>");

						if (params.showPastEvents) {
							$agendaDate.text( event.startTime.format("d mmm yyyy, ddd") );
							$agendaDateWrapper.append( $agendaDate );
						} else {
							$agendaDate.text( event.startTime.getDate() );
							$agendaDateWrapper.append( $agendaDate );
							const $agendaDateDay = $("<div/>").append( dateFormat.i18n.dayNamesShort[event.startTime.getDay()] );
							$agendaDateWrapper.append( $agendaDateDay );
						}
						
						$agendaDay = $("<div class='agendaDay horizontal layout'/>");
						$agendaDay.append($agendaDateWrapper);
						$agendaDay.append( $("<div class='agendaDayEvents flex'/>") );
						$agendaDay.data({event:event});
						if (event.startTime.isToday()) {
							$agendaDay.addClass("today");
						} else if (event.startTime.isBefore() && !params.showPastEvents) {
							//$agendaDay.attr("hidden", "");
						}
						
						$agendaEventsForThisFetch.append($agendaDay);
						
						if (!params.hideMultipleDayEvents) {
							// find any previous multiple day events
							var multipleDayEvents = [];
							for (var a=index-1; a>=0; a--) {
								var thisEvent = events[a];
								if ((isCalendarSelectedInExtension(getEventCalendar(thisEvent), email, selectedCalendars) || params.search) && thisEvent.endTime?.isAfter(event.startTime)) {
									//console.log("multiple day: " + event.startTime.getDate() + " " + event.startTime + " " + thisEvent.summary + " " + thisEvent.startTime + " " + thisEvent.endTime);
									//console.log("same day: " + thisEvent.endTime.isSameDay(event.startTime) + " after endtime: " + thisEvent.endTime.isAfter(event.startTime))
									multipleDayEvents.push(thisEvent);
								}
							}
							displayAgendaEvents({events:multipleDayEvents, multipleDayEventsFlag:true});
						}
					}
				}
				
                var $agendaEventTitleWrapper = $("<div class='agendaEventTitleWrapper'/>");
                
                const $eventTitleOnly = $("<div/>");

				var $eventIcon = $("<span class='eventIcon'/>");
				
				if (event.startTime.diffInDays() >= 0 && event.startTime.diffInDays() <= 3) { // only 3 days because the regex filtering for words slows down the display
                    if (showEventIcons) {
                        setEventIcon({
                            event: event,
                            $eventIcon: $eventIcon,
                            cachedFeeds: cachedFeeds,
                            arrayOfCalendars: arrayOfCalendars
                        });
                    }
					$eventTitleOnly.append( $eventIcon );
				}
                
				$eventTitleOnly.append( $(`<span class='agendaEventTitle ${event.kind == TASKS_KIND ? "task" : ""}'/>`).text(eventTitle) );
				if (eventParams.multipleDayEventsFlag) {
					$eventTitleOnly.append( $("<span style='margin-left:5px'/>").text("(" + getMessage("cont") + ")") );
                }

                if (event.recurringEventId) {
                    const $recurringImg = $("<img class='repeating' src='images/repeating.png'/>");
                    $recurringImg.attr("title", getMessage("recurringEvent"));
                    $eventTitleOnly.append( $recurringImg );
                }
                
                $agendaEventTitleWrapper.append($eventTitleOnly);
				
				if (event.allDay) {
					if (event.location) {
						$agendaEventTitleWrapper.append( $("<div class='agendaEventLocation'/>").text(event.location) );
					}
				} else {
					$agendaEventTitleWrapper.append( $("<div class='agendaEventTime'/>").text(generateTimeDurationStr({event:event, hideStartDay:true})));
					if (event.location) {
						$agendaEventTitleWrapper.append( $("<div class='agendaEventLocation'/>").text(event.location) );
					}
				}
				if (event.hangoutLink || event.conferenceData) {
					$agendaEventTitleWrapper.append( $("<div class='agendaEventVideo'/>").text("Video call") );
				}

                const $eventNode = $("<div>");

                if (event.status == TaskStatus.COMPLETED) {
                    $eventNode.addClass("task-completed");
                }

                const currentUserAttendeeDetails = getCurrentUserAttendeeDetails(event, email);
                if (currentUserAttendeeDetails) {
                    const className = getClassForAttendingStatus(currentUserAttendeeDetails.responseStatus);
                    $eventNode.addClass(className);
                }

				$eventNode.append( $agendaEventTitleWrapper );
				if (event.placeHolderForToday) {
					$eventNode.addClass("placeHolderForToday");
					$eventNode.append($("<paper-ripple>"));
				} else {
					const eventColors = getEventColors({
                        event: event,
                        cachedFeeds: cachedFeeds,
                        arrayOfCalendars: arrayOfCalendars
                    });

					$eventNode
						.addClass("agendaEvent")
						.css({"color": eventColors.fgColor, "background-color": eventColors.bgColor})
					;
				}
				$eventNode.click(function() {
					if (event.placeHolderForToday) {
						var eventEntry = new EventEntry();
						eventEntry.allDay = true;
						eventEntry.startTime = today();
						showCreateBubble({event:eventEntry});
					} else {
						if (document.body.clientWidth >= 500) {
							showDetailsBubble({event:event, $eventNode:$eventNode});
						} else {
							openUrl(getEventUrl(event));
						}
					}
				})
                
				if (event.endTime?.isBefore()) {
                    $eventNode.addClass("pastEvent");
				}
				
				$agendaDay.find(".agendaDayEvents").append($eventNode);
				
				if (!$firstEventOfTheDay && (event.startTime.isToday() || event.startTime.isAfter())) {
					$firstEventOfTheDay = $agendaDay;
				}
				
				previousEvent = event;
			}
		});
	}
	
	console.time("displayAgendaEvents");
	displayAgendaEvents({events:eventsToDisplay});
	console.timeEnd("displayAgendaEvents");
	
	var BUFFER = 0;
	
	if (params.prepend) {
		$agendaEvents.prepend($agendaEventsForThisFetch);
		scrollTarget.scrollTop += $agendaEventsForThisFetch.height() + BUFFER;
	} else {
		$agendaEvents.append($agendaEventsForThisFetch);
	}
	
	// only scroll into view first time (when no data().events) exist)
	if ((!$agendaEvents.data().events && $firstEventOfTheDay && $firstEventOfTheDay.length) || params.scrollToToday) {
		window.autoScrollIntoView = true;
		
		$firstEventOfTheDay[0].scrollIntoView();
		// patch: seems that .scrollIntoView would scroll the whole body up and out of frame a bit so had to execute a 2nd one on the panel
		$("app-header-layout")[0].scrollIntoView();
		
		// commented because using padding-top on .today event instead
		/*
		var currentScrollTop = $('[main]')[0].scroller.scrollTop;
		if (currentScrollTop >= BUFFER) {
			$('[main]')[0].scroller.scrollTop -= BUFFER;
		}
		*/
		
		// patch: seems that in the detached window the .scrollIntoView would scroll the whole body up and out of frame a bit, so just repaint the body after a little delay and the issue is fixed
		/*
		$("html").hide();
		setTimeout(function() {
			$("html").show();
		}, 1)
		*/
		
		// make sure the .scroll event triggers before i set it to false
		setTimeout(function() {
			window.autoScrollIntoView = false;
		}, 50);
	}
	
	$agendaEvents
		.data({events:eventsToDisplay})
	;
}

function initCalendarView(viewName) {
	var calendarViewValue;
	
	if (viewName == CalendarView.AGENDA) {
		calendarViewValue = "agenda";
	} else {
		calendarViewValue = viewName;
	}
	$("html").attr("calendarView", calendarViewValue);
}

function fcChangeView(viewName) {
    fullCalendar.setOption("eventLimit", true);
    fullCalendar.changeView(getFCViewName(viewName));
}

async function changeCalendarView(viewName) {
	let previousCalendarView = await getCalendarView();

	if (viewName != previousCalendarView) {
		await storage.set("calendarView", viewName)
		
		// patch if previous view was basicDay (ie. my custom agenda view) then we must reload the betaCalendar because it was hidden and not properly initialized
		if ((previousCalendarView == CalendarView.AGENDA && viewName != CalendarView.AGENDA) || previousCalendarView == CalendarView.LIST_WEEK || viewName == CalendarView.LIST_WEEK) {
			location.reload(true);
		} else {
			
			initCalendarView(viewName);
			
			if (viewName == CalendarView.AGENDA) {
				initAgenda();
			} else {
				fcChangeView(viewName);
			}
		}
	}
	
	initOptionsMenu();
}

async function initOptionsMenu() {
	$("#options-menu paper-icon-item").removeClass("iron-selected");
	
	const calendarView = await getCalendarView();
	
	if (calendarView == CalendarView.AGENDA) {
		$("#viewAgenda").addClass("iron-selected");
	} else if (calendarView == CalendarView.LIST_WEEK) {
		$("#viewListWeek").addClass("iron-selected");
	} else if (calendarView == CalendarView.DAY) {
		$("#viewDay").addClass("iron-selected");
	} else if (calendarView == CalendarView.WEEK) {
		$("#viewWeek").addClass("iron-selected");
	} else if (calendarView == CalendarView.MONTH) {
		$("#viewMonth").addClass("iron-selected");
	} else if (calendarView == CalendarView.CUSTOM) {
		$("#viewCustom").addClass("iron-selected");
	}
}

function hasHtml(str) {
    return str && (str.includes("<") || str.includes(">"));
}

function hasMicrosoftTeamLinks(str) {
    return str.includes("<https:");
}

function prepareForContentEditable(str) {
    if (str) {
        if (hasHtml(str) && !hasMicrosoftTeamLinks(str)) {
            return str;
        } else {
            str = str.replaceAll("\n", "<br>");

            // Search for Microsoft Teams links ie. Click here to join the meeting<https: teams.microsoft.com="" l="" meetup-join="" 19%3ameeting_njdimtfmyjytntfhmy00mdfklwexztutndjlzdgwzdu2m2i3%40thread.v2="" 0?context="%7b%22Tid%22%3a%2259185728-a5f6-4629-bfc4-3c833d60489a%22%2c%22Oid%22%3a%22e842bfbb-ca3b-4f1e-86c8-6646cca6751b%22%7d">
            if (hasMicrosoftTeamLinks(str)) {
                const matches = str.match(/<https.+?>/g);
                matches?.forEach(match => {
                    let newStr = match.replace("<https: ", "-> <a href='https://");
                    newStr = newStr.replaceAll("=\"\" ", "/");
                    newStr = newStr.replaceAll("\"", "");
                    newStr = newStr.replace(/\>$/, "\'\>link</a>");

                    str = str.replaceAll(match, newStr);
                });
            }

            return str;
        }
    }
}

function sortAttendees(event) {
    event.attendees.sort((a, b) => {
        const displayName = a.displayName ?? a.email;
        const displayName2 = b.displayName ?? b.email;
        if (a.organizer && !b.organizer) {
            return -1;
        } else if (!a.organizer && b.organizer) {
            return +1;
        } else {
            return displayName.localeCompare(displayName2, locale, {ignorePunctuation: true});
        }
    });
}

async function getContactDisplayName(contact) {
    let displayName = contact.displayName;
    if (!displayName) {
        const account = generateAccountStub(email);
        if (typeof contacts === "undefined") {
            contacts = await getContacts({ account: account });
        }
        const contactData = await getContact({email: contact.email, account: account});
        if (contactData) {
            displayName = contactData.name;
        } else {
            displayName = contact.email;
        }
    }
    return displayName;
}

async function showDetailsBubble(params) {
	console.log("showdetailsbubble", params);
	
	var event = params.event;
	var calendar = getEventCalendar(event);
    var isSnoozer;
    
    const cachedFeeds = await storage.get("cachedFeeds");
    const arrayOfCalendars = await getArrayOfCalendars();
	
	if (params.calEvent?.extendedProps?.isSnoozer) {
		isSnoozer = true;
	}
	
    const $dialog = initTemplate("clickedEventDialogTemplate");
    const $scrollerArea = $dialog.find("paper-dialog-scrollable")
    if ($scrollerArea.length && $scrollerArea[0].updateScrollState) {
        $scrollerArea[0].updateScrollState();
    }

	var title = getSummary(event);
	
	if (isSnoozer) {
		title += " (snoozed)";
	}

    if (calendar.id == TASKS_CALENDAR_OBJECT.id) {
        $dialog.addClass("task-selected");
        if (event.status == TaskStatus.COMPLETED) {
            $dialog.addClass("task-completed");
        } else {
            $dialog.removeClass("task-completed");
        }
    } else {
        $dialog.removeClass("task-selected");
    }
	
	var $editingButtons = $dialog.find("#clickedEventDelete, #clickedEventEdit, #clickedEventColor, #clickedEventDuplicate");
	if (isCalendarWriteable(calendar)) {
		$editingButtons.show();
		$("#copyToMyCalendar").attr("hidden", true);

        if (calendar.id == TASKS_CALENDAR_OBJECT.id) {
            $("#clickedEventColor, #clickedEventDuplicate").hide();
        }
	} else {
		$editingButtons.hide();
		
		// exeption we can delete snoozes
		if (isSnoozer) {
			$dialog.find("#clickedEventDelete").show();
		} else {
			$("#copyToMyCalendar").unhide();
		}
	}
	
	var $eventIcon = $dialog.find(".eventIcon");
    $eventIcon.empty();
    if (await storage.get("showEventIcons")) {
        setEventIcon({
            event: event,
            $eventIcon: $eventIcon,
            cachedFeeds: cachedFeeds,
            arrayOfCalendars: arrayOfCalendars
        });
    }
	
	$dialog.find("#clickedEventTitle")
		.text(title)
		.css("color", getEventColors({
            event: event,
            darkenColorFlag: true,
            cachedFeeds: cachedFeeds,
            arrayOfCalendars: arrayOfCalendars
        }))
		.off().click(function() {
			if (isCalendarWriteable(calendar)) {
				$dialog.find("#clickedEventEdit").click();
			} else {
				niceAlert("You can't edit this event!");
			}
		})
    ;

    const $clickedEventRecurring = $dialog.find("#clickedEventRecurring");
    
    if (event.recurringEventId) {
        $clickedEventRecurring
            .html("&nbsp;") // placeholder
            .unhide()
        ;

        oauthDeviceSend({
            userEmail: email,
            url: `/calendars/${encodeURIComponent(await getCalendarIdForAPIUrl(event))}/events/${event.recurringEventId}`
        }).then(response => {
            console.log("recurring event", response);
            const firstRule = response.recurrence?.[0];
            let recurrenceDropdownValue;
            if (firstRule?.includes("DAILY")) {
                recurrenceDropdownValue = "daily";
                $clickedEventRecurring.text(getMessage("daily"));
            } else if (firstRule?.includes("WEEKLY")) {
                recurrenceDropdownValue = "weekly";
                $clickedEventRecurring.text(getMessage("weekly"));
            } else if (firstRule?.includes("MONTHLY")) {
                recurrenceDropdownValue = "monthly";
                $clickedEventRecurring.text(getMessage("monthly"));
            } else if (firstRule?.includes("YEARLY")) {
                recurrenceDropdownValue = "yearly";
                $clickedEventRecurring.text(getMessage("annually"));
            } else { // might have more or different rules
                recurrenceDropdownValue = "other";
                $clickedEventRecurring.text(getMessage("recurringEvent"));
            }

            $dialog.data("recurrenceDropdownValue", recurrenceDropdownValue);
        }).catch(error => {
            console.warn("issue fetching recurring event", error);
        });
    } else {
        $dialog.data("recurrenceDropdownValue", "");
        $clickedEventRecurring.hidden();
    }
    
	$dialog.find("#clickedEventDate").text(generateTimeDurationStr({event:event}));

	if (calendar.primary || event.kind == TASKS_KIND) {
		$dialog.find("#clickedEventCalendarWrapper").attr("hidden", true);
	} else {
		$dialog.find("#clickedEventCalendar").text(calendar.summary);
		$dialog.find("#clickedEventCalendarWrapper").unhide();
	}

	if (!event.creator || event.creator.self) {
		$dialog.find("#clickedEventCreatedByWrapper").attr("hidden", true);
	} else {
        cacheContactsData().then(async () => {
            console.log("creator", event);
            const displayName = await getContactDisplayName(event.creator);
            const $creator = $("<a/>")
                .text(displayName ?? event.creator.email)
                .attr("href", "mailto:" + event.creator.email)
                .attr("target", "_blank")
                .attr("title", event.creator.email)
            ;
            $dialog.find("#clickedEventCreatedBy").empty().append($creator);
            $dialog.find("#clickedEventCreatedByWrapper").unhide();
        });
	}

	var eventSource = getEventSource(event, false);

	var locationUrl;
	var locationTitle;
	
	// if source and location are same then merge them
	if (eventSource && eventSource.url == event.location) {
		$dialog.find("#clickedEventLocationWrapper").attr("hidden", true);
	} else {
		if (event.location) {
			locationUrl = event.location;
			locationTitle = event.location;

			$dialog.find("#clickedEventLocationMapLink")
				.text(locationTitle)
                .attr("href", generateLocationUrl(event))
			;
			$dialog.find("#clickedEventLocationWrapper").unhide();
		} else {
			$dialog.find("#clickedEventLocationWrapper").attr("hidden", true);
		}
	}
	
	if (eventSource) {
		// show logo for this type of source 
		var $fieldIcon = $dialog.find("#clickedEventSourceWrapper .fieldIcon");
		$fieldIcon
			.removeAttr("icon")
			.removeAttr("src")
		;
		if (eventSource.isGmail) {
			$fieldIcon.attr("icon", "mail");
		} else if (event.extendedProperties && event.extendedProperties.private && event.extendedProperties.private.favIconUrl) {
			$fieldIcon.attr("src", event.extendedProperties.private.favIconUrl);
		} else {
			$fieldIcon.attr("icon", "maps:place");
		}
		
		$dialog.find("#clickedEventSourceLink")
			.text(eventSource.title)
			.attr("href", eventSource.url)
			.attr("title", eventSource.url)
		;
		$dialog.find("#clickedEventSourceWrapper").unhide();
	} else {
		$dialog.find("#clickedEventSourceWrapper").attr("hidden", true);
	}

    const hangoutLink = event.hangoutLink;
    const zoomMeetingId = event.extendedProperties?.shared?.zmMeetingNum;

	if (hangoutLink) {
		$dialog.find("#clickedEventVideoLink").attr("href", hangoutLink);
        $dialog.find("#clickedEventVideoWrapper").unhide();
    } else if (zoomMeetingId) {
		$dialog.find("#clickedEventVideoLink").attr("href", `https://zoom.us/j/${zoomMeetingId}`);
        $("#joinVideoCallButton").text(getMessage("joinWithX", "Zoom"));
        $dialog.find("#clickedEventVideoWrapper").unhide();
	} else {
		$dialog.find("#clickedEventVideoWrapper").hidden();
    }
    
    if (event.conferenceData?.createRequest?.status?.statusCode == "pending") {
        $("#joinVideoCallButton").text("");
        $("#clickedEventVideoLabel").text("Refresh to see conference data");
        $("#clickedEventVideoLinkWrapper").unhide();

        $("#clickedEventVideoWrapper").hidden();
        $("#clickedEventPhoneWrapper").hidden();
        $("#clickedEventConferenceMoreWrapper").hidden();
    } else if (event.conferenceData?.conferenceSolution) {
        $("#conference-icon").removeAttr("icon");
        $("#conference-icon").attr("src", event.conferenceData.conferenceSolution.iconUri);
    
        const video = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "video");
        const phone = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "phone");
        const more = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "more");

        function getConferenceCodes(entryPoint) {
            let str = "";
            if (entryPoint.meetingCode) {
                if (str) {
                    str += "<br>";
                }
                str += `ID: ${entryPoint.meetingCode}`;
            }
            if (entryPoint.accessCode) {
                if (str) {
                    str += "<br>";
                }
                str += `Access code: ${entryPoint.accessCode}`;
            }
            if (entryPoint.passcode) {
                if (str) {
                    str += "<br>";
                }
                str += `Passcode: ${entryPoint.passcode}`;
            }
            if (entryPoint.password) {
                if (str) {
                    str += "<br>";
                }
                str += `Password: ${entryPoint.password}`;
            }
            if (entryPoint.pin) {
                if (str) {
                    str += "<br>";
                }
                str += `${getMessage("PIN")}: ${phone.pin}`;
            }
            return str;
        }

        if (video) {
            $("#clickedEventVideoLinkWrapper").unhide();
            if (video.uri) {
                $("#clickedEventVideoLink").attr("href", video.uri);
            }
            $("#joinVideoCallButton").text(getMessage("joinWithX", event.conferenceData.conferenceSolution.name));
            $("#clickedEventVideoWrapper").unhide();
            
            let label = video.label ?? "";

            // patch don't dislay zoom links they are long and ugly, but it's ok to display meets links (just like google calendar does)
            if (label.includes("zoom.")) {
                label = "";
            }

            label += getConferenceCodes(video);
            $("#clickedEventVideoLabel").html(label);

            $(".copy-conference-link").off().click(() => {
                navigator.clipboard.writeText(video.uri);
                showMessage(getMessage("copiedToClipboard"));
            });
        } else {
            $("#clickedEventVideoLinkWrapper").hidden();
        }

        if (phone) {
            $("#clickedEventPhoneWrapper").unhide();
            $("#clickedEventPhone").attr("href", phone.uri);

            let label = phone.label ?? "";
            label += getConferenceCodes(phone);
            $("#clickedEventPhoneLabel").html(label);
        } else {
            $("#clickedEventPhoneWrapper").hidden();
        }

        if (more) {
            $("#clickedEventConferenceMoreWrapper").unhide();
            $("#clickedEventConferenceMoreLabel").attr("href", more.uri);
        } else {
            $("#clickedEventConferenceMoreWrapper").hidden();
        }
    } else {
        $("#clickedEventVideoLinkWrapper").hidden();
        $("#clickedEventPhoneWrapper").hidden();
        $("#clickedEventConferenceMoreWrapper").hidden();
    }

    if (event.conferenceData?.notes) {
        $dialog.find("#clickedEventVideoNotes").html(event.conferenceData?.notes);
        $dialog.find("#clickedEventVideoNotesWrapper").unhide();
    } else {
        $dialog.find("#clickedEventVideoNotesWrapper").hidden();
    }

	if (event.attendees) {
		const $attendees = $dialog.find("#clickedEventAttendeesWrapper .clickedEventSubDetails");
        $attendees.empty();
        
        const attendeesCount = event.attendees?.length;
        if (attendeesCount) {
            const CHIP_HEIGHT = 28;
            $attendees.css("min-height", (attendeesCount * CHIP_HEIGHT) + "px");
        }

        cacheContactsData().then(() => {
            sortAttendees(event);
            asyncForEach(event.attendees, async (attendee) => {
                await addChip({
                    $container: 	$attendees,
                    attendee: 		attendee,
                    skipAddSelf: 	true
                });
            })
        });
		
		$dialog.find("#clickedEventGoingWrapper .goingStatusHighlighted").removeClass("goingStatusHighlighted");
		
		let eventAttendee;
		// fill out "Going" status etc.
		event.attendees.some(attendee => {
			console.log("attendee", attendee);
			if (attendee.email == email) {
				eventAttendee = attendee;
				if (attendee.responseStatus == AttendingResponseStatus.ACCEPTED) {
					$dialog.find("#goingYes").addClass("goingStatusHighlighted");
				} else if (attendee.responseStatus == AttendingResponseStatus.TENTATIVE) {
					$dialog.find("#goingMaybe").addClass("goingStatusHighlighted");
				} else if (attendee.responseStatus == AttendingResponseStatus.DECLINED) {
					$dialog.find("#goingNo").addClass("goingStatusHighlighted");
				}
				$dialog.find("#clickedEventGoingWrapper").removeAttr("hidden");
				return true;
			}
		});
		
		$dialog.find("#goingYes, #goingMaybe, #goingNo").off().on("click", function() {
			const $goingNode = $(this);
			const responseStatus = $goingNode.attr("responseStatus");
			eventAttendee.responseStatus = responseStatus;

			const patchFields = {
                attendeesOmitted: true,
                attendees: [eventAttendee]
            };
			
			console.log("patch fields", patchFields, eventAttendee);
			
			showSaving();
			updateEvent({event:event, patchFields:patchFields}).then(response => {
				// success
                if (!response.cancel) {
                    $dialog.find("#clickedEventGoingWrapper .goingStatusHighlighted").removeClass("goingStatusHighlighted");
                    $goingNode.addClass("goingStatusHighlighted");
                    
                    if (params.jsEvent) {
                        $(params.jsEvent.target).toggleClass("fcAcceptedEvent", responseStatus == AttendingResponseStatus.ACCEPTED);
                        $(params.jsEvent.target).toggleClass("fcTentativeEvent", responseStatus == AttendingResponseStatus.TENTATIVE);
                        $(params.jsEvent.target).toggleClass("fcDeclinedEvent", responseStatus == AttendingResponseStatus.DECLINED);
                    }
                    
                    $("#clickedEventAttendeesWrapper .chip").each((index, chip) => {
                        const chipData = $(chip).data("data");
                        if (chipData.email == email) {
                            $(chip).find(".attendee-status")
                                .removeClass(getClassForAttendingStatus(AttendingResponseStatus.ACCEPTED))
                                .removeClass(getClassForAttendingStatus(AttendingResponseStatus.TENTATIVE))
                                .removeClass(getClassForAttendingStatus(AttendingResponseStatus.DECLINED))
                                .removeClass(getClassForAttendingStatus(AttendingResponseStatus.NEEDS_ACTION))
                                .addClass(getClassForAttendingStatus(responseStatus))
                            ;
                        }
                    });
                }
                
				console.log(response);
				hideSaving();
			}).catch(error => {
				showError("Error: " + error);
				hideSaving();
			});

		});
	
		$dialog.find("#clickedEventAttendeesWrapper").removeAttr("hidden");
	} else {
		$dialog.find("#clickedEventAttendeesWrapper").attr("hidden", "");
		$dialog.find("#clickedEventGoingWrapper").attr("hidden", "");
	}
	
	if (event.description) {
		var description = event.description;
		if (description) {
            description = prepareForContentEditable(description);
		}
		
		description = Autolinker.link(description, {
			//truncate: {length: 30},
			stripPrefix : false,
			email: false,
			twitter: false,
			phone: false,
			hashtag: false,
		    replaceFn : function( autolinker, match ) {
		        switch( match.getType() ) {
		            case 'url' :
		                var tag = autolinker.getTagBuilder().build( match ); 
		        		//return tag.innerHtml;
		                return tag;
		        }
			}
		});
        
        const $desc = $dialog.find("#clickedEventDescriptionWrapper .clickedEventSubDetails");
		$desc
			.html(description)
			//.attr("title", event.description.summarize(100))
        ;
        $desc.find("a").each((index, node) => {
            node.setAttribute("target", "_blank");
        });
		$dialog.find("#clickedEventDescriptionWrapper").removeAttr("hidden");
	} else {
		$dialog.find("#clickedEventDescriptionWrapper").attr("hidden", "");
    }

    if (event.kind == TASKS_KIND) {
        if (event.links) {
            const $details = $dialog.find(".clickedEventSubDetails");
            event.links.forEach(linkObj => {
                const description = linkObj.type == "email" ? getMessage("viewRelatedEmail") : linkObj.description;
                const $node = $(`<a class='task-link' href='${linkObj.link}' target='_blank'>${description}</a>`);
                $details.append( $node );
            });
            $dialog.find("#clickedEventTaskLinkWrapper").removeAttr("hidden");
        }

        const taskList = getTaskList(event);
        if (taskList) {
            const $desc = $dialog.find("#clickedEventTaskListWrapper .clickedEventSubDetails");
            $desc
                .html(taskList.title)
            ;
            $dialog.find("#clickedEventTaskListWrapper").removeAttr("hidden");
        }
    } else {
        $dialog.find("#clickedEventTaskLinkWrapper").attr("hidden", true);
        $dialog.find("#clickedEventTaskListWrapper").attr("hidden", true);
    }

    if (event.attachments) {
        const $attachmentsNode = $dialog.find("#clickedEventAttachmentsWrapper .clickedEventSubDetails");
        $attachmentsNode.empty();

        event.attachments.forEach(attachment => {
            const $node = $(`<a class='attachment' href='${attachment.fileUrl}' target='_blank'><img src='${attachment.iconLink}'/> ${attachment.title}</a>`);
            $attachmentsNode.append($node);
        });
        $dialog.find("#clickedEventAttachmentsWrapper").removeAttr("hidden");
    } else {
        $dialog.find("#clickedEventAttachmentsWrapper").attr("hidden", "");
    }

    $("#clickedEventNotifications").empty();

    function addNotificationToLayout(str) {
        $("#clickedEventNotifications").append($("<div/>").append(str));
    }
    
    const response = generateReminderTimes(event);
    response.reminderTimes.forEach(reminderTime => {
        addNotificationToLayout(reminderTime);
    });

    if (response.popupReminderFound) {
        $dialog.find("#clickedEventNotificationsWrapper").unhide();
    } else {
        $dialog.find("#clickedEventNotificationsWrapper").hidden();
    }

	$dialog.find("#clickedEventClose").off().click(function() {
		$dialog[0].close();
	});

	$dialog.find("#clickedEventDelete").off().on("click", async function(e) {
		console.log("del event", e);
		
		$dialog[0].close();

		if (isSnoozer) {
			var snoozers = await getSnoozers();
			for (var a=0; a<snoozers.length; a++) {
				var snoozer = snoozers[a];
				console.log("snooze found")
				if (isSameEvent(event, snoozer.event)) {
					console.log("remove snooze");
					// remove it in local context here of popup
					snoozers.splice(a, 1);
					// remove it also from storage also!
					chrome.runtime.sendMessage({command:"removeSnoozer", eventId:snoozer.event.id}, function() {
                        if (fullCalendar) {
                            fullCalendar.getEventById(params.calEvent.id).remove();
                        }
					});
					break;
				}
			}
		} else {
			let response = await ensureSendNotificationDialog({ event: event, action: SendNotificationsAction.DELETE});
            if (!response.cancel) {
                showSaving();
                try {
                    response = await deleteEvent(event, response.sendNotifications);
                    if (!response.cancel) {
                        setStatusMessage({message:getMessage("eventDeleted")});
    
                        if (response.changeAllRecurringEvents) {
                            reloadCalendar({source:"eventDeleted", bypassCache:true, refetchEvents:true});
                        } else if (fullCalendar) {
                            fullCalendar.getEventById(event.id).remove();
                        }
        
                        if (await getCalendarView() == CalendarView.AGENDA) {
                            initAgenda();
                        }
                        
                        if ($("html").hasClass("searchInputVisible")) {
                            params.$eventNode.remove();
                        }
                    }
                } catch (error) {
                    showCalendarError(error);
                } finally {
                    hideSaving();
                }
            }
		}
	});

    async function changeTaskStatus(status, params) {
        $dialog[0].close();

        showSaving();

        await setTaskStatus(event, status);

        if (params.jsEvent) {
            const $fcEvent = $(params.jsEvent.target).closest(".fc-event")
            $fcEvent.toggleClass("task-completed", status == TaskStatus.COMPLETED);
        }

        // clicked on agenda node
        if (params.$eventNode) {
            params.$eventNode.toggleClass("task-completed", status == TaskStatus.COMPLETED);
        }

        hideSaving();

        const reloadParams = {
            source: "editEvent",
            bypassCache: true,
            refetchEvents: true,
        }

        reloadParams.skipSync = true;

        await reloadCalendar(reloadParams);
    }

    $dialog.find("#clickedEventMarkCompleted").off().on("click", async function(e) {
        changeTaskStatus(TaskStatus.COMPLETED, params);
    });

    $dialog.find("#clickedEventMarkUncompleted").off().on("click", async function(e) {
        changeTaskStatus(TaskStatus.NEEDS_ACTION, params);
    });

	$dialog.find("#clickedEventColor").off().on("click", function(e) {
		var $dialog = showEventColors(colors, getEventCalendar(event));
		$dialog.on("iron-overlay-opened", function() {
			$(".colorChoice").off("click.fromEditEventDialog").on("click.fromEditEventDialog", function() {
				var newColorId = $(this).data("colorId");

				var patchFields = {};
				patchFields.colorId = newColorId;
				
				if (newColorId) {
					event.colorId = newColorId;
				} else {
					delete event.colorId;
				}
				
				showSaving();
				updateEvent({event:event, patchFields:patchFields}).then(async response => {
                    if (!response.cancel) {
                        if (await getCalendarView() == CalendarView.AGENDA) {
                            initAgenda();
                        } else {
                            fullCalendar.refetchEvents();
                            await sleep(100);
                            reloadCalendar({source:"editEventColor", bypassCache:true, refetchEvents:true});
                        }
                    }
					hideSaving();
				}).catch(error => {
                    showCalendarError(error);
                });
			});
		});
	});

	$dialog.find("#clickedEventEdit").off().on("click", function(e) {
		$dialog[0].close();
		if (isSnoozer) {
			openReminders({notifications:[{event:event}]}).then(function() {
				close();
			});
		} else {
			showCreateBubble({event:event, editing:true});
		}
	});
	
	$dialog.find("#clickedEventOpenInCalendar").off().click(function() {
		if (isSnoozer) {
			openReminders({notifications:[{event:event}]}).then(function() {
				close();
			});
		} else {
			openUrl(getEventUrl(event));
		}
	});

	$dialog.find("#copyToMyCalendar").off().click(function() {
		$dialog[0].close();
		showCreateBubble({ event: event, editing: true, copying:true });
	});

	$dialog.find("#clickedEventDuplicate").off().click(function () {
		$dialog[0].close();
		showCreateBubble({ event: event, editing: true, copying: true });
	});
	
	openDialog($dialog);
}

function displayAgendaHeaderDetails(date) {
	$("#calendarTitle").text(date.toLocaleDateString(locale, {
        month: "long",
        year: "numeric"
    }));
}

function popout(params) {
	let url = "popup.html";
	if (params) {
		url += "?" + params;
	}
	openUrl(url);
}

function openOptions() {
	openUrl("options.html?ref=popup");
}

function openContribute() {
	openUrl("contribute.html?ref=CalendarCheckerOptionsMenu");
}

function openHelp() {
	openUrl("https://jasonsavard.com/wiki/Checker_Plus_for_Google_Calendar?ref=CalendarCheckerOptionsMenu");
}

function calculateCalendarHeight() {
	const TOP_HEIGHT = DetectClient.isFirefox() ? 65 : 61;
    return document.body.clientHeight - TOP_HEIGHT;
    // v5 reverted v4 because clipping bottom events when calendar was full
    // v4 reduced chrome from 64 to 61 so I can modify eventLimit without scrollbar
    // v3: back to 64 - had empty space i could use at bottom
    // v2: 82 v1: zoom issue was stuck and i had to reload extension or else use 64??;
    // 82 = header       $("#main paper-toolbar").height() + 18
}

async function initQuickAdd() {
	// patch: because auto-bind did not work when loading polymer after the dom (and we I use a 1 millison second timeout before loading polymer to load the popup faster)
	// note: we are modifying the template and not the importedDom because that wouldn't work, polymer wouldn't process the paper-item nodes proplerly
	// note2: I moved this code from startup to the .click event because it was consuming more and more memory everytime I opened the popup window
	
	$("html").addClass("quickAddVisible");
    $("#quickAdd")
        .val("")
        .focus()
    ;

    // after adding await, I had to move this below .focus() because it wasn't capturing first key press
    await initCalendarDropDown("quickAddCalendarsTemplate");
}

async function openGoogleCalendarEventPage(eventEntry) {
	var actionLinkObj = await generateActionLink("TEMPLATE", eventEntry);
	var url = actionLinkObj.url + "?" + actionLinkObj.data;
	openUrl(url);
}

function ensureSendNotificationDialog(params) {
	return new Promise((resolve, reject) => {
		if (params.event.attendees?.length) {
			if (params.action == SendNotificationsAction.CREATE || (params.event.organizer?.self)) {
				let content;
				if (params.action == SendNotificationsAction.CREATE) {
					content = getMessage("sendInviteToGuests");
				} else if (params.action == SendNotificationsAction.DELETE) {
					content = getMessage("sendUpdateAboutCancelingEvent");
				} else {
					content = getMessage("sendUpdateToExistingGuests");
				}
				openGenericDialog({
					content: content,
					okLabel: getMessage("send"),
					cancelLabel: getMessage("dontSend")
				}).then(response => {
					if (response == "ok") {
						resolve({ sendNotifications: true });
					} else {
						resolve({});
					}
				});
			} else {
				openGenericDialog({
					content: getMessage("changesOnlyReflectedOnCalendarX", getCalendarName(getEventCalendar(params.event))),
					okLabel: getMessage("continue"),
					showCancel: true
				}).then(response => {
					if (response == "ok") {
						resolve({});
					} else {
						resolve({ cancel: true });
					}
				});
			}
		} else {
			resolve({});
		}
	});
}

function getSkin(skins, $paperItem) {
	return skins.find(skin => {
		return skin.id == $paperItem.attr("skin-id");
	});
}

function maybeRemoveBackgroundSkin(skinsSettings) {
	let oneSkinHasAnImage = skinsSettings.some(skin => {
	   if (skin.image) {
		   return true;
	   }
   });

   if (!oneSkinHasAnImage) {
	   $("body").removeClass("background-skin");
   }
}

function showSkinsDialog() {
	showLoading();

	Controller.getSkins().then(async skins => {
        const donationClicked = await storage.get("donationClicked");

		var attemptedToAddSkin = false;

		var $dialog = initTemplate("skinsDialogTemplate");
		var $availableSkins = $dialog.find("#availableSkins");
		$availableSkins.empty();
		$availableSkins
			.off()
			.on("click", ".addButton", async function(e) {
				attemptedToAddSkin = true;

				var $addButton = $(this);
				var $paperItem = $addButton.closest("paper-item");
                var skin = getSkin(skins, $paperItem);
                
                function preventPreview() {
					$paperItem.removeAttr("focused");
					$paperItem.blur();

					e.preventDefault();
					e.stopPropagation();
                }

				$("#previewSkin").remove();

				if ($addButton.hasClass("selected")) {
					console.log("remove skin: ", skin);
					$addButton.removeClass("selected");
					$addButton.attr("icon", "add");
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
					return false;
				} else if (donationClicked) {
                    console.log("add skin");
                    $addButton.addClass("selected");
                    $addButton.attr("icon", "check");
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
					return false;
                }
			})
			.on("click", "paper-item", function () {
                var $paperItem = $(this);
                // patch to remove highlighed gray
                $paperItem.removeAttr("focused");
                $paperItem.blur();

                $("#skinWatermark").removeClass("visible");
                var skin = getSkin(skins, $paperItem);
                addSkin(skin, "previewSkin");
                setSkinDetails($dialog, skin);
                return false;
			})
        ;

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

			$availableSkins[0].appendChild(paperItem);
		});

        $dialog.find(".resetSkins").off().on("click", async function() {
            await storage.remove("skins");
            await storage.remove("customSkin");
            await storage.remove("popup-bg-color");
            await niceAlert(getMessage("reset"));
			location.reload();
		});

		$dialog.find(".updateSkins").off().on("click", function () {
			skinsSettings.forEach(function (skinSetting) {
				skins.forEach(function (skin) {
					if (skinSetting.id == skin.id) {
						copyObj(skin, skinSetting);

						// refresh skin
						addSkin(skin);
					}
				});
			});
			storage.set("skins", skinsSettings);
			showMessage(getMessage("done"));
		});

		$dialog.find(".customSkin").off().on("click", async function() {
			$("#previewSkin").remove();

			var $dialog = initTemplate("customSkinDialogTemplate");

			var customSkin = await storage.get("customSkin");

			$dialog.find("textarea").val(customSkin.css);
			$dialog.find("#customBackgroundImageUrl").val(customSkin.image);

			$dialog.find(".shareSkin").off().on("click", function () {
				openUrl("https://jasonsavard.com/forum/categories/checker-plus-for-gmail-feedback?ref=shareSkin");
			});

			$dialog.find(".updateSkin").off().on("click", async () => {
				$("#customSkin").remove();
				addSkin({ id: "customSkin", css: $dialog.find("textarea").val(), image: $dialog.find("#customBackgroundImageUrl").val() });
				if (!await storage.get("donationClicked")) {
					showMessage(getMessage("donationRequired"));
				}
			});

			openDialog($dialog).then(async response => {
				if (response == "ok") {
					if (donationClicked) {
						customSkin.css = $dialog.find("textarea").val();
						customSkin.image = $dialog.find("#customBackgroundImageUrl").val();

						addSkin(customSkin);
						storage.set("customSkin", customSkin);
					} else {
						$dialog.find("textarea").val("");
						removeSkin(customSkin);
						if (!donationClicked) {
							showMessage(getMessage("donationRequired"));
						}
					}

					$dialog[0].close();
				}
			});
		});

		openDialog($dialog).then(async response => {
			if (response == "ok") {
				if ($("#previewSkin").length) {
					$("#previewSkin").remove();

					maybeRemoveBackgroundSkin(skinsSettings);

					if (!attemptedToAddSkin) {
						openGenericDialog({
							content: "Use the <paper-icon-button style='vertical-align:middle' icon='add'></paper-icon-button> to add skins!"
						}).then(response => {
							if (response == "ok") {
								// make sure next time the skins dialog closes when clicking done
								$dialog.find(".okDialog").attr("dialog-confirm", true);
							}
						});
						let $addButton = $("#skinsDialog #availableSkins paper-item.iron-selected .addButton");
						$addButton.one("transitionend", () => {
							$addButton.toggleClass("highlight");
						});
						$addButton.toggleClass("highlight");
					} else {
						$dialog[0].close();
					}

				} else {
					$dialog[0].close();
				}
			}
		});

		hideLoading();

	}).catch(error => {
		console.error(error);
		showError("There's a problem, try again later or contact the developer!");
	});
}

function getClassForAttendingStatus(status) {
    let className;
    if (status == AttendingResponseStatus.ACCEPTED) {
        className = "going";
    } else if (status == AttendingResponseStatus.TENTATIVE) {
        className = "tentative";
    } else if (status == AttendingResponseStatus.DECLINED) {
        className = "declined";
    } else if (status == AttendingResponseStatus.NEEDS_ACTION) {
        className = "needs-action";
    }
    return className;
}

async function addChip(params) {
	let account = generateAccountStub(email);

    // first time must auto insert the organiser
	if ($("#inviteGuestsDialog .chip").length == 0 && !params.addSelf && !params.skipAddSelf) {
		await addChip({
			$container: 	$("#chips"),
			$inputNode:		$("#addGuestInput"),
			$acSuggestions:	params.$acSuggestions,
			addSelf:		true
		});
	}

	var $chip = $("<div class='chip layout horizontal center'><div class='attendee-photo-wrapper'><iron-image class='contactPhoto' sizing='cover' preload placeholder='/images/noPhoto.svg'></iron-image><div class='attendee-status'></div></div><span class='chipName'></span> <span class='chipDetails'></span> <iron-icon class='removeChip' icon='close'></iron-icon></div>");

	let chipData = {};

	if (params.attendee) {
		chipData.email = params.attendee.email;
		chipData.name = await getContactDisplayName(params.attendee);
		$chip.data("attendee", params.attendee);
	} else if (params.addSelf) {
		chipData.email = window.email;
		chipData.name = contactsTokenResponse.name;
		chipData.organizer = true;
		chipData.responseStatus = AttendingResponseStatus.ACCEPTED;
	} else if (params.$acSuggestions && params.$acSuggestions.is(":visible") && params.$acSuggestions.find(".selected").length) {
		chipData = params.$acSuggestions.find(".selected").data("data");
		params.$acSuggestions.hide();
	} else {
		chipData.email = params.$inputNode.val();
	}

	$chip.data("data", chipData);

	const contactPhotoData = {
		account:	account,
		name:		chipData.name,
		email:		chipData.email,
		alwaysShow:	true
	};
	setContactPhoto(contactPhotoData, $chip.find(".contactPhoto"));

	if (params.attendee) {
        const $attendeeStatus = $chip.find(".attendee-status");
        const className = getClassForAttendingStatus(params.attendee.responseStatus);
        $attendeeStatus.addClass(className);
	}

	$chip.find(".chipName")
		.text(chipData.name ? chipData.name : chipData.email)
		.attr("title", chipData.email)
	;

	if (params.attendee && params.attendee.organizer) {
		$chip.find(".chipDetails").text(getMessage("organiser"));
	}

	$chip.find(".removeChip").click(function () {
		$chip.remove();
		$("#addGuestInput").focus();
	});

	params.$container.append($chip);
	if (params.$inputNode) {
		params.$inputNode
			.val("")
			.attr("placeholder", "")
		;
	}
}

function showInviteGuestsDialog(event) {
	let account = generateAccountStub(email);

	let $dialog = initTemplate("inviteGuestsDialogTemplate");
	$dialog.off("iron-overlay-opened").on("iron-overlay-opened", function () {
		if (!$dialog.data("guestsLoaded")) {
			if (event.attendees && event.attendees.length) {
                const $acSuggestions = $(".acSuggestions");
                sortAttendees(event);
				asyncForEach(event.attendees, async (attendee) => {
					await addChip({
						$container: 	$("#chips"),
						$inputNode:		$("#addGuestInput"),
						$acSuggestions:	$acSuggestions,
						attendee: 		attendee,
						skipAddSelf: 	true
					});
				});
			}
			$dialog.data("guestsLoaded", true);
		}

		$("#addGuestInput").focus();
    });
    
    $dialog.find("#refresh-contacts").off().on("click", async function() {
        showLoading();

        // remove contacts data
        const dataIndex = getContactDataItemIndexByEmail(contactsData, email);
        if (dataIndex != -1) {

            if (contactsData[dataIndex].version == CONTACTS_STORAGE_VERSION) {
                showLoading();
                try {
                    await sendMessageToBG("updateContacts");
                    contactsData = await storage.get("contactsData");
                    $("#inviteGuestsDialog")[0].close();
                    $("#inviteGuests").click();
                } finally {
                    hideLoading();
                }
                return;
            }

            contactsData.splice(dataIndex, 1);
            await storage.set("contactsData", contactsData);
        }

        contactsData = null;

        const event = $("#createEventDialog").data("event");
        grantContactPermission(event);
    });

	openDialog($dialog);

	var $fetchContacts = $("#fetchContacts");
	$fetchContacts.off().click(function () {
        requestPermission({ email: account.getEmail(), initOAuthContacts: true, useGoogleAccountsSignIn: true });
	});

	var MAX_SUGGESTIONS = 4;
	var MAX_SUGGESTIONS_BY_CLICK = 8;
	var performAutocomplete;
	var suggestions = [];
	var lastSuggestions = [];

	var $acSuggestions = $(".acSuggestions");
	var contacts = [];

	function addSuggestion(params) {
		var $acItem = $("<div class='acItem layout horizontal center'><iron-image class='contactPhoto' sizing='cover' preload placeholder='/images/noPhoto.svg'></iron-image><div class='acName'></div><div class='acEmail'></div></div>");

		$acItem
			.data("data", params)
			.mouseenter(function () {
				$acSuggestions.find(".selected").removeClass("selected");
				$(this).addClass("selected");
			})
			.mouseleave(function () {
				$(this).removeClass("selected");
			})
			.click(function () {
				addChip({
					$container: 	$("#chips"),
					$inputNode:		$("#addGuestInput"),
					$acSuggestions: $acSuggestions
				});
				$("#addGuestInput").focus();
			})
			;

		params.delay = 1; // I tried 100 before
		setContactPhoto(params, $acItem.find(".contactPhoto"));

		$acItem.find(".acName").text(params.name ? params.name : params.email.split("@")[0]);
		$acItem.find(".acEmail").text(params.email);
		$acSuggestions.append($acItem);
	}

	function showSuggestions() {
		suggestions.forEach(function (suggestion) {
			addSuggestion(suggestion);
		});
		lastSuggestions.forEach(function (suggestion) {
			addSuggestion(suggestion);
		});

		$acSuggestions.find(".acItem").first().addClass("selected");
		$acSuggestions.show();
	}

	function generateSuggestionDataFromContact(account, contact, emailIndex) {
		var email = contact.emails[emailIndex].address;
		var name = contact.name;
		var updated = contact.updatedDate;
		return { account: account, email: email, name: name, updated: updated };
	}

    // prefetch for speed
    cacheContactsData().then(async () => {
        contacts = await getContacts({ account: account });
    });

	$("#addGuestInput")
		.attr("placeholder", getMessage("guests"))
		.off()
		.click(function () {
			suggestions = [];
			$acSuggestions.empty();
			contacts.every(function (contact, index) {
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
			return false;
		})
		.blur(function () {
			setTimeout(function () {
				$("#fetchContacts").hide();
			}, 200);
		})
		.keydown(function (e) {
            //console.log("keydown", e);
            const key = e.key;
			if (key === "Tab" || (key === "Enter" && !e.originalEvent.isComposing)) { // tab/enter
				if ($(this).val()) {
					addChip({
						$container: 	$("#chips"),
						$inputNode:		$(this),
						$acSuggestions: $acSuggestions
					});
					return false;
				}
				performAutocomplete = false;
			} else if (key === "Backspace") {
				/*
				if ($(this).val() == "") {
					$(".chips").find(".chip").last().remove();
					performAutocomplete = false;
				} else {
					performAutocomplete = true;
				}
				*/
			} else if (key === "ArrowUp") {
				var $current = $acSuggestions.find(".selected");
				var $prev = $current.prev();
				if ($prev.length) {
					$current.removeClass("selected");
					$prev.addClass("selected");
				}
				performAutocomplete = false;
				return false;
			} else if (key === "ArrowDown") {
				var $current = $acSuggestions.find(".selected");
				var $next = $current.next();
				if ($next.length) {
					$current.removeClass("selected");
					$next.addClass("selected");
				}
				performAutocomplete = false;
				return false;
			} else {
				performAutocomplete = true;
			}
		})
		.keyup(function (e) {
			//console.log("keyup", e);

			if (performAutocomplete) {
				if (contacts.length) {
					suggestions = [];
					lastSuggestions = [];
					$acSuggestions.empty();
					if ($(this).val()) {
						var firstnameRegex = new RegExp("^" + $(this).val(), "i");
						var lastnameRegex = new RegExp(" " + $(this).val(), "i");
						var emailRegex = new RegExp("^" + $(this).val(), "i");
						var matchedContacts = 0;
						for (var a = 0; a < contacts.length; a++) {
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
						$acSuggestions.hide();
					}
				} else {
					$fetchContacts.show();
				}
			}
		})
	;
}

async function setContactPhoto(params, imageNode) {
	// contact photo
	const contactPhoto = await getContactPhoto(params);
    console.log("setContactPhoto", contactPhoto);
    imageNode.attr("setContactPhoto", "true");

    if (params.useNoPhoto && !contactPhoto.realContactPhoto) {
        imageNode.attr("src", "images/noPhoto.svg");
    } else if (contactPhoto.photoUrl) {
        imageNode.on("error", function () {
            imageNode.attr("src", "images/noPhoto.svg");
        });

        // used timeout because it was slowing the popup window from appearing
        setTimeout(function () {
            if (params.alwaysShow || imageNode.is(":visible")) {
                imageNode.attr("src", contactPhoto.photoUrl);
            }
        }, params.delay ? params.delay : 20);
    } else {
        if (params.useNoPhoto) {
            imageNode.attr("src", "images/noPhoto.svg");
            imageNode.addClass("noPhoto");
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
            imageNode
                .removeAttr("fade")
                .attr("src", await letterAvatar(letterAvatorWord))
            ;
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
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "128px Arial";
	context.textAlign = "center";
	context.fillStyle = "#FFF";
	context.fillText(letter, CANVAS_XY / 2, CANVAS_XY / 1.5);

	return await getDataUrl(canvas);
}

async function gotoDate(params) {
    const calendarView = await getCalendarView();
    if (calendarView == CalendarView.CUSTOM && /^4$|^5$|^6$/.test(await storage.get("customView")) && await storage.get("jumpToStartOfMonthForNextPrev")) {
        showLoading();
        await sleep(1);
        temporarilyDisableFetching(() => {
            let date;
            if (params.next) {
                date = fullCalendar.getDate();
                date.setMonth(date.getMonth() + 1);
            } else {
                date = params.date;
            }
            fullCalendar.gotoDate(date);
            // temporarily switch over to month view
            fcChangeView(CalendarView.MONTH);
        })
    } else if (calendarView == CalendarView.AGENDA) {
        var start = params.date;
        var end = start.addDays(21);
        
        displayAgendaHeaderDetails(start);
        
        window.autoScrollIntoView = true;
        fetchAgendaEvents({start:start, end:end, forceEmpty:true}).then(function() {
            // do nothing
            //window.autoScrollIntoView = false;
        });
        scrollTarget.scrollTop = 0;
    } else {
        if (params.next) {
            fullCalendar.next();
        } else {
            fullCalendar.gotoDate(params.date);
        }
    }
    calendarShowingCurrentDate = false;
}

function temporarilyDisableFetching(func) {
	// temporarily remove source and re-add it below because fullCalendar("gotoDate") below will fetch events
    window.disableHideLoading = true;
    const thisSource = fullCalendar.getEventSourceById(FULL_CALENDAR_SOURCE_ID); 
	thisSource.remove();

	func();

	window.disableHideLoading = false;
	fullCalendar.addEventSource(source);
}

async function setSelectedCalendars(calendar, arrayOfCalendars, displayThisOnly) {
    const excludedCalendars = await storage.get("excludedCalendars");
    const selectedCalendars = await storage.get("selectedCalendars");
    const desktopNotification = await storage.get("desktopNotification");
						
	if (!selectedCalendars[email]) {
		selectedCalendars[email] = {};
	}

	if (displayThisOnly) {
		arrayOfCalendars.forEach(thisCalendar => {
			let visibleFlag;
			if (calendar.id == thisCalendar.id) {
				visibleFlag = true;
			} else {
				visibleFlag = false;
			}
            selectedCalendars[email][thisCalendar.id] = visibleFlag;

            if (!visibleFlag && isCalendarExcludedForNotifsByOptimization(thisCalendar, excludedCalendars) && !isGadgetCalendar(thisCalendar)) {
                console.info("optimize and remove from cache: " + thisCalendar.id);
                delete cachedFeeds[thisCalendar.id];
            }
		});
	} else {
        selectedCalendars[email][calendar.id] = !isCalendarSelectedInExtension(calendar, email, selectedCalendars);
        
        if (!isCalendarUsedInExtension(calendar, email, selectedCalendars, excludedCalendars, desktopNotification)) {
            console.info("optimize and remove from cache: " + calendar.id);
            delete cachedFeeds[calendar.id];
        }
    }

    await storage.set("cachedFeeds", cachedFeeds);
    
    showLoading();
	storage.set("selectedCalendars", selectedCalendars).then(() => {
        reloadCalendar({
            source: "selectedCalendars",
            refetchEvents: true,
            reInitCachedFeeds: true // used because we might have removed unused calendars above
        });
    });
}

function openGoToDate() {
    const currentDate = fullCalendar.getDate();

    const $dialog = initTemplate("gotoDateDialogTemplate");
    $dialog.find("#gotoDate_month paper-item").each(function () {
        $(this).text(dateFormat.i18n.monthNamesShort[$(this).attr("value")]);
    });
    $dialog.find("#gotoDate_month")[0].selected = currentDate.getMonth();
    $dialog.find("#gotoDate_day")[0].selected = currentDate.getDate();
    $dialog.find("#gotoDate_year")[0].selected = currentDate.getFullYear();
    openDialog($dialog).then(response => {
        if (response == "ok") {
            const newDate = new Date($dialog.find("#gotoDate_year")[0].selected, $dialog.find("#gotoDate_month")[0].selected, $dialog.find("#gotoDate_day")[0].selected);
            gotoDate({date: newDate});
        }
    });
}

async function showSearch() {
    await initCalendarDropDown("searchCalendarsTemplate", "active-calendars");
    
    $("#agendaEvents").empty();
    $("html").addClass("searchInputVisible");
    $("#searchInput").focus();
}

async function initVisibleCalendarsList() {
    const selectedCalendars = await storage.get("selectedCalendars");
    const arrayOfCalendars = await getArrayOfCalendars({
        includeTasks: await storage.get("admin-enable-tasks")
    });
    writeableCalendars = getWriteableCalendars(arrayOfCalendars);
    const tasksUserEmails = await oAuthForTasks.getUserEmails();

    $("#visibleCalendars").empty();
    $.each(arrayOfCalendars, function(index, calendar) {
        const calendarName = getCalendarName(calendar);
        
        if (isGadgetCalendar(calendar)) {
            // exclude the weather etc. because i am not integrating it into calendar display
        } else {
            const $checkbox = $("<paper-checkbox><div class='visibleCalendarLabel'></div></paper-checkbox>");
            $checkbox.data("calendar", calendar);
            $checkbox.attr("color-id", calendar.colorId);

            $checkbox.find(".displayThisCalendarOnly").click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            $checkbox.click(async function(e) {
                const calendar = $(this).data("calendar");

                if (calendar.id == TASKS_CALENDAR_OBJECT.id) {
                    if (await storage.firstTime("_tasksWarning")) {
                        await niceAlert(`
                            Due to popular requests I have integrated Google Tasks into this calendar extension to see them in the calendar and get notified on their due date. However, you can only create tasks by adding them to a calendar day.<br>
                            <br>
                            There is currently a Google Tasks API limitation which does not allow to set or get the specific time of tasks, only the day, so every task will be treated as an all day task. You can star the issue with Google <a target="_blank" href="https://issuetracker.google.com/issues/166896024">here</a>
                        `);
                    }
                    if (await donationClicked("tasks")) {
                        if (!tasksUserEmails?.length) {
                            const tokenResponses = await storage.getEncryptedObj("tokenResponses", dateReviver);
                            const tokenResponse = tokenResponses[0];
    
                            await openPermissionsDialog({
                                email: tokenResponse.userEmail,
                                initOAuthTasks: true,
                                useGoogleAccountsSignIn: !tokenResponse.chromeProfile && !await storage.get("_admin-force-tasks-chrome-sign-in")
                            });
                        }
                        setSelectedCalendars(calendar, arrayOfCalendars);
                    } else {
                        this.checked = false;
                    }
                } else {
                    setSelectedCalendars(calendar, arrayOfCalendars);
                }
            });
            
            if (isCalendarSelectedInExtension(calendar, email, selectedCalendars)) {
                if (calendar.id == TASKS_CALENDAR_OBJECT.id) {
                    if (tasksUserEmails?.length) {
                        $checkbox.attr("checked", true);
                    }
                } else {
                    $checkbox.attr("checked", true);
                }
            }
            
            $checkbox.find(".visibleCalendarLabel")
                .text(calendarName)
                .attr("title", calendarName)
            ;

            const $displayThisOnly = $(`<paper-icon-button class='displayThisCalendarOnly' title="${getMessage("displayThisOnly")}" icon='image:remove-red-eye'></paper-icon-button>`)
            $displayThisOnly.click(function() {
                // remove all
                $("#visibleCalendars").find("paper-checkbox").each(function() {
                    $(this)[0].checked = false;
                });

                // recheck selected
                const $visibleCalendarCheckbox = $(this).closest(".visible-calendar").find("paper-checkbox");
                $visibleCalendarCheckbox[0].checked = true;

                setSelectedCalendars($visibleCalendarCheckbox.data("calendar"), arrayOfCalendars, true);
            });

            const $visibleCalendar = $("<div class='visible-calendar'></div>");
            $visibleCalendar.append($checkbox);

            if (calendar.id == TASKS_CALENDAR_OBJECT.id) {
                const $changeColor = $(`<paper-swatch-picker id='task-color-picker'></paper-swatch-picker>`);
                $visibleCalendar.append($changeColor);
                setTimeout(async () => {
                    $changeColor
                        .attr("color", "gray")
                        .off().on("color-changed", async e => {
                            showSaving();
                            const color = e.originalEvent.detail.value;
                            await storage.set("tasks-bg-color", color);
                            $("#drawerPanel")[0].toggle();
                            await initTasksColor();
                            initCalendarColorsInCSS(arrayOfCalendars);
                            await sendMessageToBG("resetInitMiscWindowVars");
                            await reloadCalendar({
                                source: "changed-task-color",
                                //bypassCache: true,
                                refetchEvents: true
                            });
                            setTimeout(() => {
                                initVisibleCalendarsList();
                            }, 1000);
                            hideSaving();
                        });
                    ;
                }, 1000);
            }

            $visibleCalendar.append($displayThisOnly);
            
            $("#visibleCalendars").append($visibleCalendar);
        }
    });
}

function initCalendarColorsInCSS(arrayOfCalendars) {
    const calendarColorsCSS = generateCalendarColors(cachedFeeds, arrayOfCalendars);
    pageVisible.then(() => {
        const cssStyle = addCSS("calendarColors", calendarColorsCSS);
        $(cssStyle).wrap("<custom-style></custom-style>");
    });
}

async function init() {

    await storage.iniStorageCache();

    pageVisible.then(async () => {
        await $.ready;
        const skins = await storage.get("skins");
        skins.forEach(skin => {
            addSkin(skin);
        });
        addSkin(await storage.get("customSkin"));
    });

    await getBGObjects();
    await $.ready;
    const calendarView = await getCalendarView();
    initCalendarView(calendarView);
    const arrayOfCalendars = await getArrayOfCalendars();
    
    $("html").attr("lang", locale);

    if (DetectClient.isFirefox()) {
        $("body").on("click", "a[target]", function(e) {
            openUrl($(this).attr("href"));
            return false;
        });
    }

    oAuthForDevices.findTokenResponse({userEmail:email}).then(async tokenResponse => {
        if (tokenResponse) {
            if ((await getInstallDate()).isToday() && await storage.firstTime("changeViewGuide")) {
                openGenericDialog({
                    content: getMessage("useTheXToChangeViews", "<paper-icon-button style='vertical-align:middle' icon='more-vert'></paper-icon-button>")
                });
            }
            $("#bigAddEventButtonWrapper").addClass("visible");
        } else {
            $("app-drawer-layout").hide();
            //$("#bigAddEventButtonWrapper").hide();
            
            if (DetectClient.isFirefox()) {
                polymerPromise.then(() => {
                    showError(getMessage("accessNotGrantedSeeAccountOptions", ["", getMessage("accessNotGrantedSeeAccountOptions_accounts")]), {
                        text: getMessage("accounts"),
                        onClick: function () {
                            openUrl("options.html?accessNotGranted=true#accounts");
                        }
                    });
                });
            } else {
                openPermissionsDialog().then(() => {
                    // nothing
                });
            }

            var tokenResponsesInterval = setInterval(async () => {
                const tokenResponses = await storage.getEncryptedObj("tokenResponses", dateReviver);
                if (tokenResponses?.length) {
                    clearInterval(tokenResponsesInterval);
                    
                    //showMessage(getMessage("loading"));
                    showLoading();
                    // wait another 2 seconds for polling to happen
                    setTimeout(async () => {
                        await storage.disable("loggedOut");
                        location.reload();
                    }, seconds(2))
                }
            }, seconds(5));
        }
    });    

    polymerPromise.then(async () => {
        
        if (isDetached && await storage.firstTime("popoutMessage") && !fromGrantedAccess) {
            polymerPromise2.then(() => {
                var $dialog = initTemplate("popoutDialogTemplate");
                openDialog($dialog).then(function(response) {
                    if (response == "ok") {
                        // nothing
                    } else if (response == "other") {
                        openUrl("https://jasonsavard.com/wiki/Popout?ref=calendarPopoutDialog");
                        $dialog[0].close();
                    }
                });
            });
        }
        
        $("#title, #menu, #closeDrawer").click(async () => {
            $("#drawerPanel")[0].toggle();
            
            if (!$("#miniCalendar").hasClass("loaded")) {
                var datePickerStartParams = await generateDatePickerParams();
                datePickerStartParams.onSelect = function (dateText, inst) {
                    let date = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
                    gotoDate({date:date});
                    $("#drawerPanel")[0].toggle();
                };
                $("#miniCalendar").datepicker(datePickerStartParams);
                $("#miniCalendar").addClass("loaded");
            }
        });

        initVisibleCalendarsList();
        
        if (await isDND()) {
            polymerPromise2.then(function() {
                showMessage(getMessage("DNDisEnabled"), {
                    text: getMessage("turnOff"),
                    onClick: function() {
                        sendMessageToBG("setDND_off");
                        hideMessage();
                    }
                });
            });
        }
    }).catch(error => {
        showLoadingError(error);
    });
    
    initCalendarColorsInCSS(arrayOfCalendars);

    if (openingSite) {
        return;
    } else {
        $("body").show();
    }

    if (inWidget) {
        $("html").addClass("widget");
    }

    if (fromToolbar) {
        $("html").addClass("fromToolbar");
    }
    
    var issueFixed = new Date(2014, 5, 29, 23);
    var maxDateToKeepNotice = issueFixed.addDays(5);
    // localStorage value was used for yay fixed issue "_quotaIssueDismissed"
    if (new Date().isBefore(maxDateToKeepNotice)) {
        if (!await storage.get("_quotaIssueDismissed") && (await getInstallDate()).isBefore(issueFixed)) {
            $("#notice").show();
            $("#dismissNotice").click(function() {
                storage.setDate("_quotaIssueDismissed");
                $("#notice").slideUp();
            });
        }
    } else {
        storage.remove("_quotaIssueDismissed");
    }
    
    var msgKey;
    if (Math.random() * 5 < 3) {
        msgKey = "quickAddDefaultText";
    } else {
        msgKey = "quickAddTitle";
    }
    $("#quickAdd").attr("placeholder", getMessage(msgKey));

    if (await storage.get("pastDays")) {
        $("#betaCalendar").addClass("highlightPastDays");
    }
    if (await storage.get("highlightWeekends")) {
        $("#betaCalendar").addClass("highlightWeekends");
    }
    
    if (await storage.get("removeShareLinks") || calendarView == CalendarView.AGENDA) {
        // hide actual share button
        $(".share-button").closest("paper-menu-button").remove();
        // hide share button (placeholder)
        $(".share-button").remove();
    }
    
    const loggedOut = await storage.get("loggedOut");
    console.log("logout state: " + loggedOut);
    if (typeof loggedOut === "undefined" || loggedOut) { // !loggedOut  - commented because issue occured when invalid creditials
        if (await oAuthForDevices.findTokenResponse({userEmail:email})) {
            showCalendarError("401");
        }
    } else if (!isOnline() && arrayOfCalendars.length == 0) {
        showError(getMessage("yourOffline"));
    } else {
        $("#wrapper").show();
        $("#calendarWrapper").hide();
        
        const endDateAfterThisMonth = await getEndDateAfterThisMonth();
        const showEventIcons = await storage.get("showEventIcons");
        
        source = {
            id: FULL_CALENDAR_SOURCE_ID,
            events: function(fetchInfo, successCallback, failureCallback) {
                console.log("source.events");

                console.time("getEvents");
                getEventsWrapper().then(events => {
                    console.timeEnd("getEvents");
                    console.log("requested start/stop: " + events.length + " start: " + fetchInfo.start + " end: " + fetchInfo.end, fetchInfo);
                    console.log("current events: " + getStartDateBeforeThisMonth() + " " + endDateAfterThisMonth);
                    
                    fetchEvents(events, fetchInfo.start, fetchInfo.end).then(async allEvents => {
                        if (allEvents) {
                            //hideLoading();
                            
                            if (await storage.get("showSnoozedEvents")) {
                                console.time("showSnoozedEvents");
                                // includes snoozes
                                console.time("getfutureSnooze")
                                const futureSnoozes = await getFutureSnoozes(await getSnoozers(events), {
                                    includeAlreadyShown: true,
                                    excludeToday: true,
                                    email: await storage.get("email")
                                });
                                console.timeEnd("getfutureSnooze")
                                console.log("future snoozes", futureSnoozes);
                                allEvents = allEvents.concat(futureSnoozes);
                                console.timeEnd("showSnoozedEvents");
                            }
    
                            console.time("convertAllEventsToFullCalendarEvents");
                            var fcEvents = await convertAllEventsToFullCalendarEvents(allEvents);
                            console.timeEnd("convertAllEventsToFullCalendarEvents");
                            
                            //fcEvents = fcEvents.slice(-2);
                            successCallback(fcEvents);
                            if (!window.disableHideLoading) {
                                hideLoading();
                            }
                        }
                    });                    
                });
            }
        };

        let eventTimeFormat;
        let slotLabelFormat;
        
        if (twentyFourHour) {
            slotLabelFormat = eventTimeFormat = {
                hourCycle: getHourCycle(),
                hour: "numeric",
                minute: "numeric",
            }
        } else {
            slotLabelFormat = eventTimeFormat = {
                hourCycle: getHourCycle(),
                hour: "numeric",
                minute: "2-digit",
                omitZeroMinute: /de|zh/.test(locale) ? false : true, // patch for 1 Uhr being displayed
                meridiem: 'narrow',
            }
        }
        
        const calendarSettings = await storage.get("calendarSettings");
        
        var minTime;
        var maxTime;
        
        try {
            minTime = (await storage.get("hideMorningHoursBefore")).parseTime().format("HH:MM:00");
            var hideNightHoursAfter = await storage.get("hideNightHoursAfter");
            if (hideNightHoursAfter == "24") {
                hideNightHoursAfter = "23:59";
            }
            maxTime = hideNightHoursAfter.parseTime().format("HH:MM:00");
        } catch (e) {
            logError("could not parse 'hide morning' hours: " + e);
        }
        
        polymerPromise.then(async () => {
            if (calendarView == CalendarView.AGENDA) {
                initAgenda();
                hideLoading();
            } else {
                const views = {
                    customListWeek: {
                        type: 'list',
                        listDayFormat: {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        },
                        duration: {
                            weeks: LIST_VIEW_WEEKS
                        }
                    },
                }

                const customView = await storage.get("customView");
                if (isCustomViewInDays(customView)) {
                    views.custom = {
                        type: 'timeGridWeek',
                        duration: {
                            days: parseInt(await getValueFromCustomView())
                        },
                    }
                } else {
                    views.custom = {
                        type: 'dayGrid',
                        duration: {
                            weeks: parseInt(await storage.get("customView"))
                        }
                    }
                }
                
                const pastDays = await storage.get("pastDays");

                let firstDay;
                if (calendarView == CalendarView.LIST_WEEK) {
                    firstDay = new Date().getDay();
                } else if (calendarView == CalendarView.CUSTOM && await storage.get("firstDay") != "") { // && isCustomViewInDays(customView))
                    firstDay = new Date().addDays(await storage.get("firstDay")).getDay();
                } else {
                    firstDay = calendarSettings.weekStart;
                }

                const maximizeVisibleEventsInADay = await storage.get("maximizeVisibleEventsInADay");
                const showDayOfYear = await storage.get("showDayOfYear");

                const fullCalendarParams = {
                    plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list' ],
                    locale: locale,
                    views: views,
                    defaultView: getFCViewName(calendarView),
                    eventTimeFormat: eventTimeFormat,
                    nowIndicator: true,
                    handleWindowResize: ffPatchForResizeAndMorePopoutDisappearing ? false : true,
                    timeGridEventMinHeight: 20,
                    eventOrder: ["-allDay", "start", "-duration", function(a, b) {
                        var aCalendar = getEventCalendar(a.extendedProps.jEvent);
                        var bCalendar = getEventCalendar(b.extendedProps.jEvent);
                        if (aCalendar.primary && !bCalendar.primary) {
                            return -1;
                        } else if (!aCalendar.primary && bCalendar.primary) {
                            return +1;
                        } else {
                            let aCalendarName = getCalendarName(aCalendar);
                            let bCalendarName = getCalendarName(bCalendar);
                            if (aCalendarName == bCalendarName) {
                                return a.title.localeCompare(b.title);
                            } else {
                                if (aCalendar.id == TASKS_CALENDAR_OBJECT.id && bCalendar.id != TASKS_CALENDAR_OBJECT.id) {
                                    return -1;
                                } else if (aCalendar.id != TASKS_CALENDAR_OBJECT.id && bCalendar.id == TASKS_CALENDAR_OBJECT.id) {
                                    return +1;
                                } else if (aCalendarName) {
                                    return aCalendarName.localeCompare(bCalendarName);
                                }
                            }
                        }
                    }],
                    slotLabelFormat: slotLabelFormat,
                    fixedWeekCount: await storage.get("weeksInMonth") == "auto" || (calendarView == CalendarView.CUSTOM && isCustomViewInWeeks(customView)) ? false : true,
                    height: calculateCalendarHeight(),
                    eventLimit: true,
                    eventLimitText: getMessage("more"),
                    slotDuration: "00:" + await storage.get("slotDuration") + ":00",
                    //snapDuration: "00:60:00",
                    defaultTimedEventDuration: "00:30:00",
                    weekends: !calendarSettings.hideWeekends,
                    firstDay: parseInt(firstDay),
                    selectable: true,
                    selectHelper: true,
                    select: function(info) { // start, end, jsEvent, view
                        // prevent double click
                        if (!window.recentlySelected) {
                            window.recentlySelected = new Date();
                            setTimeout(function() {
                                window.recentlySelected = null;									
                            }, 500);

                            console.log("local: ", info);
                            console.log("start date: ", info.start);
                            
                            // patch because fc was set exclusive end date meaning if select only today the end date is tomorrow - so let's subtract 1 day
                            if (info.allDay && (info.end.getTime() - info.start.getTime() <= ONE_DAY)) { // means: all day and one day selection only (note: on DST day itself it seems i had to use <= ONE_DAY in the case of a rolling clock back 1 hour)
                                const event = {startTime:info.start, allDay:info.allDay};
                                showCreateBubble({event:event, jsEvent:info.jsEvent});
                            } else {
                                const event = {startTime:info.start, endTime:info.end, allDay:info.allDay};
                                showCreateBubble({event:event, jsEvent:info.jsEvent});
                            }
                        }
                    },
                    editable: true,
                    buttonText: {
                        today:    getMessage("today"),
                        month:    getMessage("month"),
                        week:     getMessage("week"),
                        day:      getMessage("day"),
                        basicDay: getMessage("agenda")
                    },
                    allDayText: getMessage("allDayText"),
                    scrollTime: (new Date().getHours()-1) + ':00:00',
                    minTime: minTime,
                    maxTime: maxTime,
                    dir: getMessage("dir"),
                    weekNumbers: await storage.get("showWeekNumbers"),
                    viewSkeletonRender: function(info) {
                        console.log("viewSkeletonRender", info)
                    },
                    datesRender: function(info) {
                        if (fromToolbar && !DetectClient.isFirefox() && maximizeVisibleEventsInADay) {
                            // patch for eventLimit true which could left some space for more events, note had to also adjust calculateCalendarHeight
                            setTimeout(() => {
                                const rows = info.view.dayGrid?.rowCnt;
                                if (rows == 4) {
                                    fullCalendar.setOption("eventLimit", 5);
                                } else if (rows == 5) {
                                    /*
                                    const scroller = document.querySelector(".fc-scroller");
                                    if (scroller) {
                                        //alert($(scroller).hasVerticalScrollbar());
                                    }
                                    */
                                    fullCalendar.setOption("eventLimit", 4);
                                } else if (rows == 6) {
                                    fullCalendar.setOption("eventLimit", 3);
                                }
                            }, 1);
                        }
                        setTimeout(() => {
                            document.getElementById("calendarTitle").textContent = info.view.title;
                        }, 1);
                    },
                    dayRender: async function(info) {
                        if (showDayOfYear) {
                            const $div = $("<div class='dayOfYear'/>")
                            $div.text(info.date.getDayOfYear());
                            $(info.el).empty().append($div);
                        }
                    },
                    eventRender: function(info) {
                        var calendar;
                        const fcEvent = info.event;
                        const element = info.el;
                        const jEvent = fcEvent.extendedProps.jEvent;

                        if (jEvent) {
                            calendar = getEventCalendar(jEvent);
                        }
                        
                        element.addEventListener('dblclick', function() {
                            if (isCalendarWriteable(calendar)) {
                                setTimeout(function () {
                                    $("#clickedEventDialog")[0].close();
                                }, 500);
                                showCreateBubble({ event: jEvent, editing: true });
                            }
                        });
                        
                        var title;
                        if (fcEvent.extendedProps.isSnoozer) {
                            title = fcEvent.title + " (snoozed)";
                            element.classList.add("snoozedEvent");
                        } else if (jEvent.kind == TASKS_KIND) {
                            title = fcEvent.title;
                            element.classList.add("task");

                            if (jEvent.status == TaskStatus.COMPLETED) {
                                element.classList.add("task-completed");
                            }
                        } else {
                            title = fcEvent.title;
                        }
                        element.setAttribute("title", title);
                        
                        if (fcEvent.start.isToday()) {
                            element.classList.add("event-is-today");
                        }
                        
                        var timedEvent;
                        if (info.view.type == getFCViewName(CalendarView.MONTH) || (info.view.type == getFCViewName(CalendarView.CUSTOM) && isCustomViewInWeeks(customView))) {
                            // inverse fore/background colors (EXCEPT if the event spans on 2+ days)
                            //console.log(title + " " + fcEvent.allDay + " " + fcEvent.start + " " + fcEvent.end)
                            if (!fcEvent.allDay && (!fcEvent.end || fcEvent.start.isSameDay(fcEvent.end))) {
                                element.classList.add("timedEvent");
                                timedEvent = true;

                                if (jEvent) {
                                    if (window.matchFontColorWithEventColor) {
                                        element.style.color = darkenColor(calendar.backgroundColor);
                                        if (jEvent.colorId && colors) {
                                            const color = colors.event[jEvent.colorId].background;
                                            $(element).find(".fc-time").before("<span class='eventColorIndicator' style='background-color:" + color + "'>&nbsp;</span>");
                                        }
                                    } else {
                                        const eventColors = getEventColors({
                                            event: jEvent,
                                            cachedFeeds: cachedFeeds,
                                            arrayOfCalendars: arrayOfCalendars
                                        });
                                        $(element).find(".fc-content").prepend("<span class='eventColorIndicator' style='background-color:" + eventColors.bgColor + "'>&nbsp;</span>");
                                    }
                                } else {
                                    console.warn("color not found because jEvent not associated to event:", fcEvent);
                                }
                            }
                        } else {
                            if (!fcEvent.allDay) {
                                // when selecting time by dragging in weekview
                                if (!jEvent) {
                                    const eventColors = getEventColors({
                                        cachedFeeds: cachedFeeds,
                                        arrayOfCalendars: arrayOfCalendars
                                    });
                                    element.style.backgroundColor = eventColors.bgColor;
                                }
                            }
                        }
                        
                        if (fcEvent.end?.isBefore()) {
                            element.classList.add("pastEvent");
                            (async () => {
                                if (pastDays) {
                                    let bgColor = element.style.backgroundColor;
                                    if (bgColor) {
                                        element.style.backgroundColor = setRgbOpacity(bgColor, "0.3");
                                    }
                                }
                            })();
                        }
                        
                        if (fcEvent.extendedProps.isDeclined) {
                            element.classList.add("fcDeclinedEvent");
                        }
                        
                        // test for jEvent because when doing a drag & drop to creat an event in day view the jEvent does not exist.
                        if (jEvent) {
                            element.setAttribute("calendar", getCalendarName(calendar));

                            if (info.view.type == getFCViewName(CalendarView.DAY) && showEventIcons) {
                                const $eventIcon = $("<span class='eventIcon'></span>");
                                if (setEventIcon({
                                        event: jEvent,
                                        $eventIcon: $eventIcon,
                                        cachedFeeds: cachedFeeds,
                                        arrayOfCalendars: arrayOfCalendars
                                    })) {
                                    if (!timedEvent) {
                                        $eventIcon.css("fill", fcEvent.textColor);
                                    }
                                    $(element).find(".fc-title").prepend($eventIcon);
                                }
                            }
                        }
                    },
                    eventClick: function(info) {
                        console.log("eventClick", info);
                        showDetailsBubble({event:info.event.extendedProps.jEvent, calEvent:info.event, jsEvent:info.jsEvent});
                        // prevents href or url from clicked which caused issue in widget - more info: http://fullcalendar.io/docs/mouse/eventClick/
                        info.jsEvent.preventDefault();
                    },
                    eventDrop: async function(info) {
                        const fcEvent = info.event;
                        const jEvent = fcEvent.extendedProps.jEvent;
                        
                        if (fcEvent.extendedProps.isSnoozer) {
                            // do nothing seems to work because of rereence
                            console.log("snooze dropped");
                            
                            const snoozers = await getSnoozers();
                            snoozers.some(snoozer => {
                                if (snoozer.event.id == jEvent.id) {
                                    snoozer.time = fcEvent.start;
                                    chrome.runtime.sendMessage({command:"updateSnoozer", eventId:snoozer.event.id, time:fcEvent.start.toJSON()}, function() {});
                                    return true;
                                }
                            });
                        } else {
                            const eventEntry = deepClone(jEvent);

                            if (isCtrlPressed(info.jsEvent)) {
                                // copy event
                                info.revert();
                                
                                eventEntry.quickAdd = false;
                                eventEntry.startTime = fcEvent.start; // new Date(eventEntry.startTime.getTime() + info.delta.getTime());
                                if (eventEntry.endTime) {
                                    eventEntry.endTime = fcEvent.end; // new Date(eventEntry.endTime.getTime() + info.delta.getTime());
                                }
                                
                                insertAndLoadInCalendar(eventEntry).catch(error => {
                                    // do nothing already caught inside
                                });
                            } else {
                                eventEntry.allDay = fcEvent.allDay;
                                eventEntry.startTime = fcEvent.start;
                                eventEntry.endTime = fcEvent.end;
                                
                                ensureSendNotificationDialog({ event: jEvent, action: SendNotificationsAction.EDIT }).then(response => {
                                    if (response.cancel) {
                                        info.revert();
                                    } else {
                                        showSaving();

                                        const updateEventParams = {
                                            eventEntry: eventEntry,
                                            event: jEvent
                                        };
                                        updateEventParams.eventEntry.sendNotifications = response.sendNotifications;

                                        updateEvent(updateEventParams).then(async response => {
                                            if (response.cancel) {
                                                info.revert();
                                            } else {
                                                if (eventEntry.recurringEventId) {
                                                    reloadCalendar({
                                                        source: "recurringEventDragDrop",
                                                        bypassCache: true,
                                                        refetchEvents: true
                                                    });
                                                } else if (eventEntry.kind == TASKS_KIND) {
                                                    await updateCachedFeed(jEvent, {
                                                        operation: "update",
                                                    });
                                                } else {
                                                    reloadCalendar({
                                                        source: "dragDrop"
                                                    });
                                                }
                                                hideSaving();
                                                await sleep(500);
                                                setStatusMessage({ message: getMessage("eventUpdated") });
                                            }
                                        }).catch(error => {
                                            showCalendarError(error);
                                            info.revert();
                                        });
                                    }
                                });
                            }
                        }
                    },
                    eventResize: function(info) {
                        const fcEvent = info.event;
                        const jEvent = fcEvent.extendedProps.jEvent;

                        const eventEntry = {
                            allDay:		fcEvent.allDay,
                            startTime:	fcEvent.start,
                            endTime:	fcEvent.end,
                        };
                        
                        ensureSendNotificationDialog({
                            event: jEvent,
                            action: SendNotificationsAction.EDIT
                        }).then(response => {
                            if (response.cancel) {
                                info.revert();
                            } else {
                                const updateEventParams = {
                                    eventEntry: eventEntry,
                                    event: jEvent
                                };
                                updateEventParams.eventEntry.sendNotifications = response.sendNotifications;

                                updateEvent(updateEventParams).then(async response => {
                                    if (response.cancel) {
                                        info.revert();
                                    } else {
                                        reloadCalendar({ source: "eventResize" });
                                        await sleep(500);
                                        setStatusMessage({ message: getMessage("eventUpdated") });
                                    }
                                }).catch(error => {
                                    showCalendarError(error);
                                    info.revert();
                                });
                            }
                        });
                    },
                }

                const defaultDate = await storage.get("defaultDate")
                if (calendarView == CalendarView.CUSTOM && defaultDate) {
                    fullCalendarParams.defaultDate = today().addDays(defaultDate);
                }

                const fullCalendarDiv = document.getElementById("betaCalendar");
                fullCalendar = new FullCalendar.Calendar(fullCalendarDiv, fullCalendarParams);
                fullCalendar.addEventSource(source);
                fullCalendar.render();
                
                $("#betaCalendar").on("mousedown", function(e) {
                    if (e.buttons == 1 && isCtrlPressed(e)) {
                        openGenericDialog({
                            content: "To copy an event drag first then hold Ctrl"
                        });
                    }
                });

                $("#betaCalendar").show();
            }
        }).catch(error => {
            showLoadingError(error);
        });

        $("#prev").click(function() {
            fullCalendar.prev();
            calendarShowingCurrentDate = false;
        });

        $("#next").click(function() {
            gotoDate({next:true});
        });
        
        $("#calendarTitle, #calendarTitleDropdown").click(async () => {
            const calendarView = await getCalendarView();
            if (calendarView == CalendarView.AGENDA) {
                
                if (!$("#datepicker").hasClass("hasDatepicker")) {
                    var datePickerStartParams = await generateDatePickerParams();
                    datePickerStartParams.onSelect = function(dateText, inst) {
                        var eventEntry = {};
                        eventEntry.allDay = true;
                        eventEntry.startTime = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay).toJSON();
                        chrome.runtime.sendMessage({command:"generateActionLink", eventEntry:eventEntry}, function(response) {
                            showCreateBubble({event:eventEntry});
                        });

                        /*
                        var start = $("#datepicker").datepicker( "getDate" );
                        var end = start.addDays(21);
                        
                        displayAgendaHeaderDetails(start);
                        
                        fetchAgendaEvents({start:start, end:end, forceEmpty:true}).then(function() {
                            // do nothing
                        });
                        */
                    };
                    datePickerStartParams.onChangeMonthYear = function(year, month, inst) {
                        gotoDate({date: new Date(year, month-1, 1)});
                    };
                    $("#datepicker").datepicker(datePickerStartParams);
                }
                
                if ($("#datepickerWrapper").is(":visible")) {
                    $("body").removeClass("datePickerVisible");
                    $("#datepickerToolbar").hide();
                    $("#datepickerWrapper").hide();
                } else {
                    $("body").addClass("datePickerVisible");
                    $("#datepickerToolbar").show();
                    //scrollTarget.scrollTop = 0;
                    $("#datepickerWrapper").fadeIn();
                }
                $("app-drawer-layout")[0].notifyResize();
                
            } else {
                if (calendarShowingCurrentDate) {
                    openGoToDate();
                } else {
                    temporarilyDisableFetching(() => {
                        fcChangeView(calendarView);
                    });

                    fullCalendar.today();
                    calendarShowingCurrentDate = true;
                }
            }
        });

        if (!isOnline()) {
            showError(getMessage("yourOffline"));
        }
    }
    
    $(".skins")
        .click(function() {
            showSkinsDialog();
        })
    ;
    
    $(".options").click(function() {
        openOptions();
    });

    $(".contribute").click(function() {
        openContribute();
    });

    $(".help").click(function() {
        openHelp();
    });
    
    $("#goToToday").click(function() {
        const $today = $(".today");
        if ($today.length) {
            $today[0].scrollIntoView();
            $("#drawerPanel")[0].scrollIntoView();
        } else {
            gotoDate({date: today()});
        }
    });

    $("#showSearch").click(function() {
        showSearch();
    });
    
    $("#search").click(function() {
        searchEvents();
    });
    
    $("#searchInput")
        .keydown(function(e) {
            // enter pressed
            if (e.key === "Enter" && !e.originalEvent.isComposing) {
                searchEvents();
            }
        })
    ;
    
    $("#back").click(async () => {
        $("html").removeClass("searchInputVisible");
        
        if (await getCalendarView() == CalendarView.AGENDA) {
            initAgenda();
        } else {
            // patch: because a top margin would appear and create vertical scrollbars??
            fullCalendar.refetchEvents();
        }
    });

    $("#refresh").click(async function() {
        showSaving();

        const params = {
            source:	"refresh",
            bypassCache: true,
            refetchEvents: true
        };

        // double click
        if (window.lastRefresh && Date.now() - window.lastRefresh.getTime() <= 800) {
            params.skipSync = true;
        }

        await reloadCalendar(params);
        initVisibleCalendarsList();

        window.lastRefresh = new Date();

        hideSaving();
    });

    $(".close").click(function() {
        window.close();
    });

    async function openFBPermissionDialog(eventID) {
        if (!await storage.get("respondedNoToFBPermission")) {
            polymerPromise2.then(() => {
                var $dialog = initTemplate("fbPermissionOverlayTemplate");
                $dialog.find(".ok").click(() => {
    
                    let url = "popup.html";
                    if (eventID) {
                        url = setUrlParam(url, "fb-event-id", eventID);
                    }
    
                    // patch: FF cannot request permission fromToolbar popup window, so must open detached popup and redo this
                    if (DetectClient.isFirefox() && fromToolbar) {
                        url = setUrlParam(url, "open-fb-permissions", "true");
                        openWindowInCenter(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes', 800, 600);
                    } else {
                        chrome.permissions.request({
                            origins: [Origins.FACEBOOK]
                        }, function(granted) {
                            if (granted) {
                                location.href = url;
                            }
                        });
                    }
                });
                $dialog.find(".cancel").click(() => {
                    storage.setDate("respondedNoToFBPermission");
                });
                $dialog.find(".fb-other").click(() => {
                    openUrl("https://jasonsavard.com/wiki/Adding_Facebook_events_to_Google_Calendar");
                });
                openDialog($dialog);
            });
        }
    }

    let fbEventId = getUrlValue(location.href, "fb-event-id");

    if (location.href.includes("open-fb-permissions=true")) {
        openFBPermissionDialog(fbEventId);
    } else {
        if (!fbEventId) {
            const tab = await getActiveTab();
            if (tab && tab.url) {
                const matches = tab.url.match(/facebook\.com\/events\/(\d*)/i); 
                if (matches) {
                    fbEventId = matches[1];
                }
            }
        }

        if (fbEventId) {
            const fbEventUrl = `https://www.facebook.com/ical/event.php?eid=${fbEventId}`;
            if (DetectClient.isFirefox()) {
                if (chrome.permissions) {
                    chrome.permissions.contains({
                        origins: [Origins.FACEBOOK]
                    }, function(result) {
                        if (result) {
                            fetchAndDisplayEvent(fbEventUrl);
                        } else {
                            openFBPermissionDialog(fbEventId);
                        }
                    });
                }
            } else {
                fetchAndDisplayEvent(fbEventUrl);
            }
        }
    }
    
    $(".share-button").one("click", function() {
        storage.enable("followMeClicked");
        //var $shareMenu = initTemplate("shareMenuTemplate");
        
        $("#share-menu paper-item").click(function() {
            var value = $(this).attr("id");
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
    });
    
    $("#quickAddGoBack").click(function() {
        $("html").removeClass("quickAddVisible");
    });

    $("#quickAdd")
        .keydown(function(e) {
            $("#quickAddWrapper").addClass("inputEntered");

            // enter pressed
            if (e.key === "Enter" && !e.originalEvent.isComposing) {
                saveQuickAdd();
            }
        })
        .on("paste", function() {
            $("#quickAddWrapper").addClass("inputEntered");
        })
        .blur(function(e) {
            var $quickAddWrapper = $(e.relatedTarget).closest("#quickAddWrapper");
            if ($quickAddWrapper.length || $("#quickAdd").val()) {
                // do nothing
            } else {
                $("html").removeClass("quickAddVisible");
            }
        })
    ;
    
    const notificationsOpened = await storage.get("notificationsOpened");
    if (notificationsOpened.length) {
        $("#pendingNotifications").css("display", "inline-block");
    } else {

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
                $(".share-button-real .share-button").addClass("swing");
            }
        }
    }
    
    $("#pendingNotifications").click(function() {
        openReminders().then(() => {
            closeWindow();
        });
    });
    
    // need polyer promise because .show() was NOT working before outer paper-toolip was initialized
    polymerPromise.then(async () => {
        if (await shouldShowExtraFeature()) {
            $("#newsNotification")
                .attr("icon", "myIcons:theme")
                .unhide()
                .click(function () {
                    showSkinsDialog();
                })
            ;
            $("#newsNotificationReducedDonationMessage")
                .text(getMessage("addSkinsOrThemes"))
                .unhide()
            ;
        } else if (await shouldShowReducedDonationMsg(true)) {
            $("#newsNotification")
                .unhide()
                .click(function() {
                    openUrl("contribute.html?ref=reducedDonationFromPopup");
                })
            ;
            $("#newsNotificationReducedDonationMessage").unhide();
        } else if (!await storage.get("tryMyOtherExtensionsClicked") && await daysElapsedSinceFirstInstalled() >= UserNoticeSchedule.DAYS_BEFORE_SHOWING_TRY_MY_OTHER_EXTENSION && await daysElapsedSinceFirstInstalled() < (UserNoticeSchedule.DAYS_BEFORE_SHOWING_TRY_MY_OTHER_EXTENSION + UserNoticeSchedule.DURATION_FOR_SHOWING_TRY_MY_OTHER_EXTENSION)) { // previous prefs: writeAboutMeClicked, tryMyOtherExtensionsClicked
            isGmailCheckerInstalled(function(installed) {
                if (!installed) {
                    $("#newsNotificationGmailAdMessage").unhide();
                    $("#newsNotification")
                        .unhide()
                        .click(async () => {
                            await storage.enable("tryMyOtherExtensionsClicked");
                            openUrl("https://jasonsavard.com/Checker-Plus-for-Gmail?ref=calpopup2");
                        })
                    ;
                }
            });
		} else if (await storage.get("_lastBigUpdate")) {
			$("#newsNotification")
				.unhide()
				.click(async () => {
                    await storage.remove("_lastBigUpdate");
                    openChangelog("bigUpdateFromPopupWindow");
				})
            ;
            $("#newsNotificationBigUpdateMessage").unhide();
        }
    });		
    
    $("#mainOptions").one("click", async () => {
        var $optionsMenu = $("#options-menu");
        
        initOptionsMenu();
        
        $("#viewAgenda").click(function() {
            changeCalendarView(CalendarView.AGENDA);
        });
        $("#viewListWeek").click(function() {
            changeCalendarView(CalendarView.LIST_WEEK);
        });
        $("#viewDay").click(function() {
            changeCalendarView(CalendarView.DAY);
        });
        $("#viewWeek").click(function() {
            changeCalendarView(CalendarView.WEEK);
        });
        $("#viewMonth").click(function() {
            changeCalendarView(CalendarView.MONTH);
        });
        
        const customView = await storage.get("customView");
        if (isCustomViewInDays(customView)) {
            $("#viewXWeeksLabel").text(getMessage("Xdays", await getValueFromCustomView()));
        } else {
            $("#viewXWeeksLabel").text(getMessage("Xweeks", await getValueFromCustomView()));
        }

        $("#viewCustomSettings").click(function() {
            openUrl("options.html?highlight=customView#general");
            return false;
        });
        
        $("#viewCustom").click(function() {
            changeCalendarView(CalendarView.CUSTOM);
        });
                    
        /*
        $optionsMenu.find(".options").click(function() {
            openOptions();
        });
        */

        $optionsMenu.find(".popout").click(function() {
            popout();
        });

        $optionsMenu.find(".changelog").click(async function() {
            await storage.remove("_lastBigUpdate");
            openChangelog("CalendarCheckerOptionsMenu");
        });

        /*
        $optionsMenu.find(".contribute").click(function() {
            openContribute();
        });
        */

        $optionsMenu.find(".discoverMyApps").click(function() {
            openUrl("https://jasonsavard.com?ref=CalendarCheckerOptionsMenu");
        });

        $optionsMenu.find(".feedback").click(function() {
            openUrl("https://jasonsavard.com/forum/categories/checker-plus-for-google-calendar-feedback?ref=CalendarCheckerOptionsMenu");
        });

        $optionsMenu.find(".followMe").click(function() {
            openUrl("https://jasonsavard.com/?followMe=true&ref=CalendarCheckerOptionsMenu");
        });

        $optionsMenu.find(".aboutMe").click(function() {
            openUrl("https://jasonsavard.com/about?ref=CalendarCheckerOptionsMenu");
        });

        /*
        $optionsMenu.find(".help").click(function() {
            openHelp();
        });
        */

    });

    $("#bigAddEventButton").click(function() {
        
        initQuickAdd();

        var elem = document.querySelector("#quickAdd");
        var player = elem.animate([
            {opacity: "0.5", transform: "scale(1.2)"},
            {opacity: "1.0", transform: "scale(1)"}
        ], {
            duration: 200
        });

    });
    
    $("#save").click(function() {
        saveQuickAdd();
    });
    
    const detachedPopupWidth = await storage.get("detachedPopupWidth");
    const detachedPopupHeight = await storage.get("detachedPopupHeight");
    // patch must use mousedown instead of click because it seems Chrome will open window as tab instead of detached popup window
    $("#maximize")[DetectClient.isFirefox() ? "mouseup" : "mousedown"](function(e) {
        if (isCtrlPressed(e)) {
            openWindowInCenter("popup.html", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes', detachedPopupWidth, detachedPopupHeight);
            if (DetectClient.isChrome()) {
                closeWindow();
            }
        } else {
            openGoogleCalendarWebsite();
        }
        return false;
    });
    
    scrollTarget = document.querySelector('#mainContent');
    $(scrollTarget).on("scroll", async e => {
        // ignore this scroll event cause it was initiated automatically by scrollIntoView
        if (window.autoScrollIntoView || $("html").hasClass("searchInputVisible")) {
            return;
        }
        
        var target = e.originalEvent.target;
        if (await getCalendarView() == CalendarView.AGENDA) {
            
            if (target.scrollTop == 0) {
                var firstAgendaDayDate = $("#agendaEvents").find(".agendaDay").data();
                if (firstAgendaDayDate && firstAgendaDayDate.event) {
                    displayAgendaHeaderDetails(firstAgendaDayDate.event.startTime);
                }
            }
            
            var BEFORE_END_Y_BUFFER = 800;
            
            if (!fetchingAgendaEvents) {
                if (target.scrollTop && target.scrollTop > target.scrollHeight - BEFORE_END_Y_BUFFER) {
                    console.log("scroll down");
                    fetchingAgendaEvents = true;
                    
                    var $agendaEvents = $("#agendaEvents");
                    var data = $agendaEvents.data();
                    
                    console.log("data", data);
                    
                    if (data.events.length) {
                        // this logic added because last event might have been added dynamically via a gcm update and not represent all events fetched before that
                        var lastEventStartDate;
                        if (window.scrolledBefore) {
                            lastEventStartDate = data.events.last().startTime;
                        } else {
                            lastEventStartDate = await getEndDateAfterThisMonth();
                        }
                        window.scrolledBefore = true;
                        
                        var start = lastEventStartDate.addDays(1);
                        var end = lastEventStartDate.addDays(31);
                        fetchAgendaEvents({start:start, end:end, append:true}).then(() => {
                            fetchingAgendaEvents = false;
                        });
                    } else {
                        fetchingAgendaEvents = false;
                    }
                } else if (target.scrollTop && target.scrollTop < BEFORE_END_Y_BUFFER) {
                    console.log("scroll up");
                    fetchingAgendaEvents = true;
                    
                    var $agendaEvents = $("#agendaEvents");
                    var data = $agendaEvents.data();
                    
                    console.log("data", data);
                    
                    if (data.events.length) {
                        var start = data.events.first().startTime.addDays(-31);
                        var end = data.events.first().startTime;
                        fetchAgendaEvents({start:start, end:end, prepend:true}).then(() => {
                            fetchingAgendaEvents = false;
                        });
                    } else {
                        fetchingAgendaEvents = false;
                    }
                }
            }
        }
    });

    var autoSaveObj = await storage.get("autoSave");
	if (autoSaveObj && autoSaveObj.event) {
		polymerPromise2.then(() => {
            showCreateBubble(autoSaveObj);
            showMessage("Restored unsaved event!");
        });
    }
    
    window.onresize = function(e) {
        if (!fromToolbar) {
            fullCalendar?.setOption('height', calculateCalendarHeight());

            storage.set("detachedPopupWidth", window.outerWidth);
            storage.set("detachedPopupHeight", window.outerHeight);
        }
    };
}

init();