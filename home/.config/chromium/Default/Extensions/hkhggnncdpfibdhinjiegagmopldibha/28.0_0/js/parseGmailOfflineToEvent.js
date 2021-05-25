var response = {};
var subject = document.querySelector("[role='heading']");
if (subject) {
	var desc = document.querySelectorAll(".Oi");
	if (desc && desc.length) {
		desc = desc[desc.length-1].innerHTML;
	} else {
		desc = null;
	}
	response = {title:subject.innerText, description:desc};
	// weird yes, but the following line will output object and pass it to the callback of chrome.tabs.executeScript
	response;
} else {
	response;
}