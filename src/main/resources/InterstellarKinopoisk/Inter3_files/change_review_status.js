function change_review_status(id_mess, new_status)
{
    var now = new Date();

    $('#change_status_ajax_star_'+id_mess).css('visibility', 'visible');

    $.get(
        '/handler_change_review_status.php',
        {id_mess: id_mess, new_status: new_status, rnd: now.getTime()},
        function(data)
        {
            $('#change_status_ajax_star_'+id_mess).css('visibility', 'hidden');

            if (data == 'success') {
                if (new_status == 'good') {
                    $('#li_good_'+id_mess).css('display', 'block');
                    $('#li_good_'+id_mess+'_a').css('display', 'none');

                    $('#li_bad_'+id_mess).css('display', 'none');
                    $('#li_bad_'+id_mess+'_a').css('display', 'block');

                    $('#li_neutral_'+id_mess).css('display', 'none');
                    $('#li_neutral_'+id_mess+'_a').css('display', 'block');
                }

                if (new_status == 'bad') {
                    $('#li_good_'+id_mess).css('display', 'none');
                    $('#li_good_'+id_mess+'_a').css('display', 'block');

                    $('#li_bad_'+id_mess).css('display', 'block');
                    $('#li_bad_'+id_mess+'_a').css('display', 'none');

                    $('#li_neutral_'+id_mess).css('display', 'none');
                    $('#li_neutral_'+id_mess+'_a').css('display', 'block');
                }

                if (new_status == 'neutral') {
                    $('#li_good_'+id_mess).css('display', 'none');
                    $('#li_good_'+id_mess+'_a').css('display', 'block');

                    $('#li_bad_'+id_mess).css('display', 'none');
                    $('#li_bad_'+id_mess+'_a').css('display', 'block');

                    $('#li_neutral_'+id_mess).css('display', 'none');
                    $('#li_neutral_'+id_mess+'_a').css('display', 'none');
                }

                $('#div_review_'+id_mess)
                    .removeClass()
                    .addClass('response '+new_status);
            } else {
                //alert('������: '+data);
            }
        }
    ).fail(function(){
        $('#change_status_ajax_star_'+id_mess).css('visibility', 'hidden');
        alert(unavailableMessage);
    });
}

var spoiler_text = [];
var spoiler_open = [];

function clearSelect(id_mess)
{
    spoiler_text['spoiler_'+id_mess] = '';
}
function getSelect(id_mess)
{
    if (document.getSelection) {
        spoiler_text['spoiler_'+id_mess] = ''+document.getSelection().toString();
    } else if (document.selection && document.selection.createRange) {
        var range = document.selection.createRange();
        spoiler_text['spoiler_'+id_mess] = ''+range.text;
    } else {
        spoiler_text['spoiler_'+id_mess] = '';
    }

    if (spoiler_open['spoiler_'+id_mess] == 'show' && document.getElementById('spoiler_textarea_'+id_mess).value == '') {
        document.getElementById('spoiler_textarea_'+id_mess).value = spoiler_text['spoiler_'+id_mess];
    }
}

function OpenSpoiler(id_mess)
{
    spoiler_open['spoiler_'+id_mess] = 'show';
    if (typeof(spoiler_text['spoiler_'+id_mess]) == 'undefined') {
        spoiler_text['spoiler_'+id_mess] = '';
    }
    document.getElementById('spoiler_textarea_'+id_mess).value = spoiler_text['spoiler_'+id_mess];
    $('#spoiler_txt_'+id_mess).show('slow');
}

function CloseSpoiler(id_mess)
{
    spoiler_open['spoiler_'+id_mess] = '';
    $('#spoiler_txt_'+id_mess).hide('slow');
}

function VoteSpoiler(id_mess)
{
	var str=$('#spoiler_textarea_'+id_mess).get(0).value;
	if(str.length==0) {alert('����������, ������� �������� ��������, ���������� �������');return false;}
	if(str.length<50) {alert('��������� �������� ������� ��������');return false;}
	else{
	$.post(
        '/handler_comment.php',
        {comment: id_mess, is_spoiler: 1,spoiler_txt:str, rnd: Math.random()},
        function(data)
            {
                if(data=='auth_error')
                    alert('��� ����� ���������� <a href="/level/30/" class="all">��������������...</a>');
                if(data=='ok'){
                	$('#spoiler_textarea_'+id_mess).get(0).value='';
                	CloseSpoiler(id_mess);
                	alert('<center>�������! ������������� ������� �������� �� ��� ��������.</center>');

                	}
	        }
        ).fail(function(){
            CloseSpoiler(id_mess);
            alert(unavailableMessage);
        });
    }
}