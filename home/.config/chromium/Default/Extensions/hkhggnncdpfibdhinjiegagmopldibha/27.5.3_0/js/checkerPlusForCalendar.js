// Copyright Jason Savard

var ITEM_ID = "calendar";

var TEST_REDUCED_DONATION = false;
var TEST_SHOW_EXTRA_FEATURE = false;

const CHECK_EVENTS_INTERVAL = seconds(60); // MUST match alarm EVERY_MINUTE
const POLLING_INTERVAL_IN_HOURS = 4; // before 1.5;
const POLLING_INTERVAL_IN_HOURS_FOR_LESS_IMPORTANT = POLLING_INTERVAL_IN_HOURS + 1;

const GROUPED_NOTIFICATION_ID = "GROUPED_NOTIFICATION";
const MENU_ITEM_CONTEXTS = ["page", "frame", "link", "editable", "image", "video", "audio"];

const BadgeColor = {
    RED: [208, 0, 24, 255],
    BLUE: [0, 24, 208, 255],
    GRAY: [150, 150, 150, 255]
}

const ContextMenu = {
    OPEN_CALENDAR: "OPEN_CALENDAR",
    REFRESH: "REFRESH",
    OPTIONS: "OPTIONS",
    DND_MENU: "dndMenu",
    DND_OFF: "dndOff",
    DND_30_MIN: "dnd30min",
    DND_1_HOUR: "dnd1hour",
    DND_2_HOURS: "dnd2hours",
    DND_4_HOURS: "dnd4hours",
    DND_TODAY: "dndToday",
    DND_INDEFINITELY: "dndIndefinitely",
    QUICK_ADD: "quickAdd"
}

const InputSource = {
    QUICK_ADD: "QUICK_ADD",
    OMNIBOX: "OMNIBOX",
    CONTEXT_MENU: "CONTEXT_MENU",
    SHORTCUT: "SHORTCUT"
}

var Origins = {};
Origins.FACEBOOK = "https://www.facebook.com/"; // v2 Only used for Firefox now, v1 MUST MATCH manifest > optional_permissions
Origins.OPEN_EXISTING_TABS = "https://calendar.google.com/"; // MUST MATCH manifest > optional_permissions

var ExtensionId = {};
if (DetectClient.isFirefox()) {
	ExtensionId.Gmail = "checkerplusforgmail@jasonsavard.com";
    ExtensionId.Calendar = "checkerplusforgooglecalendar@jasonsavard.com";
} else if (DetectClient.isEdge()) {
	ExtensionId.Gmail = "dkjkomkbjefdadfgbgdfgnpbmhmppiaa";
	ExtensionId.Calendar = "fbongfbliechkeaegkjfehhimpenoani";
	ExtensionId.LocalGmail = "nkcdjlofpfodhpjihpbicmledhecfldf";
	ExtensionId.LocalCalendar = "encfnanpmgmgnblfjgjfbleegminpphg";
} else {
	ExtensionId.Gmail = "oeopbcgkkoapgobdbedcemjljbihmemj";
	ExtensionId.Calendar = "hkhggnncdpfibdhinjiegagmopldibha";
	ExtensionId.LocalGmail = "nkcdjlofpfodhpjihpbicmledhecfldf";
	ExtensionId.LocalCalendar = "encfnanpmgmgnblfjgjfbleegminpphg";
}

const CalendarView = {
    AGENDA: "basicDay",
    LIST_WEEK: "customListWeek",
    DAY: "agendaDay",
    WEEK: "agendaWeek",
    MONTH: "month",
    CUSTOM: "custom",
};

function getFCViewName(viewName) {
    let fcViewName;
    if (viewName == CalendarView.LIST_WEEK) {
        fcViewName = CalendarView.LIST_WEEK;
    } else if (viewName == CalendarView.DAY) {
        fcViewName = "timeGridDay";
    } else if (viewName == CalendarView.WEEK) {
        fcViewName = "timeGridWeek";
    } else if (viewName == CalendarView.MONTH) {
        fcViewName = "dayGridMonth";
    } else if (viewName == CalendarView.CUSTOM) {
        fcViewName = CalendarView.CUSTOM;
    } else {
        fcViewName = viewName;
    }
    return fcViewName;
}

const AttendingResponseStatus = {
    ACCEPTED: "accepted",
    TENTATIVE: "tentative",
    DECLINED: "declined",
    NEEDS_ACTION: "needsAction"
}

const Scopes = {
    CALENDARS_READ_WRITE:   "https://www.googleapis.com/auth/calendar",
    CALENDARS_READ:         "https://www.googleapis.com/auth/calendar.readonly",
    EVENTS_READ_WRITE:      "https://www.googleapis.com/auth/calendar.events",
    CONTACTS_READ:          "https://www.googleapis.com/auth/contacts.readonly",
    CONTACTS_OTHER_READ:    "https://www.googleapis.com/auth/contacts.other.readonly",
    USERINFO_PROFILE:       "https://www.googleapis.com/auth/userinfo.profile",
    TASKS_READ_WRITE:       "https://www.googleapis.com/auth/tasks",
}

const LIST_VIEW_WEEKS = 4;

var NotificationType = {};
NotificationType.ADDED_OUTSIDE = "ADDED_OUTSIDE";

var JError = {};
JError.DID_NOT_CONTRIBUTE = "DID_NOT_CONTRIBUTE";
JError.NO_TOKEN = "NO_TOKEN";
JError.NETWORK_ERROR = "NETWORK_ERROR";

var BrowserButtonAction = {};
BrowserButtonAction.POPUP = "popup";
BrowserButtonAction.POPUP_DETACHED = "popupDetached";
BrowserButtonAction.CHECKER_PLUS_TAB = "checkerPlusTab";
BrowserButtonAction.GOOGLE_CALENDAR = "googleCalendar";

var GOOGLE_API_DATE_ONLY_FORMAT_STR = "yyyy-mm-dd";

var GCM_SENDER_ID = "74919836968";
var GCM_SOURCE = "gcm source";

var WATCH_CALENDAR_EVENTS_ALARM_PREFIX = "watchCalendarEvents_";
var WATCH_EXPIRATION_IN_DAYS = 14;

var MAX_POSSIBLE_DAYS_FROM_NEXT_MONTH = 7;

var DAYS_TO_REMOVE_OLD_EVENTS = 44;

const MAX_RESULTS_FOR_EVENTS = 2500;

var Alarms = {
    EVERY_MINUTE:                           "everyMinute",
    WATCH_CALENDAR_SETTINGS:                "watchCalendarSettings",
    WATCH_CALENDAR_LIST:                    "watchCalendarList",
    UPDATE_CONTACTS:                        "updateContacts",
    UPDATE_SKINS:                           "updateSkins",
    EXTENSION_UPDATED_SYNC:                 "extensionUpdatedSync",
    SYNC_DATA:                              "syncData",
    UPDATE_UNINSTALL_URL:                   "updateUninstallUrl",
    UPDATE_CONTEXT_MENU:                    "updateContextMenu",
    FORGOTTEN_REMINDER:                     "forgottenReminder",
    POLL_SERVER:                            "pollServer",
    POLL_SERVER_FROM_FCM_UPDATE:            "pollServerFromFCMUpdate",
    POLL_SERVER_AFTER_RIGHT_CLICK_SET_DATE: "pollServerAfterRightClickSetDate",
    OPEN_REMINDERS:                         "openReminders",
    COLLECT_STATS:                          "collectStats"
};

var SendNotificationsAction = {};
SendNotificationsAction.CREATE = "create";
SendNotificationsAction.EDIT = "edit";
SendNotificationsAction.DELETE = "delete";

var ReminderWindow = {};
ReminderWindow.BOTTOM_BORDER = 1;
ReminderWindow.DISMISS_ALL_HEIGHT = 40 + ReminderWindow.BOTTOM_BORDER; // header for snooze/dismiss all = 40 + 1 bottom border
ReminderWindow.NOTIFICATION_HEIGHT = 100 + ReminderWindow.BOTTOM_BORDER; // 100 + 1 for bottom-border
ReminderWindow.MARGIN = 0;
ReminderWindow.MAX_NOTIFICATIONS = 4;

var UserNoticeSchedule = {};
UserNoticeSchedule.DAYS_BEFORE_SHOWING_EXTRA_FEATURE = 3;
UserNoticeSchedule.DURATION_FOR_SHOWING_EXTRA_FEATURE = 2;
UserNoticeSchedule.DAYS_BEFORE_SHOWING_TRY_MY_OTHER_EXTENSION = 4;
UserNoticeSchedule.DURATION_FOR_SHOWING_TRY_MY_OTHER_EXTENSION = 2;
UserNoticeSchedule.DAYS_BEFORE_SHOWING_FOLLOW_ME = 7;
UserNoticeSchedule.DURATION_FOR_SHOWING_FOLLOW_ME = 3;
UserNoticeSchedule.DAYS_BEFORE_ELIGIBLE_FOR_REDUCED_DONATION = 14;
UserNoticeSchedule.DAYS_BEFORE_ELIGIBLE_FOR_REDUCED_DONATION_AGAIN = 60; // 2 months
UserNoticeSchedule.DURATION_FOR_SHOWING_REDUCED_DONATION = 7;

// jsonp backup way...
const CONTACTS_API_URL_PARAMS = "?v=3.0";
// preferred way...
const CONTACTS_API_HEADER = {
	"GData-Version": "3.0"
};

const CONTACTS_STORAGE_VERSION = "3";

const STORAGE_DEFAULTS = {
	"browserButtonAction": "popup",		
	"cachedFeeds": {},
	"cachedFeedsDetails": {},
    "eventsShown": [],
    "notificationsQueue": [],
    "notificationsOpened": [],
	"tokenResponses": [],
	"selectedCalendars": {},
	"excludedCalendars": {
        "p#weather@group.v.calendar.google.com": true
    },
	"notificationSound": "ding.ogg",
	"notificationSoundVolume": 100,
	"voiceNotificationOnlyIfIdleInterval": 15,
	"voiceSoundVolume": 100,
	"desktopNotification": "popupWindow",
	"calendarView": CalendarView.MONTH,
	"language": getPreferredLanguage(),
	"pitch": 1,
	"rate": 1,
	"notificationGrouping": "groupNotifications",
	"showNotificationDuration": "never",
	"pendingNotificationsInterval": 15,
	"notificationButton1": "hours_1",
	"notificationButton2": "location|hangout",
	"showCalendarInNotification": "onlyNonPrimary",
	"showContextMenuItem": true,
	"maxDaysAhead": 2,
	"weeksInMonth": "auto",
	"customView": "4",
	"slotDuration": 30,
	"hideMorningHoursBefore": "0",
	"hideNightHoursAfter": "24",
	"badgeIcon": "default",
	"autosizePopupWindow": false,
	"showEventTimeOnBadge": true,
	"showMinutesLeftInBadge": true,
	"showDaysLeftInBadge": true,
	"showDayOnBadgeExceptWhenMinutesLeft": true,
	"showButtonTooltip": true,
	"excludeHiddenCalendarsFromButton": true,
	"showSnoozedEvents": true,
	"weekNumberCalculation": "ISO",
	"detachedPopupWidth": 1000,
	"detachedPopupHeight": 800,
	"snoozers": [],
	"calendarSettings": {},
	"skins": [],
	"skinsEnabled": true,
	"customSkin": {id:"customSkin"},
	"useEventColors": true,
    "defaultDate": 0,
    "firstDay": "",
    "_lastPollTime": new Date(1),
    "_lastCheckEventsTime": new Date(1),
    "_lastNotificationShownDate": new Date(),
    "_lastCalendarModificationByExtension": new Date(1),
    "_lastBadgeDate": new Date(),
    "_watchRetries": {},
    "_firstLoad" : true,
    "defaultSnoozeBeforeTime": -5,
    "defaultSnoozeTime": 5,
    "showEventIcons": true,
    "detectTime" : true,
    "maximizeVisibleEventsInADay": true,
    "hideDelete": true,
    "tasks-bg-color": "rgb(244, 81, 30)"
};

const DEFAULT_SETTINGS_ALLOWED_OFF = ["notificationSound"];

const STORAGE_ITEMS_TO_COMPRESS = {
	"cachedFeeds": true
}

const SkinIds = {
    GRAY_TODAY: 83,
    MATERIAL_DESIGN: 96,
    BLACK_FONT_EVENTS: 104,
    MATCH_FONT_COLOR_WITH_EVENT_COLOR: 105
};

const Urls = {
    CALENDAR: "https://calendar.google.com/calendar",
    STORAGE_ISSUE: "https://jasonsavard.com/wiki/Calendar_extension_storage_issue"
}

const CalendarAccessRole = {
    OWNER: "owner",
    WRITER: "writer",
    READER: "reader",
    FREE_BUSY: "freeBusyReader",
}

const TASKS_CALENDAR_OBJECT = {
    id: "tasks",
    summary: getMessage("tasks"),
    accessRole: CalendarAccessRole.OWNER,
    colorId: "tasks",
    //backgroundColor: "rgb(244, 81, 30)", // will be initated in initmisc
    defaultReminders: [
        {
            method: "popup",
            minutes: 0
        }
    ]
}

const TASKS_BASE_URL = "https://tasks.googleapis.com/tasks/v1";
const TASKS_LISTS_MAX = 100;
const TASKS_MAX = 100;
const TASKS_KIND = "tasks#task";

const TaskStatus = {
    COMPLETED: "completed",
    NEEDS_ACTION: "needsAction"
}

const TimePeriodSymbol = {
    MINUTE: "m",
    HOUR: "h",
    DAY: "d"
}

function isNotificationAddedOutside(notificationId) {
	return notificationId && notificationId.includes(NotificationType.ADDED_OUTSIDE);
}

function EventEntry(summary, startTime) {
	this.summary = summary;
	this.startTime = startTime;
	this.quickAdd = true;
}

