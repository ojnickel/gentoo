/**
 * @author Blife Team
 * @email blife450@gmail.com
 *
 * Copyright 2016-2020 Blife Team Authors
 * https://custom-cursor.com
 */

Array.prototype.current = 0;
Array.prototype.next = function () {
    return this[++this.current];
};
Array.prototype.prev = function () {
    return this[--this.current];
};

const SIZELIST = [
    {w: 16, h: 16}, {w: 24, h: 24}, {w: 32, h: 32},
    {w: 48, h: 48}, {w: 64, h: 64}, {w: 80, h: 80},
    {w: 96, h: 96}, {w: 128, h: 128}
];
const browser = chrome;

class background {
    constructor() {
        this.initListeners();
        this.config_sync = {};
        this.data = {};
        browser.storage.local.get(null, function (items) {
            this.data = items;
            try {
                if (Object.prototype.hasOwnProperty.call(this.data.rotator, 'status')) {
                    if (this.data.rotator.status == "on") {
                        if (this.data.rotator.type == "time") {
                            if (this.intErval != null) {
                                clearInterval(this.intErval);
                                this.intErval = null;
                            }
                            let run = function () {
                                this.cT++;
                                this.autoChange();
                            };
                            this.intErval = setInterval(run.bind(this), this.data.rotator.time * 1000);
                        }
                    }
                }

            } catch (e) {
            }
        }.bind(this));
        this.sec = 0;
        browser.tabs.onCreated.addListener(this.rotatorReq.bind(this));
        browser.tabs.onUpdated.addListener(this.rotatorReq.bind(this));

        browser.storage.onChanged.addListener(function (changes, area) {
            if (changes.size || changes.selected) {
                browser.storage.local.get(null, function (selected) {
                    this.data = selected;
                    this.changeCursor(selected.selected)
                }.bind(this))
            }
            browser.storage.sync.get(null, function (items) {
                this.config_sync = items;
                this.uid = items.uid;
            }.bind(this));
            browser.storage.local.get(null, function (items) {
                this.data = items;
            }.bind(this));
        }.bind(this));

        this.authSync()
    }
    rotatorReq(tabId, changeInfo, tab) {
        try {
            if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
                if (!Object.prototype.hasOwnProperty.call(this.data, 'tabs_opened')) {
                    this.data.tabs_opened = 1;
                }
                browser.storage.local.set({
                    tabs_opened: this.data.tabs_opened + 1
                });

                if (this.data.rotator.status == "on" && this.data.rotator.type == "request") {
                    if (parseInt(this.data.rotator.request) <= parseInt(this.data.tabs_opened)) {
                        this.data.tabs_opened = 1;
                        browser.storage.local.set({tabs_opened: 1});
                        this.autoChange()
                    }
                }
            }
        } catch (e) {}
    }

    resizedataURL(datas, wantedWidth, wantedHeight, type) {
        return new Promise(function (resolve, reject) {
            let img = document.createElement('img');
            img.onload = function () {
                let canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                canvas.width = wantedWidth;
                canvas.height = wantedHeight;
                ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
                let dataURI = canvas.toDataURL('image/png', 1);
                resolve({
                    type: type,
                    data: dataURI
                });
                img = null;
                canvas = null;
            };
            img.src = datas;


        })
    }

    onInstall() {
        browser.tabs.query({}, function (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].url.indexOf('http') != -1) {
                        try {
                            browser.tabs.executeScript(tabs[i].id, {file: "libs/cursor.js"}, function (result) {
                                browser.runtime.lastError;
                            });
                        } catch (e) {
                        }
                    }
                }
            }
        );
        browser.tabs.create({url: `https://custom-cursor.com/successful_installation?utm_source=ext&utm_medium=install&utm_campaign=install_succesful`});
        browser.storage.sync.set({di: (new Date()).getTime(), uid: this.getUserUid()});
        browser.storage.local.set({
            domain: 'https://custom-cursor.com/',
            collection: Collection,
            size: 3,
            myCollection: {},
            version: browser.runtime.getManifest().version,
            favorites: [],
            rotator: {status: 'off', type: 'request', time: 30, request: 10}
        });
    }

    getSync() {
        browser.storage.sync.get(null, function (data) {
            if (data.size) {
                browser.storage.local.set({size: data.size})
            }
            if (data.favorites) {
                browser.storage.local.set({favorites: data.favorites});
            }
            if (data.rotator) {
                browser.storage.local.set({rotator: data.rotator});
            }
            if (data.packs) {
                $.ajax({
                    url: 'https://custom-cursor.com/api/packs',
                    data: {
                        packs: data.packs
                    },
                    method: 'post'
                }).done(function (response) {
                    for (let i in response) {
                        let data = response[i];
                        this.collection = Collection;
                        this.collection[data.slug] = data;
                    }
                    browser.storage.local.set({collection: this.collection});
                }.bind(this));

            }
        }.bind(this));
    }

    initListeners() {
        browser.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
                this.onInstall()
            } else if (details.reason == "update") {
                this.reloadImage();
                browser.storage.local.set({
                    du: (new Date()).getTime(),
                    version: browser.runtime.getManifest().version
                });
            }
        }.bind(this));
        this.cT = 0;
        this.intErval = null;
        browser.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
            switch (request.action) {
                case "getInstalled": {
                    sendResponse({
                        collections: this.data.collection,
                        ver: browser.runtime.getManifest().version,
                        uid: this.uid,
                        action: 'get_installed_collection'
                    });
                    break;
                }
                case "install_collection": {
                    let data = {},
                        res = {
                            status: true,
                            version: browser.runtime.getManifest().version,
                            uid: this.uid,
                            action: 'install_collection'
                        };
                    data = request;

                    browser.storage.local.get(null, function (items) {
                        this.data = items;
                        if (Object.prototype.hasOwnProperty.call(this.data.collection, data.slug)) {
                            this.data.collection[data.slug] = data.collection;
                        } else {
                            this.data.collection[data.slug] = data.collection;
                        }
                        browser.storage.local.set(this.data);
                    }.bind(this));

                    sendResponse(res);
                    break;
                }
                case "get_config": {
                    sendResponse(this.data);
                    break;
                }
                case "set_config": {
                    if (request.data.selected) {
                        this.changeCursor(request.data.selected)
                        this.stopRotator();
                        break;
                    } else {
                        browser.storage.local.set(request.data);
                        sendResponse({status: true});
                        this.reloadImage()
                        break;
                    }
                }
                case "set_config_sync": {
                    browser.storage.sync.set(request.data);
                    sendResponse({status: true});
                    break;
                }
                case "get_config_sync": {
                    sendResponse(this.config_sync);
                    break;
                }
            }
        }.bind(this));

        browser.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.action == 'rotator') {
                    if (request.data.status == 'on') {
                        if (request.data.type == 'time') {
                            if (this.intErval != null) {
                                clearInterval(this.intErval);
                                this.intErval = null;
                            }
                            let run = function () {
                                this.cT++;
                                this.autoChange();

                            };
                            this.intErval = setInterval(run.bind(this), request.data.time * 1000);
                        }
                        if (request.data.type == 'request') {
                            if (this.intErval != null) {
                                clearInterval(this.intErval);
                                this.intErval = null;
                            }
                        }
                    }
                    if (request.data.status == 'off') {
                        if (this.intErval != null) {
                            clearInterval(this.intErval);
                            this.intErval = null;
                        }
                    }
                }
                if (request.action == 'changeCursor') {
                    this.changeCursor(request.item);
                }
                sendResponse({status: true});
            }.bind(this));
    }

    stopRotator() {
        this.data.rotator.status = 'off';
        clearInterval(this.intErval);
        browser.storage.local.set({rotator: this.data.rotator});
    }

    getUserUid() {
        let buf = new Uint32Array(4),
            idx = -1;
        window.crypto.getRandomValues(buf);
        let uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            idx++;
            let r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }.bind(this));
        return uid;
    }

    authSync() {
        browser.storage.local.get(function (data) {
            let packMap = new Map(),
                packs = [];
            browser.storage.sync.set({'size': data.size});
            for (let i in data.collection) {
                let collection = data.collection[i];
                for (let y in collection.items) {
                    packs.push(collection.items[y].id);
                    packMap.set(collection.items[y].id, true)
                }
            }
            packs = packs.filter((v, i, a) => a.indexOf(v) === i)
            browser.storage.sync.set({'packs': packs});
            browser.storage.sync.set({favorites: data.favorites});
            browser.storage.sync.set({rotator: data.rotator});
        });
        setTimeout(this.authSync.bind(this), 1080000); //120000
    }

    changeCursor(item) {
        if (!item) return;
        item.type = 'system';
        let size = this.data.size, cursor = {}, pointer = {};
        if (Object.prototype.hasOwnProperty.call(item.pointer, 'path')) {
            if (!Object.prototype.hasOwnProperty.call(item.pointer, 'original'))
                item.pointer.original = item.pointer.path;
            pointer = this.resizedataURL(item.pointer.original, SIZELIST[size].w, SIZELIST[size].h, 'pointer');
        }

        if (Object.prototype.hasOwnProperty.call(item.cursor, 'path')) {
            if (!Object.prototype.hasOwnProperty.call(item.cursor, 'original'))
                item.cursor.original = item.cursor.path;
            cursor = this.resizedataURL(item.cursor.original, SIZELIST[size].w, SIZELIST[size].h, 'cursor');
        }

        Promise.all([cursor, pointer]).then((values) => {
            for (let [key, items] of Object.entries(values)) {
                if (items.type == 'pointer') {
                    item.pointer.path = items.data
                }
                if (items.type == 'cursor') {
                    item.cursor.path = items.data
                }
            }
            browser.storage.local.set({selected: item, selected_type: 'system'});
        })

    }

    autoChange() {
        this.data.favorites.current = this.data.favorites.indexOf(this.data.selected.id);
        let nf = this.data.favorites.next();
        var xn = false, xf;

        if (nf == undefined) {
            nf = this.data.favorites[0];
        }

        for (let i in this.data.collection) {
            xf = this.data.collection[i].items.filter(function (item) {
                if (item.id == nf) return item;
            }.bind(this));
            if (xf[0]) {
                this.changeCursor(xf[0]);
                xn = true;
                break;
            } else {

            }
        }
        if (xn == false) {
            this.autoChange();
        }
    }

    reloadImage() {
        function mergeImageURIs(images) {
            return new Promise((resolve, reject) => {
                var canvas = document.createElement('canvas');
                canvas.width = 96;
                canvas.height = 48;
                Promise.all(images.map(imageObj => add2canvas(canvas, imageObj))).then(() => resolve(canvas.toDataURL('image/png'), reject));
            });
        }
        function add2canvas(canvas, imageObj) {
            return new Promise((resolve, reject) => {
                if (!imageObj || typeof imageObj != 'object') return reject();
                var x = imageObj.x && canvas.width ? (imageObj.x >= 0 ? imageObj.x : canvas.width + imageObj.x) : 0,
                    y = imageObj.y && canvas.height ? (imageObj.y >= 0 ? imageObj.y : canvas.height + imageObj.y) : 0,
                    image = new Image();
                image.onload = function () {
                    canvas.getContext('2d').drawImage(this, x, y, 40, 40);
                    resolve();
                };
                image.src = imageObj.src;
            });
        }


        browser.storage.local.get('myCollection', function (items) {
            for (let [key, pack] of Object.entries(items.myCollection)) {
                let cursorImage = browser.extension.getURL('/assets/images/icons/cursor-icon.png'),
                    pointerImage = browser.extension.getURL('/assets/images/icons/pointer-icon.png');
                if (Object.prototype.hasOwnProperty.call(pack.cursor, "path")) {
                    cursorImage = pack.cursor.path;
                }
                if (Object.prototype.hasOwnProperty.call(pack.pointer, "path")) {
                    pointerImage = pack.pointer.path;
                }
                if (!Object.prototype.hasOwnProperty.call(pack, "id")) {
                    pack.id = key;
                }
                if (!Object.prototype.hasOwnProperty.call(pack, "image")) {
                    mergeImageURIs([{src: cursorImage, x: 7, y: 4}, {
                        src: pointerImage,
                        x: 48,
                        y: 4
                    }]).then((imageB64) => {
                        pack.image = imageB64;
                        items.myCollection[key] = pack;
                        browser.storage.local.set({'myCollection': items.myCollection});
                    });
                }


            }

        });

    }
}

(function () {
    new background();
})();