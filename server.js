var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8000;

// Allow access to static content for the app from the current directory 
app.use(express.static(__dirname));

// Send the main application HTML page
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

// Start server
app.listen(port);