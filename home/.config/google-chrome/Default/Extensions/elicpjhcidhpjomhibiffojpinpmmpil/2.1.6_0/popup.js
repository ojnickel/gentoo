var aTxtIds = ['idrefresh', 'idsidepanel1', 'idsidepanel21', 'idsidepanel31', 'idProtected', 'idYT', 'idYT2', 'downloadforbidden', 'language', 'idvideo', 'rights', 'idTL', 'idaddvideo', 'idVDL', 'idnovideo', 'idwhy', "idwait1", "idwait2", "idcc", "iddownload", "idmb", "more", "downloadtt"];

var aTxt = {};
for (var idx = 0; idx < aTxtIds.length; idx++) {
	aTxt[aTxtIds[idx]] = chrome.i18n.getMessage(aTxtIds[idx]);
}

var curTabId = 0;
var videoUrls = 0;
var showYoutubeMsg = false;
var fProtected = false;

function GetFileExtension(ob) {
	if (ob.ext && typeof (ob.ext) == "string")
		return ob.ext;
	var ext = ["m3u8", "m4s", "flv", "mp4", "3g", "wmv", "mpg", "m4p", "m4v", "webm"];
	for (var idx = 0; idx < ext.length; idx++) {
		if (ob.mime && ob.mime.indexOf(ext[idx]) >= 0) {
			return ext[idx];
		}
	}

	for (var idx = 0; idx < ext.length; idx++) {
		if (ob.url & ob.url.toLowerCase().indexOf(ext[idx]) >= 0) {
			return ext[idx];
		}
	}
	return "mp4";
}

function OnUltimate(mode) {
	if (mode == "protected")
		chrome.tabs.create({ "url": "https://videodownloaderultimate.com/?p=capture&msg="+fProtected, "selected": true }, function (tab) { });
	else if (mode == "m3u8")
		chrome.tabs.create({ "url": "https://videodownloaderultimate.com/?p=m3u8", "selected": true }, function (tab) { });
	else if (mode == "m4s")
		chrome.tabs.create({ "url": "https://videodownloaderultimate.com/?p=m4s", "selected": true }, function (tab) { });
	else 
		chrome.tabs.create({ "url": "https://videodownloaderultimate.com/?p=professional&msg="+showYoutubeMsg, "selected": true }, function (tab) { });		
}

function OnDownloadVideo(ev) {
	var idx = parseInt(ev.srcElement.id.slice(4));
	if (idx < videoUrls.length) {
		//window.close();
		var filename = getFilename(videoUrls[idx]);
		let title = videoUrls[idx].title;
		if (videoUrls[idx].status >= 400) {
			chrome.tabs.sendMessage(curTabId, { id: "msgDownload", url: videoUrls[idx].url, filename: filename, title: title }, function (response) {
				if (typeof (response) == 'undefined' && chrome.runtime.lastError)
					return;
				window.close();

			});
		}
		else {
			var options = { url: videoUrls[idx].url, filename: filename, saveAs: true };
			//myAlert( "download2 "+ JSON.stringify(options));
			chrome.downloads.download(options, function (downloadId) {

			});
			/*	chrome.downloads.onCreated.addListener(
					function (downloadItem) {
						window.close();
					});
	*/
		}
		chrome.storage.local.get('video_downloads', function (data) {
			var count = parseInt(data["video_downloads"]);
			if (!count)
				count = 0;
			count++;
			chrome.storage.local.set({ 'video_downloads': count }, function () { });
		});
	}
}

function OnPlayVideo(ev) {
	var idx = parseInt(ev.id.slice(7));
	if (idx < videoUrls.length) {
		//window.close();
		window.open(videoUrls[idx].url, "_blank", 'resizable=yes, scrollbars=no, titlebar=yes, width=800, height=600');
	}
}

//oembed add to list
function OnSP24NavigateAddVideo() {
	chrome.tabs.sendMessage(curTabId, { id: "msgAddToVideolist", play: false }, function (response) {
		if (typeof (response) == 'undefined' && chrome.runtime.lastError)
			return;
	});
}

