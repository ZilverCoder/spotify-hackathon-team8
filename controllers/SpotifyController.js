var express = require('express');
var app = express();

//-------------------------------------------------------------//
//----------------------- AUTHORIZATION -----------------------//
//-------------------------------------------------------------//
	//#region AUTHORIZATION
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
	//#endregion
//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//


// Search artists whose name contains 'Love'
app.get('/get-artists-from-name' , function (request, response) {
	var artistName = request.query.artistName;
	response = {};
	spotifyApi.searchArtists(artistName)
		.then(function(data) {
			response.artist = [];
			var items = data.body.artists.items;

      // loop through top artists
			for (var i = 0; i < items.length ; i++) {
				response.artist[i] = {"name" : items[i].name, "image" : items[i].images}
				var nrShownItems = 2;
				if (i === nrShownItems) { break; }
				// more statements
			 }
		}, function(err) {
			console.error(err);
		}
		);
});
  
module.exports = app;