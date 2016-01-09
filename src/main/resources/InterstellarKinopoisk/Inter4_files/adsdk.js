(function(window) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.videoAd) {
        window.ya.videoAd = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    var NS = window.ya.mediaAd;
    if (NS.DOMAIN === undefined) {
        NS.DOMAIN = "yastatic.net";
    }
    if (NS.SDK_VERSION === undefined) {
        NS.SDK_VERSION = "1.0-161";
    }
    if (NS.SDK_FULL_VERSION === undefined) {
        NS.SDK_FULL_VERSION = "js:" + NS.SDK_VERSION;
    }
    if (NS.SDK_URL_VERSION === undefined) {
        NS.SDK_URL_VERSION = window.ya.mediaAd.SDK_VERSION.split("-")[0].split(".").join("_") + "/v-" + window.ya.mediaAd.SDK_VERSION;
    }
})(window);

(function(doc) {
    "use strict";
    var pollute = true, api, vendor, apis = {
        w3: {
            enabled: "fullscreenEnabled",
            element: "fullscreenElement",
            request: "requestFullscreen",
            exit: "exitFullscreen",
            events: {
                change: "fullscreenchange",
                error: "fullscreenerror"
            }
        },
        webkit: {
            enabled: "webkitIsFullScreen",
            element: "webkitCurrentFullScreenElement",
            request: "webkitRequestFullScreen",
            exit: "webkitCancelFullScreen",
            events: {
                change: "webkitfullscreenchange",
                error: "webkitfullscreenerror"
            }
        },
        moz: {
            enabled: "mozFullScreen",
            element: "mozFullScreenElement",
            request: "mozRequestFullScreen",
            exit: "mozCancelFullScreen",
            events: {
                change: "mozfullscreenchange",
                error: "mozfullscreenerror"
            }
        },
        ms: {
            enabled: "msFullscreenEnabled",
            element: "msFullscreenElement",
            request: "msRequestFullscreen",
            exit: "msExitFullscreen",
            events: {
                change: "MSFullscreenChange",
                error: "MSFullscreenError"
            }
        }
    }, w3 = apis.w3;
    for (vendor in apis) {
        if (apis[vendor].enabled in doc) {
            api = apis[vendor];
            break;
        }
    }
    function dispatch(type, target) {
        var event = doc.createEvent("Event");
        event.initEvent(type, true, false);
        target.dispatchEvent(event);
    }
    function handleChange(e) {
        doc[w3.enabled] = doc[api.enabled];
        doc[w3.element] = doc[api.element];
        dispatch(w3.events.change, e.target);
    }
    function handleError(e) {
        dispatch(w3.events.error, e.target);
    }
    if (pollute && !(w3.enabled in doc) && api) {
        doc.addEventListener(api.events.change, handleChange, false);
        doc.addEventListener(api.events.error, handleError, false);
        doc[w3.enabled] = doc[api.enabled];
        doc[w3.element] = doc[api.element];
        doc[w3.exit] = doc[api.exit];
        Element.prototype[w3.request] = function() {
            return this[api.request].apply(this, arguments);
        };
    }
    return api;
})(document);

(function(document) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    function LibLoader() {
        this.loadedLibs = [];
        this.libToCallbacksMap = {};
        var that = this;
        this.load = function(url, callback) {
            if (that.loadedLibs.indexOf(url) > -1) {
                callback();
                return;
            }
            if (that.libToCallbacksMap[url]) {
                that.libToCallbacksMap[url].push(callback);
                return;
            }
            that.libToCallbacksMap[url] = [ callback ];
            var script = document.createElement("script");
            script.src = url;
            script.onload = function() {
                that.libToCallbacksMap[url].forEach(function(callback) {
                    callback();
                });
                that.libToCallbacksMap[url] = null;
                that.loadedLibs.push(url);
            };
            document.head.appendChild(script);
        };
    }
    if (!window.ya.mediaAd.LibLoader) {
        window.ya.mediaAd.LibLoader = new LibLoader();
    }
})(document);

(function(window) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    var console = window.console;
    function Log() {
        var messages = [], that = this;
        this.log = null;
        this.error = null;
        this.warn = null;
        function saveMessage(message) {
            messages.push(message);
        }
        function init() {
            if (console) {
                that.log = function(message) {
                    console.log(message);
                };
                that.error = function(message) {
                    console.error(message);
                };
                that.warn = function(message) {
                    console.warn(message);
                };
            } else {
                that.log = saveMessage;
                that.error = saveMessage;
                that.warn = saveMessage;
            }
        }
        init();
    }
    window.ya.mediaAd.log = new Log();
})(window);

(function(window, document) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    if (!window.ya.mediaAd.util) {
        window.ya.mediaAd.util = {};
    }
    var UtilNs = window.ya.mediaAd.util, YANDEX_DOMAINS = [ "yandex.ru", "yandex.com", "yandex.net", "yandex.com.tr", "yandex.ua", "yandex.by", "yandex.kz", "yastatic.net", "yandex.st", "yandex-team.ru", "yandex-team.com", "yandex-team.com.ua", "yandex-team.net.ua", "yandex-team.com.tr", "ya.ru" ], YANDEX_FRIENDS_DOMAINS = [ "kinopoisk.ru", "kinopoisk.ua", "kinopoisk.by", "kinopoisk.tel", "vidigital.ru", "tns-counter.ru", "adfox.ru" ];
    UtilNs.log = function() {
        if (!ya.mediaAd.DEV_MODE || !console || !console.log) {
            return;
        }
        console.log.apply(console, arguments);
    };
    UtilNs.fireCallback = function(callback) {
        if (!callback) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        if (typeof callback === "function") {
            callback.apply(null, args);
        } else if (callback && callback.hasOwnProperty("length")) {
            var callbacks = callback;
            callbacks.forEach(function(callback) {
                callback.apply(null, args);
            });
        }
    };
    UtilNs.addCallback = function(object, eventName, callback) {
        eventName = "on" + eventName.substr(0, 1).toUpperCase() + eventName.substr(1);
        if (!object[eventName]) {
            object[eventName] = callback;
            return;
        }
        if (typeof object[eventName] === "function") {
            object[eventName] = [ object[eventName], callback ];
            return;
        }
        object[eventName].push(callback);
    };
    UtilNs.endsWith = function(input, suffix) {
        return suffix === input.substring(input.length - suffix.length);
    };
    UtilNs.getDomainFromUrl = function(url) {
        if (!url) {
            return "";
        }
        var aNode = document.createElement("a");
        aNode.setAttribute("href", url);
        return aNode.hostname;
    };
    UtilNs.isTrueYandexDomain = function(url) {
        return UtilNs.isYandexDomain(url, true);
    };
    UtilNs.isYandexDomain = function(url, ignoreFriends) {
        if (!url) {
            return false;
        }
        var domain = UtilNs.getDomainFromUrl(url), yaDomain, len, i, domains = ignoreFriends ? YANDEX_DOMAINS : YANDEX_DOMAINS.concat(YANDEX_FRIENDS_DOMAINS);
        if (!domain || domain.length === 0) {
            return false;
        }
        for (i = 0, len = domains.length; i < len; i++) {
            yaDomain = domains[i];
            if (UtilNs.endsWith(domain, yaDomain)) {
                return true;
            }
        }
        return false;
    };
    UtilNs.createVideoNode = function(containerElement, sourceOrSources, poster, autoplay) {
        var videoNode = document.createElement("video");
        videoNode.id = "yaVideoPlayer_" + Math.floor(Math.random() * 1e6);
        videoNode.setAttribute("x-webkit-airplay", "allow");
        if (Array.isArray(sourceOrSources)) {
            sourceOrSources.forEach(function(source) {
                var sourceNode = document.createElement("source");
                sourceNode.src = source.src;
                sourceNode.type = source.type;
                videoNode.appendChild(sourceNode);
            });
        } else if (sourceOrSources) {
            videoNode.src = sourceOrSources;
        }
        if (poster) {
            videoNode.poster = poster;
        }
        videoNode.autoplay = autoplay;
        videoNode.preload = autoplay ? "auto" : "none";
        containerElement.appendChild(videoNode);
        return videoNode;
    };
    UtilNs.adjustElementHeight = function(element, wRatio, hRatio) {
        if (!wRatio) {
            wRatio = 4;
            hRatio = 3;
        }
        var width = element.width > 0 ? element.width : element.clientWidth;
        var height = Math.floor(width * hRatio / wRatio);
        if (element.nodeName.toLowerCase() == "video") {
            element.height = height;
        } else {
            element.style.width = width + "px";
            element.style.height = height + "px";
        }
    };
    UtilNs.createWrapperNode = function(containerElement) {
        var wrapperNode = UtilNs.createDiv("yaAdSdkGui");
        wrapperNode.id = "videoPlayerWrapper_" + Math.floor(Math.random() * 1e6);
        containerElement.appendChild(wrapperNode);
        return wrapperNode;
    };
    UtilNs.isTouchDevice = function() {
        return "ontouchstart" in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
    };
    UtilNs.isIPhone = function() {
        return navigator.userAgent.toLowerCase().indexOf("iphone") > -1;
    };
    UtilNs.parseVASTTime = function(timeString) {
        if (timeString.search(/^\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/) == -1) {
            return NaN;
        }
        var skipTimeParts = timeString.trim().split(":");
        if (skipTimeParts.length < 2 || skipTimeParts.length > 3) {
            return NaN;
        }
        var msParts = skipTimeParts[skipTimeParts.length - 1].split(".");
        var value = 0;
        if (msParts.length == 2) {
            value = msParts[1] / 1e3;
        }
        if (skipTimeParts.length == 2) {
            value += skipTimeParts[0] * 60 + +skipTimeParts[1];
        } else {
            value += skipTimeParts[0] * 3600 + skipTimeParts[1] * 60 + +skipTimeParts[2];
        }
        return value;
    };
    UtilNs.createDiv = function(className, innerHtml) {
        var div = document.createElement("div");
        div.className = className;
        if (innerHtml) {
            div.innerHTML = innerHtml;
        }
        return div;
    };
    UtilNs.createControl = function(elementClass, clickHandler, text, parent) {
        var element = UtilNs.createDiv(elementClass, text);
        element.addEventListener("click", clickHandler);
        if (parent) {
            parent.appendChild(element);
        }
        return element;
    };
    UtilNs.getElement = function(elementOrElementId) {
        return typeof elementOrElementId == "string" ? window.document.getElementById(elementOrElementId) : elementOrElementId;
    };
    UtilNs.getReferrer = function() {
        var href;
        try {
            href = top.location.href;
        } catch (ex) {
            href = location.href;
        }
        return href;
    };
})(window, document);