//oembed add to list and play
function OnSP24NavigateAddVideo2() // add and Play
{
	chrome.tabs.sendMessage(curTabId, { id: "msgAddToVideolist", play: true }, function (response) {
		if (typeof (response) == 'undefined' && chrome.runtime.lastError)
			return;
	});
	window.close();
}

function OnSP24NavigateVideo() {
	var url = window.location.href;
	url = url.replace("popup.html", "startpage/index.html?page=video");
	chrome.tabs.create({ "url": url, "active": true }, function (tab) { });
	window.close();

	//chrome.runtime.sendMessage({ msg: "OnSP24Navigate", url: url }, function (response)
	//{
	//});     
}


function getFilename(item) {

	var txt = "";
	for (var idx = 0; idx < item.title.length; idx++) {
		var curchar = item.title.charAt(idx);
		if (curchar >= 'A' && curchar <= 'Z')
			txt += curchar;
		else if (curchar >= 'a' && curchar <= 'z')
			txt += curchar;
		else if (curchar >= '0' && curchar <= '9')
			txt += curchar;
		else if ("- _()".indexOf(curchar) >= 0)
			txt += curchar;
	}
	txt += "." + GetFileExtension(item);
	return txt;
}

function getTitleFromUrl(item) {
	var fname = item.url;
	var idx = fname.indexOf("?");
	if (idx >= 0)
		fname = fname.substr(0, idx);
	fname = fname.trim("/ ");
	idx = fname.lastIndexOf("/");
	if (idx >= 0)
		fname = fname.substr(idx + 1);

	fname = fname.replace(/%20/g, " ");
	if (fname == "videoplayback" || fname.length < 4) {
		if (!item.title)
			item.title = "video";
		fname = item.title;
	}
	fname = fname.trim("\n \t\r<>");
	if (fname.length > 30)
		fname = fname.substr(0, 27) + "...";
	return fname;
}

function hideControl(id) {
	var curElement = document.getElementById(id);
	if (curElement)
		curElement.style.display = "none";
}
function showControl(id) {
	var curElement = document.getElementById(id);
	if (curElement)
		curElement.style.display = "block";
}

var lastBest = false;
var lastBytes = 0;
function markBestResult(id, bytes) {

	var curElement = document.getElementById(id);
	curElement.bytes = bytes;

	if (bytes && bytes > lastBytes) {
		//console.log( id+" - "+bytes);
		if (lastBest)
			lastBest.style.background = '#fff';
		lastBest = curElement;
		lastBytes = bytes;
		lastBest.style.background = '#ddd';
	}
}

function getLength2(idControl, ob) {
	chrome.tabs.sendMessage(curTabId, { id: "msgGetLength", url: ob.url, idcontrol: idControl }, function (response) {
		//console.log("len: "+response.len+"  id:"+idControl);
		if (typeof (response) == 'undefined' && chrome.runtime.lastError)
			return;
	});
}

function removeAllChilds(curElement) {
	if (!curElement)
		return;
	var child = curElement.firstChild;
	while (child) {
		curElement.removeChild(child);
		child = curElement.firstChild;
	}
}
function co(type, parent, params, text) {
	var curElement = document.createElement(type);
	if (text)
		curElement.textContent = text;
	if (params) {
		for (var item in params) {
			curElement.setAttribute(item, params[item]);
		}
	}
	if (parent)
		parent.appendChild(curElement);
	return curElement;
}

/*function myAlert(txt)
{
	document.body.style.minHeight="180px";
	alert(txt);
	document.body.style.minHeight="0px";
}
*/

