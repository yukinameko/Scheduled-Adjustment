var selectedFlag = false;
var selectedDay = [null, null];
$(() => {
	(()=>{
		var now = new Date();
		var year = now.getFullYear();
		var mon = now.getMonth()+1;
		var day = now.getDate();
		var you = now.getDay();

		youbi = ["日","月","火","水","木","金","土"];
		youbi_color = ["ff0000","","","","","","0000ff"];

		fday = new Date(year+"/"+mon+"/1");
		fyou = fday.getDay();
		var month_day = [31,28,31,30,31,30,31,31,30,31,30,31];
		if ((year%4 == 0 && year%100 != 0) || (year%400 == 0)) {month_day[1]++;}

		$('table').append(() => {
			var str = "<tr><th colspan='7'>"+year+"年"+mon+"月</th></tr>";
			str += "<tr>";
			for (var m = 0; m < 7; m++){
				str += "<th><font color='" + youbi_color[m] + "'>" + youbi[m] + "</font></th>";
			}
			str += "</tr>";
			for (var n = 0; n < 6; n++) {
				var s = "<tr>";
				for (var m = 0; m < 7; m++){
					d = (n*7+m+1-fyou);
					if (day == d){
						s += "<td align='right' bgcolor='#ffaaaa'  class='day'>";
					}else{
						s += "<td align='right' class='day'>";
					}
					if (d > 0 && d <= month_day[mon-1]){
						s += "<font color='" + youbi_color[m] + "'>" + d + "</font>";
					}else{
						s += "&nbsp;";
					}
					s += "</td>";
				}
				str += s + "</tr>";
				if (d >= month_day[mon-1]) break;
			}
			return str;
		});
	})();

	var data = null;
	var startDayTag = $('d[name="start"]')[0];
	var endDayTag = $('d[name="end"]')[0];
	var titleTag = $('#title')[0];
	var passTag = $('#pass')[0];
	var textTag = $('textarea')[0];

	startDayTag.innerHTML = '0';
	endDayTag.innerHTML = '0';
	$('font').css({'pointer-events': 'none'});
	$('.day').on('click', (e) => {
		var d = e.target.childNodes[0].innerHTML|0;
		if(selectedFlag){
			selectedDay[1] = d;
			if(selectedDay[0] > selectedDay[1]){
				[selectedDay[0], selectedDay[1]] = [selectedDay[1], selectedDay[0]]
			}
			startDayTag.innerHTML = selectedDay[0];
			endDayTag.innerHTML = selectedDay[1];

			data = $('.day').find('font').map((i, v) => {
				var d = v.innerHTML;
				if(selectedDay[0] <= d && d <= selectedDay[1]){
					// v.backgroundColor = '0f0f0f';
					return v;
				}
			});
			data.parent().css({ 'background-color' : 'Lime'});
			console.log(data.parent());
		}else{
			if(selectedDay[0] != null){
				data.parent().css({'background-color':'White'});
				endDayTag.innerHTML = '0';
			}
			selectedDay[0] = d;
			selectedDay[1] = null;
			startDayTag.innerHTML = d;
			console.log(e.target.innerHTML);
		}
		selectedFlag = !selectedFlag;
	});
	$('#enter').on('click', (e) => {
		if(titleTag.value == '' || passTag.value == '' || selectedDay[1] == null){
			alert('タイトルやパスワード，候補日を入力してください');
			return;
		}
		if(!selectedFlag && selectedDay[0] != null){
			var json = {};
			json.month = mon;
			json.date = selectedDay;
			json.day = (fyou + selectedDay[0] - 1) % 7;
			json.datalist = [];
			json.title = titleTag.value;
			json.pass = passTag.value;
			json.text = textTag.value;
			var setJson = JSON.stringify(json);
			localStorage.setItem('data', setJson);
			window.location.href = 'gui-user.html';
		}
	});
});