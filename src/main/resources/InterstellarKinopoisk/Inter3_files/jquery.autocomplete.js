allgray=false;
lastquery=null;
lastresult={};
lastrequest='';
lastmode='';
host = 'www.kinopoisk.ru';

var searchtypes=new Array();
searchtypes['first']='Возможно, вы искали';
searchtypes['film']='Фильмы';
searchtypes['people']='Имена';
searchtypes['cinema']='Кинотеатры';
searchtypes['page']='Страницы КиноПоиска';
searchtypes['user']='Пользователи';
searchtypes['keyword']='Ключевые слова';

var mode='';
var ModeSettings=new Array();
ModeSettings['']=new Array();
ModeSettings['']['handler'] = "http://" + host + "/handler_search.php";
ModeSettings['']['label']="";
ModeSettings['']['pos']={"padding-left":2,"width":272};
ModeSettings['user']=new Array();
ModeSettings['user']['handler'] = "http://" + host + "/handler_search_login.php";
ModeSettings['user']['label']="Пользователь";
ModeSettings['user']['pos']={"padding-left":100,"width":174};
ModeSettings['keyword']=new Array();
ModeSettings['keyword']['handler']= "http://" + host + "/handler_search_keyword.php";
ModeSettings['keyword']['label']="Слово";
ModeSettings['keyword']['pos']={"padding-left":60,"width":214};
ModeSettings['text']=new Array();
ModeSettings['text']['handler']="";
ModeSettings['text']['label']="Текст";
ModeSettings['text']['pos']={"padding-left":60,"width":214};
ModeSettings['studio']=new Array();
ModeSettings['studio']['handler']="";
ModeSettings['studio']['label']="Студия";
ModeSettings['studio']['pos']={"padding-left":65,"width":209};
SearchMode="";

function ListenSearchField(){
    var search_query=$( "#search_input" ).val();
    if(search_query.indexOf("user:")>-1) SetSearchMode("user");
    if(search_query.indexOf("keyword:")>-1) SetSearchMode("keyword");
    if(search_query.indexOf("studio:")>-1) SetSearchMode("studio");
    if(search_query.indexOf("text:")>-1) SetSearchMode("text");
}

function normalHtml(text){
    text = text.replace("&raquo;","»");
    text = text.replace("&laquo;","«");
    text = text.replace("&nbsp;"," ");
    return text;
}

function SetSearchMode(mode){
    SearchMode=mode;
    $('#SearchMode').val(mode);
    if(ModeSettings[mode]){
        if(ModeSettings[mode]['label']){
            if(!$("#search_label").length)
                $( "<div id='search_label'></div>" ).insertBefore( "#search_input" );
                var html= "<img onclick='SetSearchMode(\"\"); return false;' src='http://st.kp.yandex.net/images/bg_close_small.gif'>"+ ModeSettings[mode]['label']+":";
                $( "#search_input").addClass(mode+'Type');
                if(!ModeSettings[mode]['handler']){
                    $( "#search_input" ).autocomplete('close');
                    $( "#search_input" ).autocomplete('disable');
                    $( "#search_input" ).removeClass('ui-autocomplete-loading');
                } else {
                    $( "#search_input" ).autocomplete('enable');
                }
                $("#search_label").html(html).fadeIn('fast');
        } else {
        	var regexp = /\w+Type/;
            var modez = $("#search_input").prop('class').match(regexp);
            $("#search_label").fadeOut('fast');
            $("#search_input").removeClass(modez[0]);
        }
        $( "#search_input" ).val(trim($( "#search_input" ).val().replace(mode+":","")));
        $( "#search_input" ).animate( ModeSettings[mode]['pos'] );
    }
}

