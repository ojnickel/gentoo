// Copyright Jason Savard

/*
try {
    importScripts("js/common.js", "js/checkerPlusForCalendar.js");
} catch (error) {
    console.error("error in sw:", error);
}
*/

var inBackground = true;

// Clear this info
var events = [];

var notificationWindow; // handler for single window like text or html
var notificationsOpened = []; // notifications wrapper objects for each event that is displayed in a notification (not necessarily notification handlers - because of grouped notifications option)
var notificationsQueue = [];
var eventsShown = [];

var lastBadgeIcon;
var notificationAudio;
var lastNotificationAudioSource;
var forgottenReminderAnimation;
var eventsIgnoredDueToCalendarReminderChangeByUser;
var calendarMap;

// wakeup from sleep callback
var detectSleepMode = new DetectSleepMode(function() {
	//updateContextMenuItems();
});

var IDLE_DETECTION_INTERVAL = 120; // in seconds
var notificationsOpenedCountWhenIdle;

function formatTimeForBadge(date, hideColonInTime) {
    var formattedTime = date.toLocaleTimeStringJ(true);
    // remove any spaces ie. 12 am > 12am
    formattedTime = formattedTime.replace(/ /g, "");
	if (formattedTime.length >= 5) {
        formattedTime = formattedTime.replace(/am$/, "").replace(/pm$/, "");
    } else if (formattedTime.length >= 4) {
        formattedTime = formattedTime.replace(/am$/, "a").replace(/pm$/, "p");
    }

	if (hideColonInTime) {
		if (formattedTime.length >= 4) {
			formattedTime = formattedTime.replace(":", "");
		}
    }

    if (formattedTime.length >= 6) {
        formattedTime = formattedTime.replaceAll(" ", "");
    }
    
    if (formattedTime.length >= 6) {
        const formatter = new Intl.DateTimeFormat(locale, {
            hour: "numeric",
            minute: "numeric",
            hourCycle: getHourCycle()
        });
        const parts = formatter.formatToParts(date);

        try {
            parts.forEach((part, index) => {
                if (part.type == "hour") {
                    const hour = part.value;
                    const separator = parts[index+1].value.trim();
                    const minute = parts[index+2].value;
                    formattedTime = `${hour}${separator}${minute}`;
                }
            });
            console.log("from parts", formattedTime);
        } catch (error) {
            console.warn("could not parse time: ", error);
        }
    }

	return formattedTime.trim();
}

function setOmniboxSuggestion(text, suggest) {
	//var tom = /^tom:/.test(text);
	// must be same regex as other references...
	var tom = new RegExp("^" + getMessage("tom") + ":").test(text);
	var plainText = text && text.length && !tom;
	var desc = "<match><url>cal</url></match> ";
	desc += plainText ? ('<match>' + text + '</match>') : getMessage("omniboxDefault");
	desc += "<dim> " + getMessage("or") + " </dim>";
	desc += tom ? ('<match>' + text + '</match>') : getMessage("tom") + ":" + getMessage("omniboxDefaultTom");
	if (chrome.omnibox) {
        try {
            chrome.omnibox.setDefaultSuggestion({
                description: desc
            });
        } catch (error) {
            console.warn("v3 bug?", error);
        }
	}
}

const MIN_SECONDS_BETWEEN_MODIFICATIONS_BY_EXTENSION_AND_GCM_MESSAGES = 15;
const MIN_SECONDS_BETWEEN_POLLS = 4;
const MIN_SECONDS_BETWEEN_PROCESSING_GCM_MESSAGES = 1;
var pollServerTimer;

async function pollServerFromFCMUpdate() {
    await pollServer({source:GCM_SOURCE});
    chrome.runtime.sendMessage({command: "gcmUpdate"});
}

async function processWatchMessage(message, sourceGCM) {

	function feedMatchesMessage(feedDetails, message) {
        if (feedDetails && feedDetails.watchResponse) {
            if (sourceGCM) {
                return feedDetails.watchResponse.id == message.data.channelId;
            } else {
                return feedDetails.watchResponse.resourceId == message.resourceId;
            }
        }
    }
    
    // commented because we were overwriting events and losing them when adding them with right click
    //cachedFeeds = await storage.get("cachedFeeds");
    
    var objUpdated;
    var calendarSettings = await storage.get("calendarSettings");
    
    if (feedMatchesMessage(calendarSettings, message)) {
        console.log("calendarSettings changed");
        objUpdated = calendarSettings;
        //sendGA("gcmMessage", "calendarSettings");
    } else if (feedMatchesMessage(cachedFeedsDetails["calendarList"], message)) {
        console.log("calendarList changed");
        objUpdated = cachedFeedsDetails["calendarList"];
        //sendGA("gcmMessage", "calendarList");
    } else {
        for (feedId in cachedFeeds) {
            if (feedMatchesMessage(cachedFeedsDetails[feedId], message)) {
                console.log("calendar changed: " + cachedFeeds[feedId].summary);
                objUpdated = cachedFeedsDetails[feedId];
                // anonymize
                var feedIdAnon = feedId.split("@")[0].substr(0,3);
                //sendGA("gcmMessage", "calendarEvents", feedIdAnon);
                break;
            }
        }
    }
    
    if (objUpdated) {

        let passedLastProcessMessage;
        let messageDate;
        if (sourceGCM) {
            passedLastProcessMessage = true;
        } else {
            messageDate = new Date(message.date.seconds * 1000);
            passedLastProcessMessage = !objUpdated.CPlastMessageDate || messageDate.isAfter(objUpdated.CPlastMessageDate);
        }
        
        if (passedLastProcessMessage) {
            if (messageDate) {
                objUpdated.CPlastMessageDate = messageDate;
            }
            delete objUpdated.CPlastFetched;
            await storage.set("calendarSettings", calendarSettings);
            await storage.set("cachedFeedsDetails", cachedFeedsDetails);
            const lastPollTime = await storage.get("_lastPollTime");
            const lastCalendarModificationByExtension = await storage.get("_lastCalendarModificationByExtension");

            clearTimeout(pollServerTimer);
            
            if (lastCalendarModificationByExtension.diffInSeconds() >= -MIN_SECONDS_BETWEEN_MODIFICATIONS_BY_EXTENSION_AND_GCM_MESSAGES) { // avoid race condition/duplicate events when modifing events in popup by adding a delay when extension modifies calendar
                console.log("delay for 1 minute to avoid race condition");
                chrome.alarms.create(Alarms.POLL_SERVER_FROM_FCM_UPDATE, {delayInMinutes: 1});
            } else {
                chrome.alarms.clear(Alarms.POLL_SERVER_FROM_FCM_UPDATE);

                if (lastPollTime.diffInSeconds() < -MIN_SECONDS_BETWEEN_POLLS) {
                    pollServerFromFCMUpdate();
                } else {
                    pollServerTimer = setTimeout(() => {
                        pollServerFromFCMUpdate();
                    }, seconds(MIN_SECONDS_BETWEEN_PROCESSING_GCM_MESSAGES));
                }
            }
        } else {
            console.log("already processed this message");
        }
    } else {
        console.log("Unknown message", message);
    }
}

if (chrome.gcm) {
	chrome.gcm.onMessage.addListener(async message => {
        console.log("onGCMMessage", new Date(), message);
        await initMisc();
        await processWatchMessage(message, "GCM");
    });
}

if (chrome.instanceID) {
    chrome.instanceID.onTokenRefresh.addListener(async function() {
        console.log("onTokenRefresh args", arguments);
        storage.remove("registrationId");
    });
}

async function watch(params) {
    if (chrome.gcm) {
        const data = {
            id: getUUID(),
            type: "web_hook",
            expiration: new Date().addDays(WATCH_EXPIRATION_IN_DAYS).getTime(),
            address: "https://calendar-extension.appspot.com/notifications",
            token: "registrationId=" + await ensureGCMRegistration()
        };

        try {
            const watchResponse = await oauthDeviceSend({
                type: "post",
                url: params.url,
                data: data,
                version: "gcm"
            });

            startWatchAlarm(params.alarmName, watchResponse);
            // reset retries
            const watchRetries = await storage.get("_watchRetries");
            watchRetries[params.url] = 0;
            await storage.set("_watchRetries", watchRetries);
            return watchResponse;
        } catch (error) {
            if (error.code != 400) { // only if supported
                const MAX_RETRIES = 3;
                const watchRetries = await storage.get("_watchRetries");
                if (!watchRetries[params.url]) {
                    watchRetries[params.url] = 0;
                }
                if (watchRetries[params.url]++ < MAX_RETRIES) {
                    console.info("watch retry attempt #" + watchRetries[params.url]);
                    const exponentialRetryInSeconds = Math.pow(30, watchRetries[params.url]);
                    // minimum 1 min due to chrome alarm limitation
                    const delayInMinutes = Math.max(1, exponentialRetryInSeconds / 60);
                    chrome.alarms.create(params.alarmName, {delayInMinutes: delayInMinutes});
                }
                await storage.set("_watchRetries", watchRetries);
            }
            throw error;
        }
    } else {
        throw "GCM not supported";
    }
}

function startWatchAlarm(alarmName, watchResponse) {
	var DELAY_BETWEEN_STOP_AND_START_IN_SECONDS = 5;
	if (watchResponse) {
		var expiration = new Date(parseInt(watchResponse.expiration));
		var nextWatchDate = expiration.addSeconds(DELAY_BETWEEN_STOP_AND_START_IN_SECONDS);
		console.log("nextWatchDate", nextWatchDate);
		chrome.alarms.create(alarmName, {when:nextWatchDate.getTime()});
	} else {
		console.error("Can't startWatchAlarm because no watchResponse");
	}
}

async function watchCalendarSettings() {
	console.log("watchCalendarSettings");
	const watchResponse = await watch({
		url:"/users/me/settings/watch",
		alarmName: Alarms.WATCH_CALENDAR_SETTINGS
	});
    var calendarSettings = await storage.get("calendarSettings");
    calendarSettings.watchResponse = watchResponse;
    await storage.set("calendarSettings", calendarSettings);
}

async function watchCalendarList() {
	console.log("watchCalendarList");
	const watchResponse = await watch({
		url:"/users/me/calendarList/watch",
		alarmName: Alarms.WATCH_CALENDAR_LIST
	});
    if (!cachedFeeds["calendarList"]) {
        cachedFeeds["calendarList"] = {};
    }
    console.log("watchcalendarlist response", watchResponse);
    
    const calendarList = await getCachedFeedDetails("calendarList");
    calendarList.watchResponse = watchResponse;
    
    await storage.set("cachedFeeds", cachedFeeds);
    await storage.set("cachedFeedsDetails", cachedFeedsDetails);
}

async function watchCalendarEvents(calendarId) {
	if (!cachedFeeds[calendarId]) {
		cachedFeeds[calendarId] = {};
	}

	if (!cachedFeedsDetails[calendarId]) {
		cachedFeedsDetails[calendarId] = {};
	}

	console.log("watchCalendarEvents: " + cachedFeeds[calendarId].summary);

    try {
        const watchResponse = await watch({
            url: "/calendars/" + encodeURIComponent(calendarId) + "/events/watch",
            alarmName: WATCH_CALENDAR_EVENTS_ALARM_PREFIX + calendarId
        });
        console.log("watchCalendarEvents response", watchResponse);
		cachedFeedsDetails[calendarId].watchResponse = watchResponse;
		await storage.set("cachedFeeds", cachedFeeds);
		await storage.set("cachedFeedsDetails", cachedFeedsDetails);
    } catch (error) {
		if (error.code == 400) { // watch not supported
			cachedFeedsDetails[calendarId].watchResponse = {supported:false};
			await storage.set("cachedFeeds", cachedFeeds);
			await storage.set("cachedFeedsDetails", cachedFeedsDetails);
		}
		throw error;
    }
}

async function stopWatch(watchResponse) {
    return oauthDeviceSend({
        type: "post",
        url: "/channels/stop",
        data: {
            id: watchResponse.id,
            resourceId: watchResponse.resourceId
        }
    });
}

function isWatchSupported(calendarId, watchResponse) {
	let calendar = getCalendarById(calendarId);
	return !watchResponse || watchResponse.supported !== false || calendar.primary;
}

function isBeingWatched(watchResponse) {
	if (watchResponse && watchResponse.expiration) {
		return new Date(parseInt(watchResponse.expiration)).isAfter();
	}
}

async function ensureWatchCalendarSettings(params) {
	const calendarSettings = await storage.get("calendarSettings");
	
	if (calendarSettings && isBeingWatched(calendarSettings.watchResponse)) {
		if (params.source == "startup") {
			startWatchAlarm(Alarms.WATCH_CALENDAR_SETTINGS, calendarSettings.watchResponse);
		}
		return Promise.resolve();
	} else {
		return watchCalendarSettings();
	}
}

async function ensureWatchCalendarList(params) {
	const cachedFeedDetails = cachedFeedsDetails["calendarList"];
	
	if (cachedFeedDetails && isBeingWatched(cachedFeedDetails.watchResponse)) {
		if (params.source == "startup") {
			startWatchAlarm(Alarms.WATCH_CALENDAR_LIST, cachedFeedDetails.watchResponse);
		}
	} else {
		return watchCalendarList();
	}
}

async function ensureWatchCalendarEvents(params) {
	const cachedFeedDetails = cachedFeedsDetails[params.calendarId];
	
	if (cachedFeedDetails && (isBeingWatched(cachedFeedDetails.watchResponse) || !isWatchSupported(params.calendarId, cachedFeedDetails.watchResponse))) {
		if (params.source == "startup" && isWatchSupported(params.calendarId, cachedFeedDetails.watchResponse)) {
			startWatchAlarm(WATCH_CALENDAR_EVENTS_ALARM_PREFIX + params.calendarId, cachedFeedDetails.watchResponse);
		}
	} else {
		return watchCalendarEvents(params.calendarId);
	}
}

async function fetchCalendarSettings(params = {}) {
    var calendarSettings = await storage.get("calendarSettings");
    if (params.grantingAccess || params.bypassCache || !calendarSettings || !calendarSettings.CPlastFetched || new Date(calendarSettings.CPlastFetched).diffInDays() < -30 || calendarSettings.email != params.email) {
        try {
            await ensureWatchCalendarSettings({source:params.source});
        } catch (error) {
            logError("error ensureWatchCalendarSettings: " + error);
        }
        // must fetch it again because it's updated in ensureWatchCalendarSettings
        calendarSettings = await storage.get("calendarSettings");
        console.info("Fetching settings");
        const response = await oauthDeviceSend({
            userEmail: params.email,
            url: "/users/me/settings",
            roundtripArg: params.email
        });
        const settings = response.items;
        
        calendarSettings.CPlastFetched = new Date();
        if (params.email) {
            calendarSettings.email = params.email;
        } else {
            calendarSettings.email = await storage.get("email");
        }
        calendarSettings.calendarLocale = getSetting(settings, "locale", "en");
        calendarSettings.showDeclinedEvents = getSetting(settings, "showDeclinedEvents", true);
        calendarSettings.hideWeekends = getSetting(settings, "hideWeekends");
        calendarSettings.weekStart = getSetting(settings, "weekStart", 0);
        calendarSettings.timeZone = getSetting(settings, "timezone", "America/Montreal");
        calendarSettings.format24HourTime = getSetting(settings, "format24HourTime", false);
        calendarSettings.dateFieldOrder = getSetting(settings, "dateFieldOrder");
        calendarSettings.defaultEventLength = getSetting(settings, "defaultEventLength");
        calendarSettings.hideInvitations = getSetting(settings, "hideInvitations");
        calendarSettings.remindOnRespondedEventsOnly = getSetting(settings, "remindOnRespondedEventsOnly");
        
        // sync "my" 24 hour format extension option from calendar setting
        if (await storage.get("24hourMode") == undefined && calendarSettings.format24HourTime) {
            await storage.enable("24hourMode");
            twentyFourHour = true;
        }
        
        await storage.set("calendarSettings", calendarSettings);
        return response;
    } else {
        console.info("Fetching settings [CACHE]");
    }
}

async function fetchColors(params = {}) {
    const feedDetails = await getCachedFeedDetails("colors");

    if (params.bypassCache != true && cachedFeeds.colors && await feedUpdatedWithinTheseDays("colors", 30) && feedDetails.email == params.email) {
        console.info("Fetching colors... [CACHE]");
    } else {
        console.info("Fetching colors...")
        const response = await oauthDeviceSend({
            userEmail: params.email,
            url: "/colors"
        });
        cachedFeeds["colors"] = response;

        feedDetails.CPlastFetched = new Date();
        feedDetails.email = params.email;
        
        return response;
    }
}

