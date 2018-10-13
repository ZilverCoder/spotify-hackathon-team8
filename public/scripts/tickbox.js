var ctx = document.getElementById("myChart").getContext('2d');
var current = new Date();
var past = current.setFullYear(1980);
var now = current.setFullYear(1995);
var newPoint = current.setFullYear(2018);

//Data input for different features
var happyData = [{
					x: past,
                    y: 1
                }, {
                    x: now,
                    y: 19
                }, {
                    x: current,
                    y: 5
                }];

var danceData = [{
                    x: past,
                    y: 18
                }, {
                    x: now,
                    y: 9
                }, {
                    x: current,
                    y: 12
                }];

var tempoData = [{
                    x: past,
                    y: 8
                }, {
                    x: now,
                    y: 5
                }, {
                    x: current,
                    y: 18
                }];

Chart.defaults.global.defaultFontColor =  "#fff";
var myChart = new Chart(ctx, 
	{
    type: 'line',
    data: {
        datasets: [{
                label: 'Happiness',
                data: happyData,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: [
                    'rgba(255,99,132,1)'
                            ],
                pointHoverBorderColor: '#fff',
                borderWidth: 2,
                pointRadius: 10,
                yAxisID: 'left-y-axis'
        	}, {
                label: 'Danceable',
                data: danceData,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: [
                    'rgba(56, 199, 32,1)'
                ],
                pointHoverBorderColor: '#fff',
                borderWidth: 2,
                pointRadius: 10,
                yAxisID: 'left-y-axis'
            },{
                label: ' scale of every album for {INSERT ARTIST}',		
                data: tempoData,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: [
                    'rgba(125,81,172,1)',
                ],
                borderWidth: 2,
                pointRadius: 10
            }]
        },
	
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 20,
                    stepSize: 5,
                    callback: function(label, index, labels) {
                    if(label == 0)
                    {
                        return 'Not Happieness';
                    }
                    else if(label > 0 && label < 10)
                    {
                        return 'Little Happieness';
                    }
                    else if(label == 10)
                    {
                        return 'Normal Happieness';
                    }
                    else if(label > 10 && label < 20)
                    {
                        return 'More Happieness';
                    }
                    else
                    {
                        return 'Most Happieness';
                    }
                },
                beginAtZero:true,
            },
			scaleLabel: {
        	display: true
      	},
		id: 'left-y-axis',
        position: 'left'
    }],
			 xAxes: [{
                ticks: {
                    autoSkip:true,
                    source: 'auto',
                    beginAtZero:false					
                },
				scaleLabel: {
                    display: true,
                    labelString: 'years'
                },
                type: 'time',
 				distribution: 'linear'
            }],
        }
    }
});

function handleHappyClick(cb) {
	//myChart.destroy();
	if(cb.checked)
	{
   happyData = [{
                x: past,
                y: 1
            }, {
                x: now,
                y: 19
            }, {
                x: current,
                y: 5
            }];
		}
		else
		{
			   happyData = [ ];
		}
    var data = myChart.config.data;
    data.datasets[0].data = happyData;
    //data.datasets[1].data = happyData;
    //data.labels = Happiness;
    myChart.update();
};

function handleDanceClick(cb) {
	if(cb.checked)
	{
        danceData = [{
                        x: past,
                        y: 18
                    }, {
                        x: now,
                        y: 9
                    }, {
                        x: current,
                        y: 12
                    }];
	}
	else
    {
        danceData = [ ];
    }
    var data = myChart.config.data;
    data.datasets[1].data = danceData;
    myChart.update();
};

function handleTempoClick(cb) {
	if(cb.checked)
	{
		tempoData = [{
                        x: past,
                        y: 8
                    }, {
                        x: now,
                        y: 5
                    }, {
                        x: current,
                        y: 18
                    }];
    }
    else
    {
            tempoData = [ ];
    }
    var data = myChart.config.data;
    data.datasets[2].data = tempoData;
    myChart.update();
};