var express = require('express');
var app = express();
var path = require('path');
//var request = require('request');
//var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port);