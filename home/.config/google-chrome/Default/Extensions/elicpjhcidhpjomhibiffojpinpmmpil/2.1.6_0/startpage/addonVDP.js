var nVersion = 1; // will be replaced

var fVideo = true;
var defaults = defaults2;
var VideoSites = defaults.VideoSites;

var fr = {

    slastInner: "",
    fEditMode: false,
    nPages: 0,
    nCurPage: 0,
    lpToplinkBottomFolder: 0,
    lpCurFolder: 0,
    nToplinks: 0,
    nToplinksPerPage: 0,
    nCurFolderLevel: 0,
    lpFolderStack: [{ "page": "", "parent": "" }, { "page": "", "parent": "" }, { "page": "", "parent": "" }, { "page": "", "parent": "" }, { "page": "", "parent": "" }, { "page": "", "parent": "" }],
    n1x1Count: 0,
    nShoppingMode: 0,
    FilterList: new Array(),
    FilterListCount: 0,
    curFilter: "",
    fReadCookies: 1,
    nCurSearchProvider: 0,
    nToRender: 0,
    nRenderd: 0,
    lpOverlayPos: new Array(),
    lpDragTargets: 0,
    curTimer: 0,
    curVideo: -1,


    SetVideoFilter: function (txt) {
        console.log("SetVideoFilter");
        this.curFilter = txt;
        fr.checkAddButtons();
        this.FilterList = new Array();
        this.FilterListCount = 0;


        var videofolder = fr.FindToplinkType(0, "v");
        if (txt == "") {
            fr.doSetFolder(videofolder.id);
        }
        else {
            var tl = videofolder.Toplinks;
            var count = tl.length;
            var lwr = this.curFilter.toLowerCase();
            for (var idx = 0; idx < count; idx++) {
                if (tl[idx].name.toLowerCase().indexOf(lwr) >= 0 ||
                    (tl[idx].url && tl[idx].url.toLowerCase().indexOf(lwr) >= 0)) {
                    this.FilterList[this.FilterListCount] = tl[idx];
                    this.FilterListCount++;
                }
            }
            this.lpCurFolder = new Object();
            this.lpCurFolder.id = 0;
            this.lpCurFolder.type = "v";
            this.lpCurFolder.Toplinks = this.FilterList;
            this.nCurPage = 0;
        }
        this.doResize();
    },

    SetFilter: function (txt) {
        fr.SetVideoFilter(txt);
    },

    doSetFolder: function (id) {
        if (this.lpCurFolder && id == this.lpCurFolder.id)
            return;

        fr.curTimer++;
        if (id < 0) // one level up
        {
            if (this.nCurFolderLevel > 0)
                this.nCurFolderLevel--;
            this.nCurPage = this.lpFolderStack[this.nCurFolderLevel].page;
            var tl = fr.FindToplink(0, this.lpFolderStack[this.nCurFolderLevel].id);
            if (tl)
                this.lpCurFolder = tl;
            else
                this.lpCurFolder = 0;
            this.doResizeHome();

            fr.doShowHelp();
            fr.checkAddButtons();
            return;
        }

        var tl = fr.FindToplink(0, id);

        this.ReloadFolder(tl);
        fr.checkAddButtons();
        fr.doShowHelp();
    },

    checkAddButtons: function () {
        if (!fr.curFilter && fr.settings.fShowToplinks && (!fr.lpCurFolder || fr.lpCurFolder.type == "f")) {
            fr.jq.showD("#idAddFolder");
            fr.jq.showD("#idAddUrl");
        }
        else {
            fr.jq.hideD("#idAddFolder");
            fr.jq.hideD("#idAddUrl");
        }
        if (fr.lpCurFolder && fr.lpCurFolder.type == "v") {
            fr.CreateVideoBar();
            fr.jq.showD("#idVideobar");
            fr.jq.hideD("#idBestofbar");
        }
        else {
            fr.jq.hideD("#idVideobar");
            fr.jq.showD("#idBestofbar");
        }
    },
    ReloadFolder: function (folder) {
        if (fVideo && folder.type == "v") {
            fr.lpFolderStack[fr.nCurFolderLevel].page = fr.nCurPage;
            fr.lpFolderStack[fr.nCurFolderLevel].id = fr.lpCurFolder ? fr.lpCurFolder.id : -1;
            fr.nCurFolderLevel++;
            fr.lpCurFolder = folder;
            fr.lpCurFolder.Toplinks = new Array();

            var dataitems = L64P.video.getWatchedItems({}, function (data) {
                fr.ConvertVideoData(data.items);
                fr.doResizeHome();
            });

            if (typeof (dataitems) != 'undefined')
                if (dataitems)
                    fr.ConvertVideoData(dataitems);

            fr.nCurPage = 0;
            fr.doResizeHome();
        }
    },


    ConvertVideoData: function (dataitems) {
        fr.lpCurFolder.Toplinks = new Array();
        for (var idx = 0; idx < dataitems.length; idx++) {
            var item = dataitems[idx];

            var curobj = new Object();
            curobj.playhtml = item.html;
            curobj.playurl = item.playurl;
            curobj.searchurl = "";
            curobj.type = "video"
            curobj.originalUrl = item.originalUrl;
            curobj.url = item.originalUrl;
            curobj.thumb = item.thumbnail_url;
            curobj.name = item.title;
            curobj.videoid = item.videoid;
            curobj.id = fr.nextfreeid++;
            if (fr.lpCurFolder && fr.lpCurFolder.Toplinks && fr.lpCurFolder.type == "v")
                fr.lpCurFolder.Toplinks.push(curobj);
        }
    },

    resizeIFrame: function () {
        var o1 = document.getElementById("idPlayVideoThumbs");
        var o2 = document.getElementById("idPlayVideoInner");
        if (!o2)
            return;
        var o3 = o2.firstChild;
        if (!o3)
            return;
        var o4 = document.getElementById("idSlideshow");
        if (!o4)
            return;
        if (o4) {
            var dx = o4.offsetWidth;
            var dy = o4.offsetHeight;
            o3.id = "idPV";
            o2.style.left = "16px";
            o2.style.top = "100px";
            o3.width = dx - 300;
            o3.height = dy - 60 - 18;
            o1.style.height = (dy - 36) + "px";
        }
    },

    GetTagParam: function (cururl, tag) {
        var idx = cururl.indexOf(tag + '="');
        if (idx >= 0) {
            idx += tag.length + 2;
            var i2 = cururl.indexOf('"', idx);
            if (i2 > idx)
                return cururl.substr(idx, i2 - idx);
        }
        var idx = cururl.indexOf(tag + "='");
        if (idx >= 0) {
            idx += tag.length + 2;
            var i2 = cururl.indexOf("\'", idx);
            if (i2 > idx)
                return cururl.substr(idx, i2 - idx);
        }
        return false;


    },

    videoPlaying: false,
    PlayVideo: function (curobj) {
        if (!fVideo)
            return;
        if (!curobj) {
            fr.videoPlaying = false;
            fr.removeAllChilds(document.getElementById("idPlayVideoInner"));
            fr.removeAllChilds(document.getElementById("idPlayVideoThumbs"));
            fr.jq.hideD("#idPlayVideo");
            fr.ShowToplinks(fr.settings.fShowToplinks);
            fr.doResize();
            fr.doShowHelp();
            document.title = fr.title;
            return;
        }
        document.title = curobj.name;
        //document.title = "dummy";
        fr.videoPlaying = true;
        fr.doShowHelp();

        
        fr.jq.setText("#idVideoTitleA", aTxt["original"]);
        fr.jq.setAttr("#idVideoTitleA", "href", curobj.originalUrl);

        fr.jq.setText("#idVideoTitleB", aTxt["showinwindow"]);
        fr.jq.setAttr("#idVideoTitleB", "href", curobj.playurl);
        fr.jq.setText("#idVideoClose", aTxt["close"]);
        //fr.myBindClick("#idVideoTitle", { }, function(ev) {fr.removeAllChilds(document.getElementById("idPlayVideoInner"));window.location.replace( curobj.url);return false;});

        if (!curobj.playurl && curobj.playhtml) {
            if (curobj.playhtml.indexOf("<iframe") >= 0) {
                curobj.playurl = fr.GetTagParam(curobj.playhtml, "src");
            }
        }

        if (curobj.playurl) {
            fr.removeAllChilds(document.getElementById("idPlayVideoInner"));
            fr.co('iframe', document.getElementById("idPlayVideoInner"), { "id": 'idPV', "src": curobj.playurl });
            fr.resizeIFrame();
        }

        fr.jq.showD("#idPlayVideo");
        //fr.myBindClick("#idPlayVideo", { }, function(ev) {fr.PlayVideo(0);return false;});
        fr.myBindClick("#idVideoClose", {}, function (ev) { fr.PlayVideo(0); return false; });
        fr.myBindClick("#idPlayVideoBg", {}, function (ev) { fr.PlayVideo(0); return false; });
        fr.myBindClick("#idPlayVideoThumbs", {}, function (ev) { fr.PlayVideo(0); return false; });

        fr.jq.hideD("#idToplinks");

        fr.removeAllChilds(document.getElementById("idPlayVideoThumbs"));
        if (!fr.curvideolist)
            return;

        var aVisibleList = new Array();
        var len = fr.curvideolist.length;
        for (var idxCur = 0; idxCur < len; idxCur++) {
            var cur = fr.curvideolist[idxCur];
            if (cur.url == curobj.url) {
                if (idxCur > 0)
                    aVisibleList.push(fr.curvideolist[idxCur - 1]);
                else {
                    len--;
                    aVisibleList.push(fr.curvideolist[len]);
                }
                for (var idx = idxCur + 1; idx < len; idx++)
                    aVisibleList.push(fr.curvideolist[idx]);
                for (idx = 0; idx + 1 < idxCur; idx++)
                    aVisibleList.push(fr.curvideolist[idx]);
                break;
            }
        }

        var idxVideo = 0;
        var posY = 0;

        for (var idx = 0; idx < aVisibleList.length; idx++) {
            var cur = aVisibleList[idx];
            if (cur.type != "video")
                continue;

            var oDiv = fr.co('div', document.getElementById("idPlayVideoThumbs"), { "style": "top:" + posY + "px;background:#000", "id": "idv_" + idxVideo, "class": "clVideo" });
            var oA = fr.co('a', oDiv, {});

            posY += 136;
            var thumb = fr.GetToplinkThumb(cur);
            var si = GetImageSize(thumb);
            var oInner = fr.createVideoItemHtml(cur, thumb, 224, 126, si);
            if (oInner)
                oA.appendChild(oInner);
            var oDiv2 = fr.co('div', oDiv, { "id": "id4v_" + idxVideo, "class": "clOverlay" });
            var oA = fr.co('a', oDiv2, {});
            oA.textContent = cur.name;
            fr.myBindClick("#idv_" + idxVideo, { param: cur }, function (ev) {
                //ev.preventDefault();
                //ev.stopPropagation();
                //alert("play " + ev.data.param);
                fr.PlayVideo(ev.data.param);
                return false;
            });
            fr.myBindIn("#idv_" + idxVideo, { param: 'id4v_' + idxVideo }, function (ev) {
                fr.jq.setStyle("#" + ev.data.param, "visibility", "visible");
            });
            fr.myBindOut("#idv_" + idxVideo, { param: 'id4v_' + idxVideo }, function (ev) {
                fr.jq.setStyle("#" + ev.data.param, "visibility", "hidden");
            });
            idxVideo++;
        }
    },

    doSetPage: function (page) {
        this.nCurPage = page;
        this.doResizeHome();
    },


    doChangePage: function (page) {
        if (page == -1) {
            if (this.nCurPage > 0)
                this.nCurPage--;
            else
                this.nCurPage = this.nPages - 1;
            fr.doResizeHome();
        }
        else if (page == 1) {
            if (this.nCurPage + 1 < this.nPages)
                this.nCurPage++;
            else
                this.nCurPage = 0;
            fr.doResizeHome();
        }
    },

    doShowName: function (id) {
        if (fr.drag)
            return;
        if (fr.idCurrentEdit)
            return;
        var curobj = document.getElementById(id);
        if (curobj)
            curobj.style.visibility = "visible";
        if (!fr.idCurrentEdit) {
            fr.jq.setStyle('#' + id.replace("id4_", "idback_"), "opacity", "1.0"); // Chrome
            fr.jq.setStyle('#' + id.replace("id4_", "idback_"), "filter", "alpha(opacity = 100)");
        }

        {
            var curobj = document.getElementById(id.replace("id4_", "idBlack_"));
            if (curobj)
                curobj.style.visibility = "visible";
        }
    },

    doShowNameHome: function (idText, idToplink, jpg) {
       
        if (fr.drag)
            return;
        if (fr.idCurrentEdit)
            return;
        if (!jpg)
            return;
        jpg = jpg.replace("_224", "_448");
        fr.curTimer++;
        setTimeout(function (idToplink, url, timer) {
            fr.doShowScreenshot(idToplink, url, timer);
        }, 500, idToplink, jpg, fr.curTimer);
        var curobj = document.getElementById(idText);
        if (curobj)
            curobj.style.visibility = "visible";

        var curobj = document.getElementById(idText.replace("id4_", "idBlack_"));
        if (curobj)
            curobj.style.visibility = "visible";

        if (!fr.idCurrentEdit) {
            fr.jq.setStyle('#' + idText.replace("id4_", "idback_"), "opacity", "1.0"); // Chrome
            fr.jq.setStyle('#' + idText.replace("id4_", "idback_"), "filter", "alpha(opacity = 100)");
        }
    },

    doShowScreenshot: function (idToplink, url, timer) {
        if (timer != fr.curTimer)
            return;
        var o2 = document.getElementById("idOverlay");
        var o3 = document.getElementById("id_" + idToplink);
        if (o2 && o3) {
            var posX = fr.lpOverlayPos[idToplink].posX;
            o2.style.left = posX + "px";
            var posY = fr.lpOverlayPos[idToplink].posY;
            o2.style.top = posY + "px";
            var dx = fr.lpOverlayPos[idToplink].dx;
            o2.style.width = dx + "px";
            var dy = fr.lpOverlayPos[idToplink].dy;
            o2.style.height = dy + "px";

            fr.removeAllChilds(o2);

            var si = GetImageSize(url);
            if (si)
                fr.createVideoOverlay(o2, url, dx, dy, si);
            else
                fr.co('img', o2, { 'width': "100%", 'height': "100%", 'src': url });

            o2.style.visibility = "visible";
        }
    },

    createVideoOverlay: function (o2, thumb, dx1, dy1, si) {
        if (!si)
            return;

        var width = dx1;
        var height = width * si.height / si.width;
        if (height < dy1) {
            height = dy1;
            width = height * si.width / si.height;
        }
        var mx = (dx1 - width) / 2;
        var my = (dy1 - height) / 2;

        var curobj = fr.co('div', o2, { 'class': "clThumb", 'style': "overflow:hidden;padding:0px;height:100%;width:100%;" });
        fr.co('img', curobj, { 'draggable': "false", 'style': 'width:' + width + 'px;height:' + height + 'px; margin-left:' + mx + 'px;margin-top:' + my + 'px;', src: thumb });
    },


    moveAllChilds: function (src, dst)
    {        
        var child = src.firstChild;
        while (child) {
            dst.appendChild(child);
            child = src.firstChild;
        }
    },

    removeAllChilds: function (curobj) {
        if (!curobj)
            return;
        var child = curobj.firstChild;
        while (child) {
            curobj.removeChild(child);
            child = curobj.firstChild;
        }
    },

    doHideName: function (id) {
        fr.curTimer++;
        var curobj = document.getElementById(id);
        if (curobj)
            curobj.style.visibility = "hidden";

        var curobj = document.getElementById(id.replace("id4_", "idBlack_"));
        if (curobj)
            curobj.style.visibility = "hidden";

        if (!fr.idCurrentEdit)
            if (!this.lpCurFolder || this.lpCurFolder.type != "v")
                fr.jq.setStyle('#' + id.replace("id4_", "idback_"), "opacity", fr.settings.trans); // Chrome

        //fr.jq.setStyle('#'+id.replace("id4_", "idback_"), "filter", "alpha(opacity = 80)");

        var o2 = document.getElementById("idOverlay");
        if (o2)
            o2.style.visibility = "hidden";
    },


    doResize: function () {
        fr.resizeIFrame();
        fr.doResizeHome();
    },

    slideDX: 0,
    slideDY: 0,
    positionSlideshow: function () {
        this.slideDX = 0;
        this.slideDY = 0;
        var curobj = document.getElementById("idSlide");
        if (curobj && curobj.width && curobj.height) {
            fr.doResizeHome();
            fr.jq.setStyle("#body", "visibility", "visible");
        }
        else
            setTimeout(function () { fr.positionSlideshow(1); }, 50);
    },

    myBind: function (id, what, ob, callback) {
        if (typeof (callback) != "function")
            return;

        //ob.callback = callback;

        var func = function (ob, param) { callback({ "data": param }) }
        fr.jq.setEvent(id, what, func, ob);
    },

    myBindIn: function (id, ob, callback) {
        fr.myBind(id, "mouseenter", ob, callback);
    },
    myBindOut: function (id, ob, callback) {
        fr.myBind(id, "mouseleave", ob, callback);
    },
    myBindClick: function (id, ob, callback) {
        fr.myBind(id, "click", ob, callback);
    },

    curvideolist: 0,
    transToplinks: 0,
    doResizeHome: function () {
        var editAfterResize = fr.idCurrentEdit;
        var bkcolor = fr.GetBackgroundColor();
        if (bkcolor != -1) {
            fr.jq.get("#idSlideshow").innerText = "";
            fr.jq.setStyle("#idSlideshow", "background", bkcolor);
            fr.jq.setStyle("#idSlideshow", "visibility", "visible");
            var b1 = bkcolor;
            var b2 = fr.GetGradientColor(b1);
            fr.jq.setStyle("#idSlideshow", "background", "linear-gradient(135deg, " + b1 + " 0%," + b2 + " 100%");

        }

        /*curobj = document.getElementById("idSearchButton"); 
        posX = curobj.offsetWidth;
        var xx = curobj.offsetLeft;
        if ( posX < 10)
            posX = 10;           
            
        curobj = document.getElementById("idInput"); 
        curobj.style.width = posX-10+"px";
        
        var o2 = document.getElementById("idSearchButton2"); 
        o2.style.left = xx+posX+"px";
        */

        //-------------------------------- PrepareToplinks for drawing--------------------------------
        curobj = document.getElementById("toplinks");
        dx = curobj.offsetWidth;
        dy = curobj.offsetHeight;

        if (dx < 860)
            fr.jq.hideD("#langKey_addfolder");
        else
            fr.jq.showD("#langKey_addfolder");

        if (dx < 750)
            fr.jq.hideD("#langKey_editToplinks-2");
        else
            fr.jq.showDI("#langKey_editToplinks-2");

        if (dx < 800)
            fr.jq.hideD("#langKey_addToplink");
        else
            fr.jq.showD("#langKey_addToplink");

        dy -= 5;
        dy1 = (dy - 20) / 3;
        if (dy1 > 126)
            dy1 = 126;

        dx1 = 224 * dy1 / 126;
        nCols = Math.floor((dx + 10) / (dx1 + 10));

        var bottom2 = this.lpCurFolder ? this.lpCurFolder.Toplinks : fr.lpToplinkBottomFolder;
        var bottom = new Array();

        for (var idx = 0; idx < bottom2.length; idx++) {
            var cur = bottom2[idx];
            if (!cur)
                continue;
            if (!(fr.settings.folder & 1) && cur.type == "e")
                continue;
            if (!(fr.settings.folder & 2) && cur.type == "a")
                continue;
            if (!(fr.settings.folder & 4) && cur.type == "m")
                continue;
            if (!(fr.settings.folder & 8) && cur.type == "v")
                continue;
            bottom.push(cur);
        }

        fr.curvideolist = 0;
        if (this.lpCurFolder && this.lpCurFolder.type == "v") {
            fr.curvideolist = bottom;
            if (this.fEditMode)
                fr.fVideosChanged = true; // we are in videofolder in edit mode
        }

        this.nToplinks = bottom.length;

        this.nToplinksPerPage = nCols * 3;
        if (this.nToplinksPerPage < 1)
            this.nPages = 0;
        else
            this.nPages = Math.floor((this.nToplinks + this.nToplinksPerPage - 1) / this.nToplinksPerPage);

        if (this.nCurPage + 1 > this.nPages)
            this.nCurPage = this.nPages - 1;
        if (this.nCurPage < 0)
            this.nCurPage = 0;

        ofs = this.nCurPage * this.nToplinksPerPage;

        var nTotal = this.nToplinks;
        count = this.nToplinksPerPage;

        if (count + ofs > nTotal) {
            count = nTotal - ofs;
            nCols = Math.floor((count + 2) / 3);
        }

        var oHidden = document.getElementById("idHiddenThumbs");
        fr.removeAllChilds(oHidden);
        if (oHidden) {
            for (var idx = 0; idx < count; idx++) {
                idxOfs = idx + ofs;
                var cur = bottom[idxOfs];
                if (!cur)
                    continue;

                var thumb = fr.GetToplinkThumb(cur);
                //sInner+= '<img class="clThumbBase" ="'+thumb+'"></img>';      

                fr.co('img', oHidden, { 'src': thumb, "class": 'clThumbBase' });
            }
        }
        fr.transToplinks = new Object();
        //-------------------------------- DrawToplinks --------------------------------    

        var oParent = document.getElementById("toplinks");
        fr.removeAllChilds(oParent);
        {
            for (var idx = 0; idx < count; idx++) {
                idxOfs = idx + ofs;

                var cur = bottom[idxOfs];
                if (!cur)
                    continue;

                var fFolder = (cur.type == "f" || cur.type == "v");
                //var fShowSearchUrl = dy1>88 && !this.fEditMode && cur.searchurl != "" && !fFolder;
                var fShowTitle = false;//( cur.def && !fShowSearchUrl && cur.url && cur.url.indexOf("ebay")>=0);
                {
                    var thumb = fr.GetToplinkThumb(cur);
                    fr.transToplinks[cur.id] = 'idback_' + idx;

                    var oDiv1 = document.createElement('div');
                    oDiv1.setAttribute('id', 'idback_' + idx);
                    oDiv1.setAttribute('class', 'clToplinkBack');
                    oParent.appendChild(oDiv1);


                    if (!(fr.idCurrentEdit == cur.id || cur.type == "video"))
                        //sInner+= '<div id="idback_'+idx+'" class="clToplinkBack" >'; // aaaaaaaaaaaaaaaaa
                        //else
                        oDiv1.setAttribute('style', "opacity:" + fr.settings.trans);
                    //sInner+= '<div id="idback_'+idx+'" class="clToplinkBack" style="opacity:'+fr.settings.trans+'">'; // aaaaaaaaaaaaaaaaa
                    if (fr.drag == 2 && fr.dragToplinkId == cur.id) // Resize during D&D: Set new divId and make item hidden
                    {
                        fr.dragId = "id_" + idx;

                        var oDiv2 = document.createElement('div');
                        oDiv2.setAttribute('id', 'id_' + idx);
                        oDiv2.setAttribute('class', 'clToplink');
                        oDiv2.setAttribute('style', 'visibility:hidden;cursor:default');
                        oDiv1.appendChild(oDiv2);
                        //sInner+= '<div style="visibility:hidden;cursor:default" id="id_'+idx+'" class="clToplink"></div>';
                    }

                    else {

                        {

                            var oDiv2 = false;

                            {
                                oDiv2 = document.createElement('div');
                                oDiv2.setAttribute('id', 'id_' + idx);
                                oDiv2.setAttribute('class', 'clToplink');
                                oDiv1.appendChild(oDiv2);
                                if (cur.type == "video") {
                                    oDiv2.setAttribute('style', 'background:#000');
                                    //sInner+= '<div id="id_'+idx+'" style="background:#000" class="clToplink" ';
                                }
                                //else
                                //    sInner+= '<div id="id_'+idx+'" class="clToplink" ';
                                var si = GetImageSize(thumb);

                                var oA = document.createElement('a');
                                //#####oA.setAttribute('href', cur.url);
                                oDiv2.appendChild(oA);

                                if (cur.type == "video") {
                                    var oDiv3 = fr.createVideoItemHtml(cur, thumb, dx1, dy1, si);
                                    if (oDiv3)
                                        oA.appendChild(oDiv3);
                                }

                                var oDiv3 = document.createElement('div');
                                oDiv3.setAttribute('id', 'id4_' + idx);
                                oDiv3.setAttribute('class', 'clOverlay');
                                oDiv2.appendChild(oDiv3);
                                var oA = document.createElement('a');
                                oA.setAttribute('href', cur.url);
                                oA.textContent = cur.name;
                                oDiv3.appendChild(oA);

                                var oDiv3 = document.createElement('div');
                                oDiv3.setAttribute('id', 'id5_' + cur.id);
                                oDiv3.setAttribute('class', 'clEditOverlay');
                                oDiv2.appendChild(oDiv3);

                            }
                            oDiv3 = fr.CreateEditModeButtons(idx, cur, dy1);
                            if (oDiv3)
                                oDiv2.appendChild(oDiv3);
                        }

                    }

                }
                {

                    fr.myBindClick("#idback_" + idx, {}, function (ev) { return false; });

                    if (fFolder) {
                        fr.myBindClick("#id_" + idx, { param: cur.id }, function (ev) { fr.doSetFolder(ev.data.param); return false; });
                    }
                    else if (!this.fEditMode) {
                        fr.myBindClick("#id_" + idx, { param: cur }, function (ev) {

                            fr.PlayVideo(ev.data.param); return false;
                        });
                    }

                    if (cur.thumb && cur.thumb != "*" && !fFolder && !fShowTitle && !this.fEditMode && cur.type != "downloads")
                        fr.myBindIn("#id_" + idx, { param1: 'id4_' + idx, param2: idx, param3: cur.thumb },
                            function (ev) { fr.doShowNameHome(ev.data.param1, ev.data.param2, ev.data.param3); });
                    else
                        fr.myBindIn("#id_" + idx, { param: 'id4_' + idx }, function (ev) { fr.doShowName(ev.data.param); });

                    fr.myBindOut("#id_" + idx, { param: 'id4_' + idx }, function (ev) { fr.doHideName(ev.data.param); });

                    if (this.fEditMode) {
                        fr.myBind("#id_" + idx, 'mousedown', { param: "#id_" + idx, param2: cur.id }, function (ev) { fr.HandleDrag(1, ev.data.param, ev.data.param2); });
                        fr.myBind("#id_" + idx, 'mouseup', {}, function (ev) { fr.HandleDrag(0); });
                        fr.jq.unbind("#id5_" + idx, 'click');
                    }

                    fr.myBindClick("#iddel_" + idx, { param: cur.id }, function (ev) { fr.DelToplink(ev.data.param); return false; });


                }
                
            }


            var oDiv1 = document.createElement('div');
            oDiv1.setAttribute('id', 'idOverlay');
            oParent.appendChild(oDiv1);

        }

        //-------------------------------- Toplink-Positionen berechnen --------------------------------
        posX = (dx + 10 - (dx1 + 10) * nCols) / 2;
        posY = (dy - dy1 * 3 - 20) / 2;
        row = 0;
        var col = 0;


        var oParent = document.getElementById("toplinks");
        var xParent = parseInt(oParent.offsetLeft);
        var yParent = parseInt(oParent.offsetTop);

        fr.lpDragTargets = 0;
        var fdragitem = false;
        for (var idx = 0; idx < count; idx++) {
            var idxOfs = idx + ofs;

            sId = "idback_" + idx;
            o2 = document.getElementById(sId);
            if (!o2)
                continue;
            o2.style.width = dx1 + "px";
            o2.style.height = dy1 + "px";
            o2.style.left = posX + "px";
            o2.style.top = posY + "px";

            if (fr.drag) {

                var cur = idxOfs >= 0 ? bottom[idxOfs] : 0;
                if (!fr.lpDragTargets)
                    fr.lpDragTargets = new Array();
                if (cur) {
                    if (fr.dragToplinkId == cur.id)
                        fdragitem = true;

                    var target = new Object(); // Insert before
                    target.posX = xParent + posX;
                    target.width = dx1;
                    target.posY = yParent + posY - dy1 / 3;
                    target.height = dy1 * 2 / 3;
                    target.toplinkId = cur.id;
                    target.divId = "#id_" + idx;
                    fr.lpDragTargets.push(target);
                }

                //if ( !cur || cur.type=="f")
                {
                    var target = new Object(); // Insert into
                    target.posX = xParent + posX;
                    target.width = dx1;
                    target.posY = yParent + posY + dy1 / 3;
                    target.height = dy1 / 3;

                    if (!cur || cur.type == "f") {
                        target.toplinkId = cur ? cur.id : -1;
                        target.divId = "#id_" + idx;
                        target.mode = 1;
                    }
                    else if (fdragitem && idxOfs + 1 < bottom.length) // Lücke war schon, d.h. Mitte gehört dem nächsten
                    {
                        target.toplinkId = bottom[idxOfs + 1].id;
                        target.divId = "#id_" + (idx + 1);
                    }
                    else // Lücke kommt noch, d.h. Mitte gehört diesem
                    {
                        target.toplinkId = cur.id;
                        target.divId = "#id_" + idx;
                    }
                    fr.lpDragTargets.push(target);
                }

                if (row == 2 && idxOfs + 1 < bottom.length) {
                    var target = new Object(); // Insert after
                    target.posX = xParent + posX;
                    target.width = dx1;
                    target.posY = yParent + posY - dy1 / 3 + dy1 + 10;
                    target.height = dy1 * 2 / 3;
                    target.toplinkId = bottom[idxOfs + 1].id;
                    target.divId = "#id_" + (idx + 1);
                    fr.lpDragTargets.push(target);
                }
                else if (idxOfs + 1 == bottom.length) {
                    var target = new Object(); // Insert after
                    target.posX = xParent + posX;
                    target.width = dx1;
                    target.posY = yParent + posY - dy1 / 3 + dy1 + 10;
                    target.height = dy1 * 2 / 3;
                    target.toplinkId = "end";
                    target.divId = "#id_" + (idx);
                    target.mode = 2; // At the end
                    fr.lpDragTargets.push(target);
                }
            }

            if (!this.lpOverlayPos[idx])
                this.lpOverlayPos[idx] = new Object();

            if (col * 2 + 1 == nCols && nCols < 5) // exact in the middle
            {

                if (row != 1)
                    this.lpOverlayPos[idx].posX = posX;
                else
                    this.lpOverlayPos[idx].posX = posX + dx1 + 10;

                if (row == 0)
                    this.lpOverlayPos[idx].posY = posY + dy1 + 10;
                else if (row == 2)
                    this.lpOverlayPos[idx].posY = posY - 2 * dy1 - 2 * 10;
                else
                    this.lpOverlayPos[idx].posY = posY;
            }
            else {
                if (col >= nCols / 2)
                    this.lpOverlayPos[idx].posX = posX - 2 * dx1 - 2 * 10;
                else
                    this.lpOverlayPos[idx].posX = posX + dx1 + 10;

                if (idx % 3 == 2)
                    this.lpOverlayPos[idx].posY = posY - dy1 - 10;
                else
                    this.lpOverlayPos[idx].posY = posY;
            }
            this.lpOverlayPos[idx].dx = 2 * dx1 + 16;
            this.lpOverlayPos[idx].dy = 2 * dy1 + 14;

            sId = "id3_" + idx;
            o2 = document.getElementById(sId);
            if (o2) {
                o2.style.width = (dx1 - 10) + "px";
                o2.style.height = 24 + "px";
                o2.style.left = (5) + "px";
                o2.style.top = (dy1 - 30) + "px";
            }

            row++;
            posY += dy1 + 10;
            if (row > 2) {
                col++;
                posY = (dy - dy1 * 3 - 20) / 2;
                posX += dx1 + 10;
                row = 0;
            }
        }



        var oParent = document.getElementById("divDots");
        fr.removeAllChilds(oParent);

        for (var idx = 0; idx < this.nPages; idx++) {
            var oA = document.createElement('a');
            oA.setAttribute('id', 'iddot_' + idx);
            oA.setAttribute('class', 'clDots');

            var oImg = document.createElement('img');
            if (idx == this.nCurPage)
                oImg.setAttribute('src', "./png/dotSel.png");
            else
                oImg.setAttribute('src', "./png/dot.png");
            oA.appendChild(oImg);
            oParent.appendChild(oA);
        }

        if (this.nCurFolderLevel > 0)
            fr.jq.setClick("#idDotUp", function () { fr.doSetFolder(-1); return false; });
        for (var idx = 0; idx < this.nPages; idx++) {
            fr.myBindClick("#iddot_" + idx, { param: idx }, function (ev) { fr.doSetPage(ev.data.param); return false; });
        }

        o3 = document.getElementById("divLeft");
        o3.style.top = (80 + (dy - 38) / 2) + "px";
        if (this.nPages > 1)
            o3.style.display = 'block';
        else
            o3.style.display = 'none';
        o3 = document.getElementById("divRight");
        o3.style.top = (80 + (dy - 38) / 2) + "px";
        if (this.nPages > 1)
            o3.style.display = 'block';
        else
            o3.style.display = 'none';

    },


    drag: 0,
    dragId: 0,
    dragToplinkId: 0,
    dragX: 0, dragY: 0,
    dragBefore: 0,
    dragAllowPage: true,
    mousehandleradded: false,
    HandleDrag: function (mode, divId, toplinkId) {
        if (fr.idCurrentEdit)
            return;

        if (fr.lpCurFolder && fr.lpCurFolder.type != "f" && fr.lpCurFolder.type != "v")
            return;

        if (mode == 1) {
            if (!fr.mousehandleradded) {
                fr.mousehandleradded = true;
                // addEventListener only if user want to drag&drop toplinks
                document.addEventListener("mousemove", this.myMouseMove, false);
            }

            this.dragToplinkId = toplinkId;
            this.dragId = divId;
            this.drag = 1;
            this.dragBefore = 0;
            this.dragX = parseInt(fr.jq.getStyle("#idDrag", "left"));
            this.dragY = parseInt(fr.jq.getStyle("#idDrag", "top"));
            fr.dragLastTarget = -1;
        }
        else if (mode == 0) {
            if (!this.drag)
                return;
            this.drag = 0;
            fr.jq.hideD("#idDrag");
            fr.jq.get("#idDrag").innerText = ""
            fr.jq.setStyle(this.dragId, "visibility", "visible");
            if (this.dragBefore) {
                if (fr.dragBefore.toplinkId != fr.dragToplinkId)
                    fr.MoveToplinkBefore(this.dragToplinkId, this.dragBefore, true);
            }
            fr.doResize();
        }
        else if (this.drag) {
            
            var posX = parseInt(fr.jq.getStyle("#idDrag", "left"));
            var posY = parseInt(fr.jq.getStyle("#idDrag", "top"));
            if (this.drag == 1) // Noch nicht gestartet
            {
                if (Math.abs(posX - this.dragX) > 5 || Math.abs(posY - this.dragY) > 5) {
                    fr.jq.showD("#idDrag");
                    fr.doResize();
                    this.drag = 2; // Starte jetzt das D&D
                    fr.jq.setStyle(this.dragId, "visibility", "hidden");
                    fr.moveAllChilds(fr.jq.get(this.dragId),fr.jq.get("#idDrag"));
                }
            }
            else if (fr.lpDragTargets) {
                posX += 224 / 2;
                posY += 126 / 2;

                var oParent = document.getElementById("toplinks");
                var xParent = parseInt(oParent.offsetLeft);
                var dxParent = parseInt(oParent.offsetWidth);

                if (posX < xParent && this.nCurPage > 0) {
                    if (fr.dragAllowPage) {
                        fr.dragAllowPage = false;
                        this.nCurPage--;
                        fr.doResize();
                    }
                    return;
                }
                else if (posX > dxParent + xParent && this.nCurPage + 1 < this.nPages) {
                    if (fr.dragAllowPage) {
                        fr.dragAllowPage = false;
                        this.nCurPage++;
                        fr.doResize();
                    }
                    return;
                }

                fr.dragAllowPage = true;
                this.dragBefore = 0;
                fr.jq.setStyle(".clToplink", "border", "1px solid #fff");
                for (var idxDragtarget = 0; idxDragtarget < fr.lpDragTargets.length; idxDragtarget++) {
                    var target = fr.lpDragTargets[idxDragtarget];
                    if (posX >= target.posX && posY >= target.posY && posX < target.posX + target.width && posY < target.posY + target.height) {
                        this.dragBefore = target;
                        if (1) {
                            if (fr.dragBefore.toplinkId != fr.dragLastTarget) {
                                fr.dragLastTarget = fr.dragBefore.toplinkId;
                                fr.MoveToplinkBefore(fr.dragToplinkId, fr.dragBefore, false);
                                fr.doResize();
                            }
                        }
                        if (target.mode)
                            fr.jq.setStyle(target.divId, "border", "1px solid #f00");
                        else
                            fr.jq.setStyle(target.divId, "border", "1px solid #00f");
                        break;
                    }
                }

            }
        }
    },

    CreateEditModeButtons: function (itemId, tl, dy1) {

        if (fr.drag)
            return false;

        if (fr.lpCurFolder && fr.lpCurFolder.type == "a") // Cannot delete an App
            return false;

        var oDiv = fr.co('div', 0, { "class": "clBlackButton", "id": 'idBlack_' + itemId });
        var oCenter = fr.co('center', oDiv, {});

        var width = 49 * dy1 / 126 / 2;
        var fFolder = (tl.type == "f" || tl.type == "m" || tl.type == "a" || tl.type == "e" || tl.type == "v");
        //if ( tl.type != "ebayitem")
        if (!fr.lpCurFolder || fr.lpCurFolder.type == "f") {
            if (tl.type != "downloads") {
                fr.co('img', oCenter, { "width": width, "id": 'idedit_' + itemId, "src": "./png/editurl.png", "title": fFolder ? aTxt['ideditf'] : aTxt['idedit'] });
            }
        }
        fr.co('img', oCenter, { "width": width, "id": 'iddel_' + itemId, "src": "./png/del.png", "title": fFolder ? aTxt['iddelf'] : aTxt['iddel'] });
        return oDiv;
    },

    co: function (type, parent, params, text) {
        var curobj = document.createElement(type);
        if (text)
            curobj.textContent = text;
        for (var item in params) {
            curobj.setAttribute(item, params[item]);
        }
        if (parent)
            parent.appendChild(curobj);
        return curobj;
    },

    createVideoItemHtml: function (cur, thumb, dx1, dy1, si) {

        var oDiv = false;
        for (var idx = 0; idx < VideoSites.length; idx++) {
            if (cur.url.toLowerCase().indexOf(VideoSites[idx].filter) >= 0) {

                if (!si) {
                    si = new Object();
                    si.width = VideoSites[idx].width;
                    si.height = VideoSites[idx].height;
                }

                oDiv = document.createElement('div');
                oDiv.setAttribute('class', "clThumb");
                oDiv.setAttribute('style', "overflow:hidden;padding:0px;height:100%;width:100%;");

                if (si) {
                    var width = dx1;
                    var height = width * si.height / si.width;
                    if (height < dy1) {
                        height = dy1;
                        width = height * si.width / si.height;
                    }
                    var mx = (dx1 - width) / 2;
                    var my = (dy1 - height) / 2;

                    //sInner+= '<div class="clThumb" style="overflow:hidden;padding:0px;height:100%;width:100%;" >'; 

                    var oImg = document.createElement('img');
                    oImg.setAttribute('draggable', "false");
                    oImg.setAttribute('style', "width:" + width + "px;height:" + height + "px; margin-left:" + mx + "px;margin-top:" + my + "px;");
                    oImg.setAttribute('src', thumb);
                    oDiv.appendChild(oImg);
                    //sInner+= '<img draggable=false style="width:'+width+'px;height:'+height+'px; margin-left:'+mx+'px;margin-top:'+my+'px;" src="'+thumb+'"></img>';
                    //sInner+= '</div>'; 
                }
                else {
                    var oImg = document.createElement('img');
                    oImg.setAttribute('draggable', "false");
                    oImg.setAttribute('width', "100%");
                    oImg.setAttribute('height', "100%");
                    oImg.setAttribute('src', thumb);
                    oDiv.appendChild(oImg);
                    //    sInner+= '<img draggable=false class="clThumb" width=100% height=100%  src="'+thumb+'"></img>'; 
                }

                var oDiv2 = document.createElement('div');
                oDiv2.setAttribute('style', "position:absolute; right:0;top:0;");
                var oImg = document.createElement('img');
                oImg.setAttribute('draggable', "false");
                oImg.setAttribute('class', "clVideoStrip");
                oImg.setAttribute('src', "./png/movie.png");
                oDiv2.appendChild(oImg);
                oDiv.appendChild(oDiv2);

                var oDiv2 = document.createElement('div');
                oDiv2.setAttribute('style', "position:absolute; right:-1px;bottom:0;height:24px;");
                var oImg = document.createElement('img');
                oImg.setAttribute('draggable', "false");
                oImg.setAttribute('class', "clVideoLogo");
                oImg.setAttribute('src', VideoSites[idx].thumb);
                oDiv2.appendChild(oImg);
                oDiv.appendChild(oDiv2);
                //sInner+= '<div style="position:absolute; right:0;top:0;"><img draggable=false class="clVideoStrip"  src="./png/movie.png"></img></div>';  
                //sInner+= '<div style="position:absolute; right:-1px;bottom:0;height:24px;"><img draggable=false class="clVideoLogo"  src="'+VideoSites[idx].thumb+'"></img></div>';  
                break;
            }
        }
        return oDiv;
    },

    hideHelp: function (id, bit) {
        fr.settings.help |= bit;
        fr.jq.hideD("#" + id);
        fr.SaveSettings();
    },

    ResetTheme: function () {
        if (!confirm(aTxt["resethelp2"]))
            return;

        fr.curLang = navigator.userLanguage || navigator.language;
        if (fr.curLang.indexOf("de") >= 0)
            fr.curLang = "de"
        else
            fr.curLang = "en"
        L64P._db._locStorage.setItem("curlang", fr.curLang);
        chrome.runtime.sendMessage({ msg: "SP24SetLang", lang: fr.curLang }, function (response) {
            if (typeof (response) == 'undefined' && chrome.runtime.lastError)
                return;
        });
        fr.SetDefaultSettings();
        SetLanguage();

        fr.ShowToplinks(fr.settings.fShowToplinks);
        fr.doResize();
        fr.doShowHelp();
        fr.ShowMsgDlg(0);
        fr.ShowMsgDlg(1);
    },

    SetDefaultSettings: function () {
        fr.settings = new Object();
        fr.settings.fShowToplinks = true;
        fr.settings.folder = fVideo ? 255 : (255 - 8);
        fr.settings.special = 255;

        fr.settings.trans = "0.9";
        fr.settings.fUseThemeDefaults = true;
        //fr.settings.border=false;
        fr.settings.color_text = '#cccccc';
        fr.settings.color_border = '#333333';
        fr.settings.color_background = '#ffffff';

        fr.settings.help = 15;
        fr.settings.help |= 64
        fr.SaveSettings();

    },

    FindToplinkType: function (parent, type) {
        var bottom = parent ? parent.Toplinks : fr.lpToplinkBottomFolder;
        for (var idx = 0; idx < bottom.length; idx++) {
            var curobj = bottom[idx];
            if (curobj.type == type)
                return curobj;
            if (curobj.Toplinks) {
                var result = this.FindToplinkType(curobj, type);
                if (result)
                    return result;
            }
        }
        return 0;
    },

    FindToplinkByUrl: function (parent, url) {
        var bottom = parent ? parent.Toplinks : fr.lpToplinkBottomFolder;
        for (var idx = 0; idx < bottom.length; idx++) {
            var curobj = bottom[idx];
            if (curobj.url == url)
                return curobj;
            if (curobj.Toplinks) {
                var result = this.FindToplinkByUrl(curobj, url);
                if (result)
                    return result;
            }
        }
        return 0;
    },

    doShowHelp: function () {
        fr.jq.hideD(".clHelp");

        if (fr.lpCurFolder && fr.lpCurFolder.type == "v") {
            if (!(fr.settings.help & 256) && !fr.videoPlaying)
                fr.jq.showD("#idHelpVideo");
        }
        else {
            if (fr.fEditMode) {
                if (!fr.lpCurFolder || fr.lpCurFolder.type == "f")
                    if (!(fr.settings.help & 32))
                        fr.jq.showD("#idHelpDrag");
            }
            else {
                //if ( !(fr.settings.help&1))
                //    fr.jq.showD("#idHelpEdit");            
                if (!(fr.settings.help & 4))
                    fr.jq.showD("#idHelpSearch");
                if (!(fr.settings.help & 8))
                    fr.jq.showD("#idHelpSettings");

                if (!fr.settings.fShowToplinks) {
                    if (!(fr.settings.help & 128))
                        fr.jq.showD("#idHelpToggle");
                }
            }
        }
    },

    myGetLocalStorage: function (callback) {
        chrome.storage.local.get('newToplinks', function (data) {
            callback(data);
        });
    },

    myDelLocalStorage: function () {
        if (typeof (chrome) != 'undefined')
            chrome.storage.local.set({ newToplinks: 0 }, function () { });
        else
            fr._locStorage.setItem("newToplinks", 0);
    },


    page: 0,
    doInit: function () {
        //var idx = window.location.href;
        if (window.location.href.indexOf("page=video") >= 0)
            fr.page = "video";

        fr.doShowHelp();
        // prevent Drag&Drop
        document.addEventListener("dragstart", function (ev) {
            //$(document).bind("dragstart", function(ev) {
            //alert(ev.target.nodeName);
            //ev.stopPropagation();
            ev.preventDefault();
            if (ev.target.nodeName.toUpperCase() == "IMG")
                return false;
            else if (ev.target.nodeName.toUpperCase() == "A")
                return false;
            else
                alert(ev.target.nodeName.toUpperCase());

        });

        //fr.jq.setClick("#idHelpEdit", function() { fr.hideHelp( "idHelpEdit",1);return false;});    

        fr.jq.setClick("#idHelpSearch", function () { fr.hideHelp("idHelpSearch", 4); return false; });
        fr.jq.setClick("#idHelpSettings", function () { fr.hideHelp("idHelpSettings", 8); return false; });
        fr.jq.setClick("#idHelpVideo", function () { fr.hideHelp("idHelpVideo", 256); return false; });
        fr.jq.setClick("#idHelpDrag", function () { fr.hideHelp("idHelpDrag", 32); return false; });
        fr.jq.setClick("#idHelpToggle", function () { fr.hideHelp("idHelpToggle", 128); return false; });

        fr.jq.setClick("#idyoutube", function () {
            window.location.replace("https://youtube.com");
            return false;
        });
        fr.jq.setClick("#idvimeo", function () {
            window.location.replace("https://vimeo.com");
            return false;
        });

        var b1 = fr.GetBorderColor();
        var b2 = fr.GetGradientColor(b1);

        fr.jq.setStyle("#idBottombarGradient", "background", "linear-gradient(to bottom, " + b2 + " 0%," + b1 + " 100%");
        fr.jq.setStyle("#topbar", "background", "linear-gradient(to bottom, " + b2 + " 0%," + b1 + " 100%");

        //fr.jq.setStyle("#body","background",fr.GetBorderColor());
        fr.jq.setStyle(".clTextColor", "color", fr.GetTextColor());

        var curobj = new Object();
        curobj.searchurl = "";
        curobj.type = "v"
        curobj.name = aTxt["videolist"];
        curobj.Toplinks = new Array();
        curobj.id = fr.nextfreeid++;
        fr.lpToplinkBottomFolder = new Array();
        fr.lpToplinkBottomFolder.splice(0, 0, curobj);
        fr.doSetFolder(curobj.id);

        fr.doResize();

        //fr.RefreshBorder();

        window.addEventListener("resize", this.doResize, false);
        //window.onresize = this.doResize; 
        fr.InitSearchProvider();

        fr.jq.setEvent("#idInputFilter", "keyup", function () { fr.SetFilter(fr.jq.getVal("#idInputFilter")); }, {});
        //$("#idInputFilter").keyup(function() { fr.SetFilter(this.value)});
        //######## $("#idForm").submit(function(){fr.doSearch(-1)});     

        //fr.jq.setClick("#idDelAll", function() {fr.DelAllToplinks();});
        fr.jq.setClick("#idSettings", function () { fr.ShowMsgDlg(1); return false; });
        fr.jq.setClick("#idEditMode", function () { fr.doEditMode(1); return false; });
        fr.jq.setClick("#idEditModeDone", function () { fr.doEditMode(0); return false; });
        fr.jq.setClick("#idEditModeCancel", function () { fr.doEditMode(-1); return false; });

        //fr.jq.setClick("#idSearchButton2", function () { fr.doSearch(-1); return false; });
        fr.jq.setClick("#divLeft", function () { fr.doChangePage(-1); return false; });
        fr.jq.setClick("#divRight", function () { fr.doChangePage(1); return false; });

        fr.jq.setStyle("#idSlideshow", "visibility", "hidden");
        fr.jq.setStyle("#body", "visibility", "visible");
        //setTimeout(function () { fr.jq.setStyle("#body", "idSlideshow", "visible"); }, 100);
        //setTimeout(function () {
        //var curobj = fr.jq.get('#idInput');
        //curobj.value = "";
        //document.getElementById("idInput").focus();
        //$('#idInput').focus().val("").scrollTop();
        //}, 150);

        fr.myBind("#idDrag", 'mouseup', {}, function (ev) { fr.HandleDrag(0); return false; });

        fr.ShowToplinks(fr.settings.fShowToplinks);

    },

    iCounter: 0,

    myMouseMove: function (ev) {
        if (!ev)
            ev = window.event;

        var xx = ev.pageX;
        var yy = ev.pageY;

        if (!xx && !yy) {
            xx = ev.posX;
            yy = ev.posY;
        }
        var posX = xx;
        var posY = yy;
        posX -= 224 / 2;
        posY -= 126 / 2;
        var scrY = document.documentElement.scrollTop;
        fr.jq.setStyle("#idDrag", "left", posX + "px");
        fr.jq.setStyle("#idDrag", "top", posY + "px");
        //console.log("myMouseMove" + posX + "   " + posY);
        if (fr.drag)
            fr.HandleDrag(2);
    },

    nPauseTimer: 0,
    degree: 0,

    SaveSettings: function () {
        L64P.settings.set({ id: 'settings', data: fr.settings });
    },




    ShowToplinks: function (mode) {
        if (mode == 2)
            fr.settings.fShowToplinks = !fr.settings.fShowToplinks;
        else
            fr.settings.fShowToplinks = mode;
        fr.SaveSettings();
        fr.doShowHelp();
        fr.checkAddButtons();
        if (fr.settings.fShowToplinks) {
            fr.jq.showDI("#idFilterText");
            fr.jq.showDI("#idFilter");
            fr.jq.showDI("#idToplinks");
            fr.jq.showDI("#idEditMode");
            this.doResize();
        }
        else {
            fr.jq.hideD("#idFilterText");
            fr.jq.hideD("#idFilter");
            fr.jq.hideD("#idToplinks");
            fr.jq.hideD("#idEditMode");
        }
    },


    InitSearchProvider: function () {
        var shadowcolor;
        var bkcolor = "";
        var textcolor;
        var bordercolor = fr.GetBorderColor();
        /*if ( fr.curframe)
        {   
            textcolor = fr.curframe.textcolor;
            bkcolor = fr.curframe.bkcolor;
        }
        else
        { */
        textcolor = fr.GetTextColor();
        //}
        var colorId = textcolor.charAt(1);
        if ( /*!fr.curframe && */(bordercolor == "#000" || bordercolor == "#000000")) {
            shadowcolor = "#000";
            fr.jq.setAttr("#idLogo", "src", "./png/logo_video.png");
        }
        else if (colorId < '8') {
            shadowcolor = "#fff";
            fr.jq.setAttr("#idLogo", "src", "./png/logo_video_black.png");
        }
        else {
            shadowcolor = "#000";
            fr.jq.setAttr("#idLogo", "src", "./png/logo_video.png");
        }

        fr.jq.setStyle("#idImgEditMode", "background", textcolor);
        fr.jq.setStyle("#idImgSettings", "background", textcolor);
        var color = 'color:' + textcolor + ';text-shadow: none;';

        var oFont = document.createElement('font');
        oFont.setAttribute('face', "arial");


    },

    mySetFocus: function (id) {
        var fIE8 = false;
        var curobj = document.getElementById(id);
        if (curobj && curobj.focus) {
            curobj.selectionStart = 0;
            curobj.selectionEnd = 1000;
            curobj.focus();
        }
    },

    lastState: 0,
    fVideosChanged: false,
    orderBeforeMove: false,
    doEditMode: function (on) {
        if (!fr.settings.fShowToplinks)
            return;

        if (on > 0) {
            if (!fr.mousehandleradded) {
                fr.mousehandleradded = true;
                // addEventListener only if user want to drag&drop toplinks
                document.addEventListener("mousemove", this.myMouseMove, false);
            }

            fr.jq.hideD("#idFilterText");
            fr.jq.hideD("#idFilter");
            fr.jq.hideD("#idEditMode");
            fr.jq.showD(".clEditMode");
            fr.jq.hideD("#idSettings");
            fr.jq.setStyle("#idTextLinks", "right", "320px");
            fr.jq.setStyle("#idTextLinks", "left", "260px");

            if (fr.curFilter)
                fr.SetFilter("");

            lastState = new Object();
            lastState.folder = this.lpCurFolder ? this.lpCurFolder.id : 0;
            lastState.page = fr.nCurPage;
            fr.fVideosChanged = false;

            var tl = fr.FindToplinkType(0, "v");
            if (tl) {
                fr.orderBeforeMove = [];
                for (var idx = 0; idx < tl.Toplinks.length; idx++) {
                    fr.orderBeforeMove.push(tl.Toplinks[idx]);
                }
            }
        }
        else {

            fr.jq.showDI("#idFilterText");
            fr.jq.showDI("#idFilter");
            fr.jq.showDI("#idToplinks");

            fr.jq.showDI("#idEditMode");
            fr.jq.hideD(".clEditMode");
            fr.jq.showD("#idSettings");
            fr.jq.setStyle("#idTextLinks", "right", "130px");
            fr.jq.setStyle("#idTextLinks", "left", "380px");

            if (on == -1) //Cancel edit mode
            {
                var tl = fr.FindToplinkType(0, "v");
                if (tl) {
                    tl.Toplinks = [];
                    for (var idx = 0; idx < fr.orderBeforeMove.length; idx++) {
                        tl.Toplinks.push(fr.orderBeforeMove[idx]);
                    }
                }
                on = 0;
            }
            else {
                if (fVideo && fr.fVideosChanged) {
                    var tl = fr.FindToplinkType(0, "v");
                    if (tl) {
                        var videoItemIds = new Array();
                        for (var idx = 0; idx < tl.Toplinks.length; idx++) {
                            videoItemIds.push(tl.Toplinks[idx].url);
                        }
                        L64P.video.saveItems({ id: videoItemIds });  //.videoid
                    }
                }

            }
        }

        this.fEditMode = on;
        fr.doShowHelp();
        this.doResize();
    },

    DelAllToplinks: function () {
        fr.lpToplinkBottomFolder = new Array();
        this.lpCurFolder = 0;
        this.curFilter = "";
        this.nCurFolderLevel = 0;
        fr.SetFilter("");
    },

    CreateVideoBar: function () {
        if (fr.jq.get("#idVideobar").firstChild)
            return;
        var aSites = new Array();
        for (var i1 = 0; i1 < VideoSites.length; i1++) {
            aSites.push(VideoSites[i1]);
        }

        aSites.sort(function (valueA, valueB) { return Math.round(Math.random() * 20 - 10); });
        while (aSites.length < 30) {
            aSites = aSites.concat(aSites);
        }
        var oBestOf = document.getElementById("idVideobar");
        var oA = fr.co('a', oBestOf, { "style": "font-size:12px;position:relative;top:-6px;" });
        oA.textContent = aTxt["supported"];
        for (i1 = 0; i1 < aSites.length; i1++) {
            var oA = fr.co('a', oBestOf, { "href": aSites[i1].url });
            fr.co('img', oA, { "style": "margin-left:5px;margin-top:3px;", "src": aSites[i1].thumb, "height": "24px" });
        }
    },

    MoveBegin: function (id) {
        this.ModifyToplinkRecur(0, id, "begin");
        this.doResize();
    },
    MoveEnd: function (id) {
        this.ModifyToplinkRecur(0, id, "end");
        this.doResize();
    },

    idCurrentEdit: 0,
    delOnCancel: "",


    GetToplinkThumb: function (tl) {
        if (tl.thumb)
            return tl.thumb;

        return "./png/nothumb.png";
    },


    FindToplink: function (parent, id) {
        var bottom = parent ? parent.Toplinks : fr.lpToplinkBottomFolder;
        for (var idx = 0; idx < bottom.length; idx++) {
            var curobj = bottom[idx];
            if (curobj.id == id)
                return curobj;
            if (curobj.Toplinks) {
                var result = this.FindToplink(curobj, id);
                if (result)
                    return result;
            }
        }
        return 0;
    },

    GetToplinkIndex: function (bottom, toplinkId) {
        for (var idx = 0; idx < bottom.length; idx++) {
            if (bottom[idx].id == toplinkId)
                return idx;
        }
        return -1;
    },

    MoveToplinkBefore: function (toplinkId, target, fAllowIntoFolder) {
        if (target.mode == 1 && !fAllowIntoFolder) // Not into Folder during D&D
            return;
        var bottom = fr.lpCurFolder ? fr.lpCurFolder.Toplinks : fr.lpToplinkBottomFolder;
        var idx = fr.GetToplinkIndex(bottom, toplinkId);
        if (idx < 0)
            return;
        var curobj = bottom[idx];

        if (fr.lpCurFolder) {
            if (target.toplinkId < 0 && target.mode == 1 && this.nCurFolderLevel > 0) // Backbutton
            {
                if (fr.lpCurFolder.type == "v") // Videos must not be move in any other folder
                    return;
                bottom.splice(idx, 1); // Del 1 Element at idx
                fr.lpCurFolder.Toplinks = bottom;
                var parent = fr.FindToplink(0, this.lpFolderStack[this.nCurFolderLevel - 1].id);
                if (parent)
                    parent.Toplinks.push(curobj);
                else
                    fr.lpToplinkBottomFolder.push(curobj);
                return;
            }
        }

        if (target.mode == 2)  // At the end
        {
            bottom.splice(idx, 1); // Del 1 Element at idx
            bottom.push(curobj); // insert 1 element at before
        }
        else {
            var before = fr.GetToplinkIndex(bottom, target.toplinkId);
            if (before < 0)
                return;
            if (target.mode == 1) {
                var oFolder = bottom[before];
                if (oFolder && oFolder.type != "f")
                    return;
                bottom.splice(idx, 1); // Del 1 Element at idx
                if (!oFolder.Toplinks)
                    oFolder.Toplinks = new Array();
                oFolder.Toplinks.push(curobj);
            }
            else {
                if (idx > before) {
                    bottom.splice(idx, 1); // Del 1 Element at idx
                    bottom.splice(before, 0, curobj); // insert 1 element at before

                }
                else if (idx < before) {
                    bottom.splice(before, 0, curobj); // insert 1 element at before
                    bottom.splice(idx, 1); // Del 1 Element at idx

                }
            }
        }
        if (fr.lpCurFolder)
            fr.lpCurFolder.Toplinks = bottom;
        else
            fr.lpToplinkBottomFolder = bottom;
    },

    DelDefaultToplinks: function (parent) {
        var bottom = parent ? parent.Toplinks : fr.lpToplinkBottomFolder;
        for (var idx = 0; idx < bottom.length; idx++) {
            var curobj = bottom[idx];
            if (curobj.def == true) {
                bottom.splice(idx, 1);
                if (!parent)
                    fr.lpToplinkBottomFolder = bottom;
                else
                    parent.Toplinks = bottom;
                idx--;
                continue;
            }
            if (curobj.Toplinks)
                this.DelDefaultToplinks(curobj);
        }
    },

    ModifyToplinkRecur: function (parent, id, mode) {
        var bottom = parent ? parent.Toplinks : fr.lpToplinkBottomFolder;
        for (var idx = 0; idx < bottom.length; idx++) {
            var curobj = bottom[idx];
            if (curobj.id == id) {
                var a2 = bottom.slice(idx + 1);
                var a1 = bottom.slice(0, idx);
                bottom = a1.concat(a2);

                if (mode == "begin") {
                    a1 = new Array();
                    a1.push(curobj);
                    bottom = a1.concat(bottom);
                }
                else if (mode == "end") {
                    bottom.push(curobj);
                }
                else if (mode == "del") {
                    if (curobj.type == "v")
                        fr.settings.folder &= (255 - 8);
                    else if (curobj.type == "downloads")
                        fr.settings.special &= (255 - 1);

                    if (parent && parent.type == "v" && !fr.fEditMode) // Video folder
                    {
                        var videoItemIds = new Array();
                        for (var idx = 0; idx < bottom.length; idx++) {
                            videoItemIds.push(bottom[idx].url);
                        }
                        L64P.video.saveItems({ id: videoItemIds });
                    }
                }
                if (!parent)
                    fr.lpToplinkBottomFolder = bottom;

                else
                    parent.Toplinks = bottom;
                //this.lpCurFolder = bottom;
                return true;
            }
            if (curobj.Toplinks)
                if (this.ModifyToplinkRecur(curobj, id, mode))
                    return true;
        }
        return false;
    },

    DelToplink: function (id) {
        this.ModifyToplinkRecur(0, id, "del");
        this.doResize();
    },

    nextfreeid: 1,

    SetIds: function (parent) // Make sure every toplink has an own id
    {
        for (var idx = 0; idx < parent.length; idx++) {
            if (!parent[idx].id)
                parent[idx].id = this.nextfreeid++;
            if (parent[idx].Toplinks)
                this.SetIds(parent[idx].Toplinks);
        }
    },

    colorclicked: function (id) {
        var idx = id.indexOf('_');
        var def = id.slice(idx + 1);
        id = id.slice(0, idx);
        fr.CreateColorSectors(id, '#' + def);
    },

    dlgbackgroundcolor: -1,
    dlgbordercolor: -1,
    dlgtextcolor: -1,
    CreateColorSectors: function (id, def) {
        if (id == "idbackgroundcolors") {
            fr.dlgbackgroundcolor = def;
            aColors = ["000", "777", "aaa", "fff", "f00", "f80", "ff0", "8f0", "0f0", "0f8", "0ff", "08f", "00f", "008", "80f", "f0f", "f08"];
        }
        else if (id == "idbordercolors") {
            fr.dlgbordercolor = def;
            aColors = ["000", "777", "aaa", "fff", "f00", "f80", "ff0", "8f0", "0f0", "0f8", "0ff", "08f", "00f", "008", "80f", "f0f", "f08"];
        }
        else {
            fr.dlgtextcolor = def;
            aColors = ["000", "777", "c0c0c0", "fff", "f00", "f80", "ff0", "8f0", "0f0", "0f8", "0ff", "08f", "00f", "008", "80f", "f0f", "f08"];
        }
        if (def == "#000000")
            def = "#000";

        var oParent = document.getElementById(id);
        fr.removeAllChilds(oParent);
        for (var idx = 0; idx < aColors.length; idx++) {
            var id2 = id + "_" + aColors[idx];
            var oDiv = fr.co('div', oParent, { "id": id2, "class": 'clColorSelect', "style": 'background:#' + aColors[idx] });
            if (def == ('#' + aColors[idx]))
                fr.co('img', oDiv, { "style": 'position:relative;left:3px;top:3px;', "src": './png/radio1.png' });
        }

        for (var idx = 0; idx < aColors.length; idx++) {
            var id2 = id + "_" + aColors[idx];
            fr.myBindClick("#" + id2, { param: id2 }, function (ev) { fr.colorclicked(ev.data.param); return false; });
        }
    },

    radioclicked: function () {
        if (fr.jq.get("#idchecknodefaults").checked)
            fr.jq.showD("#idNoDefaults");
        else
            fr.jq.hideD("#idNoDefaults");
    },

    settings: 0,
    ShowMsgDlg: function (mode) {
        if (mode == 1) {
            fr.jq.hideD("#idToplinkSettings");
            fr.jq.hideD("#idsync");

            fr.jq.setClick("#b1", function () { fr.ShowMsgDlg(0); return false; });
            fr.jq.setClick("#b2", function () { fr.ShowMsgDlg(2); return false; });
            fr.jq.setClick("#b3", function () { fr.ShowMsgDlg(3); return false; });

            fr.jq.setVal("#b1", aTxt['cancel']);
            fr.jq.setVal("#b2", aTxt['ok']);
            fr.jq.setVal("#b3", aTxt['apply']);

            fr.jq.hideD(".chromeOnly");

            if (!fVideo) {
                fr.settings.folder &= (255 - 8);
                fr.jq.hideD("#idVideoSettings");
            }

            fr.jq.setVal("#idselectLanguage", aTxt['langKey_country']);
            fr.jq.setVal("#idresethelp", aTxt['resethelp']);
            fr.jq.setVal("#idresettheme", aTxt['resettheme']);
            fr.jq.setClick("#idresettheme", function () { fr.ResetTheme(); return false; });
            fr.jq.setClick("#idresethelp", function () { fr.settings.help = 64; fr.doShowHelp(); return false; });
            fr.jq.setClick("#idselectLanguage", function () {
                //chrome.runtime.sendMessage({ msg: "OnSP24Navigate", url: "chrome://settings/languages"}, function (response){    });     			
                chrome.tabs.create({ "url": "chrome://settings/languages", "selected": true }, function (tab) { });
            });
            //fr.jq.get("#idcheckvideo").checked = !!(fr.settings.folder & 8);
            fr.jq.get("#idchecknodefaults").checked = !fr.settings.fUseThemeDefaults;

            fr.radioclicked();

            fr.jq.setClick("#idchecknodefaults", function () { fr.radioclicked(); });

            fr.CreateColorSectors("idbackgroundcolors", fr.settings.color_background);
            fr.CreateColorSectors("idbordercolors", fr.settings.color_border);
            fr.CreateColorSectors("idtextcolors", fr.settings.color_text);

            fr.jq.setVal("#idSelectTrans", fr.settings.trans);

            fr.jq.hideD("#langKey_trans");
            fr.jq.hideD("#idSelectTrans");

            var oSelect = document.getElementById("idSelectCountry");
            fr.removeAllChilds(oSelect);
            fr.co('option', oSelect, { "value": "de" }, aTxt["langKey_de"]);
            fr.co('option', oSelect, { "value": "en" }, aTxt["langKey_en"]);

            fr.jq.setVal("#idSelectCountry", fr.curLang);

            {
                fr.jq.hideD("#langKey_icon");
                fr.jq.hideD("#idSelectIcon");
            }

            fr.jq.showD("#idMsgDlg");
        }
        else if (mode == 0) // cancel
            fr.jq.hideD("#idMsgDlg");
        else if (mode == 2 || mode == 3) // 2 == ok   3 == apply
        {
            if (mode == 2)
                fr.jq.hideD("#idMsgDlg");
            var curobj = 0;

            //if (fr.jq.get("#idcheckvideo").checked)
            //    curobj+=8;

            fr.settings.fUseThemeDefaults = !fr.jq.get("#idchecknodefaults").checked;
            fr.settings.color_background = fr.dlgbackgroundcolor;
            fr.settings.color_border = fr.dlgbordercolor;
            fr.settings.color_text = fr.dlgtextcolor;
            //fr.settings.border = fr.jq.getVal("#idSelectBorder");
            fr.settings.trans = fr.jq.getVal("#idSelectTrans");

            var oldLang = fr.curLang;
            fr.curLang = fr.jq.getVal("#idSelectCountry");


            //if ( !fr.fShowSettingsOnly)
            //fr.RefreshBorder();

            var b1 = fr.GetBorderColor();
            var b2 = fr.GetGradientColor(b1);

            fr.jq.setStyle("#idBottombarGradient", "background", "linear-gradient(to bottom, " + b2 + " 0%," + b1 + " 100%");

            if (!fr.jq.get("#idFrame").firstChild) {
                fr.jq.setStyle("#topbar", "background", "linear-gradient(to bottom, " + b2 + " 0%," + b1 + " 100%");

            }

            fr.jq.setStyle(".clTextColor", "color", fr.GetTextColor());
            fr.settings.folder = curobj;


            fr.SaveSettings();
            if (fr.curLang != oldLang) {

                SetLanguage();
                L64P._db._locStorage.setItem("curlang", fr.curLang);
                chrome.runtime.sendMessage({ msg: "SP24SetLang", lang: fr.curLang }, function (response) {
                    if (typeof (response) == 'undefined' && chrome.runtime.lastError)
                        return;
                });
            }
            fr.InitSearchProvider();
            fr.doResize();
        }
    },

    ReplaceRedirectLanguage: function (url, fAllUrls) {
        if (!url)
            return "";
        var cururl = url;
        cururl = cururl.replace("[lang]", fr.curLang);
        cururl = cururl.replace("[country]", "");
        cururl = cururl.replace("[serial]", fr.settings.sn);
        cururl = cururl.replace("[postfix]", "com");
        return cururl;
    },

    CopyArray: function (aOld, fSave) {
        var aNew = new Array();
        for (var idx = 0; idx < aOld.length; idx++) {
            if (fSave) {
                if (aOld[idx].type == "video") // save not all
                    continue;
            }
            var curobj = fr.CopyObject(aOld[idx], fSave);
            aNew.push(curobj);
        }
        return aNew;
    },

    CopyObject: function (oOld, fSave) {
        var curobj = new Object();
        for (var name in oOld) {
            if (name == "Toplinks") {
                curobj.Toplinks = fr.CopyArray(oOld.Toplinks, fSave);
            }
            else {
                curobj[name] = oOld[name];
            }
        }
        return curobj;
    },

    GetBackgroundColor: function () {
        if (fr.settings.fUseThemeDefaults)
            return "#ffffff";
        return fr.settings.color_background;
    },

    GetTextColor: function () {
        if (fr.settings.fUseThemeDefaults)
            return "#cccccc";
        return fr.settings.color_text;
    },
    GetBorderColor: function () {
        if (fr.settings.fUseThemeDefaults)
            return "#333333";
        return fr.settings.color_border;
    },

    GetGradientColor: function (b1) {
        if (!b1)
            b1 = "#000";

        if (b1 == "#000" || b1 == "#000000")
            return "#333";

        var b2 = "";
        for (var idx = 0; idx < b1.length; idx++) {
            var curColor = b1.charAt(idx);
            switch (curColor) {
                case '0': curColor = '0'; break;
                case '1': curColor = '0'; break;
                case '2': curColor = '1'; break;
                case '3': curColor = '1'; break;
                case '4': curColor = '2'; break;
                case '5': curColor = '2'; break;
                case '6': curColor = '3'; break;
                case '7': curColor = '4'; break;
                case '8': curColor = '4'; break;
                case '9': curColor = '5'; break;
                case 'a': curColor = '6'; break;
                case 'b': curColor = '7'; break;
                case 'c': curColor = '8'; break;
                case 'd': curColor = '9'; break;
                case 'e': curColor = 'a'; break;
                case 'f': curColor = 'b'; break;
            }
            b2 += curColor;
        }
        return b2;
    },
    GetCurBorder: function () {
        if (fr.settings.fUseThemeDefaults)
            return false;
        return fr.settings.border;
    },

    curLang: "en",
    needRefresh: false,
    fShowSettingsOnly: false

} // end of fr

