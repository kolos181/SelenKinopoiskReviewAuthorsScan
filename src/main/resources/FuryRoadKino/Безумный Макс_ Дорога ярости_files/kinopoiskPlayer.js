var player = null;
var currently_playing=null;
var playback_completed_callback = null;
var player_version='13.101-51';
var players_inited = {};
var player_collection = {};
var already_started = {};
var advert = '';
var player_host = '';
if(top.location.host.indexOf('www.kinopoisk.ru') == -1 ){
    player_host = 'betastatic.';
}


if(typeof(KP) == 'undefined') {
    var KP = {};
}

KP.Trailers = {};

var noflash = $.cookie('noflash');
$(function(){
    if(typeof(swfobject) !== 'undefined') {
        if(swfobject.getFlashPlayerVersion().major){
            noflash = 'false';
        } else {
            noflash = 'true';
        }
        $.cookie('noflash',noflash,{ expires: 1, path: '/', domain: '.kinopoisk.ru' });
    }
})


function HTML5Browser() {
    return (noflash == 'true' ||
            navigator.userAgent.indexOf('iPad') > -1 ||
            navigator.userAgent.indexOf('iPhone') > -1 ||
            navigator.userAgent.indexOf('Windows Phone OS') > -1 ||
            navigator.userAgent.indexOf('Android') > -1);
}

function GetHTML5Player(object_id, src, w, h, auto, image, plg, sdk_data) {
    if(!sdk_data) sdk_data = {};
    if(src.indexOf(getTrailersDomain()) != -1) {
       var match = src.match(/([0-9]+)\/(.*)/);
       src = "/gettrailer.php?from_src=html5&turl="+match[0];
    }
    $('#'+object_id)
        .html("<video src='"+src+"' id='"+object_id+"_video' height='"+h+"' width='"+w+"' "+(image ? "poster='"+image+"'" : "")+" preload='none' controls='controls'></video>")
        .find('video').get(0)
            .addEventListener('play', function(){
                var $this = $('#'+object_id).find('video');
                if (!$this.data('zeropixelloaded')) {
                    $this.data('zeropixelloaded', true);
                    loadTrZeroPixel();
                }
            });
    if(plg != 'no') {
        setTimeout(function(){
            var AdConfigParams = window.ya.videoAd.AdConfigParams,
                config = {};
            config[AdConfigParams.PARTNER_ID] = 139995;
            config[AdConfigParams.CATEGORY] = 0;
            config[AdConfigParams.TAGS_LIST] = null;
            config[AdConfigParams.EMPTY_ID] = null;
            config[AdConfigParams.EXT_PARAM] = null;
            config[AdConfigParams.VIDEO_CONTENT_ID] = sdk_data.id;
            config[AdConfigParams.VIDEO_CONTENT_NAME] = sdk_data.name;
            config[AdConfigParams.VIDEO_PUBLISHER_ID] = sdk_data.publisher_id;
            config[AdConfigParams.VIDEO_PUBLISHER_NAME] = sdk_data.publisher_name;
            config[AdConfigParams.CHARSET] = sdk_data.charset;
            config[AdConfigParams.VIDEO_GENRE_ID] = (typeof(sdk_data.genre_ids) == "object" ? sdk_data.genre_ids.join("\n") : "");
            config[AdConfigParams.VIDEO_GENRE_NAME] = (typeof(sdk_data.genre_names) == "object" ? sdk_data.genre_names.join("\n") : "");
            config[AdConfigParams.AD_FOX_URL] = getAdFoxUrl();


            window.ya.videoAd.initVideoNode(config, object_id+"_video", object_id, function (obj) {
                console.log(obj);
                if (obj instanceof Error) {
                    console.log(obj);
                    // ��� ������������� ������������ ������.
                }
            });
        },300);
    }


}

function getInfo(data) {
    return data;
}

