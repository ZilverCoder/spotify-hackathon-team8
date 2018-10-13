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

function removeSpecialEditions(albums) {
	var indicesToBeRemoved = [];
	var cleanedAlbums = albums;
	albums.map(function(album, j) {
		albums.map(function(tmpAlbum, i) {
			if (tmpAlbum.name != album.name 
				&& tmpAlbum.name.startsWith(album.name)) {
					indicesToBeRemoved.push(i);
			} else if (tmpAlbum.name == album.name
				&& j > i) {
					indicesToBeRemoved.push(i);
			}
		});
	});

	for (var i = indicesToBeRemoved.length -1; i >= 0; i--) {
		cleanedAlbums.splice(indicesToBeRemoved[i],1);
	};
	return cleanedAlbums;
};

//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//

// get the accumulated data for an artist
// including the averaged 
app.get('/get-album-data-for-artist', function (request, response) {
	var artistId = request.query.artistId;
	var responseData = {};
	var count = 0;
	spotifyApi.getArtistAlbums(artistId, {album_type:"album"})
  .then(function(data) {
		cleanedAlbums = removeSpecialEditions(data.body.items);
		
		cleanedAlbums.map(function(album) {
			var albumInformation = {features: {}, songs: {}};
			albumInformation.id = album.id;
			albumInformation.name = album.name;
			albumInformation.artists = album.artists;
			albumInformation.releaseDate = album.release_date;
			albumInformation.images = album.images;

			albumInformation.averagedPopularity = 0;

			// get all tracks for the album
			spotifyApi.getAlbumTracks(album.id)
			.then(function(data) {
				albumInformation.songs = data.body.items;
				var trackIds = data.body.items.map(e => e.id);

				spotifyApi.getTracks(trackIds)
				.then(function(data) {
					data.body.tracks.forEach(trackElement => {
						albumInformation.songs.forEach(songElement => {
							if (trackElement.id == songElement.id) {
								songElement.popularity = trackElement.popularity;
								albumInformation.averagedPopularity += trackElement.popularity;
							}
						})
					})
					albumInformation.averagedPopularity /= album.total_tracks;
				
					// get all features for the tracks for this particular album
					spotifyApi.getAudioFeaturesForTracks(trackIds)
					.then(function(data) {

						JSON.artist = "blubb"
						// for every audio feature
						data.body.audio_features.forEach(featureElement => {
							// get the correct song in the albumInformation
							albumInformation.songs.forEach(songElement => {
								songElement.features = {};
								if (featureElement.id == songElement.id) {

									for (var attribute in featureElement) { 
										songElement.features[attribute] = featureElement[attribute];
										if (["type", "id", "uri", "track_href", "analysis_url", "duration_ms", "time_signature"].includes(attribute)) {
											// we want to ignore id, type and so on
											continue;
										}
										if (attribute in albumInformation.features) {
											albumInformation.features[attribute] += featureElement[attribute];
										} else {
											albumInformation.features[attribute] = featureElement[attribute];
										}
									} // end var attribute in featureElement
								} // end if id == id
							}); // end for each song
						}); // end for each featureElement
						for (var feature in albumInformation.features) {
							albumInformation.features[feature] /= album.total_tracks;
						}

						responseData[albumInformation.id] = albumInformation;
						if(++count == cleanedAlbums.length) {
							console.log(responseData);
							response.send(responseData);
							
						}
					}); // end getAudioFeatures
				});
			}); // end getAlbumTracks
		}); // end for every album
  }, function(err) {
    console.error(err);
  });
});
  
module.exports = app;