/**
 * @author blife
 * @email blife450@gmail.com
 * Copyright 2016-2021 blife team
 * https://custom-cursor.com
 */
class Cursors {
    constructor() {
        this.size = 3;
        this.cssPointer = `[role^=button], button, .cc_pointer, [type="search"]::-webkit-search-cancel-button, a, select, [type="search"]::-webkit-search-decoration, .paper-button, .ytp-progress-bar-container, input[type=submit], :link, :visited, a > *, img, button, ::-webkit-scrollbar-button, .ogdlpmhglpejoiomcodnpjnfgcpmgale_pointer, ::-webkit-file-upload-button, button, .ytp-volume-panel, #myogdlpmhglpejoiomcodnpjnfgcpmgale .icon { cursor: url("#pointer#") #pointerOffsetX# #pointerOffsetY#, auto !important; } `;
        this.cssCursor = `[id^=root], [id^=docs], .cc_cursor, body, .ogdlpmhglpejoiomcodnpjnfgcpmgale_default, body, html, input[type="date"], input[type="time"], input[type="datetime-local"], input[type="month"], input::-webkit-contacts-auto-fill-button, input:read-only {cursor: url("#cursor#") #cursorOffsetX# #cursorOffsetY# , auto !important; }`;
        this.cssCursorAll = `* {cursor: url("#cursor#") #cursorOffsetX# #cursorOffsetY# , auto }`;
        this.cssPointerAll = `a, button, [type^=button], [role^=button]   { cursor: url("#pointer#") #pointerOffsetX# #pointerOffsetY#, auto }`;
        this.sheet = (function () {
            let el = document.createElement('style');
            el.appendChild(document.createTextNode(''));
            el.type = 'text/css';
            el.rel = 'stylesheet';
            document.head.appendChild(el);
            return el;
        })();

        chrome.storage.onChanged.addListener(function (changes, area) {
            if (changes.selected || changes.size || changes.status) {
                if (changes.selected != this.selected) {
                    this.getSelected()
                }
                if (window.location.href == 'chrome-extension://ogdlpmhglpejoiomcodnpjnfgcpmgale/index.html') {
                    this.getSelected()
                }
            }
        }.bind(this));

        this.init = this.init.bind(this);
        this.getSelected();

    }

    getSelected() {
        chrome.storage.local.get(['selected_type', 'selected', 'size', 'status'], function ({selected_type, selected, size, status}) {
            this.selected = selected;
            if (selected == null || typeof selected == "undefined") {
                this.sheet.innerHTML = "";
            } else {
                this.init();
            }
        }.bind(this))
    }

    init() {
        if (this.selected) {
            let {cursor, pointer} = this.selected;


            if (!Object.prototype.hasOwnProperty.call(pointer, 'offsetSizeX')) {
                Object.assign(pointer, {offsetSizeX: 0, offsetSizeY: 0});
            }
            if (!Object.prototype.hasOwnProperty.call(cursor, 'offsetSizeX')) {
                Object.assign(cursor, {offsetSizeX: 0, offsetSizeY: 0});
            }

            let csCursors = JSON.parse(localStorage.getItem('csCursors')),
                csPointers = JSON.parse(localStorage.getItem('csPointers'));
            if (csCursors == null) csCursors = [];
            if (csPointers == null) csPointers = [];
            let cs_pointers = (csPointers.length > 0) ? csPointers.join(', ') + ', ' : '',
                cs_cursors = (csCursors.length > 0) ? csCursors.join(', ') + ', ' : '';

            this.tmpPointer = '',
                this.tmpPointerAll = '',
                this.tmpCursorAll = '',
                this.tmpCursor = '';

            if (Object.prototype.hasOwnProperty.call(pointer, 'path')) {
                this.tmpPointer = this.cssPointer;
                this.tmpPointer = this.tmpPointer.replace(/#pointer#/g, pointer.path);
                this.tmpPointer = this.tmpPointer.replace(/#pointerOffsetX#/g, pointer.offsetSizeX);
                this.tmpPointer = this.tmpPointer.replace(/#pointerOffsetY#/g, pointer.offsetSizeY);
                this.tmpPointer = cs_pointers + this.tmpPointer;

                this.tmpPointerAll = this.cssPointerAll;
                this.tmpPointerAll = this.tmpPointerAll.replace(/#pointer#/g, pointer.path);
                this.tmpPointerAll = this.tmpPointerAll.replace(/#pointerOffsetX#/g, pointer.offsetSizeX);
                this.tmpPointerAll = this.tmpPointerAll.replace(/#pointerOffsetY#/g, pointer.offsetSizeY);

                if (window.location.hostname == 'docs.google.com') {
                    this.tmpPointer = '.punch-filmstrip-thumbnail, [role^=button], ' + this.tmpPointer;
                }
            }

            if (Object.prototype.hasOwnProperty.call(cursor, 'path')) {
                this.tmpCursor = this.cssCursor;
                this.tmpCursor = this.tmpCursor.replace(/#cursor#/g, cursor.path);
                this.tmpCursor = this.tmpCursor.replace(/#cursorOffsetX#/g, cursor.offsetSizeX);
                this.tmpCursor = this.tmpCursor.replace(/#cursorOffsetY#/g, cursor.offsetSizeY);
                this.tmpCursor = cs_cursors + this.tmpCursor;


                this.tmpCursorAll = this.cssCursorAll;
                this.tmpCursorAll = this.tmpCursorAll.replace(/#cursor#/g, cursor.path);
                this.tmpCursorAll = this.tmpCursorAll.replace(/#cursorOffsetX#/g, cursor.offsetSizeX);
                this.tmpCursorAll = this.tmpCursorAll.replace(/#cursorOffsetY#/g, cursor.offsetSizeY);

                if (window.location.hostname == 'docs.google.com') {
                    this.tmpCursor = '.cursor-default, ' + this.tmpCursor
                }
            }
            this.sheet.innerHTML = this.tmpCursor + this.tmpPointer + this.tmpCursorAll + this.tmpPointerAll;
        } else {
            this.sheet.innerHTML = "";
        }
    }
}

(function () {
    var cursorLib = new Cursors();
    if (window.location.href != 'chrome-extension://ogdlpmhglpejoiomcodnpjnfgcpmgale/index.html') {
        chrome.extension.onMessage.addListener(function (request, sender, sendResponseParam) {
            if (request.action == "update") {
                cursorLib.getSelected()
            }
            if (request.action == "clear") {
                cursorLib.sheet.innerHTML = "";
            }
        })
    }

})();