function shortcutNotApplicableAtThisTime(title) {
	var body = "Click here to remove this shortcut.";
	var notif = new Notification(title, {body:body, icon:"/images/icons/icon-48.png"});
	notif.onclick = function() {
		openUrl("https://jasonsavard.com/wiki/Keyboard_shortcuts");
		this.close();
	}
}

async function closeNotifications(notifications, params = {}) { // lastAction, skipNotificationClear
	await updateNotificationEventsShown(notifications, eventsShown, params.lastAction);
	
	var notificationsCloned = notifications.shallowClone(); // because sometimes the notificationsOpened is passed in as notifications and when looping inside the next loop we modify the notificationsOpened which creates sync issues 
	
	console.log("notificationsCloned length: " + notificationsCloned.length)
	console.log("notificationsCloned: ", notificationsCloned)
	notificationsCloned.forEach(notification => {
		// remove from queue
		for (var a=0; a<notificationsQueue.length; a++) {
			if (isSameEvent(notificationsQueue[a].event, notification.event)) {				
				console.log("removed from queue: " + notification.event.summary);
				notificationsQueue.splice(a, 1);
				a--;
				break;
			}
		}

		// remove from array of opened notifs
		console.log("notificationsOpened length: " + notificationsOpened.length)
		for (var a=0; a<notificationsOpened.length; a++) {
			console.log("notificationsOpened[a].id: " + notificationsOpened[a].id)
			console.log("notificationsOpened[a]: ", notificationsOpened[a])
			console.log("notification.id: " + notification.id);
			if (notificationsOpened[a].id == notification.id) {
				console.log("removed from opened", notification.id);
				notificationsOpened.splice(a, 1);
				a--;
				break;
			}
		}
	});
	
	if (await storage.get("desktopNotification") == "rich" && !params.skipNotificationClear) {
		if (await isGroupedNotificationsEnabled()) {
			if (notificationsOpened.length == 0) {
				chrome.notifications.clear(GROUPED_NOTIFICATION_ID, async wasCleared => {
					// patch to force close the notification by unfocusing the notification window
					// Because the notification.clear is not working when the notification has been retoasted by clicking on the bell in the tray
					if (params.source == "notificationButton") {
                        const lastNotificationShownDate = await storage.get("_lastNotificationShownDate");
						if (lastNotificationShownDate.diffInSeconds() < -25) { // 25 seconds is approx. the time it takes for the notification to hide, after that let's use the window technique
							openTemporaryWindowToRemoveFocus();
						}
					}
				});
			} else {
				await updateNotifications();
			}
		} else {
			notifications.forEach(notification => {
				chrome.notifications.clear(notification.id, function(wasCleared) {});
			});
		}
    }
    
    await storage.set("notificationsQueue", notificationsQueue);
    await storage.set("notificationsOpened", notificationsOpened);
}

async function closeNotificationsDelayed(notifications) {
    // ff patch seems dismiss all would not work if there was a timeout
    if (!DetectClient.isFirefox()) {
        await sleep(500);
    }
    return closeNotifications(notifications);
}

async function performActionOutsideOfPopup(eventEntry) {
    var progress = new ProgressNotification();
    progress.show(800);

    try {
        const saveEventResponse = await saveEvent(eventEntry);
        // if title is small, empty or just useless than try getting the page details to fill the title
        var shortestTitleLength = 3;
        if (/zh|ja|ko/i.test((await storage.get("calendarSettings")).calendarLocale)) {
            shortestTitleLength = 1;
        }
        if ((eventEntry.inputSource == InputSource.CONTEXT_MENU || eventEntry.inputSource == InputSource.SHORTCUT) && eventEntry.summary.trim().length <= shortestTitleLength) {
            const tab = await getActiveTab();
            const response = await getEventDetailsFromPage(tab);
            eventEntry.summary = response.title;
            eventEntry.description = response.description;
            
            await updateEvent({
                eventEntry: eventEntry,
                event: saveEventResponse,
                patchFields: {
                    summary: response.title,
                    description: response.description
                }
            });
        }

        progress.cancel();

        const email = await storage.get("email");
        var title = eventEntry.summary;
        
        var message = await formatEventAddedMessage(getMessage("event").toLowerCase(), eventEntry);
        if (!message) {
            message = "";
        }
        
        const options = {
            type: "basic",
            title: title,
            message: message,
            iconUrl: "images/icons/icon-128.png"
        }
        
        if (DetectClient.isChrome()) {
            options.buttons = [{title:getMessage("undo")}];
        }
    
        // if no title found in the result of the quick add then open the edit page
        if (eventEntry.summary) {
            
            var desktopNotification = await storage.get("desktopNotification");
            if (desktopNotification == "text") {
                // text notificaiton
                var omniboxBoxNotification = new Notification(title, {body:message, icon:'images/icons/icon-128.png'});
                omniboxBoxNotification.eventEntry = eventEntry;
                omniboxBoxNotification.onclick = function() {
                    var url = getEventUrl(this.eventEntry, email);
                    if (url) {
                        openUrl(url, {urlToFind:this.eventEntry.id});
                    }
                    this.close();
                }
            } else {
                const notification = {
                    id: generateNotificationIdFromEvent(eventEntry, NotificationType.ADDED_OUTSIDE),
                    event: eventEntry
                };
                chrome.notifications.create(notification.id, options, async function(notificationId) {
                    // close it after a few seconds
                    await sleep(seconds(4));
                    chrome.notifications.clear(notification.id, function(wasCleared) {});
                });
            }
        } else {
            openUrl(getEventUrl(eventEntry, email));
        }						
        pollServer();

    } catch (error) {
        progress.cancel();
        if (error.jerror == JError.NO_TOKEN) {
            showMessageNotification("Access not granted!", "Go to Options > Accounts", error);
        } else {
            showMessageNotification("Error with last action", "Try using the quick add from the popup!", error);
        }
        throw error;
    }
}

function retoastNotifications() {
	console.log("retoast " + new Date());
	updateNotifications({retoast:true})
}

async function updateNotifications(params = {}) {
	if (notificationsOpened.length) {
		
		sortNotifications(notificationsOpened);
		
		if (await isGroupedNotificationsEnabled()) {
			// grouped
			var notificationsOpenedForDisplay = notificationsOpened.shallowClone();
			//notificationsOpenedForDisplay.reverse();
			var options = await generateNotificationOptions(notificationsOpenedForDisplay);
			if (params.retoast) {
				chrome.notifications.clear(GROUPED_NOTIFICATION_ID, function(wasCleared) {
					chrome.notifications.create(GROUPED_NOTIFICATION_ID, options, function(notificationId) {
						if (chrome.runtime.lastError) {
							logError("update create notif: " + chrome.runtime.lastError.message);
						} else {
							storage.setDate("_lastNotificationShownDate");
						}
					});
				});
			} else {
				chrome.notifications.update(GROUPED_NOTIFICATION_ID, options, function(wasUpdated) {});
			}
		} else {
			// dont retoast individual notifs
			if (!params.retoast) {
				// individual
                await asyncForEach(notificationsOpened, async (notification, index) => {
					var options = await generateNotificationOptions([notification]);
					// note: chrome.notifications.update calls the notification.onClosed
					chrome.notifications.update(notification.id, options, function(wasUpdated) {});
				});
			}
		}
	}
}

async function quickAddSelectionOrPage(params, tab) {
	console.log("quickAddSelectionOrPage", params, tab);
    
	if (params.template) { // set datetime...using calendar webpage
		if (params.selectionText) {
	    	var actionLinkObj = await generateActionLink("TEMPLATE", {summary: params.selectionText, startTime:new Date(), allDay:true});
	    	chrome.tabs.create({url: actionLinkObj.url + "?" + actionLinkObj.data});
		} else {
			// page selected
			const response = await getEventDetailsFromPage(tab);
            var actionLinkObj = await generateActionLink("TEMPLATE", {summary:response.title, description:response.description, startTime:new Date(), allDay:true});
            chrome.tabs.create({url: actionLinkObj.url + "?" + actionLinkObj.data});
		}
		
        // let's sync in this event after we left the user a good amount of time to save the event on the page
        chrome.alarms.create(Alarms.POLL_SERVER_AFTER_RIGHT_CLICK_SET_DATE, {delayInMinutes: 1});
	} else {
		const eventEntry = new EventEntry();
		eventEntry.inputSource = params.inputSource;
		
		if (!params.quickAdd) {
			eventEntry.startTime = new Date(params.date.getTime());
			eventEntry.quickAdd = false;
		}
		eventEntry.allDay = params.allDay;  
		
		const response = await getEventDetailsFromPage(tab);
        if (params.selectionText) {
            // Text selected
            eventEntry.summary = params.selectionText;
        } else if (params.linkUrl) {
            console.log("linkurl details", response);
            var title = prompt("Enter a title for this link", response.title);
            if (title) {
                eventEntry.summary = title;
                eventEntry.source = {title:title, url:params.linkUrl};
                eventEntry.description = params.linkUrl;
            } else {
                return;
            }
        } else {
            eventEntry.extendedProperties = {};
            eventEntry.extendedProperties.private = {favIconUrl:tab.favIconUrl};
            
            eventEntry.summary = response.title;
            if (!params.quickAdd) {
                eventEntry.description = response.description;
            }
            
            // possibly found url in microformat so use it instead
            if (response.url) {
                eventEntry.source = {title:response.title, url:response.url};
            } else if (tab && tab.url) {
                eventEntry.source = {title:response.title, url:tab.url};
            }
        }
        performActionOutsideOfPopup(eventEntry);
	}	
		
	let gaAction;
	if (params.selectionText) {
		gaAction = "selectedText";
	} else {
		gaAction = "rightClickOnPage";
	}
	sendGA('contextMenu', gaAction, getHost(tab.url));
}

async function setMenuItemTimes(parentId, startTime) {
    const CONTEXTS = await getContextsContextMenu();
	var offsetTime = new Date(startTime);
	for (var a=0; a<48 && offsetTime.getHours() <= 23 && offsetTime.getMinutes() <= 30 && offsetTime.isSameDay(startTime); offsetTime.setMinutes(offsetTime.getMinutes()+30), a++) {		
		createDynamicContextMenu({date:new Date(offsetTime)}, offsetTime.toLocaleTimeStringJ(), {contexts: CONTEXTS, parentId: parentId});
	}
}

let unusedMenuId = 1;
function generateUnusedMenuId() {
    return "rand" + (unusedMenuId++);
}

async function updateContextMenuItems() {
	if (await storage.get("showContextMenuItem")) {
		console.log("addchange conextmenu: " + new Date())
        addChangeContextMenuItems();
	}
}

function createContextMenu(id, text, params = {}) {
    if (id) {
        params.id = id;
    }

    if (!params.title && text) {
        params.title = text;
    }

    if (!params.contexts) {
        params.contexts = ["browser_action"];
    }

    const menuId = chrome.contextMenus.create(params, response => {
        if (chrome.runtime.lastError) {
            console.warn("error with menu id: " + id, chrome.runtime.lastError.message);
        }
    });
    return ;
}

async function getContextsContextMenu() {
    const showOnlyQuickWhenTextSelected = await storage.get("showOnlyQuickWhenTextSelected");
    if (showOnlyQuickWhenTextSelected) {
        return MENU_ITEM_CONTEXTS;
    } else {
        return MENU_ITEM_CONTEXTS.concat("selection");
    }
}

function createDynamicContextMenu(id, text, params = {}) {
    return createContextMenu(JSON.stringify(id), text, params);
}

function addChangeContextMenuItems() {
	// remove past menu items first
	if (chrome.contextMenus && chrome.contextMenus.removeAll) {
		chrome.contextMenus.removeAll(async () => {

            const CONTEXTS = await getContextsContextMenu();

            createContextMenu(ContextMenu.OPEN_CALENDAR, getMessage("openCalendar"));
            createContextMenu(ContextMenu.REFRESH, getMessage("refresh"));

            if (DetectClient.isFirefox()) {
                createContextMenu(ContextMenu.OPTIONS, getMessage("options"));
            }

            chrome.contextMenus.create({id: generateUnusedMenuId(), contexts: ["browser_action"], type:"separator"});

            createContextMenu(ContextMenu.DND_MENU, getMessage("doNotDisturb"));
            createContextMenu(ContextMenu.DND_OFF, getMessage("turnOff"), {parentId: ContextMenu.DND_MENU});
            chrome.contextMenus.create({id: generateUnusedMenuId(), contexts: ["browser_action"], parentId: ContextMenu.DND_MENU, type:"separator"});
            createContextMenu(ContextMenu.DND_30_MIN, getMessage("Xminutes", 30), {parentId: ContextMenu.DND_MENU});
            createContextMenu(ContextMenu.DND_1_HOUR, getMessage("Xhour", 1), {parentId: ContextMenu.DND_MENU});
            createContextMenu(ContextMenu.DND_2_HOURS, getMessage("Xhours", 2), {parentId: ContextMenu.DND_MENU});
            createContextMenu(ContextMenu.DND_4_HOURS, getMessage("Xhours", 4), {parentId: ContextMenu.DND_MENU});
            createContextMenu(ContextMenu.DND_TODAY, getMessage("today"), {parentId: ContextMenu.DND_MENU});
            createContextMenu(ContextMenu.DND_INDEFINITELY, getMessage("indefinitely"), {parentId: ContextMenu.DND_MENU});

            // If a selection then add this before the other menu items
			createDynamicContextMenu({quickAdd:true, allDay:true}, getMessage("quickAdd") + "  '%s'", {contexts: ["selection"]});

            chrome.contextMenus.create({id: generateUnusedMenuId(), contexts: CONTEXTS, type:"separator"});
            
            // Today all day
			createDynamicContextMenu({date:new Date(), allDay:true}, getMessage("today"), {contexts: CONTEXTS});

			// Today times...
			var offsetTime = new Date();
			if (offsetTime.getMinutes() <= 29) {
				offsetTime.setMinutes(30)
			} else {
				offsetTime.setHours(offsetTime.getHours()+1);
				offsetTime.setMinutes(0);
			}
			offsetTime.setSeconds(0, 0);
			
			if (offsetTime.getHours() <= 23 && offsetTime.getMinutes() <= 30) {
				menuID = chrome.contextMenus.create({id: "TODAY_AT", title: getMessage("todayAt"), contexts: CONTEXTS});
				setMenuItemTimes(menuID, offsetTime);
			}
			
            chrome.contextMenus.create({id: generateUnusedMenuId(), contexts: CONTEXTS, type:"separator"});
                        
            // Tomorrow
			createDynamicContextMenu({date:tomorrow(), allDay:true}, getTomorrowMessage(), {contexts: CONTEXTS});
			
			// Tomorrow times...
			menuID = chrome.contextMenus.create({id: generateUnusedMenuId(), title: getMessage("tomorrowAt"), contexts: CONTEXTS});
			offsetTime = tomorrow();
			offsetTime.setHours(1);
			offsetTime.setMinutes(0);
			offsetTime.setSeconds(0, 0);
			setMenuItemTimes(menuID, offsetTime);
			
			// Days of week
			offsetTime = tomorrow();
			for (var a=2; a<=14; a++) {
				chrome.contextMenus.create({id: generateUnusedMenuId(), contexts: CONTEXTS, type:"separator"});
				
				offsetTime.setDate(offsetTime.getDate()+1);
                const offsetDate = new Date(offsetTime);
                
                const offsetTimeFormatted = offsetTime.toLocaleDateStringJ();

                createDynamicContextMenu({date:offsetDate, allDay:true}, offsetTimeFormatted, {contexts: CONTEXTS});
				
				menuID = chrome.contextMenus.create({id: generateUnusedMenuId(), title: getMessage("somedayAt", offsetTimeFormatted), contexts: CONTEXTS});
				offsetDate.setHours(1);
				offsetDate.setMinutes(0);
				offsetTime.setSeconds(0, 0);
				setMenuItemTimes(menuID, offsetDate);
			}
			
			chrome.contextMenus.create({id: generateUnusedMenuId(), contexts: CONTEXTS, type:"separator"});
			
            // Other date
            createDynamicContextMenu({template:true}, getMessage("setDateTime") + "...", {contexts: CONTEXTS});
		});
	}
}

