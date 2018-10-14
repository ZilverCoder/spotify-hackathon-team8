var ctx = document.getElementById("myChart").getContext("2d");

var cloud = new Image();
cloud.src = 'https://i.ytimg.com/vi/pQMyOFHhS2k/hqdefault.jpg';
cloud.height = 150;
cloud.width = 150;

let urlParams = new URLSearchParams(window.location.search);
let myParam = urlParams.get('artistId');

var allAlbumsArray = [];
var albumsForChart = {};

var data = $.get(`spotify/get-album-data-for-artist?artistId=${myParam}`, function(data) {
	// "Data" is the object we get from the API. See server.js for the function that returns it.
	/*console.group('%cResponse from /search-track', 'color: #F037A5; font-size: large');
	console.log(data);
	console.groupEnd();*/

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

var icons = {
	"danceability": "💃🏽",
	"energy": "⚡",
	"popularity": "⭐",
	"mode": "🎶",
	"speechiness": "🗨️",
	"acousticness": "🎻",
	"instrumentalness": "🎸",
	"liveness": "🎤",
	"valence": "😊",
	"tempo": "🥁",
	"loudness": "🔊",
	"key": "🔑"
}

$.when(data).done(function(){
	//#region Custom Tooltip
		var customTooltips = function(tooltip) {
			if (tooltip.opacity > 0) {
				$("#artist-image-header").hide();
			} else {
				$("#artist-image-header").show();
			}
			// Tooltip Element
			var tooltipEl = $('#album')[0];
			var albumTitle = $('.album--title');
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
							albumTitle.empty();
							albumTitle.append(album.title);
							albumTitle.append("<br>");
							albumTitle.append(album.year);
							$('.album--cover').css('background','url('+album.imageObj.src+')');
							$('.album--cover').css('background-origin','content-box');
							$('.album--cover').css('background-size','cover');
							var featureText = "";
							if (album.features.popularity < 1 ) {
								album.features.popularity *= 100;
							}
							subtext.empty();
							for (var feature in album.features) {
								//featureText += icons[feature] + "(" + feature + "): " + 
								//album.features[feature].toFixed(2) + "\n";
								subtext.append( "<li>" + icons[feature] + "(" + featureNames[feature] + "): " + 
								album.features[feature].toFixed(2) + "</li>");
								
								//"<p>Test</p>" 
							}							
							//subtext.text(featureText);
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
			//tooltipEl.style.left = positionX + tooltip.caretX - 100 + 'px';
			//tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			//tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
			//tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
			//tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
			//tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
		};
	//#endregion

	//#region Legend
	//var defaultLegendClickHandler = Chart.defaults.global.legend.onClick;
	var newLegendClickHandler = function (e, legendItem) {
		var index = legendItem.datasetIndex;
		var ci = this.chart;
		var meta = ci.getDatasetMeta(index);

		// See controller.isDatasetVisible comment
		meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

		// We hid a dataset ... rerender the chart
		ci.update();
		//defaultLegendClickHandler(e, legendItem);
		console.log(legendItem);
	};
	//#endregion
	//#region Color Fun
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
			"popularity": "#FFFF00",
			"mode": "#00CC00",
			"speechiness": "#00CCCC",
			"acousticness": "#D7D7ff",
			"instrumentalness": "#6600CC",
			"liveness": "#CC00CC",
			"valence": "#CC0066",
		};
	//#endregion

	var shownOnDefault = ["valence", "acousticness"];

	var chartDatasets = [];
 
	var featureNames = {
		"danceability": "Danceable",
		"energy": "Energetic",
		"popularity": "Popular",
		"mode": "Key",
		"speechiness": "Talky",
		"acousticness": "Acoustic",
		"instrumentalness": "Instrumental",
		"liveness": "Live",
		"valence": "Cheerful",
		"tempo": "BPM",
		"loudness": "dB",
		"key": "Key"}

	for (var feature in colors) {
		chartDatasets.push({
			data: albumsForChart[feature],
			label: featureNames[feature],
			backgroundColor: 'rgba(255, 255, 255, 0)',
			pointRadius: 10,
			borderColor: colors[feature],
			pointHoverBorderColor: '#000',
			hitRadius: 15,
			hidden: !shownOnDefault.includes(feature)
		});
	}
	
	Chart.defaults.global.defaultFontColor = "#fff";
	Chart.defaults.global.defaultFontSize = 18;
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			//labels: Object.keys(albumsForChart),
			datasets: chartDatasets
		},
		options: {
			responsive: true,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0,
						max: 1,
						stepSize: 0.5,
						callback: function(label, index, labels) {
							if(label == 0)
							{
								return 'No';
							}
							else if(label > 0 && label <= 0.5)
							{
								return 'Meh';
							}
							else
							{
								return 'Very';
							}
						},
					},
				}],
		
				xAxes: [{
					type: 'time',
					distribution: 'linear'
				}]
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			tooltips: {
				// Disable the on-canvas tooltip
				enabled: false,
				mode: 'index',
				position: 'nearest',
				custom: customTooltips,
				intersect: false
			
			},
			legend: {
				onClick: newLegendClickHandler
			}
		}	
	});

	$( "#loading" ).hide();
});
