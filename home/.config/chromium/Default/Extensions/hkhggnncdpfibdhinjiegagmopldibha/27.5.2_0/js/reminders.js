var windowOpenedTime = new Date();
var notifications;

var email;
let calendarMap;

/*
// patch for window not set to visible, only happens when Chrome is not in focus
if (document.visibilityState == "hidden") {
    // delay required or else it would close current Chrome window??
    setTimeout(async () => {
        const windowId = await storage.get("reminderWindowId");
        chrome.windows.update(windowId, {focused: false}, function(response) {
            chrome.windows.update(windowId, {focused: true}, function(response) {});
        });
    }, 100);
}
*/

async function closeWindow() {
    await storage.enable("_remindersWindowClosedByDismissingEvents");
	chrome.windows.getCurrent(function(thisWindow) {
		chrome.windows.remove(thisWindow.id);
	});
}

function dismissNotification(notifications, $event, allNotificationsFlag) {
    chrome.runtime.sendMessage({
        command: "closeNotifications",
        notifications: notifications
    });
    
	hideNotification($event, allNotificationsFlag);
}

async function snoozeAndClose(snoozeParams, allNotificationsFlag) {
    // must execute snoozenotifications in bg because window closes and stops exec
    const notifications = allNotificationsFlag ? getRemainingNotifications() : [snoozeParams.$event.data("notification")];
    console.log("snoozeAndClose", snoozeParams, notifications);

    // remove to continue avoid serialize issue with sendMessage;
    let $event = snoozeParams.$event;
    delete snoozeParams.$event;

    chrome.runtime.sendMessage({
        command: "snoozeNotifications",
        snoozeParams: snoozeParams,
        notifications: notifications
    });

	hideNotification($event, allNotificationsFlag);
}

function hideNotification($event, allNotificationsFlag) {
	
	var hidingAll = false;
	
	if (allNotificationsFlag) {
		$event = $(".event");
	}
	
	if ($(".event").length - $event.length == 0) {
		hidingAll = true;
	}
	
	var transitionType = hidingAll ? "fadeOut" : "slideUp";
	
	var hadVerticalScrollBar;
	if ($("#events")[0].scrollHeight > $("#events")[0].clientHeight) {
		hadVerticalScrollBar = true;
	}
	
	$event[transitionType]("fast", function() {
        $(this).remove();
        const eventsCount = $(".event").length;
		if (eventsCount == 0) {
			closeWindow();
		} else {
			var $firstEvent = $(".event").first();
			var $lastEvent = $(".event").last();
			console.log(document.body.clientHeight + " " + document.body.scrollHeight)
			if (hadVerticalScrollBar) {
				// has scroll bar do nothing
			} else {
				const resizeHeight = $lastEvent.height();
				chrome.windows.getCurrent(thisWindow => {

                    const windowParams = {};

                    windowParams.height = thisWindow.height - resizeHeight + 1;
                    
                    if (DetectClient.isWindows()) {
                        // only happens laptop so commented for now???
                        /*
                        windowParams.width = thisWindow.width - 2;
                        windowParams.left = thisWindow.left + 1;
                        windowParams.top = thisWindow.top;
                        if (!window.resizedOnce && eventsCount <= 1) {
                            windowParams.top += 1;
                        }
                        window.resizedOnce = true;
                        */
                    }

					chrome.windows.update(thisWindow.id, windowParams);
				});
			}
            
            /*
			var firstNotification = $firstEvent.data("notification");
			if (firstNotification) {
				document.title = getSummary(firstNotification.event);
            }
            */
        }
        
        const notifications = [];
        $(".event").each((index, eventNode) => {
            const notification = $(eventNode).data("notification")
            if (notification) {
                notifications.push(notification);
            }
        });
        generateWindowTitle(notifications);
	});
}

function get$Event(o) {
	return o.closest(".event");
}

function get$EventById(id) {
	var $event;
	$(".event").each(function(index, event) {
		var notification = $(this).data("notification");
		if (notification.event.id == id) {
			$event = $(this);
			return false;
		}
	});
	return $event;
}