if (chrome.contextMenus && chrome.contextMenus.onClicked) {
    chrome.contextMenus.onClicked.addListener(async (info, tab) => {

        await initMisc();

        if (ContextMenu.OPEN_CALENDAR == info.menuItemId) {
            openGoogleCalendarWebsite();
        } else if (ContextMenu.REFRESH == info.menuItemId) {
            pollServer({source: "refresh"});
        } else if (ContextMenu.OPTIONS == info.menuItemId) {
            openUrl("options.html");
        } else if (ContextMenu.DND_OFF == info.menuItemId) {
            setDND_off();
        } else if (ContextMenu.DND_30_MIN == info.menuItemId) {
            setDND_minutes(30);
        } else if (ContextMenu.DND_1_HOUR == info.menuItemId) {
            setDND_minutes(60);
        } else if (ContextMenu.DND_2_HOURS == info.menuItemId) {
            setDND_minutes(120);
        } else if (ContextMenu.DND_4_HOURS == info.menuItemId) {
            setDND_minutes(240);
        } else if (ContextMenu.DND_TODAY == info.menuItemId) {
            setDND_today();
        } else if (ContextMenu.DND_INDEFINITELY == info.menuItemId) {
            setDND_indefinitely();
        } else {
            let params;
            try {
                params = JSON.parse(info.menuItemId, dateReviver);
            } catch (error) {
                showMessageNotification("No code assigned to this menu", "Try re-installing the extension.");
                return;
            }
            params.selectionText = info.selectionText;
            params.linkUrl = info.linkUrl;
            params.inputSource = InputSource.CONTEXT_MENU;
            quickAddSelectionOrPage(params, tab);
        }
    });
}

function playNotificationSoundFile(source, reminder) {
	return new Promise(async (resolve, reject) => {
		if (!notificationAudio) {
			notificationAudio = new Audio();
		}
		
		var audioEventTriggered = false;
		
		if (await isDND() || source == null || source == "") {
			resolve();
		} else  {
			
			var changedSrc = lastNotificationAudioSource != source;
			
			// patch for ogg might be crashing extension
			// patch linux refer to mykhi@mykhi.org
			if (DetectClient.isLinux() || changedSrc) {
				if (source == "custom") {
					notificationAudio.src = await storage.get("notificationSoundCustom");
				} else {
					notificationAudio.src = "sounds/" + source;
				}
				
			}
			lastNotificationAudioSource = source;
			
			var volume = await storage.get("notificationSoundVolume");
		   
			// if reminder than lower the volume by 50%
			if (reminder) {
				volume = volume * 0.75;
			}
           
            function audioStopped(type) {
				// ignore the abort event when we change the .src
				if (!(changedSrc && type == "abort") && !audioEventTriggered) {
					audioEventTriggered = true;
					resolve();
				}
            }

            function addListener(type) {
                notificationAudio.removeEventListener(type, audioStopped);
                notificationAudio.addEventListener(type, audioStopped, true);
            }
            
            addListener("ended");
            addListener("abort");
            addListener("error");

			notificationAudio.volume = volume / 100;		   
			notificationAudio.play();
		}
	});
}

async function playVoiceNotification(textToSpeak) {
	if (await storage.get("notificationVoice") && !await isDND()) {
        const voiceNotificationOnlyIfIdleInterval = await storage.get("voiceNotificationOnlyIfIdleInterval");
		if (voiceNotificationOnlyIfIdleInterval) {
			chrome.idle.queryState(parseInt(voiceNotificationOnlyIfIdleInterval), function(state) {
				// check if idle rules
				if (state != "active" && !detectSleepMode.isWakingFromSleepMode()) {
					ChromeTTS.queue(textToSpeak);
				}
			});
		} else {
			ChromeTTS.queue(textToSpeak);
		}
	}
}

async function playNotificationSound(notification) {
	
	if (!await isDND()) {
		const textToSpeak = notification.event.summary;
		
		if (notification.audioPlayedCount) {
			notification.audioPlayedCount++;
		} else {
			notification.audioPlayedCount = 1;
        }
        
        const notificationSound = await storage.get("notificationSound");
		if (notificationSound) {
			playNotificationSoundFile(notificationSound, false).then(() => {
				playVoiceNotification(textToSpeak);
			});
		} else {
			playVoiceNotification(textToSpeak);
		}
	}
	
}

function stopNotificationSound() {
	if (notificationAudio) {
		notificationAudio.pause();
		notificationAudio.currentTime = 0;
	}
}

function stopAllSounds() {
    stopNotificationSound();
	ChromeTTS.stop();
}

// usage: params.badgeText = undefined (don't change anything) badgeText = "" then remove badgeText etc...
async function updateBadge(params = {}) {
	var badgeIcon = await storage.get("badgeIcon");
	var state = isOnline() ? "" : "_offline";
	var imageSrc = await getBadgeIconUrl(state);
	
	if (await isDND()) {
		storage.enable("_DND_displayed");
		params.badgeText = "🌙";
		params.badgeColor = [100,100,100, 255];
		chrome.browserAction.setTitle({ title: getMessage("doNotDisturb") });
	} else {
		// Should probably force the checkEvents() to restore counter, but I opted to let the interval call it so as to not cause double checkevents calling possible issues
		if (await storage.get("_DND_displayed")) {
			params.badgeText = "";
		}
		storage.disable("_DND_displayed");
		
		if (await storage.get("showButtonTooltip") && params.toolTip) {
			chrome.browserAction.setTitle({title:params.toolTip});
		} else {
			chrome.browserAction.setTitle({title:""});
		}
	}

	if (params.badgeColor) {
		chrome.browserAction.setBadgeBackgroundColor({color:params.badgeColor});
	}
	
	chrome.browserAction.getBadgeText({}, async function(previousBadgeText) {
		var badgeTextVisibilityToggled = false;
		if ((params.forceRefresh && params.badgeText) || (params.badgeText != undefined && params.badgeText != previousBadgeText)) {
			badgeTextVisibilityToggled = true;
			chrome.browserAction.setBadgeText({text:params.badgeText});
		}
		
        // if icon changed from last time or badgeTextVisibilityToggled then update it icon
        const lastBadgeDate = await storage.get("_lastBadgeDate");
		if (params.forceRefresh || imageSrc != lastBadgeIcon || badgeTextVisibilityToggled || !lastBadgeDate.isToday()) {
            const imageBitmap = await getImageBitmapFromUrl(imageSrc);

            var badgeIconCanvas;
            if (typeof OffscreenCanvas != "undefined") {
                badgeIconCanvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
            } else if (typeof document != "undefined") {
                badgeIconCanvas = document.createElement("canvas");
                badgeIconCanvas.width = imageBitmap.width;
                badgeIconCanvas.height = imageBitmap.height;
            }
        
            // the onload loads again after changing badeicon and document.body is empty, weird, so check for canvas
            if (badgeIconCanvas) {
                context = badgeIconCanvas.getContext('2d');
                context.drawImage(imageBitmap, 0, 0);
                
                if (badgeIcon.includes("WithDate")) {
                    var heightOffset;

                    if (badgeIcon == "default3WithDate" || badgeIcon == "default_monochromeWithDate") {
                        heightOffset = 14;
                        context.font = 'normal 11px "arial", sans-serif';
                        context.fillStyle = '#FFF'
                    } else if (badgeIcon == "newWithDate" || badgeIcon == "new2WithDate") {
                        heightOffset = 13;
                        context.font = 'bold 12px "arial", sans-serif';
                        context.fillStyle = '#FFF'
                    } else {
                        heightOffset = 13;
                        context.font = 'bold 10px "arial", sans-serif';
                        context.fillStyle = "#333"
                    }
                    context.textAlign = "center";
                    var day = (new Date).getDate();
                    
                    var hasBadgeText = false;
                    if (params.badgeText == undefined) {
                        if (previousBadgeText) {
                            hasBadgeText = true;
                        }
                    } else {
                        if (params.badgeText) {
                            hasBadgeText = true;
                        }
                    }						
                    
                    if (hasBadgeText) {
                        heightOffset -= 2;
                    }
                        
                    context.fillText(day, (badgeIconCanvas.width / 2) - 0, heightOffset);
                    storage.setDate("_lastBadgeDate");
                }
                chrome.browserAction.setIcon({imageData: context.getImageData(0, 0, 19, 19)});
            }
		}
		lastBadgeIcon = imageSrc;
	});
	
}

function getSetting(settings, key, defaultValue) {
	var value = null;
	if (settings) {
		setting = settings.find(setting => {
			return setting.id == key;
        });
        if (setting) {
            value = setting.value;
        }
	}
	if (defaultValue == undefined) {
		defaultValue = false;
	}
	return value == null ? defaultValue : toBool(value);
}

async function feedUpdatedToday(feedId) {
	var lastFetched = await getLastFetchedDate(feedId);
	return lastFetched && lastFetched.isToday();
}

async function feedUpdatedWithinTheseDays(feedId, days) {
	var lastFetched = await getLastFetchedDate(feedId);
	return lastFetched && lastFetched.diffInDays() >= -days;
}

async function feedUpdatedWithinTheseHours(feedId, hours) {
	var lastFetched = await getLastFetchedDate(feedId);
	return lastFetched && lastFetched.diffInHours() >= -hours;
}

async function fetchCalendarList(params = {}) {
    const email = await storage.get("email");
    const feedFromCache = cachedFeeds["calendarList"];
    const feedDetails = await getCachedFeedDetails("calendarList");
    
    if (params.bypassCache != true && feedFromCache && await feedUpdatedToday("calendarList") && feedDetails.email == params.email) {
        console.info("Fetching calendarlist [CACHE]");
    } else {
        try {
            await ensureWatchCalendarList({source:params.source});
        } catch (error) {
            logError("error ensureWatchCalendarList: " + error);
        }

        console.info("Fetching calendarlist");

        try {
            const response = await getAllAPIData({
                oauthForDevices: oAuthForDevices,
                userEmail: email,
                url: "/users/me/calendarList?maxResults=250",
                itemsRootId: "items"
            });

            cachedFeeds["calendarList"] = response;
            
            // save selected calendars once locally because we don't want to sync this afterwards
            const selectedCalendars = await storage.get("selectedCalendars");
            for (const index in cachedFeeds["calendarList"].items) {
                // filter out my common.js > Array.prototype.shallowClone etc.
                if (cachedFeeds["calendarList"].items.hasOwnProperty(index)) {
                    const calendarId = cachedFeeds["calendarList"].items[index].id;
                    // never set before
                    if (selectedCalendars[email] && selectedCalendars[email][calendarId] == undefined) {
                        selectedCalendars[email][calendarId] = cachedFeeds["calendarList"].items[index].selected;
                    }
                }
            }
            await storage.set("selectedCalendars", selectedCalendars);
            
            feedDetails.CPlastFetched = new Date();
            feedDetails.email = email;

            return {
                updated: true,
                data: response
            };
        } catch (error) {
            logError("Error fetching feed: ", error);
            if (feedFromCache) {
                console.log("instead we are fetching from cache");
            } else {
                throw error;
            }
        }
    }
}

async function processCalendarListFeed(calendarListResponse) {
    if (!calendarMap || calendarListResponse && calendarListResponse.updated)  {
        calendarMap = await initCalendarMap();
    }
}

async function fetchAllCalendarEvents(params) {
	console.log("fetchAllCalendarEvents:", new Date())
    var startDate;
    var endDate;
    
    if (params.startDate) { // override defaults if passed here
        startDate = params.startDate;
        endDate = params.endDate;
    } else { // default dates...
        startDate = getStartDateBeforeThisMonth();
        endDate = await getEndDateAfterThisMonth();
        
        // Must pull all events visible in month view so that the drag drop for moving events can locate the event ids
        // if setting "maxDaysAhead" is larger than this, than use it instead
        var maxDaysAheadDate = new Date();
        maxDaysAheadDate = maxDaysAheadDate.addDays(parseInt(await storage.get("maxDaysAhead"))+1);
        if (maxDaysAheadDate.isAfter(endDate)) {
            endDate = maxDaysAheadDate;
        }
        
        // must do this because or else enddate is always seconds off and i use this enddate diff to determine if i should fetch more feeds
        endDate.setHours(23);
        endDate.setMinutes(0);
        endDate.setSeconds(0, 0);
    }
    
    console.log("startdate: " + startDate);
    
    try {
        await oAuthForDevices.ensureTokenForEmail(params.email);
    } catch (error) {
        // forward on because we want to return cached feeds
    }
    const selectedCalendars = await storage.get("selectedCalendars");
    const arrayOfCalendars = await getArrayOfCalendars();

    console.info("arrayOfCalendars", arrayOfCalendars);
    
    const returnObj = {
        events: []
    }
    
    let loggedOut = false;
    const promises = [];
    if (arrayOfCalendars.length) {
        arrayOfCalendars.forEach(calendar => {
            // must clone because .calendar for instance is alway set as the last iterated calendar after looping here
            const moreParams = deepClone(params);
            
            moreParams.calendarId = calendar.id;
            moreParams.startDate = startDate;
            moreParams.endDate = endDate;
            
            const promise = fetchCalendarEvents(moreParams, selectedCalendars);
            promises.push(promise);
        });
    
        // using my custom alwaysPromise which returns all success and failures
        const response = await alwaysPromise(promises);
        const allResponses = response.successful.concat(response.failures);

        let notFounds = 0;
        loggedOut = response.failures.some(failure => {
            if (failure.error && failure.error.code == 401) {
                return true;
            } else if (failure.error && failure.error.code == 404) { // facebook feed gave this error
                notFounds++;
                console.warn("notfound", failure);
            } else {
                console.warn("Failures", failure);
            }
        });

        returnObj.events = await mergeEvents(allResponses);
        returnObj.successful = response.successful;
        returnObj.failures = response.failures;
        if (response.failures.length && response.failures.length != notFounds) {
            returnObj.error = "Error fetching " + response.failures.length + " calendars";
        }
    } else {
        loggedOut = true;
    }
    
    if (loggedOut) {
        await showLoggedOut();
    } else {
        await storage.disable("loggedOut");
    }
    
    return returnObj;
}

async function ensureSyncToken(fetchToken, calendarId, moreParams) {
    const cachedFeedDetails = await getCachedFeedDetails(calendarId);
    
    if (fetchToken) {
        const calendar = getCalendarById(calendarId);
        console.info("Fetching " + getCalendarName(calendar) + " [Initial Sync]");
        
        const sendParams = {
            userEmail: moreParams.userEmail,
            url: moreParams.url,
            oauthForDevices: oAuthForDevices,
            itemsRootId: "items",
            data: Object.assign({
                showDeleted: true,
                singleEvents: false,
                updatedMin: tomorrow().toJSON()
            }, moreParams.data)
        };

        try {
            const response = await getAllAPIData(sendParams);
            return response.nextSyncToken;
        } catch (error) {
            console.error("ensure synctoken error", error);
        }
    }

    return cachedFeedDetails.nextSyncToken;
}

async function fetchAllPartialItems(moreParams, params) {
    
    const sendResponse = await getAllAPIData(moreParams);
    
    let cachedCalendarItems = cachedFeeds[params.calendarId].items;

    if (cachedCalendarItems) {
        await asyncForEach(sendResponse.items, async item => {
            if (item.status == "cancelled" && !item.recurrence) {
                var removedSuccessfully = removeItemById(cachedCalendarItems, item.id);
                if (!removedSuccessfully) {
                    console.warn("Already removed?", item);
                }
            } else if (item.recurrence) {
                // Modified some of instances so we must remove them all then re-add later below
                for (let a=0; a<cachedCalendarItems.length; a++) {
                    // modified existing recurring events || changed a single to a recurring event
                    if (item.id == cachedCalendarItems[a].recurringEventId || item.id == cachedCalendarItems[a].id) {
                        cachedCalendarItems.splice(a, 1);
                        a--;
                    }
                }
                
                try {
                    const instanceResponse = await oauthDeviceSend({
                        userEmail: params.email,
                        url: "/calendars/" + encodeURIComponent(params.calendarId) + "/events/" + encodeURIComponent(item.id) + "/instances",
                        data: {
                            showDeleted: true,
                            timeMin: params.startDate.toJSON(),
                            timeMax: params.endDate.toJSON()
                        }
                    });
                    console.log("instances", instanceResponse);
                    instanceResponse.items.forEach(item => {
                        var index = findIndexById(cachedCalendarItems, item.id);
                        if (item.status == "cancelled") {
                            if (index == -1) {
                                console.warn("Already removed?", item);
                            } else {
                                cachedCalendarItems.splice(index, 1);
                            }
                        } else {
                            if (index == -1) { // add
                                cachedCalendarItems.push(item);
                            } else { // modify
                                cachedCalendarItems[index] = item;
                            }
                        }
                    });
                } catch (error) {
                    logError("error in recurrence send:" + error);
                    fetchEventsObj.error = error;
                    throw fetchEventsObj;
                }
            } else {
                var index = findIndexById(cachedCalendarItems, item.id);
                if (index == -1) { // add
                    cachedCalendarItems.push(item);
                } else { // modify
                    cachedCalendarItems[index] = item;
                }
            }
        });
    } else {
        logError("cachedCalendarItems null for: " + params.calendarId);
    }

    return sendResponse;
}