async function saveEvent(eventEntry) {
    let response;
    let initEventAndCopyObj = false;

    if (eventEntry.taskListId) {
        const data = await generateGoogleTask(eventEntry);

        response = await oauthDeviceSend({
            type: "post",
            url: `${TASKS_BASE_URL}/lists/${eventEntry.taskListId}/tasks`,
            data: data
        }, oAuthForTasks);

        initEventAndCopyObj = true;

    } else {
        // If today then processing quick add entry for min or hours etc..
        if (eventEntry.quickAdd && (!eventEntry.startTime || eventEntry.startTime.isToday())) {
            var processedEventEntry = await getEventEntryFromQuickAddText(eventEntry.summary);
            eventEntry.summary = processedEventEntry.summary;
            eventEntry.startTime = processedEventEntry.startTime;
        }

        if (eventEntry.quickAdd) {
            var title;
            // if no date set and it's all day then we must push the date into the quickadd to force to be an all day event
            if (!eventEntry.startTime && eventEntry.allDay) {
                eventEntry.startTime = new Date();
            }
            
            var nonEnglishWithStartTime = false;
            var originalEventEntry = deepClone(eventEntry);
            
            // if not today than skip this if statement because if a user types "tomorrow" or "tuesday" we can't add also the date to the quick add statement ie. conflicting statement... (tomorrow test 12/12/20012
            if (eventEntry.startTime && !eventEntry.startTime.isToday()) {
                // it seems that if we are not in english than quickAdd can only save the time or the date but not both! so let's quick add the event so quickadd recognizes the time string and then pass a 2nd time to update it to the proper date
                const calendarSettings = await storage.get("calendarSettings");
                if (/en/.test(calendarSettings.calendarLocale)) { // will also match en_GB
                    format = "m/d/yyyy";
                    // german: format = "yyyy/m/d";
                    title = eventEntry.summary + " " + eventEntry.startTime.format(format);
                } else {
                    nonEnglishWithStartTime = true;
                    title = eventEntry.summary;
                }				
            } else {
                title = eventEntry.summary;
            }
            
            var calendarId = await getCalendarIdForAPIUrl(eventEntry)
            
            response = await oauthDeviceSend({
                type: "post",
                url: "/calendars/" + encodeURIComponent(calendarId) + "/events/quickAdd?text=" + encodeURIComponent(title)
            });
            
            initEventObj(response);
            copyObj(response, eventEntry);

            console.log("start", eventEntry)
            if (nonEnglishWithStartTime) {
                console.log("non english with time")
                // determine if time was matched in the text sent to quickadd: it would be extracted from the summary in the result and thus means time was once present
                if (trim(originalEventEntry.summary) != trim(eventEntry.summary)) {
                    // timed event
                    eventEntry.allDay = false;
                    // must set month before day because if we set day larger than days in month then month is automatically incremented
                    eventEntry.startTime.setFullYear(originalEventEntry.startTime.getFullYear());
                    eventEntry.startTime.setMonth(originalEventEntry.startTime.getMonth());
                    eventEntry.startTime.setDate(originalEventEntry.startTime.getDate());
                    if (originalEventEntry.endTime) {
                        eventEntry.endTime.setFullYear(originalEventEntry.endTime.getFullYear());
                        eventEntry.endTime.setMonth(originalEventEntry.endTime.getMonth());
                        eventEntry.endTime.setDate(originalEventEntry.endTime.getDate());
                    } else {
                        eventEntry.end = null;
                        eventEntry.endTime = null;
                    }
                } else {
                    // allday event
                    eventEntry.allDay = true;
                    eventEntry.startTime = originalEventEntry.startTime;
                    eventEntry.endTime = originalEventEntry.endTime;
                }
                console.log("re-evententry:", eventEntry)
            }
            
            // if we passed in reminders we must set them again to the eventEntry, or else the current reminders are returned from the newy created object
            if (originalEventEntry.reminders != undefined) {
                eventEntry.reminders = originalEventEntry.reminders;
            }

            response = await ensureQuickAddPatchWhenAddingAllDayEvent({originalEventEntry:originalEventEntry, eventEntry:eventEntry, response:response, event:response});
            response = await ensureEventStartTimeIsNotInThePast(eventEntry, response);
            response = await ensureAllEventDetailsSavedAfterQuickAdd({eventEntry:eventEntry, response:response, event:response, nonEnglishWithStartTime:nonEnglishWithStartTime});
            if (response.secondPass) {
                initEventAndCopyObj = true;
            }
        } else {
            const data = await generateGoogleCalendarEvent(eventEntry);
            const calendarId = await getCalendarIdForAPIUrl(eventEntry);

            let url = `/calendars/${encodeURIComponent(calendarId)}/events`;

            if (eventEntry.sendNotifications && eventEntry.sendNotifications != "sent") {
                url = setUrlParam(url, "sendUpdates", "all");
                eventEntry.sendNotifications = "sent";
            }

            // test for null because that is used to remove conference
            if (eventEntry.conferenceData === null || eventEntry.conferenceData) {
                url = setUrlParam(url, "conferenceDataVersion", "1");
            }

            response = await oauthDeviceSend({
                type: "post",
                url: url,
                data: data
            });

            initEventAndCopyObj = true;
        }
    }

    if (initEventAndCopyObj) {
        initEventObj(response);
        copyObj(response, eventEntry);
    }

    if (eventEntry.conferenceData?.createRequest) {
        const conferenceStatusCode = response.conferenceData.createRequest.status.statusCode;
        if (conferenceStatusCode == "pending") {
            console.warn("conferenceStatusCode", conferenceStatusCode);
            // createRequest is asynchronous so might need to poll in a few seconds to get conference data
            setTimeout(() => {
                sendMessageToBG("pollServer", {source: "pending-conference-data"});
            }, seconds(3));
        } else if (conferenceStatusCode == "failure") {
            showMessageNotification("Problem creating video conference", "Event was saved");
        } else {
            // do nothing should be success
        }
    }

    return response;
}

// Seems when adding all day event to the CURRENT DAY - Google api would register the event as a timed event (saved to the current time) - so let's update the event to save it as an all day event
async function ensureQuickAddPatchWhenAddingAllDayEvent(params) {
    console.log("ensureQuickAddPatchWhenAddingAllDayEvent");
    if (params.originalEventEntry.allDay && trim(params.originalEventEntry.summary) == trim(params.eventEntry.summary) && params.eventEntry.startTime && Math.abs(params.eventEntry.startTime.diffInMinutes()) <= 2) {
        
        // 1st patch: make sure it's all day
        params.eventEntry.allDay = true;
        params.patchFields = await generateGoogleCalendarEvent(params.eventEntry);
        
        console.log("evententry", params.eventEntry);
        console.log("patchfields", params.patchFields);
        
        const response = await updateEvent(params);
        response.secondPass = true;
        return response;
    } else {
        console.log("2nd part", params.eventEntry);
        return params.response;
    }
}

function changeTimesOfEventEntry(eventEntry, newStartTime) {
	const newEndTime = calculateNewEndTime(eventEntry.startTime, eventEntry.endTime, newStartTime);
	eventEntry.startTime = newStartTime;
	eventEntry.endTime = newEndTime;
}

function fillTimesForPatchFields(eventEntry, patchFields) {
	patchFields.start = {};
	if (eventEntry.allDay) {
		patchFields.start.date = eventEntry.startTime.format(GOOGLE_API_DATE_ONLY_FORMAT_STR);
	} else {
		patchFields.start.dateTime = eventEntry.startTime.toRFC3339();
	}
	if (eventEntry.endTime) {
		patchFields.end = {};
		if (eventEntry.allDay) {
			patchFields.end.date = eventEntry.endTime.format(GOOGLE_API_DATE_ONLY_FORMAT_STR);
		} else {
			patchFields.end.dateTime = eventEntry.endTime.toRFC3339();
		}
	}
}

async function ensureEventStartTimeIsNotInThePast(eventEntry, response) {
	console.log("ensureEventStartTimeIsNotInThePast");
	
    if ((eventEntry.inputSource == InputSource.QUICK_ADD || eventEntry.inputSource == InputSource.OMNIBOX || eventEntry.inputSource == InputSource.CONTEXT_MENU || eventEntry.inputSource == InputSource.SHORTCUT) && ((eventEntry.allDay && eventEntry.startTime.isBeforeToday()) || (!eventEntry.allDay && eventEntry.startTime.getTime() < Date.now()))) {
        const inputSource = eventEntry.inputSource;
        delete eventEntry.inputSource;

        if (eventEntry.startTime.isToday() && (inputSource != InputSource.OMNIBOX && inputSource != InputSource.CONTEXT_MENU && inputSource != InputSource.SHORTCUT)) {
            const response = await openGenericDialog({
                content: getMessage("addedTimedEventInThePast"),
                showCancel: true
            });

            if (response == "ok") {
                let newTime = eventEntry.startTime.addDays(1);
                changeTimesOfEventEntry(eventEntry, newTime);
            }
        } else {
            // patch when using quick add "test wed" it could add it to the past wed if we are thu, so solution is to add it to next week
            // v1 but only do this if the event is added somewhere in the current week (not way before like when entering "Staff Meeting 8/1/16")
            // v2 only do this if within quickAddOldestDateRange (usually 7 days before)
            // let startOfWeek = moment().startOf('week').toDate();

            // ie. Staff Meeting 12/27/17 ref. https://jasonsavard.com/forum/discussion/comment/16931#Comment_16931
            let userEnteredSpecificDate = /\//.test(eventEntry.userInputSummary);

            let quickAddOldestDateRange = today().subtractDays(7);
            if (eventEntry.startTime.isAfter(quickAddOldestDateRange) && !userEnteredSpecificDate) {
                // move it to next week
                let newTime = eventEntry.startTime.addDays(7);
                changeTimesOfEventEntry(eventEntry, newTime);
            }
        }

        const patchFields = {};
        fillTimesForPatchFields(eventEntry, patchFields);
        
        response = await updateEvent({
            eventEntry: eventEntry,
            event: response,
            patchFields: patchFields
        });

        response.secondPass = true;
    }
    return response;
}

// since we couldn't add a description with the quickadd method let's pass a 2nd time to add the description by updating the recently created event
async function ensureAllEventDetailsSavedAfterQuickAdd(params) { //calendarId, eventEntry, response
    console.log("ensurequickadd details allday: " + params.eventEntry.allDay)
    console.log("ensurequickadd details startt: " + params.eventEntry.startTime)
    if (params.eventEntry.allDay || params.eventEntry.location || params.eventEntry.colorId || params.eventEntry.description || params.eventEntry.reminders || params.eventEntry.sendNotifications || params.nonEnglishWithStartTime) {
        console.log("ensureAllEventDetailsSavedAfterQuickAdd", params.eventEntry);
        
        params.patchFields = await generateGoogleCalendarEvent(params.eventEntry);
        
        const response = await updateEvent(params);
        response.secondPass = true;
        return response;
    } else {
        return params.response;
    }
}

// in minutes
async function getDefaultEventLength() {
    const calendarSettings = await storage.get("calendarSettings")
	var defaultEventLength = calendarSettings.defaultEventLength;
	if (defaultEventLength) {
		return parseInt(defaultEventLength);
	} else {
		return 60; // 60 minutes
	}
}

async function googleCalendarParseString(params) {
	if (!params.text) {
		throw "JERROR: text parameter missing";
	}
	
	const data = {
		ctext:	params.text
	};
	if (params.startTime) {
		data.stim = params.startTime.format("yyyymmdd");
		if (params.endTime) {
			data.etim = params.endTime.format("yyyymmdd");
		} else {
			data.etim = data.stim;
		}
	}
	
	let response = await ajax({
		url: `${Urls.CALENDAR}/compose`,
		type: "POST",
		data: data,
		dataType: "text",
		timeout: seconds(7)
	});
    // allday: ")]}'↵[['qa','test','','','20140618','20140618',[],'','']]
    // timed:  ")]}'↵[['qa','test','','','20140610T150000','20140610T160000',[],'','']]"

    // v2 now returning " instead of '
    // )]}'\n[["qa", "hello", "", "", "20171127T150000", "20171127T160000", [], "", ""]]

    response = response.split("\"");
    
    let summary = response[3];
    summary = summary.replaceAll("\\46", "&");
    summary = htmlToText(summary);

    const responseObj = {
        summary: summary
    };
    
    var startTimeStr = response[9];
    
    // if NO time in string ie. 20140618 vs 20140610T150000 then this is an all day event
    if (!startTimeStr.includes("T")) {
        responseObj.allDay = true;
    }

    // if times return ????????T?????? then there is not time that was parsed
    if (!startTimeStr.includes("??")) {
        responseObj.startTime = parseDate(startTimeStr);
        // seems that end time does not get set when using this google calendar post technique
        //responseObj.endTime = parseDate(response[12]);
        if (params.endTime) {
            responseObj.endTime = params.endTime;
        }
    }
    return responseObj;
}

async function generateGoogleCalendarEvent(eventEntry) {
	const data = {
        summary: eventEntry.summary,
        description: eventEntry.description //.replace(/&/ig, "&amp;")
    };
	
	if (eventEntry.source && eventEntry.source.url && (eventEntry.source.url.indexOf("http") != 0 || isInternalPage(eventEntry.source.url))) {
		console.warn("Google Calendar API does not allow chrome-extension:// in source, so excluding it");
	} else {
		data.source = eventEntry.source;
	}
	
	// if string form is passed then push direction to object (this is used for facebook event add from ics file
	// startTimeStr from ics can equal... DTSTART:20121004 or DTSTART:20121014T003000Z
	if (eventEntry.allDay) {
		data.start = {
			date: eventEntry.startTime.format(GOOGLE_API_DATE_ONLY_FORMAT_STR),
			dateTime: null
		}
		if (!eventEntry.endTime) {
			eventEntry.endTime = new Date(eventEntry.startTime);
			eventEntry.endTime.setDate(eventEntry.endTime.getDate()+1);
		}
		
		// patch seems quick add would register enddate same as startdate, for all day event it should end on the next day so let's force that
		if (eventEntry.startTime.isSameDay(eventEntry.endTime)) {
			console.log("end time patch")
			eventEntry.endTime = eventEntry.startTime.addDays(1);
		}
		
		data.end = {
			date: eventEntry.endTime.format(GOOGLE_API_DATE_ONLY_FORMAT_STR),
			dateTime: null
		}

		if (eventEntry.transparency == undefined) {
			data.transparency = "transparent"; // override default of busy to available for allday events
		}
	} else {
		data.start = {
			date: null,
			dateTime: eventEntry.startTime.toRFC3339() // 2012-12-17T17:54:00Z
        }
        
		// if none set must put it's duration atleast an 1 long
		if (!eventEntry.endTime) {
			eventEntry.endTime = new Date(eventEntry.startTime);
			eventEntry.endTime.setMinutes(eventEntry.endTime.getMinutes() + await getDefaultEventLength());
		}
		data.end = {
			date: null,
			dateTime: eventEntry.endTime.toRFC3339()
        }
        
        if (eventEntry.recurrence || eventEntry.recurringEventId) { // required for recurring events
            const calendar = getEventCalendar(eventEntry);
            data.start.timeZone = calendar.timeZone;
            data.end.timeZone = calendar.timeZone;
        }
	}
    
    data.conferenceData = eventEntry.conferenceData;
	data.location = eventEntry.location;
	data.colorId = eventEntry.colorId;
	if (eventEntry.reminders && eventEntry.reminders.useDefault) {
		// nothing
	} else {
		data.reminders = eventEntry.reminders;
	}
	
	if (eventEntry.extendedProperties) {
		data.extendedProperties = eventEntry.extendedProperties;
	}

	if (eventEntry.attendees) {
		data.attendees = eventEntry.attendees;
    }
    
    if (eventEntry.recurrence) {
        data.recurrence = eventEntry.recurrence;
    }
	
	return data;
}

function setTaskDueDate(date) {
    return `${date.format("yyyy-mm-dd")}T00:00:00.000Z`;
}

async function generateGoogleTask(eventEntry) {
	return {
        title: eventEntry.summary,
        notes: eventEntry.description,
        due: setTaskDueDate(eventEntry.startTime)
    };
}

async function oauthDeviceSend(sendParams, oAuthForMethod) {
    if (!sendParams.userEmail) {
        sendParams.userEmail = await storage.get("email");
    }
    
    // note that last time this extension is modifying the calendar
    if (/post|patch|delete/i.test(sendParams.type)) {
        storage.setDate("_lastCalendarModificationByExtension");
    }

    if (!oAuthForMethod) {
        oAuthForMethod = oAuthForDevices;
    }
    
    return oAuthForMethod.send(sendParams);
}

async function ensureSameCalendar(params) {
    console.log("ensureSameCalendar", params);
    if (params.oldCalendarId && params.newCalendarId && params.oldCalendarId != params.newCalendarId) {
        console.log("move calendar");
        
        var sendParams = {
            userEmail: await storage.get("email"),
            type: "post",
            url: "/calendars/" + encodeURIComponent(params.oldCalendarId) + "/events/" + (params.changeAllRecurringEvents ? params.event.recurringEventId : params.event.id) + "/move?destination=" + encodeURIComponent(params.newCalendarId)
        };
        
        const response = await oauthDeviceSend(sendParams);
        initEventObj(response);
        if (params.event) {
            copyObj(response, params.event);
            // add new calendar
            params.event.calendarId = params.newCalendarId;
        }
        return response;
    }
}

async function ensureRecurringEventPrompt(params) {
    if (params.event.recurringEventId && !params.skipPrompt) {
        const response = await openGenericDialog({
            title: getMessage("recurringEvent"),
            content: getMessage("recurringEventPrompt"),
            okLabel: getMessage("onlyThisEvent"),
            otherLabel: getMessage("allEvents"),
            showCancel: true
        });

        if (response == "other") { // means all events
            $("#genericDialog")[0].close();
            return {changeAllRecurringEvents: true};
        } else if (response == "cancel") {
            return {cancel: true};
        }
    }
    return {};
}