function getTrailer(id,flv,preview,w,h,dom,plg,sbt,autostart,provider,genres, sdk_data){
    if(!sdk_data) {
        sdk_data = {};
    }
    var proportions = w/h;
    var min_delta = 10000;
    var best_prop = [];
    if(typeof(player_collection[id]) == 'undefined') {
        player_collection[id] = {};
    }

    $("#trailer_container_" + id).css('height',h);
    $("#trailer_container_" + id).parents('.trailerGag').css('height',h);
    $("#tr" + id).css('height',h);
    //$("#trailer_container_" + id).height(h);
    flv = "http://"+getTrailersDomain()+"/"+flv;
    if (preview) preview = "http://"+getTrailersDomain()+"/"+preview;

    if (HTML5Browser()) {
        GetHTML5Player("fc_"+id,flv,w,h,false, preview, plg, sdk_data);
        return;
    }
    $.ajax({
    url: "http://"+player_host+"yandex.st/swf/kinoplayer/13_101/info?nc=" + Math.random(),
    dataType: 'jsonp',
    jsonpCallback: 'getInfo',
    jsonp: true,
    success: function(data){
        player_version = data.version;
        var playerURL = 'http://'+player_host+'yandex.st/swf/kinoplayer/13_101/v-' + player_version + '/kinoplayer.swf';
        var flashvars = {
            'player-id' : id,
            'url' :  encodeURIComponent(flv) ,
            'allow-seek' : false,
            'preview-url' : preview,
            'autoplay' : autostart,
             bgcolor: "#000000",
            'hidden' : 'logo',
            'onStateChange' : 'playerStateChange',
            'onReady' : 'playerReady'

        };

        if(plg != 'no') {
            flashvars['target-referrer'] = encodeURIComponent(top.location.href);
            flashvars['page-referrer'] = encodeURIComponent(document.referrer);
            flashvars['category'] = 0;
            flashvars['tags-list'] = null;
            flashvars['empty-id'] = null;
            flashvars['ext-param'] = null;
            flashvars['video-content-id'] = sdk_data.id;
            flashvars['video-content-name'] = encodeURIComponent(sdk_data.name);
            flashvars['video-publisher-id'] = sdk_data.publisher_id;
            flashvars['video-publisher-name'] = encodeURIComponent(sdk_data.publisher_name);
            flashvars['charset'] = encodeURIComponent(sdk_data.charset);
            flashvars['video-genre-id'] = encodeURIComponent(typeof(sdk_data.genre_ids) == "object" ? sdk_data.genre_ids.join("\n") : "");
            flashvars['video-genre-name'] = encodeURIComponent(typeof(sdk_data.genre_names) == "object" ? sdk_data.genre_names.join("\n") : "");


            flashvars['ad-fox-url'] = encodeURIComponent(getAdFoxUrl());
        } else {
            flashvars['noAd'] = true;
        }

        if(sbt) {
            flashvars['subs-url'] = 'http://' + top.location.host + '/handler_subtitles.php?p='+sbt;
        }

        var params = {
            movie: playerURL,
            allowfullscreen: "true",
            bgcolor: "#000000",
            allowscriptaccess: "always",
            wmode: "transparent"
        };

        var attributes = {
            id: id,
            name: id,
            bgcolor: "#000000",
            background: "#000000",
            classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            width: w,
            height: h,
            type: "application/x-shockwave-flash"
        };

        swfobject.embedSWF(playerURL, "fc_"+id, w, h, "9.0.0", null, flashvars, params, attributes);
    }
});
}


function getPlayer(flv, preview, w, h, auto, id, dom, plg, sbt, sdk_data) {
    if(!sdk_data) {
        sdk_data = {};
    }

    var container = "fc_player_"+id;
    if($("#fc_player" + id).length > 0) {
        container = "fc_player"+id;
    }
    if (HTML5Browser()) {
        GetHTML5Player(container,flv,w,h,'false', preview, plg);
        return;
    }

    $.ajax({
        url: "http://"+player_host+"yandex.st/swf/kinoplayer/13_101/info?nc=" + Math.random(),
        dataType: 'jsonp',
        jsonpCallback: 'getInfo',
        jsonp: true,
        success: function(data){
            player_version = data.version;
            var playerURL = 'http://'+player_host+'yandex.st/swf/kinoplayer/13_101/v-' + player_version + '/kinoplayer.swf';

            var flashvars = {
                'player-id' : id,
                'url' :  encodeURIComponent(flv) ,
                'allow-seek' : false,
                'preview-url' : preview,
                'autoplay' : auto,
                'hidden' : 'logo',
                'onStateChange' : 'playerStateChange',
                'onReady' : 'playerReady'
            };

            if(plg != 'no') {
                flashvars['target-referrer'] = encodeURIComponent(top.location.href);
                flashvars['page-referrer'] = encodeURIComponent(document.referrer);
                flashvars['category'] = 123;
                flashvars['tags-list'] = null;
                flashvars['empty-id'] = null;
                flashvars['ext-param'] = null;
                flashvars['video-content-id'] = id;
                flashvars['video-content-name'] = encodeURIComponent(sdk_data.name);
                flashvars['video-publisher-id'] = sdk_data.publisher_id;
                flashvars['video-publisher-name'] = encodeURIComponent(sdk_data.publisher_name);
                flashvars['charset'] = encodeURIComponent(sdk_data.charset);
                flashvars['video-genre-id'] = encodeURIComponent(typeof(sdk_data.genre_ids) == "object" ? sdk_data.genre_ids.join("\n") : "");
                flashvars['video-genre-name'] = encodeURIComponent(typeof(sdk_data.genre_names) == "object" ? sdk_data.genre_names.join("\n") : "");
                flashvars['ad-fox-url'] = encodeURIComponent(getAdFoxUrl());
            } else {
                flashvars['noAd'] = true;
            }

            if(sbt) {
                flashvars['subs-url'] = 'http://' + top.location.host + '/handler_subtitles.php?p='+sbt;
            }

            var params = {
                movie: playerURL,
                allowfullscreen: "true",
                allowscriptaccess: "always",
                wmode: "transparent"
            };

            var attributes = {
                id: id,
                name: id,
                classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                width: w,
                height: h,
                type: "application/x-shockwave-flash"
            };

            swfobject.embedSWF(playerURL, container, w, h, "9.0.0", null, flashvars, params, attributes);
        }
    });
}