async function fetchCalendarEvents(params, selectedCalendars) {
    const email = await storage.get("email");
    const desktopNotification = await storage.get("desktopNotification");
    const excludedCalendars = await storage.get("excludedCalendars");
    var feedFromCache = cachedFeeds[params.calendarId];
    
    // simulate fetchEventsObj and pass this "dummy" roundtripArg because it is fetched in .always 
    var fetchEventsObj = feedFromCache || {};
    fetchEventsObj.roundtripArg = params.calendarId;

    var calendar = getCalendarById(params.calendarId);
    
    if (isCalendarUsedInExtension(calendar, email, selectedCalendars, excludedCalendars, desktopNotification)) {
    
        var calendarThatShouldBeCached =
            calendar.id.includes("holiday.calendar.google.com") ||
            calendar.id.includes("import.calendar.google.com") ||
            calendar.id.includes("group.v.calendar.google.com") || // includes Interesting calendars "more" section ie. Contacts's bdays, Day of the year etc.
            calendar.id.includes("bukmn26vqdvcamgv8fdrs3hhu8@group.calendar.google.com") // manually excluded because lot of users subscribed to this one according to analytics titled: Anniversaries - owner
            // group.calendar.google.com (without the .v. means just regular non-primary calendars
            
            // commented out because these are now excluded via the isGadgetCalenadar with the previous call above to isCalendarUsed...
            //calendar.id.includes("g0k1sv1gsdief8q28kvek83ps4@group.calendar.google.com") || 	// Week Numbers
            //calendar.id.includes("ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com") 		// Phases of the Moon
        ;
        
        var expired = false;
        
        if (calendarThatShouldBeCached) {
            expired = !await feedUpdatedWithinTheseDays(calendar.id, 30);
        } else {
            if (isCalendarWriteable(calendar)) {
                // see that we are showing notifications for this calendar (high priority) and that this calendar is "active" and that it's been updated at least in the last 30 days
                var isCalendarRecentlyUpdated = !feedFromCache || new Date(feedFromCache.updated).diffInDays() >= -30;
                if (desktopNotification && !isCalendarExcludedForNotifsByOptimization(calendar, excludedCalendars) && isCalendarRecentlyUpdated) {
                    // added to prevent quota issue when pushing updates that restarted the extension
                    if (params.source == "startup") {
                        calendarThatShouldBeCached = await feedUpdatedWithinTheseHours(calendar.id, POLLING_INTERVAL_IN_HOURS);
                    } else {
                        // do nothing as we should continue to fetch this calendar's events
                    }
                } else {
                    // let's reduce it's polling a bit to save quota (successfully reduced quota by 20% !)
                    calendarThatShouldBeCached = await feedUpdatedWithinTheseHours(calendar.id, POLLING_INTERVAL_IN_HOURS_FOR_LESS_IMPORTANT);
                }
            } else {
                // Pushed Feb 8th - reduced quota by about 30% we used to check every hour, now only once a day 
                // for non main calendars (ie. not owner/writer) let's reduce the polling to 1 day (ie. once per day)
                calendarThatShouldBeCached = await feedUpdatedWithinTheseDays(calendar.id, 1);
            }
        }
        
        // one time such as browsing calendar next/prev (let's use cache if possible and NOT override cache with these results)
        const oneTimeFetch = params.source == "popup" || params.source == "agenda" || params.source == "selectedCalendars";
        
        const cachedFeedDetails = await getCachedFeedDetails(calendar.id);
        
        var isWithinLastCachedTimeFrame;
        if (cachedFeedDetails.CPstartDate && cachedFeedDetails.CPendDate) {
            isWithinLastCachedTimeFrame = params.startDate.isEqualOrAfter(cachedFeedDetails.CPstartDate) && params.endDate.isEqualOrBefore(cachedFeedDetails.CPendDate);
        }

        //console.log("feed", params.bypassCache, calendarThatShouldBeCached, oneTimeFetch, params.source, feedFromCache, params, cachedFeedDetails, !expired, isWithinLastCachedTimeFrame);
        if (params.bypassCache != true && feedFromCache && !expired && isWithinLastCachedTimeFrame && (calendarThatShouldBeCached || oneTimeFetch || (params.source == GCM_SOURCE && feedFromCache && cachedFeedDetails.CPlastFetched))) {
            console.info("Fetching " + getCalendarName(calendar) + " [CACHED]");
        } else {
            try {
                await ensureWatchCalendarEvents({calendarId:calendar.id, source:params.source});
            } catch (error) {
                logError("error watchCalendarEvents: " + error);
            }
            const moreParams = deepClone(params);

            moreParams.oauthForDevices = oAuthForDevices;
            moreParams.itemsRootId = "items";

            moreParams.userEmail = params.email;
            moreParams.roundtripArg = calendar.id;
            moreParams.url = "/calendars/" + encodeURIComponent(calendar.id) + "/events";
            moreParams.data = {
                maxResults: MAX_RESULTS_FOR_EVENTS // Max resutls is set by API at 2500 https://developers.google.com/google-apps/calendar/v3/reference/events/list
            };
            
            // important: must keep nextSyncToken check here or we could recurse infinitely with calls to fetchCalendarEvents below
            if (feedFromCache && !params.skipSync && cachedFeedDetails.nextSyncToken && !oneTimeFetch && isWithinLastCachedTimeFrame) {
                console.info("Fetching " + getCalendarName(calendar) + " [PARTIAL]");
                
                moreParams.data.syncToken = cachedFeedDetails.nextSyncToken;
                moreParams.data.showDeleted = true;
                moreParams.data.singleEvents = false;
                
                try {
                    const partialItemsResponse = await fetchAllPartialItems(moreParams, params);
                    cachedFeedDetails.CPlastFetched = new Date();
                    cachedFeedDetails.nextSyncToken = partialItemsResponse.nextSyncToken;
                } catch (error) {
                    // Sometimes sync tokens are invalidated by the server, for various reasons including token expiration or changes in related ACLs. In such cases, the server will respond to an incremental request with a response code 410. This should trigger a full wipe of the client’s store and a new full sync.
                    if (error.code == 410) {
                        console.warn("sync token invalidated, do full sync...");
                        
                        delete cachedFeedDetails.nextSyncToken;
            
                        // recurse once
                        fetchEventsObj = await fetchCalendarEvents(params, selectedCalendars);
                    } else {
                        logError("error in oauth partial send:" + error);
                        fetchEventsObj.error = error;
                        throw fetchEventsObj;
                    }
                }
            } else {
                var fetchToken = !oneTimeFetch && (!feedFromCache || !cachedFeedDetails.nextSyncToken);
                try {
                    const nextSyncToken = await ensureSyncToken(fetchToken, params.calendarId, moreParams);

                    var calendar = getCalendarById(params.calendarId);
                    console.info("Fetching " + getCalendarName(calendar));
                    
                    moreParams.data.singleEvents = true;
                    moreParams.data.orderBy = "startTime";
                    moreParams.data.timeMin = params.startDate.toRFC3339();
                    moreParams.data.timeMax = params.endDate.toRFC3339();
                
                    fetchEventsObj = await getAllAPIData(moreParams);
                    console.log("fetchEventsObj", moreParams.url, fetchEventsObj);
                
                    if (!oneTimeFetch || (params.source == "selectedCalendars" && !feedFromCache)) {
                        // update cache
                        cachedFeeds[params.calendarId] = fetchEventsObj;
                
                        const feedDetails = await getCachedFeedDetails(params.calendarId);

                        feedDetails.CPlastFetched = new Date();
                        feedDetails.CPstartDate = params.startDate;
                        feedDetails.CPendDate = params.endDate;
                        
                        if (nextSyncToken) {
                            feedDetails.nextSyncToken = nextSyncToken;
                        }
                    }
                    
                    // metrics
                    var calendarSource;
                    var label;
                    
                    if (calendar.primary) {
                        calendarSource = "mainCalendar";
                        label = cachedFeeds["calendarList"].items.length;
                        if (label) {
                            // seems analtics was not accepting int but only strings
                            label = label.toString();
                        }
                    } else {
                        if (!calendar.id.includes("group.v.calendar.google.com")) {
                            calendarSource = "other calendars";
                            label = calendar.id + ": " + getCalendarName(calendar) + " - " + calendar.accessRole;
                            //sendGA('fetchCalendarEvents', calendarSource, label);
                        }
                    }
                } catch (error) {
                    logError("error in send:" + error);
                    // must return cached feeds but append error (if needed)
                    fetchEventsObj.error = error;
                    throw fetchEventsObj;
                }
            }					
        }
    } else {
        console.info("Fetching " + getCalendarName(calendar) + " [invisible + (notifs off OR excluded OR isGadget]");
    }
    return fetchEventsObj;
}

async function reInitCachedFeeds() {
    cachedFeeds = await storage.get("cachedFeeds");
}

async function pollServer(params = {}) {
    console.info("pollServer");

    if (params.reInitCachedFeeds) {
        await reInitCachedFeeds();
    }

    storage.setDate("_lastPollTime");

    if (await storage.get("_firstLoad")) {
        chrome.browserAction.setBadgeBackgroundColor({color:[180, 180, 180, 255]});
        await updateBadge({badgeText: "⏳"});
        chrome.browserAction.setTitle({title:getMessage("loading")});
        storage.disable("_firstLoad");
    }

    var tokenResponses = await storage.getEncryptedObj("tokenResponses", dateReviver);
    if (tokenResponses.length) {
        // get most recent token used
        var mostRecentTokenUsed;
        tokenResponses.forEach(tokenResponse => {
            if (!mostRecentTokenUsed || tokenResponse.expiryDate.isAfter(mostRecentTokenUsed.expiryDate)) {
                mostRecentTokenUsed = tokenResponse;
            }
        });
        
        const email = mostRecentTokenUsed.userEmail;
        await storage.set("email", email);
        params.email = email;
        
        // update the uninstall url caused we detected an email
        if (email != await storage.get("_uninstallEmail")) {
            setUninstallUrl(email);
        }

        if (isOnline()) {
            const [, , fetchCalendarListResponse] = await Promise.all([
                fetchCalendarSettings(params),
                fetchColors(params),
                fetchCalendarList(params)
            ]);

            await storage.set("cachedFeeds", cachedFeeds);
            await storage.set("cachedFeedsDetails", cachedFeedsDetails);

            await processCalendarListFeed(fetchCalendarListResponse);
            const fetchAllResponse = await fetchAllCalendarEvents(params);
            events = fetchAllResponse.events;
            params.events = events; // avoid refetching in checkEvents
            await checkEvents(params);
            await storage.set("cachedFeeds", cachedFeeds);
            await storage.set("cachedFeedsDetails", cachedFeedsDetails);
            console.log("pollserver response", fetchAllResponse);
            return fetchAllResponse;
        } else {
            console.log("offline: so skip ALL fetches");
            await processCalendarListFeed()
            return {offline:true};
        }
    } else {
        console.log("no tokens saved");
        showLoggedOut();
    }
}

function isEventShownOrSnoozed(event, reminderTime, snoozers) {
	
	if (isCurrentlyDisplayed(event, notificationsQueue)) {
		return true;
	}
	
	// Must check snoozers before eventsshown because a snoozed event has remindertime passed as a param
	for (var a=0; a<snoozers.length; a++) {
		if (isSameEvent(event, snoozers[a].event)) {
			return true;
		}
	}
	for (var a=0; eventShown=eventsShown[a], a<eventsShown.length; a++) {
		if (isSameEvent(event, eventShown)) {
            if (event.startTime.isBefore(eventShown.startTime)) { // patch for snoozers reapparing because the eventsShown time would have the future snooze date but current event time would be current event time
                //console.log("isEventShownOrSnoozed = true (happens when I snooze+move event): " + event.summary + " _ " + event.startTime + " " + eventShown.startTime)
                return true;
            } else if (event.startTime.getTime() == eventShown.startTime.getTime()) {
                // Check that this particular reminder time has not been shown (may have other reminder times due to the ability to set multiple popup reminder settings per event)
                if (reminderTime) {
                    if (eventShown.reminderTimes) {
                        for (var b=0; thisReminderTime=eventShown.reminderTimes[b], b<eventShown.reminderTimes.length; b++) {
                            if (thisReminderTime.time.getTime() == reminderTime.getTime()) {
                                const shown = thisReminderTime.shown
                                if (!shown) {
                                    //console.log("isEventShownOrSnoozed: 1 " + event.summary);
                                }
                                return shown;
                            }
                        }
                    }
                } else {
                    return true;
                }
			} else {
                //console.log("isEventShownOrSnoozed: 2 " + event.summary + " " + event.startTime.getTime() + " " + eventShown.startTime.getTime());
				return false;
			}
		}
    }
    //console.log("isEventShownOrSnoozed: 3 " + event.summary);
	return false;
}

function isTimeToShowNotification(event, reminderTime, lastUpdated, doNotShowPastNotifications, installDate) {
	var createdDate;
	var updatedDate;
	if (event.created) {
		createdDate = new Date(event.created);
	}
	if (event.updated) {
		updatedDate = new Date(event.updated);
	}

	var isTimeToShow = false;
	
	// the journal exception: do not show notification for events created in the past, like when marieve puts past events for the purpose of journaling
	if (event.startTime.isBefore(createdDate)) {
		console.log("%cDON'T SHOW - created in past/journaling: " + event.summary, "font-size:0.7em");
	} else {
		var pastDoNotShowPastNotificationsFlag = true;
		if (doNotShowPastNotifications) {
	
			// get minimum buffer which is equal to check interval
			var bufferInSeconds = CHECK_EVENTS_INTERVAL / ONE_SECOND;
			// than add double that buffer (just to make sure)
			bufferInSeconds += bufferInSeconds * 2;
			var bufferDate = new Date().subtractSeconds(bufferInSeconds);
			
			// ** using endTime instead of reminderTime (because if the event is still in progress than still show notification)
			if (event.endTime && event.endTime.isBefore(bufferDate)) {
				pastDoNotShowPastNotificationsFlag = false;
			}
		}
		
		if (pastDoNotShowPastNotificationsFlag && reminderTime && reminderTime.isEqualOrBefore()) {
			// don't show if recurring timed events are created in past (must be recurring) cause we add events from another device and they might only get fetched after there start time in my extension
			// don't show if all day event is created today
			// don't show if recurring events were created before now
			
			function failCreateUpdateCheck(createUpdateDate) {
				return createUpdateDate && (reminderTime.isEqualOrBefore(createUpdateDate) && (event.recurringEventId || event.allDay));
			}
			
			if (failCreateUpdateCheck(createdDate)) {
				console.log("%cDON'T SHOW - because created after reminder passed: " + event.summary, "font-size:0.7em");
				isTimeToShow = false;
			} else if (failCreateUpdateCheck(updatedDate)) {
				console.log("%cDON'T SHOW - because updated today or ealier: " + event.summary, "font-size:0.7em");
				isTimeToShow = false;
			} else if (reminderTime.isBefore(installDate)) {
				//console.log("DON'T SHOW - because just installed: " + event.summary);
				isTimeToShow = false;
			} else {
				isTimeToShow = true;
			}
		} else {
			isTimeToShow = false;
		}
		
		// patch: seems Google+ birthday contacts were changing IDs and thus reappering all the time so lets not show them
		var passedGooglePlusContactsBug = true;
		if (getEventCalendarId(event) == "#contacts@group.v.calendar.google.com") {
			if (event.gadget && event.gadget.preferences && event.gadget.preferences["goo.contactsIsMyContact"] == "false") {
				//console.warn("google+ contacts bug: ", event);
				passedGooglePlusContactsBug = false;
			}
		}
		
		if (!passedGooglePlusContactsBug) {
			return false;
		}
		
		// we probably just updated the calendar's defaultreminder time (in the extension) so let's ignore this reminder and store it as shown
		// lastUpdated is set in the options > notifications when a user changes the reminder times
		if (isTimeToShow && lastUpdated && reminderTime.isEqualOrBefore(lastUpdated)) {
			//console.log("eventsIgnoredDueToCalendarReminderChangeByUser: ", reminderTime, lastUpdated);
			updateEventShown(event, eventsShown);
			eventsIgnoredDueToCalendarReminderChangeByUser = true;
			isTimeToShow = false;
		}
	}

	return isTimeToShow;
}

