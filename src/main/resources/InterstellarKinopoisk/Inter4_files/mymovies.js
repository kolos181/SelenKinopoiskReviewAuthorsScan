var request_mustsee;

function mustsee(mode, id_film, to_folder)
{
    old_content = $('#div_mustsee_main').html();

    // ��������
    $('#div_mustsee_main').html(
        '<div class="add_my remove_my add_my_img" id="img_mustsee">' +
            '<u></u>' +
            '<div></div>' +
        '</div>'
    );

    var now = new Date();

    $.get(
        '/handler_mustsee.php',
        {mode: mode, id_film: id_film, rnd: now.getTime(), to_folder: to_folder},
        function (data)
        {
            if (data == 'is_guest') {
                alert('��� ������������� ������� &laquo;��� ������&raquo; ���������� <a href="/level/30/" class="all">��������������...</a>');
            } else if (data.indexOf('<!-- impossibleAlert:') > 1) {
                alert(
                    '�� ���������� ����� � �����, � ������� �� ����� ��������� ��������� ������.<br />'+
                    '�������� ����� ����� �������� � ������� <a href="/level/78/movies/list/type/'+to_folder+'/" class="all">��� ���������</a>.'
                );
                $('#div_mustsee_main').html(old_content);
            } else {
                $('#div_mustsee_main').html(data);
            }
        }
    ).fail(function(){
        alert("��������� ������. ���������� �����.");
    });
}


function delFromFolder(id_film, folder)
{
    if (!id_film || !folder) {
        return false;
    }

    $.get(
        '/handler_mustsee.php',
        {mode: 'del_film', id_film: id_film, from_folder: folder},
        function (data, status)
        {
            mustsee('id_film', id_film);
        }
    ).fail(function(){
        alert("��������� ������. ���������� �����.");
    });
}


function help_my_movies()
{
var txt = '<table  bgcolor="#ffffff" cellpadding=0 cellspacing=0 border=0>' +
'<tr><td valign=top style="color:#444">' +
'<img src="/images/logonew2.gif" vspace=15 hspace=25 width=210 height=55 alt="���������� ������ �� ����������">' +
'</td><td width=50% style="text-align: right; padding-right:20px"><input style="width: 120px; text-align: center" type="button" value="�������" onclick="javascript:close_alert_window(); return false;"></td></tr><tr><td colspan=2 height=50>' +
'<H2 class="chapter" style="font-size:14px;padding:5px;padding-left:25px;border-bottom:1px solid #ccc;border-top:1px solid #ccc">&laquo;��� ������&raquo; &mdash; ������ ����������</H2>' +
'</td></tr>' +
'<tr><td colspan="2" valign=top style="padding:0px 10px 0px 25px" class="news"><br />' +
'����������� ����� ������ ��� ������������� ���������� ����� �������� ��������� ������� &#151; ������ <span style="color:#f00">&laquo;��� ������&raquo;</span> ��������� ������� �� ����������� &laquo;��� �����&raquo;, �� ���������� ���� ������&#133;<img src="/images/movies/help_button.jpg" width=147 height=56 align=right vspace=20 hspace=10 style="border:5px solid #dfdfdf"><br /><br />' +

'� ������� ������� ������� ������ ���������� ���������� ����� ��������� � ���� ������������ ������� ����� �� �������, ������������� ��� �� �����. ��� ����� ���������� ������ ������� ����� �� ����������� ������, ������� ������������� �� �������� ������� ������ ����� ��� ��������.<img src="/images/movies/help_folders.gif" width=153 height=118 align=left vspace=20 style="margin-right:20px;border:5px solid #dfdfdf"><br /><br />' +

'����� ��������� ������ ����� ����� ������������ <span style="color:#f00">�� ������� ������</span>, ��������: <i>���������� � ����, ������ �� DVD, ����� � �������, ������� � ���������</i> � �.�&#133; ���������� � ������������ ����� ���������� ������ ��������� ��������� �������. ���������� ����� ����� ������������ �������, ��������������� � ������� �� ���������, ���� <span style="color:#f00">��������� ���� ���������� �����</span> (��������: <i>&laquo;������, �������� ������ ���� �������&raquo;</i>).<img src="/images/movies/help_onoff2.gif"  align=right vspace=20 hspace=10 style="border:5px solid #dfdfdf" width=126 height=66><br /><br />' +

'����� ����� ����� ������� <span style="color:#f00">��������� ��� ����</span> �������������, ���� �������� <span style="color:#f00">�������</span> �� ����� ����. ��������, �� ������ ������� 10 ������� ������� � ����� <i>&laquo;���� � ������� �� ���� ��������&raquo;</i>, � ������� ������ �� ��� ����� ���������/�������/����/����&#133; ������ �� ����������� � ����������� &#151; ����� ��������� ������� �� ��������� ����������� ������ ������&#133;<br /><br />' +

'����� �� �������� �� ������ ����������� ����� ������ � ����� ������� <i>������/������ ������� ���� ������ � �������</i>; ' +
'��� �� ������� �������, ������� ����� � ������ ������ ���������&#133;<br /><br />' +

'����� �������� ����� � �������� ������ ���� ����������� ����������� �������� �� ��������� ������. �� �������� � <i>������ ������</i>, ������ ���� ����������� ������������ �������������� ���������� <span style="color:#f00">���� �������� �� ��������� ������</span>. ��������, � ��������� ����� ����� ������� ��� �������� �� ������ ���� �������, ��� ��� �������� �� ���������� �����, ��� ��� �������� �� ������ �� �������� ���-250 � �.�&#133;<br /><br />' +

'����� ������ ���� ����������� ����������� �� ���������� ������������ �� ���� ������� �� ����� ����� �����. ��������, �� ������� ��� ���� ����� ������� ������ � ����� <i>&laquo;������ �� ������&raquo;</i>. ������ ����� ���� ���� � ����� <span style="color:#f00">�������� �� ����������</span> � ������ <nobr>��-���������</nobr>, �� ������ ������� �� ���������� ������������� ������ ���� �������. ��������� ������� �������� �� ���� ��������������� ������� �� �����.<br /><br />' +

'��� ����� ����� ����� � �������� ����� ���������� ������ ��������, ��� ������� �� �� ����� ������������� ��������� ��� ��������� ��� ������������� ���� ������.<br /><br />' +

'������ <i>&laquo;��� ������&raquo;</i> �������� ������ ��� <a href="/level/30/" class="all" target="_blank">������������������ �������������</a> ����������.' +

'<br /><br />'+'<center><input class="button" type="button" style="margin:20px;" value="�������" onclick="javascript:close_alert_window(); return false;"/></center>' +'</td></tr></table>';
alert_popup(txt, 'popup_div', 800, ($(window).height()/100)*80);
}