function PlayerSeek(id,sec){
    return false;
}

function playerStateChange(state,id){
    switch(state) {
        case "play" : {
            /* if(currently_playing != id) {
                StopPlaying();
            } */
            currently_playing = id;
            if(!already_started[id]) {
                $.get('/handler_trailer_rating.php?clipID='+id+'&rnd='+(new Date()).getTime(),function(){});
                var img = new Image();
                img.src = 'http://www.tns-counter.ru/V13a***R>' + document.referrer.replace(/\*/g,'%2a') + '*kinopoisk_ru/ru/CP1251/tmsec=kinopoisk_playstart/';
                document.body.appendChild(img);
                
                var img2 = new Image();
                img2.src = 'http://www.tns-counter.ru/V13a****vitpc_ad/ru/CP1251/tmsec=vitpc_monitoring-1/';
                document.body.appendChild(img2);
                                
                already_started[id] = true;
            }
            break;
        }
        case "pause": {
            currently_playing = null;
            break;
        }


        case "stop": {
            currently_playing = null;
            var img = new Image();
            img.src = 'http://www.tns-counter.ru/V13a***R>' + document.referrer.replace(/\*/g,'%2a') + '*kinopoisk_ru/ru/CP1251/tmsec=kinopoisk_playend/';
            document.body.appendChild(img);


            break;
        }

        case "end": {
            if(player_collection[id]){
                GetTrailerPreview(player_collection[id]);
            }
            if (typeof playback_completed_callback === 'function') {
                playback_completed_callback();
            }
            break;
        }

    }
}

function playerReady(id){
   players_inited[id] = true;
}


function StopPlaying(){
    if(currently_playing){
        $("#"+currently_playing).get(0).pauseVideo();
    }
}