// old way of using updatevent was just passing an eventEntry
// new way is passing the google calendar event object and passing fields to change
async function updateEvent(params) {
    let response;
    let data;

    console.log("updateEvent", params);

    if (params.event?.kind == TASKS_KIND || params.eventEntry?.kind == TASKS_KIND) {
        let taskList;
        let taskId;

        if (params.patchFields) {
            taskId = params.event.id;
            data = params.patchFields;
            taskList = await getTaskList(params.event);
        } else {
            taskId = params.eventEntry.id;
            data = await generateGoogleTask(params.eventEntry);
            taskList = await getTaskList(params.eventEntry);
        }

        response = await oauthDeviceSend({
            type: "patch",
            url: `${TASKS_BASE_URL}/lists/${taskList.id}/tasks/${taskId}`,
            data: data
        }, oAuthForTasks);
    } else {
        if (params.patchFields) {
            data = params.patchFields;
        } else {
            data = await generateGoogleCalendarEvent(params.eventEntry);
        }    

        var calendarId;
        var oldCalendarId;
        var newCalendarId;
        
        console.log("updateevent", params);
        
        if (params.event && getEventCalendar(params.event)) {
            calendarId = getEventCalendarId(params.event);
            oldCalendarId = calendarId;
        }
        
        if (params.eventEntry && getEventCalendar(params.eventEntry)) {
            calendarId = getEventCalendarId(params.eventEntry);
            newCalendarId = calendarId;
        }
        
        if (!calendarId) {
            console.warn("no calendarId, default to primary");
            calendarId = "primary";
        }
    
        let changeAllRecurringEvents;
        if (params.eventEntry?.recurrence) {
            changeAllRecurringEvents = true;
        } else {
            const response = await ensureRecurringEventPrompt(params);
            if (response.cancel) {
                return response;
            }
    
            if (response.changeAllRecurringEvents) {
                if (!await storage.get("previousRecurringEventsRemovedWarning")) {
                    const answer = await openGenericDialog({
                        content: "Recurring events before this date will be removed, is this OK?",
                        showCancel: true
                    });
                    if (answer == "cancel") {
                        return {cancel: true};
                    } else {
                        await storage.set("previousRecurringEventsRemovedWarning", new Date());
                    }
                }
                changeAllRecurringEvents = true;
            }
        }
        
        await ensureSameCalendar({
            oldCalendarId: oldCalendarId,
            newCalendarId: newCalendarId,
            event: params.event,
            changeAllRecurringEvents: changeAllRecurringEvents
        });
    
        let url = `/calendars/${encodeURIComponent(calendarId)}/events/${(changeAllRecurringEvents && params.event.recurringEventId ? params.event.recurringEventId : params.event.id)}`;
        if (params.eventEntry?.sendNotifications && params.eventEntry.sendNotifications != "sent") {
            url = setUrlParam(url, "sendUpdates", "all");
            params.eventEntry.sendNotifications = "sent";
        }
    
        // test for null because that is used to remove conference
        if (params.eventEntry && (params.eventEntry.conferenceData === null || params.eventEntry.conferenceData)) {
            url = setUrlParam(url, "conferenceDataVersion", "1");
        }
    
        response = await oauthDeviceSend({
            type: "patch",
            url: url,
            data: data
        });        
    }
    
    console.log("initEventObj", response);
    initEventObj(response);
    // copy new updated times/dates to event which was passed in the eventEntry
    if (params.event) {
        copyObj(response, params.event);
    }
    if (params.eventEntry?.event) {
        copyObj(response, params.eventEntry.event);
    }

    return response;
}

function calculateNewEndTime(oldStartTime, oldEndTime, newStartTime) {
	if (oldEndTime) {
		var duration = oldEndTime.getTime() - oldStartTime.getTime();
		var newEndTime = new Date(newStartTime.getTime() + duration);
		return newEndTime;
	} else {
		return null;
	}
}

async function getEventEntryFromQuickAddText(text) {
	// look for 'cook in 10 min' etc...
	var eventEntry = await timeFilter(text, "min(ute)?s?", 1);
	if (!eventEntry || !eventEntry.summary) {
		eventEntry = await timeFilter(text, "hours?", 60);
		if (!eventEntry || !eventEntry.summary) {
			var regex = new RegExp("^" + getMessage("tom") + ":")
			var matches = regex.exec(text);
			if (matches) {
				// remove the tom: etc.
				eventEntry = new EventEntry(text.replace(regex, ""), tomorrow());
			} else {
				eventEntry = new EventEntry(text);
			}
		}
	}
	return eventEntry;
}

async function timeFilter(str, timeRegex, timeMultiplierForMinutes) {
	//var matches = title.match(/\b(in )?(\d*) ?min(ute)?s?\b/)
	var regexStr = "\\b ?(in |for )?(\\d*) ?" + timeRegex + "\\b";
	var matches = new RegExp(regexStr).exec(str)
	// look for a match and that not just the word 'min' was found without the number of minutes (##)etc..
	if (matches != null && matches[2]) {
		if (matches[1] == "for ") {
			// skip formatting title because this a quick add with a duration ie. dinner at 7pm for 30min
		} else {
			const extractedTime = matches[2];
            const extractedTitle = str.replace(matches[0], "");
            const newDate = new Date(Date.now() + minutes(1) * extractedTime * timeMultiplierForMinutes);
            let timeStr = "";
            
            // patch for zh-cn and zh-tw because putting 2:00am or pm do not work, must use the chinese am/pm ie. 上午6:00 or 下午6:30
            if (locale.includes("zh")) {		
                timeStr = newDate.getHours() < 12 ? "上午" : "下午";
                timeStr += dateFormat(newDate, "h:MM")
            } else {
                timeStr = dateFormat(newDate, "h:MMtt");
            }
            
            return new EventEntry(`${timeStr} ${extractedTitle}`, newDate);
		}
	}
}

function cleanTitle(title) {
	// gmail email title ex. "Gmail - emailSubject - abc@def.com"
	// use this regex to get emailsubject from title				
	var matches = title.match(/^Gmail - (.*) - .*@.*/i);
	if (matches) {
		return matches[1];
	} else {
		return title;
	}
}

// if no "tab" passed then default to this page
async function getEventDetailsFromPage(tab) {

    function executeScript(file) {
        return new Promise((resolve, reject) => {
            chrome.tabs.executeScript(tab.id, {file: file}, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                } else {
                    resolve(response);
                }
            });
        });
    }

	var title, description, url;
	
	if (tab) {
		if (tab.url.includes("https://mail.google.com/mail/u/")) {
            try {
                const results = await executeScript("/js/parseGmailToEvent.js");
                if (results && results.length >= 1) {
                    var eventDetails = results[0];
                    title = eventDetails.title;
                    description = eventDetails.description;
                    url = eventDetails.url;
                }
            } catch (error) {
                // ignore
                console.error("probably don't have access to parse this page: " + error);
            }
		} else if (tab.url.includes("https://mail.google.com/mail/mu/")) {
            try {
                const results = await executeScript("/js/parseGmailOfflineToEvent.js");
                if (results && results.length >= 1) {
                    var eventDetails = results[0];
                    title = eventDetails.title;
                    description = eventDetails.description;
                }
            } catch (error) {
                // ignore
                console.error("probably don't have access to parse this page: " + error);
            }
		} else if (tab.url.includes(getInternalPageProtocol() + "//" + ExtensionId.Gmail) || tab.url.includes(getInternalPageProtocol() + "//" + ExtensionId.LocalGmail)) {
            try {
                const response = await sendMessageToGmailExtension({action:"getEventDetails"});
                if (response) {
					title = response.title;
					description = response.description;
					url = response.url;
				}
            } catch (error) {
                // ignore
                console.error("probably don't have access to parse this page: " + error);
            }
		} else {
            try {
                const results = await executeScript("/js/parseHtmlToEvent.js");
                if (results && results.length >= 1) {
                    var eventDetails = results[0];
                    title = eventDetails.title;
                    description = eventDetails.description;
                    url = eventDetails.url;
                }
            } catch (error) {
                // ignore
                console.error("probably don't have access to parse this page: " + error);
            }
        }
        
        // if page not responding or no details found then just spit out title and url
    	if (!title) {
	    	console.log("timeout no title");
    		title = cleanEmailSubject(cleanTitle(tab.title));
    		description = tab.url;
        }
	} else {
        title = $(".hP:visible").first().text();
        title = cleanEmailSubject(title);

        description = $(".ii.gt:visible").html();
        url = location.href;
        
        if (description) {
            description = htmlToText(description);
            description = description.trim();
            // trim line breaks
            description = trimLineBreaks(description);
            description = description.trim();
        }
    
        // Add link to email
        if (/\/\/mail.google.com/.test(url)) {
            var matches = url.match(/([0-9]*[a-z]*)*$/); // this will match the 133c67b2eadf9fff part of the email
            var emailLink;
            if (matches && matches[0].length >= 10) {
                emailLink = url;
            } else {
                emailLink = "https://mail.google.com/mail/#search/subject%3A+" + encodeURIComponent(title);
            }
            description = emailLink + "\n\n" + description;
        }

        url = null;
    }
    
    return {
        title: title,
        description: description,
        url: url
    }
}

function formatDateTo8Digits(date, withTime) {
	var str = date.getFullYear() + "" + pad((date.getMonth()+1),2, "0") + "" + pad(date.getDate(), 2, "0");
	if (withTime) {
		str += "T" + pad(date.getHours(), 2, "0") + "" + pad(date.getMinutes(), 2, "0") + "" + pad(date.getSeconds(), 2, "0");
	}
	return str;
}

async function generateActionLink(action, eventEntry) {
	var description = eventEntry.description;
	// when using GET must shorten the url length so let's shorten the desctiption to not get 414 errors
	var MAX_DESCRIPTION_LENGTH = 600;
	if (description && description.length > MAX_DESCRIPTION_LENGTH) {
		description = description.substring(0, MAX_DESCRIPTION_LENGTH) + "...";						
	}
	var datesStr = "";
	
	// if no starttime must have one for this url to work with google or else it returns 404
	if (!eventEntry.startTime) {
		eventEntry.startTime = new Date();
	}
	if (eventEntry.startTime) {
		var startTime = eventEntry.startTime ? new Date(eventEntry.startTime) : new Date();
		var endDate;
		var withTime = !eventEntry.allDay;
		var startTimeStr = formatDateTo8Digits(startTime, withTime);
		if (eventEntry.endTime) {
			endDate = new Date(eventEntry.endTime);
		} else {
			endDate = new Date(startTime);
			if (eventEntry.allDay) {
				endDate.setDate(startTime.getDate()+1);
			} else {
				endDate.setMinutes(endDate.getMinutes() + await getDefaultEventLength());
			}
		}					
		var endDateStr = formatDateTo8Digits(endDate, withTime);
		datesStr = "&dates=" + startTimeStr + "/" + endDateStr;
	}
	
	var cText = eventEntry.summary ? "&ctext=" + encodeURIComponent(eventEntry.summary) : "";
	var textParam = eventEntry.summary ? "&text=" + encodeURIComponent(eventEntry.summary) : "";
	//output=js CRASHES without specifying return type in .ajax
	//https://www.google.com/calendar/event?hl=de&dates=20110124/20110125&ctext=tet&pprop=HowCreated:DRAG&qa-src=month-grid&sf=true&action=CREATE&output=js&secid=AmobCPSNU1fGgh1zQp9oPzEaMhA
	var detailsParam = description ? "&details=" + encodeURIComponent(description) : "";
	var locationParams = eventEntry.location ? "&location=" + encodeURIComponent(eventEntry.location) : "";
	
	var src;
    var srcParam
    
    const eventCalendar = getEventCalendar(eventEntry);
	if (eventCalendar) {
		src = eventCalendar.id;
    }
    
	srcParam = src ? "&src=" + src : "";
	
	var url = `${Urls.CALENDAR}/event`;
	var data = "action=" + action + datesStr + cText + textParam + detailsParam + locationParams + srcParam + "&authuser=" + encodeURIComponent(await storage.get("email"));
	return {url:url, data:data};
}

async function daysElapsedSinceFirstInstalled() {
    const installDate = await getInstallDate();
	return Math.abs(Math.round(installDate.diffInDays()));
}

var IGNORE_DATES = false;

async function isEligibleForReducedDonation(mightBeShown) {

	if (TEST_REDUCED_DONATION) {
		return true;
	}
	
	// not eligable if we already d or we haven't verified payment
	if (!await storage.get("donationClicked")) {
		if (IGNORE_DATES || await daysElapsedSinceFirstInstalled() >= UserNoticeSchedule.DAYS_BEFORE_ELIGIBLE_FOR_REDUCED_DONATION) {

			// when called from shouldShowReducedDonationMsg then we can assume we are going to show the ad so let's initialize the daysElapsedSinceEligible
			if (mightBeShown) {
				// stamp this is as first time eligibility shown
				var daysElapsedSinceEligible = await storage.get("daysElapsedSinceEligible");
				if (!daysElapsedSinceEligible) {
					await storage.setDate("daysElapsedSinceEligible");				
				}
			}
			
			return true;
		} else {
			return false;
		}
	}
}

// only display eligible special for 1 week after initially being eligiable (but continue the special)
async function isEligibleForReducedDonationAdExpired(mightBeShown) {

	if (TEST_REDUCED_DONATION) {
		return false;
	}
	
	if (await storage.get("reducedDonationAdClicked")) {
		return true;
	} else {
		var daysElapsedSinceEligible = await storage.get("daysElapsedSinceEligible");
		if (daysElapsedSinceEligible) {
			daysElapsedSinceEligible = new Date(daysElapsedSinceEligible);
			if (IGNORE_DATES || Math.abs(daysElapsedSinceEligible.diffInDays()) <= UserNoticeSchedule.DURATION_FOR_SHOWING_REDUCED_DONATION) {
                return false;
            } else if (Math.abs(daysElapsedSinceEligible.diffInDays()) >= UserNoticeSchedule.DAYS_BEFORE_ELIGIBLE_FOR_REDUCED_DONATION_AGAIN) {
                let daysElapsedSinceReducedDonationAgain = await storage.get("daysElapsedSinceReducedDonationAgain");
                if (daysElapsedSinceReducedDonationAgain) {
                    if (Math.abs(daysElapsedSinceReducedDonationAgain.diffInDays()) <= UserNoticeSchedule.DURATION_FOR_SHOWING_REDUCED_DONATION) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    await storage.setDate("daysElapsedSinceReducedDonationAgain");
                    return false;
                }
			} else {
				return true;
			}
		}
		return false;
	}
}

async function shouldShowExtraFeature() {

	if (TEST_SHOW_EXTRA_FEATURE) {
		return true;
	}

	if (!await storage.get("donationClicked")) {
		const skins = await storage.get("skins");
		if (skins && skins.length) {
			return false;
		} else {
			if (await daysElapsedSinceFirstInstalled() >= UserNoticeSchedule.DAYS_BEFORE_SHOWING_EXTRA_FEATURE) {
				var daysElapsedSinceFirstShownExtraFeature = await storage.get("daysElapsedSinceFirstShownExtraFeature");
				if (daysElapsedSinceFirstShownExtraFeature) {
					if (daysElapsedSinceFirstShownExtraFeature.diffInDays() <= -UserNoticeSchedule.DURATION_FOR_SHOWING_EXTRA_FEATURE) {
						return false;
					} else {
						return true;
					}
				} else {
					await storage.setDate("daysElapsedSinceFirstShownExtraFeature");
					return true;
				}
			} else {
				return false;
			}
		}
	}
}

async function shouldShowReducedDonationMsg(ignoreExpired) {
	if (await isEligibleForReducedDonation(true)) {
		if (ignoreExpired) {
			return true;
		} else {
			return !await isEligibleForReducedDonationAdExpired();
		}
	}
}

function getSummary(event) {
	var summary = event.summary;
	if (!summary) {
		var calendar = getEventCalendar(event);
		if (calendar && calendar.accessRole == CalendarAccessRole.FREE_BUSY) {
			summary = getMessage("busy");
		} else {
			summary = "(" + getMessage("noTitle") + ")";
		}
	}
	return summary;
}

function getEventID(event) {
	if (event.id) {
		return event.id
	} else {
		return event.eid;
	}
}

function isSameEvent(event1, event2) {
	return event1.id == event2.id;
}

function darkenColor(color) {
	if (color == "#9fe1e7") { // when using Android my main cal changed to peacock and it was too light
		return "#2cbecc";
	} else {
		return lightenDarkenColor(color, -40);
	}
}

function initEventObj(event) {
    if (event.kind == TASKS_KIND) {
		event.allDay = true;
        let isoString;
        if (event.due.toISOString) {
            isoString = event.due.toISOString();
        } else {
            isoString = event.due;
        }
		event.startTime = new Date(isoString.replace("Z", ""));
        event.summary = event.title;
        event.description = event.notes;
    } else {
        if (event.start.date) {
            event.allDay = true;
            event.startTime = parseDate(event.start.date);
            event.endTime = parseDate(event.end.date);
        } else {
            event.allDay = false;
            event.startTime = parseDate(event.start.dateTime);
            event.endTime = parseDate(event.end.dateTime);
        }
    }
}

function isGadgetCalendar(calendar) {
	if (calendar) {
		var id = calendar.id;
		
		if (id) {
			id = decodeCalendarId(id);
			return isGadgetCalendarId(id)
		}
	}
}

function isGadgetCalendarId(calendarId) {
	if (calendarId && (
			calendarId.includes("#weather@group.v.calendar.google.com") || // weather
			calendarId.includes("#weeknum@group.v.calendar.google.com") || // week numbers
			calendarId.includes("g0k1sv1gsdief8q28kvek83ps4@group.calendar.google.com") || // week numbers also?
			calendarId.includes("#daynum@group.v.calendar.google.com") || // day of the year
			calendarId.includes("ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com") // moon phases
			)) {
				return true;
	}
}

