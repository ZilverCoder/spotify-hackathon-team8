var express = require('express');
var app = express();

app.get('/search-track', function (request, response) {
  
	// Search for a track!
	spotifyApi.searchTracks('track:1,2,3', {limit: 1})
	  .then(function(data) {
	  
		// Send the first (only) track object
		response.send(data.body.tracks.items[0]);
	  
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
  });
  
module.exports = app;