// поиск в шапке
$(function(){
    /* if (window.location.hostname=='deflo-dev.kinopoisk.ru')
        host='deflo-dev';
    else if (window.location.hostname=='ivan-dev.kinopoisk.ru' || window.location.hostname=='ivan-dev.kinopoisk.ua')
        host='ivan-dev';
    else
        host="www"; */

    if ($( "#search_input" ).length>0){
        $( "#search_input" ).autocomplete({
            source: function( request, response ) {
                allgray=false;
                lastquery=Math.random();
                lastrequest=(SearchMode?SearchMode+": ":"")+request.term;
                lastmode=SearchMode;

                $.ajax({
                    url: ModeSettings[SearchMode]['handler'],
                    dataType: "jsonp",
                    data: {
                        q: request.term,
                        query_id: lastquery,
                        type: "jsonp",
                        topsuggest: true
                    },
                    success: function(data) {
                        if(data.query_id && data.query_id!=lastquery){
                            data=lastresult;
                        }
                        
                        if (!data[0]) {
                        	Metrika.params({suggest_show: 'false'});
                        }

                        lastresult=data;
                        data.query_id=null;
                        count=0;
                        for(v in data)
                            if(data[v])
                                count++;

                        response( $.map( data, function( item,key ) {
                            if(count-1==key) item.last=true;
                            return item;
                        }));
                    }
                });
            },
            minLength: 2,
            open:  function(event, ui) {
                var that = this;
            	var metrikaData = {suggest_show: {'true': {}}};
            	var eventValue = event.target.value;
            	var eventValueLen = String(event.target.value.length);
                var eventIndex;
            	metrikaData.suggest_show.true[eventValueLen] = eventValue;

                $(".ui-menu-item a").on('mouseout',function(event){
                    eventIndex = String($(event.target).closest('li').index('.ui-menu-item') + 1);
                    that.metrika.eventIndex = eventIndex;
                });

                this.metrika = {
                    eventValue: eventValue,
                    eventValueLen: eventValueLen
                };

                Metrika.params(metrikaData);

            },
            position: { my: "left-3 top+2", at: "left bottom",},
            delay: 200,
            metrika: {},
            focus: function( event, ui ){
                if(event.keyCode > 0){
                    if(ui.item.name) label=ui.item.name;
                    if(ui.item.rus) label=ui.item.rus;
                    if(ui.item.login) label=ui.item.login;
                    $( "#search_input" ).val( normalHtml(label) );
                }
                return false;
            },
            select: function( event, ui ) {
                if(!ui.item.link) return false;
                top.location = (ui.item.link.indexOf('http') > -1 ? '' : 'http://'+host)+ui.item.link;
                if(ui.item.name) label=ui.item.name;
                if(ui.item.rus) label=ui.item.rus;
                if(ui.item.login) label=ui.item.login;
                $( "#search_input" ).val( normalHtml(label) );
                var eventValue = this.metrika.eventValue;
                var eventValueLen = this.metrika.eventValueLen;
                var eventIndex = this.metrika.eventIndex;
                var metrikaData = {suggest_click: {}};
                metrikaData.suggest_click[eventIndex] = {};
                metrikaData.suggest_click[eventIndex][eventValueLen] = {};
                metrikaData.suggest_click[eventIndex][eventValueLen][eventValue] = ui.item.id;
                Metrika.params(metrikaData);
                Metrika.reachGoal('visit_from_suggest');
                return false;
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item){
            if (lastmode != SearchMode) {
                return false;
            }
            var txt = '';
            if (item.type) {
                ul.append("<li class='ui-menu-item-other'><b class='category'>"+searchtypes[item.type]+"</b></li>");
            }
            if (item.type == 'cinema' || item.type == 'page' ) {
                allgray = true;
            } else if (item.type != '') {
                allgray = false;
            }

            switch (SearchMode) {
                case "user":{
                    txt+="<a href='"+(item.link.indexOf('http') > -1 ? '' : "http://"+host)+item.link+"'><span class='act allgray profile_name "+item.icon_class+"'><s></s>"+item.login+"</span><span class='fio'>"+item.fio+"</span></a>";
                    break;
                }
                case "keyword":{
                    txt+="<a href='"+(item.link.indexOf('http') > -1 ? '' : "http://"+host)+item.link+"'><span class='act allgray'>"+item.rus+"</span></a>";
                    break;
                }
                default:{
                    var param = new Array();
                    var allowed = 57;
                    if (item.type == 'first') {
                        allowed = 59;
                    }

                    if (item.rus.length > allowed) {
                        var reg = new RegExp('^(.{1,'+allowed+'})[^&#a-z0-9;]+', 'i');
                        var ar = reg.exec(item.rus+' ');
                        if (ar) {
                            item.rus2 = ar[1].replace(/\s$/, '');
                        } else {
                            item.rus2 = item.rus.substr(0, allowed);
                        }
                        item.rus2 += '...';
                    } else {
                        item.rus2 = item.rus;
                    }

                    if (item.name && item.name != item.rus) {
                        allowed -= item.rus2.length;
                        if (allowed > 1 && item.name.length > allowed) {
                            var reg = new RegExp('^(.{1,'+allowed+'})[^&#a-z0-9;]+', 'i');
                            var ar = reg.exec(item.name+' ');
                            if (ar) {
                                item.name = ar[1].replace(/\s$/, '');
                            } else {
                                item.name = item.name.substr(0, allowed);
                            }
                            item.name += '...';
                        } else if (allowed < 2) {
                            item.name = '';
                        } else {
                            item.name = item.name;
                        }
                        if (item.name.length && item.name != '...') {
                            param[param.length] = item.name;
                        }
                    }

                    if (item.is_serial && item.is_serial =='mini'){
                        param[param.length]="мини-сериал";
                    }
                    if (item.is_serial && item.is_serial =='serial'){
                        param[param.length]="сериал";
                    }
                    if (item.year && item.year != 0) {
                        param[param.length] = item.year;
                    }
                    var ur_rating = item.ur_rating;
                    if (item.ur_rating)  {
                        var ur_rating = "<b class='ratingGreyColor'>"+(item.ur_rating ? item.ur_rating : '')+"</b>"
                    }
                    if (item.ur_rating && item.ur_rating < 5)  {
                        var ur_rating = "<b class='ratingRedColor'>"+(item.ur_rating ? item.ur_rating : '')+"</b>"
                    }
                    if (item.ur_rating && item.ur_rating >= 7)  {
                        var ur_rating = "<b class='ratingGreenColor'>"+(item.ur_rating ? item.ur_rating : '')+"</b>"
                    }
                    if (item.ur_rating === 0)  {
                        var ur_rating = '<b class="rNone">&mdash;</b>'
                    }
                    txt +=
                        "<a href='"+(item.link.indexOf('http') > -1 ? '' : "http://"+host)+item.link+"'>"+
                            "<span class='act"+(allgray ? " allgray" : '')+(item.type == 'first' ? " bolder" : '')+"'>"+item.rus2+"</span>"+
                            (param.length > 0 ? " ("+param.join(", ")+")" : '')+(ur_rating ? ur_rating :'')+
                        "</a>";
                    break;
                }
            }

            ret=$( "<li></li>" )
                .data( "ui-autocomplete-item", item )
                .append( txt )
                .appendTo( ul );

            if (item.last) {
                var lastrequest_encode = encodeURIComponent(lastrequest);
                var html_last = "<span class='adds'><span href='#' class='auto-right' onclick='hideSuggest(); return false;'>убрать подсказки</span>"
                               +'<span class="auto-left" href="http://'+host+'/index.php?first=no&kp_query='+lastrequest_encode+'" onclick="top.location=\'http://'+host+'/index.php?first=no&kp_query='+lastrequest_encode.replace(/'/g, "\\'")+'\'; return false;">все результаты</span> &raquo;</span>';
                ul.append("<li class='ui-menu-item-other'>" + html_last + "</li>");
            }
            return ret;
        };
        $( "#search_input" ).autocomplete('widget').addClass('main-search-autocomplete');
        $( "#search_input" ).keyup(ListenSearchField);
        ListenSearchField();
        if($.cookie("hideSuggest"))
            $( "#search_input" ).autocomplete('disable');
        ListenSearchField();
    }

    // поиск в оценках
    if ($("#search_vote_input").length) {
        $("#search_vote_input").autocomplete({
            source: function(request, response){
                $('.searchLoader').show();
                $.ajax({
                    url: "http://"+host+"/handler_search.php",
                    dataType: "jsonp",
                    data: {
                        q: request.term,
                        votes: $("#search_vote_input").attr('uid')
                    },
                    success: function(data) {
                        $('.searchLoader').hide();
                        response($.map(data, function(item){
                            return item;
                        }));
                    }
                });
            },
            minLength: 2,
               delay: 500,
            select: function(event, ui){
                top.location = "http://"+host+"/film/"+ui.item.id+"/";
                $("#search_vote_input").val(ui.item.rus?ui.item.rus:ui.item.name);
                return false;
            },
            focus: function(event, ui){
                return false;
            },
            close: function() {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                return false;
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item){
            var param = new Array();
            var STRLEN_rus = 35;
            var STRLEN_en = 60;
            if (item.rus.length > STRLEN_rus)
                item.rus=item.rus.substr(0,STRLEN_rus) + "...";
            if (item.rus.length + item.name.length > STRLEN_en)
                item.name=item.name.substr(0,STRLEN_en-item.rus.length) + "...";

            if (item.name)
                param[param.length]=item.name;
            if (item.year)
                param[param.length]=item.year;
            var txt="";
            txt+="<a><b class='vote"+(item.vote > 0 ? "" : " seen")+"'>"+  (item.vote > 0 ? item.vote : "") +"</b><span class='act all'>" + item.rus +"</span>" + (param.length>0?" ("+param.join(", ")+")":"")+ "</a>";
            ret=$( "<li></li>" )
                .data( "ui-autocomplete-item", item )
                .append( txt )
                .appendTo( ul );

            return ret;
        };
        $( "#search_vote_input" ).autocomplete('widget').addClass('vote-search-autocomplete');
    }

    // пользователи в openid
    if ($( ".search_account" ).length){
        $( ".search_account" ).autocomplete({
            source: function( request, response ) {
                $.ajax({
                    url: "http://"+host+"/handler_search_login.php",
                    dataType: "json",
                    data: {
                        q: request.term
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
                            return item;
                        }));
                    }
                });
            },
            minLength: 2,
            select: function( event, ui ) {
                $('.search_user_field').hide();
                var image='http://st.kp.yandex.net';
                if(ui.item.image_sm!='')
                    image+=ui.item.image_sm;
                else
                    image='http://st.kp.yandex.net/images/users/user-no.gif'
                $('.found_user img').attr("src",image);
                $('.found_user p').get(0).classname='profile_name';
                $('.found_user .user_login,.external_ok .user_login').html(ui.item.login).attr("href","/level/79/user/"+ui.item.id+"/");
                $('.found_user p').get(0).className='profile_name';
                if(ui.item.icon_class)
                    $('.found_user p').addClass(ui.item.icon_class);

                if(!ui.item.icon_class) {
                        $('#login_f').val(ui.item.login)
                        $('.external_user').hide();
                        $('.internal_user').show();
                        $('#external_user').val('');
                } else {
                    $('.external_user').show();
                        $('#login_f').val('')
                        $('.internal_user').hide();
                        $('#external_user').val(ui.item.id);
                    }

                $('.found_user').show();
                ValidateNew();
                return false;
            },
        }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            txt="<a><span class='act profile_name "+item.icon_class+"'><s></s>" + item.login +"</span></a>";
            ret=$( "<li></li>" )
                .data( "ui-autocomplete-item", item )
                .append( txt )
                .appendTo( ul );
            return ret;
        };
        $( ".search_account" ).autocomplete('widget').addClass('openid-user-search-autocomplete');
    }

    initPsUserTo();
});

// ПС Пользователю
function initPsUserTo()
{
    if ($("#ps_user_to").length) {
        $("#ps_user_to").autocomplete({
            source: function(request, response){
                $.ajax({
                    url: "http://"+host+"/handler_search_login.php",
                    dataType: "json",
                    data: {
                        q: request.term
                    },
                    success: function( data ) {
                        $(".loader_in_fake").css('visibility','hidden');
                        response($.map(data, function(item){
                            return item;
                        }));
                    }
                });
            },
            minLength: 2,
            appendTo: ".fake_input",
            select: function(event, ui){
                $("#ps_user_to").val('');
                UsersInfo[ui.item.id] = ui.item;
                $('#ps_user_to_id').val($('#ps_user_to_id').val()+","+ui.item.id);
                reDrawUsers();
                return false;
            },
            search: function(){
                $(".loader_in_fake").css('visibility', 'visible');
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item){
            txt = "<a><span class='act profile_name "+item.icon_class+" "+(item.friend>0?"search_friend":"")+"'><s></s>" + item.login +"</span><span class='fio'>" + item.fio + "</span></a>";
            ret = $("<li></li>")
                .data("ui-autocomplete-item", item)
                .append(txt)
                .appendTo(ul);
            return ret;
        };
        $("#ps_user_to").autocomplete('widget').addClass('message-user-search-autocomplete');
        $("#div_send_mail #ps_user_to").autocomplete('widget').addClass('share-user-search-autocomplete');
    }

    $('#ps_user_to').bind('blur', function(){
        setTimeout(function(){
            if (current_mess_type=='email' || $('#ps_user_to').val()=='e-mail друга' || $('#ps_user_to').val()=='никнейм друга на КиноПоиске') {
                return;
            }
            if ($('#ps_user_to').val()) {
                var fuser = $('#ps_user_to').val();
                $.post('http://'+host+'/handler_search_login.php?targetsearch=1&timestamp='+Math.round(Math.random()*1000000000), {"q":$('#ps_user_to').val()}, function(dat){
                    if (dat[0] && dat[0].login) {
                        data=dat[0];
                        UsersInfo[data.id]=data;
                        $('#ps_user_to_id').val($('#ps_user_to_id').val()+","+data.id);
                        reDrawUsers();
                    } else {
                        alert("Пользователь <b>"+fuser+"</b> не найден");
                    }
                }, "json");
                $('#ps_user_to').val('');
            }
        }, 150);

        return true;
    });
}

function removePsUserTo()
{
    $("#ps_user_to").autocomplete('destroy');
}

function parseJSON(data)
{
    try {
        return window.JSON.parse(data);
    } catch (e) {
        try {
            return eval("("+data+")");
        } catch (e) {

        }
    }
    return null;
}

function dump(o) {
    for (var a in o) {
        if (typeof o[a] === 'object') {
            document.writeln(a + ':');
            dump(o[a]);
        } else {
            document.writeln(a + ' = ' + o[a]);
        }
    }
}


var UsersInfo=new Array();
function reDrawUsers()
{
    var users=new Array();
    var active_users='';
    var active_user_list=new Array();
    var active_users_html=new Array();

    if ($('#ps_user_to_id').val())
        users=$('#ps_user_to_id').val().split(",");

    var uk=0;
    for(var uin in users)
    {
        var uid=users[uin];
        if(!uid||active_user_list[uid]||!UsersInfo[uid])
            continue;

        uk++;

        if(uk>5) {
            alert("Вы можете отправить сообщение не более 5-ти получателям");
            continue;
        }

        active_users+=uid+",";

        active_user_list[uid]=uid;
        active_users_html[active_users_html.length]="<li><p class='profile_name "+(UsersInfo[uid].icon_class?UsersInfo[uid].icon_class:"")+"'><s></s>"+UsersInfo[uid].login+" <img src='http://st.kp.yandex.net/images/bg_close_small.gif' onclick='deleteUser("+uid+");  return false;'></a></p></li>";
    }

    $('#ps_user_to_id').val(active_users);

    if(!$('#ps_user_to_id').val()) {
        if($('#btn_submit').get(0))
            $('#btn_submit').get(0).disabled=true;
        if($('.send').get(0))
        $('.send').get(0).disabled=true;
    } else {
        if($('#btn_submit').get(0))
            $('#btn_submit').get(0).disabled=false;
        if($('.send').get(0))
        $('.send').get(0).disabled=false;
    }
    $('.active_user_list').html(active_users_html.join(""));
}

function deleteUser(id)
{

    $('#ps_user_to_id').val($('#ps_user_to_id').val().replace(id,""));
    reDrawUsers();
}


function hideSuggest(){
    $.cookie("hideSuggest",1,{path:"/",domain:'kinopoisk.ru',expires:30});
    $( "#search_input" ).autocomplete('close');
    $( "#search_input" ).autocomplete('disable');
    if(typeof(noalertforsuggest)=='undefined')
        alert("Подсказки скрыты. Вы можете включить их на странице результатов поиска.");
}

function showSuggest(){
    $.cookie("hideSuggest",null,{path:"/",domain:'kinopoisk.ru',expires:0});
    $( "#search_input" ).autocomplete('enable');
	$.cookie("hideSuggest",null,{path:"/",domain:'kinopoisk.ru',expires:0});
	$.cookie("hideSuggest",null,{path:"/",domain:'mykp.ru',expires:0});
    $( "#search_inputex" ).autocomplete('enable');
    // $( "#search_input" ).autocomplete('search',$( "#search_input" ).val());
}
function trim(s) {
  s = s.replace( /^\s+/g, '');
  return s.replace( /\s+$/g, '');
}
$(function(){
    $("#search_input, #search_inputex").on('keypress',function(event){
        if (event.keyCode==13 && !$(this).val()) {
            return false;
        }
    });
});