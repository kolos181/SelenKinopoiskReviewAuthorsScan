function about_critic()
{
var critic = '<table style=\'text-align: left\' bgcolor=\'#ffffff\' cellpadding=0 cellspacing=0 border=0>' +
'<tr><td>' +
'<table width=100% bgcolor=\'#ffffff\' cellpadding=0 cellspacing=0 border=0>' +
'<tr><td valign=top>' +
'<img src=\'/images/logonew2.gif\' vspace=15 hspace=20 width=210 height=55 alt=\'������� ������������\'>' +
'</td><td width=50% align=right style=\'padding-right:20px\'><input type=\'button\' value=\'�������\' style=\'width:120px\' onclick=\'javascript:close_alert_window(); return false;\'></td></tr><tr><td height=50 colspan=2>' +
'<H2 class=\'chapter\' style=\'font:100 25px tahoma,verdana;padding-top:10px;padding-left:25px;border-top:1px solid #ccc\'>������� ������������</H2>' +
'</td></tr>' +
'<tr><td colspan=2 valign=top style=\'padding:0px 5px 0px 25px\' class=\'news\'><br><br>' +
'<h3 style=\'font-weight:100;color:#007\'>��������</h3>' +
'������� ������������ &mdash; ��� ��������� ����� ������������� �������� �� ����� � ������ ����� ��������. ' +
'������� ������������ ���������� � ���������:<br><br>' +
'<img src=\'/images/rotten.gif\' width=399 height=76 style=\'border:1px solid #ccc\'><br><br>' +
'������� ������������ ������� �� ���������, ����������� �� ������������ ����� ' +
'<a href=\'http://www.rottentomatoes.com/\' class=\'all\' style=\'color:#555\' target=\'_blank\'>rottentomatoes.com</a>. ' +
'������� ������ ������� ���������� ������ ������, ��������� � ������������ �����������.' +
'<br><br><br><h3 style=\'font-weight:100;color:#007\'>��� �������� ��� ��� �����?</h3>' +
'<img src=\'/images/rotten2.gif\' width=431 height=247 style=\'border:1px solid #ccc\'><br><br>' +
'��� �������-������� ������� ����������� � ���������� ������.'+ '<br /><center><input class="button" type="button" style="margin:20px;" value="�������" onclick="javascript:close_alert_window(); return false;"/></center>' +
'</td></tr>' +
'</table>' +
'</td></tr>' +
'</table>';
alert_popup(critic, 'popup_div', 800, ($(window).height()/100)*80);
}