function decodeCalendarId(id) {
	// ignore decoding errors produced from gtempaccounts because they % ie.  joao%rotagrafica.com.br@gtempaccount.com in them!! refer to https://support.google.com/youtube/answer/1076429
	if (id && !id.includes("@gtempaccount.com")) {
		// try catch for: URIError: URI malformed
		try {
			id = decodeURIComponent(id);
		} catch (e) {
			logError("could not decode id from url: " + id);
		}
	}
	return id;
}

function stripEvent(event) {
	var eventShownMinimal = {
		id: event.id,
		startTime: event.startTime,
		endTime: event.endTime,
		reminderTimes: event.reminderTimes
	}
	return eventShownMinimal;
}

async function updateNotificationEventsShown(notifications, eventsShown, lastAction) {
	notifications.forEach(notification => {
		updateEventShown(notification.event, eventsShown);
	});

	if (lastAction != "snooze") {
        await removeSnoozers(notifications);
    }
    
	serializeEventsShown();
}

function updateEventShown(event, eventsShown) {
	// Update eventsShown with stripped event
	var eventToModify = findEvent(event, eventsShown);
	
	if (eventToModify) {
		markReminderTimeAsShown(event, eventToModify);
	} else {
		// prevent localStorage quota issue with massive eventsShown - so minimimze the details we need to only the bare essentials
		var strippedEvent = stripEvent(event);

		markReminderTimeAsShown(event, strippedEvent);
		eventsShown.push(strippedEvent);
	}
}

function markReminderTimeAsShown(event, eventToModify) {
	eventToModify.startTime = event.startTime;
	if (!eventToModify.reminderTimes) {
		eventToModify.reminderTimes = [];
	}
	
	// dismiss any other reminders to this same event that might have come before
	var reminders = getEventReminders(event);
	if (reminders) {
		reminders.forEach(function(reminder) {
			if (reminder.method == "popup") {
				var eventToModifyReminderTime = getReminderTime(event, reminder);
				if (eventToModifyReminderTime.isEqualOrBefore(new Date())) {
					eventToModify.reminderTimes.push({
						time:eventToModifyReminderTime,
						shown:true
					});
				}
			}
		});
	}
	
	//eventToModify.reminderTimes.push({time:reminderTime, shown:true});
	//console.log("MARKEND " + event.summary, eventToModify);
}

async function getCalendarIdForAPIUrl(eventEntry) {
	var calendarId;
	
	if (eventEntry.calendar) { // legacy
		calendarId = eventEntry.calendar.id;
	} else if (eventEntry.calendarId) {
        calendarId = eventEntry.calendarId;
    } else {
        calendarId = await storage.get("defaultCalendarId") || "primary";
    }
	return calendarId;
}

function getCalendarIDFromURL(url) {
	if (url) {
		var str = "/feeds/";
		var idx = url.indexOf(str);
		if (idx != -1) {
			id = url.substring(idx+str.length);
			idx = id.indexOf("/");
			if (idx != -1) {
				return id.substring(0, idx);
			}
		}
	}
	return null;
}

async function getArrayOfCalendars(params = {}) {
    const cachedFeeds = await storage.get("cachedFeeds");
    const calendarList = cachedFeeds["calendarList"];
	if (calendarList?.items) {
        const calendars = calendarList.items.slice();

        if (params.includeTasks || (await oAuthForTasks.findTokenResponse({userEmail: await storage.get("email")}) && !params.excludeTasks)) {
            calendars.push(TASKS_CALENDAR_OBJECT);
        }

		calendars.sort(function(calendar1, calendar2) {
			if (calendar1.primary) return -1;
			if (calendar2.primary) return +1;

			if (calendar1.accessRole == CalendarAccessRole.OWNER && calendar2.accessRole != CalendarAccessRole.OWNER) {
				return -1;
			} else if (calendar1.accessRole != CalendarAccessRole.OWNER && calendar2.accessRole == CalendarAccessRole.OWNER) {
				return +1;
			}
			
			var summary1 = getCalendarName(calendar1);
			var summary2 = getCalendarName(calendar2);
			
			if (summary1.toLowerCase() < summary2.toLowerCase()) return -1;
		    if (summary1.toLowerCase() > summary2.toLowerCase()) return +1;

		    return 0;
		});

        return calendars;
	} else {
		return [];
	}
}

async function initCalendarMap() {
    const calendarMap = new Map();
    const arrayOfCalendars = await getArrayOfCalendars({
        includeTasks: true
    });
    arrayOfCalendars.forEach(calendar => {
        calendarMap.set(calendar.id, calendar);
    });
    return calendarMap;
}

function getCalendarById(id) {
	return calendarMap.get(id);
}

function getEventCalendar(event) {
    let calendarId;
    
    // sometimes happening don't know why
    if (!calendarMap) {
        console.warn("calendarmap not initiated");
        return {};
    }
	
	// legacy
	if (event.calendar) {
		calendarId = event.calendar.id;
	} else {
		calendarId = event.calendarId;
    }

    return getCalendarById(calendarId);
}

function getEventCalendarId(event) {
	var calendarId;
	
	// legacy
	if (event.calendar) {
		calendarId = event.calendar.id;
	} else {
		calendarId = event.calendarId;
	}
	return calendarId;
}

function getEventReminders(event) {
	let reminders;
	if (event.reminders) {
		if (event.reminders.useDefault) {
			reminders = getEventCalendar(event).defaultReminders;
		} else {
			reminders = event.reminders.overrides;
		}
	} else if (event.kind == TASKS_KIND) {
        reminders = getEventCalendar(event).defaultReminders;
    }
	return reminders;
}

function getReminderTime(event, reminder) {
	const reminderTime = new Date(event.startTime.getTime());
	return new Date(reminderTime.getTime() - (reminder.minutes * ONE_MINUTE));
}

async function removeSnoozers(notifications) {
    var snoozers = await getSnoozers();
    
    notifications.forEach(notification => {
        // Remove IF from Snoozers
        for (var a=0; a<snoozers.length; a++) {
            var snoozer = snoozers[a];
            //console.log("snooze found")
            if (isSameEvent(notification.event, snoozer.event)) {
                //console.log("remove snooze")
                snoozers.splice(a, 1);
                a--;
                break;
            }
        }
    });

    await storage.set("snoozers", snoozers);
    return snoozers;
}

async function setSnoozeInMinutes(notifications, units) {
	// detect if snoozing minutes before event ie. -15, -10, -5 etc..
	if (units <= 0) {
		await setSnoozeDate({
			notifications: notifications,
			beforeStart: units
		});
	} else {
		var date = new Date(Date.now() + minutes(units));
		date.setSeconds(0, 0);
		await setSnoozeDate({
			notifications: notifications,
			time: date
		});
	}
}

async function setSnoozeInHours(notifications, units) {
	var date = new Date(Date.now() + hours(units));
	date.setSeconds(0, 0);
	await setSnoozeDate({
		notifications: notifications,
		time: date
	});
}

async function setSnoozeDate(params) {
    const newSnoozers = [];

    const updateEventPromises = [];
    await asyncForEach(params.notifications, async (notification, index) => {

		// remove first then add again
        await removeSnoozers([notification]); // note array is passed

		const event = notification.event;

		if (params.beforeStart != undefined) {
			params.time = event.startTime.addMinutes(params.beforeStart);
		}

		// we don't want to change allday events to timed events let's keep using snoozers IF snoozing for less than a day
		if (await storage.get("snoozingChangesEventTime")
            && isCalendarWriteable(getEventCalendar(event))
            && isOnline()
            && (!event.allDay || params.wholeDays)) {

            let performUpdate;
            let patchFields;

            if (event.kind == TASKS_KIND) {
                patchFields = {
                    due: setTaskDueDate(params.time)
                }

                performUpdate = true;
            } else {
                const reminders = getEventReminders(event);
                if (reminders) {
                    // remove any passed reminders
                    for (let a=0; a<reminders.length; a++) {
                        const reminder = reminders[a];
                        if (reminder.method == "popup") {
                            var reminderTime = getReminderTime(event, reminder);
                            if (reminderTime.isEqualOrBefore(params.time)) {
                                reminders.splice(a, 1);
                                a--;
                            }
                        }
                    }
    
                    // add new reminder
                    // if after original time then change event time
                    if (params.time.isAfter(event.startTime)) {
                        changeTimesOfEventEntry(event, params.time);
                    }
                    reminders.push({
                        method: "popup",
                        minutes: event.startTime.diffInMinutes(params.time)
                    });
    
                    // update event
                    event.reminders.useDefault = false;
                    event.reminders.overrides = reminders;
    
                    // save event
                    patchFields = {
                        reminders: event.reminders
                    }
                    fillTimesForPatchFields(event, patchFields);

                    performUpdate = true;
                }
            }

            if (performUpdate) {
                const updateEventPromise = updateEvent({
                    event: event,
                    patchFields: patchFields,
                    skipPrompt: true
                }).then(response => {
                    // update event immediately in memory so that checkevents updates
                    return updateCachedFeed(event, {
                        operation: "update",
                        ignoreCheckEvents: true
                    });
                });
                updateEventPromises.push(updateEventPromise);
            }
		} else {
			if (DetectClient.isFirefox() && params.time) {
				params.time = new Date(params.time.getTime());
			}
            newSnoozers.push({
                time: params.time,
                event: event,
                reminderTime: notification.reminderTime, // last # = minutes
                email: await storage.get("email")
            });
		}
	});

	if (updateEventPromises.length) {
		await Promise.all(updateEventPromises).then(async () => {
            checkEvents({
                ignoreNotifications: true
            });
		}).catch(error => {
			showMessageNotification("Problem snoozing!", "Go to Options > Accounts", error);
		});
	}

	if (newSnoozers.length) {
        let snoozers = await getSnoozers();
        snoozers = snoozers.concat(newSnoozers);
		await storage.set("snoozers", snoozers);
	}
}

async function snoozeNotifications(snoozeParams, notifications) {
	if (snoozeParams.snoozeTime) {
		await setSnoozeDate({
			notifications: notifications,
			time: snoozeParams.snoozeTime
		});
	} else if (snoozeParams.inMinutes) {
		if (snoozeParams.inMinutes == 5 && await storage.get("testMode")) {
			snoozeParams.inMinutes = 1;
		}
		await setSnoozeInMinutes(notifications, snoozeParams.inMinutes);
	} else if (snoozeParams.inHours) {
		await setSnoozeInHours(notifications, snoozeParams.inHours);
	} else { // in days
		const daysToSnooze = snoozeParams.inDays;
		const snoozeToThisDay = new DateZeroTime();

        let wholeDays;
        if (daysToSnooze == 1.5) {
            wholeDays = false;
            snoozeToThisDay.setDate(snoozeToThisDay.getDate() + 1);
            snoozeToThisDay.setHours(12);
            //snoozeToThisDay.setHours(18);
            //snoozeToThisDay.setMinutes(30);
        } else {
            wholeDays = true;
            snoozeToThisDay.setDate(snoozeToThisDay.getDate() + parseInt(daysToSnooze));
        }
		//snoozeToThisDay.setHours(8); // v2 I haven't seen any issus with the 1.5 snooze using setHours so this issue might be fixed, v1 commented because it was causing issues in isEventShownOrSnoozed with this line event.startTime.isBefore(eventShown.startTime)

		await setSnoozeDate({
			notifications: notifications,
			time: snoozeToThisDay,
			wholeDays: wholeDays
		});
	}

	const closeNotificationsParams = {
        lastAction: "snooze"
    };
	if (snoozeParams.source == "notificationButton") {
		closeNotificationsParams.source = "notificationButton";
	}
	
	closeNotifications(notifications, closeNotificationsParams);
}

async function getTimeElapsed(event) {
    const formatter = new Intl.RelativeTimeFormat(locale, {
        numeric: 'auto',
        style: "short"
    });

	var timeElapsedMsg = "";
	var diffInDays = event.startTime.diffInDaysForHumans();
	if (event.allDay) {
		if (isYesterday(event.startTime)) {
			timeElapsedMsg = getYesterdayMessage();
		} else if (isTomorrow(event.startTime)) {
			timeElapsedMsg = getTomorrowMessage();
		} else if (!isToday(event.startTime)) {
            timeElapsedMsg = formatter.format(diffInDays, 'days');
		}
	} else {
		const diffInMinutes = event.startTime.diffInMinutes();
		
		let diffInHours = diffInMinutes / 60;
		if (Math.abs(diffInHours) <= 2) {
			diffInHours = diffInHours.toFixed(1).replace(".0", "");
		} else {
			diffInHours = diffInHours.toFixed(0);
		}
        
		var startTimePrefix = new Date(event.startTime).toLocaleTimeStringJ(true) + " • ";
		if (diffInDays >= 1) {
			timeElapsedMsg = formatter.format(diffInDays, 'days');
		} else if (diffInHours >= 1) {
			timeElapsedMsg = startTimePrefix + formatter.format(diffInHours, 'hours');
		} else if (diffInMinutes >= 1) {
			timeElapsedMsg = startTimePrefix + formatter.format(Math.floor(diffInMinutes), 'minutes');
		} else if (diffInMinutes >= -2) {
			// Just happened so do nothing
		} else if (diffInMinutes > -60) {
			timeElapsedMsg = formatter.format(Math.floor(diffInMinutes), 'minutes');
		} else if (isYesterday(event.startTime)) {
			timeElapsedMsg = getYesterdayMessage();
		} else if (diffInDays > -1) {
			timeElapsedMsg = formatter.format(diffInHours, 'hours');
		} else {
			timeElapsedMsg = formatter.format(diffInDays, 'days');
		}
	}
	
	return timeElapsedMsg;
}

async function getSelectedCalendarsInGoogleCalendar() {
    const arrayOfCalendars = await getArrayOfCalendars();
    return arrayOfCalendars.reduce((filtered, calendar) => {
        if (calendar.selected) {
            filtered.push(calendar);
        }
        return filtered;
    }, []);
}

function isCalendarSelectedInExtension(calendar, email, selectedCalendars) {
	if (calendar) {
		// new added because we were fetching events for weather, week numbers etc. which were never used in the display of new looks (or old looks for that matter because they don't use the feed data- just the embed calendar)
		if (!isGadgetCalendar(calendar)) {
			if (selectedCalendars && selectedCalendars[email]) {
				const selected = selectedCalendars[email][calendar.id];
				// if previously defined than return that setting
				if (typeof selected != "undefined") {
					return selected;
				} else { // never defined so use default selected flag from google calendar settings
					return calendar.selected;
				}
			} else {
				// never defined so use default selected flag from google calendar settings
				return calendar.selected;
			}			
		}
	}
}

function getCalendarName(calendar) {
	// see if user renamed the original calendar title
	if (calendar.summaryOverride) {
		return calendar.summaryOverride;
	} else {
		return calendar.summary;
	}
}

function getCurrentUserAttendeeDetails(event, email) {
    if (!email) {
        throw new Error("Email cannot be empty in getCurrentUserAttendeeDetails");
    }
	let currentUserAttendeeDetails;
	
	if (event.attendees) {
		currentUserAttendeeDetails = event.attendees.find(attendee => {
			return attendee.email == email;
		});
	}
	
	return currentUserAttendeeDetails;
}

function hasUserDeclinedEvent(event, email) {
	var currentUserAttendeeDetails = getCurrentUserAttendeeDetails(event, email)
	if (currentUserAttendeeDetails && currentUserAttendeeDetails.responseStatus == AttendingResponseStatus.DECLINED) {
		return true;
	}
}

function hasUserRespondedToEvent(event, email) {
	var currentUserAttendeeDetails = getCurrentUserAttendeeDetails(event, email)
	if (!currentUserAttendeeDetails || currentUserAttendeeDetails.responseStatus != AttendingResponseStatus.NEEDS_ACTION) {
		return true;
	}
}

function hasUserRespondedYesOrMaybeToEvent(event, email) {
	var currentUserAttendeeDetails = getCurrentUserAttendeeDetails(event, email)
	if (!currentUserAttendeeDetails || (currentUserAttendeeDetails.responseStatus == AttendingResponseStatus.ACCEPTED || currentUserAttendeeDetails.responseStatus == AttendingResponseStatus.TENTATIVE)) {
		return true;
	}
}

function passedRemindOnRespondedEventsOnly(event, calendarSettings, email) {
	if (!calendarSettings.remindOnRespondedEventsOnly || hasUserRespondedYesOrMaybeToEvent(event, email)) {
		return true;
	}
}

function passedShowDeclinedEventsTest(event, showDeclinedEvents, email) {
	return showDeclinedEvents || showDeclinedEvents == undefined || (showDeclinedEvents == false && !hasUserDeclinedEvent(event, email));
}

