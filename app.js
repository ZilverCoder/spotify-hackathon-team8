var express = require('express'),
	path = require('path');
	exphbs = require('express-handlebars'),
	bodyParser = require('body-parser');
	require('dotenv').config();
	
var app = express();


var handlebars = exphbs.create({
	layoutsDir: path.join(__dirname + '/views/layouts'),
	partialsDir: path.join(__dirname + '/views/partials'),
	defaultLayout: 'Default',
	extname: 'hbs'
});
app.engine('hbs', handlebars.engine);

app.set('view engine', 'hbs');
app.set('Views', path.join(__dirname, 'views'));

//app.use(compression());
//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/node_modules')));


//-------------------------------------------------------------//
//------------------------- ROUTES ----------------------------//
//-------------------------------------------------------------//

var controllers = {
	SpotifyCalls: require('./controllers/SpotifyController'),
	ChartController: require('./controllers/ChartController')
}


app.get('/', function(req, res, next){
    res.render('Index');
});

app.get('/result', function(req, res, next){
	res.render('Result');
});


app.use('/spotify', controllers.SpotifyCalls);
app.use('/chart', controllers.ChartController);

//-------------------------------------------------------------//
//------------------------ WEB SERVER -------------------------//
//-------------------------------------------------------------//


app.listen(3000);