'use strict';

/**
 * @author blife team
 * @email blife450@gmail.com
 * Copyright 2016-2021 Blife Team Authors
 * https://custom-cursor.com
 */
var maxSize = 4,
    browser = chrome,
    parser = new UAParser(),
    result = parser.getResult();

if (result.os.name == "Linux" || result.os.name == 'Chromium OS' || result.os.name == 'macOS' || result.os.name.toLowerCase() == 'mac os') {
    maxSize = 7;
}

if (result.os.name == "Windows") {
    switch (result.os.version) {
        case "10":
            maxSize = 7;
            break;
        case "8.1":
            maxSize = 4;
            break;
        case "8":
            maxSize = 4;
            break;
        case "7":
            maxSize = 4;
            break;
        default:
            maxSize = 4;
            break;
    }
}

function SliderUi(elem, size, maxSize) {
    let range_all_sliders = {'min': [0], 'max': [maxSize]};
    noUiSlider.create(elem, {
        start: size,
        range: range_all_sliders,
        step: 1,
        connect: [true, false],
        behaviour: 'tap',
        pips: {
            mode: 'steps',
            //density: 14,
            density: 20,
            stepped: true,
            decimals: 0
        }
    });
    elem.noUiSlider.on('update', function (values, type) {
        var curVal = Math.round(values).toFixed(0);
        $('.noUi-value').each(function () {
            if ($(this).text() < curVal) {
                $(this).prev().addClass('active');
            } else {
                $(this).prev().removeClass('active');
            }
        });
        browser.storage.local.set({'size': parseInt(curVal)});
    });
}

class Popup {
    constructor() {
        this.CONFIG = null;

        browser.storage.local.get(null, function (items) {
            this.CONFIG = items;
            if ($('*').is('#popup-size')) {
                SliderUi(document.getElementById('popup-size'), items.size, maxSize);
            }
            this.init();
        }.bind(this));
    }

    init() {
        let collectionsNode = $(".setting-collections");
        collectionsNode.html("");
        collectionsNode.append($(`<div class="box-setting" id="myCollection"><h3>My Collection</h3><div class="collection-cursors"></div></div>`));
        if (this.CONFIG.favorites.length > 0) {
            collectionsNode.append($(`<div class="box-setting" id="favorites"><h3>Favorites</h3><div class="collection-cursors"></div></div>`));
        }
        for (let [key, item] of Object.entries(this.CONFIG.myCollection)) {
            if (!Object.prototype.hasOwnProperty.call(item, "id")) {
                item.id = key;
                this.CONFIG.myCollection[key] = item;
                browser.storage.local.set(this.CONFIG);
            }

            let element = $(`<div class="cursor" title="my"><img src="${item.image}"/></div>`).data({
                pack: key,
                collname: 'myCollection'
            });
            $('#myCollection').find('.collection-cursors').append(element);
        }

        for (let collname of Object.keys(this.CONFIG.collection).sort()) {
            let item = this.CONFIG.collection[collname],
                collection = $(`<div class="box-setting" data-collname="${collname}"><h3>${item.name}</h3><div class="collection-cursors" data-collname="${collname}"></div></div>`).data('collname', collname);
            for (let [key, pack] of Object.entries(item.items)) {
                let elem = $(`<div class="cursor" title="${pack.name}, ${item.name}"><img class="lazyload" data-src="${pack.image}" src="/assets/icons/loading.gif" /></div>`);
                elem.data({'pack': pack.id, 'collname': collname});
                collection.find('.collection-cursors')
                    .append(elem);
                if (this.CONFIG.favorites.includes(pack.id)) {
                    $('#favorites').find('.collection-cursors').append(elem.clone().data({
                        'pack': pack.id,
                        'collname': collname
                    }));
                }
            }
            collectionsNode.append(collection);
        }


        function find(search) {
            return new Promise(function (resolve, reject) {
                $('.cursor').each(function () {
                    if ($(this).attr('title').toLowerCase().indexOf(search) > -1) {
                        $(this).addClass('vis').toggle(true);
                    } else {
                        $(this).removeClass('vis').toggle(false);
                    }
                });
                $('.cursor').promise().done(function () {
                    $('.collection-cursors').each(function (e) {
                        let collname = $(this).data('collname');
                        if ($(this).find('div.cursor.vis').length == 0) {
                            $(`.box-setting[data-collname=${collname}]`).hide()
                        } else {
                            $(`.box-setting[data-collname=${collname}]`).show()
                        }
                    });
                })
                return resolve()
            });
        }

        function filter(search) {
            find(search).then(function () {
            })
        }

        $("body")
            .on("click", '#clear', function () {
                this.CONFIG.selected = null;
                this.CONFIG.selected_type = 'none';
                this.CONFIG.rotator.status = 'off';
                browser.storage.local.set(this.CONFIG);
                browser.runtime.sendMessage({action: 'rotator', data: this.CONFIG.rotator});
                browser.runtime.sendMessage({action: 'clear'});
                browser.tabs.query({}, function (tabs) {
                    for (let i = 0; i < tabs.length; ++i) {
                        browser.tabs.sendMessage(tabs[i].id, {action: clear});
                    }
                });
            }.bind(this))
            .on('click', 'div.cursor', function (e) {
                let element = null, cursor = {}, pointer = {};
                if (e.target == e.currentTarget) {
                    element = $(e.target);
                } else {
                    element = $(e.target).parent('.cursor');
                }

                this.CONFIG.rotator.status = "off";
                browser.storage.local.set({"rotator": this.CONFIG.rotator});
                browser.runtime.sendMessage({"action": "rotator", data: this.CONFIG.rotator});

                let {collname, pack} = element.data(),
                    item;
                if (collname == 'myCollection') {
                    item = this.CONFIG.myCollection[pack];
                } else {
                    item = this.CONFIG.collection[collname].items.find(item => item.id === pack);
                }
                browser.runtime.sendMessage({"action": "changeCursor", item: item});
            }.bind(this))
            .on("keyup", 'input.search', function () {
                filter($(this).val().toLowerCase());
            })
            .on('click', '.btn-size', function () {
                $('.setting-size').addClass('active');
            })
            .on('click', '.close-setting-size', function () {
                $('.setting-size').removeClass('active');
            })
            .on('click', '.close-setting-search', function () {
                filter('')
            })
            .on('click', '.search-button', function () {
                $('.setting-content-t').removeClass('noactive').addClass('enablesearch')
                $(this).find('.fas.fa-search').removeClass('fa-search').addClass('fa-times');
                $(this).removeClass('search-button').addClass('search-close');
                setTimeout(function () {
                    $('input.search').focus()
                }, 500);
            })
            .on('click', '.search-close', function (e) {
                $('.setting-content-t').removeClass('enablesearch').addClass('noactive')
                $(this).find('.fas.fa-times').removeClass('fa-times').addClass('fa-search');
                $(this).removeClass('search-close').addClass('search-button')
            });
        $(".lazyload").lazyload();
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
}

(function () {
    new Popup();
    (new Localize()).init();

})();