function passedHideInvitationsTest(event, hideInvitations, email) {
	return !hideInvitations || hasUserRespondedToEvent(event, email);
}

function getEventSource(event, useDescription = true) {
	var source = {};
	
	if (event.source) {
		source = event.source;
	} else {
		// look for link in description and use it as source
		if (useDescription && event.description) {
			const matches = event.description.match(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i);
			if (matches) {
                let link = matches[0].trim();
				if (link) {
                    // patch for this issue: https://github.com/gregjacobs/Autolinker.js/issues/47
                    link = link.split("&nbsp;")[0];
                    
					var title;
					if (link.match("https?://mail.google.com")) {
						title = event.summary;
					} else {
						title = link.replace(/(www.)?/g, "");
					}
					source = {url:link, title:title};
				}
			}
		}
	}
	
	if (source.url) {
		if (!source.title) {
			source.title = "Open URL";
		}
		if (source.url.match("https?://mail.google.com")) {
			source.isGmail = true;
		}
		return source;
	} else {
		return null;
	}
}

function getNotification(notificationsOpened, notificationId) {
	for (var a=0; a<notificationsOpened.length; a++) {
		if (notificationsOpened[a].id == notificationId) {
			return notificationsOpened[a];
		}
	}
}

async function isGroupedNotificationsEnabled() {
	return await storage.get("notificationGrouping") == "groupNotifications";
}

function isColorTooLight(color) {
	let rgb = hexToRgb(color);
	if (rgb) {
		let l = rgbToHsl(rgb[0], rgb[1], rgb[2])[2];
		let isYellow = rgb[0] == 255 && rgb[1] == 253 && rgb[2] == 33; // refer to https://jasonsavard.com/forum/discussion/comment/19187#Comment_19187
		if (l >= 0.85 || isYellow) {
			return true;
		}
	}
}

function getEventColors(params) { // event, darkenColorFlag, cachedFeeds, arrayOfCalendars
	let bgColor;
    const colors = params.cachedFeeds["colors"];
    const event = params.event;

	if (event) {
		if (event.colorId && colors) {
			bgColor = colors.event[event.colorId].background;
		} else {
            const calendar = getEventCalendar(event);
            if (calendar) {
                if (calendar.backgroundColor) {
                    bgColor = calendar.backgroundColor;
                } else {
                    if (calendar.colorId) {
                        bgColor = colors.calendar[calendar.colorId].background;
                    } else {
                        bgColor = "black";
                    }
                }
            } else {
                console.warn("couldn't get calendar for event", event);
                bgColor = "black";
            }
		}
	} else {
		const primaryCalendar = getPrimaryCalendar(params.arrayOfCalendars);
		bgColor = primaryCalendar.backgroundColor;
	}
	
	if (params.darkenColorFlag) {
		// if anything close to white then change it to black (because we can't see it on a white background remindersWindow and notification window
		if (!bgColor || bgColor == "white" || bgColor == "#fff" || bgColor == "#ffffff") {
			bgColor = "black";
		} else {
			bgColor = darkenColor(bgColor);
		}
		return bgColor;
	} else {
		const response = {};
		if (globalThis.blackFontEvents) {
			response.bgColor = bgColor;
		} else {
			response.bgColor = convertToGoogleCalendarColor(bgColor);
		}

		// if (l)uminosity to bright then use a dark foreground color
		if (isColorTooLight(response.bgColor)) {
			response.fgColor = "black";
		} else {
			response.fgColor = "white";
		}
		return response;
	}
}

async function hasRemindersHeader(notifications) {
	return notifications.length >= 2 || await shouldShowReducedDonationMsg(true);
}

// must be declared in global file because when called from bg.openSnoozePopup (the context of the window/screen might be skewed because it takes debugger settings like mobile resolution etc.)
function openReminders(params = {}) {
	return new Promise(async (resolve, reject) => {
        await storage.disable("_remindersWindowClosedByDismissingEvents");
		
		var notifications = params.notifications;
		
        await closeReminders();
	
		// default is notifications opened
		if (!notifications) {
			notifications = globalThis.notificationsOpened || await storage.get("notificationsOpened");
		}
		
		var TOP_TITLE_BAR_HEIGHT_DEFAULT = 31;
		var TOP_TITLE_BAR_HEIGHT_NEWER_WINDOWS = 40;
		var TOP_TITLE_BAR_HEIGHT_MAC = 22;
		var TOP_TITLE_BAR_HEIGHT_LINUX = 22; // guessed
		
		var notificationCount = Math.min(notifications.length, ReminderWindow.MAX_NOTIFICATIONS);
		
		var topTitleSpace;
		if (DetectClient.isNewerWindows()) {
			topTitleSpace = TOP_TITLE_BAR_HEIGHT_NEWER_WINDOWS;
		} else if (DetectClient.isMac()) {
			topTitleSpace = TOP_TITLE_BAR_HEIGHT_MAC;
		} else if (DetectClient.isLinux()) {
			topTitleSpace = TOP_TITLE_BAR_HEIGHT_LINUX;
		} else {
			topTitleSpace = TOP_TITLE_BAR_HEIGHT_DEFAULT;
		}
		var height = (notificationCount * ReminderWindow.NOTIFICATION_HEIGHT) + topTitleSpace + ((notificationCount + 1) * ReminderWindow.MARGIN);
		
		// more than 2 show dismiss all and so make popup higher
		if (await hasRemindersHeader(notifications)) {
			height += ReminderWindow.DISMISS_ALL_HEIGHT;
		}
		
		var width = 510;
		
		if (await storage.get("autosizePopupWindow") && globalThis.devicePixelRatio) {
			// enlarge if using zoom
			width *= globalThis.devicePixelRatio;
			height *= globalThis.devicePixelRatio;
		}
		
		// Passing params by backgroud instead of postmessage or chrome message refer below for bug
        await storage.set("_reminderWindowNotifications", notifications);

        let left, top;
        if (globalThis.screen) {
            left = (globalThis.screen.width/2)-(width/2);
            top = (globalThis.screen.height/2)-(height/2);
        } else {
            // should probably migrate to this api chrome.system.display.getInfo (but it seems like it was mistakenly marked as deprecated, so waiting to see if that gets corrected)
            left = 400;
            top = 300;
        }

		// push up a bit because when we open date picker it clips at bottom
		top -= 20;
	
		//var str = Math.floor(Math.random() * 2) == 0 ? "reminders.html" : "test.html";
		
		chrome.idle.queryState(15, async newState => {
			let url = chrome.runtime.getURL("reminders.html");
			if (params.closeWindowGuide) {
				url += "?closeWindowGuide=true";
			}
			
			const createWindowParams = {
				url:	url,
				width:	Math.round(width),
				height:	Math.round(height),
				left:	Math.round(left),
				top:	Math.round(top),
				type:	"popup",
				state:	"normal"
			};
			
			if (DetectClient.isChrome()) {
				// if user not doing anything for 15 seconds than let's interupt and put the focus on the popup
				if (params.useIdle) {
					if (await storage.get("onlyInterruptIfIdle")) {
						createWindowParams.focused = (newState != "active");
					} else {
						chrome.runtime.sendMessage({
							command: "getPopupDetails"
						}, response => {
							// don't interupt if user is interacting in popup window from toolbar
							if (chrome.runtime.lastError || !response.fromToolbar) {
								createWindowParams.focused = true;
							}
						});
					}
				} else {
					createWindowParams.focused = true;
				}
			}

			console.log(createWindowParams);
			
			chrome.windows.create(createWindowParams, async function(newWindow) {
                await storage.set("reminderWindowId", newWindow.id);
                sendMessageToBG("forgottenReminder.start");
				resolve();
			});
		});

		/*
		 * commented out because onload or sometimes postmessage would not be sent when when called from the popup window, note: it would work when called from the notification window
		bg.snoozePopup.onload = function () {
			// seems window object doesn't exist when called from popup etc. so let's use the bg.window 
	        bg.snoozePopup.postMessage({notifications:notifications}, bg.window.location.href);
	    }
	    */

	});
}

async function closeReminders() {
    const reminderWindowId = await storage.get("reminderWindowId");
    if (reminderWindowId) {
        return new Promise(async (resolve, reject) => {
            chrome.windows.remove(reminderWindowId, async () => {
                if (chrome.runtime.lastError) {
                    console.warn("close reminders: " + chrome.runtime.lastError.message);
                } else {
                    await storage.remove("reminderWindowId");
                }
                resolve();
            });
        });
    }
}

function sortNotifications(notifications) {
	notifications.sort((a, b) => {
		if (a.event.startTime.getTime() < b.event.startTime.getTime()) {
			return +1;
		} else {
			return -1;
		}
	});
}

function isGmailExtension(id) {
	return id == ExtensionId.Gmail || id == ExtensionId.LocalGmail;
}

function sendMessageToGmailExtension(message) {
	return new Promise((resolve, reject) => {
		var recipientExtensionId;
		if (chrome.runtime.id == ExtensionId.LocalCalendar) {
			recipientExtensionId = ExtensionId.LocalGmail;
		} else {
			recipientExtensionId = ExtensionId.Gmail;
		}
		
		chrome.runtime.sendMessage(recipientExtensionId, message, response => {
			if (chrome.runtime.lastError) {
				//console.warn("sendMessageToGmailExtension error: " + chrome.runtime.lastError.message);
				reject(chrome.runtime.lastError.message);
			} else {
				console.log("response", response);
				resolve(response);
			}
		});
	});
}

async function setDNDEndTime(endTime, fromOtherExtension) {
	await storage.set("DND_endTime", endTime);
	updateBadge();
	
	// !!! Important if this was sent from Gmail or other extension then do not send back or eternal sendMessage loop will occur
	if (!fromOtherExtension && await storage.get("syncDND")) {
		sendMessageToGmailExtension({action:"setDNDEndTime", endTime:endTime.toJSON()});
	}
}

async function setDND_off(fromOtherExtension) {
	if (await storage.get("DND_endTime")) {
		await storage.remove("DND_endTime");
	} else {
		await storage.remove("DND_schedule");
	}
	updateBadge();
	
	if (!fromOtherExtension && await storage.get("syncDND")) {
		sendMessageToGmailExtension({action:"turnOffDND"});
	}
}

function setDND_minutes(minutes) {
	var dateOffset = new Date();
	dateOffset.setMinutes(dateOffset.getMinutes() + parseInt(minutes));
	setDNDEndTime(dateOffset);
}

function setDND_today() {
	setDNDEndTime(tomorrow());
}

function openDNDScheduleOptions() {
	openUrl("options.html?highlight=DND_schedule");
}

function setDND_indefinitely() {
	var farOffDate = new Date();
	farOffDate.setYear(2999);
	setDNDEndTime(farOffDate);
}

async function isDND() {
	return await isDNDbyDuration();
}

async function isDNDbyDuration() {
	var endTime = await storage.get("DND_endTime");
	if (endTime) {
		return endTime.isAfter();
	} else {
		return false;
	}
}

function generateLocationUrl(event) {
	var url;
	if (event.location.match("https?://")) {
		url = event.location;
	} else {
		url = "https://maps.google.com/maps?q=" + encodeURIComponent(event.location) + "&source=calendar";
	}
	return url;
}

async function openGoogleCalendarWebsite() {
    var params = {};

    const email = await storage.get("email");

	if (await storage.get("openExistingCalendarTab")) {
		params.urlToFind = Urls.CALENDAR;
	}
	
	openUrl(setUrlParam(Urls.CALENDAR, "authuser", encodeURIComponent(email)), params);
}

function generateTimeDurationStr(params) {
	const event = params.event;
	
	let str = "";
	const startTime = new Date(event.startTime);
	let endTime;
	if (event.endTime) {
		endTime = new Date(event.endTime);
	}
    
    const startDateStr = startTime.toLocaleDateStringJ();

    // Chrome and new Edge supported as of May 12th, NOT Firefox
    const supportsFormatRange = "Intl" in globalThis && Intl.DateTimeFormat.prototype.formatRange;

    if (event.allDay) {
        if (!endTime || Math.round(startTime.diffInDays(endTime)) == -1) {
            str = startDateStr;
        } else {
            endTime.setDate(endTime.getDate()-1);
            if (supportsFormatRange) {
                const formatter = new Intl.DateTimeFormat(locale, getDateFormatOptions());
                try {
                    str = formatter.formatRange(startTime, endTime);
                } catch (error) {
                    console.warn("could not use formatRange", error);
                    str = startDateStr + " - " + endTime.toLocaleDateStringJ();
                }
            } else {
                str = startDateStr + " - " + endTime.toLocaleDateStringJ();
            }
        }
    } else {
        if (params.hideStartDay || !supportsFormatRange) {
            if (endTime.diffInHours(startTime) < 24) {
                str += startTime.toLocaleTimeStringJ() + " - " + endTime.toLocaleTimeStringJ();
            } else {
                str += startTime.toLocaleTimeStringJ() + " - " + endTime.toLocaleStringJ();
            }
        } else {
            const formatter = new Intl.DateTimeFormat(locale, getDateAndTimeFormatOptions());
            str = formatter.formatRange(startTime, endTime);
            // patch for fr-FR ex. jeudi 21 mai 'à' 7:00 PM – 8:00 PM
            str = str.replace(" 'à' ", " à ");
        }
    }

    return str;
}

async function deleteEvent(event, sendNotifications) {
    let response;
    
    if (event.kind == TASKS_KIND) {
        const taskList = getTaskList(event);
        response = await oauthDeviceSend({
            type: "DELETE",
            url: `${TASKS_BASE_URL}/lists/${taskList.id}/tasks/${event.id}`
        }, oAuthForTasks);
    } else {
        response = await ensureRecurringEventPrompt({event:event});
        if (response.cancel) {
            return response;
        }
    
        // save this for inner response below
        const changeAllRecurringEvents = response.changeAllRecurringEvents;
        
        let url = `/calendars/${encodeURIComponent(await getCalendarIdForAPIUrl(event))}/events/${changeAllRecurringEvents ? event.recurringEventId : event.id}`;
        if (sendNotifications) {
            url = setUrlParam(url, "sendUpdates", "all");
        }
        
        try {
            response = await oauthDeviceSend({
                type: "DELETE",
                url: url
            });
            response.changeAllRecurringEvents = changeAllRecurringEvents;
        } catch (error) {
            if (error.code == 410) {
                console.info("already deleted so just removing");
                response = {};
            } else {
                throw error;
            }
        }
    }

    await updateCachedFeed(event, {operation: "remove"});

    return response;
}

async function updateCachedFeed(event, params) {
    const calendarId = getEventCalendarId(event);
    
    // remove from cachedfeeds
    let modifiedCachedFeeds;
    const cachedFeeds = params.cachedFeeds || await storage.get("cachedFeeds");
    const calendar = cachedFeeds[calendarId];
    if (calendar) {
        if (params.operation == "add") {
            calendar.items.push(event);
            modifiedCachedFeeds = true;
        } else {
            modifiedCachedFeeds = calendar.items.some((cachedEvent, index) => {
                if (cachedEvent.id == event.id) {
                    if (params.operation ==  "remove") {
                        console.log("removed from cachedfeeds");
                        calendar.items.splice(index, 1);
                    } else if (params.operation == "update") {
                        calendar.items[index] = event;
                    } else {
                        throw "Operation not found in updateCachedFeed: " + params.operation;
                    }
                    return true;
                }
            });
        }
    }
    
    if (modifiedCachedFeeds) {
        await storage.set("cachedFeeds", cachedFeeds).then(async () => {

            // do this only for tasks because the other feeds will perform a partial sync
            // add this because when I would delete a task and then create an event and then undo, it would run a delay 1 minute polling and overwrite the cachedFeeds from the background (not from storage)
            if (calendarId == TASKS_CALENDAR_OBJECT.id) {
                await sendMessageToBG("reInitCachedFeeds");
            }
            
            if (!params.ignoreCheckEvents) {
                sendMessageToBG("checkEvents", {ignoreNotifications: true});
            }
        });
    }
}

function parseEventDates(event) { 
	// Patch for Date objects because they are not stringified as an object AND remove old events
    event.startTime = parseDate(event.startTime);
	if (event.endTime) {
		event.endTime = parseDate(event.endTime);
	}
	if (event.reminderTimes) {
		event.reminderTimes.forEach(thisEvent => {
			if (thisEvent.time) {
                thisEvent.time = parseDate(thisEvent.time);
			} else {
				console.warn("no time: ", thisEvent);
			}
		});
	} else {
		event.reminderTimes = [];
	}
}

