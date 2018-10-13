var express = require('express');
var app = express();

app.get('/', function(req, res, next){
	var artistId = req.query.artistId;
	console.log(artistId);
    res.render('Chart');
});

module.exports = app;