(function() {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    if (!window.ya.mediaAd.util) {
        window.ya.mediaAd.util = {};
    }
    if (!window.ya.mediaAd.util.XmlUtil) {
        window.ya.mediaAd.util.XmlUtil = {};
    }
    var XmlUtil = window.ya.mediaAd.util.XmlUtil;
    XmlUtil.readAttr = function(element, attrName, defaultValue) {
        if (element.hasAttribute(attrName)) {
            return element.getAttribute(attrName).trim();
        }
        return defaultValue;
    };
    XmlUtil.readElementText = function(element) {
        return element && element.textContent ? element.textContent.trim() : "";
    };
    XmlUtil.isElementSet = function(element) {
        return element && XmlUtil.readElementText(element).length;
    };
})();

(function(window) {
    "use strict";
    if (!window.ya.mediaAd.Net) {
        window.ya.mediaAd.Net = {};
    }
    var DEFAULT_ERROR_URL = "//awaps.yandex.ru/65/218/0.gif", mediaAd = window.ya.mediaAd, Net = mediaAd.Net, isTrueYandexDomain = mediaAd.util.isTrueYandexDomain, fireCallback = mediaAd.util.fireCallback;
    Net.appendVersion = function appendVersion(url) {
        if (!isTrueYandexDomain(url)) {
            return url;
        }
        if (url.indexOf("?") > -1) {
            url += "&";
        } else {
            url += "?";
        }
        return url + "video-api-version=" + encodeURIComponent(mediaAd.SDK_FULL_VERSION);
    };
    Net.load = function(url, data, loadHandler, errorHandler, timeout, timeoutHandler) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url);
        xmlHttp.timeout = typeof timeout === "number" ? timeout : 0;
        xmlHttp.withCredentials = true;
        if (typeof timeoutHandler === "function") {
            xmlHttp.ontimeout = timeoutHandler;
        }
        function fireError(error) {
            if (errorHandler) {
                fireCallback(errorHandler, error);
                errorHandler = null;
            }
        }
        xmlHttp.onerror = function onError(event) {
            var error = new Error("XHROnError " + xmlHttp.statusText + ": " + url);
            error.id = xmlHttp.status;
            fireError(error);
        };
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState !== 4) {
                return;
            }
            if (xmlHttp.status === 0) {
                return;
            }
            if (xmlHttp.status !== 200) {
                var error = new Error(xmlHttp.statusText);
                error.id = xmlHttp.status;
                error.message += ": " + url;
                fireError(error);
                return;
            }
            fireCallback(loadHandler, xmlHttp.responseXML, xmlHttp.status);
        };
        try {
            xmlHttp.send(data);
        } catch (e) {
            e.message += ": " + url;
            fireError(e);
        }
    };
    Net.knock = function(urls) {
        if (!Array.isArray(urls)) {
            return;
        }
        urls.forEach(function(url) {
            new Image().src = Net.appendVersion(url);
        });
    };
    Net.trackError = function(error, urls) {
        var errorData = [], preparedUrls = [], i, len, url;
        var errorId = error.hasOwnProperty("id") ? encodeURIComponent(error.id.toString()) : "0";
        errorData.push("errcode=" + errorId);
        errorData.push("subsection=" + errorId);
        if (typeof error.message === "string" && error.message.length > 0) {
            errorData.push("errstring=" + encodeURIComponent(error.message));
        }
        urls = urls ? urls.slice() : [];
        urls.push(DEFAULT_ERROR_URL);
        for (i = 0, len = urls.length; i < len; i++) {
            url = urls[i];
            preparedUrls.push(url + (url.indexOf("?") > -1 ? "&" : "?") + errorData.join("&"));
        }
        Net.knock(preparedUrls);
    };
})(window);

(function(window) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    window.ya.mediaAd.AdType = {
        PREROLL: "preroll",
        MIDROLL: "midroll",
        PAUSEROLL: "pauseroll",
        OVERLAY: "overlay",
        POSTROLL: "postroll"
    };
    window.ya.mediaAd.AdConfigParams = {
        VAST_URL: "vastUrl",
        VAST: "vast",
        AD_FOX_URL: "adFoxUrl",
        PREFER_ADFOX: "preferAdFox",
        PARTNER_ID: "partnerId",
        CATEGORY: "category",
        TAGS_LIST: "tagsList",
        CHARSET: "charset",
        EMPTY_ID: "emptyId",
        VIDEO_CONTENT_ID: "videoContentId",
        VIDEO_CONTENT_NAME: "videoContentName",
        VIDEO_PUBLISHER_ID: "videoPublisherId",
        VIDEO_PUBLISHER_NAME: "videoPublisherName",
        VIDEO_GENRE_ID: "videoGenreId",
        VIDEO_GENRE_NAME: "videoGenreName",
        EXT_PARAM: "extParam",
        PLAYER_INFO: "playerInfo",
        DURATION: "duration",
        WIDTH: "width",
        HEIGHT: "height",
        NUMRUNS: "numruns",
        IMPRESSION_OFFSET: "impressionOffset"
    };
    var mediaAd = window.ya.mediaAd, XmlUtil = mediaAd.util.XmlUtil, Net = mediaAd.Net, AdType = mediaAd.AdType, AdConfigParams = mediaAd.AdConfigParams, endsWith = mediaAd.util.endsWith, DEFAULT_SKIN_URL = "//" + mediaAd.DOMAIN + "/awaps-ad-sdk-js/" + mediaAd.SDK_URL_VERSION + "/skin.css", BLOCK_INFO_LOAD_TIMEOUT = 3e3;
    function BlockInfoError(message, id) {
        this.message = message;
        this.id = id;
    }
    BlockInfoError.prototype = new Error();
    BlockInfoError.PARSE_ERROR = 1001;
    BlockInfoError.TIMEOUT_ERROR = 1002;
    function Block() {
        this.id = 0;
        this.adType = "";
        this.startTime = 0;
        this.duration = 0;
        this.positionsCount = 0;
    }
    Block.fromXml = function(xml) {
        var startTimeNode = xml.querySelector("StartTime"), durationNode = xml.querySelector("Duration"), positionsCountNode = xml.querySelector("PositionsCount"), block = new Block();
        block.id = XmlUtil.readAttr(xml, "BlockID", 0);
        block.adType = XmlUtil.readAttr(xml, "type", AdType.PREROLL);
        block.startTime = XmlUtil.readElementText(startTimeNode);
        block.duration = XmlUtil.readElementText(durationNode);
        block.positionsCount = XmlUtil.readElementText(positionsCountNode);
        return block;
    };
    function BlockInfo() {
        this.partnerId = "";
        this.sessionId = "";
        this.categoryID = 0;
        this.categoryName = "";
        this.skinUrl = DEFAULT_SKIN_URL;
        this.title = "";
        this.skipDelay = 5;
        this.skipTimeLeftShow = true;
        this.timeLeftShow = true;
        this.visitSiteShow = false;
        this.vastTimeout = 3e3;
        this.videoTimeout = 2e3;
        this.wrapperTimeout = 3e3;
        this.wrapperMaxCount = 3;
        this.vpaidTimeout = 3e3;
        this.bufferFullTimeout = 2500;
        this.bufferEmptyLimit = 5;
        this.vpaidEnabled = true;
        this.skinTimeout = 2e3;
        this.blocks = [];
        this.getBlockByAdType = function(adType) {
            var i;
            for (i = 0; i < this.blocks.length; i++) {
                if (this.blocks[i].adType === adType) {
                    return this.blocks[i];
                }
            }
            return null;
        };
    }
    BlockInfo.getUrl = function(config) {
        if (!config[AdConfigParams.PARTNER_ID]) {
            return null;
        }
        var url = Net.appendVersion("//an.yandex.ru/vcset/" + encodeURIComponent(config[AdConfigParams.PARTNER_ID]) + "?video-category-id=" + encodeURIComponent(config[AdConfigParams.CATEGORY]) + "&duration=" + encodeURIComponent(config[AdConfigParams.DURATION]) + "&client_type=html");
        return url;
    };
    BlockInfo.fromXml = function(xml) {
        var blockInfoNode = xml.querySelector("Blocksinfo"), blocksNodes = blockInfoNode.querySelectorAll("Blocks > Block"), blockInfo = new BlockInfo(), block, i;
        function readParam(nodeName) {
            return XmlUtil.readElementText(blockInfoNode.querySelector(nodeName));
        }
        blockInfo.partnerId = readParam("PartnerID");
        blockInfo.sessionId = readParam("SessionID");
        blockInfo.categoryID = readParam("CategoryID");
        blockInfo.categoryName = readParam("CategoryName");
        if (endsWith(readParam("Skin"), ".css")) {
            blockInfo.skinUrl = readParam("Skin");
        }
        blockInfo.bufferEmptyLimit = parseInt(readParam("BufferEmptyLimit"), 10);
        blockInfo.title = readParam("Title");
        blockInfo.skipDelay = parseInt(readParam("SkipDelay"), 10);
        blockInfo.skipTimeLeftShow = readParam("SkipTimeLeftShow") === "true";
        blockInfo.timeLeftShow = readParam("TimeLeftShow") === "true";
        blockInfo.visitSiteShow = readParam("VisitSiteShow") === "true";
        blockInfo.vastTimeout = parseInt(readParam("VASTTimeout"), 10);
        blockInfo.videoTimeout = parseInt(readParam("VideoTimeout"), 10);
        blockInfo.wrapperTimeout = parseInt(readParam("WrapperTimeout"), 10);
        blockInfo.wrapperMaxCount = parseInt(readParam("WrapperMaxCount"), 10);
        blockInfo.bufferFullTimeout = parseInt(readParam("BufferFullTimeout"), 10);
        blockInfo.skinTimeout = parseInt(readParam("SkinTimeout"), 10);
        for (i = 0; i < blocksNodes.length; i++) {
            block = Block.fromXml(blocksNodes[i]);
            blockInfo.blocks.push(block);
        }
        return blockInfo;
    };
    BlockInfo.load = function(config, successCallback, errorCallback) {
        var url = BlockInfo.getUrl(config);
        if (!url) {
            setTimeout(function() {
                errorCallback("Invalid ad parameters");
            }, 0);
            return;
        }
        Net.load(url, null, function(xml) {
            var blockInfo;
            try {
                blockInfo = BlockInfo.fromXml(xml);
            } catch (parseXmlError) {
                errorCallback(new BlockInfoError(parseXmlError.message, BlockInfoError.PARSE_ERROR));
            }
            successCallback(blockInfo);
        }, function(sourceError) {
            errorCallback(new BlockInfoError(sourceError.message, BlockInfoError.PARSE_ERROR));
        }, BLOCK_INFO_LOAD_TIMEOUT, function() {
            errorCallback(new BlockInfoError("Timeout of loading block info. PartnerId: " + config[AdConfigParams.PARTNER_ID] + "; categoryId: " + config[AdConfigParams.CATEGORY], BlockInfoError.TIMEOUT_ERROR));
        });
    };
    window.ya.mediaAd.BlockInfo = BlockInfo;
})(window);