function updateTimeElapsed() {
    const dateOptions = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hourCycle: getHourCycle()
    };

	$(".event").each(async function(index, event) {
		const notification = $(this).data("notification");
		const timeElapsedMsg = await getTimeElapsed(notification.event);
		
		var $timeElapsed = $(this).find(".timeElapsed");
		if (timeElapsedMsg) {
            let titleStr;
            if (notification.event.allDay) {
                titleStr = notification.event.startTime.toLocaleDateStringJ();
            } else {
                titleStr = notification.event.startTime.toLocaleTimeStringJ(true);
            }

            titleStr += `\n\n${getMessage("notifications")}:`;
            const response = generateReminderTimes(notification.event);
            response.reminderTimes.forEach(reminderTime => {
                titleStr += `\n${reminderTime}`;
            });

            $timeElapsed
                .text(timeElapsedMsg)
                .attr("title", titleStr)
            ;
		}
		
		if (notification.event.startTime.diffInMinutes() <= 30) {
			$(this).find("[snoozeInMinutes='-30']").hide();
		}
		if (notification.event.startTime.diffInMinutes() <= 15) {
			$(this).find("[snoozeInMinutes='-15']").hide();
		}
		if (notification.event.startTime.diffInMinutes() <= 10) {
			$(this).find("[snoozeInMinutes='-10']").hide();
		}
		if (notification.event.startTime.diffInMinutes() <= 5) {
			$(this).find("[snoozeInMinutes='-5']").hide();
        }
        if (notification.event.startTime.diffInMinutes() <= 2) {
			$(this).find("[snoozeInMinutes='-2']").hide();
		}
		if (notification.event.startTime.diffInMinutes() <= 1) {
			$(this).find("[snoozeInMinutes='-1']").hide();
		}
		if (notification.event.startTime.diffInMinutes() <= 0) {
			$(this).find("[snoozeInMinutes='0']").hide();
        }
        

        if ($(this).find(".snooze-before-wrapper").height() == 0) {
            $(this).addClass("no-snooze-before");
        } else {
            $(this).removeClass("no-snooze-before");
        }
    });
}

function dismissFirstEvent() {
	$("#events .dismiss").first().click();
}

document.addEventListener("keydown", function(e) {
    console.log("keydown", e);
    storage.get("disableKeys").then(disableKeys => {
        if (!disableKeys) {
            if (e.key === "Escape") {
                storage.get("reminderWindowId").then(reminderWindowId => {
                    if (reminderWindowId) {
                        chrome.windows.update(reminderWindowId, {state:"minimized"});
                    }
                })
            } else if (e.key === "d") {
                // add buffer to avoid accidental typing dismisals
                const DELAY_IN_MILLIS = 500;
                if (windowOpenedTime.diffInMillis() < -DELAY_IN_MILLIS) {
                    dismissFirstEvent();
                }
            }
        }
    });
});

