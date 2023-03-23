'use strict';
!function (win) {
    class Cursors {
        constructor(config) {
            this.selected = undefined;
            this.sheet = (function () {
                let el = document.createElement('style');
                el.appendChild(document.createTextNode(''));
                el.type = 'text/css';
                el.rel = 'stylesheet';
                document.head.appendChild(el);
                return el;
            })();

            this.cssPointer = `[role^=button], button, .cc_pointer, [type="search"]::-webkit-search-cancel-button, a, select, [type="search"]::-webkit-search-decoration, .paper-button, .ytp-progress-bar-container, input[type=submit], :link, :visited, a > *, img, button, ::-webkit-scrollbar-button, .ogdlpmhglpejoiomcodnpjnfgcpmgale_pointer, ::-webkit-file-upload-button, button, .ytp-volume-panel, #myogdlpmhglpejoiomcodnpjnfgcpmgale .icon { cursor: url("#pointer#") #pointerOffsetX# #pointerOffsetY#, auto !important; } `;
            this.cssCursor = `[id^=root], [id^=docs], .cc_cursor, body, .ogdlpmhglpejoiomcodnpjnfgcpmgale_default, body, html, input[type="date"], input[type="time"], input[type="datetime-local"], input[type="month"], input::-webkit-contacts-auto-fill-button, input:read-only {cursor: url("#cursor#") #cursorOffsetX# #cursorOffsetY# , auto !important; }`;
            this.cssCursorAll = `* {cursor: url("#cursor#") #cursorOffsetX# #cursorOffsetY# , auto }`;
            this.cssPointerAll = `a, button, [type^=button], [role^=button]   { cursor: url("#pointer#") #pointerOffsetX# #pointerOffsetY#, auto }`;


            Object.assign(this, config);

            chrome.storage.onChanged.addListener(function (changes, area) {
                this.getSelected()
            }.bind(this));

            this.updateStyle = this.updateStyle.bind(this);
            this.getSelected();

        }

        getSelected() {
            chrome.storage.local.get(['selected'],  ({selected}) => {
                this.selected = selected;
                let {sheet} = this;
                if (selected == null || typeof selected == "undefined") {
                    sheet.innerHTML = "";
                } else {
                    this.updateStyle();
                }
            })
        }

        encodeCursorSvg(data, width) {
            if (data) {
                let size = "50px";
                return width && (size = width + "px"), "data:image/svg+xml;utf8," + encodeURIComponent(data.replace(/SVG_SIZE/g, size))
            }
        }


        updateStyle() {
            let {selected, sheet} = this,
                styles = [];

            if (selected) {
                const {cursor, pointer} = selected;


                if (Object.prototype.hasOwnProperty.call(pointer, 'path')) {
                    let pointerStyle = this.cssPointer;
                    pointerStyle = pointerStyle.replace(/#pointer#/g, pointer.path);
                    pointerStyle = pointerStyle.replace(/#pointerOffsetX#/g, pointer.offsetSizeX);
                    pointerStyle = pointerStyle.replace(/#pointerOffsetY#/g, pointer.offsetSizeY);

                    let pointerStyleAll = this.cssPointerAll;
                    pointerStyleAll = pointerStyleAll.replace(/#pointer#/g, pointer.path);
                    pointerStyleAll = pointerStyleAll.replace(/#pointerOffsetX#/g, pointer.offsetSizeX);
                    pointerStyleAll = pointerStyleAll.replace(/#pointerOffsetY#/g, pointer.offsetSizeY);

                    if (win.location.hostname == 'docs.google.com') {
                        pointerStyle = '.punch-filmstrip-thumbnail, [role^=button], ' + pointerStyle;
                    }
                    styles.push(pointerStyle)
                    styles.push(pointerStyleAll);

                }

                if (Object.prototype.hasOwnProperty.call(cursor, 'path')) {
                    let cursorStyleAll = this.cssCursorAll,
                        cursorStyle = this.cssCursor;
                    cursorStyle = cursorStyle.replace(/#cursor#/g, cursor.path);
                    cursorStyle = cursorStyle.replace(/#cursorOffsetX#/g, cursor.offsetSizeX);
                    cursorStyle = cursorStyle.replace(/#cursorOffsetY#/g, cursor.offsetSizeY);


                    cursorStyleAll = cursorStyleAll.replace(/#cursor#/g, cursor.path);
                    cursorStyleAll = cursorStyleAll.replace(/#cursorOffsetX#/g, cursor.offsetSizeX);
                    cursorStyleAll = cursorStyleAll.replace(/#cursorOffsetY#/g, cursor.offsetSizeY);

                    if (win.location.hostname == 'docs.google.com') {
                        cursorStyle = '.cursor-default, ' + cursorStyle
                    }
                    styles.push(cursorStyle);
                    styles.push(cursorStyleAll);
                }
                sheet.innerHTML = styles.join(' ');
            } else {
                sheet.innerHTML = "";
            }
        }
    }

    win.blife = new Cursors();

    if (window.location.href != 'chrome-extension://ogdlpmhglpejoiomcodnpjnfgcpmgale/index.html') {
        chrome.runtime.onMessage.addListener(function (request, sender, response) {
            if (request.action == "update") {
                win.blife.getSelected();
                response({status: true});
            }
            if (request.action == "clear") {
                win.blife.sheet.innerHTML = "";
                response({status: true});
            }
        })
    }

}(window);