function SetLanguage() {
    fr.jq.getAllItems(".langKey", function (element) {
        var id = element.id;
        var idx = id.indexOf('-');
        if (idx >= 0) {
            element.textContent = aTxt[id.slice(0, idx)]; // This is no dynamic html code, but fixed text from text.js which is allready encoded 
        }
        else
            element.textContent = aTxt[id];// This is no dynamic html code, but fixed text from text.js which is allready encoded
        if (id == "langKey_helpvideo")
            fr.co("img", element, { 'src': './png/icon.png' });
    });

    fr.jq.setText("#idSearchButton2", aTxt['search']);
    fr.jq.setText("#idFilterText", aTxt['filter']);
    fr.jq.setVal("#idButtonDone", aTxt['done']);
    fr.jq.setVal("#idButtonCancel", aTxt['cancel']);

}

function GetImageSize(url) {
    var curobj = 0;
    fr.jq.getAllItems(".clThumbBase", function (element) {
        if (element.getAttribute("src") == url) {
            curobj = new Object();
            curobj.width = this.naturalWidth;
            curobj.height = this.naturalHeight;
            if (!curobj.width) {
                curobj = 0;
            }
            else if (curobj.width == 224 && curobj.height == 126)
                curobj = 0;
            else
                curobj = curobj;
        }
    });
    return curobj;
}