(function(window) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    var XmlUtil = window.ya.mediaAd.util.XmlUtil, Util = window.ya.mediaAd.util, Net = window.ya.mediaAd.Net, AdConfigParams = window.ya.mediaAd.AdConfigParams, VastSourceType = {
        EXTERNAL: "external",
        AD_FOX: "adFox",
        YANDEX: "yandex"
    }, VAST_VERSION = "2.0", AD_FOX_MARKER = "Yandex ADX";
    function VastError(message, id) {
        this.message = message;
        this.id = id;
    }
    VastError.prototype = new Error();
    VastError.INVALID_VAST_XML = 40;
    VastError.NO_IN_LINE_OR_WRAPPER_NODE = 53;
    VastError.NO_VAST_ID_TAG_URI = 54;
    VastError.VAST_LOAD_TIMEOUT = 60;
    VastError.WRAPPER_LOAD_TIMEOUT = 61;
    VastError.WRAPPER_MAX_COUNT_LIMIT = 44;
    VastError.INCORRECT_SKIPOFFSET_FORMAT = 46;
    VastError.ADFOX_VAST_LOAD_ERROR = 47;
    VastError.YA_VAST_LOAD_ERROR = 48;
    VastError.YANDEX_WRAPPER_ENDED_WITH_NOT_YANDEX_VAST = 49;
    function MediaFile() {
        this.type = null;
    }
    MediaFile.fromXml = function(xml) {
        var mediaFile = new MediaFile();
        mediaFile.width = parseInt(XmlUtil.readAttr(xml, "width", 0), 10);
        mediaFile.height = parseInt(XmlUtil.readAttr(xml, "height", 0), 10);
        mediaFile.bitrate = parseInt(XmlUtil.readAttr(xml, "bitrate", 0), 10);
        mediaFile.delivery = XmlUtil.readAttr(xml, "delivery", null);
        mediaFile.type = XmlUtil.readAttr(xml, "type", null);
        mediaFile.isVpaid = XmlUtil.readAttr(xml, "apiFramework", null) == "VPAID";
        mediaFile.source = XmlUtil.readElementText(xml);
        return mediaFile;
    };
    window.ya.mediaAd.MediaFile = MediaFile;
    function VastIcon() {
        this.src = null;
        this.program = null;
        this.xPosition = NaN;
        this.yPosition = NaN;
        this.width = NaN;
        this.height = NaN;
    }
    VastIcon.fromXml = function(xml) {
        var staticResourceNode = xml.querySelector("StaticResource"), vastIcon = new VastIcon();
        vastIcon.src = XmlUtil.readElementText(staticResourceNode);
        vastIcon.program = XmlUtil.readAttr(xml, "program", null);
        vastIcon.xPosition = parseInt(XmlUtil.readAttr(xml, "xPosition", 0), 10);
        vastIcon.yPosition = parseInt(XmlUtil.readAttr(xml, "yPosition", 0), 10);
        vastIcon.width = parseInt(XmlUtil.readAttr(xml, "width", 0), 10);
        vastIcon.height = parseInt(XmlUtil.readAttr(xml, "height", 0), 10);
        return vastIcon;
    };
    function VastAd() {
        this.mediaFiles = [];
        this.icons = [];
        this.trackings = {};
        this.clickThrough = "";
        this.isYandexAdxWrapper = false;
        this.returnUrl = null;
        this.skipTime = NaN;
        this.skipOffset = NaN;
        this.progressOffset = NaN;
        this.duration = NaN;
        this.isClickable = true;
        this.description = null;
        this.numRepeats = 1;
    }
    VastAd.prototype.addEventUrl = function(eventName, url) {
        if (!url || !eventName) {
            return;
        }
        if (!this.trackings[eventName]) {
            this.trackings[eventName] = [];
        }
        this.trackings[eventName].push(url);
    };
    VastAd.fromXml = function(xml, vastSourceType, isWrapper) {
        var videoClicks = xml.querySelector("VideoClicks"), clickTrackings, mediaFileNodeList = xml.querySelectorAll("MediaFile"), linearNode = xml.querySelector("Linear"), trackingNodeList = xml.querySelectorAll("Tracking"), impressionNodeList = xml.querySelectorAll("Impression"), errorNodeList = xml.querySelectorAll("Error"), extensionsNode = xml.querySelector("Extensions"), descriptionNode = xml.querySelector("Description"), iconNodeList = xml.querySelectorAll("Icons Icon"), skipAdNodeList, skipTimeNode, isClickableNode, ad = new VastAd(), i, len, nodeValue;
        if (!isWrapper) {
            for (i = 0, len = mediaFileNodeList.length; i < len; i++) {
                ad.mediaFiles.push(MediaFile.fromXml(mediaFileNodeList[i]));
            }
            if (videoClicks) {
                nodeValue = XmlUtil.readElementText(videoClicks.querySelector("ClickThrough"));
                if (nodeValue) {
                    ad.clickThrough = nodeValue;
                }
            }
        }
        if (videoClicks) {
            clickTrackings = videoClicks.querySelectorAll("ClickTracking");
            for (i = 0, len = clickTrackings.length; i < len; i++) {
                ad.addEventUrl("clickThrough", XmlUtil.readElementText(clickTrackings[i]));
            }
        }
        for (i = 0, len = trackingNodeList.length; i < len; i++) {
            var eventName = XmlUtil.readAttr(trackingNodeList[i], "event", null);
            ad.addEventUrl(eventName, XmlUtil.readElementText(trackingNodeList[i]));
            if (eventName == "progress") {
                ad.progressOffset = Util.parseVASTTime(XmlUtil.readAttr(trackingNodeList[i], "offset", ""));
            }
        }
        for (i = 0, len = impressionNodeList.length; i < len; i++) {
            ad.addEventUrl("impression", XmlUtil.readElementText(impressionNodeList[i]));
        }
        for (i = 0, len = errorNodeList.length; i < len; i++) {
            if (vastSourceType === VastSourceType.AD_FOX) {
                ad.addEventUrl("adFoxError", XmlUtil.readElementText(errorNodeList[i]));
            } else {
                ad.addEventUrl("error", XmlUtil.readElementText(errorNodeList[i]));
            }
        }
        for (i = 0, len = iconNodeList.length; i < len; i++) {
            ad.icons.push(VastIcon.fromXml(iconNodeList[i]));
        }
        if (extensionsNode) {
            skipAdNodeList = extensionsNode.querySelectorAll("Extension[type='skipAd']");
            for (i = 0, len = skipAdNodeList.length; i < len; i++) {
                ad.addEventUrl("skip", XmlUtil.readElementText(skipAdNodeList[i]));
            }
            skipTimeNode = extensionsNode.querySelector("Extension[type='skipTime']");
            if (XmlUtil.isElementSet(skipTimeNode)) {
                ad.skipTime = Util.parseVASTTime(XmlUtil.readElementText(skipTimeNode));
                if (ad.skipTime > 180) {
                    ad.skipTime = 0;
                }
            }
            isClickableNode = extensionsNode.querySelector("Extension[type='isClickable']");
            if (XmlUtil.isElementSet(isClickableNode)) {
                ad.isClickable = XmlUtil.readElementText(skipTimeNode).trim() !== "0";
            }
        }
        if (XmlUtil.isElementSet(descriptionNode)) {
            ad.description = XmlUtil.readElementText(descriptionNode);
        }
        if (linearNode) {
            nodeValue = XmlUtil.readAttr(linearNode, "skipoffset", "").trim();
            if (nodeValue !== "") {
                var skipOffset = Util.parseVASTTime(nodeValue);
                if (!isNaN(skipOffset)) {
                    ad.skipOffset = skipOffset;
                } else {
                    Net.trackError(new VastError(nodeValue, VastError.INCORRECT_SKIPOFFSET_FORMAT), ad.trackings.error);
                }
            }
            var durationNode = linearNode.querySelector("Duration");
            if (durationNode) {
                ad.duration = Util.parseVASTTime(XmlUtil.readElementText(durationNode));
            }
        }
        return ad;
    };
    VastAd.prototype.merge = function(adToMerge) {
        var i, len, eventName;
        if (adToMerge.mediaFiles.length) {
            for (i = 0, len = adToMerge.mediaFiles.length; i < len; i++) {
                this.mediaFiles.push(adToMerge.mediaFiles[i]);
            }
        }
        for (eventName in adToMerge.trackings) {
            if (adToMerge.trackings.hasOwnProperty(eventName)) {
                if (!this.trackings[eventName]) {
                    this.trackings[eventName] = adToMerge.trackings[eventName];
                } else {
                    this.trackings[eventName] = this.trackings[eventName].concat(adToMerge.trackings[eventName]);
                }
            }
        }
        if (typeof adToMerge.clickThrough === "string" && adToMerge.clickThrough.length) {
            this.clickThrough = adToMerge.clickThrough;
        }
        this.skipTime = adToMerge.skipTime;
        this.skipOffset = adToMerge.skipOffset;
        this.isClickable = adToMerge.isClickable;
        if (!isNaN(adToMerge.progressOffset)) {
            this.progressOffset = adToMerge.progressOffset;
        }
    };
    VastAd.prototype.hasMedia = function() {
        return Boolean(this.mediaFiles && this.mediaFiles.length);
    };
    window.ya.mediaAd.VastAd = VastAd;
    function VAST() {
        this.ads = [];
    }
    var REFERER_MACRO = "{REFERER}";
    function prepareUrl(url) {
        return url.replace(REFERER_MACRO, encodeURIComponent(Util.getReferrer()));
    }
    VAST.getUrl = function(config, blockInfo, blockId) {
        var url, params, targetRef = window.location, pageRef = window.document.referrer;
        function prepareListParam(param) {
            return encodeURIComponent(typeof param === "string" ? param : param.join("\n"));
        }
        params = "imp-id=" + encodeURIComponent(blockId) + "&target-ref=" + encodeURIComponent(targetRef) + "&page-ref=" + encodeURIComponent(pageRef);
        if (config[AdConfigParams.PLAYER_INFO]) {
            params += ":" + config[AdConfigParams.PLAYER_INFO];
        }
        if (config[AdConfigParams.WIDTH]) {
            params += "&video-width=" + encodeURIComponent(config[AdConfigParams.WIDTH]);
        }
        if (config[AdConfigParams.HEIGHT]) {
            params += "&video-height=" + encodeURIComponent(config[AdConfigParams.HEIGHT]);
        }
        if (config[AdConfigParams.VIDEO_CONTENT_ID]) {
            params += "&video-content-id=" + encodeURIComponent(config[AdConfigParams.VIDEO_CONTENT_ID]);
        }
        if (config[AdConfigParams.VIDEO_CONTENT_NAME]) {
            params += "&video-content-name=" + encodeURIComponent(config[AdConfigParams.VIDEO_CONTENT_NAME]);
        }
        if (config[AdConfigParams.VIDEO_PUBLISHER_ID]) {
            params += "&video-publisher-id=" + encodeURIComponent(config[AdConfigParams.VIDEO_PUBLISHER_ID]);
        }
        if (config[AdConfigParams.VIDEO_PUBLISHER_NAME]) {
            params += "&video-publisher-name=" + encodeURIComponent(config[AdConfigParams.VIDEO_PUBLISHER_NAME]);
        }
        if (config[AdConfigParams.VIDEO_GENRE_ID]) {
            params += "&video-genre-id=" + prepareListParam(config[AdConfigParams.VIDEO_GENRE_ID]);
        }
        if (config[AdConfigParams.VIDEO_GENRE_NAME]) {
            params += "&video-genre-name=" + prepareListParam(config[AdConfigParams.VIDEO_GENRE_NAME]);
        }
        if (config[AdConfigParams.TAGS_LIST]) {
            params += "&tags-list=" + prepareListParam(config[AdConfigParams.TAGS_LIST]);
        }
        if (config[AdConfigParams.EXT_PARAM]) {
            params += "&ext-param=" + encodeURIComponent(config[AdConfigParams.EXT_PARAM]);
        }
        params += "&charset=" + encodeURIComponent(config[AdConfigParams.CHARSET] || "UTF-8");
        if (blockInfo.sessionId) {
            params += "&video-session-id=" + encodeURIComponent(blockInfo.sessionId);
        }
        params += "&rnd=" + Math.random();
        url = "//an.yandex.ru/meta/" + encodeURIComponent(blockInfo.partnerId) + "?" + params;
        return Net.appendVersion(url);
    };
    VAST.load = function(urlOrVast, isAdFox, vastTimeout, wrapperTimeout, wrapperMaxCount, successCallback, errorCallback) {
        var wrapperTimeoutId = NaN, isWrapperTimeout = false, wrapperLevel = 0;
        function processWrapperNode(wrapperNode, vastSourceType, timeout, wrapperTimeout, successCallback, errorCallback) {
            var vastUriNode = wrapperNode.querySelector("VASTAdTagURI"), returnUrlNode, vastUri, ad;
            try {
                ad = VastAd.fromXml(wrapperNode, vastSourceType, true);
            } catch (error) {
                errorCallback(error);
                return;
            }
            if (!XmlUtil.isElementSet(vastUriNode)) {
                errorCallback(new VastError("There is no VASTAdTagURI in the 'Wrapper' node", VastError.NO_VAST_ID_TAG_URI));
                return;
            }
            vastUri = XmlUtil.readElementText(vastUriNode);
            if (vastUri === AD_FOX_MARKER) {
                ad.isYandexAdxWrapper = true;
                returnUrlNode = wrapperNode.querySelector("Extension[type='ReturnURL']");
                if (XmlUtil.isElementSet(returnUrlNode)) {
                    ad.returnUrl = XmlUtil.readElementText(returnUrlNode);
                }
                successCallback(ad);
                return;
            }
            loadVastInternal(vastUri, vastSourceType, timeout, wrapperTimeout, function(vast) {
                var i, len;
                for (i = 0, len = vast.ads.length; i < len; i++) {
                    ad.merge(vast.ads[i]);
                }
                successCallback(ad);
            }, errorCallback);
        }
        function removeWrapperTimeout() {
            if (!isNaN(wrapperTimeoutId)) {
                clearTimeout(wrapperTimeoutId);
                wrapperTimeoutId = NaN;
            }
        }
        function setupWrapperTimeout(wrapperTimeout, errorCallback) {
            if (isNaN(wrapperTimeoutId)) {
                wrapperTimeoutId = setTimeout(function() {
                    removeWrapperTimeout();
                    isWrapperTimeout = true;
                    errorCallback(new VastError("Wrapper load timeout.", VastError.WRAPPER_LOAD_TIMEOUT));
                }, wrapperTimeout);
            }
        }
        function processAdNode(adNode, fromUrl, vastSourceType, timeout, wrapperTimeout, successCallback, errorCallback) {
            var inLineNode = adNode.querySelector("InLine"), wrapperNode = adNode.querySelector("Wrapper"), ad;
            if (inLineNode) {
                removeWrapperTimeout();
                if (vastSourceType === VastSourceType.YANDEX && !Util.isYandexDomain(fromUrl)) {
                    errorCallback(new VastError("Yandex wrapper ended with VAST loaded from not Yandex domain.", VastError.YANDEX_WRAPPER_ENDED_WITH_NOT_YANDEX_VAST));
                    return;
                }
                try {
                    ad = VastAd.fromXml(inLineNode, vastSourceType);
                } catch (error) {
                    errorCallback(error);
                    return;
                }
                successCallback(ad);
            } else if (wrapperNode && !isWrapperTimeout) {
                if (++wrapperLevel > wrapperMaxCount) {
                    errorCallback(new VastError("Reach the limit of nesting wrappers", VastError.WRAPPER_MAX_COUNT_LIMIT));
                } else {
                    setupWrapperTimeout(wrapperTimeout, errorCallback);
                    processWrapperNode(wrapperNode, vastSourceType, timeout, wrapperTimeout, successCallback, function(error) {
                        removeWrapperTimeout();
                        errorCallback(error);
                    });
                }
            } else {
                errorCallback(new VastError("There is no InLine or Wrapper node in the VAST document", VastError.NO_IN_LINE_OR_WRAPPER_NODE));
            }
        }
        function processVastXml(xml, url, vastSourceType, timeout, wrapperTimeout, successCallback, errorCallback) {
            var vastNode = xml.querySelector("VAST"), vast = new VAST(), adNodeList = xml.querySelectorAll("VAST Ad"), len = adNodeList.length, i = 0;
            if (!vastNode) {
                removeWrapperTimeout();
                successCallback(vast);
                return;
            }
            if (vastNode.getAttribute("version") !== VAST_VERSION) {
                console.error(new VastError("Invalid VAST document version", VastError.INVALID_VAST_XML));
            }
            function adNodeParseSuccess(ad) {
                vast.ads.push(ad);
                if (++i < len) {
                    processAdNode(adNodeList[i], vastSourceType, timeout, wrapperTimeout, adNodeParseSuccess, errorCallback);
                } else {
                    if (!isWrapperTimeout) {
                        removeWrapperTimeout();
                        successCallback(vast);
                    }
                }
            }
            if (len > 0) {
                processAdNode(adNodeList[i], url, vastSourceType, timeout, wrapperTimeout, adNodeParseSuccess, errorCallback);
            } else {
                removeWrapperTimeout();
                successCallback(vast);
            }
        }
        function loadVastInternal(url, vastSourceType, vastTimeout, wrapperTimeout, successCallback, errorCallback) {
            Net.load(url, null, function(xml) {
                processVastXml(xml, url, vastSourceType, vastTimeout, wrapperTimeout, successCallback, errorCallback);
            }, function(sourceError) {
                errorCallback(new VastError((sourceError.id ? sourceError.id + ":" : "") + sourceError.message, vastSourceType === VastSourceType.AD_FOX ? VastError.ADFOX_VAST_LOAD_ERROR : VastError.YA_VAST_LOAD_ERROR));
            }, vastTimeout, function() {
                errorCallback(new VastError("VAST load timeout.", VastError.VAST_LOAD_TIMEOUT));
            });
        }
        if (urlOrVast.charAt(0) == "<") {
            processVastXml(new DOMParser().parseFromString(urlOrVast, "application/xml"), "", VastSourceType.EXTERNAL, vastTimeout, wrapperTimeout, successCallback, errorCallback);
        } else {
            loadVastInternal(prepareUrl(urlOrVast), isAdFox ? VastSourceType.AD_FOX : Util.isYandexDomain(urlOrVast) ? VastSourceType.YANDEX : VastSourceType.EXTERNAL, vastTimeout, wrapperTimeout, successCallback, errorCallback);
        }
    };
    window.ya.mediaAd.VAST = VAST;
})(window);

