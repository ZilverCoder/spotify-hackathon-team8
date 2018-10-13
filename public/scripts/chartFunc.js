var ctx = document.getElementById("myChart").getContext("2d");

var cloud = new Image();
cloud.src = 'https://i.ytimg.com/vi/pQMyOFHhS2k/hqdefault.jpg';
cloud.height = 150;
cloud.width = 150;

var current = new Date();
var past = current.setFullYear(1853);
var newPoint = current.setFullYear(1975);

var testArray = [];
var albumForChart = [];

var data = $.get(`spotify/get-album-data-for-artist?artistId=0oSGxfWSnnOXhD2fKuz2Gy`, function(data) {
	// "Data" is the object we get from the API. See server.js for the function that returns it.
	console.group('%cResponse from /search-track', 'color: #F037A5; font-size: large');
	console.log(data);
	console.groupEnd();
	$.each(data, function(index, track){
		testArray.push(new Album(track.releaseDate, track.images, track.features.valence, track.name));
		albumForChart.push(new AlbumForChart(track.releaseDate, this.features.valence));
	});
});

function Album(year, imageObject, attr, title){
	this.year = year;
	this.imgUrl = imageObject.src;
	this.imageObj = imageObj(imageObject);
	this.attr = attr.toFixed(2);
	this.title = title;
}

function imageObj(imgUrl){
	var temp = new Image();
	temp.src = imgUrl[1].url;
	temp.height = 150;
	temp.width = 150;
	return temp;
}

function AlbumForChart(year, attr, img){
	this.x = year;
	this.y = attr.toFixed(2);
}

$.when(data).done(function(){
	//#region Custom Tooltip
		var customTooltips = function(tooltip) {
			
			// Tooltip Element
			var tooltipEl = $('#album')[0];
			var albumCover = $('.info--cover');
			var albumTitle = $('.info--title');
			//IF ELEMENT DOES NOT EXIST
			/*if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'album';
				tooltipEl.innerHTML = '<div></div>';
				this._chart.canvas.parentNode.appendChild(tooltipEl);
			}*/

			// Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			// Set Text
			if (tooltip.body) {
				var titleLines = tooltip.title || [];
				var bodyLines = tooltip.body.map(getBody);
				
				titleLines.forEach(function(title) {
					testArray.forEach(album =>  {
						
						if (album.year == tooltip.title) {
							albumTitle.text(album.title);
							$('.album--cover').css('background','url('+album.imageObj.src+')');
						}
					})
				});

				bodyLines.forEach(function(body, i) {
					/*var colors = tooltip.labelColors[i];
					var style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px';
					var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
					innerHtml += '<div>' + span + body + '</div>';*/
					//console.log(body);
				});

				/*var tableRoot = document.getElementsByClassName('album');
				tableRoot.innerHTML = innerHtml;*/
			}

			var positionY = this._chart.canvas.offsetTop;
			var positionX = this._chart.canvas.offsetLeft;

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.left = positionX + tooltip.caretX - 100 + 'px';
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			//tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
			//tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
			//tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
			//tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
		};
	//#endregion
	albumForChart.sort(function(a, b) {
		var nameA = a.x;
		var nameB = b.x;
		if (nameA < nameB) {
		  return -1;
		}
		if (nameA > nameB) {
		  return 1;
		}
		return 0;
	});
	Chart.defaults.global.defaultFontColor = "#fff";
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: ['Album 1', 'Album 2', 'Album 3'],
			datasets: [{
				data: albumForChart,
				backgroundColor: 'rgba(0, 0, 0, 0)',
				borderColor: 'rgba(255,99,132,1)',
				//pointStyle: testArray[0].imageObj,
				pointHoverBorderColor: '#000',
				hitRadius: 15,
				//pointRadius: 80,
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0,
						max: 1,
						yAxisID: 'happines-index'
					},
				}],
		
				xAxes: [{
					type: 'time',
					distribution: 'linear'
				}]
			},
			tooltips: {
				// Disable the on-canvas tooltip
				enabled: false,
				mode: 'index',
				position: 'nearest',
				custom: customTooltips
			
			}
		}		
		});
});

