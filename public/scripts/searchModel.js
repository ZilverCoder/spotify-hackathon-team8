var searchModel = function(){
	var self = this;
	function Artist(artistId, artistName, imageUrl){
		this.artistId = ko.observable(artistId)
		this.artistName = ko.observable(artistName);
		this.imageUrl = ko.observable(imageUrl);
	}
	
	self.artists = ko.observableArray();

	self.artistSearch = ko.observable("");


	self.searchArtist = ko.computed(function(){
		self.artists([]);

		$.get(`spotify/get-artists-from-name?artistName=${self.artistSearch()}`, function(data) {
			// "Data" is the object we get from the API. See server.js for the function that returns it.
			console.group('%cResponse from /get-artist-from-name', 'color: #F037A5; font-size: large');
			console.log(data);
			console.groupEnd();
			
			data.artist.forEach( artist => {
				if (artist.image.length > 0) {
					self.artists.push(new Artist(artist.id, artist.name, artist.image[1].url));
				} else {
					self.artists.push(new Artist(artist.id, artist.name, "https://upload.wikimedia.org/wikipedia/commons/5/5f/Grey.PNG"));
				}
			});
		});
	}, this);
}

ko.applyBindings(new searchModel());