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

app.get('/spotify/get-album-data-for-artist', function (request, response) {
	var artistId = request.query.artistId;
	console.log("Hello there");
	console.log("General Kenobi");
	spotifyApi.getArtistAlbums(artist)
  .then(function(data) {
		console.log(data);
  }, function(err) {
    console.error(err);
  });
});
/*
app.get('/search-track', function (request, response) {
	var track = request.query.track;

	// Search for a track!
	spotifyApi.searchTracks(`track:${track}`, {limit: 5})
	  .then(function(data) {
	  
		// Send the first (only) track object
		response.send(data.body.tracks.items);

		//response.redirect('/');
	  }, function(err) {
			console.error(err);
	  });
});
  
app.get('/category-playlists', function (request, response) {
	
	// Get playlists from a browse category
	// Find out which categories are available here: https://beta.developer.spotify.com/console/get-browse-categories/
	spotifyApi.getPlaylistsForCategory('jazz', { limit : 5 })
	  .then(function(data) {
	  
	  // Send the list of playlists
	  response.send(data.body.playlists);
	  
	}, function(err) {
	  console.error(err);
	});
});
  
  app.get('/audio-features', function (request, response) {
	
	// Get the audio features for a track ID
	spotifyApi.getAudioFeaturesForTrack('1zP26xND9zCLGZt9NaamfL')
	  .then(function(data) {
	  
		//Send the audio features object
		response.send(data.body);
	  
	  }, function(err) {
		console.error(err);
	  });
  });
  
  app.get('/artist', function (request, response) {
	
	// Get information about an artist
	spotifyApi.getArtist('6jJ0s89eD6GaHleKKya26X')
	  .then(function(data) {
	  
		// Send the list of tracks
		response.send(data.body);
	  
	  }, function(err) {
		console.error(err);
	  });
  });
  
  app.get('/artist-top-tracks', function (request, response) {
	
	// Get an artist's top tracks in a country
	spotifyApi.getArtistTopTracks('5dHtLfkZTRquQ8tyo4ueMC', 'TW')
	  .then(function(data) {
	  
		// Send the list of tracks
		response.send(data.body.tracks);
	  
	  }, function(err) {
		console.error(err);
	  });
  });*/
  
module.exports = app;