L64P.events.onNewVideo = function (details) {
    //alert("onNewVideo");
    if (!fVideo)
        return;
    if (fr.lpCurFolder && fr.lpCurFolder.type == "v") {
        var videoItems = L64P.video.getWatchedItems({}, function (data) {
            fr.ConvertVideoData(data.items);
            fr.doResizeHome();
        });


        if (videoItems) {
            fr.ConvertVideoData(videoItems);
            fr.doResizeHome();
        }
    }
}

window.onload = function () {
    fr.jq = new L64Jq();
    fr.jq.init({ doc: document });
    fr.curLang = L64P._db._locStorage.getItem("curlang");
    if (!fr.curLang) {
        var lang = navigator.userLanguage || navigator.language;
        if (lang.indexOf("de") >= 0)
            fr.curLang = "de";
        else
            fr.curLang = "en";
    }
    fr.title = "Video Downloader professional";
    document.title = fr.title;
    defaults = defaults2;

    fr._locStorage = chrome.storage.local;

    //Frames = defaults.Frames;

    fr.settings = new Object();
    L64P.settings.get({ id: 'settings' }, function (data) {
        if (data) {
            fr.settings = data;
        }
        else {
            fr.SetDefaultSettings();
        }
        SetLanguage();
        if (!fVideo)
            fr.settings.folder &= (255 - 8);

        if (!fr.settings.trans) {
            fr.settings.trans = "0.9";
        }

        if (window.location.href.indexOf("options=1") >= 0)
            fr.fShowSettingsOnly = true;
        if (fr.fShowSettingsOnly) {
            fr.doInit();

            //fr.jq.setStyle("#body","visibility","visible");
            fr.ShowMsgDlg(1);
        }
        else {
            fr.doInit();
        }
    });
}




