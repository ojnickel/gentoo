/**
 * @author Blife Team
 * @email blife450@gmail.com
 * Copyright 2016-2020 Blife Team Authors
 * https://custom-cursor.com
 */

var browser = chrome;
const Rotator = function (config, data) {
    this.status = config.status;
    this.request = config.request;
    this.time = config.time;
    this.type = config.type;
    this.data = data;
    this.enableRotator = true;

    if (this.data.favorites.length == 0) {
        offRotator();
        $('#rotator_status').attr('disabled', 'disabled')
    }

    if (this.status == 'on') {
        $("#rotator_status").attr('checked', "checked");
        onRotator();

    }
    if (this.status == 'off') {
        offRotator();
    }
    var self = this,
        saveRotator = () => {
            browser.runtime.sendMessage({
                action: 'rotator', data: {
                    status: this.status,
                    request: this.request,
                    time: this.time,
                    type: this.type,
                }
            });
            browser.storage.local.set({
                "rotator": {
                    status: this.status,
                    request: this.request,
                    time: this.time,
                    type: this.type,
                }
            });
        }
    $('body')
        .on('change', 'input#rotator_status[type=checkbox]', function (e) {
            if ($(this).is(':checked')) {
                self.status = 'on';
                onRotator();
            } else {
                self.status = 'off';
                offRotator()
            }
            saveRotator();

        })
        .on('change', '#rotator_type_count', function (e) {
            if ($("#rotator_type").is(':checked')) {
                self.request = parseInt($(this).val())
                if (isNaN(self.request)) self.request = 30;
            } else {
                if (parseInt($(this).val()) < 10) {
                    alert("Min value 10")
                    return;
                }
                self.time = parseInt($(this).val());
                if (isNaN(self.time)) self.time = 120;
            }
            saveRotator();
        })
        .on('change', '#rotator_type', function () {
            if ($(this).is(':checked')) {
                self.type = "request";
                self.status = "on";
                $('#rotator_type_count').val(self.request);
            } else {
                self.type = "time";
                self.status = "on";
                $('#rotator_type_count').val(self.time);
            }
            saveRotator();
        });
    if (this.type == "time") {
        $("#rotator_type_count").val(this.time)

    } else if (this.type == "request") {
        $("#rotator_type").attr('checked', 'checked');
        $("#rotator_type_count").val(this.request);
    }

    function onRotator() {
        $(".favorites-row").removeClass('disabled');
        $('input#rotator_type').removeAttr('disabled');
        $('input#rotator_type_count').removeAttr('disabled');
    }

    function offRotator() {
        $(".favorites-row").addClass('disabled');
        $('input#rotator_type').attr('disabled', 'disabled');
        $('input#rotator_type_count').attr('disabled', 'disabled');
    }


};


var rotator = {},
    CONFIG = {},
    wrapFiles = $('#collection'),
    packs = [];

