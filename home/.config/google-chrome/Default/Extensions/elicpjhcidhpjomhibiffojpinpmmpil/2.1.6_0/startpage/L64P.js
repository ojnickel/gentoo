/////////////////////////////////////////////////////////////////
///
///		Global L64P object
///
/////////////



var L64P =
{
	vars: {},
	util:
	{
		_crctable: false,
		_createcrctable: function () {
			var idxCur;
			var table = [];
			for (var idx1 = 0; idx1 < 256; idx1++) {
				idxCur = idx1;
				for (var idx2 = 0; idx2 < 8; idx2++) {
					idxCur = ((idxCur & 1) ? (0xEDB88320 ^ (idxCur >>> 1)) : (idxCur >>> 1));
				}
				table[idx1] = idxCur;
			}
			return table;
		},

		_crc32: function ( /* String */ str, /* Number */ crc) {
			if (this._crctable == false)
				this._crctable = this._createcrctable();
			if (crc == window.undefined) crc = 0;
			var number255 = 0; //a number between 0 and 255 
			var hexnum = 0; //an hex number 
			crc = crc ^ (-1);
			for (var idx = 0, iTop = str.length; idx < iTop; idx++) {
				number255 = (crc ^ str.charCodeAt(idx)) & 0xFF;
				hexnum = this._crctable[number255];
				crc = (crc >>> 8) ^ hexnum;
			}
			return crc ^ (-1);
		}


	},

	video:
	{
		saveItems: function (details) {
			L64P._db.set({ id: 'video_items', data: JSON.stringify(details.id), type: 'local' });
			return;
		},
		getWatchedItems: function (details, callback) {
			/// get te cache first
			var cacheItems = false;
			var sCacheItems = L64P._db._locStorage.getItem("video_cacheItems");
			if ((sCacheItems == null) || (typeof (sCacheItems) == 'undefined'))
				cacheItems = new Array();
			else
				cacheItems = JSON.parse(sCacheItems);

			L64P._db.get({ id: 'video_items', type: 'local' }, function (data) {
				var sitems = data;
				if ((sitems == null) || (typeof (sitems) == 'undefined'))
					items = new Array();
				else
					items = JSON.parse(sitems);
				var aValues = [];
				var objs = new Object();
				for (var idx = 0; idx < items.length; idx++) {
					if (items[idx] != null) {
						var crc = L64P.util._crc32(items[idx]); // Don't show duplicates
						if (objs[crc])
							continue;
						objs[crc] = true;
						aValues.push("video_item_" + crc);
					}
				}
				L64P._db.getMulti({ ids: aValues }, function (data) {
					var retval = [];
					if ((data !== false)) {
						//for(var propertyName in data) 
						//	retval.push(data[propertyName]); 
						for (let idx in aValues)  // Keep the same order like aValues ( not the database order)
						{
							var curvalue = data[aValues[idx]];
							if (curvalue) {
								retval.push(curvalue);  
							}
						}
					}
					L64P._db._locStorage.setItem("video_cacheItems", JSON.stringify(retval));
					if (typeof (callback) == "function")
						callback({ items: retval });
				});
			});
		}
	},
	browser:
	{

	},
	events:
	{
		onTopLinkChanged: function (details) { },
		onTopNewSearchURL: function (details) { },
		onNewVideo: function (details) { },
	},
	settings:
	{
		set: function (details) {
			details.id = 'settings_' + details.id;

			if (typeof (details.data) == 'object')
				details.data = "L64O_" + JSON.stringify(details.data);
			return L64P._db.set(details);
		},
		get: function (details, callback) {
			var info = { call: callback };

			L64P._db.get({ id: 'settings_' + details.id }, function (data) {

				if (typeof (data) == 'string') {
					if (data.indexOf("L64O_") == 0)
						data = JSON.parse(data.slice(5));
				}
				if (typeof (callback) == 'function')
					callback(data);
			});
		},
	},
	 
	_db:
	{
		_curUserWatch: 0,
		_bindList: new Array(),
		_locStorage: false,
		setStorage: function () {
			L64P._db._locStorage = localStorage;
		},
		addListener: function (details) {
			L64P._db._bindList.push({ key: details.key, callback: details.callback });
		},
		bindStorageChanges: function () {
			window.addEventListener("storage", L64P._db._onLocalStorageStorageChange, true);
		},
		setMulti: function (details) {
			//for details.data
			var obj = details.data;
			if (typeof (obj) != 'object')
				return false;

			for (var propertyName in obj) {
				L64P._db._locStorage.setItem(propertyName, obj[propertyName]);
			}
		},
		getMulti: function (details, callback) {
			var ids = details.ids;
			var data = {};
			for (var idx = 0; idx < ids.length; idx++) {
				data[ids[idx]] = L64P._db._locStorage.getItem(ids[idx]);
			}
			setTimeout(function () { callback(data) }, 0);

		},
		_onLocalStorageStorageChange: function (event) {

		},
		onStorageChanged: function (details) {

		},
		set: function (details) {
			//return content.localStorage.wrappedJSObject.setItem(details.id, details.data);
			try {
				return L64P._db._locStorage.setItem(details.id, details.data);
			}
			catch (err) {
			}
			return null;

		},
		get: function (details, callback) {
			var data = L64P._db._locStorage.getItem(details.id);
			if (typeof (callback) == 'function')
				setTimeout(function () { callback(data) }, 0);
			//callback(data);
		},
		initWatch: function () {
			L64P._db.setStorage();
			L64P._db.bindStorageChanges();

			L64P._db.get({ id: 'tls_watchuser' }, function (data) {
				cn = data;
				if (cn == null) {
					cn = 1;
					L64P._db.set({ id: 'tls_watchuser', data: cn });
				}
				L64P._db._curUserWatch = cn;
				setTimeout(function () { L64P._db.checkWatch(); }, 2000);
			});

		},
		checkWatch: function () {
			setTimeout(function () { L64P._db.checkWatch(); }, 2000);
			L64P._db.get({ id: 'tls_watchuser' }, function (data) {
				var cn = data;
				if (L64P._db._curUserWatch == cn)
					return;
				L64P._db._curUserWatch = cn;
				L64P.events.onTopLinkChanged({ type: 'user' });
			});


		}
	},


};


