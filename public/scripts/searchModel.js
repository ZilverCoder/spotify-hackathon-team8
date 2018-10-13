var searchModel = function(){
	var self = this;
	function Track(albumName, imageUrl){
		this.albumName = ko.observable(albumName);
		this.imageUrl = ko.observable(imageUrl);
    }
	self.tracks = ko.observableArray();

	self.trackSearch = ko.observable();
	self.searchTrack = ko.computed(function(){
		self.tracks([]);
		/* $.get(`spotify/get-album-data-for-artist?artistId=0oSGxfWSnnOXhD2fKuz2Gy`, function(data) {
			// "Data" is the object we get from the API. See server.js for the function that returns it.
			console.group('%cResponse from /search-track', 'color: #F037A5; font-size: large');
			console.log(data);
			console.groupEnd();
			$.each(data, function(index, track){
				//console.log(track.name, track.images[1]);
				self.tracks().push(new Track(track.name, track.images[1].url));
			});
		}); */
		return "done";
	}, this);
}

ko.applyBindings(new searchModel());