function initEventDates(theseEvents) {
	var event;
	for (var a=0; event=theseEvents[a], a<theseEvents.length; a++) {
		if (event.startTime) {
			parseEventDates(event);
			var startTime = event.startTime;
			if (startTime && startTime.isBefore(today().subtractDays(DAYS_TO_REMOVE_OLD_EVENTS))) { // last # = days
				console.log("removed old event: " + event.id + " " + startTime);
				// can't use splice with $.each atleast as of jquery 1.6.2
				theseEvents.splice(a, 1);
				a--;
			}
		} else {
			//console.log("ignore non reminder event: " + getSummary(event), event);
			//theseEvents.splice(a, 1);
			//a--;
		}
	}
}

function findEvent(event, eventsShown) {
	for (var a=0; a<eventsShown.length; a++) {
		if (isSameEvent(eventsShown[a], event)) {
			console.log("find events");
			return eventsShown[a];
		}
	}
}

function findEventById(id, events) {
	for (var a=0; a<events.length; a++) {
		if (events[a].id == id) {
			return events[a];
		}
	}
}

// used because some events have same ids recurring events that are busy and also invited refer to bug: https://jasonsavard.com/forum/discussion/5121/multiple-notifications/p2
function findEventByIdAndCalendar(event, events) {
	for (var a=0; a<events.length; a++) {
		if (events[a].id == event.id && events[a].calendarId == event.calendarId) {
			return events[a];
		}
	}
}

function isCurrentlyDisplayed(event, notificationsQueue) {
	for (var a=0; notification=notificationsQueue[a], a<notificationsQueue.length; a++) {
		if (isSameEvent(event, notification.event)) {
			return true;
		}
	}
	return false;
}

async function getSnoozers(theseEvents) {
    const snoozers = await storage.get("snoozers");
    if (snoozers.length) {
        const events = (theseEvents || globalThis.events || await getEvents());
        snoozers.forEach(snoozer => {
            let event = findEventByIdAndCalendar(snoozer.event, events);
            if (!event) {
                // user might have changed calendar of event after being snoozed, so let's just look for event id
                console.warn("event might have changed calendar", snoozer);
                event = findEventById(snoozer.event.id, events);
            }
            if (event) {
                snoozer.event = event;
            } else {
                // when an event calendar is changed, gcm removes event from original calendar and another gcm updates event with new calendar
                console.warn("event possibly removed from calendar but not yet added to other more info in comments");
            }
        });
    }
    return snoozers;
}

//get future snoozes, includeAlreadyShown
async function getFutureSnoozes(snoozers, params = {}) {
    const notificationsQueue = await storage.get("notificationsQueue");
	let futureSnoozes = [];
	snoozers.forEach(snoozer => {
		if ((!snoozer.email || snoozer.email == params.email) && snoozer.time.getTime() >= Date.now()) {
			if ((params.includeAlreadyShown || !isCurrentlyDisplayed(snoozer.event, notificationsQueue))) {
				if (!snoozer.time.isToday() || (snoozer.time.isToday() && !params.excludeToday)) {
					snoozer.isSnoozer = true;
					futureSnoozes.push(snoozer);
				}
			}
		}
	});
	return futureSnoozes;
}

function getEventUrl(event, email) {
    const url = event.htmlLink ?? Urls.CALENDAR;
    return setUrlParam(url, "authuser", encodeURIComponent(globalThis.email || email));
}

async function getBadgeIconUrl(state, keepDate) {
	if (!state) {
		state = "";
	}
	
	let badgeIcon = await storage.get("badgeIcon") || "default";
	
	var withDateStr;
	if (keepDate) {
		withDateStr = badgeIcon;
	} else {
		if (badgeIcon == "default3WithDate") {
			badgeIcon = "default";
		}
		withDateStr = badgeIcon.replace("WithDate", "")
	}
	
	return "images/icons/icon-19_" + withDateStr + state + ".png";
}

function getUserFriendlyReminderTime(minutes, allDay, patchForAllDayBeforeXTime) {
    let obj;

    // if larger than a week AND it's a multiple of 7 days, because we don't want 10 days to equal 1.45 weeks
	if (minutes >= WEEK_IN_MINUTES && minutes % WEEK_IN_MINUTES == 0) {
        obj = {
            value: minutes / WEEK_IN_MINUTES,
            period: "weeks"
        }
	} else if ((minutes >= DAY_IN_MINUTES && minutes % DAY_IN_MINUTES == 0) || (allDay && minutes == 0)) {
        obj = {
            value: minutes / DAY_IN_MINUTES,
            period: "days"
        }
    } else if (minutes >= (WEEK_IN_MINUTES - DAY_IN_MINUTES) && allDay && patchForAllDayBeforeXTime) {
        // ex. 1 week before at 9am
        const weeks = Math.ceil(minutes / WEEK_IN_MINUTES);
        obj = {
            value: weeks,
            period: "weeks",
            beforeTime: WEEK_IN_MINUTES % minutes
        }
    } else if (minutes >= (DAY_IN_MINUTES - HOUR_IN_MINUTES) && allDay && patchForAllDayBeforeXTime) {
        // ex. 2 days before at 9am
        const days = Math.ceil(minutes / DAY_IN_MINUTES);
        obj = {
            value: days,
            period: "days",
            beforeTime: DAY_IN_MINUTES - (minutes % DAY_IN_MINUTES)
        }
	} else if (minutes >= HOUR_IN_MINUTES && minutes % HOUR_IN_MINUTES == 0) {
        if (allDay && patchForAllDayBeforeXTime) {
            // ex. 1 day before at 9am
            obj = {
                value: 1,
                period: "days",
                beforeTime: DAY_IN_MINUTES % minutes
            }
        } else {
            obj = {
                value: minutes / HOUR_IN_MINUTES,
                period: "hours"
            }
        }
	} else if (allDay && patchForAllDayBeforeXTime) {
        obj = {
            value: 1,
            period: "days",
            beforeTime: DAY_IN_MINUTES - minutes
        }
    } else {
        obj = {
            value: minutes,
            period: "minutes"
        }
    }
    
    return obj;
}

function initReminderPeriod($reminderValuePerPeriod, $reminderPeriod, $reminderMinutes, allDay) {
	if (allDay) {
		$reminderPeriod.find("[value='minutes'], [value='hours']").attr("hidden", "");
	} else {
		$reminderPeriod.find("[value='minutes'], [value='hours']").removeAttr("hidden");
	}
	
    const reminderMinutes = $reminderMinutes.prop("value");
    
    const obj = getUserFriendlyReminderTime(reminderMinutes, allDay);
    $reminderValuePerPeriod.prop("value", obj.value);
    $reminderPeriod[0].selected = obj.period;
}

function updateReminderMinutes($reminderPeriod, $reminderMinutes, $reminderValuePerPeriod) {
	if ($reminderPeriod[0].selected == "minutes") {
		$reminderMinutes.prop("value", $reminderValuePerPeriod[0].value);
	} else if ($reminderPeriod[0].selected == "hours") {
		$reminderMinutes.prop("value", $reminderValuePerPeriod[0].value * HOUR_IN_MINUTES);
	} else if ($reminderPeriod[0].selected == "days") {
		$reminderMinutes.prop("value", $reminderValuePerPeriod[0].value * DAY_IN_MINUTES);
	} else if ($reminderPeriod[0].selected == "weeks") {
		$reminderMinutes.prop("value", $reminderValuePerPeriod[0].value * WEEK_IN_MINUTES);
	}
}

async function getDateFormatFromCalendarSettings() {
    const calendarSettings = await storage.get("calendarSettings");

    let dateFormatStr;
	if (calendarSettings.dateFieldOrder == "MDY") {
		dateFormatStr = "M d, yy";
	} else if (calendarSettings.dateFieldOrder == "DMY") {
		dateFormatStr = "d M yy";
	} else if (calendarSettings.dateFieldOrder == "YMD") {
		if (locale == "ja") {
			dateFormatStr = "yy年Md日";
		} else {
			dateFormatStr = "yy M d";
		}
	}
	return dateFormatStr;
}

async function generateDatePickerParams() {
    const calendarSettings = await storage.get("calendarSettings");
	var dayNamesMin = dateFormat.i18n.dayNamesShort.shallowClone();
	dayNamesMin.forEach((dayName, index) => {
		// don't cut day names in asian languages because they change the meaning of the word
		if (!isAsianLangauge()) {
			dayNamesMin[index] = dayName.charAt(0);
		}
	});
	
	return {
		firstDay:			calendarSettings.weekStart,
		isRTL:				getMessage("dir") == "rtl",
		showButtonPanel:	false,
		closeText:			getMessage("close"),
		dateFormat:			await getDateFormatFromCalendarSettings(),
		monthNames:			dateFormat.i18n.monthNames,
		monthNamesShort:	dateFormat.i18n.monthNamesShort,
		dayNames:			dateFormat.i18n.dayNames,
		dayNamesShort:		dateFormat.i18n.dayNamesShort,
		dayNamesMin:		dayNamesMin
	}
}

async function generateTimePickerParams() {
	var timeFormatStr;
	if (twentyFourHour) {
		timeFormatStr = 'H:i';
	} else {
		timeFormatStr = 'g:i a';
	}

	return {
		scrollDefault:'now',
		timeFormat:timeFormatStr
	};
}

function isCalendarWriteable(calendar) {
	return calendar.accessRole == CalendarAccessRole.OWNER || calendar.accessRole == CalendarAccessRole.WRITER;
}

function isCalendarExcludedForNotifs(calendar, excludedCalendars) {
    return excludedCalendars[calendar.id] === true;
}

// Assumes shared calendars with no default reminders are excluded, BUT this fails if user sets reminders per event on a calendar with no default reminders
function isCalendarExcludedForNotifsByOptimization(calendar, excludedCalendars) {
	return isCalendarExcludedForNotifs(calendar, excludedCalendars) || (typeof excludedCalendars[calendar.id] === "undefined" && calendar.accessRole != CalendarAccessRole.OWNER && (!calendar.defaultReminders || calendar.defaultReminders.length == 0));
}

function isCalendarUsedInExtension(calendar, email, selectedCalendars, excludedCalendars, desktopNotification) {
    return isCalendarSelectedInExtension(calendar, email, selectedCalendars) || (desktopNotification && !isCalendarExcludedForNotifsByOptimization(calendar, excludedCalendars) && !isGadgetCalendar(calendar));
}

async function formatEventAddedMessage(title, eventEntry) {
	var message;
	if (eventEntry.startTime) {
		var atStr = "";
		if (!eventEntry.allDay) {
			atStr = "At";
		}
		if (eventEntry.startTime.isToday()) {
			message = getMessage("addedForToday" + atStr, [title, eventEntry.startTime.toLocaleTimeStringJ()]);
		} else if (eventEntry.startTime.isTomorrow()) {
			message = getMessage("addedForTomorrow" + atStr, [title, eventEntry.startTime.toLocaleTimeStringJ()]);
		} else {
            if (eventEntry.allDay) {
                message = getMessage("addedForSomeday", [title, eventEntry.startTime.toLocaleDateStringJ()]);
            } else {
                message = getMessage("addedForSomeday", [title, eventEntry.startTime.toLocaleStringJ()]);
            }
		}
	} else {
		message = getMessage("eventAdded");
	}
	return message;
}

function findIcon(str) {
	var eventIcon;
	
	if (str) {
		if (/test event/i.test(str)) {
			eventIcon = "movie";
		} else if (str.hasWord("compost")) {
			eventIcon = "compost";
		} else if (str.hasWord("soccer") || (getPreferredLanguage() == "en-GB" && str.hasWord("football"))) {
			eventIcon = "soccer";
		} else if (str.hasWord("football") && getPreferredLanguage() != "en-GB") {
			eventIcon = "football";
		} else if (str.hasWord("cat")) {
			eventIcon = "cat";
		} else if (str.hasWord("doctor") || str.hasWord("dr") || str.hasWord("dr.")) {
			eventIcon = "doctor";
		} else if (str.hasWord("bath")) {
			eventIcon = "bath";
		} else if (str.hasWord("dentist")) {
			eventIcon = "dentist";
		} else if (str.hasWord("yoga")) {
			eventIcon = "yoga";
		} else if (str.hasWord("shave")) {
			eventIcon = "shave";
		} else if (str.hasWord("tax") || str.hasWord("taxes") || str.hasWord("cab")) {
			eventIcon = "taxes";
		} else if (str.hasWord("eye") || str.hasWord("eyes") || str.hasWord("optometrist")) {
			eventIcon = "eye";
		} else if (str.hasWord("bike") || str.hasWord("bicycle") || str.hasWord("biking")) {
			eventIcon = "bike";
		} else if (str.hasWord("plants") || /flowers?/i.test(str)) {
			eventIcon = "plants";
		} else if (str.hasWord("garbage")) {
			eventIcon = "garbage";
		} else if (str.hasWord("recycle") || str.hasWord("recycling")) {
			eventIcon = "recycle";
		} else if (str.hasWord("food") || str.hasWord("cook")) {
			eventIcon = "food";
		} else if (str.hasWord("lunch") || str.hasWord("breakfast") || str.hasWord("brunch") || str.hasWord("dinner") || str.hasWord("supper")) {
			eventIcon = "local-dining";
		} else if (str.hasWord("leave") || str.hasWord("run") || str.hasWord("exercise") || str.hasWord("workout") || str.hasWord("race")) {
			eventIcon = "directions-run";
		} else if (str.hasWord("hospital")) {
			eventIcon = "local-hospital";
		} else if (str.hasWord("pills") || str.hasWord("medication")) {
			eventIcon = "local-pharmacy";
		} else if (str.hasWord("groceries")) {
			eventIcon = "local-grocery-store";
		} else if (str.hasWord("laundry")) {
			eventIcon = "local-laundry-service";
		} else if (str.hasWord("cafe") || str.hasWord("coffee") || str.hasWord("tea")) {
			eventIcon = "local-cafe";
		} else if (str.hasWord("flight") || str.hasWord("airplane") || str.hasWord("airport")) {
			eventIcon = "flight";
		} else if (str.hasWord("car")) {
			eventIcon = "directions-car";
		} else if (str.hasWord("rent") || str.hasWord("mortgage")) {
			eventIcon = "rent";
		} else if (str.hasWord("bank") || str.hasWord("cash") || str.hasWord("money") || str.hasWord("funds") || str.hasWord("dollar") || str.hasWord("atm")) {
			eventIcon = "dollar";
		} else if (str.hasWord("pizza")) {
			eventIcon = "local-pizza";
		} else if (str.hasWord("bus")) {
			eventIcon = "directions-bus";
		} else if (str.hasWord("call") || str.hasWord("phone")) {
			eventIcon = "local-phone";
		} else if (str.hasWord("drinks") || str.hasWord("party") || str.hasWord("cocktail")) {
			eventIcon = "local-bar";
		} else if (str.hasWord("sleep") || str.hasWord("hotel")) {
			eventIcon = "local-hotel";
		} else if (str.hasWord("meeting") || str.hasWord("workshop")) {
			eventIcon = "group";
		} else if (str.hasWord("cake") || /bday|birthdays?|cumpleaños/i.test(str)) {
			eventIcon = "cake";
		} else if (str.hasWord("school") || str.hasWord("class") || str.hasWord("classes") || str.hasWord("course")) {
			eventIcon = "school";
		} else if (str.hasWord("bank")) {
			eventIcon = "account-balance";
		} else if (str.hasWord("email")) {
			eventIcon = "mail";
		} else if (str.hasWord("updates")) {
			eventIcon = "updates";
		} else if (str.hasWord("movie")) {
			eventIcon = "movie";
		}		
	}
	return eventIcon;
}

function setEventIcon(params) { // event, $eventIcon
    var eventIcon;
    
    const event = params.event;
    const $eventIcon = params.$eventIcon;
    const eventColors = getEventColors({
        event: event,
        darkenColorFlag: true,
        cachedFeeds: params.cachedFeeds,
        arrayOfCalendars: params.arrayOfCalendars
    });

	var summary = getSummary(event);
	var calendar = getEventCalendar(event);
	
	// try event title
	eventIcon = findIcon(summary);
	if (!eventIcon) {
		if (calendar.summaryOverride) {
			// try calendar "nice" name
			eventIcon = findIcon(calendar.summaryOverride);
		}
		if (!eventIcon) {
			// try calendar name
			eventIcon = findIcon(calendar.summary);
		}
		
		if (!eventIcon) {
			// marie-eve's "Blog" calendar for food :)
			if (calendar.id == "qk6i02icprnhcj6mqt8cijoloc@group.calendar.google.com") {
				eventIcon = "food";
			}
		}
	}
	
	if (eventIcon) {
		$eventIcon
			.css({
                fill: eventColors
            })
		;
		if (eventIcon) {
			var $g = $("#" + eventIcon).clone();
			var viewBoxValue = "0 0 ";
			if ($g.attr("width")) {
				viewBoxValue += $g.attr("width") + " " + $g.attr("height");
			} else {
				viewBoxValue += "24 24";
			}
			var $svg = $("<svg height=24/>");
			$svg[0].setAttribute("viewBox", viewBoxValue); // must use .setAttribute because jquery does a tolowercase of attribute name but polymer needs viewBox with capital B
			$svg.append($g.find("*"));
			$eventIcon.append($svg);
			$eventIcon.find("path[stroke]").css("stroke", eventColors);
		}
		$eventIcon.removeAttr("hidden");
		return $eventIcon;
	} else {
		$eventIcon.attr("hidden", "");
	}
}