browser.storage.local.get(null, function (items) {
    CONFIG = items;
    try {
        rotator = new Rotator(CONFIG.rotator, CONFIG);
        if (CONFIG.favorites.length == 0) {
            $('.favorites-btn').hide();
        }
    } catch (e) {
    }
    for (let collname of Object.keys(CONFIG.collection).reverse()) {
        let collection = CONFIG.collection[collname];
        wrapFiles.prepend($("#template_col").tmpl({collname: collname, collection: collection}));
        for (let [i, pack] of Object.entries(collection.items)) {
            if (CONFIG.favorites.includes(pack.id))
                packs.push(pack);
        }
    }
    $('.favorites-btn').append(`<a href="javascript:void(0)" id="show_favorites" class="btn btn__blue">${browser.i18n.getMessage("favorite_manage_button")}</a>`)


    $(document).on('click', '#show_favorites', function () {
        $.fancybox.open($('#fav-view').tmpl({packs: packs}))
    });


    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }

    const disableFavorites = function () {
        $('#favorites-btn').hide();
    };



    $('body')
        .on('click', '.delete-pack', function (e) {
            let {collection, packid} = $(this).data();
            $(`.table-media-row[data-packid=${packid}]`)
                .remove();
            CONFIG.collection[collection].items = CONFIG.collection[collection].items.filter(({id}) => id !== packid);
            if (CONFIG.collection[collection].items.length == 0) {
                delete CONFIG.collection[collection];
                $(`[data-id=${collection}]`).remove();
            }
            browser.storage.local.set({collection: CONFIG.collection});
            CONFIG.favorites = arrayRemove(CONFIG.favorites, packid);
            browser.storage.local.set({favorites: CONFIG.favorites});
            if (CONFIG.favorites.length == 0) {
                disableFavorites()
            }

            e.preventDefault();
        })
        .on('click', '.delete-pack-favorites', function () {
            let {packid} = $(this).data();
            $(`.table-media-row[data-packid=${packid}]`).remove();
            CONFIG.favorites = arrayRemove(CONFIG.favorites, packid);
            browser.storage.local.set({favorites: CONFIG.favorites});
        })
        .on('click', '.delete-all-favorites', function (e) {

            CONFIG.favorites = [];
            browser.storage.local.set({favorites: []});
            browser.storage.local.set({
                "rotator": {
                    status: 'off',
                    request: rotator.request,
                    time: rotator.time,
                    type: rotator.type,
                }
            });
            $('input#rotator_status[type=checkbox]').prop('checked', false);
            $('.favorites-btn').hide();
            $(".favorites-row").addClass('disabled');
            $('input#rotator_type').attr('disabled', 'disabled');
            $('input#rotator_type_count').attr('disabled', 'disabled');

            $.fancybox.close();
        })
        .on('click', '.close-rating-popup, .popup-view-btn', function () {
            $.fancybox.close();
        })
        .on('click', '.view-search-btn', function () {
            let block = $(this).closest('.popup-view');
            $(this).addClass('active');
            block.find('.popup-view-search').addClass('active');
            block.find('input').val("");


            setTimeout(function () {
                block.find('input').focus()
            }, 500);


        })
        .on('click', '.view-search-close', function () {
            let block = $(this).closest('.popup-view-search');
            $('.view-search-btn').removeClass('active');
            $('.popup-view-search').removeClass('active');
            $('.table-media-row').show(200)
            block.find('input').val("");
        })
        .on("keyup", '[name=search]', function () {
            filter($(this).val().toLowerCase());
        })
        .on('click', '.delete-coll', function (e) {
            let collection = $(this).data('collection');
            browser.storage.local.remove(collection);
            for (let i in CONFIG.collection[collection].items) {
                CONFIG.favorites = arrayRemove(CONFIG.favorites, CONFIG.collection[collection].items[i].id);
            }
            browser.storage.local.set({favorites: CONFIG.favorites});
            delete CONFIG.collection[collection];
            browser.storage.local.set({collection: CONFIG.collection});


            setTimeout(function () {
                $(`[data-id="${collection}"]`).hide();
                $(`[data-id="${collection}"]`).remove();
                $.fancybox.close()
            }, 200);
            e.preventDefault()
        })
        .on('click', '.fixture', function (e) {
            let id = $(this).data('id')
            $.fancybox.open($('#list-pack').tmpl({
                collection: CONFIG.collection[id],
                collname: CONFIG.collection[id].slug
            }));
            $('.popup-view.fancybox-content').css('height', $('.popup-view.fancybox-content').height()+50);
            $('.popup-view-bot').attr('style', '    position: absolute; bottom: 0px;left: 0px;    text-align: center;   width: 100%; display: inline-flex;')


        });


    function filter(search) {
        if (search.length < 1) {
            $('.table-media-row h3').filter(function () {
                $(this).parent('.table-media-row').show(200)
            });
        } else {
            $('.table-media-row h3').filter(function () {
                if ($(this).text().toLowerCase().indexOf(search) > -1) {
                    $(this).parent('.table-media-row').show(200)
                } else {
                    $(this).parent('.table-media-row').hide(200)
                }
            })
        }
    }

    $('[data-fancybox]').fancybox({
        btnTpl: {
            smallBtn: '<button data-fancybox-close class="close-ratting" title="{{CLOSE}}">' + '<i class="fas fa-times"></i>' + '</button>'
        },
        touch: {vertical: false}
    });


    (new Localize()).init();


});