$(window).blur(() => {
	if ($("#events .event").length == 1 && $("#header").is(":visible")) {
		let headerHeight = $("#header").height();
		$("#header").hide();
		window.resizeBy(0, -(headerHeight));
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    (async function() {
        if (message.action == "dismissAll") {
            $("#dismissAll").click();
        } else if (message.action == "removeNotifications") {
            const events = await getEvents();
            // remove any deleted events
            message.notifications.forEach(function(notification) {
                var event = notification.event;
                var foundEvent = findEventById(event.id, events);
                if (!foundEvent) {
                    console.log("remove event from notifications because it was probably deleted", event);
                    const $event = get$EventById(event.id);
                    if ($event) {
                        hideNotification($event);
                    }
                }
            });
        }
    })();
});

function getRemainingNotifications() {
	var remainingNotifications = [];
	
	var $allEvents = $(".event");
	$allEvents.each(function() {
		remainingNotifications.push( $(this).data("notification") );
	});
	
	return remainingNotifications;
}

function resizeToMinimumHeight(height) {
	chrome.windows.getCurrent(function(thisWindow) {
		if (height > thisWindow.height) {
			chrome.windows.update(thisWindow.id, {height:height});
		}
	});
}

function generateWindowTitle(notifications) {
    const titles = notifications.map(notification => getSummary(notification.event));
    
    if ("Intl" in window && Intl.ListFormat) {
        const formatter = new Intl.ListFormat(locale, { style: 'short', type: 'unit' });
        document.title = formatter.format(titles);
    } else {
        document.title = titles.join(", ");
    }
}

function setDefaultSnoozeTime($snooze, snoozeValue) {
    let timePeriodSymbol;
    let title;
    let snoozeValueToDisplay;

    if (snoozeValue) {
        if (snoozeValue.indexOf && snoozeValue.indexOf("d") != -1) {
            snoozeValue = snoozeValue.replace("d", "");
            snoozeValueToDisplay = snoozeValue;
            timePeriodSymbol = TimePeriodSymbol.DAY;
            title = getMessage(snoozeValue == 1 ? "Xday" : "Xdays", snoozeValue);
        } else if (snoozeValue < 60) {
            snoozeValueToDisplay = snoozeValue;
            timePeriodSymbol = TimePeriodSymbol.MINUTE;
            title = getMessage(snoozeValue == 1 || snoozeValue == -1 ? "Xminute" : "Xminutes", snoozeValue);
        } else {
            snoozeValueToDisplay = snoozeValue / 60;
            timePeriodSymbol = TimePeriodSymbol.HOUR;
            title = getMessage(snoozeValueToDisplay == 1 ? "Xhour" : "Xhours", snoozeValueToDisplay);
        }
    }

    const $snoozeText = $snooze.find(".text");
    $snooze.data("defaultSnoozeTime", snoozeValue);
    $snooze.data("defaultSnoozeTimePeriod", timePeriodSymbol);
    if (snoozeValue) {
        $snooze.addClass("has-text");
        $snooze.attr("title", `${getMessage("snooze")} ${title}`);
        $snoozeText.text(snoozeValueToDisplay + getMessage(timePeriodSymbol));
    } else {
        $snooze.removeClass("has-text");
        $snooze.attr("title", "");
        $snoozeText.text("");
    }
}

$(document).ready(() => {

    (async () => {

        await storage.iniStorageCache();
        
        await initUI();

        email = await storage.get("email");
        calendarMap = await initCalendarMap();

        // patch: reload window because sometimes polymer code would not load and the buttons were not showing - refer to May 16th emails from mecouture
        let POLYMER_PATCH_URL_PARAM = "reloadedForPolymerPatch";
        if (!location.href.includes(POLYMER_PATCH_URL_PARAM)) {
            polymerPromise.then(() => {
                let $firstVisibleButton = $("paper-icon-button:visible").first();
                // issue identified by visible button having no width
                if ($firstVisibleButton.length && $firstVisibleButton.width() == 0) {
                    setTimeout(() => {
                        location.href = setUrlParam(location.href, POLYMER_PATCH_URL_PARAM, "true");
                    }, 500);
                    sendGA('reminders', "reloadedForPolymerPatch");
                }
            });
        }
        
        if (await getHideDeleteFlag()) {
            $("body").addClass("hideDelete");
        } else {
            $("body").removeClass("hideDelete");
        }
        
        notifications = await storage.get("_reminderWindowNotifications");
        
        if (await shouldShowReducedDonationMsg(true)) {
            $("#newsNotificationReducedDonationMessage").show();
            $("#newsNotification")
                .removeAttr("hidden")
                .click(function() {
                    openUrl("contribute.html?ref=reducedDonationFromReminders");
                })
            ;
        }
        
        if (await hasRemindersHeader(notifications)) {
            // commented because it "sometimes" wouldn't show??? so using class instead
            //$("#header").show();
            if (notifications.length <= 1) {
                $("#headerButtons").hide();
            }
            
            $("#header").addClass("visible");
        }
        
        notifications.sort((a, b) => {
            if (a.recent && !b.recent) {
                return -1;
            } else if (!a.recent && b.recent) {
                return +1;
            } else {
                if (!a.event.allDay && b.event.allDay) {
                    return -1;
                } else if (a.event.allDay && !b.event.allDay) {
                    return +1;
                } else {
                    if (a.event.startTime.getTime() > b.event.startTime.getTime()) {
                        return -1;
                    } else {
                        return +1;
                    }
                }
            }
        });
        
        var SNOOZE_CONTAINER_SELECTOR = "#header, .event";

        $("body").on("click", ".snooze", function() {
            const defaultSnoozeTime = $(this).data("defaultSnoozeTime");
            if (defaultSnoozeTime) {
                let attribute;
                if ($(this).data("defaultSnoozeTimePeriod") == TimePeriodSymbol.DAY) {
                    attribute = "snoozeInDays";
                } else {
                    attribute = "snoozeInMinutes";
                }
                const button = $(this).closest(SNOOZE_CONTAINER_SELECTOR).find(`paper-button[${attribute}='${defaultSnoozeTime}']`);
                if (button.length) {
                    button.click();
                } else {
                    customShowError("Snooze time does not have a corresponding button");
                }
            }
        });

        $("body").on("mouseenter", ".snooze", async function() {
            const $snooze = $(this);
            $snooze.closest(SNOOZE_CONTAINER_SELECTOR).addClass("snoozeButtonsVisible");

            const notification = $snooze.closest(".event").data("notification");
            const defaultSnoozeBeforeTime = await storage.get("defaultSnoozeBeforeTime");
            const defaultSnoozeTime = await storage.get("defaultSnoozeTime");

            if (notification) {
                const diffInMinutes = new Date().diffInMinutes(notification.event.startTime);
                
                // event has passed
                if (diffInMinutes > 0) {
                    setDefaultSnoozeTime($snooze, defaultSnoozeTime);
                } else { // event is coming up
                    if (!notification.event.allDay && diffInMinutes <= defaultSnoozeBeforeTime) {
                        setDefaultSnoozeTime($snooze, defaultSnoozeBeforeTime);
                    } else {
                        setDefaultSnoozeTime($snooze, defaultSnoozeTime);
                    }
                }
            } else {
                // possibly snooze all
                setDefaultSnoozeTime($snooze, defaultSnoozeTime);
            }
        });

        $("body").on("mouseleave", ".snoozeButtons", function() {
            $(this).closest(SNOOZE_CONTAINER_SELECTOR).removeClass("snoozeButtonsVisible");
        });

        $("body").on("mouseleave", SNOOZE_CONTAINER_SELECTOR, function() {
            $(this).removeClass("snoozeButtonsVisible");
        });
        
        $("body").on("mouseenter", ".delete, .dismiss", function() {
            $(this).closest(SNOOZE_CONTAINER_SELECTOR).removeClass("snoozeButtonsVisible");
        });

        $("#settings").click(function() {
            openUrl(chrome.runtime.getURL("options.html#notifications"), {urlToFind:chrome.runtime.getURL("options.html")});
        });
        
        insertScript("js/custom-icons.js", "custom-icons"); // used to be in reminder.html but didn't work in FF ... <link id="custom-icons" rel="import" href="custom-icons.html">
        $("#custom-icons").on("load", async function() {
            var $events = $("#events");
            
            if ($(window).height() != 0 && await hasRemindersHeader(notifications)) {
                //$events.height($(window).height() - $("#header").outerHeight());
                //if (notifications.length > ReminderWindow.MAX_NOTIFICATIONS) { // had scrollbar issue when https://jasonsavard.com/forum/discussion/comment/21025#Comment_21025
                    $events.height(Math.min(ReminderWindow.MAX_NOTIFICATIONS, notifications.length) * ReminderWindow.NOTIFICATION_HEIGHT);
                //}
            }
            
            // ff patch for empty paper-icon-button: seems when had 3+ test events and calling .clone() on eventTemplate below it was creating the issue - so added a 1ms timeout
            await sleep(1);

            const cachedFeeds = await storage.get("cachedFeeds");
            const arrayOfCalendars = await getArrayOfCalendars();
            const showEventIcons = await storage.get("showEventIcons");

            let documentTitleSet = false;
            await asyncForEach(notifications, async (notificationOpened, index) => {
                
                var event = notificationOpened.event;
                
                var $event = $(".eventTemplate").clone();
                $event
                    .removeClass("eventTemplate")
                    .addClass("event")
                    .data("notification", notificationOpened)
                ;
                initMessages($event.find("*"));

                if (showEventIcons) {
                    setEventIcon({
                        event: event,
                        $eventIcon: $event.find(".eventIcon"),
                        cachedFeeds: cachedFeeds,
                        arrayOfCalendars: arrayOfCalendars
                    });
                }
                
                var eventNotificationDetails = await getEventNotificationDetails(event);
                const summary = eventNotificationDetails.title;
                var title;
                var sourceUrl;
                
                var eventSource = getEventSource(event);
                var $sourceWrapper = $event.find(".sourceWrapper");
                let sourceVisible = true;
                
                if (eventSource) {
                    // if event source has same title as event then let's use the link url instead
                    if (summary == eventSource.title) {
                        title = eventSource.url;
                    } else {
                        title = eventSource.title;
                    }
                    sourceUrl = eventSource.url;
                    
                    if (event.extendedProperties && event.extendedProperties.private && event.extendedProperties.private.favIconUrl) {
                        $sourceWrapper.find(".linkImage")
                            .removeAttr("icon")
                            .attr("src", event.extendedProperties.private.favIconUrl)
                        ;
                    } else {
                        $sourceWrapper.find(".linkImageWrapper").hide();
                    }
                }
                
                // source
                if (title) {
                    $sourceWrapper.find(".link")
                        .text(title)
                        .attr("title", sourceUrl)
                        .attr("href", sourceUrl)
                    ;
                } else {
                    $sourceWrapper.hide();
                    sourceVisible = false;
                }

                // location
                var $locationWrapper = $event.find(".locationWrapper");
                let locationVisible = true;

                if (event.location) {
                    title = event.location;
                    locationUrl = generateLocationUrl(event);
                    if (sourceUrl == locationUrl) {
                        $locationWrapper.hide();
                        locationVisible = false;
                    } else {
                        $locationWrapper.find(".link")
                            .text(title)
                            .attr("title", locationUrl)
                            .attr("href", locationUrl)
                        ;
                    }
                } else {
                    $locationWrapper.hide();
                    locationVisible = false;
                }

                // too much, so remove one item, refer: https://bitbucket.org/jasonsav/checker-plus-for-google-calendar/issues/156/better-reminders-spacing
                if (summary.length > 25 && sourceVisible && locationVisible) {
                    $sourceWrapper.hide();
                }
                
                // video
                const $videoWrapper = $event.find(".videoWrapper");
                if (event.hangoutLink || event.conferenceData?.conferenceSolution) {

                    let video;
                    let joinVideoStr;

                    if (event.conferenceData?.conferenceSolution) {
                        $videoWrapper.find(".linkImage")
                            .removeAttr("icon")
                            .attr("src", event.conferenceData.conferenceSolution.iconUri)
                        ;

                        video = event.conferenceData.entryPoints.find(entryPoint => entryPoint.entryPointType == "video");

                        if (event.conferenceData.conferenceSolution.name) {
                            joinVideoStr = getMessage("joinWithX", event.conferenceData.conferenceSolution.name);
                        }
                    }

                    if (!joinVideoStr) {
                        joinVideoStr = getMessage("joinVideoCall");
                    }

                    const videoLink = $videoWrapper.find(".link");

                    videoLink
                        .text(joinVideoStr)
                        .attr("href", event.hangoutLink ?? video?.uri)
                        .on("click", async () => {
                            if (await storage.get("dismissEventAfterClickingJoinVideo")) {
                                dismissNotification([notificationOpened], $event);
                            }
                        })
                    ;
                } else {
                    $videoWrapper.hide();
                }
                
                if (notifications.length == 1 && eventNotificationDetails.calendarName) {
                    document.title = `${summary} (${eventNotificationDetails.calendarName})`;
                    documentTitleSet = true;
                }
                
                var eventHoverTitle = summary;
                if (event.description) {
                    eventHoverTitle += `\n\n${event.description}`;
                }
                
                const eventColor = getEventColors({
                    event: event,
                    darkenColorFlag: true,
                    cachedFeeds: cachedFeeds,
                    arrayOfCalendars: arrayOfCalendars
                });

                $event.find(".title")
                    .text(summary)
                    .css("color", eventColor)
                    .attr("title", eventHoverTitle)
                    .click(function(e) {
                        console.log("event", e);
                        if (isCtrlPressed(e) || event.button == 1) {
                            chrome.tabs.create({url:getEventUrl(event), active:false});
                        } else {
                            openUrl(getEventUrl(event), {urlToFind:event.id});
                        }
                        sendGA('reminders', "title");
                    })
                ;
                
                if (eventNotificationDetails.calendarName) {
                    $event.find(".calendar-name")
                        .text(`(${eventNotificationDetails.calendarName})`)
                        .css("color", eventColor)
                        .unhide()
                    ;
                } else {
                    $event.find(".calendar-name").hidden();
                }
                
                // init snooze buttons
                if (event.allDay) {
                    $event.find(".snoozeBefore").hide();
                }
                
                if (event.recurringEventId) {
                    $event.addClass("repeatingEvent");
                    $event.find(".repeating")
                        .click(function() {
                            alert("This is a recurring event")
                        })
                        .show()
                    ;
                    
                    $event.find(".delete").hide();
                }
                
                $event.find(".delete").click({notification:notificationOpened}, async e => {
                    sendGA('reminders', "delete");
                    if (event.test) {
                        // do nothing - just dismiss
                        dismissNotification([e.data.notification], $event);
                    } else {
                        // don't worry about recurring events - we don't display delete buttons for them
                        sendMessageToBG("deleteEvent", event);
                        dismissNotification([e.data.notification], $event);
                    }
                });
                
                $event.find(".dismiss")
                    .click({notification:notificationOpened}, function(e) {
                        sendGA('reminders', "dismiss", "individual", 1);
                        
                        dismissNotification([e.data.notification], $event);
                    })
                ;
                
                $events.append($event);
                $event.removeAttr("hidden");
            });

            if (!documentTitleSet) {
                generateWindowTitle(notifications);
            }

            updateTimeElapsed();

            setInterval(function() {
                updateTimeElapsed();
            }, minutes(1));

            $("paper-button[snoozeInDays]").each(function() {
                let snoozeInDays = $(this).attr("snoozeInDays");
                let snoozeDate = new Date().addDays(snoozeInDays);
                let tooltipStr;
                if (snoozeInDays == "7") {
                    tooltipStr = snoozeDate.toLocaleDateStringJ();
                } else {
                    tooltipStr = snoozeDate.toLocaleDateString(locale, {
                        weekday: 'long'
                    });
                }
                $(this).find("paper-tooltip").text(tooltipStr);
            });

            if (!await storage.get("donationClicked")) {
                $("paper-button[snoozeInDays], .more").each(function() {
                    $(this)
                        .addClass("mustDonate")
                        .attr("title", getMessage("donationRequired"))
                    ;
                });
            }

            $("paper-button[snoozeInMinutes], paper-button[snoozeInDays]").click(async function() {
                let $event;
                const snoozeAllFlag = $(this).closest("#header").length;
                if (!snoozeAllFlag) {
                    $event = get$Event($(this));
                }
                const snoozeParams = {
                    $event: $event,
                    inMinutes: $(this).attr("snoozeInMinutes"),
                    inDays: $(this).attr("snoozeInDays")
                };

                if (snoozeParams.inDays && !await storage.get("donationClicked")) {
                    var $dialog = initTemplate("contributeDialogTemplate");
                    openDialog($dialog).then(function(response) {
                        if (response == "cancel") {
                            openUrl("contribute.html?action=snooze");
                        }
                    });
                } else {
                    await snoozeAndClose(snoozeParams, snoozeAllFlag);
                    if (snoozeParams.inMinutes) {
                        sendGA('reminders', "snooze", `minutes_${snoozeParams.inMinutes}`, 1);
                    } else {
                        sendGA('reminders', "snooze", `days_${snoozeParams.inDays}`, 1);
                    }
                }
            });

            $(".more").click(async function() {
                if (await storage.get("donationClicked")) {
                    var $event = get$Event($(this));
                    resizeToMinimumHeight(330);
                    $("body").addClass("dateTimePickerVisible");
                    $("#dateTimeSnoozeWrapper").data("$event", $event);
                } else {
                    var $dialog = initTemplate("contributeDialogTemplate");
                    openDialog($dialog).then(function(response) {
                        if (response == "cancel") {
                            openUrl("contribute.html?action=snoozeMore");
                        }
                    });
                }
            });

            $(".closeButton").click(function() {
                $("body").removeClass("dateTimePickerVisible");
            });

            $("#dateTimeSnoozeButton").click(async () => {
                if (await donationClicked("snoozeDateTime")) {

                    if (!$("#dateSnooze").val().trim() && !$("#timeSnooze").val().trim()) {
                        alert("Must enter either a date and/or time!");
                        return;
                    }

                    var snoozeParams = {
                        $event: $("#dateTimeSnoozeWrapper").data("$event")
                    };

                    var snoozeTime = $("#dateSnooze").datepicker("getDate");
                    if (!snoozeTime) {
                        snoozeTime = today();
                    }

                    if ($("#timeSnooze").val().trim()) {
                        var time;

                        // see if ie. 24min was entered
                        var eventEntry = await getEventEntryFromQuickAddText($("#timeSnooze").val());
                        if (eventEntry.startTime) {
                            time = eventEntry.startTime;
                        } else { // else get time from dropdown
                            time = $('#timeSnooze').timepicker('getTime');
                        }
                        snoozeTime.setHours(time.getHours());
                        snoozeTime.setMinutes(time.getMinutes());
                        snoozeTime.setSeconds(0, 0);
                        
                        snoozeParams.snoozeTime = snoozeTime;
                    } else {
                        resetTime(snoozeTime);
                        snoozeParams.inDays = snoozeTime.diffInDaysForHumans();
                    }

                    await snoozeAndClose(snoozeParams, $("#dateTimeSnoozeButton").hasClass("ctrlKey"));

                    $("body").removeClass("dateTimePickerVisible");
                    $("#dateSnooze").datepicker("setDate", null);

                    sendGA('reminders', "more");
                }
            });

            var datePickerParams = await generateDatePickerParams();

            if ($("#dateSnooze").datepicker) {
                $("#dateSnooze").datepicker(datePickerParams);
            }

            var timePickerParams = await generateTimePickerParams();
            if ($('#timeSnooze').timepicker) {
                $('#timeSnooze').timepicker(timePickerParams);
            }
            $('#timeSnooze').off("keydown").on("keydown", function(e) {
                console.log("timesnooze", e)
                if (e.key == "Enter") {
                    console.log("enter");
                    e.preventDefault();
                    $('#timeSnooze').timepicker('hide');
                    $("#dateTimeSnoozeButton").click();
                    return false;
                } else if (e.key == "Escape") {
                    $('#timeSnooze').timepicker('hide');
                    return false;
                }
            });

            $("#dismissAll").click(function() {

                var notifications = getRemainingNotifications();

                // cpu intensive so let's delay the execution til after we close the window
                chrome.runtime.sendMessage({
                    command: "closeNotificationsDelayed",
                    notifications: notifications
                });

                sendGA('reminders', "dismiss", "dismissAll");
                closeWindow();
            });

            if (getUrlValue(location.href, "closeWindowGuide")) {
                var $dialog = initTemplate("closeWindowDialogTemplate");
                openDialog($dialog);
            }

            console.log("remove cache")
            storage.clearCache();
        });

    })();
});