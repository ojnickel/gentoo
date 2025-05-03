var CLink64GmbH = (function () {
	var lastUrl = false;
	var allUrlsList = [];
	var loadedUrlsList = [];
	var embedInfo = false;

	function co(type, classname, parent, params, text) {
		let curelement = document.createElement(type);
		if (text)
			curelement.textContent = text;
		if (classname)
			curelement.className = classname;
		if (params) {
			for (let item in params) {
				curelement.setAttribute(item, params[item]);
			}
		}
		if (parent)
			parent.appendChild(curelement);
		return curelement;
	}

	function GetTagParam(cururl, tag) {
		var idx = cururl.indexOf(tag + '="');
		if (idx >= 0) {
			idx += tag.length + 2;
			var idx2 = cururl.indexOf('"', idx);
			if (idx2 > idx)
				return cururl.substr(idx, idx2 - idx);
		}
		var idx = cururl.indexOf(tag + "='");
		if (idx >= 0) {
			idx += tag.length + 2;
			var idx2 = cururl.indexOf("\'", idx);
			if (idx2 > idx)
				return cururl.substr(idx, idx2 - idx);
		}
		return false;
	}

	function isForbidden() {
		if (!document.location.href)
			return false;
		if (document.location.protocol != "https:")
			return true; // Not Allowed
		// Only for chromecast links
		if (document.location.hostname.endsWith(".youtube.com"))
			return true; // Not Allowed
		if (document.location.hostname.endsWith("tiktok.com"))
			return true; // Not Allowed
		if (document.location.hostname.endsWith("instagram.com"))
			return true; // Not Allowed
		if (document.location.hostname.endsWith("vk.com"))
			return true; // Not Allowed
		if (document.location.hostname.endsWith("dailymotion.com"))
			return true; // Not Allowed
		return false;
	}

	function sendAllLinks() {
		var url = document.location.href;

		if (lastUrl != url) {
			if (isForbidden()) {
				//console.log("Forbidden site");
				return;
			}
			var title = document.title;
			lastUrl = url;
			chrome.runtime.sendMessage({ msg: "msgSetUrl" }, function (response) {
				if (typeof (response) == 'undefined' && chrome.runtime.lastError)
					return;
				if (response) {
					if (document.location.href.indexOf("vimeo.com") >= 0)
						findVimeoVideos(response.tabId);
					else
						scanPage(response.tabId);
				}
			});
		}
	}

	function scanPage(tabId) {
		var url = document.location.href;
		allUrlsList = [];
		var html = document.documentElement.outerHTML;
		var aExt = ["m3u8", "mp4", "mov", "m4v", "webm", "mpg", "mp3", "aac", "m4s", "ts", "flv"];
		for (var mode = 0; mode < aExt.length; mode++) {		
			var ext = aExt[mode];
			for (var idx = 0; ;) {

				var curobj = FindFirstUrl(html, "." + ext, idx);
				if (!curobj || !curobj.start)
					break;
				idx = curobj.start;

				var ob = { 'url': curobj.mp4, 'title': document.title, 'type': (ext=="m3u8"||ext=="m4s" ? ext : "video") }
				if (ob.url.indexOf(".m3u8") != -1) {
					ob.noDL = "m3u8";
				}
				else if (ob.url.indexOf(".m4s") != -1) {
					ob.noDL = "m4s";
				}
				ob.mime = "video/" + ext;
				addOnce(allUrlsList, ob);
			}
		}

		for (var idx = 0; idx < document.links.length; idx++) {
			var link = document.links[idx];
			var cururl = isSupportedUrl(link.href);
			if (cururl) {
				var title = '';
				if (link.hasAttribute('title'))
					title = myTrim(link.getAttribute('title'));
				if (!title && link.hasAttribute('alt'))
					title = myTrim(link.getAttribute('alt'));
				if (!title)
					title = myTrim(link.innerText);

				if (!title)
					title = document.title;
				var cl = "";
				if (link.hasAttribute('class'))
					cl = myTrim(link.getAttribute('class'));

				var ob = { 'url': cururl, 'title': title, 'class': cl, 'id': (link.id ? link.id : ""), 'value': '', 'type': 'extern' };
				addOnce(allUrlsList, ob);
			}
		}

		type = "video";
		var aElements = document.getElementsByTagName('video');
		for (var idx = 0; idx < aElements.length; idx++) {
			var link = aElements[idx];
			var cururl = false;
			if (link.src)
				cururl = link.src;
			if (!cururl && link.hasAttribute('data-thumb')) {
				cururl = myTrim(link.getAttribute('data-thumb'));
				if (cururl.indexOf("http") == -1)
					cururl = "http:" + cururl;
			}
			var cururl = isSupportedUrl(cururl);
			if (cururl) {
				var title = '';
				if (link.hasAttribute('alt'))
					title = myTrim(link.getAttribute('alt'));
				else if (link.hasAttribute('title'))
					title = myTrim(link.getAttribute('title'));
				if (!title)
					title = document.title;
				var cl = "";
				if (link.hasAttribute('class'))
					cl = myTrim(link.getAttribute('class'));

				addOnce(allUrlsList, { 'url': cururl, 'title': title, 'type': type });
			}
		}

		if (tabId != -1) {
			var fGreenArrow = false;
			if (allUrlsList.length > 0)
				fGreenArrow = true;

			if (!embedInfo)
				embedInfo = getEmbedInfo();
			//if (embedInfo != false)
			//	fGreenArrow = true;

			if (fGreenArrow) {
				chrome.runtime.sendMessage({ "msg": "msgSetIcon", "tabId": tabId, "fVideo": true }, function (response) {
					if (typeof (response) == 'undefined' && chrome.runtime.lastError)
						return;
				});
			}
		}
	}

	function myTrim(txt) {
		if (!txt)
			return '';
		return txt.replace(/^[\s_]+|[\s_]+$/gi, '').replace(/(_){2,}/g, "_");
	}

	function isSupportedUrl(url) {
		if (!url || !url.toLowerCase)
			return false;
		if ((url.toLowerCase().indexOf('javascript:') != -1) || (url.toLowerCase().indexOf('javascript :') != -1))
			return false;
		if ((url.toLowerCase().indexOf('mailto:') != -1) || (url.toLowerCase().indexOf('mailto :') != -1))
			return false;
		if (url.indexOf("data:image") != -1)
			return false;
		if ((url.indexOf(".mp4") == -1) && (url.indexOf(".flv") == -1) && (url.indexOf(".mov") == -1))
			return false;
		return url;
	}


	function OnAddToVideoList(info, play) {
		var info = JSON.parse(info.info);
		if (!info.title) {
			info.title = document.title;
		}
		if (typeof (info.thumbnail_url) == "string") {
			if (info.thumbnail_url.indexOf("//") == 0) {
				info.thumbnail_url = "http:" + info.thumbnail_url;
			}
		}
		chrome.runtime.sendMessage({ msg: "msgAddToVideolist", info: info, url: location.href, play: play }, function (response) {
			if (typeof (response) == 'undefined' && chrome.runtime.lastError)
				return;
		});
	}

	function checkStatus(response) {
		if (!response.ok) {
			throw new Error(`HTTP ${response.status} - ${response.statusText}`);
		}
		return response;
	}

	async function myFetch(url, filename, title) {

		var today = new Date();
		var date1 = parseInt(today.getDate());
		var date2 = parseInt(localStorage.getItem("RightsShown")); // Show rights warning once a day
		if (date1 != date2) {
			if (!confirm(chrome.i18n.getMessage("rights")))
				return;
			localStorage.setItem("RightsShown", date1);
		}

		let old = document.getElementById("idLink64Ui");
		if (old)
			document.body.removeChild(old);
		let div = document.createElement("div");
		div.id = "idLink64Ui";
		div.style.position = "fixed";
		div.style.right = "10px";
		div.style.maxWidth = "360px";
		div.style.padding = "10px 15px";
		div.style.top = "10px";
		//div.style.height  = "70px";
		div.style.background = "#eee";
		div.style.border = "1px solid #333"
		div.style.borderRadius = "3px"
		div.style.zIndex = "99999999";

		document.body.appendChild(div);
		let commonstyle = "margin:0px;line-height:12px;box-sizing: content-box;-webkit-user-select: none;font-family: arial, verdana, helvetica;text-decoration:none;color:#333;font-size:12px;font-weight:normal;";
		let closeParent = co('div', 'clLink64All', div, { 'style': 'text-align:right' }, false);
		let close = co('a', 'clLink64All', closeParent, { 'style': commonstyle + 'cursor:pointer;display:inline-block;padding:5px 0px;' }, chrome.i18n.getMessage("close"));
		close.addEventListener('click', function (ev) {
			ev.stopPropagation();
			ev.preventDefault();

			document.body.removeChild(div);
		});
		co('h2', 'clLink64All', div, { 'style': commonstyle + 'color:#333;font-size:14px;font-weight:bold;margin-bottom:20px;' }, "Video Downloader professional");

		let pElement = co('p', 'clLink64All', div, { 'style': commonstyle + 'background:#ccc;display:block;padding:5px;font-size:10px;margin-bottom:20px;' }, false);
		co('span', 'clLink64All', pElement, { 'style': commonstyle + 'font-weight:bold' }, title);
		co('br', 'clLink64All', pElement, {}, false);
		co('br', 'clLink64All', pElement, {}, false);
		co('span', 'clLink64All', pElement, {}, filename);
		co('br', 'clLink64All', pElement, {}, false);
		co('h3', 'clLink64Start', div, { 'style': commonstyle + 'margin:10px;font-weight:bold' }, chrome.i18n.getMessage("downloading4_0"));
		let ul = co('ul', 'clLink64Start', div);
		co('li', 'clLink64Start', ul, { 'style': commonstyle + 'margin:10px;' }, chrome.i18n.getMessage("downloading4_1"));
		co('li', 'clLink64Start', ul, { 'style': commonstyle + 'margin:10px;' }, chrome.i18n.getMessage("downloading4_2"));
		co('br', 'clLink64All', div, {}, false);
		let center = co('center', 'clLink64Start', div, {}, false);
		let button = co('a', 'clLink64Start', center, { 'title': url, 'style': commonstyle + 'display:block;cursor:pointer;border-radius:5px; padding:10px;width:120px;background:#495;color:#fff;font-weight:bold;' }, chrome.i18n.getMessage("downloading5"));
		button.href = url;
		co('br', 'clLink64All', div, {}, false);
		return;
	}

	function getContentLength(url, idcontrol) {
		var ref = document.location.href;
		fetch(url, { referrer: ref }).then(response => {
			const reader = response.body.getReader();
			const contentLength = +response.headers.get('Content-Length');
			chrome.runtime.sendMessage({ msg: "msgReturnContentLength", len: contentLength, idcontrol: idcontrol }, function (response) {
				if (typeof (response) == 'undefined' && chrome.runtime.lastError)
					return;
			});
		});
	}

	function addOnce(dstArray, item) {
		for (var idx = 0; idx < dstArray.length; idx++) {
			if (dstArray[idx].url == item.url) {
				if (dstArray[idx].len < item.len)
					dstArray[idx] = item;
				return;
			}
		}
		dstArray.push(item);
	}

	chrome.runtime.onMessage.addListener(

		function (request, sender, sendResponse) {
			if (sender.id != chrome.runtime.id)  // Accept only messages from our extension
				return;

			if (request.id == "msgAddToList") // Video gefunden von background.js
			{
				var item = request.item;
				if (!item.title || item.title.length == 0)
					item.title = document.title;
				addOnce(loadedUrlsList, item);
				return;
			}
			else if (request.id == "msgGetAllVideos") {
				if (document.location.href.indexOf("vimeo.com") >= 0)
					findVimeoVideos(-1); //Das ist async
				else
					scanPage(-1);
				var dstArray = [];
				for (var idx = 0; idx < loadedUrlsList.length; idx++) {
					addOnce(dstArray, loadedUrlsList[idx]);
				}
				for (var idx = 0; idx < allUrlsList.length; idx++) {
					addOnce(dstArray, allUrlsList[idx]);
				}
				sendResponse({ "videoUrls": dstArray, "oembed": (embedInfo != false), "txt": "ergebnis" });
			}
			else if (request.id == "msgGetLength") {
				getContentLength(request.url, request.idcontrol);
				return;
			}
			else if (request.id == "msgDownload") {

				//console.log("Download " + request.url);
				myFetch(request.url, request.filename, request.title);
				return;
			}

			else if (request.id == "msgAddToVideolist") { // oembed

				var play = request.play;
				//console.log("msgAddToVideolist");
				embedInfo = getEmbedInfo();
				if (!embedInfo) {
					//console.log("error");
					sendResponse({ info: false, error: "no oembed url available on " + location.href });
					return;
				}

				chrome.runtime.sendMessage({ msg: "msgOembedInfos", info: embedInfo }, function (response) {

					if (typeof (response) == 'undefined' && chrome.runtime.lastError)
						return;
				});

			}
		});

	function getEmbedInfo() {
		var url = location.href;
		let info = { "originalUrl": url };
		//console.log("getEmbedInfo");

		let idx;
		let all = document.querySelectorAll('[property="og:image"]');
		for (idx = 0, max = all.length; idx < max; idx++) {
			let thumb = all[idx].content;
			if (typeof (thumb) != "undefined") {
				info.thumbnail_url = thumb;
				//console.log(thumb);
				break;
			}
		}
		all = document.querySelectorAll('[property="og:title"]');
		for (idx = 0, max = all.length; idx < max; idx++) {
			let title = all[idx].content;
			if (typeof (title) != "undefined") {
				info.title = title;
				//console.log(title);
				break;
			}
		}
		all = document.querySelectorAll('[property="og:video:url"]');
		for (idx = 0, max = all.length; idx < max; idx++) {
			let playurl = all[idx].content;
			if (typeof (playurl) != "undefined") {
				info.playurl = playurl;
				//console.log(playurl);
				break;
			}
		}

		if (!info.playurl) {
			var html = document.documentElement.outerHTML;
			let curobj = FindFirstUrl(html, "/embed/", 0);
			if (curobj && curobj.mp4) {
				info.playurl = curobj.mp4;

			}
		}

		if (!info.playurl) {
			var html = document.documentElement.outerHTML;
			let curobj = FindFirstUrl(html, "\\/embed\\/", 0);
			if (curobj && curobj.mp4) {
				info.playurl = curobj.mp4.replace(/\\\//g, '\/');
				//console.log(info.playurl);
			}
		}

		if (!info.thumbnail_url) {
			all = document.querySelectorAll('[rel="icon"]');
			if (all.length > 0) {
				info.thumbnail_url = all[0].href;
			}
		}
		if (!info.title)
			info.title = document.title;

		if (!info.playurl) {
			info.playurl = info.originalUrl;
		}
		//console.log("OEMBED " + info.playurl);
		if (info.playurl) {
			return info;
		}
		//console.log("NO OEMBED");
		return false;
	}

	function FindFirstUrl(html, ext, start) {

		for (; ;) {
			var idx = html.indexOf(ext, start)
			if (idx < 0)
				return false;
			start = idx + ext.length;
			var idx1 = html.indexOf('\"', idx);
			var idx2 = html.indexOf('\'', idx);
			var curChar = false;
			if (idx1 > idx && idx2 > idx) {

				curChar = idx1 > idx2 ? "\'" : "\"";
				if (idx1 > idx2)
					idx1 = idx2;
			}
			else if (idx1 > idx) {
				curChar = "\"";

			}
			else if (idx2 > idx) {
				curChar = "\'";
				idx1 = idx2;
			}
			else
				continue;

			var idx0 = idx1 > 600 ? idx1 - 600 : 0;
			var sTxt = html.substr(idx0, idx1 - idx0);
			idx2 = sTxt.lastIndexOf(curChar);
			if (idx2 < 0)
				continue;
			sTxt = sTxt.substr(idx2 + 1);
			if (sTxt.indexOf("http://") == 0 || sTxt.indexOf("https://") == 0)
				return { mp4: sTxt, start: idx1 };
			if (sTxt.indexOf("http:\\/\\/") == 0 || sTxt.indexOf("https:\\/\\/") == 0) {
				sTxt = sTxt.replace(/\\\//g, '\/');
				return { mp4: sTxt, start: idx1 };
			}

			var server = document.location.protocol + "//" + document.location.hostname;

			if (sTxt.indexOf("/") == 0)
				return { mp4: server + sTxt, start: idx1 };
			if (sTxt.indexOf("\\/") == 0) {
				sTxt = sTxt.replace(/\\\//g, '\/');
				return { mp4: server + sTxt, start: idx1 };
			}

			if (ext == ".m3u8" && (sTxt.indexOf("\\/") == 0 || sTxt.indexOf("/") == 0)) {
				sTxt = sTxt.replace(/\\\//g, '\/');
				return { mp4: sTxt, start: idx1 };
			}
			continue;
		}
	}
	//for Vimeo:

	function FindFirstUrl_Vimeo(html, ext, idx2) {
		while (1) {
			var idx1 = html.indexOf(ext, idx2);
			if (idx1 < 0)
				return false;
			var idx2 = idx1;
			idx2 += ext.length;
			var htmlLength = html.length;
			while (idx1 > 0 && html.charAt(idx1) != '"' && html.charAt(idx1) != '\'' && html.charAt(idx1) != '>') {
				idx1--;
			}
			if (html.charAt(idx1) == '>') {
				while (idx2 < htmlLength && html.charAt(idx2) != '<') {
					idx2++;
				}
			}
			else {
				while (idx2 < htmlLength && html.charAt(idx2) != '"' && html.charAt(idx2) != '\'') {
					idx2++;
				}
			}
			idx1++;
			if (html.substr(idx1, 7) == "http://" || html.substr(idx1, 8) == "https://" || html.substr(idx1, 4) == "www." || html.substr(idx1, 5) == "/www.") {
				return [idx2, html.substr(idx1, idx2 - idx1)]
			}
			else if (html.substr(idx1, 9) == "http:\\/\\/" || html.substr(idx1, 10) == "https:\\/\\/") {
				var sTxt = html.substr(idx1, idx2 - idx1);
				sTxt = sTxt.replace(/\\\//g, "/");
				return [idx2, sTxt];
			}
			if (idx2 <= idx1)
				break;
		}
		return false;
	}

	function findVimeoVideos(tabId) {

		if (document.location.href.indexOf("vimeo.com") < 0)
			return;

		
		var xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.open("GET", document.location.href, true);
		xmlHttpReq.onreadystatechange = function (data) {
			if (this.readyState != 4)
				return;
			findVimeoVideos2(tabId, this.responseText)
		}
		xmlHttpReq.send(null);
	}
	function GetVimeoId(url) {
		//if ( GetUrlParameter( url, L"clip_id", csId))
		//	return TRUE;
		var csId = url;
		var idx = csId.indexOf('?');
		if (idx >= 0)
			csId = csId.substr(0, idx);
		idx = csId.indexOf('#');
		if (idx >= 0)
			csId = csId.substr(0, idx);

		idx = csId.lastIndexOf('/');
		if (idx < 0)
			return false;
		csId = csId.substr(idx + 1);
		if (csId.length < 8)
			return false;
		for (idx = 0; idx < csId.length; idx++) {
			if (csId.charAt(idx) < '0' || csId.charAt(idx) > '9')
				return false;
		}
		return csId;
	}
	function findVimeoVideos2(tabId, html) {
		var searchTxt = 'data-config-url="'
		var idx = html.indexOf(searchTxt);
		var url = false;
		if (idx >= 0) {
			idx += searchTxt.length;
			var idx2 = html.indexOf('"', idx);
			if (idx2 > idx)
				url = html.substr(idx, idx2 - idx);
		}
		if (!url) {
			var curobj = FindFirstUrl_Vimeo(html, "/config?", 0)
			if (curobj)
				url = curobj[1];
		}
		if (!url) {
			var id = GetVimeoId(document.location.href);
			if (!id)
				return;
			url = "https://player.vimeo.com/video/" + id;
		}
		
		url = url.replace(/&amp;/g, "&");
		var xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.open("GET", url, true);
		xmlHttpReq.onreadystatechange = function (data) {
			if (this.readyState != 4)
				return;
			var sTxt = this.responseText;
			var searchTxt = '"title":"';
			var idx = sTxt.indexOf(searchTxt);
			title = document.title;
			if (idx >= 0) {
				idx += searchTxt.length;
				for (var curchar = idx; curchar + 1 < sTxt.length; curchar++) {
					if (sTxt.charAt(curchar) == '\\') // Backslash vor Gänsefüßchen zählt nicht
						curchar++;
					else if (sTxt.charAt(curchar) == '\"')
						break;
				}
				if (curchar + 1 < sTxt.length)
					title = sTxt.substr(idx, curchar - idx);
			}
			var start = 0;
			allUrlsList = [];
			while (1) {
				var curobj = FindFirstUrl_Vimeo(sTxt, ".mp4", start);
				if (!curobj)
					break;
				start = curobj[0];
				var idx = sTxt.indexOf('"height":', start);
				var height = 0;
				if (idx > 0)
					height = parseInt(sTxt.substr(idx + 9));

				var url = curobj[1];
				addOnce(allUrlsList, { 'url': url, 'title': title + " (" + height + "p)", 'type': 'video' });
				//allUrlsList.push({'url': url,'title': title+" ("+height+"p)", 'type': 'video'});
			}
			if (tabId != -1) {
				var fGreenArrow = false;
				if (allUrlsList.length > 0)
					fGreenArrow = true;

				if (!embedInfo)
					embedInfo = getEmbedInfo();
				//if (embedInfo != false)
				//	fGreenArrow = true;

				if (fGreenArrow) {
					chrome.runtime.sendMessage({ "msg": "msgSetIcon", "tabId": tabId, "fVideo": true }, function (response) {
						if (typeof (response) == 'undefined' && chrome.runtime.lastError)
							return;
					});
				}
			}
		}
		xmlHttpReq.send(null);
	}

	function myInit() {
		setTimeout(function () { sendAllLinks() }, 300);
		setInterval(function () { sendAllLinks() }, 500);
	}
	return {
		init: myInit
	};

})();

CLink64GmbH.init();