/////////////////////////////////////////////////////////////////
///
///		chrome extension com code
///
/////////////////////////////////////////////////////////////////

if (typeof (chrome) == 'object') {
	if (typeof (chrome.storage) == 'object') {
		L64P._db.storage = chrome.storage.local;

		L64P._db.bindStorageChanges = function () {
			chrome.storage.onChanged.addListener(function (changes, areaName) {
				for (var idx = 0; idx < L64P._db._bindList.length; idx++) {
					if (typeof (changes[L64P._db._bindList[idx].key]) != 'undefined') {
						var call = L64P._db._bindList[idx].callback;
						var parm = { key: L64P._db._bindList[idx].key, val: changes[L64P._db._bindList[idx].key].newValue };
						setTimeout(function () { call(parm) }, 0);
					}

				}
			});
		}

		L64P._db.set = function (details) {
			var data = new Object();
			data[details.id] = details.data;

			var storage = L64P._db.storage;
			L64P._db.storage.set(data, function () { });
		};
		L64P._db.get = function (details, callback) {
			var storage = L64P._db.storage;
			storage.get(details.id, function (data) {
				callback(data[details.id]);
			});

		};
		L64P._db.setMulti = function (details) {
			L64P._db.storage.set(details.data, function () { });
		};
		L64P._db.getMulti = function (details, callback) {
			L64P._db.storage.get(details.ids, function (data) {
				callback(data);
			});
		};

	}
	if (typeof (chrome.runtime) == 'object') {
		L64P.browser =
		{
			init: function () {

			},
			onMessage: function (details, sender) {				 
			},
		}
		////////////////// subscribe to the chrome messages	
		chrome.runtime.onMessage.addListener(L64P.browser.onMessage);
	}

}

L64P._db.initWatch();
 