async function generateNotificationButton(buttons, buttonsWithValues, value, event) {
    const groupedNotification = await isGroupedNotificationsEnabled();
	if (value) {
		
		var button;
		
		if (value == "dismiss") {
			// dismiss
			
			var title;
			if (groupedNotification && notificationsOpened.length >= 2) {
				title = getMessage("dismissAll");
			} else {
				title = getMessage("dismiss");
			}
			button = {title:title, iconUrl:"images/cancel-white.png"};
			
		} else if (value == "snoozeTimes") {
			button = {title:"Snooze times...", iconUrl:"images/snooze-white.png"};
		} else if (value == "location|hangout") {
			if (!groupedNotification || (groupedNotification && notificationsOpened.length == 1)) {
				if (event) {
					var eventSource = getEventSource(event);
					//eventSource = {title:"Hello", url:"https://mail.google.com"};
					
					if (event.hangoutLink) {
						button = {title:getMessage("joinVideoCall"), iconUrl:"images/video.png"};
					} else if (eventSource) {
						var iconUrl;
						if (eventSource.isGmail) {
							iconUrl = "images/gmail.png";
						} else {
							iconUrl = "images/link.png";
						}
						button = {title:eventSource.title, iconUrl:iconUrl};
					} else if (event.location) {
						button = {title:event.location, iconUrl:"images/pin_map.png"};
					}
				}
			}
		} else if (value == "reducedDonationAd") {
			button = {title:getMessage("reducedDonationAd_notification", "50¢")};
			//button = {title:"Extras are only 50c click to see/hide this.", iconUrl:"images/thumbs_up.png"};
		} else {
			// snooze
			var unit = value.split("_")[0];
			var delay = value.split("_")[1];
			
			var msgId;
			if (unit == "minutes") {
				msgId = "Xminutes"
			} else if (unit == "hours") {
				if (delay == 1) {
					msgId = "Xhour";
				} else {
					msgId = "Xhours";
				}
			} else if (unit == "days") {
				if (delay == 1) {
					msgId = "Xday";
				} else {
					msgId = "Xdays";
				}
			} else {
				console.error("no unit in snooze: " + unit);
			}
			
			var title;
			if (groupedNotification && notificationsOpened.length >= 2) {
				title = getMessage("snoozeAll");
			} else {
				title = getMessage("snooze");
			}
			title += ": " + getMessage(msgId, delay) + "";
			button = {title:title, iconUrl:"images/snooze-white.png"};
		}

		if (button) {
			buttons.push(button);
			
			var buttonWithValue = deepClone(button);
			buttonWithValue.value = value;
			buttonsWithValues.push(buttonWithValue);
		}
	}
}

async function generateNotificationItem(event) {
	var eventNotificationDetails = await getEventNotificationDetails(event);
	var item = {};
	item.title = eventNotificationDetails.title;
	item.message = "";
	if (eventNotificationDetails.timeElapsed) {
		item.message = " " + eventNotificationDetails.timeElapsed;
	}
	if (eventNotificationDetails.calendarName) {
		if (item.message) {
			item.message += " ";
		}
		item.message += "(" + eventNotificationDetails.calendarName + ")";
	}
	return item;
}

async function generateNotificationOptions(notifications) {
	
	var options = {
		type: "",
		title: "",
		message: "",
		iconUrl: "images/bell-top.png",
		buttons: []
	}
	
	if (notifications.length == 1) {
		options.type = "basic";
		var eventNotificationDetails = await getEventNotificationDetails(notifications[0].event);
		options.title = eventNotificationDetails.title;
	} else {
		options.type = "basic";
		var startOfOldNotifications = 0;
		
		// if only 1 new recent event among the old ones than highlight it (bigger font) by putting it in the title of the notification
		if (notifications.length >= 2 && notifications[0].recent && !notifications[1].recent) {
			
			var eventNotificationDetails = await getEventNotificationDetails(notifications[0].event);
			options.title = eventNotificationDetails.title;
			if (eventNotificationDetails.timeElapsed) {
				options.title += " (" + eventNotificationDetails.timeElapsed + ")";
			}
			if (eventNotificationDetails.calendarName) {
				options.title += " (" + eventNotificationDetails.calendarName + ")";
			}
			
			startOfOldNotifications = 1;
		} else {
			if (DetectClient.isLinux()) {
				// patch because linux gave empty notification unless the title was not empty or not empty string ""
				options.title = notifications.length + " reminders";
			}
		}
		
		var MAX_ITEM_LINES = 3;
		let itemCount = 0;
        await asyncForEach(notifications, async (notification, index) => {
			// skip those that have been highlighted already above
			if (index >= startOfOldNotifications) {
				// if on last available line and but there still 2 or more events than put the "more notice"
				if (itemCount == MAX_ITEM_LINES - 1 && notifications.length - index >= 2) {
					options.contextMessage = (notifications.length - itemCount - startOfOldNotifications) + " " + getMessage("more") + "...";
					return false;
				} else {
					let item = await generateNotificationItem(notification.event);
					options.message += item.title + " " + item.message;
					itemCount++;
					if (index < notifications.length-1) {
						options.message += "\n";
					}
					//options.items.push(item);
				}
			}
		});
		
	}
	

	var buttonsWithValues = []; // used to associate button values inside notification object
	var buttonValue;
	
	var event = notifications.first().event;
	
	buttonValue = await storage.get("notificationButton1");
	await generateNotificationButton(options.buttons, buttonsWithValues, buttonValue, event);

	if (await shouldShowReducedDonationMsg()) {
		buttonValue = "reducedDonationAd";
	} else {
		buttonValue = await storage.get("notificationButton2");
	}
	await generateNotificationButton(options.buttons, buttonsWithValues, buttonValue, event);
	
	if (notifications.length) {
		notifications.forEach(notification => {
			notification.buttons = buttonsWithValues;
		});
	}

	if (DetectClient.isWindows()) {
		options.appIconMaskUrl = "images/icons/notificationMiniIcon.png";
	}
	
	if (options.items && !options.items.length) {
		delete options.items;
	}
	
	const showNotificationDuration = await storage.get("showNotificationDuration");
	if (showNotificationDuration == "7") {
		options.priority = 0;
	} else if (showNotificationDuration == "never") {
        if (!DetectClient.isMac()) {
            options.requireInteraction = true;
        }
	} else {
		options.priority = 2;
	}
	
	return options;
}

function generateNotificationIdFromEvent(event, type) {
	var notificationIdObj = {eventId:event.id, summary:event.summary, type:type, uniqueIdForNotificationId:Math.floor(Math.random() * 1000000)};
	return JSON.stringify(notificationIdObj);
}

function getNotificationObj(notificationId) {
	return JSON.parse(notificationId);
}

async function openNotification(notifications) {
	const options = await generateNotificationOptions(notifications);
	
	console.log("create notif: ", notifications, options);
	
	var notificationId;
	if (await isGroupedNotificationsEnabled()) {
		notificationId = GROUPED_NOTIFICATION_ID;
	} else {
		notificationId = notifications.first().id;
    }

    return new Promise((resolve, reject) => {
        chrome.notifications.create(notificationId, options, async notificationId => {
            if (chrome.runtime.lastError) {
                logError("create notif error: " + chrome.runtime.lastError.message);
                throw chrome.runtime.lastError.message;
            } else {
                storage.setDate("_lastNotificationShownDate");
                
                chrome.idle.queryState(IDLE_DETECTION_INTERVAL, newState => {
                    console.log("idle state when show notif: " + newState);
                    if (newState != "active") {
                        notificationsOpenedCountWhenIdle = notificationsOpened.length;
                    }
                });
                
                forgottenReminder.start();
            }
            resolve();
        });
    });
}

function ForgottenReminder() {
	return { // public interface
		start: async function() {
            // all private members are accesible here
            this.stop();
            await storage.set("_forgottenReminderCount", 0);
            
            const pendingNotificationsInterval = await storage.get("pendingNotificationsInterval");
            if (pendingNotificationsInterval) {
                chrome.alarms.create(Alarms.FORGOTTEN_REMINDER, {periodInMinutes: parseInt(pendingNotificationsInterval)});
            }
		},
		execute: async (params = {}) => {
			if (params.test || await storage.get("_forgottenReminderCount") == 1) {
                const notificationSound = await storage.get("notificationSound");
				if (notificationSound) {
					console.log("forgotten reminder sound: " + new Date());
					chrome.idle.queryState(15, newState => {
						if (newState == "active") {
							playNotificationSoundFile(notificationSound, true);
						}
					});					
				}
			}
            
            if (!forgottenReminderAnimation) {
                forgottenReminderAnimation = new IconAnimation("images/bell_badge.png");
            }
			forgottenReminderAnimation.animate(function(previousBadgeText) {
				updateBadge({forceRefresh:true, badgeText:previousBadgeText});
            });
            
            const reminderWindowId = await storage.get("reminderWindowId");
            if (reminderWindowId) {
                chrome.windows.update(reminderWindowId, {drawAttention:true});
            }
		},
		stop: function() {
			chrome.alarms.clear(Alarms.FORGOTTEN_REMINDER);			
		}
	};
};

function gatherNotifications() {
	var newNotifications = [];
	var oldNotifications = [];
	notificationsQueue.forEach(notification => {
		
		// patch for issue when notification was not being removed when snoozed within remindersWindow because id's were mismatched
		if (!notification.id) {
			notification.id = generateNotificationIdFromEvent(notification.event);						
		}
		
		const found = notificationsOpened.some(notificationOpened => {
			return isSameEvent(notification.event, notificationOpened.event);
		});
		
		if (found) {
			notification.recent = false;
			oldNotifications.push(notification);
		} else {
			notification.recent = true;
			newNotifications.push(notification);
		}
	});
	
	// re-initialize eventsInGroupNotification *after performing code above to identify new notifications
	notificationsOpened = notificationsQueue.shallowClone();
	
	var notificationsInOrder = [];
	notificationsInOrder = notificationsInOrder.concat(newNotifications, oldNotifications);

	sortNotifications(notificationsInOrder);
	
	return {notificationsInOrder:notificationsInOrder, newNotifications:newNotifications, oldNotifications:oldNotifications};
}

async function showNotifications(params = {}) {
    const email = await storage.get("email");
	
	if (await isDND()) {
		throw "DND enabled! So cannot show notifications";
	} else {
		if (notificationsQueue.length >= 1) {
			
			var desktopNotification = await storage.get("desktopNotification");

            if (!desktopNotification) {
                return "Notifications need to be enabled in the extension";
            }
			
			var textNotification = params.testType == "text" || (params.testType == undefined && desktopNotification == "text");
			var richNotification = params.testType == "rich" || (params.testType == undefined && desktopNotification == "rich");
			var popupWindowNotification = params.testType == "popupWindow" || (params.testType == undefined && desktopNotification == "popupWindow");
			
			if (textNotification || !chrome.notifications) {
				
				if (globalThis.Notification) {

					var notificationError = null;

					// text window
                    await asyncForEach(notificationsQueue, async (notification, index) => {
						var eventNotificationDetails = await getEventNotificationDetails(notification.event);
						
						var title = eventNotificationDetails.title;
						var message = "";
						if (eventNotificationDetails.calendarName) {
							message = "from " + eventNotificationDetails.calendarName;
						}
		
						notificationWindow = new Notification(title, {body:message, icon:'images/bell-48.png', requireInteraction: !DetectClient.isMac()});
						notificationWindow.notification = notification;
						
						notificationWindow.onclick = function() {
							var url = getEventUrl(this.notification.event, email);
							if (url) {
								openUrl(url, {urlToFind:this.notification.event.id});
							}
							this.close();
						}
						
						notificationWindow.onshow = function() {
							/*
							var thisNotification = this;
							if (await storage.get("closePopupsAfterAWhile")) {
								setTimeout(function() {
									thisNotification.close();
								}, ONE_SECOND * parseInt(await storage.get("closePopupsAfterAWhileInterval")));
							}
							*/
						}			
						notificationWindow.onclose = function() {
							notificationWindow = null;
						}
						notificationWindow.onerror = function(e) {
							notificationError = "Error displaying notification: " + e.type + " " + e.detail;
							logError(notificationError);
						}

						// clear queue
						await updateNotificationEventsShown([notification], eventsShown);
						notificationsQueue = [];
					});
                    
					// let's wait to see if notification.onerror is called before concluding a successful callback here
                    await sleep(200);
                    if (notificationError) {
                        throw notificationError;
                    }
				} else {
					const warning = "Notifications not supported!";
					console.warn(warning);
					throw warning;
				}
			} else if (richNotification) {
				// rich notification
				
				// notificationsQueue = notifications that should be launched and are acculumated each time checkEvents is passed
				if (await isGroupedNotificationsEnabled()) {
					// group notifications

					var gatheredNotifications = gatherNotifications();
					
					var notificationsInOrder = gatheredNotifications.notificationsInOrder;
					var newNotifications = gatheredNotifications.newNotifications;
					var oldNotifications = gatheredNotifications.oldNotifications;
					
					console.log("new notifs", newNotifications);
					if (newNotifications.length || params.testType) {
                        console.log("clear", newNotifications);
                        
                        await new Promise((resolve, reject) => {
                            chrome.notifications.clear(GROUPED_NOTIFICATION_ID, async function(wasCleared) {
                                try {
                                    await openNotification(notificationsInOrder);
                                    resolve();
                                } catch (error) {
                                    // reset opened notification flags
                                    closeNotifications(notificationsOpened);
                                    reject(error);
                                }
                            });
                        });
					} else {
						var warning = "No new notifications";
						console.log(warning, newNotifications);
						return {warning:warning};
					}
				} else {
					// Individual Notifications
					// notificationOpened = notification that HAVE been launched
					// this method is used to make we don't relaunch notification that have already been displayed
                    
                    await asyncForEach(notificationsQueue, async (notification, index) => {

						const found = notificationsOpened.some(notificationOpened => {
							return isSameEvent(notification.event, notificationOpened.event);
                        });

						if (!found) {
							notification.id = generateNotificationIdFromEvent(notification.event);
                            
                            try {
                                await openNotification([notification]);
                                notificationsOpened.push(notification);
                            } catch (error) {
                                // ignore
                                console.info("Problem showing notification: ", error);
                            }
						}
					});
				}
			} else if (popupWindowNotification) {
				var gatheredNotifications = gatherNotifications();
				
				var notificationsInOrder = gatheredNotifications.notificationsInOrder;
				var newNotifications = gatheredNotifications.newNotifications;
				var oldNotifications = gatheredNotifications.oldNotifications;
				
				notificationsOpened = notificationsQueue.shallowClone();
                
				if (newNotifications.length || params.testType) {
					console.log("open reminders from shownotif");
					openReminders({
						useIdle: !params.testType
					});
					
					chrome.idle.queryState(IDLE_DETECTION_INTERVAL, function(newState) {
						console.log("idle state when show notif: " + newState);
						if (newState != "active") {
							notificationsOpenedCountWhenIdle = notificationsOpened.length;
						}
					});

				}
				
			} else {
				// html window
				// Handle exists
				// not used anymore...
				throw "Notification system not recognized!";
			}
		} else {
			throw "No events in the queue";
		}
	}
}

async function testNotification(params) {
	const notification = {
        test: true,
		time: new Date(),
		reminderTime: new Date(),
		event: {
            id: Math.random(),
            test: true,
            allDay: false,
            title: getMessage("testEvent"),
            summary: getMessage("testEvent"),
            description: getMessage("testDescription"),
            startTime: new Date(),
            reminderTimes: [{
                shown: false,
                time: new Date()
            }],
            calendar: getPrimaryCalendar(await getArrayOfCalendars())
        }
	};
	notificationsQueue.push(notification);
	playNotificationSound(notification);
	return showNotifications(params);
}

function getPollingInterval() {
	// note2 - refer to: feedUpdatedWithinTheseHours ... because we use 2 hours if the calendars don't have notifications 
	return hours(POLLING_INTERVAL_IN_HOURS);
}

