var getUrlParameter = function getUrlParameter(sParam) {
	    var sPageURL = window.location.search.substring(1),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
	        }
	    }
	}

function getStats(userName) {
    // params, body, additionalParams
    var apigClient = apigClientFactory.newClient();
    stats = apigClient.getstatsfromwebsitePost({}, {
      "userName": userName
    }, {})
    return stats.then(function(data)
	{
		return JSON.parse(data.data.body)
	});;
 }

// $(function () {
((async () => {
	var stats = await getStats(getUrlParameter('userName'));

	// Tables:
	if ($("#personalizedStatTable").length) {
		var tableHTML = '<tbody>'
		$.each(stats, function (key, value) {
		    tableHTML+= '<tr>';
		  	tableHTML+= '<td>' + key + '</td>';
		 	tableHTML+= '<td>' + value + '</td>';
		    tableHTML+= '</tr>';
		});
		tableHTML += '</tbody>';
		document.getElementById("personalizedStatTable").innerHTML = tableHTML;
		console.log("made table")
	}


	// Graphs:
	if ($("#roleBreakdownsChart").length) {
		
	    var doughnutChartCanvas = $("#roleBreakdownsChart").get(0).getContext("2d");
	    var doughnutPieData = {
	      datasets: [{
	        data: [stats["Times Crewmate"], stats["Times Impostor"]],
	        backgroundColor: [
	          ChartColor[1],
	          ChartColor[2]
	        ],
	        borderColor: [
	          ChartColor[1],
	          ChartColor[2]
	        ],
	      }],

	      // These labels appear in the legend and in the tooltips when hovering different arcs
	      labels: [
	        'Crewmate',
	        'Impostor',
	      ]
	    };
	    var doughnutPieOptions = {
	      cutoutPercentage: 75,
	      animationEasing: "easeOutBounce",
	      animateRotate: true,
	      animateScale: false,
	      responsive: true,
	      maintainAspectRatio: true,
	      showScale: true,
	      legend: false,
	      legendCallback: function (chart) {
	        var text = [];
	        text.push('<div class="chartjs-legend"><ul>');
	        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
	          text.push('<li><span style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '">');
	          text.push('</span>');
	          if (chart.data.labels[i]) {
	            text.push(chart.data.labels[i]);
	          }
	          text.push('</li>');
	        }
	        text.push('</div></ul>');
	        return text.join("");
	      },
	      layout: {
	        padding: {
	          left: 0,
	          right: 0,
	          top: 0,
	          bottom: 0
	        }
	      }
	    };
	    var doughnutChart = new Chart(doughnutChartCanvas, {
	      type: 'doughnut',
	      data: doughnutPieData,
	      options: doughnutPieOptions
	    });
	    return doughnutChart
	    
	  document.getElementById('roleBreakdowns-chart-legend').innerHTML = doughnutChart.generateLegend();
 	}

 	if ($("#crewmateResultsChart").length) {
		console.log("trying graph")
	    var doughnutChartCanvas = $("#crewmateResultsChart").get(0).getContext("2d");
	    console.log(stats["Times Crewmate"]);
	    console.log(stats["Crewmate Vote Wins"]);
	    console.log(stats["Crewmate Task Wins"]);
	    var losses = parseInt(stats["Times Crewmate"]) - (parseInt(stats["Crewmate Vote Wins"]) + parseInt(stats["Crewmate Task Wins"]));
	    console.log(losses)
	    var doughnutPieData = {
	      datasets: [{
	        data: [stats["Crewmate Vote Wins"], stats["Crewmate Task Wins"], losses],
	        backgroundColor: [
	          ChartColor[0],
	          ChartColor[1],
	          ChartColor[2]
	        ],
	        borderColor: [
	          ChartColor[0],
	          ChartColor[1],
	          ChartColor[2]
	        ],
	      }],

	      // These labels appear in the legend and in the tooltips when hovering different arcs
	      labels: [
	        'Vote Wins',
	        'Task Wins',
	        'Losses'
	      ]
	    };
	    var doughnutPieOptions = {
	      cutoutPercentage: 75,
	      animationEasing: "easeOutBounce",
	      animateRotate: true,
	      animateScale: false,
	      responsive: true,
	      maintainAspectRatio: true,
	      showScale: true,
	      legend: false,
	      legendCallback: function (chart) {
	        var text = [];
	        text.push('<div class="chartjs-legend"><ul>');
	        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
	          text.push('<li><span style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '">');
	          text.push('</span>');
	          if (chart.data.labels[i]) {
	            text.push(chart.data.labels[i]);
	          }
	          text.push('</li>');
	        }
	        text.push('</div></ul>');
	        return text.join("");
	      },
	      layout: {
	        padding: {
	          left: 0,
	          right: 0,
	          top: 0,
	          bottom: 0
	        }
	      }
	    };
	    var doughnutChart = new Chart(doughnutChartCanvas, {
	      type: 'doughnut',
	      data: doughnutPieData,
	      options: doughnutPieOptions
	    });
	    return doughnutChart
	    
	document.getElementById('crewmateResults-chart-legend').innerHTML = doughnutChart.generateLegend();
 	}
})()).catch(console.error)

