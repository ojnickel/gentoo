/**
 * @author Blife Team
 * @email blife450@gmail.com
 * Copyright 2016-2019 Blife Team Authors
 * https://custom-cursor.com
 */
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

class Options {
    constructor() {
        this.uploadType = 'cursor';
        this.collection = {};
        this.template = $('#template').clone();
        this.current = null;


        chrome.storage.local.get(null, function (items) {
            this.collection = items.myCollection;
            this.renderCollection(items.myCollection);
        }.bind(this));
        this.init();

        $('body').on('click', '.button__upload', function (e) {
            let element = $(e.target);
            if (e.target != e.currentTarget) {
                element = $(e.target).parent('.button__upload');
            }
            let {packid, type} = element.data();

            if (typeof packid === 'undefined') {

                this.template = $('#template').clone()
                this.packid = new Date().getTime();
                packid = this.packid;
                this.collection[this.packid] = {id: this.packid, pointer: {}, cursor: {}};
                let pack = this.template;
                pack.removeAttr('id')
                    .attr('data-packid', this.packid);
                pack.find('.action[data-type=cursor]').attr('data-packid', this.packid);
                pack.find('.action[data-type=pointer]').attr('data-packid', this.packid);
                $('#template').before(pack);

            }
            this.uploadType = type;
            this.packid = packid;

            $('input#upload').trigger('click', [packid, type]);
        }.bind(this));
        $(`body`).on('click', '.button__remove', this.deleteItem.bind(this));
    }


    generateImage(pack) {
        let cursorImage = chrome.extension.getURL('/assets/images/icons/cursor-icon.png'),
            pointerImage = chrome.extension.getURL('/assets/images/icons/pointer-icon.png');
        if (Object.prototype.hasOwnProperty.call(pack.cursor, "path")) {
            cursorImage = pack.cursor.path;
        }
        if (Object.prototype.hasOwnProperty.call(pack.pointer, "path")) {
            pointerImage = pack.pointer.path;
        }
        mergeImageURIs([{src: cursorImage, x: 7, y: 4}, {src: pointerImage, x: 48, y: 4}]).then((r) => {
            pack.image = r;
            this.collection[pack.id] = pack;
            chrome.storage.local.set({'myCollection': this.collection});
        })
    }

    init() {

        $("#upload").on('change', function (event, a, b) {
            let $this = $("#upload"),
                valText = $this.val(),
                fileName = valText.split(/(\\|\/)/g).pop(),
                fileItem = $this.siblings('.file-item'),
                beginSlice = fileName.lastIndexOf('.') + 1,
                typeFile = fileName.slice(beginSlice);
            fileItem.find('.file-name').text(fileName);

            let tmppath = URL.createObjectURL(event.target.files[0]),
                reader = new FileReader();

            reader.onload = async function (event) {
                let item = this.collection[this.packid];

                let im = new Image();
                im.src = event.target.result;
                if (this.uploadType == 'cursor') {
                    im.onload = await function () {
                        item.cursor.width = im.width;
                        item.cursor.height = im.height;
                        if (im.width > 256 || im.height > 256) {
                            alert("Don't use pictures more than 128x128 pixels;");
                            return;
                        }
                        item.cursor.path = event.target.result;
                        item.cursor.name = fileName;
                        item.cursor.size = event.loaded;
                        $(`.pack[data-packid=${this.packid}] `).find('.preview-cur[data-type=cursor]').find('img').attr('src', item.cursor.path);
                        $(`.pack[data-packid=${this.packid}] `).find('.preview-cur[data-type=cursor] .action')
                            .removeClass('button__upload')
                            .addClass('button__remove')
                            .attr('title', chrome.i18n.getMessage('hint_remove_cursor'))
                            .find('i')
                            .removeClass('fa-plus')
                            .addClass('fa-trash-alt');
                        this.collection[this.packid] = item;
                        this.generateImage(this.collection[this.packid]);


                    }.bind(this);
                } else if (this.uploadType == 'pointer') {
                    im.onload = await function () {
                        item.pointer.width = im.width;
                        item.pointer.height = im.height;
                        if (im.width > 256 || im.height > 256) {
                            alert("Don't use pictures more than 128x128 pixels;");
                            return;
                        }
                        item.pointer.path = event.target.result;
                        item.pointer.name = fileName;
                        item.pointer.size = event.loaded;
                        $(`.pack[data-packid=${this.packid}] `).find('.preview-cur[data-type=pointer]').find('img').attr('src', item.pointer.path);
                        $(`.pack[data-packid=${this.packid}] `).find('.preview-cur[data-type=pointer] .action')
                            .removeClass('button__upload')
                            .addClass('button__remove')
                            .find('i')
                            .attr('title', chrome.i18n.getMessage('hint_remove_pointer'))
                            .removeClass('fa-plus')
                            .addClass('fa-trash-alt');
                        this.collection[this.packid] = item;
                        this.generateImage(this.collection[this.packid]);

                    }.bind(this);
                }


            }.bind(this);


            reader.readAsDataURL(event.target.files[0]);

        }.bind(this));
    }

    deleteItem(e) {
        let element = $(e.target);
        if (e.target != e.currentTarget) {
            element = $(e.target).parent('');
        }
        let {packid, type} = element.data();
        element.removeClass('button__remove')
            .addClass('button__upload')
            .find('i').removeClass('fa-trash-alt')
            .addClass('fa-plus');
        element.parent('.preview-cur').find('img').attr('src', `/assets/images/icons/${type}-icon.png`);

        this.collection[packid][type] = {};

        if (!Object.prototype.hasOwnProperty.call(this.collection[packid].cursor, "path") && !Object.prototype.hasOwnProperty.call(this.collection[packid].pointer, "path")) {
            delete this.collection[packid];
            $(`.pack[data-packid=${packid}]`).hide(200).remove();
            chrome.storage.local.set({myCollection: this.collection});
            return;
        }
        this.generateImage(this.collection[packid]);

        return false;
    }

    isEmpty(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }


    renderCollection(collection) {
        for (let [key, pack] of Object.entries(collection)) {
            let block = $(`<div class='col-lg-2 col-md-3 col-sm-4 col-xs-6 box-preview-cur mb20 pack' data-packid='${key}'>
                    <div class='preview-cur before-n' data-type="cursor">
                        <img src="assets/images/icons/cursor-icon.png"/>
                        <a href="javascript:void(0)" data-type='cursor' class="button action button__upload" data-packid="${key}"><i class="fas fa-plus"></i></a>
                    </div>
                    <div class='preview-cur before-n' data-type="pointer">
                            <img src="assets/images/icons/pointer-icon.png"/>
                            <a href="javascript:void(0)" data-type='pointer' class="button action button__upload" data-packid="${key}"><i class="fas fa-plus"></i></a>                       
                    </div>
            </div>`);

            if (Object.prototype.hasOwnProperty.call(pack.cursor, "path")) {
                block.find('.action[data-type=cursor]').addClass('button__remove').removeClass('button__upload').find('i').addClass('fa-trash-alt').removeClass('fa-plus');
                block.find('[data-type=cursor] img').attr('src', pack.cursor.path);
            }

            if (Object.prototype.hasOwnProperty.call(pack.pointer, "path")) {
                block.find('.action[data-type=pointer]').addClass('button__remove').removeClass('button__upload').find('i').addClass('fa-trash-alt').removeClass('fa-plus');
                block.find('[data-type=pointer] img').attr('src', pack.pointer.path);
            }
            $("#template").before(block);
        }
    }

}

new Options();
$(function () {


    (new Localize()).init();
});