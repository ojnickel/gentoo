String.prototype.hashCode = function () {
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

var L64B =
{
	vars: {},
	startpage:
	{
		onMessage: function (details, sender, callback) {
			if (sender.id != chrome.runtime.id)  // Accept only messages from our extension
				return;
			if (details.msg == "msgSetIcon") {
				SetVideoIcon(details.tabId, details.fVideo);
				return;
			}
			else if (details.msg == "msgSetUrl") {
				callback({ tabId: sender.tab.id });
			}
		}
	},
	request:
	{
		 
	}
}

function SetVideoIcon(tabid, fVideo) {
	//console.log("set icon "+tabid+ "   "+fVideo);
	if (tabid >= 0)
		chrome.action.setIcon({ tabId: tabid, path: (fVideo ? "./iconHilight.png" : "./icon19.png") }, () => { /* ... */ });
}

L64B.video =
{
	onUpdateTabCalled: false,
	onUpdateTab: function (tabId, changeInfo, tab) {
	 
	},

	playVideo: function (tabid, video_id) {
		var url = window.location.href;
		url = url.replace("extension/background.html", "startpage/index.html?page=video&id=" + video_id);
		chrome.tabs.update(tabid, { "url": url, "selected": false }, function (tab) { });
	},
	 
}


var vdl =
{

	lasturl: new Object(),


	reset: function (tabid, lasturl) {
		//console.log("-->Reset "+tabid);
		vdl.lasturl[tabid] = lasturl;

	},

	launch: function (details) {
		console.log("launch" + JSON.stringify(details));
		return;


	},

	checkObject: function (details) {
		if (typeof (details) == 'undefined' && chrome.runtime.lastError)
			return;

		var url = details.url;
		//if (url.indexOf(".m4s") >= 0 && (url.indexOf("segment-") >= 0 || url.indexOf("fragment") >= 0))
		//	return;

		//console.log("checkObject "+url);
		var mime = "";
		var len = 0;
		var tabid = details.tabId;
		if (tabid < 0) {
			console.log("tabid " + tabid);
			return;
		}
		for (var i = 0; i < details.responseHeaders.length; ++i) {
			if (details.responseHeaders[i].name === 'Content-Type') {
				mime = details.responseHeaders[i].value;
			}
			else if (details.responseHeaders[i].name === 'Content-Length')
				len = parseInt(details.responseHeaders[i].value);
			else if (!len && details.responseHeaders[i].name === 'Content-Range')
				len = parseInt(details.responseHeaders[i].value);
		}

		if (mime.indexOf("mp4") >= 0) {
			let ra = url.indexOf("&range=") // Vimeo
			if (ra >= 0) {
				let ra2 = url.indexOf("&", ra + 5)
				if (ra2 >= ra)
					url = url.substr(0, ra) + url.substr(ra2);
				else
					url = url.substr(0, ra);
				//console.log("checkObject "+mime+" - "+url);	
			}
		}
		//if ( len<1024)
		//	return;
		var ext = ["m3u8", "mp4", "mov", "m4v", "webm", "mpg", "mp3", "aac", "m4s", "ts", "flv"];
		var isVideo = false;
		for (i = 0; i < ext.length; i++) {
			if (mime.indexOf(ext[i]) >= 0) {
				isVideo = ext[i];
				break;
			}
			else if (url.indexOf("." + ext[i]) >= 0) {
				isVideo = ext[i];
				break;
			}
		}
		if (isVideo != false) {
			var item = { url: url, mime: mime, len: len, title: false, ext: isVideo };
			if (isVideo == "m3u8")
				item.noDL = "m3u8";
			else if (isVideo == "m4s")
				item.noDL = "m4s";
			else if (len < 1024 * 10)
				return;
			SetVideoIcon(tabid, true);
			chrome.tabs.sendMessage(tabid, { id: "msgAddToList", item: item }, function (response) {
				if (typeof (response) == 'undefined' && chrome.runtime.lastError)
					return;
			});

		}
 	},

}


chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {

	if (!chrome.sidePanel)
		return;

	chrome.storage.sync.get('sidepanel', function (data) {
		let v = data['sidepanel'];
		console.log("storage " + v);
		chrome.sidePanel
			.setPanelBehavior({ openPanelOnActionClick: v == 1 })
			.catch((error) => console.log(error));
	});

	if (!tab.url) return;
	const url = new URL(tab.url);
	await chrome.sidePanel.setOptions({
		tabId,
		path: 'sidepanel.html?tab=' + tab.id + "?url=" + tab.url,
		enabled: true
	}).catch((error) => console.log(error));


});

if (chrome.sidePanel) {
	chrome.sidePanel
		.setPanelBehavior({ openPanelOnActionClick: true })
		.catch((error) => console.log(error));
}
// Listen for any changes to the URL of any tab.
//chrome.tabs.onUpdated.addListener(L64B.video.onUpdateTab);
//chrome.tabs.onReplaced.addListener(L64B.video.onUpdateTab);  
//chrome.tabs.onCreated.addListener(vdl.launchc);

chrome.action.setIcon({ path: "./icon19.png" }, () => { /* ... */ });

chrome.runtime.onMessage.addListener(L64B.startpage.onMessage);
chrome.webRequest.onHeadersReceived.addListener(vdl.checkObject,
	{
		urls: ["<all_urls>"]
	}, ["responseHeaders"]);

 