function getChromeWindowOrBackgroundMode() {
	return new Promise((resolve, reject) => {
		if (chrome.permissions && !DetectClient.isFirefox()) { // ff returns error when tring to detect "background" permission
			chrome.permissions.contains({permissions: ["background"]}, function(result) {
                if (chrome.runtime.lastError) {
                    console.warn(chrome.runtime.lastError.message);
                    resolve(false);
                } else {
                    resolve(result);
                }
			});
		} else {
			resolve(false);
		}
	}).then(result => {
		return new Promise((resolve, reject) => {
			if (result) {
				resolve();
			} else {
				chrome.windows.getAll(null, function(windows) {
					if (windows && windows.length) {
						resolve();
					} else {
						reject("No windows exist");
					}
				});
			}
		});
	});
}

function queueNotification(params) {
	// checkEvents might have been called several times so let's make sure not to add duplicate entries
	const found = notificationsQueue.some(notificationInQueue => {
		if (notificationInQueue.event.id == params.event.id && notificationInQueue.reminderTime.isEqual(params.reminderTime)) {
			console.warn("already queued this event (bug?)", params);
			return true;
		}
	});
	
	if (!found) {
		notificationsQueue.push(params);
	}
}

async function ensurePollServer() {
    const lastPollTime = await storage.get("_lastPollTime");
	return new Promise((resolve, reject) => {
        var pollingInterval = getPollingInterval();
		var elapsedTime = Date.now() - lastPollTime.getTime();
		if (elapsedTime >= pollingInterval) {
			// logic here: make sure any events added between the 30 min intervals get loaded so idle time should be larger than 30min+buffer
			// because pollinginterval is in MILLIseconds and idle uses seconds!
			var pollingIntervalInSeconds = pollingInterval / ONE_SECOND;
			var idleBuffer = 5 * 60; // 5 minutes;
			var idleSeconds = pollingIntervalInSeconds + idleBuffer
			
			chrome.idle.queryState(idleSeconds, state => {
				// only poll if active or user just returned from standby is at login screen (note the encapsulating method above must also pass ie. can't poll faster than polling interval)
				if (state == "active" || (state == "locked" && detectSleepMode.isWakingFromSleepMode())) {
					pollServer().then(() => {
						resolve();
					}).catch(error => {
						resolve(); // return resolve anyways for caller to be able to use .then
					});
				} else {
					console.log("state: " + state + " don't poll");
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
}

async function checkEvents(params = {}) {
    try {
        getChromeWindowOrBackgroundMode();
    } catch (error) {
        console.error("Maybe NO chromeWindowOrBackgroundMode - so do not check events, possible error: " + error);
        return;
    }
	
    // SKIP because interval to short
    if (params.source == "interval") {
        const lastCheckEventsTime = await storage.get("_lastCheckEventsTime");
        if (Math.abs(lastCheckEventsTime.diffInSeconds()) < 5) {
            console.log("skip checkevents");
            return;
        }
        const remindersWindowClosedTime = await storage.get("_remindersWindowClosedTime");
        if (remindersWindowClosedTime && Math.abs(remindersWindowClosedTime.diffInSeconds()) < 2) {
            console.log("skip checkevents, patch for reminders just closed");
            return;
        }
        await storage.setDate("_lastCheckEventsTime");
    }
    
    console.log("checkEvents: " + params.source);
    
    // fetch any new or deleted events before updating visuals
    await ensurePollServer();

    if (!await storage.get("loggedOut")) {
        var nextEvent = null;
        var badgeText = "";
        var badgeColor = null;
        var toolTip = "";
        var previousNextEvent = null;
        var unitOfTimeLeftOnBadge;
        var oldestEventDateToFetch = getStartDateBeforeThisMonth();
        let eventInProgress;
        eventsIgnoredDueToCalendarReminderChangeByUser = false;
        
        console.time("vars")
        const [
            email,
            installDate,
            selectedCalendars,
            calendarSettings,
            excludedCalendars,
            desktopNotification,
            hideColonInTime,
            snoozers,
            doNotShowNotificationsForRepeatingEvents,
            doNotShowPastNotifications,
            excludeRecurringEventsButtonIcon,
            excludeHiddenCalendarsFromButton,
            maxDaysAhead,
            showDaysLeftInBadge,
            showMinutesLeftInBadge,
            showHoursLeftInBadge
        ] = await Promise.all([
            storage.get("email"),
            getInstallDate(),
            storage.get("selectedCalendars"),
            storage.get("calendarSettings"),
            storage.get("excludedCalendars"),
            storage.get("desktopNotification"),
            storage.get("hideColonInTime"),
            getSnoozers(),
            storage.get("doNotShowNotificationsForRepeatingEvents"),
            storage.get("doNotShowPastNotifications"),
            storage.get("excludeRecurringEventsButtonIcon"),
            storage.get("excludeHiddenCalendarsFromButton"),
            storage.get("maxDaysAhead"),
            storage.get("showDaysLeftInBadge"),
            storage.get("showMinutesLeftInBadge"),
            storage.get("showHoursLeftInBadge")
        ]);
        console.timeEnd("vars")

        calendarMap = calendarMap || await initCalendarMap();

        events = params.events || await getEvents();

        events.forEach(event => {
            
            // make sure not excluded AND do not include notifications for free busy calendar (since we have no event titles to display for these events)
            const calendar = getEventCalendar(event);
            if (calendar.accessRole != CalendarAccessRole.FREE_BUSY && event.startTime.isEqualOrAfter(oldestEventDateToFetch) && !hasUserDeclinedEvent(event, email)) {

                // For notifs
                
                if (!isCalendarExcludedForNotifs(calendar, excludedCalendars) && !isGadgetCalendar(calendar)) {
                    let passedDoNotShowNotificationsForRepeatingEvents = true;
                    // if a recurring event (aka. 'originalEvent' because it points to the recurring event) and user set to exclude recurring events then fail this test
                    if (event.recurringEventId && doNotShowNotificationsForRepeatingEvents) {
                        passedDoNotShowNotificationsForRepeatingEvents = false
                    }
                    
                    const passedRemindOnRespondedEventsOnlyFlag = passedRemindOnRespondedEventsOnly(event, calendarSettings, email);
                    
                    // created this flag to skip this part because it is a CPU intensive loop when there are many events or eventsShown particularly the method isEventShownOrSnoozed()
                    if ((params.ignoreNotifications == undefined || !params.ignoreNotifications) && passedDoNotShowNotificationsForRepeatingEvents && passedRemindOnRespondedEventsOnlyFlag) {
                        const reminders = getEventReminders(event);
                        
                        if (reminders) {
                            reminders.forEach(reminder => {
                                const reminderTime = getReminderTime(event, reminder);
                                
                                if (reminder.method == "popup" && !isEventShownOrSnoozed(event, reminderTime, snoozers)) {
                                    if (isTimeToShowNotification(event, reminderTime, reminder.lastUpdated, doNotShowPastNotifications, installDate)) {
                                        queueNotification({event:event, reminderTime:reminderTime});
                                    }
                                }
                            });
                        }
                    }
                }
                
                // For badge

                let passedExcludeRecurringEventsButtonIcon = true;
                // if a recurring event (aka. 'originalEvent' because it points to the recurring event) and user set to exclude recurring events then fail this test
                if (event.recurringEventId && excludeRecurringEventsButtonIcon) {
                    passedExcludeRecurringEventsButtonIcon = false
                }
                
                let passedHiddenCalendarsFromButtonTest = true;
                const selected = isCalendarSelectedInExtension(calendar, email, selectedCalendars);
                
                if (calendar && !selected && excludeHiddenCalendarsFromButton) {
                    passedHiddenCalendarsFromButtonTest = false;
                }

                if (passedExcludeRecurringEventsButtonIcon && passedHiddenCalendarsFromButtonTest && !event.allDay && event.startTime.isBefore() && event.endTime && event.endTime.isAfter()) {
                    eventInProgress = event;
                }
                
                const nextEventMin = Math.ceil((event.startTime.getTime() - Date.now()) / ONE_MINUTE);

                if (passedExcludeRecurringEventsButtonIcon && passedHiddenCalendarsFromButtonTest && (event.startTime.getTime() - Date.now() >= 0 || event.allDay && isToday(event.startTime)) && nextEventMin < 60*24*maxDaysAhead) {
                    if (!nextEvent) {					
                        if (event.allDay) {
                            if (!isToday(event.startTime)) {
                                if (showDaysLeftInBadge) {
                                    badgeText = event.startTime.diffInDaysForHumans() + getMessage(TimePeriodSymbol.DAY);
                                    badgeColor = BadgeColor.GRAY;
                                }
                                
                                unitOfTimeLeftOnBadge = TimePeriodSymbol.DAY;
                                nextEvent = event;
                            }
                        } else {
                            if (nextEventMin < 60) {
                                if (showMinutesLeftInBadge) {
                                    badgeText = nextEventMin + getMessage(TimePeriodSymbol.MINUTE);
                                    badgeColor = BadgeColor.RED;
                                } else {
                                    badgeText = formatTimeForBadge(event.startTime, hideColonInTime);
                                    badgeColor = BadgeColor.BLUE;
                                }
                                unitOfTimeLeftOnBadge = TimePeriodSymbol.MINUTE;
                            } else if (nextEventMin < 60*12) {
                                if (showHoursLeftInBadge) {
                                    badgeText = Math.round(nextEventMin/60) + getMessage(TimePeriodSymbol.HOUR);
                                } else {
                                    badgeText = formatTimeForBadge(event.startTime, hideColonInTime);
                                }
                                badgeColor = BadgeColor.BLUE;
                                unitOfTimeLeftOnBadge = TimePeriodSymbol.HOUR;
                            } else if (nextEventMin < 60*24) {
                                if (showHoursLeftInBadge) {
                                    badgeText = Math.round(nextEventMin/60) + getMessage(TimePeriodSymbol.HOUR);
                                } else {
                                    badgeText = formatTimeForBadge(event.startTime, hideColonInTime);
                                }			
                                badgeColor = BadgeColor.GRAY;
                            } else {
                                if (showDaysLeftInBadge) {
                                    badgeText = event.startTime.diffInDaysForHumans() + getMessage(TimePeriodSymbol.DAY);
                                    badgeColor = BadgeColor.GRAY;
                                }
                                unitOfTimeLeftOnBadge = TimePeriodSymbol.DAY;
                            }
                            nextEvent = event;
                        }
                    }
                    if (!previousNextEvent || event.startTime.toDateString() != previousNextEvent.startTime.toDateString()) {
                        if (toolTip != "") {
                            toolTip += "\n\n";
                        }
                        if (isToday(event.startTime)) {
                            toolTip += getTodayMessage() + ":";
                        } else if (isTomorrow(event.startTime)) {
                            toolTip += getTomorrowMessage() + ":";
                        } else {
                            toolTip += generateTimeDurationStr({event:event, hideStartDay:true}) + ":";
                        }
                    }
                    toolTip += "\n";
                    if (event.allDay) {
                        toolTip += getSummary(event);
                    } else {
                        toolTip += generateTimeDurationStr({event:event, hideStartDay:true}) + " " + getSummary(event);
                    }
                    toolTip = toolTip.replace(/&amp;/ig, "&");
                    previousNextEvent = event;
                }
            }
        });
        
        if (eventsIgnoredDueToCalendarReminderChangeByUser) {
            console.log("eventsIgnoredDueToCalendarReminderChangeByUser so serialize")
            serializeEventsShown();
        }
        
        // Check snoozers
        snoozers.forEach(snoozer => {
            if ((!snoozer.email || snoozer.email == email) && snoozer.time && snoozer.time.isEqualOrBefore()) {
                if (!isCurrentlyDisplayed(snoozer.event, notificationsQueue)) {
                    queueNotification({event:snoozer.event, reminderTime:snoozer.reminderTime});
                }
            }
        });
        
        if (await storage.get("showDayOnBadge")) {
            if (!unitOfTimeLeftOnBadge || (unitOfTimeLeftOnBadge == TimePeriodSymbol.MINUTE && !await storage.get("showDayOnBadgeExceptWhenMinutesLeft")) || (unitOfTimeLeftOnBadge == TimePeriodSymbol.HOUR && !await storage.get("showDayOnBadgeExceptWhenHoursLeft")) || (unitOfTimeLeftOnBadge == TimePeriodSymbol.DAY && !await storage.get("showDayOnBadgeExceptWhenDaysLeft"))) {
                badgeText = new Date().toLocaleDateString(locale, {weekday: "short"});
                badgeColor = [150,150,150, 255];
            }
        }
        
        chrome.browserAction.getBadgeText({}, async previousBadgeText => {
            if (await storage.get("showEventTimeOnBadge") || await storage.get("showDayOnBadge")) {
                // badgetext stays the same
            } else {
                badgeText = "";
            }

            if (nextEvent && await storage.get("useEventColors")) {
                const eventColors = getEventColors({
                    event: nextEvent,
                    cachedFeeds: await storage.get("cachedFeeds"),
                    arrayOfCalendars: await getArrayOfCalendars()
                });
                badgeColor = eventColors.bgColor;
            }
            
            updateBadge({badgeText:badgeText, badgeColor:badgeColor, toolTip:toolTip});
        });

        // must be done before sound and desktop notifications
        await filterNotifications(notificationsQueue);

        const soundsPlayedPromise = asyncForEach(notificationsQueue, async notification => {
            if (!notification.audioPlayedCount) {
                await playNotificationSound(notification);
            }
        });
        
        if (desktopNotification && notificationsQueue.length >= 1) {
            try {
                await showNotifications();
            } catch (error) {
                if (params.source != "startup") {
                    throw error;
                }
            }
        }

        await soundsPlayedPromise; // need to wait for audioPlayedCount to be set above before serializing below, also we want to show desktop before audio is complete
        await storage.set("notificationsQueue", notificationsQueue);
        await storage.set("notificationsOpened", notificationsOpened);

        const previousEventInProgress = await storage.get("_previousEventInProgress")
        if (!previousEventInProgress && eventInProgress) {
            sendMessageToGmailExtension({
                action: "setDNDEndTime",
                triggeredByCalendarExtension: true,
                endTime: eventInProgress.endTime.toJSON()
            }).catch(error => {
                // ignore exception
            });
        } else if (previousEventInProgress && !eventInProgress) {
            // do nothing
        }
        if (eventInProgress) {
            await storage.set("_previousEventInProgress", eventInProgress);
        }
    }
}

async function filterNotifications(notifications) {
    var removedNotifications = [];
    
    const doNotShowNotificationsForAlldayEvents = await storage.get("doNotShowNotificationsForAlldayEvents");
	
	for (var a=0; notification=notifications[a], a<notifications.length; a++) {
		var allDayEventRulesPassed = false;
		if (!doNotShowNotificationsForAlldayEvents || (doNotShowNotificationsForAlldayEvents && !notification.event.allDay)) {
			allDayEventRulesPassed = true;
		}
		if (!allDayEventRulesPassed) {
			// when splicing in a for loop must a-- the index or else it will skip the item after the deleted item
			notifications.splice(a, 1);
			a--;
		} else {
			// remove any deleted events
			if (events.length) { // make sure we have some events because they could be empty if we're offline or there was a temporary connection issue
				var foundEvent = findEventById(notification.event.id, events);
				if (!foundEvent) {
					console.log("remove event from notifications because it was probably deleted", notification);
					removedNotifications.push(notification);
					//notifications.splice(a, 1);
					//a--;
				}
			}
		}
	}
	
	if (removedNotifications.length) {
		await closeNotifications(removedNotifications);
		// send to reminders popup
		chrome.runtime.sendMessage({action: "removeNotifications", notifications:removedNotifications});
	}
}

function serializeEventsShown() {
	// put a timer because this process freezes UI because of the size of eventsShown in localstorage
	clearTimeout(globalThis.serializeEventsTimer);
	globalThis.serializeEventsTimer = setTimeout(() => {
		storage.set("eventsShown", eventsShown).catch(error => {
			// try removing cachedfeeds to make room and then try the eventsShown (becuase its more important)
			logError("error serializing eventsShown: " + error + " eventsShown: " + eventsShown.length + " now trying to remove cachedFeeds to make space...");
			storage.remove("cachedFeeds").then(() => {
				storage.set("eventsShown", eventsShown).catch(error => {
					logError("error serialized eventsShown again: " + error + " so show message to user");
					openUrl(Urls.STORAGE_ISSUE);
				});
			}).catch(error => {
				logError("error removing cachedFeeds: " + error);
				openUrl(Urls.STORAGE_ISSUE);
			});
		});
	}, seconds(2));
}

function openUnstableWarningPage() {
	openUrl("https://jasonsavard.com/wiki/Unstable_browser_channel");
}

async function firstInstall() {
	// Note: Install dates only as old as implementation of this today, April 11th 2011
	await storage.setDate("installDate");
	await storage.set("installVersion", chrome.runtime.getManifest().version);
	var optionsUrl = chrome.runtime.getURL("options.html?action=install");
	chrome.tabs.create({url: "https://jasonsavard.com/thankYouForInstalling?app=calendar&optionsUrl=" + encodeURIComponent(optionsUrl)});
	sendGA("installed", chrome.runtime.getManifest().version);
}

// DO NOT place onInstalled in any async callbacks because the "update" event would not trigger for testing when reloading extension
if (chrome.runtime.onInstalled) {
	chrome.runtime.onInstalled.addListener(async details => {
		console.info("onInstalled: " + details.reason);

        if (details.reason == "install" && !await storage.get("installDate")) {
            firstInstall();
        } else if (details.reason == "update") {

            // LEGACY START

            // prepare for v3
            if (!await storage.get("detectedChromeVersion") && globalThis.localStorage?.["detectedChromeVersion"]) {
                storage.set("detectedChromeVersion", true);
            }

            // LEGADY END

            // seems that Reloading extension from extension page will trigger an onIntalled with reason "update"
            // so let's make sure this is a real version update by comparing versions
            if (details.previousVersion == chrome.runtime.getManifest().version) {
                // nothing for now
            } else {
                console.log("version changed");

                // migrate users from gcm to firestore
                if (ltVersion(details.previousVersion, "25.0.10")) {
                    //storage.setDate("_migrateToFirestore");
                }

                // extension has been updated to let's resync the data and save the new extension version in the sync data (to make obsolete any old sync data)
                // but let's wait about 60 minutes for (if) any new settings have been altered in this new extension version before saving syncing them
                chrome.alarms.create(Alarms.EXTENSION_UPDATED_SYNC, {delayInMinutes:60});
            }
            
            var previousVersionObj = parseVersionString(details.previousVersion)
            var currentVersionObj = parseVersionString(chrome.runtime.getManifest().version);
            if (!await storage.get("disabledExtensionUpdateNotifications") && (previousVersionObj.major != currentVersionObj.major || previousVersionObj.minor != currentVersionObj.minor)) {
                storage.set("_lastBigUpdate", chrome.runtime.getManifest().version);
                
                const options = {
                    type: "basic",
                    title: getMessage("extensionUpdated"),
                    message: "Checker Plus for Google Calendar " + chrome.runtime.getManifest().version,
                    iconUrl: "images/icons/icon-128.png",
                    buttons: [{title: getMessage("seeUpdates")}]
                }

                if (DetectClient.isFirefox()) {
                    options.priority = 2;
                } else {
                    if (!DetectClient.isMac()) { // patch for macOS Catalina not working with requireinteraction
                        options.requireInteraction = true;
                    }
                }

                chrome.notifications.create("extensionUpdate", options, notificationId => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                });
            }
        }

        init();

        sendGA("extensionVersion", chrome.runtime.getManifest().version, details.reason);
	});
} else {
    storage.get("installDate").then(installDate => {
        if (!installDate) {
            firstInstall();
        }
    });
}

if (chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(() => {
        init();
    })
}

if (chrome.alarms) {
    chrome.alarms.onAlarm.addListener(async alarm => {
        //console.log("alarm", alarm.name);
        await initMisc();

        if (alarm.name == Alarms.EVERY_MINUTE) {
            checkEvents({source:"interval"});
            detectSleepMode.ping();

            // update snooze notifiation times
            if (await storage.get("desktopNotification") == "rich") {
                updateNotifications();
            }
        } else if (alarm.name == Alarms.WATCH_CALENDAR_SETTINGS) {
            watchCalendarSettings();
        } else if (alarm.name == Alarms.WATCH_CALENDAR_LIST) {
            watchCalendarList();
        } else if (alarm.name.startsWith(WATCH_CALENDAR_EVENTS_ALARM_PREFIX)) {
            const calendarId = alarm.name.split(WATCH_CALENDAR_EVENTS_ALARM_PREFIX)[1];
            const calendar = getCalendarById(calendarId);
            const email = await storage.get("email");
            const selectedCalendars = await storage.get("selectedCalendars");
            const excludedCalendars = await storage.get("excludedCalendars");
            const desktopNotification = await storage.get("desktopNotification");
            // only keep watching if calendar is selected and not excluded
            if (isCalendarUsedInExtension(calendar, email, selectedCalendars, excludedCalendars, desktopNotification)) {
                watchCalendarEvents(calendarId);
            }
        } else if (alarm.name == Alarms.EXTENSION_UPDATED_SYNC) {
            syncOptions.save("extensionUpdatedSync");
        } else if (alarm.name == Alarms.SYNC_DATA) {
            syncOptions.save("sync key");
        } else if (alarm.name == Alarms.UPDATE_CONTACTS) {
            // update contacts
            updateContacts().catch(function (error) {
                console.warn("updateContacts() error: " + error);
            });
        } else if (alarm.name == Alarms.UPDATE_UNINSTALL_URL) {
            // do this every day so that the daysellapsed is updated in the uninstall url
            setUninstallUrl(await storage.get("email"));
        } else if (alarm.name == Alarms.UPDATE_CONTEXT_MENU) {
            updateContextMenuItems();
        } else if (alarm.name == Alarms.POLL_SERVER_FROM_FCM_UPDATE) {
            pollServerFromFCMUpdate();
        } else if (alarm.name == Alarms.POLL_SERVER_AFTER_RIGHT_CLICK_SET_DATE) {
            pollServer({source:"afterRightClickSetDate..."});
        } else if (alarm.name == Alarms.OPEN_REMINDERS) {
            console.log("notificationsOpened.length", notificationsOpened.length);
            if (notificationsOpened.length) {
                if (!await storage.get("reminderWindowId") && await storage.get("desktopNotification") == "popupWindow") {
                    console.log("reminders 5min");
                    openReminders({useIdle:true});
                }
            }
        } else if (alarm.name == Alarms.FORGOTTEN_REMINDER) {
            const forgottenReminderCount = await storage.get("_forgottenReminderCount");
            await storage.set("_forgottenReminderCount", forgottenReminderCount + 1);

            const desktopNotification = await storage.get("desktopNotification");

            if (desktopNotification == "rich") {
                if (chrome.notifications.getAll) {
                    chrome.notifications.getAll(notifications => {
                        if (isEmptyObject(notifications)) {
                            // no reminders let's stop interval
                            forgottenReminder.stop();
                        } else {
                            forgottenReminder.execute();
                        }
                    });
                } else {
                    forgottenReminder.stop();
                }
            } else if (desktopNotification == "popupWindow") {
                if (await storage.get("reminderWindowId")) {
                    forgottenReminder.execute();
                } else {
                    forgottenReminder.stop();
                }
            } else {
                forgottenReminder.stop();
            }
        } else if (alarm.name == Alarms.UPDATE_SKINS) {
            console.log("updateSkins...");
            
            var skinsSettings = await storage.get("skins");
            const skinsIds = skinsSettings.map(skin => skin.id);
            
            if (skinsIds.length) {
                const skins = await Controller.getSkins(skinsIds, await storage.get("_lastUpdateSkins"));
                console.log("skins:", skins);
                
                var foundSkins = false;
                skins.forEach(skin => {
                    skinsSettings.some(skinSetting => {
                        if (skinSetting.id == skin.id) {
                            foundSkins = true;
                            console.log("update skin: " + skin.id);
                            copyObj(skin, skinSetting);
                            //skinSetting.css = skin.css;
                            //skinSetting.image = skin.image;
                            return true;
                        }
                    });
                });
                
                if (foundSkins) {
                    storage.set("skins", skinsSettings);
                }
                
                storage.setDate("_lastUpdateSkins");
            }
        } else if (alarm.name == Alarms.COLLECT_STATS) {
            console.log("collecting optionstats")
                    
            let optionStatCounter = 1;
            
            async function sendOptionStat(settingName) {
                let settingValue = await storage.get(settingName);
                
                // Convert booleans to string because google analytics doesn't process them
                if (settingValue === true) {
                    settingValue = "true";
                } else if (settingValue === false || settingValue == null) {
                    settingValue = "false";
                }
                
                // issue: seems like the 1st 10 are being logged only in Google Analytics - migth be too many sent at same time
                // so let's space out the sending to every 2 seconds
                setTimeout(function() {
                    sendGA("optionStats", settingName, settingValue);
                }, optionStatCounter++ * seconds(2));
            }
            
            var calendarViewStr = await storage.get("calendarView");
            if (calendarViewStr == CalendarView.AGENDA) {
                calendarViewStr = "agenda";
            }
            sendOptionStat("calendarView");
            
            sendOptionStat("notificationSound"); // sound
            sendOptionStat("notificationVoice"); // voice
            sendOptionStat("desktopNotification"); // desktop
            sendOptionStat("donationClicked");
            sendOptionStat("badgeIcon");
            
            storage.setDate("lastOptionStatsSent");
        }
    });
}

// Add listener once only here and it will only activate when browser action for popup = ""
chrome.browserAction.onClicked.addListener(async tab => {
    const browserButtonAction = await storage.get("browserButtonAction");
    if (browserButtonAction == BrowserButtonAction.GOOGLE_CALENDAR) {
        openGoogleCalendarWebsite();
    } else if (browserButtonAction == BrowserButtonAction.POPUP_DETACHED) {
        var width = await storage.get("detachedPopupWidth");
        var height = await storage.get("detachedPopupHeight");
        
        // enlarge if using zoom
        width *= globalThis.devicePixelRatio;
        height *= globalThis.devicePixelRatio;
        
        var left = (screen.width/2)-(width/2);
        var top = (screen.height/2)-(height/2);
        
        chrome.windows.create({url:chrome.runtime.getURL("popup.html"), width:Math.round(width), height:Math.round(height), left:Math.round(left), top:Math.round(top), type:"popup", state:"normal"});
    } else {
        openUrl(chrome.runtime.getURL("popup.html"), {urlToFind:chrome.runtime.getURL("popup.html")});
    }
});

// Setup omnibox...
if (chrome.omnibox) {
    chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
        setOmniboxSuggestion(text, suggest);
    });
}

chrome.windows.onRemoved.addListener(async windowId => {

    await initMisc();
    
    let reminderWindowId = await storage.get("reminderWindowId");
    // detect reminders closed so we snooze it to return in 5 minutes
    if (reminderWindowId == windowId) {
        console.log("reminders closed");
        reminderWindowId = null;
        await storage.remove("reminderWindowId");
        await storage.setDate("_remindersWindowClosedTime");
        
        if (!await storage.get("_remindersWindowClosedByDismissingEvents") && !await storage.get("_remindersWindowCloseWarning")) {
            await storage.enable("_remindersWindowCloseWarning");
            await sleep(seconds(1));
            console.log("open reminders settimeout");
            openReminders({closeWindowGuide:true});
        }
        
        chrome.alarms.create(Alarms.OPEN_REMINDERS, {delayInMinutes: 5});
    }
    
    // patch: if all browser windows closed then let's closereminders because if we leave it doesn't regisere snoozes or dimssiess??
    if (reminderWindowId) {
        chrome.windows.getAll(function(windows) {
            var windowsOpened = 0;
            
            windows.forEach(function(thisWindow) {
                if (reminderWindowId == thisWindow.id) {
                    // ignore
                } else {
                    windowsOpened++;
                }
            });
            
            if (windowsOpened == 0) {
                closeReminders();
            }
        });
    }
});

if (chrome.commands && DetectClient.isChrome()) {
    chrome.commands.onCommand.addListener(async command => {
        await initMisc();
        if (command == "dismissEvent") {
            console.log("oncommand dismiss");
            var desktopNotification = await storage.get("desktopNotification");
            var noEventsToDismiss = false;
            
            if (desktopNotification == "text") {
                if (notificationWindow) {
                    notificationWindow.close();
                } else {
                    noEventsToDismiss = true;
                }
            } else if (desktopNotification == "rich") {
                if (notificationsOpened.length) {
                    await closeNotifications(notificationsOpened);
                } else {
                    noEventsToDismiss = true;
                }
            } else if (desktopNotification == "popupWindow") {
                chrome.runtime.sendMessage({action: "dismissAll"});
            }
            
            if (noEventsToDismiss) {
                shortcutNotApplicableAtThisTime("No events to dismiss");
            }
        } else if (command == "quickAddSelection") {
            console.log("quick add selection");
            chrome.tabs.executeScript({
                code: "window.getSelection().toString();"
            }, async selection => {
                //if (selection != "") { // because selection is actually an object
                    console.info("sel", selection);
                    const tab = await getActiveTab();
                    console.log("active tab", tab);
                    quickAddSelectionOrPage({
                        quickAdd: true,
                        allDay: true,
                        selectionText: selection.toString(),
                        inputSource: InputSource.SHORTCUT
                    }, tab);
                //} else {
                    //shortcutNotApplicableAtThisTime("Nothing selected");
                //}
            });
        }
    });
}

async function onButtonClicked(notificationId, buttonIndex) {
    console.log("notif onbuttonclick:", notificationId, buttonIndex);
    const email = await storage.get("email");
    const groupedNotification = await isGroupedNotificationsEnabled();
        
    if (notificationId == "extensionUpdate") {
        if (buttonIndex == -1 || buttonIndex == 0) {
            openChangelog();
            chrome.notifications.clear(notificationId, function() {});
            storage.remove("_lastBigUpdate");
            sendGA("extensionUpdateNotification", "clicked button - see updates");
        } else if (buttonIndex == 1) {
            storage.enable("disabledExtensionUpdateNotifications");
            chrome.notifications.clear(notificationId);
            storage.remove("_lastBigUpdate");
            sendGA("extensionUpdateNotification", "clicked button - do not show future notifications");
        }
    } else if (notificationId == "message") {
        // nothing
    } else if (notificationId == "error") {
        openUrl("https://jasonsavard.com/forum/categories/checker-plus-for-google-calendar-feedback?ref=errorNotification");
        chrome.notifications.clear(notificationId, function() {});
        sendGA("errorNotification", "clicked button on notification");
    } else {

        stopAllSounds();
        
        if (isNotificationAddedOutside(notificationId)) {
            const notificationObj = getNotificationObj(notificationId);
            const event = findEventById(notificationObj.eventId, events);
            if (buttonIndex == -1) {
                openUrl(getEventUrl(event, email));
                chrome.notifications.clear(notificationId, function() {});
            } else if (buttonIndex == 0) {
                deleteEvent(event).then(() => {
                    chrome.notifications.clear(notificationId, function(wasCleared) {});
                }).catch(error => {
                    alert("Error deleting event: " + error);
                });
            }
        } else {

            // patch: user might have re-toasted the notification by clicking the bell (before the notification had time to disappear naturally and therefore bypassing the openTemporaryWindowToRemoveFocus logic, so let's force it here
            if (notificationsOpened && notificationsOpened.length == 0) {
                console.log("patch: user might have re-toasted the notification by clicking the bell so let's force call the openTemporaryWindow...");
                openTemporaryWindowToRemoveFocus();
                return;
            }

            var notification = getNotification(notificationsOpened, notificationId);
            if (!notification) {
                // only one notification then we aren't grouped 
                if (notificationsOpened.length == 1) {
                    notification = notificationsOpened.first();
                }
            }
            
            var notificationButtonValue;
            
            if (buttonIndex == -1) {
                notificationButtonValue = "snoozeTimes";
            } else {
                var buttons;
                if (groupedNotification) {
                    buttons = notificationsOpened.first().buttons;
                } else {
                    buttons = notification.buttons;
                }
                
                if (buttonIndex == 0) {
                    notificationButtonValue = buttons[0].value;
                } else if (buttonIndex == 1) {
                    notificationButtonValue = buttons[1].value;
                }
            }
            
            console.log("notificationButtonValue", notificationButtonValue);
            
            if (notificationButtonValue == "dismiss") {
                // dismiss
                console.log("dismiss");
                if (groupedNotification) {
                    sendGA('notificationButtonValue', notificationButtonValue, buttonIndex, notificationsOpened.length);
                    closeNotifications(notificationsOpened);
                    closeReminders();
                } else {
                    closeNotifications([notification]);
                    sendGA('notificationButtonValue', notificationButtonValue, buttonIndex, 1);
                }
            } else if (notificationButtonValue == "snoozeTimes") {
                openReminders();
                sendGA('notificationButtonValue', notificationButtonValue, buttonIndex);
            } else if (notificationButtonValue == "location|hangout") {
                var eventSource = getEventSource(notification.event);
                
                var hangoutLink = notification.event.hangoutLink;
                if (hangoutLink) {
                    openUrl(hangoutLink);
                } else if (eventSource) {
                    openUrl(eventSource.url);
                } else {
                    openUrl(generateLocationUrl(notification.event));
                }

                if (await storage.get("dismissEventAfterClickingJoinVideo")) {
                    closeNotifications([notification]);
                }
                sendGA('notificationButtonValue', notificationButtonValue, buttonIndex);
            } else if (notificationButtonValue == "reducedDonationAd") {
                await storage.enable("reducedDonationAdClicked");
                openUrl("contribute.html?ref=reducedDonationFromNotif");
                updateNotifications();
                sendGA('notificationButtonValue', notificationButtonValue, buttonIndex);
            } else {
                // snooze
                var unit = notificationButtonValue.split("_")[0];
                var delay = notificationButtonValue.split("_")[1];
                
                var snoozeParams = {};
                snoozeParams.source = "notificationButton";
                
                if (unit == "minutes") {
                    snoozeParams.inMinutes = delay;
                } else if (unit == "hours") {
                    snoozeParams.inHours = delay;
                } else if (unit == "days") {
                    snoozeParams.inDays = delay;
                } else {
                    logError("no unit in snooze: " + unit);
                }
                
                if (groupedNotification) {
                    sendGA('notificationButtonValue', "snooze", notificationButtonValue, notificationsOpened.length);
                    await snoozeNotifications(snoozeParams, notificationsOpened);
                    closeReminders();
                } else {
                    await snoozeNotifications(snoozeParams, [notification]);
                    sendGA('notificationButtonValue', "snooze", notificationButtonValue, 1);
                }
            }
        }
    }
}

if (chrome.notifications) {
    
    // click anywhere
    chrome.notifications.onClicked.addListener(async notificationId => {
        await initMisc();
        onButtonClicked(notificationId, -1);
    });
    
    // buttons clicked
    chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
        await initMisc();
        onButtonClicked(notificationId, buttonIndex);
    });
    
    // closed notif
    chrome.notifications.onClosed.addListener(async (notificationId, byUser) => {
        await initMisc();
        if (notificationId == "extensionUpdate") {
            if (byUser) {
                sendGA("extensionUpdateNotification", "closed notification");
            }
        } else if (notificationId == "message") {
            // nothing
        } else if (notificationId == "error") {
            // nothing
        } else {		
            // Chrome <=60 byUser happens ONLY when X is clicked ... NOT by closing browser, NOT by clicking action buttons, ** NOT by calling .clear
            // Chrome 61 update: calling .clear will set byUser = true
            if (byUser) {
                console.log("notif onclose", notificationId, byUser);
                stopAllSounds();
                
                if (isNotificationAddedOutside(notificationId)) {
                    // do nothing
                } else {
                    var notification = getNotification(notificationsOpened, notificationId);
                    
                    if (await isGroupedNotificationsEnabled()) {
                        sendGA('notificationButtonValue', "dismissedByClosing", "grouped", notificationsOpened.length);
                        closeNotifications(notificationsOpened, {skipNotificationClear:true});
                        closeReminders();
                    } else {
                        sendGA('notificationButtonValue', "dismissedByClosing", "individual", 1);
                        closeNotifications([notification], {skipNotificationClear:true});
                    }
                }
            }
        }
    });
}

if (chrome.omnibox) {
    chrome.omnibox.onInputEntered.addListener(async text => {
        await initMisc();
        var eventEntry = new EventEntry();			
        eventEntry.summary = text;
        eventEntry.allDay = true;
        eventEntry.inputSource = InputSource.OMNIBOX;
        
        performActionOutsideOfPopup(eventEntry);
    });
}

if (chrome.storage) {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace == "local") {
            for (key in changes) {
                var storageChange = changes[key];
                if (key != "cachedFeeds" && !key.startsWith("_")) {
                    console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old: "%s", New "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
                }

                // ignore tokenResponse if we are just updating the token, but do sync if it's added or removed
                if (key == "tokenResponses" && storageChange.oldValue && storageChange.newValue) {
                    // do nothing
                } else {
                    syncOptions.storageChanged({key:key});
                }
            }
        }
    });
}

