$(() => {
	var json = localStorage.getItem('data');
	var data = JSON.parse(json);
	console.log(data);
	var table;
	var timeTable = '';
	var select = {};
	var bestTime = 0;
	var passTag = $('#pass')[0];
	select.date = null;
	select.time = null;
	timedata = Array.from(new Array(data.date[1] - data.date[0] + 1)).map(() => {return {start:null, end:null}; });

	$('#title')[0].value = data.title;
	$('textarea')[0].value = data.text;

	(allTable = $('#allList').append('<table border="1">').find('table')).append(() => {
		var li = '';
		$.each(data.datalist, (index, val) => {
			li += '<th>' + val.name + '</th>';
		});
		return '<tr><th>日付</th>' + li + '<th>開催可能時間</th></tr>';
	});

	(table = $('#list').append('<table border="1">').find('table')).append(() => {
		var li = '';
		for(var i = 0; i < 13; i++){
			li += '<th>' + (12+i) + '時</th>';
			timeTable += '<th class="time" value="'+i+'"></th>'
		}
		return '<tr><th>日付</th>' + li + '</tr>';
	});
	for(var i = data.date[0]; i <= data.date[1]; i++){
		table.append(() => {
			return '<tr class="date" value="'+i+'"><th>'+data.month+'月'+i+'日</th>'+timeTable+'</tr>';
		});
		allTable.append(() => {
			var li = '';
			var min = -1;
			var max = 13;
			$.each(data.datalist, (index, val) => {
				var s = val.list[i - data.date[0]].start;
				var e = val.list[i - data.date[0]].end;
				if(s == null){
					li += '<th>❌</th>';
					min = 100;
				}else{
					if(e-s < 3)
						li += '<th>🔺</th>'
					else
						li += '<th>⭕️</th>';
					if(min < s)
						min = s;
					if(max > e)
						max = e;
				}
			});
			var t = (min > max)?0:max-min+1;
			if(bestTime < t){
				bestTime = t;
			}
			return '<tr><th>'+data.month+'月'+i+'日</th>'+li+'<th class="possibleTime">'+t+'</th></tr>';
		});
	}

	(() => {
		var bestCells = allTable.find('.possibleTime').map((i, v) => {
			if(v.innerHTML == bestTime)
				return v;
		});
		bestCells.css({ 'background-color' : 'Lime'});
	})();

	$('.date').on('click', (e) => {
		var date = e.currentTarget.attributes[1].value|0;
		var stime = e.target.attributes[1].value|0;
		if(select.date == date){
			if(select.time < stime)
				[select.time, stime] = [stime, select.time];
			timedata[date - data.date[0]].start = stime;
			timedata[date - data.date[0]].end = select.time;
			var va = $('.date[value = "'+date+'"]').find('.time').map((i, v) => {
				var val = v.attributes[1].value;
				if(stime <= val && val <= select.time){
					return v;
				}
			});
			va.css({ 'background-color' : 'Lime'});
			select.date = null;
			console.log(timedata);
		}else{
			select.date = date;
			select.time = stime;
		}
	});

	$('#enter').on('click', (e) => {
		if(passTag.value != data.pass){
			alert('パスワードが違います');
			return;
		}
		var username = $('#name')[0].value;
		var index = -1;
		$.each(data.datalist, (i, val) => {
			if(val.name == username){
				index = i;
				return;
			}
		});
		if(index != -1)
			data.datalist[index].list = timedata;
		else
			data.datalist.push({name:username, list:timedata});
		var setJson = JSON.stringify(data);
		localStorage.setItem('data', setJson);
		window.location.href = 'gui-user.html';
	});

	$('#check').on('click', (e) => {
		var username = $('#name')[0].value;
		var index = -1;
		$.each(data.datalist, (i, val) => {
			if(val.name == username){
				index = i;
				return;
			}
		});
		if(index != -1){
			var datalist = data.datalist[index].list;
			timedata = datalist;
			var userdate = $('.date').map((i, v) => {
				var usertime = [];
				var starttime = datalist[i].start;
				var endtime = datalist[i].end;
				if(starttime == null)return;
				console.log(starttime, endtime);
				v.childNodes.forEach((val, ind, ar) => {
					var attribute = val.attributes;
					if(attribute.length == 0)return;
					var tdata = attribute.value.value;
					if(starttime <= tdata && tdata <= endtime){
						usertime.push(val);
					}
				});
				return usertime;
			});
			userdate.css({ 'background-color' : 'Lime'});
		}
	});
});