function myGetSize(idx, ob, url) {
	var client = new XMLHttpRequest();
	var bytes = 0;
	client.idControl = idx;
	client.ob = ob;
	client.onreadystatechange = function () {
		if (this.readyState >= 2) {
			if (this.status == 0) {
				return;
			}
			var curElement = document.getElementById("idd_" + this.idControl);
			if (curElement) {
				//curElement.style.background="#f00";
				var bytes = parseInt(this.getResponseHeader("Content-Length"));
				if (this.status >= 400) {
					this.ob.status = this.status;
					curElement.textContent = "";
					co('span', curElement, false, "Forbidden");
					co('br', curElement, false);
					co('span', curElement, false, this.status);

					getLength2(this.idControl, this.ob);
					var o2 = document.getElementById("idd_item_" + this.idControl);
					//curElement.style.display="none";								
					o2.style.opacity = 0.7;
					bytes = 0;
				}
				else if (!bytes) {
					bytes = 0;
					curElement.textContent = "";
					co('span', curElement, false, "Download");
					co('br', curElement, false);
					co('span', curElement, false, "? MB");
				}
				else {
					if (bytes < 1000 && this.ob.len > 1000)
						bytes = this.ob.len

					this.ob.bytes = bytes;

					var mb = Math.floor(bytes * 100 / 1024 / 1024) / 100;
					curElement.innerText = "Download " + mb + "MB";
					curElement.title = ""
				}
				if (bytes > 0)
					markBestResult("idd_item_" + this.idControl, bytes);
			}
			client.abort();
		}
	}
	client.open("HEAD", url);
	client.send();
}