if (chrome.idle.setDetectionInterval) {
    chrome.idle.setDetectionInterval(IDLE_DETECTION_INTERVAL);
}

if (chrome.idle.onStateChanged) {
    chrome.idle.onStateChanged.addListener(async newState => {
        if (newState == "active") {
            console.log("idle state change: " + newState);
            // re-toast grouped notifications if different from count when idle
            if (!globalThis.notificationsOpened) {
                notificationsOpened = await storage.get("notificationsOpened");
            }
            console.log("idle test: " + notificationsOpened.length + " " + notificationsOpenedCountWhenIdle);
            if (notificationsOpened.length >= 1 && notificationsOpenedCountWhenIdle >= 1) {
                console.log("new notif since idle re-toast notifs");
                const notificationsQueue = await storage.get("notificationsQueue");
                if (notificationsQueue.length >= 1) {
                    console.log("new notif since idle queue: " + notificationsQueue.length);
                    
                    const desktopNotification = await storage.get("desktopNotification");
                    if ((desktopNotification == "text" || desktopNotification == "rich") && await isGroupedNotificationsEnabled()) {
                        retoastNotifications();
                    } else if (desktopNotification == "popupWindow") {
                        const reminderWindowId = await storage.get("reminderWindowId");
                        chrome.windows.update(reminderWindowId, {focused:true});
                    }
                    // reset the count
                    notificationsOpenedCountWhenIdle = 0;
                }
            }
        }
    });
}

