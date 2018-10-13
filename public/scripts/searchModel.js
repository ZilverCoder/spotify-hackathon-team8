var searchModel = function(){
	var self = this;
	function Artist(artistId, artistName, imageUrl){
	/*	this.artistId = ko.observable(artistId)
		this.artistName = ko.observable(artistName);
		this.imageUrl = ko.observable(imageUrl);*/
		this.artistId = artistId;
		this.artistName = artistName;
		this.imageUrl = imageUrl;
	}
	
	self.searchResult = ko.observableArray();
	self.searchBoxVal = ko.observable();

	self.searchArtists = ko.pureComputed({
		read: function () {
			return self.searchResult();
		},
		write: function (value) {
			$.get(`spotify/get-artists-from-name?artistName=${self.searchBoxVal()}`, function(data) {
				// "Data" is the object we get from the API. See server.js for the function that returns it.
				
				result = []
				console.group('%cResponse from /get-artist-from-name', 'color: #F037A5; font-size: large');
				console.table(data);
				console.groupEnd();
				data.forEach( artist => {
					result.push(new Artist(artist.id, artist.name, artist.image.url));
				});
				console.log(result);
				self.searchResult(result);
			});
		},
		owner: self
	});
}

ko.applyBindings(new searchModel());