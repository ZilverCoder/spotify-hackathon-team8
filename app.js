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


//-------------------------------------------------------------//
//----------------------- AUTHORIZATION -----------------------//
//-------------------------------------------------------------//


// Initialize Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// The object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
  
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });


//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//

var controllers = {
	SpotifyCalls: require('./controllers/SpotifyCalls')
}


app.get('/', function(req, res, next){
    res.render('Index');
});

app.use('/spotify', controllers.SpotifyCalls);

//-------------------------------------------------------------//
//------------------------ WEB SERVER -------------------------//
//-------------------------------------------------------------//


app.listen(3000);