function getPrimaryCalendar(calendars) {
	return calendars.find(calendar => {
		return calendar.primary;
	});
}

async function getDefaultCalendarId(calendars) {
    let calendarId = await storage.get("defaultCalendarId");
    if (!calendarId) {
        const primaryCalendar = getPrimaryCalendar(calendars);
        if (primaryCalendar) {
            calendarId = primaryCalendar.id;
        }
    }
    return calendarId;
}

async function getEventNotificationDetails(event) {
	const title = getSummary(event);
	const calendar = getEventCalendar(event);
	
	// show calendar name if not the main one
	var calendarName;
	const showCalendarInNotification = await storage.get("showCalendarInNotification");
	if ((showCalendarInNotification == "onlyNonPrimary" && !calendar.primary) || showCalendarInNotification == "always") {
		calendarName = getCalendarName(calendar);
		if (!calendarName) {
			calendarName = "";
		}
	}

	const timeElapsed = await getTimeElapsed(event);
	
	return {title:title, calendarName:calendarName, timeElapsed:timeElapsed};
}

async function sortEvents(events) {
    console.time("allDayVStimeSpecific")
    const allDayVStimeSpecific = await storage.get("showTimeSpecificEventsBeforeAllDay") ? -1 : 1;
    console.timeEnd("allDayVStimeSpecific")
	events.sort(function(e1, e2) {
		if (e1.allDay && !e2.allDay && e1.startTime.isSameDay(e2.startTime)) {
			return allDayVStimeSpecific * -1;
		} else if (!e1.allDay && e2.allDay && e1.startTime.isSameDay(e2.startTime)) {
			return allDayVStimeSpecific * +1
		} else {
			var retValue = null;
			try {
				retValue = e1.startTime.getTime() - e2.startTime.getTime();
			} catch (e) {
				logError("time diff error: " + e1 + "_" + e2);
			}
			if (e1.allDay && e2.allDay && e1.startTime.isSameDay(e2.startTime)) {
				// make sure no null summaries "Untitled event"
				if (e1.summary && e2.summary) {
					let aCalendar = getEventCalendar(e1);
					let bCalendar = getEventCalendar(e2);
					if (aCalendar.primary && !bCalendar.primary) {
						return -1;
					} else if (!aCalendar.primary && bCalendar.primary) {
						return +1;
                    } else if (aCalendar.id == TASKS_CALENDAR_OBJECT.id && bCalendar.id != TASKS_CALENDAR_OBJECT.id) {
                        return -1;
                    } else if (aCalendar.id != TASKS_CALENDAR_OBJECT.id && bCalendar.id == TASKS_CALENDAR_OBJECT.id) {
                        return +1;
					} else {
						return e1.summary.localeCompare(e2.summary);
					}
				} else {
					return -1;
				}
			} else {
				return retValue;
			}
		}
	});
}

function getStartDateBeforeThisMonth() {
	var date = new DateZeroTime();
    date.setDate(1);
	date.setDate(date.getDate()-MAX_POSSIBLE_DAYS_FROM_NEXT_MONTH);
	return date; 
}

async function getEndDateAfterThisMonth() {
    const calendarView = await storage.get("calendarView");
    const customView = await storage.get("customView");
	var date = new DateZeroTime();
    date.setDate(1);
	if (calendarView == CalendarView.CUSTOM && isCustomViewInWeeks(customView)) {
		date = date.addDays(31 + (7 * customView));
	} else if (calendarView == CalendarView.LIST_WEEK) {
		date = date.addDays(31 + (7 * LIST_VIEW_WEEKS));
	} else {
		date = date.addDays(31 + MAX_POSSIBLE_DAYS_FROM_NEXT_MONTH);
	}
	return date;
}

async function getLastFetchedDate(feedId) {
	const feed = cachedFeedsDetails[feedId];
	if (feed && feed.CPlastFetched) {
		return new Date(feed.CPlastFetched);
	}
}

async function getCachedFeedDetails(feedId) {
    if (feedId) {
        // must initiate feed in object to obtain a reference
        if (!cachedFeedsDetails[feedId]) {
            cachedFeedsDetails[feedId] = {};
        }
        return cachedFeedsDetails[feedId];
    } else {
        return cachedFeedsDetails;
    }
}

function requestPermission(params = {}) {
	return new Promise((resolve, reject) => {
        if (params.email) {
            localStorage["emailAccountRequestingOauth"] = params.email;
        }
		showLoading();

		let oauthMethod;
		if (params.initOAuthContacts) {
			oauthMethod = oAuthForContacts;
        } else if (params.initOAuthTasks) {
            oauthMethod = oAuthForTasks;
		} else {
			oauthMethod = oAuthForDevices;
        }
        
        if (params.useGoogleAccountsSignIn) {
            chrome.windows.getCurrent(windowResponse => {
                // temp
                console.log("windowResponse", windowResponse);
                localStorage._currentWindowId = windowResponse.id;

                oauthMethod.openPermissionWindow(params).then(permissionWindow => {
                    localStorage._permissionWindowId = permissionWindow.id;
                    window.permissionWindow = permissionWindow;
                    window.userResponsedToPermissionWindow = false;

                    // detect when window is closed to remove loading message
                    var pollTimer = setInterval(function () {
                        if (!window.permissionWindow) {
                            clearInterval(pollTimer);
                            console.log("userResponsedToPermissionWindow: " + window.userResponsedToPermissionWindow);
                            // check if the user just closed window without accepting permission, if so just hide the loading
                            if (!window.userResponsedToPermissionWindow) {
                                hideLoading();
                            }
                        }
                    }, 4000);
                });
            });
        } else {
            // Chrome sign-in
            params.refetch = true;
            oauthMethod.getAccessToken(params).then(response => {
                resolve(response.tokenResponse.userEmail);
            }).catch(error => {
                hideLoading();
                reject(error);
            });
        }
	}).then(email => {
		// should only arrive here from chrome sign-in (as this is called also in the onMessage callback)
		if (params.initOAuthContacts) {
			return postPermissionsGrantedForContacts(email);
        } else if (params.initOAuthTasks) {
            return postTasksGranted(email);
		} else {
			return postPermissionsGranted(email);
		}
	});
}

function postPermissionsGranted(email) {
    chrome.runtime.sendMessage({ command: "grantPermissionToCalendars", email: email });
    return sendMessageToBG("pollServer", { grantingAccess: true, bypassCache: true }).then(async () => {
		if (!await storage.get("verifyPaymentRequestSent")) {
			Controller.verifyPayment(ITEM_ID, email).then(response => {
				if (response.unlocked) {
					Controller.processFeatures();
				}
			});
			await storage.enable("verifyPaymentRequestSent");
		}
	});
}

async function postTasksGranted(email) {
    const selectedCalendars = await storage.get("selectedCalendars");
    if (!selectedCalendars[email]) {
		selectedCalendars[email] = {};
	}
    selectedCalendars[email][TASKS_CALENDAR_OBJECT.id] = true;
    await storage.set("selectedCalendars", selectedCalendars);

    chrome.runtime.sendMessage({ command: "grantPermissionToTasks", email: email });
    return sendMessageToBG("pollServer", { grantingAccess: true, bypassCache: true })
}

async function postPermissionsGrantedForContacts(email) {
    var contactsData = await storage.get("contactsData");
    if (!contactsData) {
        contactsData = [];
    }

    const response = await fetchContacts(email);
    var dataIndex = getContactDataItemIndexByEmail(contactsData, response.contactDataItem.userEmail);
    if (dataIndex != -1) {
        console.log('found: updating existing contactsDataItem')
        contactsData[dataIndex] = response.contactDataItem;
    } else {
        console.log("creating new contactsDataItem");
        contactsData.push(response.contactDataItem);
    }

    console.log("contactdata: ", contactsData);
    await storage.set("contactsData", contactsData);
}

function openPermissionsDialog(params = {}) {
	return new Promise((resolve, reject) => {
		var $dialog = initTemplate("permissionDialogTemplate");
        sendGA("permissions", "openPermissionsDialog");
        
        if (supportsChromeSignIn() && !params.useGoogleAccountsSignIn) {
            if (params.secondAttempt) {
                $dialog.find("#tryGoogleAccountsSignInMessage").unhide();
                $dialog.find(".chromeSignIn").removeClass("colored");
                $dialog.find(".googleAccountsSignIn")
                    //.addClass("colored")
                    //.attr("raised", true)
                    ;
            } else {
                $dialog.find("#tryGoogleAccountsSignInMessage").hidden();
                $dialog.find(".chromeSignIn").addClass("colored");
                $dialog.find(".googleAccountsSignIn")
                    //.removeClass("colored")
                    //.removeAttr("raised")
                    ;
            }
        } else {
            $dialog.find(".chromeSignIn").remove();
            $dialog.find("[msg='or']").remove();
            //$dialog.find(".googleAccountsSignIn").addClass("colored");
        }

		if (params.googlePhotos) {
			$dialog.find("#googlePhotosHeader").unhide();
			$dialog.find(".cancel").unhide();
		} else {
			$dialog.find("#googlePhotosHeader").hidden();
			$dialog.find(".cancel").hidden();
		}
		$dialog.find(".chromeSignIn").off().click(() => {
			hideMessage();
			sendGA("permissions", "grantAccess", "start");
			requestPermission(params).then(async () => {
                sendGA("permissions", "grantAccess", "success");
                await sleep(200);
                resolve();
			}).catch(error => {
				sendGA("permissions", "grantAccess", "error: " + error);
				params.secondAttempt = true;
				openPermissionsDialog(params);
			});
		});
		$dialog.find(".googleAccountsSignIn")
			.off().click(() => {
				sendGA("permissions", "otherAccounts");
				hideMessage();
				showLoading();
				$dialog[0].close();
                params.useGoogleAccountsSignIn = true;
				requestPermission(params).then(() => {
					resolve({ useGoogleAccountsSignIn: true });
				}).catch(error => {
					params.secondAttempt = true;
					openPermissionsDialog(params);
				});
			})
			;
		$dialog.find(".moreInfo").off().click(() => {
			openUrl("https://jasonsavard.com/wiki/Granting_access?ref=calendarChecker");
		});

		openDialog($dialog);
	});
}

async function initOauthAPIs(params = {}) {
    oAuthForDevices = new OAuthForDevices({
        scope: [Scopes.CALENDARS_READ, Scopes.EVENTS_READ_WRITE].join(" "),
        storageKey: "tokenResponses",
        securityTokenKey: "_calendarSecurityToken"
    });

    oAuthForTasks = new OAuthForDevices({
        scope: [Scopes.TASKS_READ_WRITE].join(" "),
        storageKey: "tokenResponsesTasks",
        securityTokenKey: "_tasksSecurityToken",
        getUserEmail: async function(tokenResponse, sendOAuthRequest) {
            if (localStorage["emailAccountRequestingOauth"]) {
                const data = await sendOAuthRequest({
                    tokenResponse: tokenResponse,
                    //userEmail: localStorage["emailAccountRequestingOauth"],
                    url: `${TASKS_BASE_URL}/users/@me/lists`,
                });
                console.log("tasks data", data);

                const response = {
                    userEmail: localStorage["emailAccountRequestingOauth"]
                }
                return response;
            } else {
                throw "JERROR: No email specified";
            }
        }
    });

    oAuthForContacts = new OAuthForDevices({
        scope: [Scopes.CONTACTS_READ, Scopes.CONTACTS_OTHER_READ, Scopes.USERINFO_PROFILE].join(" "),
        storageKey: "tokenResponsesContacts",
        securityTokenKey: "_contactsSecurityToken",
        getUserEmail: async function(tokenResponse, sendOAuthRequest) {
            if (localStorage["emailAccountRequestingOauth"]) {
                const data = await sendOAuthRequest({
                    tokenResponse: tokenResponse,
                    //userEmail: localStorage["emailAccountRequestingOauth"],
                    url: "https://people.googleapis.com/v1/people/me",
                    data: {
                        "personFields":	"names,photos"
                    }
                });
    
                const response = {
                    userEmail: localStorage["emailAccountRequestingOauth"]
                }
    
                if (data) {
                    console.log(data);
                    // info pulled here ie. (.name, .photosUrl) must be explicitly also in the getAccessToken method
                    if (data.names) {
                        response.name = data.names[0].displayName;
                    }
    
                    if (data.photos?.[0].url) {
                        response.photoUrl = data.photos[0].url;
                    }
                }
                
                return response;
            } else {
                throw "JERROR: No email specified";
            }
        }
    });
}

function generateCalendarColors(cachedFeeds, calendars) {
	var calendarColors = cachedFeeds["colors"];
	console.log("colors", calendarColors);
	if (calendarColors) {
		var calendarColorsCSS = "";

        calendarColors.calendar[TASKS_CALENDAR_OBJECT.id] = {background: "yellow", foreground: "green"}

		for (key in calendarColors.calendar) {

			var color;

			for (var a = 0; a < calendars.length; a++) {
				if (calendars[a].colorId == key) {
					color = convertToGoogleCalendarColor(calendars[a].backgroundColor);
					break;
				}
			}

			calendarColorsCSS += "[color-id='" + key + "'] {--paper-checkbox-checked-color:";
			if (color == "#ffffff") {
				calendarColorsCSS += "#fafafa;--paper-checkbox-unchecked-color: #fafafa;--paper-checkbox-checkmark-color:black";
			} else {
				if (isColorTooLight(color)) {
					color = darkenColor(color);
				}
				calendarColorsCSS += color + ";--paper-checkbox-unchecked-color: " + color;
			}
			calendarColorsCSS += "}\n";
		}
		return calendarColorsCSS;
	}
}

