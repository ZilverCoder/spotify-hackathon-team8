var ctx = document.getElementById("myChart").getContext("2d");

var cloud = new Image();
cloud.src = 'https://i.ytimg.com/vi/pQMyOFHhS2k/hqdefault.jpg';
cloud.height = 150;
cloud.width = 150;

var allAlbumsArray = [];
var albumsForChart = {};

var data = $.get(`spotify/get-album-data-for-artist?artistId=2piHiUbXwUNNIvYyIOIUKt`, function(data) {
	// "Data" is the object we get from the API. See server.js for the function that returns it.
	console.group('%cResponse from /search-track', 'color: #F037A5; font-size: large');
	console.log(data);
	console.groupEnd();
	$.each(data, function(index, album){
		allAlbumsArray.push(new Album(album.releaseDate, album.images, album.features, album.name));
		for (var feature in album.features) {
			if (["loudness", "tempo", "key"].includes(feature)) {
				continue;
			}
			try {
				albumsForChart[feature].length
			} catch (TypeError) {
				albumsForChart[feature] = [];
			}
				
			albumsForChart[feature].push(new AlbumForChart(album.releaseDate, album.features[feature], feature));
		}
	});
});

function Album(year, imageObject, features, title){
	this.year = year;
	this.imgUrl = imageObject.src;
	this.imageObj = imageObj(imageObject);
	this.features = features;
	this.title = title;
}

function imageObj(imgUrl){
	var temp = new Image();
	temp.src = imgUrl[1].url;
	temp.height = 150;
	temp.width = 150;
	return temp;
}

function AlbumForChart(year, feature, label){
	this.x = year;
	this.y = feature.toFixed(2);
	this.label = label;
}

$.when(data).done(function(){
	//#region Custom Tooltip
		var customTooltips = function(tooltip) {
			
			// Tooltip Element
			var tooltipEl = $('#album')[0];
			var albumCover = $('.info--cover');
			var albumTitle = $('.info--title');
			var subtext = $('.info--subtext');
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
					allAlbumsArray.forEach(album =>  {
						
						if (album.year == tooltip.title) {
							albumTitle.text(album.title);
							$('.album--cover').css('background','url('+album.imageObj.src+')');
							$('.album--cover').css('background-origin','content-box');
							$('.album--cover').css('background-size','cover');
							
							for (var feature in album.features) {
								// add features to table 
								// album.features[feature] ...
							}
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
	for(var feature in albumsForChart) {
		albumsForChart[feature].sort(function(a, b) {
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
	}

	var colors = {
		"danceability": "#FF0000",
		"energy": "#CC6600",
		"mode": "#00CC00",
		"speechiness": "#00CCCC",
		"acousticness": "#0000CC",
		"instrumentalness": "#6600CC",
		"liveness": "#CC00CC",
		"valence": "#CC0066",
	};

	var chartDatasets = [];

	for (var feature in albumsForChart) {
		console.log(albumsForChart[feature]);
		chartDatasets.push({
			data: albumsForChart[feature],
			label: feature,
			backgroundColor: 'rgba(0, 0, 0, 0)',
			borderColor: colors[feature],
			pointHoverBorderColor: '#000',
			hitRadius: 15
		});
	}
	console.log(Object.keys(albumsForChart));
	Chart.defaults.global.defaultFontColor = "#fff";
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			//labels: Object.keys(albumsForChart),
			datasets: chartDatasets
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0,
						max: 1,
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
