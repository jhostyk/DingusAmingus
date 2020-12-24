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

async function makePersonalizedStatsTable() {
	var stats = await getStats(getUrlParameter('userName'))
	console.log(stats)
	console.log("done") 
 	var tableHTML = '<tbody>'
    $.each(stats, function (key, value) {
        tableHTML+= '<tr>';
      	tableHTML+= '<td>' + key + '</td>';
     	tableHTML+= '<td>' + value + '</td>';
        tableHTML+= '</tr>';
    });
    tableHTML += '</tbody>';
       return tableHTML;
}

// document.getElementById("personalizedStatTable").innerHTML = makePersonalizedStatsTable();
((async () => {
	document.getElementById("personalizedStatTable").innerHTML = await makePersonalizedStatsTable();
})()).catch(console.error)

