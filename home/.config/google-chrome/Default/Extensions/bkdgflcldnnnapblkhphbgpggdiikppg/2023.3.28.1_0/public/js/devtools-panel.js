(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _chrome$devtools, _chrome$devtools$insp;
var table = document.querySelector('#request-table');
var clearButton = document.getElementById('clear');
var refreshButton = document.getElementById('refresh');
var protectionButton = document.getElementById('protection');
var tabPicker = document.getElementById('tab-picker');
var tdsOption = document.getElementById('tds');
function sendMessage(messageType, options, callback) {
  chrome.runtime.sendMessage({
    messageType: messageType,
    options: options
  }, callback);
}
var tabId = ((_chrome$devtools = chrome.devtools) === null || _chrome$devtools === void 0 ? void 0 : (_chrome$devtools$insp = _chrome$devtools.inspectedWindow) === null || _chrome$devtools$insp === void 0 ? void 0 : _chrome$devtools$insp.tabId) || parseInt(0 + new URL(document.location.href).searchParams.get('tabId'));

// Open the messaging port and re-open if disconnected. The connection will
// disconnect for MV3 builds when the background ServiceWorker becomes inactive.
var port;
function openPort() {
  port = chrome.runtime.connect({
    name: 'devtools'
  });
  port.onDisconnect.addListener(openPort);
}
openPort();

// fetch the list of configurable features from the config and create toggles for them.
var loadConfigurableFeatures = new Promise(function (resolve) {
  sendMessage('getListContents', 'config', function (_ref) {
    var config = _ref.data;
    var features = Object.keys(config.features);
    features.forEach(function (feature) {
      var btn = document.createElement('button');
      btn.id = feature;
      btn.innerText = "".concat(feature, ": ???");
      document.querySelector('#protections').appendChild(btn);
      btn.addEventListener('click', function () {
        port.postMessage({
          action: "toggle".concat(feature),
          tabId: tabId
        });
      });
    });
    resolve(features);
  });
});
var actionIcons = {
  block: '🚫',
  redirect: '➡️',
  ignore: '⚠️',
  none: '✅',
  'ad-attribution': '🪄',
  'ignore-user': '🎛️'
};

/**
 * @param {HTMLElement} element
 * @param {string} textName
 * @param {boolean} isEnabled
 */
function setupProtectionButton(element, textName, isEnabled) {
  element.innerText = "".concat(textName, ": ").concat(isEnabled ? 'ON' : 'OFF');
  element.classList.add("protection-button-".concat(isEnabled ? 'on' : 'off'));
  element.classList.remove("protection-button-".concat(isEnabled ? 'off' : 'on'));
}
var actionHandlers = {
  tracker: function tracker(m) {
    var _m$message = m.message,
      tracker = _m$message.tracker,
      url = _m$message.url,
      requestData = _m$message.requestData,
      siteUrl = _m$message.siteUrl,
      serviceWorkerInitiated = _m$message.serviceWorkerInitiated;
    var row = document.getElementById('request-row').content.firstElementChild.cloneNode(true);
    var cells = row.querySelectorAll('td');
    var toggleLink = row.querySelector('.block-toggle');
    toggleLink.href = '';
    if (tracker.action === 'block') {
      toggleLink.innerText = 'I';
    } else {
      toggleLink.innerText = 'B';
    }
    toggleLink.addEventListener('click', function (ev) {
      ev.preventDefault();
      port.postMessage({
        action: toggleLink.innerText,
        tabId: tabId,
        tracker: tracker,
        requestData: requestData,
        siteUrl: siteUrl
      });
      row.classList.remove(tracker.action);
      row.classList.add(toggleLink.innerText === 'I' ? 'ignore' : 'block');
    });
    ["".concat(serviceWorkerInitiated ? '⚙️ ' : '').concat(url), "".concat(actionIcons[tracker.action], " ").concat(tracker.action, " (").concat(tracker.reason, ")"), tracker.fullTrackerDomain, requestData.type].forEach(function (text, i) {
      cells[i + 1].innerText = text;
    });
    row.classList.add(tracker.action);
    table.appendChild(row);
  },
  tabChange: function tabChange(m) {
    var _tab$site, _tab$site2;
    var tab = m.message;
    var protectionDisabled = ((_tab$site = tab.site) === null || _tab$site === void 0 ? void 0 : _tab$site.allowlisted) || ((_tab$site2 = tab.site) === null || _tab$site2 === void 0 ? void 0 : _tab$site2.isBroken);
    setupProtectionButton(protectionButton, 'Protection', !protectionDisabled);
    loadConfigurableFeatures.then(function (features) {
      features.forEach(function (feature) {
        var _tab$site3;
        var featureEnabled = (_tab$site3 = tab.site) === null || _tab$site3 === void 0 ? void 0 : _tab$site3.enabledFeatures.includes(feature);
        var featureButton = document.getElementById(feature);
        setupProtectionButton(featureButton, feature, featureEnabled);
      });
    });
  },
  cookie: function cookie(m) {
    var _m$message2 = m.message,
      action = _m$message2.action,
      kind = _m$message2.kind,
      url = _m$message2.url,
      requestId = _m$message2.requestId,
      type = _m$message2.type;
    var rowId = "request-".concat(requestId);
    if (document.getElementById(rowId) !== null) {
      var row = document.getElementById(rowId);
      var cells = row.querySelectorAll('td');
      row.classList.add(kind);
      cells[3].textContent = "".concat(cells[3].textContent, ", ").concat(kind);
    } else {
      var _row = document.getElementById('cookie-row').content.firstElementChild.cloneNode(true);
      _row.id = rowId;
      var _cells = _row.querySelectorAll('td');
      var cleanUrl = new URL(url);
      cleanUrl.search = '';
      cleanUrl.hash = '';
      _cells[1].textContent = cleanUrl.href;
      _cells[2].textContent = "\uD83C\uDF6A ".concat(action);
      _cells[3].textContent = kind;
      _cells[4].textContent = type;
      _row.classList.add(kind);
      table.appendChild(_row);
    }
  },
  jscookie: function jscookie(m) {
    var _m$message3 = m.message,
      documentUrl = _m$message3.documentUrl,
      action = _m$message3.action,
      reason = _m$message3.reason,
      value = _m$message3.value,
      stack = _m$message3.stack,
      scriptOrigins = _m$message3.scriptOrigins;
    var row = document.getElementById('cookie-row').content.firstElementChild.cloneNode(true);
    var cells = row.querySelectorAll('td');
    cells[1].textContent = documentUrl;
    cells[2].textContent = "JS\uD83C\uDF6A ".concat(action, " (").concat(reason, ")");
    cells[3].textContent = scriptOrigins.join(',');
    appendCallStack(cells[3], stack);
    cells[4].textContent = value.split(';')[0];
    row.classList.add('jscookie');
    table.appendChild(row);
  },
  fingerprintingCanvas: function fingerprintingCanvas(m) {
    var _m$message4 = m.message,
      documentUrl = _m$message4.documentUrl,
      action = _m$message4.action,
      kind = _m$message4.kind,
      stack = _m$message4.stack,
      args = _m$message4.args;
    var row = document.getElementById('cookie-row').content.firstElementChild.cloneNode(true);
    var cells = row.querySelectorAll('td');
    cells[1].textContent = documentUrl;
    cells[2].textContent = "Canvas ".concat(action);
    var argsOut = JSON.parse(args).join(', ');
    cells[3].setAttribute('colspan', 2);
    cells[4].remove();
    cells[3].textContent = "".concat(kind, "(").concat(argsOut, ")");
    appendCallStack(cells[3], stack);
    row.classList.add('canvas');
    table.appendChild(row);
  }
};
function appendCallStack(cell, stack) {
  if (stack) {
    // Shift off the first two of the stack as will be us.
    var lines = stack.split('\n');
    lines.shift();
    lines.shift();
    var details = document.createElement('details');
    var summary = document.createElement('summary');
    summary.textContent = 'Call stack';
    details.appendChild(summary);
    details.appendChild(document.createTextNode(lines.join('\n')));
    cell.appendChild(details);
  }
}

/**
 * General panel configuration that can change during its lifetime.
 *
 * Values below are the defaults.
 */
var panelConfig = {
  rowVisibility: {
    blocked: true,
    ignored: true,
    ignoredFirstParty: true,
    redirected: true,
    cookieHTTP: true,
    cookieJS: true,
    apiCanvas: true,
    noneRequest: true,
    ignoreUser: true
  },
  rowFilter: ''
};
function shouldShowRow(row) {
  // empty search box is considered to be no filter
  if (panelConfig.rowFilter !== '') {
    // when a filter is in effect, fail now if the URL does not match the filter
    if (!row.cells[1].textContent.match(panelConfig.rowFilter)) {
      return false;
    }
  }
  var className = row.classList[0];
  switch (className) {
    case 'ignore':
      if (row.querySelector('.request-action').textContent === "".concat(actionIcons.ignore, " ignore (first party)")) {
        return panelConfig.rowVisibility.ignored && panelConfig.rowVisibility.ignoredFirstParty;
      }
      return panelConfig.rowVisibility.ignored;
    case 'block':
      return panelConfig.rowVisibility.blocked;
    case 'redirect':
      return panelConfig.rowVisibility.redirected;
    case 'cookie-tracker':
    case 'set-cookie-tracker':
      return panelConfig.rowVisibility.cookieHTTP;
    case 'jscookie':
      return panelConfig.rowVisibility.cookieJS;
    case 'canvas':
      return panelConfig.rowVisibility.apiCanvas;
    case 'none':
      return panelConfig.rowVisibility.noneRequest;
    case 'ignore-user':
      return panelConfig.rowVisibility.ignoreUser;
  }
  // always show if we don't have an appropriate toggle
  return true;
}
function setRowVisible(row) {
  row.hidden = !shouldShowRow(row);
}
port.onMessage.addListener(function (message) {
  var m = JSON.parse(message);
  if (m.tabId === tabId) {
    if (actionHandlers[m.action]) {
      actionHandlers[m.action](m);
    }
    if (document.querySelector('tbody').lastChild) {
      setRowVisible(document.querySelector('tbody').lastChild);
    }
  }
});
function updateTabSelector() {
  chrome.tabs.query({}, function (tabs) {
    while (tabPicker.firstChild !== null) {
      tabPicker.removeChild(tabPicker.firstChild);
    }
    var selectTabOption = document.createElement('option');
    selectTabOption.value = '';
    selectTabOption.innerText = '--Select Tab--';
    tabPicker.appendChild(selectTabOption);
    tabs.forEach(function (tab) {
      if (tab.url.startsWith('http')) {
        var elem = document.createElement('option');
        elem.value = tab.id;
        elem.innerText = tab.title;
        if (tab.id === tabId) {
          elem.setAttribute('selected', true);
        }
        tabPicker.appendChild(elem);
      }
    });
  });
}
if (!chrome.devtools) {
  updateTabSelector();
  chrome.tabs.onUpdated.addListener(updateTabSelector);
  tabPicker.addEventListener('change', function () {
    tabId = parseInt(tabPicker.selectedOptions[0].value);
    clear();
    port.postMessage({
      action: 'setTab',
      tabId: tabId
    });
  });
} else {
  tabPicker.hidden = true;
}
if (tabId) {
  port.postMessage({
    action: 'setTab',
    tabId: tabId
  });
}
function clear() {
  while (table.lastChild) {
    table.removeChild(table.lastChild);
  }
}

// listeners for buttons and toggles
clearButton.addEventListener('click', clear);
refreshButton.addEventListener('click', function () {
  clear();
  if (chrome.devtools) {
    chrome.devtools.inspectedWindow.eval('window.location.reload();');
  } else {
    chrome.tabs.reload(tabId);
  }
});
protectionButton.addEventListener('click', function () {
  port.postMessage({
    action: 'toggleProtection',
    tabId: tabId
  });
});
sendMessage('getSetting', {
  name: 'tds-channel'
}, function (result) {
  console.log('setting', result);
  var active = tdsOption.querySelector("[value=".concat(result));
  if (active) {
    active.setAttribute('selected', true);
  }
});
tdsOption.addEventListener('change', function (e) {
  sendMessage('updateSetting', {
    name: 'tds-channel',
    value: tdsOption.selectedOptions[0].value
  }, function () {
    sendMessage('reloadList', 'tds');
  });
});
var displayFilters = document.querySelector('#table-filter').querySelectorAll('input');
displayFilters.forEach(function (input) {
  // initialise filters to default values
  if (input.id === 'search-box') {
    input.value = panelConfig.rowFilter;
  } else {
    input.checked = panelConfig.rowVisibility[input.dataset.filterToggle];
  }

  // register listeners to update row visibility when filters are changed
  input.addEventListener('change', function () {
    if (input.id === 'search-box') {
      panelConfig.rowFilter = input.value;
    }
    if (input.dataset.filterToggle) {
      panelConfig.rowVisibility[input.dataset.filterToggle] = input.checked;
    }
    document.querySelectorAll('tbody > tr').forEach(setRowVisible);
  });
});

/**
 * Observes the dev settings for resizing to ensure the table head sticks correctly to the bottom of the settings.
 */
var settingsResizeObserver = new ResizeObserver(function (entries) {
  var height = entries[0].contentRect.height;
  document.querySelector('thead').style.top = "".concat(height, "px");
});
settingsResizeObserver.observe(document.getElementById('settings-panel'));

},{}]},{},[1]);