(function(window) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    window.ya.mediaAd.TrackingEventType = {
        ERROR: "error",
        IMPRESSION: "impression",
        CREATIVE_VIEW: "creativeView",
        START: "start",
        FIRST_QUARTILE: "firstQuartile",
        MIDPOINT: "midpoint",
        THIRD_QUARTILE: "thirdQuartile",
        COMPLETE: "complete",
        MUTE: "mute",
        UNMUTE: "unmute",
        PAUSE: "pause",
        RESUME: "resume",
        FULLSCREEN: "fullscreen",
        EXIT_FULLSCREEN: "exitFullscreen",
        CLOSE: "close",
        SKIP: "skip",
        CLICK_THROUGH: "clickThrough",
        PROGRESS: "progress"
    };
    window.ya.mediaAd.CustomTrackingEventType = {
        BUFFER_EMPTY: "bufferEmpty",
        BUFFER_FULL: "bufferFull"
    };
    var Net = window.ya.mediaAd.Net, XmlUtil = window.ya.mediaAd.util.XmlUtil, VAST = window.ya.mediaAd.VAST, VastAd = window.ya.mediaAd.VastAd, TrackingEventType = window.ya.mediaAd.TrackingEventType, CustomTrackingEventType = window.ya.mediaAd.CustomTrackingEventType, AdConfigParams = window.ya.mediaAd.AdConfigParams, Util = window.ya.mediaAd.util, fireCallback = Util.fireCallback, log = Util.log;
    function MediaAdError(message, id) {
        this.message = message;
        this.id = id;
    }
    MediaAdError.prototype = new Error();
    MediaAdError.NO_AD_TO_DISPLAY = 51;
    MediaAdError.NO_AD_TO_DISPLAY_MSG = "No ads to display in the VAST documents";
    MediaAdError.SKIP_DELAY_WITHOUT_SKIPOFFSET = 45;
    MediaAdError.SKIP_DELAY_WITHOUT_SKIPOFFSET_MSG = "BlockInfo-Skipoffset error";
    function MediaSource(src, type, bitrate, width, height) {
        this.src = src;
        this.type = type;
        this.bitrate = bitrate;
        this.width = width;
        this.height = height;
        this.isVpaid = false;
    }
    MediaSource.fromMediaFile = function(mediaFile) {
        var mediaSource = new MediaSource(mediaFile.source, mediaFile.type, mediaFile.bitrate, mediaFile.width, mediaFile.height);
        mediaSource.isVpaid = mediaFile.isVpaid;
        return mediaSource;
    };
    MediaSource.fromSourceNode = function(sourceNode) {
        return new MediaSource(XmlUtil.readAttr(sourceNode, "src", null), XmlUtil.readAttr(sourceNode, "type", null));
    };
    function Icon() {
        this.src = null;
        this.type = null;
        this.x = NaN;
        this.y = NaN;
        this.width = NaN;
        this.height = NaN;
    }
    Icon.fromVastIcon = function(vastIcon) {
        var icon = new Icon();
        icon.src = vastIcon.src;
        icon.type = vastIcon.program;
        icon.x = vastIcon.xPosition;
        icon.y = vastIcon.yPosition;
        icon.width = vastIcon.width;
        icon.height = vastIcon.height;
        return icon;
    };
    function AdError(message, id) {
        this.message = message;
        this.id = id;
    }
    AdError.VIDEO_TIMEOUT = 62;
    AdError.BUFFER_FULL_TIMEOUT = 63;
    AdError.BUFFER_EMPTY_LIMIT = 64;
    AdError.prototype = new Error();
    function MediaAd(blockInfo, vastAd) {
        var i, len;
        this.clickThroughUrl = vastAd.clickThrough;
        this.numRepeats = vastAd.numRepeats;
        this.duration = 0;
        this.sources = [];
        for (i = 0, len = vastAd.mediaFiles.length; i < len; i++) {
            this.sources.push(MediaSource.fromMediaFile(vastAd.mediaFiles[i]));
        }
        this.icons = [];
        for (i = 0, len = vastAd.icons.length; i < len; i++) {
            this.icons.push(Icon.fromVastIcon(vastAd.icons[i]));
        }
        this.trackError = function(error) {
            Net.trackError(error, vastAd.trackings.error);
            Net.knock(vastAd.trackings.adFoxError);
        };
        this.playbackParams = {
            isClickable: vastAd.isClickable && !!this.clickThroughUrl,
            title: blockInfo.title,
            description: vastAd.description,
            skinUrl: blockInfo.skinUrl,
            skipTimeLeftShow: blockInfo.skipTimeLeftShow,
            timeLeftShow: blockInfo.timeLeftShow,
            videoTimeout: blockInfo.videoTimeout,
            bufferFullTimeout: blockInfo.bufferFullTimeout,
            bufferEmptyLimit: blockInfo.bufferEmptyLimit,
            progressOffset: vastAd.progressOffset,
            visitSiteShow: blockInfo.visitSiteShow,
            autoplay: true,
            minimalGui: false
        };
        if (isNaN(vastAd.skipOffset)) {
            this.playbackParams.skipDelay = 0;
            if (this.sources.length > 0 && blockInfo.skipDelay) {}
        } else if (isNaN(vastAd.skipTime)) {
            this.playbackParams.skipDelay = blockInfo.skipDelay === 0 ? vastAd.skipOffset : Math.min(blockInfo.skipDelay, vastAd.skipOffset);
        } else {
            this.playbackParams.skipDelay = vastAd.skipTime;
        }
        if (!isNaN(vastAd.duration)) {
            this.duration = vastAd.duration;
        }
        this.trackEvent = function(eventName) {
            log("Tracking:", eventName);
            Net.knock(vastAd.trackings[eventName]);
        };
    }
    MediaAd.prototype.hasMedia = function() {
        return Boolean(this.sources && this.sources.length);
    };
    MediaAd.create = function(blockInfo, vastOrAd) {
        var ad = null;
        if (vastOrAd instanceof VAST) {
            ad = vastOrAd.ads[0];
        } else {
            ad = vastOrAd;
        }
        if (ad instanceof VastAd) {
            return new MediaAd(blockInfo, ad);
        }
        return null;
    };
    window.ya.mediaAd.MediaAd = MediaAd;
    function AdManager(config, blockInfo) {
        this.loadAd = function(adType, onLoaded, onError) {
            var block = blockInfo.getBlockByAdType(adType), mainVast, adFoxVast, mainAd, adFoxAd, adFoxMode = false, preferAdFox = config.hasOwnProperty(AdConfigParams.PREFER_ADFOX) ? config[AdConfigParams.PREFER_ADFOX] : true, isSyncWithAdFoxComplete = false, vastUrlOrContent, adFoxLoadingError = false, rtbLoadingError = false;
            function loadVastFromReturnUrl() {
                VAST.load(adFoxAd.returnUrl, true, blockInfo.vastTimeout, blockInfo.wrapperTimeout, blockInfo.wrapperMaxCount, function(vast) {
                    var mediaAd = MediaAd.create(blockInfo, vast);
                    if (mediaAd && mediaAd.hasMedia()) {
                        onLoaded(mediaAd);
                    } else {
                        fireCallback(onError, new MediaAdError(MediaAdError.NO_AD_TO_DISPLAY_MSG, MediaAdError.NO_AD_TO_DISPLAY));
                    }
                }, function(error) {
                    Net.trackError(error);
                    fireCallback(onError, error);
                });
            }
            function syncMainAndAdFoxVast() {
                var resultMediaAd;
                if (isSyncWithAdFoxComplete) {
                    return;
                }
                if (adFoxLoadingError && rtbLoadingError) {
                    isSyncWithAdFoxComplete = true;
                    fireCallback(onError, new Error("Error of loading AdFox and RTB VASTs."));
                    return;
                }
                if (adFoxLoadingError) {
                    isSyncWithAdFoxComplete = true;
                    if (!preferAdFox && mainVast) {
                        resultMediaAd = MediaAd.create(blockInfo, mainVast);
                    }
                } else if (rtbLoadingError && adFoxVast) {
                    isSyncWithAdFoxComplete = true;
                    resultMediaAd = MediaAd.create(blockInfo, adFoxVast);
                } else if (adFoxVast && preferAdFox || mainVast && !preferAdFox) {
                    adFoxAd = adFoxVast ? adFoxVast.ads[0] : null;
                    mainAd = mainVast ? mainVast.ads[0] : null;
                    var adFoxContainsMedia = adFoxAd && adFoxAd.hasMedia();
                    var mainVastContainsMedia = mainAd && mainAd.hasMedia();
                    if (adFoxContainsMedia && (preferAdFox || !mainVastContainsMedia)) {
                        isSyncWithAdFoxComplete = true;
                        resultMediaAd = MediaAd.create(blockInfo, adFoxVast);
                    } else if (mainVastContainsMedia && (!preferAdFox || !adFoxContainsMedia)) {
                        isSyncWithAdFoxComplete = true;
                        if (preferAdFox && adFoxAd) {
                            if (adFoxAd.isYandexAdxWrapper && mainAd) {
                                adFoxAd.merge(mainAd);
                            }
                            resultMediaAd = MediaAd.create(blockInfo, adFoxAd);
                        } else if (!preferAdFox) {
                            resultMediaAd = MediaAd.create(blockInfo, mainAd);
                        }
                    } else if (adFoxVast && mainVast) {
                        isSyncWithAdFoxComplete = true;
                    }
                }
                if (isSyncWithAdFoxComplete) {
                    if (resultMediaAd && resultMediaAd.hasMedia()) {
                        onLoaded(resultMediaAd);
                    } else if (adFoxAd && adFoxAd.returnUrl && preferAdFox) {
                        loadVastFromReturnUrl();
                    } else {
                        fireCallback(onError, new MediaAdError(MediaAdError.NO_AD_TO_DISPLAY_MSG, MediaAdError.NO_AD_TO_DISPLAY));
                    }
                }
            }
            function processVAST(vast) {
                var mediaAd = MediaAd.create(blockInfo, vast);
                if (mediaAd && mediaAd.hasMedia()) {
                    onLoaded(mediaAd);
                } else {
                    fireCallback(onError, new MediaAdError(MediaAdError.NO_AD_TO_DISPLAY_MSG, MediaAdError.NO_AD_TO_DISPLAY));
                }
            }
            function onMainVastLoaded(vast) {
                if (adFoxMode) {
                    mainVast = vast;
                    syncMainAndAdFoxVast();
                    return;
                }
                processVAST(vast);
            }
            function onMainVastError(error) {
                Net.trackError(error);
                if (adFoxMode) {
                    rtbLoadingError = true;
                    syncMainAndAdFoxVast();
                    return;
                }
                fireCallback(onError, error);
            }
            if (block) {
                if (config[block.adType + "Vast"]) {
                    processVAST(config[block.adType + "Vast"]);
                    return;
                }
                if (config[AdConfigParams.AD_FOX_URL]) {
                    adFoxMode = true;
                    VAST.load(config[AdConfigParams.AD_FOX_URL], true, blockInfo.vastTimeout, blockInfo.wrapperTimeout, blockInfo.wrapperMaxCount, function onAdFoxVastLoaded(vast) {
                        adFoxVast = vast;
                        syncMainAndAdFoxVast();
                    }, function onAdFoxVastError(error) {
                        Net.trackError(error);
                        adFoxLoadingError = true;
                        syncMainAndAdFoxVast();
                    });
                }
                if (config[AdConfigParams.VAST_URL]) {
                    vastUrlOrContent = config[AdConfigParams.VAST_URL];
                } else if (config[AdConfigParams.VAST]) {
                    vastUrlOrContent = config[AdConfigParams.VAST];
                } else {
                    vastUrlOrContent = VAST.getUrl(config, blockInfo, block.id);
                }
                VAST.load(vastUrlOrContent, false, blockInfo.vastTimeout, blockInfo.wrapperTimeout, blockInfo.wrapperMaxCount, onMainVastLoaded, onMainVastError);
            } else {
                fireCallback(onError, new Error("No ads of a given type " + adType));
            }
        };
    }
    window.ya.mediaAd.AdManager = AdManager;
    function AdViewer(mediaAd, videoNodeController) {
        var isPreloaded = false, isPlayAttemptMade = false, completeCallback, that = this, bufferEmptyNum = 0, bufferEmptyTimeoutId = NaN, videoTimeoutId = NaN, internalPause;
        this.mediaAd = mediaAd;
        this.impressionTrackOffset = 0;
        this.onCurrentPositionChange = null;
        this.onMuteChange = null;
        this.onAdVideoStarted = null;
        this.onAdVideoFinished = null;
        this.onPaused = null;
        this.onResumed = null;
        function fireCompleteCallback(obj) {
            fireCallback(completeCallback, obj);
        }
        this.clickThrough = function() {
            if (mediaAd.clickThroughUrl) {
                window.open(mediaAd.clickThroughUrl, "_blank");
                mediaAd.trackEvent(TrackingEventType.CLICK_THROUGH);
                that.pause();
                internalPause = true;
            }
        };
        this.pause = function() {
            videoNodeController.pause();
        };
        this.resume = function(force) {
            isPlayAttemptMade = true;
            if (!internalPause || force) {
                videoNodeController.resume();
            }
        };
        this.internalResume = function() {
            internalPause = false;
            this.resume();
        };
        this.changeMute = function(mute, fade) {
            videoNodeController.setMuted(mute, fade);
        };
        this.getAdDimensions = function() {
            var source = videoNodeController.getVideoDimensions();
            if (!source) {
                return null;
            }
            return {
                width: source.width,
                height: source.height
            };
        };
        function finishAdVideo(error) {
            videoNodeController.callbacks = null;
            removeVideoTimeout();
            removeBufferEmptyTimeout();
            fireCallback(that.onAdVideoFinished);
            videoNodeController.restoreSavedVideo();
            if (error instanceof Error) {
                if (isPlayAttemptMade) {
                    mediaAd.trackError(error);
                }
                fireCompleteCallback(error);
            } else {
                fireCompleteCallback();
            }
        }
        function removeBufferEmptyTimeout() {
            if (!isNaN(bufferEmptyTimeoutId)) {
                clearTimeout(bufferEmptyTimeoutId);
                bufferEmptyTimeoutId = NaN;
            }
        }
        function setupBufferEmptyTimeout() {
            if (isNaN(bufferEmptyTimeoutId)) {
                bufferEmptyTimeoutId = setTimeout(function() {
                    bufferEmptyTimeoutId = NaN;
                    finishAdVideo(new AdError("Buffer empty timeout", AdError.BUFFER_FULL_TIMEOUT));
                }, mediaAd.playbackParams.bufferFullTimeout);
            }
        }
        function removeVideoTimeout() {
            if (!isNaN(videoTimeoutId)) {
                clearTimeout(videoTimeoutId);
                videoTimeoutId = NaN;
            }
        }
        function setupVideoTimeout() {
            var videoTimeout = mediaAd.playbackParams.videoTimeout;
            if (isNaN(videoTimeoutId)) {
                videoTimeoutId = setTimeout(function() {
                    videoTimeoutId = NaN;
                    finishAdVideo(new AdError("Video timeout " + videoTimeout, AdError.VIDEO_TIMEOUT));
                }, videoTimeout);
            }
        }
        this.skipAd = function() {
            mediaAd.trackEvent(TrackingEventType.SKIP);
            finishAdVideo();
        };
        function showAdVideo(pauseOnStart) {
            var started = false, repeats = 0, impressionTracked = false, playingTracked = false, progressTracked = false, firstQuartileTracked = false, midpointTracked = false, thirdQuartileTracked = false, ignoreResume = false;
            videoNodeController.callbacks = {
                onError: function adErrorHandler(videoError) {
                    finishAdVideo(videoError);
                },
                onStarted: function() {
                    fireCallback(that.onResumed);
                    started = true;
                    setupVideoTimeout();
                },
                onPlaying: function() {
                    if (playingTracked) {
                        return;
                    }
                    mediaAd.trackEvent(TrackingEventType.CREATIVE_VIEW);
                    mediaAd.trackEvent(TrackingEventType.START);
                    playingTracked = true;
                },
                onPause: function() {
                    mediaAd.trackEvent(TrackingEventType.PAUSE);
                    fireCallback(that.onPaused);
                },
                onResume: function() {
                    if (ignoreResume) {
                        ignoreResume = false;
                        return;
                    }
                    fireCallback(that.onResumed);
                    mediaAd.trackEvent(TrackingEventType.RESUME);
                },
                onComplete: function() {
                    repeats++;
                    if (repeats == 1) {
                        mediaAd.trackEvent(TrackingEventType.COMPLETE);
                    } else {
                        mediaAd.trackEvent(TrackingEventType.COMPLETE + repeats);
                    }
                    if (repeats == mediaAd.numRepeats) {
                        finishAdVideo();
                    } else {
                        ignoreResume = true;
                        videoNodeController.resume();
                    }
                },
                onFullscreen: function() {
                    mediaAd.trackEvent(TrackingEventType.FULLSCREEN);
                },
                onExitFullscreen: function() {
                    mediaAd.trackEvent(TrackingEventType.EXIT_FULLSCREEN);
                },
                onMuteChange: function(muted) {
                    mediaAd.trackEvent(muted ? TrackingEventType.MUTE : TrackingEventType.UNMUTE);
                    fireCallback(that.onMuteChange, muted);
                },
                onBufferEmpty: function() {
                    mediaAd.trackEvent(CustomTrackingEventType.BUFFER_EMPTY);
                    if (++bufferEmptyNum > mediaAd.playbackParams.bufferEmptyLimit) {
                        finishAdVideo(new AdError("Buffer empty limit", AdError.BUFFER_EMPTY_LIMIT));
                    } else {
                        setupBufferEmptyTimeout();
                    }
                },
                onBufferFull: function() {
                    mediaAd.trackEvent(CustomTrackingEventType.BUFFER_FULL);
                    removeVideoTimeout();
                    removeBufferEmptyTimeout();
                },
                onCurrentPositionChange: function(currentTime, duration) {
                    if (isNaN(duration) || !duration) {
                        duration = mediaAd.duration;
                    }
                    if (isNaN(duration) || !duration) {
                        return;
                    }
                    if (!impressionTracked && currentTime >= that.impressionTrackOffset) {
                        mediaAd.trackEvent(TrackingEventType.IMPRESSION);
                        impressionTracked = true;
                    }
                    if (!progressTracked && !isNaN(mediaAd.playbackParams.progressOffset) && currentTime >= mediaAd.playbackParams.progressOffset) {
                        progressTracked = true;
                        mediaAd.trackEvent(TrackingEventType.PROGRESS);
                    }
                    if (currentTime >= duration / 4 && !firstQuartileTracked) {
                        firstQuartileTracked = true;
                        mediaAd.trackEvent(TrackingEventType.FIRST_QUARTILE);
                    }
                    if (currentTime >= duration / 2 && !midpointTracked) {
                        midpointTracked = true;
                        mediaAd.trackEvent(TrackingEventType.MIDPOINT);
                    }
                    if (currentTime >= duration * 3 / 4 && !thirdQuartileTracked) {
                        thirdQuartileTracked = true;
                        mediaAd.trackEvent(TrackingEventType.THIRD_QUARTILE);
                    }
                    fireCallback(that.onCurrentPositionChange, currentTime, duration);
                }
            };
            try {
                isPlayAttemptMade = !pauseOnStart;
                videoNodeController.setSources(mediaAd.sources);
                if (!pauseOnStart) {
                    setTimeout(function playAllowedTracker() {
                        if (!started) {
                            that.pause();
                        }
                    }, 10);
                    videoNodeController.play();
                }
            } catch (videoError) {
                finishAdVideo(videoError);
                return;
            }
            fireCallback(that.onAdVideoStarted);
        }
        this.preload = function(onComplete, autoplay) {
            if (isPreloaded) {
                fireCallback(onComplete, new Error("Loading already requested"));
                return;
            }
            isPreloaded = true;
            completeCallback = onComplete;
            videoNodeController.stopAndSaveVideoState();
            showAdVideo(!autoplay);
        };
        this.play = function(onComplete) {
            that.preload(onComplete, true);
        };
    }
    window.ya.mediaAd.AdViewer = AdViewer;
})(window);

