// extracts message id from offline url, ex. https://mail.google.com/mail/mu/mp/166/#cv/Inbox/145994dc0db175a4
function extractMessageIdFromUrl(url) {
	var matches = url.match(/\/([^\/]+$)/);
	if (matches && matches.length >= 2) {
		return isHex(matches[1]);
	}
}

function isHex(str) {
	return /^[0-9A-Fa-f]+$/.test(str);
}

var response = {};
var subject = document.querySelectorAll("div[role='main'] .hP");
if (subject && subject.length) {
	var desc = document.querySelectorAll("div[role='main'] .ii.gt");
	if (desc && desc.length) {
		desc = desc[0].innerHTML;
	} else {
		desc = null;
	}

	response = { title: subject[0].innerText, description: desc };

	let messageId = extractMessageIdFromUrl(location.href);
	if (messageId) {
		response.url = location.href;
	} else {
		// find message id in gmail source
		var message = document.querySelectorAll("div[role='main'] .aXjCH");
		if (message && message.length) {
			// parse id from... class='a3s aXjCH m15c1af433f9066b7' and remove 'm'
			let match = message[0].className.match(/ m(.*)/);
			if (match) {
				messageId = match[1];
				if (!location.href.includes(messageId)) {
					response.url = location.href + "/" + messageId;
				}
			}
		}
	}
	
	// weird yes, but the following line will output object and pass it to the callback of chrome.tabs.executeScript
	response;
} else {
	response;
}