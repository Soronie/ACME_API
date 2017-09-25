//function getTruth(){
//	request.get(url, function(err, res, req){
//		var data = JSON.parse(req);
//		console.log(data.fortune);
//	});
//	console.log('Works?');
//}

function getTruth()
{
    //var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open("GET", 'http://api.acme.international/fortune', true); // true for asynchronous 
    //xmlHttp.send(null);
    //var data = JSON.parse(xmlHttp.responseText);
    //console.log(data[0]);
    //return xmlHttp.responseText;
    //try{
    	$.getJSON('http://api.acme.international/fortune', function(data) {
    		var message = ''
    		for (var i = 0; i < data.fortune.length; i++)
    			message += data.fortune[i] + '\n';

    		var newText = document.createElement("INPUT");
    		newText.setAttribute("type", "text");
    		newText.setAttribute("value", message);
    		document.body.appendChild(newText);
    	}).fail(function(){
    		getTruth();
    	});
	//}
	//catch(e){
	//	getTruth();
	//}
}