function GetTrailerPreview(params) {
    if (!params.containerId) return;
    if (!params.trailerW) return;
    if (!params.trailerH) return;
    if (!params.trailerId) return;
    if (!params.trailerFile) return;
    player_collection[params.trailerId] = params;
    if (!params.trailerDom) params.trailerDom = '';
    if (!params.trailerAdvsys) params.trailerAdvsys = '';
    if (!params.trailerSbt) params.trailerSbt = '';
    if (!params.previewFile) params.previewFile = NULL;
    if (!params.previewW) params.previewW = params.trailerW;
    if (!params.previewH) params.previewH = params.trailerH;
    if (!params.explicit) params.explicit = false;
    if (!params.provider) params.provider = "video";
    if (!params.noButton) params.noButton = false; // ��� ����������� ������ Play
    if (!params.genres) params.genres = '';
    if (!params.sdk_data) params.sdk_data = {};
    if (!params.sdk_data.charset) params.sdk_data.charset = "utf8";
    playback_completed_callback = params.onComplete; // callback ��� ���������� ���������������
    var w = params.previewW > params.trailerW ? params.previewW : params.trailerW;
    var h = params.previewH > params.trailerH ? params.previewH : params.trailerH;

    var half_width = Math.round(params.previewW / 2) + Math.round((555 - params.previewW) / 2);
    var half_height = Math.round(params.previewH / 2) + Math.round((555 - params.previewH) / 2);

    var playButtonImg = (params.explicit) ? 'http://st.kp.yandex.net/images/trailer_playLexis.png' : 'http://st.kp.yandex.net/images/trailer_play.png';

    if (HTML5Browser()) {
        var html = ''
        + '<div style="width: '+params.trailerW+'px; height: '+params.trailerH+'px" id="trailer_container_'+params.trailerId+'">'
        + '    <div id="fc_'+params.trailerId+'"></div>'
        + '</div>';
    } else {
        var html = ''
        + ' <div style="display: none; background: black; width: '+params.trailerW+'px; height: '+params.trailerH+'px" id="trailer_container_'+params.trailerId+'">'
        + '     <div id="fc_'+params.trailerId+'" data-container="'+params.containerId+'"></div>'
        + ' </div>'
        + ' <div id="trailer_preview_'+params.trailerId+'" style="background: url(http://'+getTrailersDomain()+'/'+params.previewFile+') 0 0 no-repeat; width: '+params.previewW+'px; height: '+params.previewH+'px; cursor: pointer; overflow: hidden; position: relative">'
        + (!params.noButton ?
          '    <img src="' + playButtonImg + '" style="min-width: 555px; width: 555px; height: 555px; position: absolute; top: 50%; left: 50%; margin: -'+half_height+'px 0 0 -'+half_width+'px" alt="" />' :
          '    <img style="filter: alpha(opacity = 40); opacity: 0.4; background-color: black; min-width: 555px; width: 555px; height: 555px; position: absolute; top: 50%; left: 50%; margin: -'+half_height+'px 0 0 -'+half_width+'px" alt="" />')
        + '</div>';
    }

    if (HTML5Browser()) {
        $('#'+params.containerId).html(html);
        getTrailer(params.trailerId, params.trailerFile, params.previewFile, params.trailerW, params.trailerH, params.trailerDom, params.trailerAdvsys, params.trailerSbt, 'false', params.provider,params.genres, params.sdk_data);
    } else {
        $('#'+params.containerId)
            .css({"width":params.previewW,"height":params.previewH})
            .html(html)
            .one("mousedown",function(){
                loadTrZeroPixel();
                if ($('.trailerGag').length) {
                    $('.trailerGag').css('height', params.trailerH);
                    $('.trailerGag .play, .trailerGag .next, .trailerGag .prev, .trailerGag .descr').css('opacity', 0);/*animate({ opacity: 0 }, 150, 'easeInQuad', function() {*/
                        $('.trailerGag .descr, .trailerGag .play').hide();
                        $('.trailerGag .prev, .trailerGag .next').bind('mouseover', function() {
                            $(this).animate({ opacity: 1 }, 150, 'easeInQuad');
                        }).bind('mouseout', function() {
                            $(this).animate({ opacity: 0 }, 150, 'easeInQuad');
                        })
                    // });
                }
                $('#trailer_preview_'+params.trailerId).hide();
                $('#trailer_container_'+params.trailerId).show();
                $(this).css({"width":params.trailerW, "height":params.trailerH});
                getTrailer(params.trailerId, params.trailerFile, false, params.trailerW, params.trailerH, params.trailerDom, params.trailerAdvsys, params.trailerSbt, 'true', params.provider,params.genres, params.sdk_data);
                $(this).unbind('click');
                // StartPlaying(params.trailerId);
            });
    }
}

function loadTrZeroPixel()
{
    var img = new Image();
    img.src = 'http://awaps.yandex.ru/0/10983/001001.gif?0-0-0-0-la:323306p:201918';
}

function showTrailer(id,flv,preview,w,h,dom,plg,sbt,autostart) {
    document.getElementById('tr_'+id).style.display='block';
    document.getElementById('tr_link_d_'+id).style.display='none';
    document.getElementById('tr_link_u_'+id).style.display='block';

    getTrailer(id,flv,preview,w,h,dom,plg,sbt,autostart);
}

function hideTrailer(id) {
    StopPlaying(id);

    document.getElementById('tr_'+id).style.display='none';
    document.getElementById('tr_link_u_'+id).style.display='none';
    document.getElementById('tr_link_d_'+id).style.display='block';

    try {
        document.getElementById('fc_'+id+'_div').innerHTML='<div id="fc_'+id+'"></div>';
    } catch (e) {}
}