async function fetchContacts(userEmail, sync) {
    var contactsData = await storage.get("contactsData");
    if (!contactsData) {
        contactsData = [];
    }

    let contactDataItem = findContactDataItemByEmail(contactsData, userEmail);
    if (!contactDataItem) {
        contactDataItem = {
            version:	CONTACTS_STORAGE_VERSION,
            userEmail:	userEmail,
            contacts:	[]
        };
    }
    contactDataItem.lastFetch = new Date().toString();

    async function fetchData(sync, resource) {
        let urlBase;
        const urlParams = new URLSearchParams();
        let itemsRootId;

        if (resource == "otherContacts") {
            urlBase = "https://people.googleapis.com/v1/otherContacts";
            urlParams.set("readMask", "emailAddresses,names,phoneNumbers");
            itemsRootId = "otherContacts";
        } else {
            urlBase = "https://people.googleapis.com/v1/people/me/connections";
            urlParams.set("personFields", "emailAddresses,names,phoneNumbers,photos,metadata");
            itemsRootId = "connections";
        }
        urlParams.set("pageSize", "1000");
    
        if (sync) {
            urlParams.set("syncToken", resource == "otherContacts" ? contactDataItem.otherContactsSyncToken : contactDataItem.syncToken);
        } else {
            urlParams.set("requestSyncToken", true);
        }

        let data;
        try {

            /*
            if (resource != "otherContacts" && sync && localStorage["test"]) {
                throw "test sync error";
            }
            */

            data = await getAllAPIData({
                oauthForDevices: oAuthForContacts,
                userEmail: userEmail,
                url: `${urlBase}?${urlParams.toString()}`,
                itemsRootId: itemsRootId
            });
    
            console.log("sync - data.syncToken", resource, sync, data.syncToken);
    
            if (data.syncToken) {
                if (resource == "otherContacts") {
                    contactDataItem.otherContactsSyncToken = data.syncToken;
                } else {
                    contactDataItem.syncToken = data.syncToken;
                }
            }
        } catch (error) {
            if (sync) {
                if (error.code == 410) { // otherContacts call actually returns 400 for sync expiration
                    console.warn("Sync token expiration, they expire after 7 days so do a full sync", error); // https://developers.google.com/people/api/rest/v1/people.connections/list
                } else {
                    console.error("Might be a token expiration, doing a full anyways, sync error is:", error);
                }
                data = await fetchData(false, resource);

                const resourcePrefix = resource == "otherContacts" ? "otherContacts" : "people";
                // remove all contacts that came from user's contact (not their other contacts)
                contactDataItem.contacts = contactDataItem.contacts.filter(contact => !contact.resourceName.includes(`${resourcePrefix}/`));
            } else {
                console.error("Unknown sync error: " + error);
                throw error;
            }
        }

        return data; 
    }

    let contactsHaveBeenUpdated;

    const responses = await Promise.all([
        fetchData(sync),
        fetchData(sync, "otherContacts")
    ]);
    
    responses.forEach(data => {
        console.log("data", data);

        if (data.items?.length) {
            contactsHaveBeenUpdated = true;
        }

        data.items.forEach(item => {
            const contact = {
                resourceName: item.resourceName
            };
    
            console.log("item", item);

            if (item.metadata) {
                const source = item.metadata.sources.find(source => source.type == "CONTACT");
                contact.updatedDate = source.updateTime;
            }
        
            if (item.names?.length) {
                contact.name = item.names[0].displayName;
            }
        
            if (item.phoneNumbers?.length) {
                contact.hasPhoneNumber = "true";
            }
        
            if (item.photos?.length) {
                contact.photoUrl = item.photos[0].url;
            }
        
            if (item.emailAddresses?.length) {
                contact.emails = [];
                item.emailAddresses.forEach(itemEmail => {
                    let newEmails = {
                        address: itemEmail.value
                    };
        
                    if (itemEmail.metadata.primary) {
                        newEmails.primary = true;
                    }
                    contact.emails.push(newEmails);
                });
            }
    
            if (sync) {
                const foundContactsIndex = contactDataItem.contacts.findIndex(thisContact => thisContact.resourceName == contact.resourceName);
    
                const deletedContact = item.metadata?.deleted;
                const deletedOtherContact = item.resourceName.includes("otherContacts/") && !item.emailAddresses;

                // contact was deleted so find and remove it from array
                if (deletedContact || deletedOtherContact) {
                    if (foundContactsIndex != -1) {
                        console.log("remove: " + contact.resourceName);
                        contactDataItem.contacts.splice(foundContactsIndex, 1);
                    }
                } else {
                    if (foundContactsIndex != -1) {
                        // edited
                        console.log("editing: " + contact.name);
                        contactDataItem.contacts[foundContactsIndex] = contact;
                    } else {
                        // added
                        console.log("adding: " + contact.name);
                        contactDataItem.contacts.push(contact);
                    }
                }
            } else {
                contactDataItem.contacts.push(contact);
            }
        });
    });

    contactDataItem.lastModified = new Date();

    contactDataItem.contacts.sort(function (a, b) {
        if (a.name && !b.name) {
            return -1;
        } else if (!a.name && b.name) {
            return 1;
        } else {
            if (a.updatedDate > b.updatedDate) {
                return -1;
            } else if (a.updatedDate < b.updatedDate) {
                return 1;
            } else {
                if (a.hasPhoneNumber && !b.hasPhoneNumber) {
                    return -1;
                } else if (!a.hasPhoneNumber && b.hasPhoneNumber) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    });

    console.log("contacts fetched for account " + userEmail + ": " + contactDataItem.contacts.length);
    return { contactDataItem: contactDataItem, contactsHaveBeenUpdated: contactsHaveBeenUpdated };
}

function getContactDataItemIndexByEmail(contactsData, email) {
    return contactsData.findIndex(contact => contact.userEmail == email);
}

function findContactDataItemByEmail(contactsData, email) {
    const index = getContactDataItemIndexByEmail(contactsData, email);
    if (index != -1) {
        return contactsData[index];
    }
}

async function getContacts(params) {
    const contactsData = window.contactsData || await storage.get("contactsData");
	if (contactsData) {
		// maybe update
		if (params.account) {
			const contactData = findContactDataItemByEmail(contactsData, params.account.getAddress());
			if (contactData) {
				return contactData.contacts;
			} else {
				console.log("not found")
			}
		} else {
			console.log("not account found")
		}
	} else {
        console.log("no contactsdata; might have not been given permission");
	}
}

async function getContact(params) {
	var emailToFind;
	if (params.email) {
		emailToFind = params.email;
	} else {
		//emailToFind = params.mail.authorMail;
	}

	let contactFound;
	var account;
	if (params.mail) {
		account = params.mail.account
	} else {
		account = params.account;
    }
    
    const contacts = await getContacts({ account: account });
    if (contacts) {
        contacts.some(contact => {
            if (contact && contact.emails) {
                return contact.emails.some(contactEmail => {
                    if (contactEmail.address && emailToFind && contactEmail.address.toLowerCase() == emailToFind.toLowerCase()) {
                        contactFound = contact;
                        return true;
                    }
                });
            }
        });
    }

    return contactFound;
}

//set default icon images for certain emails etc.
function getPresetPhotoUrl(mail) {
	var url;
	if (mail && mail.authorMail) {
		if (mail.authorMail.includes("@jasonsavard.com")) { // from forum etc.
			url = "/images/jason.png";
		} else if (mail.authorMail.includes("@twitter.com")) {
			url = "/images/logos/twitter.png";
		} else if (mail.authorMail.includes("facebookmail.com")) {
			url = "/images/logos/facebook.svg";
		} else if (mail.authorMail.includes("@pinterest.com")) {
			url = "/images/logos/pinterest.png";
		} else if (mail.authorMail.includes("@linkedin.com")) {
			url = "/images/logos/linkedin.png";
		}
	}
	return url;
}

async function getContactPhoto(params) {
    const contact = await getContact(params);
    try {
        if (contact) {
            var account;
            if (params.mail) {
                account = params.mail.account;
            } else {
                account = params.account;
            }
            const response = await generateContactPhotoURL(contact, account);
            response.realContactPhoto = true;
            return response;
        } else {
            throw Error("No contact found");
        }
    } catch (error) {
        console.warn("getContactPhoto", error);
        // no generated url so let's set a preset photo
        return {
            photoUrl: getPresetPhotoUrl(params.mail)
        };
    }
}

async function generateContactPhotoURL(contact, account) {
    if (contact.photoUrl) {
        const response = await oAuthForContacts.generateURL(account.getAddress(), contact.photoUrl);
        response.photoUrl = response.generatedURL;
        return response;
    } else {
        throw Error("photoNotFound");
    }
}

async function updateContacts() {
    var contactsData = await storage.get("contactsData");
    if (contactsData) {
        const fetchContactPromises = contactsData.map(contactData => {
            if (contactData.version == CONTACTS_STORAGE_VERSION) {
                console.log("updating contacts for account: " + contactData.userEmail);
                return fetchContacts(contactData.userEmail, true);
            } else {
                console.warn("Could not update these contacts because user needs to grant access to new People API permissions: " + contactData.userEmail);
            }
        });

        const responses = await Promise.all(fetchContactPromises);
        var someContactsHaveBeenUpdated = false;

        responses.forEach(function (response, index) {
            contactsData[index] = response.contactDataItem;
            if (response.contactsHaveBeenUpdated) {
                someContactsHaveBeenUpdated = true;
            }
        });

        if (someContactsHaveBeenUpdated) {
            await storage.set("contactsData", contactsData);
        }
    }
}

let sUpdatedColors = new Map();
sUpdatedColors.set("#9a9cff", "#7986CB"); // My calendar
sUpdatedColors.set("#42d692", "#009688"); // Holiday calendar
sUpdatedColors.set("#cd74e6", "#8e24aa"); // ME calendar
sUpdatedColors.set("#f691b2", "#d81b60"); // full f
sUpdatedColors.set("#9fc6e7", "#4285f4");
sUpdatedColors.set("#9fe1e7", "#039be5");
sUpdatedColors.set("#7bd148", "#7cb342");
sUpdatedColors.set("#c2c2c2", "#616161");
sUpdatedColors.set("#fbe983", "#e4c441");
sUpdatedColors.set("#7ae7bf", "#33B679");

function convertToGoogleCalendarColor(color) {
	let googleCalendarColor = sUpdatedColors.get(color);
	if (googleCalendarColor) {
		return googleCalendarColor
	} else {
		return color;
	}
}

function isCustomViewInDays(customView) {
	return /.*days/.test(customView);
}

function isCustomViewInWeeks(customView) {
	return !isCustomViewInDays(customView);
}

async function getValueFromCustomView() {
	let customView = await storage.get("customView");
	if (customView) {
		return customView.replace("days", "");
	}
}

function getWriteableCalendars(arrayOfCalendars) {
	return arrayOfCalendars.filter(calendar => isCalendarWriteable(calendar) && !calendar.hidden);
}

async function initCalendarDropDown(templateId, selectedCalendarId) {
    const arrayOfCalendars = await getArrayOfCalendars({excludeTasks: true});

    let calendarIdToSelect;
    if (selectedCalendarId) {
        calendarIdToSelect = selectedCalendarId;
    } else {
        calendarIdToSelect = await getDefaultCalendarId(arrayOfCalendars);
    }

    let listbox;

    // template will only exist the first time because i overwrite it with the dom once initiated
    const $template = $("#" + templateId);
	if ($template.length) {
		var template = $template[0];
		listbox = template.content.querySelector("paper-listbox");
		
		getWriteableCalendars(arrayOfCalendars).forEach(calendar => {
			var calendarName = getCalendarName(calendar);
			var paperItem = document.createElement("paper-item");

			// color indicator
			let bgColor = calendar.backgroundColor;
			if (!bgColor && window.colors) {
				bgColor = colors.calendar[calendar.colorId].background;
			}
			let colorIndicator = document.createElement("span");
			colorIndicator.setAttribute("class", "colorIndicator");
			colorIndicator.setAttribute("style", "margin-right:12px;background:" + bgColor);
			paperItem.appendChild(colorIndicator);

			var textNode = document.createTextNode(calendarName);
			paperItem.appendChild(textNode);

			paperItem.setAttribute("value", calendar.id);
			
			listbox.appendChild(paperItem);
		});

		listbox.setAttribute("selected", calendarIdToSelect);
		
		var node = document.importNode(template.content, true);
        $template.replaceWith(node);
        // need to wait for dropdown to be inserted into DOM
        await sleep(1);
	} else {
        const divId = templateId.replace("Template", "");
        const $div = $("#" + divId);
        const $listbox = $div.find("paper-listbox");
        if ($listbox.length) {
            listbox = $listbox[0];
            listbox.selected = calendarIdToSelect;
        } else {
            throw new Error("initCalendarDropDown error: " + divId);
        }
    }

    return listbox;
}

function sendMessageToBG(command, params) {
    console.log("sendmessagetobg", command, params);
    if (globalThis.inBackground) { //if (typeof command === "function") { // if running in same context
        if (command.includes(".")) { // ie. forgottenReminder.start
            const commands = command.split(".");
            return globalThis[commands[0]][commands[1]](params);
        } else {
            return globalThis[command](params);
        }
    } else {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({command: command, params: params}, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                } else {
                    response = initUndefinedObject(response);
                    if (response && response.error) {
                        reject(response.error);
                    } else {
                        resolve(response);
                    }
                }
            });
        });
    }
}

async function mergeEvents(feeds) {
    let theseEvents = [];

    feeds.forEach(feed => {
        // keep going to return cached calendars
        if (feed && feed.items) {
            feed.items.forEach(event => {
                event.calendarId = feed.roundtripArg;
                initEventObj(event);
            });
            theseEvents = theseEvents.concat(feed.items);
        }
    });

    console.time("sortevents")
    await sortEvents(theseEvents);
    console.timeEnd("sortevents")

    return theseEvents;
}

async function resetTemporaryData() {
    await storage.remove("notificationsQueue");
    await storage.remove("notificationsOpened");
    await storage.remove("_previousEventInProgress");
}

async function getEvents() {
    const arrayOfCalendars = await getArrayOfCalendars();
    const cachedFeeds = await storage.get("cachedFeeds");
    const feeds = arrayOfCalendars.map(calendar => cachedFeeds[calendar.id]);
    return mergeEvents(feeds);
}

async function initPopup() {
    const browserButtonAction = await storage.get("browserButtonAction");
	if (browserButtonAction == BrowserButtonAction.CHECKER_PLUS_TAB || browserButtonAction == BrowserButtonAction.POPUP_DETACHED || browserButtonAction == BrowserButtonAction.GOOGLE_CALENDAR) {
		chrome.browserAction.setPopup({popup:""});
	} else {
		chrome.browserAction.setPopup({popup:"popup.html?source=toolbar"});
	}
}

async function showLoggedOut() {
    console.info("showloggedout");
	chrome.browserAction.setBadgeBackgroundColor({color:BadgeColor.GRAY});
	chrome.browserAction.setBadgeText({text : "X"});
    chrome.browserAction.setTitle({title : getMessage("notLoggedIn")});
    await storage.enable("loggedOut");
}

function openChangelog(ref) {
    const url = new URL("https://jasonsavard.com/wiki/Checker_Plus_for_Google_Calendar_changelog");
    url.searchParams.set("cUrl", chrome.runtime.getURL("contribute.html"));
    if (ref) {
        url.searchParams.set("ref", ref);
    }
    openUrl(url.href);
}

function generateReminderTimes(event) {
    const reminderTimes = [];
    let popupReminderFound = false;

    const reminders = getEventReminders(event);
    if (reminders) {

        let beforeStr;
        let beforeAtStr;
        let beforeToDisplay;

        if (/en/.test(locale)) {
            beforeStr = "before"
            beforeAtStr = "before at ";
        } else {
            beforeStr = getMessage("beforeStart");
            beforeAtStr = getMessage("beforeStart");
        }

        reminders.sort((a, b) => {
            if (a.minutes < b.minutes) {
                return -1;
            } else {
                return +1;
            }
        });

		reminders.forEach(reminder => {
			if (reminder.method == "popup") {
                popupReminderFound = true;
                //const reminderTime = getReminderTime(event, reminder);
                if (reminder.minutes == 0) {
                    if (event.allDay) {
                        reminderTimes.push(getMessage("onTheSameDay"));
                    } else {
                        reminderTimes.push(getMessage("whenEventStarts"));
                    }
                } else {
                    let periodName;
                    const obj = getUserFriendlyReminderTime(reminder.minutes, event.allDay, true);
                    if (obj.value == 1) {
                        periodName = obj.period.replace(/s$/, "");
                    } else {
                        periodName = obj.period;
                    }
                    let atTimeStr = "";
                    if (event.allDay && obj.beforeTime) {
                        const date = new DateZeroTime();
                        date.setMinutes(obj.beforeTime);
                        atTimeStr = ` ${date.toLocaleTimeStringJ(true)}`;
                        beforeToDisplay = beforeAtStr;
                    } else {
                        beforeToDisplay = beforeStr;
                    }
                    reminderTimes.push(`${getMessage("X" + periodName, obj.value)} ${beforeToDisplay}${atTimeStr}`);
                }
            }
        });
    }

    return {
        reminderTimes: reminderTimes,
        popupReminderFound: popupReminderFound
    }
}

async function getHideDeleteFlag() {
    // decided to reverse hideDelete default from false to true on March 17th 2021
    const rawHideDelete = await storage.getRaw("hideDelete");
    if (rawHideDelete) {
        return true;
    } else if (rawHideDelete === false) {
        return false;
    } else {
        const installDate = await getInstallDate();
        if (installDate.isAfter(new Date(2021, 2, 17))) {
            return true;
        } else {
            return false;
        }
    }
}

function getTaskList(event) {
    // https://www.googleapis.com/tasks/v1/lists/MDU2Mzg0MDM3Njk4MzMxOTAzNzE6MDow/tasks/T0IzamRCNFRPTWQwZHh2NQ
    const matches = event.selfLink?.match(/lists\/(.*?)\//); // adding ? for non greedy
    if (matches) {
        const taskListId = matches[1];
        const taskLists = cachedFeeds["taskLists"];
        return taskLists.items.find(taskList => taskList.id == taskListId);
    }
}



async function setTaskStatus(task, status) {
    await updateEvent({
        event: task,
        patchFields: {
            status: status
        },
        skipPrompt: true
    });

    // update event immediately in memory so that checkevents updates
    return updateCachedFeed(task, {
        operation: "update",
        ignoreCheckEvents: true
    });
}

async function initTasksColor() {
    TASKS_CALENDAR_OBJECT.backgroundColor = await storage.get("tasks-bg-color");
}