chrome.runtime.onMessage.addListener(/* DONT USE ASYNC HERE because of return true */ (message, sender, sendResponse) => {
    console.info("bg onMessage: " + message.command);
    (async function() {
        await initMisc();
        try {
            if (message.command == "updateSnoozer") {
                const snoozers = await getSnoozers();
                snoozers.some((snoozer, index) => {
                    if (snoozer.event.id == message.eventId) {
                        snoozer.time = parseDate(message.time);
                        return true;
                    }
                });
                await storage.set("snoozers", snoozers);
                sendResponse();
            } else if (message.command == "removeSnoozer") {
                const snoozers = await getSnoozers();
                snoozers.some(function(snoozer, index) {
                    if (snoozer.event.id == message.eventId) {
                        snoozers.splice(index, 1);
                        return true;
                    }
                });
                await storage.set("snoozers", snoozers);
                sendResponse();
            } else if (message.command == "pollServer") {
                const response = await pollServer(message.params);
                sendResponse(response);
            } else if (message.command == "fetchAllCalendarEvents") {
                message.params.startDate = parseDate(message.params.startDate);
                message.params.endDate = parseDate(message.params.endDate);

                const response = await fetchAllCalendarEvents(message.params);
                sendResponse(response);
            } else if (message.command == "generateActionLink") {
                const actionLinkObj = await generateActionLink("TEMPLATE", message.eventEntry);
                sendResponse({url: actionLinkObj.url + "?" + actionLinkObj.data});
            } else if (message.command == "snoozeNotifications") {
                console.log("snoozeNotifications", message);
                stopAllSounds();

                if (message.snoozeParams && message.snoozeParams.snoozeTime) {
                    message.snoozeParams.snoozeTime = parseDate(message.snoozeParams.snoozeTime);
                }
                restoreOnMessageNotificationObjects(message.notifications);

                await snoozeNotifications(message.snoozeParams, message.notifications);
                sendResponse();
            } else if (message.command == "closeNotifications") {
                console.log("closeNotifications", message);
                stopAllSounds();

                restoreOnMessageNotificationObjects(message.notifications);

                await closeNotifications(message.notifications);
                sendResponse();
            } else if (message.command == "closeNotificationsDelayed") {
                console.log("closeNotificationsDelayed", message);

                restoreOnMessageNotificationObjects(message.notifications);

                await closeNotificationsDelayed(message.notifications);
                sendResponse();
            } else if (message.command == "chromeTTS") {
                if (message.stop) {
                    ChromeTTS.stop();
                } else if (message.isSpeaking) {
                    sendResponse(ChromeTTS.isSpeaking());
                } else {
                    await ChromeTTS.queue(message.text);
                    sendResponse();
                }
            } else if (message.command == "forgottenReminder.execute") {
                forgottenReminder.execute(message.params);
                sendResponse(); // add this just to avoid ff error message of "onMessage listener's response handle went out of scope"
            } else if (message.command == "forgottenReminder.start") {
                forgottenReminder.start();
                sendResponse();
            } else if (message.command == "forgottenReminder.stop") {
                forgottenReminder.stop();
                sendResponse();
            } else if (message.command == "resetInitMiscWindowVars") {
                delete globalThis.initMiscPromise;
                sendResponse();
            } else if (typeof globalThis[message.command] == "function") { // map fn string commands directly to calling their fn
                console.log("onMessage: " + message.command);
                await globalThis[message.command](message.params);
                sendResponse();
            } else {
                console.warn("No matching command for " + message.command + " might be captured in other pages.");
            }
        } catch (error) {
            console.error(error);
            sendResponse({
                error: error.message ? error.message : error
            });
        }
    })();

    return true;
});

async function setUninstallUrl(email) {
	if (chrome.runtime.setUninstallURL) {
		var url = "https://jasonsavard.com/uninstalled?app=calendar";
		url += "&version=" + encodeURIComponent(chrome.runtime.getManifest().version);
		url += "&daysInstalled=" + await daysElapsedSinceFirstInstalled();
		if (email) {
            url += "&e=" + encodeURIComponent(btoa(email));
            storage.set("_uninstallEmail", email);
		}
		console.log("setUninstallUrl: " + url);
		chrome.runtime.setUninstallURL(url);
	}
}

if (chrome.runtime.onMessageExternal) {	
	chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
        (async function() {
            await initMisc();
            if (message.action == "turnOffDND") {
                setDND_off(true);
            } else if (message.action == "setDNDEndTime") {
                var endTime = new Date(message.endTime);
                setDNDEndTime(endTime, true);
            } else if (message.action == "createEvent") {
                if (isGmailExtension(sender.id)) {
                    var createEvent = JSON.parse(message.event);
                    
                    var eventEntry = new EventEntry();
                    console.log("createevent", message);
                    eventEntry.quickAdd = false;
                    eventEntry.allDay = createEvent.allDay;  
                    eventEntry.startTime = new Date(createEvent.startTime);
                    if (createEvent.endTime) {
                        eventEntry.endTime = new Date(createEvent.endTime);
                    }
                    eventEntry.summary = createEvent.summary;
                    eventEntry.source = createEvent.source;
                    //eventEntry.source = {title:title, url:info.linkUrl};
                    eventEntry.description = createEvent.description;
                    performActionOutsideOfPopup(eventEntry).then(response => {
                        console.log("createevent response", response);
                        sendResponse({success:true});
                    }).catch(error => {
                        console.log("create event error: " + error);
                        sendResponse({error:error});
                    });
                    //  return true to indicate I wish to send a response asynchronously (this will keep the message channel open to the other end until sendResponse is called)
                    return true;
                } else {
                    console.warn("Message not sent from a recognized extension: " + sender.id);
                }
            } else if (message.action == "generateActionLink") {
                // used externall from gmail extension
                var eventEntry = JSON.parse(message.eventEntry);
                var actionLinkObj = await generateActionLink("TEMPLATE", eventEntry);
                var url = actionLinkObj.url + "?" + actionLinkObj.data;
                sendResponse({url:url});
                return true;
            } else if (message.action == "getInfo") {
                sendResponse({installed:true});
            } else if (message.action == "version") {
                sendResponse(chrome.runtime.getManifest().version);
            }
        })();
	});
}

function restoreOnMessageNotificationObjects(notifications) {
    // convert stringified to objects
    notifications.forEach(notification => {
        if (!notification.test) {
            // do this to get reference of event
            let event = findEventByIdAndCalendar(notification.event, events);
            if (!event) {
                console.warn("user might have changed calendar of event after being snoozed, so let's just look for event id");
                event = findEventById(notification.event.id, events);
            }
            if (event) {
                notification.event = event;
            }
            //parseEventDates(notification.event);
        }
    });
}

async function init() {
    console.info("init");
    try {
        if (!localStorage.detectedChromeVersion) {
            localStorage.detectedChromeVersion = true;
            DetectClient.getChromeChannel().then(result => {
                if (result && result.channel != "stable") {
                    var title = "You are not using the stable channel of Chrome";
                    var body = "Click for more info. Bugs might occur, you can use this extension, however, for obvious reasons, these bugs and reviews will be ignored unless you can replicate them on stable channel of Chrome.";
                    var notification = new Notification(title, {body:body, icon:"images/icons/icon-48.png"});
                    notification.onclick = function () {
                        openUnstableWarningPage();
                        this.close();
                    };
                }
            });
        }
    } catch (e) {
        console.warn("error detecting chrome version: " + e);
    }

    storage.get("test_fetch").then(async testFetchResponse => {

        // set this initially in case we never get more details like email etc.
        setUninstallUrl();

        // START LEGACY

        // Jun 14 v22.2
        async function convertTokens(key) {
            const tokens = await storage.getRaw(key);
            if (tokens && Array.isArray(tokens)) { // different from Gmail ext/IndexedDB because everything returned is a string so only check for array
                console.log("converting tokens: " + key);
                await storage.setEncryptedObj(key, tokens);
            }
        }

        await convertTokens("tokenResponses");
        await convertTokens("tokenResponsesContacts");
        
        // END LAGACY

        chrome.browserAction.setBadgeBackgroundColor({color:[180, 180, 180, 255]});
        if (chrome.browserAction.setBadgeTextColor) {
            chrome.browserAction.setBadgeTextColor({color:"white"});
        }
        chrome.browserAction.setBadgeText({text : "⏳"});

        await resetTemporaryData();

        await initMisc();
        updateBadge();
        updateContextMenuItems();
        setOmniboxSuggestion();
        
        // Check current time and calculate the delay until next interval
        let delay = CHECK_EVENTS_INTERVAL - Date.now() % CHECK_EVENTS_INTERVAL;
        
        // if next minute is too close then wait for next minute
        if (delay < seconds(5)) {
            delay += minutes(1);
        }

        chrome.alarms.create(Alarms.EVERY_MINUTE, {when:Date.now() + delay, periodInMinutes: 1});
        chrome.alarms.create(Alarms.UPDATE_CONTEXT_MENU,    { periodInMinutes: 30, when: getNearestHalfHour().getTime() }); // = 30 minutes
        chrome.alarms.create(Alarms.UPDATE_CONTACTS,        { periodInMinutes: 60 * 4 }); // = 4 hours (used to be every 24 hours)
        chrome.alarms.create(Alarms.UPDATE_SKINS,           { periodInMinutes: 60 * 24 }); // = 24 hours (used to be every 48 hours)
        chrome.alarms.create(Alarms.UPDATE_UNINSTALL_URL,   { periodInMinutes: 60 * 24 }); // = 24 hours
            
        // collect stats on options
        const lastOptionStatsSent = await storage.get("lastOptionStatsSent");
        if (await daysElapsedSinceFirstInstalled() > 14 && (!lastOptionStatsSent || lastOptionStatsSent.diffInDays() <= -7)) { // start after 2 weeks to give people time to decide and then "every" 7 days after that (to keep up with changes over time)
            console.log("collecting optstats soon...")

            // only send after a timeout make sure ga stats loaded
            chrome.alarms.create(Alarms.COLLECT_STATS, {delayInMinutes: 2});
        }
        
        // must catch error here because it could just be regular timeout error that we don't want user re-installing extension for.
        return pollServer({source:"startup"}).catch(error => {
            console.error(error);
            showMessageNotification("Problem starting extension", "Open popup window to solve it", error);
        });
    }, error => { // Note: this is the 2nd parameter of a promise.then(resolve, reject)
        logError("init settings error: " + error, error);
        alert("The 'Checker Plus for Google Calendar' extension could not load because your browser profile is corrupt. You can fix and remove this message by clicking Ok and follow the instructions in the tab that will open, or just uninstall this extension.");
        openUrl("https://jasonsavard.com/wiki/Corrupt_browser_profile?source=calendar_corruption_detected");
    }).catch(error => {
        logError("starting extension: " + error, error);
        showMessageNotification("Problem starting extension", "Try re-installing the extension.", error);
    });
}

function offlineOnlineChanged(e) {
    console.log("offline/online detected", e);
    if (e.type == "online") {
        
    }
    updateBadge();
}

globalThis.addEventListener('offline', offlineOnlineChanged);
globalThis.addEventListener('online', offlineOnlineChanged);