(function(window, document) {
    "use strict";
    var Util = window.ya.mediaAd.util, isTouchDevice = Util.isTouchDevice, createDiv = Util.createDiv, createControl = Util.createControl, addCallback = Util.addCallback, isIPhone = Util.isIPhone;
    function Gui(adViewer, videoNode, videoWrapperNode) {
        var visitSiteControl, timeLeftControl, skipTimeLeftControl, skipButton, muteButton, unMuteButton, titleControl, playButton, pauseButton, wrapper, DEV_SKIN_URL = "../skin.css", that = this;
        this.wrapper = null;
        function showMute() {
            if (muteButton) {
                muteButton.style.display = "block";
            }
            if (unMuteButton) {
                unMuteButton.style.display = "none";
            }
        }
        function showUnMute() {
            if (muteButton) {
                muteButton.style.display = "none";
            }
            if (unMuteButton) {
                unMuteButton.style.display = "block";
            }
        }
        function updateMute(muted) {
            if (muted) {
                showUnMute();
            } else {
                showMute();
            }
        }
        function stopPropagation(e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
        }
        function skip_clickHandler(e) {
            stopPropagation(e);
            adViewer.skipAd();
        }
        function mute_clickHandler(e) {
            stopPropagation(e);
            adViewer.changeMute(true);
            showUnMute();
        }
        function unMute_clickHandler(e) {
            stopPropagation(e);
            adViewer.changeMute(false);
            showMute();
        }
        function play_clickHandler(e) {
            stopPropagation(e);
            playButton.style.display = "none";
            adViewer.internalResume();
        }
        function pause_clickHandler(e) {
            stopPropagation(e);
            pauseButton.style.display = "none";
            adViewer.pause();
        }
        function wrapper_clickHandler(e) {
            adViewer.clickThrough();
        }
        function isIOS() {
            var userAgent = navigator.userAgent.toLowerCase();
            return userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1;
        }
        function isPaused() {
            return playButton.style.display == "block";
        }
        this.isIOS = isIOS();
        this.pauseAllowed = false;
        function createControls(playbackParams) {
            var topRightBlock = createDiv("topRightBlock");
            wrapper.appendChild(topRightBlock);
            if (playbackParams.timeLeftShow) {
                timeLeftControl = createControl("timeLeft", stopPropagation, "Реклама 00", wrapper);
            }
            if (playbackParams.isClickable && playbackParams.visitSiteShow) {
                var visitSiteWrapper = createDiv("visitSiteWrapper");
                wrapper.appendChild(visitSiteWrapper);
                visitSiteControl = createControl("visitSite pointer", wrapper_clickHandler, "Перейти на сайт рекламодателя", visitSiteWrapper);
            }
            playButton = createControl("play", play_clickHandler, null, wrapper);
            playButton.style.display = playbackParams.autoplay ? "none" : "block";
            that.pauseAllowed = playbackParams.pauseAllowed;
            if (that.pauseAllowed) {
                pauseButton = createControl("pause", pause_clickHandler, null, wrapper);
                pauseButton.style.display = "none";
                wrapper.addEventListener("mouseover", function onPlayerOver() {
                    if (that.pauseAllowed && !isPaused()) {
                        pauseButton.style.display = "block";
                    }
                });
                wrapper.addEventListener("mouseout", function onPlayerOut() {
                    pauseButton.style.display = "none";
                });
            }
            if (!isIOS() && (isTouchDevice() || !playbackParams.minimalGui)) {
                muteButton = createControl("mute", mute_clickHandler, null, topRightBlock);
                unMuteButton = createControl("unMute", unMute_clickHandler, null, topRightBlock);
                unMuteButton.style.display = "none";
            }
            if (playbackParams.minimalGui === true) {
                topRightBlock.className = "topRightBlockMinimal";
                return;
            }
            if (playbackParams.skipDelay > 0) {
                if (playbackParams.skipTimeLeftShow) {
                    skipTimeLeftControl = createControl("skipTimeLeft", stopPropagation, "&#1055;&#1088;&#1086;&#1087;&#1091;&#1089;&#1090;&#1080;&#1090;&#1100; " + "&#1088;&#1077;&#1082;&#1083;&#1072;&#1084;&#1091;: 5 &#1089;&#1077;&#1082;", topRightBlock);
                }
                skipButton = createControl("skip", skip_clickHandler, "&#1055;&#1088;&#1086;&#1087;&#1091;&#1089;&#1090;&#1080;&#1090;&#1100;", topRightBlock);
                skipButton.style.display = "none";
            }
            if (playbackParams.title) {
                titleControl = createControl("title", stopPropagation, playbackParams.title, wrapper);
            }
        }
        function show() {
            videoNode.controls = 0;
            videoWrapperNode.appendChild(wrapper);
        }
        function hide() {
            if (wrapper.parentNode) {
                wrapper.parentNode.removeChild(wrapper);
            }
        }
        function updateCurrentPosition(position, duration) {
            var showSkipButton = position >= adViewer.mediaAd.playbackParams.skipDelay, left = duration - position, minutes = Math.floor(left / 60), seconds = Math.floor(left - minutes * 60), skipLeft = Math.floor(adViewer.mediaAd.playbackParams.skipDelay - position);
            if (skipTimeLeftControl) {
                skipTimeLeftControl.style.display = showSkipButton ? "none" : "block";
            }
            if (skipButton) {
                skipButton.style.display = showSkipButton ? "block" : "none";
            }
            if (!showSkipButton && skipTimeLeftControl) {
                skipTimeLeftControl.innerHTML = "&#1055;&#1088;&#1086;&#1087;&#1091;&#1089;&#1090;&#1080;&#1090;&#1100; " + "&#1088;&#1077;&#1082;&#1083;&#1072;&#1084;&#1091;: " + skipLeft + " &#1089;&#1077;&#1082;";
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (timeLeftControl) {
                timeLeftControl.innerHTML = "&#1056;&#1077;&#1082;&#1083;&#1072;&#1084;&#1072; " + seconds;
            }
        }
        function addBuiltinSkin() {
            var style = document.querySelector("style[data-yamediaad]");
            if (style) {
                return;
            }
            style = document.createElement("style");
            style.setAttribute("data-yamediaad", "");
            style.innerHTML = ya.mediaAd.DEFAULT_CSS;
            document.querySelector("head").appendChild(style);
        }
        function addSkin() {
            var skinUrl = adViewer.mediaAd.playbackParams.skinUrl;
            if (!skinUrl && ya.mediaAd.DEFAULT_CSS) {
                addBuiltinSkin();
                return;
            }
            var styles = document.querySelectorAll("link"), i, style;
            for (i = 0; i < styles.length; i++) {
                if (styles[i].href === skinUrl) {
                    return;
                }
            }
            style = document.createElement("link");
            style.type = "text/css";
            style.rel = "stylesheet";
            style.href = window.ya.mediaAd.DEV_MODE ? DEV_SKIN_URL : adViewer.mediaAd.playbackParams.skinUrl;
            var firstStyle = document.querySelector('head link[rel="stylesheet"]');
            if (firstStyle) {
                document.querySelector("head").insertBefore(style, firstStyle);
            } else {
                document.querySelector("head").appendChild(style);
            }
        }
        function init() {
            var playbackParams = adViewer.mediaAd.playbackParams;
            addSkin();
            that.wrapper = wrapper = document.createElement("div");
            wrapper.className = "yaAdSdkGui";
            wrapper.style.width = videoWrapperNode.style.width || videoWrapperNode.getAttribute("width");
            wrapper.style.height = videoWrapperNode.style.height || videoWrapperNode.getAttribute("height");
            videoWrapperNode.style.position = "relative";
            if (isIPhone()) {
                wrapper.style.display = "none";
            }
            createControls(playbackParams);
            if (playbackParams.isClickable && !visitSiteControl) {
                wrapper.addEventListener("click", wrapper_clickHandler);
                wrapper.className += " pointer";
                if (isIPhone()) {
                    videoNode.addEventListener("click", wrapper_clickHandler);
                }
            }
            adViewer.onCurrentPositionChange = updateCurrentPosition;
            adViewer.onMuteChange = updateMute;
            adViewer.onAdVideoFinished = hide;
            adViewer.onAdVideoStarted = show;
            addCallback(adViewer, "paused", function onPaused() {
                playButton.style.display = "block";
                if (isIPhone()) {
                    wrapper.style.display = "block";
                }
            });
            addCallback(adViewer, "resumed", function onResumed() {
                playButton.style.display = "none";
            });
            updateMute(videoNode.muted);
        }
        init();
    }
    window.ya.mediaAd.Gui = Gui;
})(window, window.document);

(function(window) {
    "use strict";
    if (!window.ya) {
        window.ya = {};
    }
    if (!window.ya.mediaAd) {
        window.ya.mediaAd = {};
    }
    function VideoError(id, message) {
        this.id = id;
        this.message = message;
    }
    VideoError.prototype = new Error();
    VideoError.NO_APPROPRIATE_VIDEO_SOURCE = 52;
    VideoError.FETCHING_ABORTED = 101;
    VideoError.NETWORK_ERROR = 102;
    VideoError.DECODE_ERROR = 103;
    VideoError.SRC_NOT_SUPPORTED = 104;
    VideoError.VIDEO_ERROR = 10;
    window.ya.mediaAd.VideoError = VideoError;
    function VideoState() {
        this.src = null;
    }
    VideoState.fromVideo = function(videoNode) {
        var videoState = new VideoState();
        videoState.src = videoNode.currentSrc;
        videoState.controls = videoNode.controls;
        return videoState;
    };
    function VideoNodeController(videoNode) {
        var videoState, that = this, timeUpdateIntervalId, lastMutedValue = videoNode.muted, isFullscreen = false, isStarted = false, justStarted = false, isLagging = false, muteInterval, MUTE_DURATION = 1e3, UNMUTE_DURATION = 400, preferredSource;
        function muteWithFade(muted) {
            if (muteInterval) {
                clearInterval(muteInterval);
            }
            var time = new Date().getTime();
            var initialValue = videoNode.volume;
            var valueToChange = muted ? 0 : 1;
            var duration = Math.abs((muted ? MUTE_DURATION : UNMUTE_DURATION) * (initialValue - valueToChange));
            if (duration == 0) {
                return;
            }
            videoNode.muted = false;
            muteInterval = setInterval(function() {
                var timeStep = (new Date().getTime() - time) / duration;
                videoNode.volume = muted ? Math.max(valueToChange, (1 - timeStep) * (initialValue - valueToChange)) : Math.min(valueToChange, timeStep * (valueToChange - initialValue));
                if (timeStep >= 1) {
                    clearInterval(muteInterval);
                    muteInterval = 0;
                    if (muted) {
                        videoNode.muted = true;
                    }
                }
            }, 20);
        }
        function resetState() {
            isStarted = false;
            isLagging = false;
            if (timeUpdateIntervalId) {
                clearInterval(timeUpdateIntervalId);
                timeUpdateIntervalId = 0;
            }
        }
        this.callbacks = null;
        this.play = function() {
            resetState();
            videoNode.addEventListener("abort", function abortHandler() {
                videoNode.removeEventListener("abort", abortHandler);
                setTimeout(function() {
                    videoNode.play();
                }, 0);
            });
            that.resume();
        };
        this.restoreSavedVideo = function() {
            resetState();
            videoNode.controls = videoState.controls;
            if (videoState.src) {
                videoNode.src = videoState.src;
            }
        };
        this.stopAndSaveVideoState = function() {
            videoState = VideoState.fromVideo(videoNode);
            if (videoNode.currentSrc) {
                videoNode.pause();
            }
        };
        this.resume = function() {
            if (!videoNode.currentSrc) {
                videoNode.autoplay = true;
                videoNode.preload = "auto";
            }
            videoNode.play();
        };
        this.pause = function() {
            videoNode.pause();
        };
        this.setMuted = function(value, fade) {
            if (fade) {
                muteWithFade(value);
            } else {
                videoNode.muted = value;
                videoNode.volume = value ? 0 : 1;
            }
        };
        function fireCallback(callbackName) {
            if (that.callbacks && typeof that.callbacks[callbackName] === "function") {
                that.callbacks[callbackName].apply(null, Array.prototype.slice.call(arguments, 1));
            }
        }
        function errorHandler() {
            fireCallback("onError", that.getVideoNodeError());
        }
        function waitingHandler() {
            if (!isStarted || justStarted) {
                return;
            }
            isLagging = true;
            fireCallback("onBufferEmpty");
        }
        function timeupdateHandler() {
            fireCallback("onCurrentPositionChange", videoNode.currentTime, videoNode.duration);
        }
        function playHandler() {
            if (!timeUpdateIntervalId) {
                timeUpdateIntervalId = setInterval(timeupdateHandler, 500);
            }
            justStarted = true;
            if (!isStarted) {
                isStarted = true;
                fireCallback("onStarted");
                return;
            }
            fireCallback("onResume");
        }
        function canplayHandler() {
            if (isLagging || justStarted) {
                isLagging = false;
                justStarted = false;
                fireCallback("onBufferFull");
            }
        }
        function playingHandler() {
            lastMutedValue = videoNode.muted;
            canplayHandler();
            fireCallback("onPlaying");
        }
        function endedHandler() {
            fireCallback("onComplete");
            resetState();
        }
        function pauseHandler() {
            if (videoNode.currentTime === videoNode.duration) {
                return;
            }
            fireCallback("onPause");
        }
        function volumeChangeHandler() {
            if (lastMutedValue != videoNode.muted) {
                lastMutedValue = videoNode.muted;
                fireCallback("onMuteChange", videoNode.muted);
            }
        }
        function fullscreenChangeHandler() {
            if (document.fullscreenEnabled) {
                if (document.fullscreenElement === videoNode) {
                    isFullscreen = true;
                    fireCallback("onFullscreen");
                }
            } else if (isFullscreen) {
                isFullscreen = false;
                fireCallback("onExitFullscreen");
            }
        }
        this.getVideoNodeError = function() {
            var error = new VideoError(VideoError.VIDEO_ERROR, "Cannot play the video source");
            if (videoNode.error) {
                switch (videoNode.error.code) {
                  case MediaError.MEDIA_ERR_ABORTED:
                    error = new VideoError(VideoError.FETCHING_ABORTED, "The fetching process for the video resource was aborted by the user agent");
                    break;

                  case MediaError.MEDIA_ERR_NETWORK:
                    error = new VideoError(VideoError.NETWORK_ERROR, "A network error occurred");
                    break;

                  case MediaError.MEDIA_ERR_DECODE:
                    error = new VideoError(VideoError.DECODE_ERROR, "An error occurred while decoding the video resource");
                    break;

                  case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    error = new VideoError(VideoError.SRC_NOT_SUPPORTED, "The 'src=" + videoNode.currentSrc + "' attribute was not suitable");
                    break;
                }
            }
            return error;
        };
        function getPreferableSource(sourceList) {
            var playableSources = [], preferableSource, videoSource, i, len, delta, minDelta = Number.MAX_VALUE;
            for (i = 0, len = sourceList.length; i < len; i++) {
                videoSource = sourceList[i];
                if (videoNode.canPlayType(videoSource.type) === "probably") {
                    playableSources.push(videoSource);
                }
            }
            if (playableSources.length === 0) {
                for (i = 0, len = sourceList.length; i < len; i++) {
                    videoSource = sourceList[i];
                    if (videoNode.canPlayType(videoSource.type) === "maybe") {
                        playableSources.push(videoSource);
                    }
                }
            }
            if (playableSources.length === 0) {
                for (i = 0, len = sourceList.length; i < len; i++) {
                    videoSource = sourceList[i];
                    if (videoSource.type != "application/x-shockwave-flash" && videoSource.type != "video/mp4" && videoSource.src.indexOf(".mp4") > -1) {
                        playableSources.push(videoSource);
                    }
                }
            }
            if (playableSources.length === 0) {
                return null;
            }
            for (i = 0, len = playableSources.length; i < len; i++) {
                videoSource = playableSources[i];
                delta = Math.max(Math.abs(that.getWidth() - videoSource.width), Math.abs(that.getHeight() - videoSource.height));
                if (delta < minDelta) {
                    minDelta = delta;
                    preferableSource = videoSource;
                }
            }
            return preferableSource;
        }
        function fixSourceRedirect(src) {
            if (new XMLHttpRequest().responseURL === undefined) {
                videoNode.src = src;
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", src);
            var errorProcessed = false;
            function onError() {
                if (errorProcessed) {
                    return;
                }
                videoNode.src = src;
                errorProcessed = true;
            }
            xhr.onload = function() {
                if (xhr.status == 200) {
                    videoNode.src = xhr.responseURL;
                } else {
                    onError();
                }
            };
            xhr.onerror = onError;
            xhr.ontimeout = onError;
            xhr.send();
        }
        this.setSources = function(sourcesList) {
            preferredSource = getPreferableSource(sourcesList);
            if (!preferredSource) {
                var message = "Cannot find an appropriate video source.";
                if (sourcesList.some(function(source) {
                    return source.isVpaid;
                })) {
                    message = "VPAID returned. " + message;
                }
                throw new VideoError(VideoError.NO_APPROPRIATE_VIDEO_SOURCE, message);
            }
            if (preferredSource.src.indexOf(".yandex.ru/get/") > -1) {
                fixSourceRedirect(preferredSource.src);
            } else {
                videoNode.src = preferredSource.src;
            }
        };
        this.getWidth = function() {
            return videoNode.clientWidth;
        };
        this.getHeight = function() {
            return videoNode.clientHeight;
        };
        this.getVideoDimensions = function() {
            if (!preferredSource) {
                return null;
            }
            if (videoNode.videoWidth > 0) {
                return {
                    width: videoNode.videoWidth,
                    height: videoNode.videoHeight
                };
            }
            return {
                width: preferredSource.width,
                height: preferredSource.height
            };
        };
        this.destroy = function() {
            resetState();
            videoNode.removeEventListener("play", playHandler);
            videoNode.removeEventListener("canplay", canplayHandler);
            videoNode.removeEventListener("playing", playingHandler);
            videoNode.removeEventListener("pause", pauseHandler);
            videoNode.removeEventListener("ended", endedHandler);
            videoNode.removeEventListener("error", errorHandler);
            videoNode.removeEventListener("waiting", waitingHandler);
            videoNode.removeEventListener("timeupdate", timeupdateHandler);
            videoNode.removeEventListener("volumechange", volumeChangeHandler);
            document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
        };
        function init() {
            videoNode.addEventListener("play", playHandler);
            videoNode.addEventListener("canplay", canplayHandler);
            videoNode.addEventListener("playing", playingHandler);
            videoNode.addEventListener("pause", pauseHandler);
            videoNode.addEventListener("ended", endedHandler);
            videoNode.addEventListener("error", errorHandler);
            videoNode.addEventListener("waiting", waitingHandler);
            videoNode.addEventListener("timeupdate", timeupdateHandler);
            videoNode.addEventListener("volumechange", volumeChangeHandler);
            document.addEventListener("fullscreenchange", fullscreenChangeHandler);
            fullscreenChangeHandler();
        }
        init();
    }
    window.ya.mediaAd.VideoNodeController = VideoNodeController;
})(window);

(function(window) {
    "use strict";
    var MediaAdNs = window.ya.mediaAd, AdType = MediaAdNs.AdType, BlockInfo = MediaAdNs.BlockInfo, Net = MediaAdNs.Net, AdConfigParams = MediaAdNs.AdConfigParams, AdViewer = MediaAdNs.AdViewer, AdManager = MediaAdNs.AdManager, VideoNodeController = MediaAdNs.VideoNodeController, Gui = MediaAdNs.Gui, fireCallback = MediaAdNs.util.fireCallback, addCallback = MediaAdNs.util.addCallback, getElement = MediaAdNs.util.getElement, isIPhone = MediaAdNs.util.isIPhone;
    function AdDisplayController(config, adManager, videoNodeOrId, videoWrapperNodeOrId) {
        var videoNode = getElement(videoNodeOrId), videoWrapperNode = getElement(videoWrapperNodeOrId), that = this;
        this.videoNodeController = new VideoNodeController(videoNode);
        this.gui = null;
        this.showAd = function(adType, onCreate, onComplete, onError) {
            videoNode.pause();
            adManager.loadAd(adType, function(mediaAd) {
                var adViewer = new AdViewer(mediaAd, that.videoNodeController);
                var playbackParams = adViewer.mediaAd.playbackParams;
                if (config.minimalGui === true) {
                    playbackParams.minimalGui = true;
                }
                if (config.hasOwnProperty("visitSiteShow")) {
                    playbackParams.visitSiteShow = config.visitSiteShow;
                }
                if (config.hasOwnProperty("autoplay")) {
                    playbackParams.autoplay = config.autoplay;
                }
                if (config.hasOwnProperty("pauseAllowed")) {
                    playbackParams.pauseAllowed = config.pauseAllowed;
                }
                if (config.hasOwnProperty(AdConfigParams.NUMRUNS)) {
                    adViewer.mediaAd.numRepeats = config[AdConfigParams.NUMRUNS];
                }
                if (config.hasOwnProperty(AdConfigParams.IMPRESSION_OFFSET)) {
                    adViewer.impressionTrackOffset = config[AdConfigParams.IMPRESSION_OFFSET];
                }
                that.gui = new Gui(adViewer, videoNode, videoWrapperNode);
                if (!config[AdConfigParams.DURATION] && videoNode.duration) {
                    config[AdConfigParams.DURATION] = videoNode.duration;
                }
                config[AdConfigParams.WIDTH] = that.videoNodeController.getWidth();
                config[AdConfigParams.HEIGHT] = that.videoNodeController.getHeight();
                function completeWrapper(result) {
                    if (result instanceof Error && onCreate) {
                        fireCallback(onError, result);
                        onCreate = null;
                    }
                    fireCallback(onComplete, result);
                }
                fireCallback(onCreate, adViewer);
                if (config.hasOwnProperty("autoplay") && !config.autoplay) {
                    adViewer.preload(completeWrapper);
                } else {
                    adViewer.play(completeWrapper);
                }
                onCreate = null;
            }, function(error) {
                fireCallback(onError, error);
            });
        };
    }
    MediaAdNs.initPlacement = function(config, onInit, onError) {
        function onSuccess(blockInfo) {
            onInit(new AdManager(config, blockInfo));
        }
        if (config.blockInfo instanceof BlockInfo) {
            onSuccess(config.blockInfo);
            return;
        }
        BlockInfo.load(config, onSuccess, function(blockInfoError) {
            Net.trackError(blockInfoError);
            fireCallback(onError, blockInfoError);
        });
    };
    MediaAdNs.initAdDisplay = function(config, videoNodeOrId, videoWrapperNodeOrId, callback) {
        window.ya.mediaAd.initPlacement(config, function(adManager) {
            fireCallback(callback, new AdDisplayController(config, adManager, videoNodeOrId, videoWrapperNodeOrId));
        }, callback);
    };
    MediaAdNs.initForVideoNode = function(config, videoNodeOrId, videoWrapperNodeOrId, onInit, onError) {
        var videoNode = getElement(videoNodeOrId), videoWrapperNode = getElement(videoWrapperNodeOrId), displayController, callbacks = {
            onAdStart: null,
            onAdEnd: null
        };
        function createPlaybackTracker(adType) {
            return function onCreate(adViewer) {
                addCallback(adViewer, "adVideoStarted", function() {
                    fireCallback(callbacks.onAdStart, adType);
                });
                addCallback(adViewer, "adVideoFinished", function() {
                    fireCallback(callbacks.onAdEnd, adType);
                });
            };
        }
        function showPostroll() {
            displayController.showAd(AdType.POSTROLL, createPlaybackTracker(AdType.POSTROLL), function() {
                startPrerollTracking(startPostrollTracking);
            }, function(error) {
                fireCallback(onError, error);
                startPrerollTracking(startPostrollTracking);
            });
        }
        function startPostrollTracking() {
            displayController.videoNodeController.callbacks = {
                onComplete: function() {
                    displayController.videoNodeController.callbacks = null;
                    showPostroll();
                }
            };
        }
        function showPreroll(completeCallback) {
            function onPrerollComplete(error) {
                displayController.videoNodeController.play();
                fireCallback(completeCallback);
            }
            displayController.showAd(AdType.PREROLL, createPlaybackTracker(AdType.PREROLL), onPrerollComplete, onPrerollComplete);
        }
        function startPrerollTracking(completeCallback) {
            displayController.videoNodeController.callbacks = {
                onStarted: function() {
                    showPreroll(completeCallback);
                }
            };
        }
        MediaAdNs.initAdDisplay(config, videoNode.id, videoWrapperNode.id, function(obj) {
            if (obj instanceof Error) {
                fireCallback(onError, obj);
                return;
            }
            displayController = obj;
            startPrerollTracking(startPostrollTracking);
            fireCallback(onInit, callbacks);
        });
    };
    window.ya.videoAd.AdConfigParams = AdConfigParams;
    window.ya.videoAd.initVideoNode = function(config, videoNodeId, videoWrapperNodeId, callback) {
        window.ya.mediaAd.initForVideoNode(config, videoNodeId, videoWrapperNodeId, callback, callback);
    };
})(window);