var express = require('express');
var store = require('store');
var moment = require('moment');
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
			} else if (album.name.indexOf('(') != -1
				&& j > i
				&& (tmpAlbum.name.substr(0, tmpAlbum.name.indexOf('(')) == album.name.substr(0, album.name.indexOf('(')))) {
					indicesToBeRemoved.push(i);
			} else if (tmpAlbum.release_date == album.release_date
				&& j > i) {
					indicesToBeRemoved.push(i);
			}
		});

		if (album.name.toLowerCase().includes("live")) {
			indicesToBeRemoved.push(j);
		}
	});

	var uniqueIndices = indicesToBeRemoved.filter(function(item, pos) {
		return indicesToBeRemoved.indexOf(item) == pos;
	})

	for (var i = uniqueIndices.length -1; i >= 0; i--) {
		cleanedAlbums.splice(uniqueIndices[i],1);
	};
	return cleanedAlbums;
};

//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//


// Search artists whose name contains 'Love'
app.get('/get-artists-from-name' , function (request, response) {
	let artistName = request.query.artistName;

	//console.log("Looking for artist: " + artistName);

	if (artistName == "undefined") {
		// just for the lolz
		artistName = "Rick Astley";
	}

	spotifyApi.searchArtists(artistName)
		.then(function(data) {
			var responseData = [];
			var items = data.body.artists.items;
			
      // loop through top artists
			for (var i = 0; i < items.length ; i++) {
				var responseArtist = {image: {}};
				if (items[i].images.length == 0) {
					responseArtist.image.url = "https://upload.wikimedia.org/wikipedia/commons/5/5f/Grey.PNG";
				} else {
					responseArtist.image = items[i].images[1];
				}
				responseArtist.name = items[i].name;
				responseArtist.id = items[i].id;

				responseData.push(responseArtist);
				var nrShownItems = 2;
				if (i === nrShownItems) {
					response.send(responseData);
					return;
				}
				// more statements
			}
			response.send(responseData);
		}, function(err) {
			console.error(err);
		}
		);
	});

	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
		  if ((new Date().getTime() - start) > milliseconds){
			break;
		  }
		}
	  }


// get the accumulated data for an artist
// including the averaged 
app.get('/get-album-data-for-artist', function (request, response) {
	var artistId = request.query.artistId;
	var responseData = {};
	var count = 0;
	var searchOffset = 0;
	var searchSteps = 25;
	var delay = 2
	var dataArray = [];

	//Cookie check
	var ArtistCookie = request.cookies[artistId];
	//If this passes it means youve already loaded this artist before
	if(ArtistCookie != undefined){
		//See if theres data in LocalStorage
		const json = (function(data) {
			try {
				return JSON.parse(data);
			} catch (err) {
				return false;
			}
		})(store.get(artistId));

		if(json){
			response.send(json);
		}else{//No data means a new request
			spotifyApi.getArtistAlbums(artistId, {album_type: "album", country:"SE", limit: searchSteps})
			.then(getData, function(err) {
				console.error(err);
			});
		}	
	}
	else{//No cookie means a new request
		console.log("Hello!");
		spotifyApi.getArtistAlbums(artistId, {album_type: "album", country:"SE", limit: searchSteps})
		.then(getData, function(err) {
			console.error(err);
		});
	}
	
	function processData(data, delay) {
		if (data.length == 0) {
			response.send({});
		}
		cleanedAlbums = removeSpecialEditions(data);
		cleanedAlbums.map(function(album, albumCount) {

			var albumInformation = {features: {}, songs: {}};
			albumInformation.id = album.id;
			albumInformation.name = album.name;
			albumInformation.artists = album.artists;
			albumInformation.releaseDate = album.release_date;
			albumInformation.images = album.images;

			albumInformation.averagedPopularity = 0;

			sleep(delay);
			// get all tracks for the album
			spotifyApi.getAlbumTracks(album.id)
			.then(function(data) {

				albumInformation.songs = data.body.items;
				var trackIds = data.body.items.map(e => e.id);
				
				sleep(delay);
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
						// get all features for the tracks for this particular album
						sleep(delay);
						spotifyApi.getAudioFeaturesForTracks(trackIds)
						.then(function(data) {
							// for every audio feature
							data.body.audio_features.forEach(featureElement => {
								// get the correct song in the albumInformation

								albumInformation.songs.forEach(songElement => {
									if (featureElement == null || songElement == null) {
										return;
									}
									
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
							albumInformation.features.popularity = albumInformation.averagedPopularity;
							for (var feature in albumInformation.features) {
								albumInformation.features[feature] /= album.total_tracks;
							}
							// normalise value
							albumInformation.features.popularity /= 100;
							
							responseData[albumInformation.id] = albumInformation;
							if(++count == cleanedAlbums.length) {
								//Make the cookies life span
								var deathClock = moment(new Date(Date.now())).add(30, 'm').toDate();
								//Store the response data
								store.set(artistId, JSON.stringify(responseData));
								//Set the cookie with artistId that will be used to access the correct data from localstorage
								response.cookie(artistId, artistId, {maxAge: 1000 * 60 * 30, expires: deathClock});
								//send response data
								response.send(responseData);
								return;
							}
						}, function(err) {
							console.error("getAudioFeaturesForTracks " + err);
						}); // end getAudioFeatures
				
				}, function(err) {
						console.error("getTracks" + err);
				});
				
				
				
			}, function(err) {
				console.error("getAlbumTracks" + err);
			}); // end getAlbumTracks
		}); // end for every album
	}

	function getData(data) {
		searchOffset += searchSteps;
		dataArray.push(...data.body.items);
		if (data.body.items == 0 || searchOffset >= 100) {
			if (dataArray.length > 75) {
				delay = 350;
			} else if (dataArray.length > 55){ 
				delay = 275;
			} else if (dataArray.length > 35){ 
				delay = 200;
			} else {
				delay = dataArray.length * 5;
			}
			processData(dataArray, delay);
		} else {
			spotifyApi.getArtistAlbums(artistId, {album_type: "album", country:"SE", limit: searchSteps, offset: searchOffset})
				.then(getData, function(err) {
					console.error(err);
				});
		}
	}

});
  
module.exports = app;