function showVideoUrls() {


	var o = document.getElementById("idTabTitle");
	if (o) {
		o.innerText = curTabTitle;
	}
	var parent = document.getElementById("idVideos");
	if (!videoUrls) {
		var curElement = document.getElementById("idNoVideo");
		if (curElement) {
			co('span', curElement, false, aTxt["idnovideo"]);
			var li = co('a', curElement, { 'style': 'margin-left:10px', 'href': '#' }, aTxt["idwhy"]);
			co('br', curElement, {});
			//co('br', curElement, {});
			//co('span', curElement, false, aTxt["idrefresh"]);
			//co('div', curElement, { 'id': 'sep4' });
			curElement.style.display = "block";

			var curElement = li;
			curElement.addEventListener('click', function (ev) {
				ev.stopPropagation();
				let width = 500;
				let height = 220;
				let left = (screen.width / 2) - (width / 2);
				let top = (screen.height / 2) - (height / 2);

				chrome.tabs.get(curTabId, function (tab) {
					if (tab) {
						var url = "./novideo.html?url=" + escape(tab.url);
						window.open(url, "_blank", 'resizable=no, scrollbars=no, titlebar=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
						//window.close();
					}
				});
				return true;
			});
		}
	}
	var fDownloadsAvailable = false;
	var hasM3u = false;
	if (videoUrls) {
		//videoUrls.push(videoUrls[0]);
		for (var idx = 0; idx < videoUrls.length; idx++) {

			var ob = videoUrls[idx];

			if (ob.noDL == "m3u8" || ob.noDL == "m4s") {
				if (hasM3u)
					continue; // only one m3u entry
				else
					hasM3u = true;
			}

			if (showYoutubeMsg) {				
				let div = co('div', parent, { 'class': 'clYT' }, aTxt["idYT"].replace("YouTube", showYoutubeMsg));
				co('div', div, { 'class': 'clYT2 clNODownloadButtonNoDl' }, aTxt["idYT2"]);
			}
			else if ( fProtected) {				
				let div = co('div', parent, { 'class': 'clYT' }, aTxt["idProtected"].replace("###", fProtected));
				div.style.background = "#ff8";
				co('div', div, { 'class': 'clYT2 clProtected' }, aTxt["idYT2"]);
			}

			var url = ob.url;
			var ext = GetFileExtension(ob);
			if (!idx) {
				//co('div', parent, { 'class': 'sep' });
				co('div', parent, { 'class': 'clHeader' }, aTxt["idVDL"]);
				//sInner += "<div class='sep'></div><div class='clHeader'>" + aTxt["idVDL"] + "</div>";
			}
			else
				co('div', parent, { 'class': 'sep2', 'id': 'idd_sep_' + idx });

			//if ( !idx)
			//    sInner+= "<div class='sep'></div><div class='clHeader'>"+aTxt["idVDL"]+"</div>";
			//else
			//  sInner+= "<div class='sep2'></div>";
			var color = "#aaa";
			if (ext == "flv")
				color = "#acf";
			else if (ext == "mp4" || ext == "m4v")
				color = "#af9";
			else if (ext == "mp4" || ext == "m4v")
				color = "#af1";
			else if (ext == "3g")
				color = "#faa";
			else if (ext == "wmv")
				color = "#aff";

			var item = co('div', parent, { 'class': 'clItem', 'id': 'idd_item_' + idx });

			if (ob.res) {
				cl = "clFileExt";
				txt = ext + " " + ob.res;
			}
			else {
				cl = "clFileExt2";
				txt = ext;
			}

			if ((ext == "mp4" || ext == "mov" || ext == "webm") && ob.url != "CANNOTPLAY") {
				var di1 = co('div', item, { 'id': 'idd_pp_' + idx, 'class': cl, 'style': 'cursor:pointer;background-color:' + color + ';' });
				var di2 = co('div', di1, { 'style': 'position:absolute;right:4px;top:4px;z-index:1;' });
				co('img', di2, { 'height': '24px', 'src': './png/pp.png' });
				co('div', di1, { 'style': 'position:relative;z-index:2;' }, txt);

			}
			else {
				var di1 = co('div', item, { 'class': cl, 'style': 'background-color:' + color + ';' });
				co('div', di1, { 'style': 'position:relative;z-index:2;' }, txt);
			}
			if ((ext == "mp4" || ext == "mov" || ext == "webm") && ob.url != "CANNOTPLAY") {
				co('div', item, { 'style': 'width: calc(100% - 140px)', 'class': 'clDownloadVideo', 'id': 'idv_' + idx, 'title': url }, getFilename(ob));
			}
			else if (ext == "m3u8" || ext == "m4s")
				co('div', item, { 'style': 'width: calc(100% - 110px)', 'class': 'clDownloadVideo', 'id': 'idv_' + idx, 'title': url }, aTxt["more"]);
			else
				co('div', item, { 'style': 'width: calc(100% - 110px)', 'class': 'clDownloadVideo', 'id': 'idv_' + idx, 'title': url }, getFilename(ob));

			if ((ext == "mp4" || ext == "mov" || ext == "webm") && ob.url != "CANNOTPLAY") {

				var o2 = co('div', item, { 'id': 'idd_cc_' + idx, 'class': 'clCC', 'title': aTxt["idcc"] });
				co('img', o2, { 'width': '19px', 'src': './png/cc.png' });

			}
			if (ob.noDL == "m3u8") {
				var o2 = co('div', item, { 'class': 'clNODownloadButton clNODownloadButtonM3U8' });
				co('img', o2, { 'width': '19px', 'src': './png/no.png' });
			}
			else if ( ob.noDL == "m4s") {
				var o2 = co('div', item, { 'class': 'clNODownloadButton clNODownloadButtonM4S' });
				co('img', o2, { 'width': '19px', 'src': './png/no.png' });
			}
			else if (ob.noDL == "protected") {
				var o2 = co('div', item, { 'class': 'clNODownloadButton clProtected' });
				co('img', o2, { 'width': '19px', 'src': './png/no.png' });
			}
			else if (ob.noDL) {
				var o2 = co('div', item, { 'class': 'clNODownloadButton clNODownloadButtonNoDl' });
				co('img', o2, { 'width': '19px', 'src': './png/no.png' });
			}
			else {
				if (ob.bytes) {
					var mb = Math.floor(ob.bytes * 100 / 1024 / 1024) / 100;
					co('div', item, { 'id': 'idd_' + idx, 'class': 'clDownloadButton' }, "Download " + mb + "MB");
				}
				else {
					co('div', item, { 'id': 'idd_' + idx, 'class': 'clDownloadButton', 'title': aTxt["idwait1"] }, aTxt["idwait2"]);
				}
			}

			fDownloadsAvailable = true;

			if (ob.bytes > 0) {
				markBestResult("idd_item_" + idx, ob.bytes);
			}
			if (!ob.bytes && !ob.noDL) {
				myGetSize(idx, ob, url);

			}
		}
	}

	var curElement = document.getElementById("idAdd");
	if (curElement)
		curElement.addEventListener('click', OnSP24NavigateAddVideo2);

	if (videoUrls) {
		for (var idx = 0; idx < videoUrls.length; idx++) {
			var curElement = document.getElementById("idd_" + idx);
			if (curElement)
				curElement.addEventListener('click', OnDownloadVideo);
			var curElement = document.getElementById("idd_cc_" + idx);
			if (curElement)
				curElement.addEventListener('click', function () { OnPlayVideo(this) });
			var curElement = document.getElementById("idd_pp_" + idx);
			if (curElement)
				curElement.addEventListener('click', function () { OnPlayVideo(this) });
		}
	}

	var aElements = document.getElementsByClassName("clNODownloadButtonM3U8");
	for (var idx = 0; idx < aElements.length; idx++) {
		aElements[idx].addEventListener('click', function () { OnUltimate("m3u8") });
	}
	var aElements = document.getElementsByClassName("clNODownloadButtonM4S");
	for (var idx = 0; idx < aElements.length; idx++) {
		aElements[idx].addEventListener('click', function () { OnUltimate("m4s") });
	}
	
	aElements = document.getElementsByClassName("clNODownloadButtonNoDl");
	for (var idx = 0; idx < aElements.length; idx++) {
		aElements[idx].addEventListener('click', function () { OnUltimate("yt") });
	}
	aElements = document.getElementsByClassName("clProtected");
	for (var idx = 0; idx < aElements.length; idx++) {
		aElements[idx].addEventListener('click', function () { OnUltimate("protected") });
	}

}

function SetLanguage() {
	for (var txtId in aTxt) {
		var ob = document.getElementById(txtId);
		if (ob)
			ob.textContent = aTxt[txtId];
	}
}


var crctable = false;
function createcrctable() {
	var value;
	var table = [];
	for (var idx1 = 0; idx1 < 256; idx1++) {
		value = idx1;
		for (var idx2 = 0; idx2 < 8; idx2++) {
			value = ((value & 1) ? (0xEDB88320 ^ (value >>> 1)) : (value >>> 1));
		}
		table[idx1] = value;
	}
	return table;
}

function crc32( /* String */ str, /* Number */ crc) {
	if (crctable == false)
		crctable = createcrctable();
	if (crc == window.undefined) crc = 0;
	var number255 = 0; //a number between 0 and 255 
	var hexNum = 0; //an hex number 
	crc = crc ^ (-1);
	for (var idx = 0, iTop = str.length; idx < iTop; idx++) {
		number255 = (crc ^ str.charCodeAt(idx)) & 0xFF;
		hexNum = crctable[number255];
		crc = (crc >>> 8) ^ hexNum;
	}
	return crc ^ (-1);
}

function myAlert(txt) {
	let curElement = document.getElementById("idMsgText");
	curElement.innerText = txt;
	curElement = document.getElementById("idMsgBack");
	curElement.style.display = "block";
	curElement = document.getElementById("idMsgCancel");
	curElement.style.display = "none";
	curElement = document.getElementById("idMsgOk");
	curElement.addEventListener('click', function (ev) {
		let curElement = document.getElementById("idMsgBack");
		curElement.style.display = "none";
	});

	document.body.style.minHeight = "180px";

}

function myConfirm(txt, callback) {
	let curElement = document.getElementById("idMsgText");
	curElement.innerText = txt;
	curElement = document.getElementById("idMsgBack");
	curElement.style.display = "block";

	curElement = document.getElementById("idMsgOk");
	curElement.addEventListener('click', function (ev) {
		let curElement = document.getElementById("idMsgBack");
		curElement.style.display = "none";
		if (callback)
			callback();
	});

	curElement = document.getElementById("idMsgCancel");
	curElement.style.display = "inline-block";
	curElement.addEventListener('click', function (ev) {
		let curElement = document.getElementById("idMsgBack");
		curElement.style.display = "none";
	});


}
chrome.runtime.onMessage.addListener(function (details, sender) {
	if (sender.id != chrome.runtime.id)  // Accept only messages from our extension
		return;

	if (details.msg == "msgReturnContentLength") {
		console.log("len: " + details.len + "  id:" + details.idcontrol);
		if (typeof (response) == 'undefined' && chrome.runtime.lastError)
			return;

		var curElement = document.getElementById("idd_" + details.idcontrol);
		var bytes = parseInt(details.len);
		if (bytes < 4096) {
			curElement.title = aTxt["downloadforbidden"];
			return;
		}

		var mb = Math.floor(bytes * 100 / 1024 / 1024) / 100;

		if (curElement) {
			curElement.textContent = "Download " + mb + "MB";
			curElement.style.color = "#ff7";
			curElement.title = aTxt["downloadtt"];
		}
		return;
	}
	if (details.msg == "msgOembedInfos") {

		var info = details.info;//{ "video_url":details.info.video_url,"thumbnail_url":details.info.thumbnail_url,"title":details.info.title};
		if (info.error) {
			myAlert(info.error);
			return;
		}
		info.video_id = crc32(info.originalUrl);

		chrome.storage.local.get('video_items', function (data) {
			var sitems = data['video_items'];
			var aItems = false;
			if ((sitems == null) || (typeof (sitems) == 'undefined'))
				aItems = new Array();
			else
				aItems = JSON.parse(sitems);
			//aItems = new Array();
			if (Object.prototype.toString.call(aItems) !== '[object Array]') {
				aItems = new Array();
			}
			//aItems = new Array();
			aItems.splice(0, 0, info.originalUrl);
			//aItems.push(info.video_url);
			chrome.storage.local.set({ video_items: aItems }, function () { });
			var newData = {};
			newData.video_items = JSON.stringify(aItems);
			newData["video_item_" + info.video_id] = info;
			chrome.storage.local.set(newData, function () {

				var title = '"' + info.title + '"' + chrome.i18n.getMessage("idadded2");
				myAlert(title);
				//				window.close();

			});
		});
		return;
	}

});

function isForbidden(url) // Lock download from youtube and others
{
	if (url && url.indexOf("youtube.") >= 0)
		return "YouTube";
	if (url && url.indexOf("googlevideo.") >= 0)
		return "YouTube";
	if (url && url.indexOf("dailymotion.") >= 0)
		return "Dailymotion";
	if (url && url.indexOf("instagram.") >= 0)
		return "Instagram";
	if (url && url.indexOf("tiktok.") >= 0)
		return "Tiktok";
	if (url && url.indexOf("/startpage/") >= 0)
		return "YouTube";
	return false;
}

function isProtected(url) 
{
	if (url && url.indexOf("netflix.") >= 0)
		return "Netflix";
	if (url && url.indexOf("disneyplus.") >= 0)
		return "Disney Plus";
	if (url && url.indexOf("primevideo.") >= 0)
		return "Prime Video";	
	if (url && url.indexOf("paramountplus.") >= 0)
		return "Paramount+";	 
	return false;
}

function getCurrentTabAsync(callback) {
	chrome.windows.getCurrent(function (win) {
		chrome.tabs.query({ active: true }, function (tab) {
			if (!tab)
				return;
			for (var idx = 0; idx < tab.length; idx++) {

				if (tab[idx].windowId == win.id) {
					console.log("Tab found " + win.id + "   " + tab[idx].id);
					callback(tab[idx]);
					return;
				}
			}
		});
	});
}
document.addEventListener('DOMContentLoaded', function () {
	SetLanguage();

	hideControl("idaddvideo");
	hideControl("idSep");

	getCurrentTabAsync(function (tab) {
		if (!tab)
			return;

		curTabId = tab.id;
		curTabTitle = tab.title;
		// Youtube-----
		showYoutubeMsg = isForbidden(tab.url);
		fProtected  = isProtected(tab.url);
		if (showYoutubeMsg) {
			var item = { url: "CANNOTPLAY", noDL: "yt", mime: "mp4", len: 0, title: tab.title };
			videoUrls = [item];
			showVideoUrls();
			showControl("idaddvideo");
			showControl("idSep");
		}
		else if (fProtected) {
			var item = { url: "CANNOTPLAY", noDL: "protected", mime: "mp4", len: 0, title: tab.title };
			videoUrls = [item];
			showVideoUrls();
			showControl("idaddvideo");
			showControl("idSep");
		}
		else {
			chrome.tabs.sendMessage(curTabId, { id: "msgGetAllVideos" }, function (response) {
				if (typeof (response) == 'undefined' && chrome.runtime.lastError)
					return;
				if (response.oembed) {
					showControl("idaddvideo");
					showControl("idSep");
				}
				videoUrls = response.videoUrls;
				if (videoUrls && videoUrls.length == 0)
					videoUrls = false;
				showVideoUrls();

			});
		}

	});
	let el = document.getElementById("idaddvideo");
	if (el)
		el.addEventListener('click', OnSP24NavigateAddVideo);

	el = document.getElementById("idvideo"); // Show video list
	if (el)
		el.addEventListener('click', function () {
			var url = window.location.href;
			url = url.replace("popup.html", "startpage/index.html?page=video").replace("sidepanel.html", "startpage/index.html?page=video");
			chrome.tabs.create({ "url": url, "selected": true }, function (tab) { });
			window.close();
		});
	el = document.getElementById("idrefresh");
	if (el)
		el.addEventListener('click', function () {
			location.reload();
		});


	el = document.getElementById("idsidepanel2");
	if (el)
		el.addEventListener('click', function () {
			chrome.storage.sync.set({ 'sidepanel': 0 });
			chrome.sidePanel
				.setPanelBehavior({ openPanelOnActionClick: false })
				.catch((error) => console.log(error));
			window.close();
		});

	el = document.getElementById("idsidepanel3");
	if (el) {
		el.addEventListener('click', function () {
			chrome.storage.sync.set({ 'sidepanel': 1 });
			chrome.sidePanel
				.setPanelBehavior({ openPanelOnActionClick: true })
				.catch((error) => console.log(error));
			window.close();
		});
	}
	el = document.getElementById("idsidepanel1");
	if (el) {
		if (localStorage.getItem("showMenu") == 1) {
			showControl("idsidepanel3");
			showControl("idsidepanel2");
			el.innerText = aTxt["idsidepanel1"] + " ⏷";
		}
		else
			el.innerText = aTxt["idsidepanel1"] + " ⏵";
		el.addEventListener('click', function () {
			let o2 = document.getElementById("idsidepanel2");
			if (o2.style.display == "none") {
				showControl("idsidepanel3");
				showControl("idsidepanel2");
				localStorage.setItem("showMenu", 1);
				el.innerText = aTxt["idsidepanel1"] + " ⏷";
			}
			else {
				hideControl("idsidepanel3");
				hideControl("idsidepanel2");
				localStorage.setItem("showMenu", 0);
				el.innerText = aTxt["idsidepanel1"] + " ⏵";
			}

		});
	}

	
	// Rating------------------

	chrome.storage.local.get('video_downloads', function (data) {
		var count = parseInt(data["video_downloads"]);
		if (count == 10 || count == 50) {
			count++;
			chrome.storage.local.set({ 'video_downloads': count }, function () { });
			var txt = chrome.i18n.getMessage("idreview");
			document.body.style.minHeight = "220px";
			myConfirm(txt, function (tab) {
				chrome.tabs.create({ "url": "https://chromewebstore.google.com/detail/video-downloader-professi/elicpjhcidhpjomhibiffojpinpmmpil/reviews", "selected": true }, function (tab) { });
			});
		}
	});

	// Sidepanel------------------

	if (chrome.sidePanel) {

		chrome.sidePanel.getPanelBehavior().catch((error) => {
			console.log(error);
			hideControl("idsidepanel1");
			hideControl("idsidepanel2");
			hideControl("idsidepanel3");
		});

	}

	let showsidepanel = -1
	chrome.storage.sync.get('sidepanel', function (data) {
		showsidepanel = data['sidepanel']
		let o2 = document.getElementById("idsidepanel20");
		let o3 = document.getElementById("idsidepanel30");
		o2.style.visibility = !showsidepanel ? "visible" : "hidden";
		o3.style.visibility = showsidepanel ? "visible" : "hidden";

	});

});
