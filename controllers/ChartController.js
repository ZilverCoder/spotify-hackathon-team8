var express = require('express');
var app = express();

app.get('/', function(req, res, next){
    res.render('Index');
});

module.exports = app;