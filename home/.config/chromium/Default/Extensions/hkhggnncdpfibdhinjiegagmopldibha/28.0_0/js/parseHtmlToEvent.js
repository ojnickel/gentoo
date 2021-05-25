var response = {};
var subject = document.querySelector(".h-event .p-name");
if (subject) {
	subject = subject.innerText;
	
	var description = document.querySelector(".h-event .p-summary");
	if (description) {
		description = description.innerHTML;
	} else {
		description = null;
	}
	
	var url = null;
	var urlNode = document.querySelector(".h-event .u-url");
	if (urlNode) {
		url = urlNode.innerText;
	}
	
	response = {title:subject, description:description, url:url};
	
	// weird yes, but the following line will output object and pass it to the callback of chrome.tabs.executeScript
	response;
} else {
	response;
}