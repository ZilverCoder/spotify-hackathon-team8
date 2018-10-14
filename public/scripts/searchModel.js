var searchModel = function(){
	var self = this;
	function Artist(artistId, artistName, imageUrl){
		this.artistId = artistId;
		this.artistName = artistName;
		this.imageUrl = imageUrl;
	}
	ko.bindingHandlers.enterKey = {
		init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
			var wrappedHandler = function (data, event) {
				if (event.keyCode === 13)
					valueAccessor().call(this, data, event);
			};
			var newValueAccessor = function () {
				return { keyup: wrappedHandler };
			};
			ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
		}
	};
	self.searchResult = ko.observableArray();
	self.searchBoxVal = ko.observable();
	self.preSetArtistSelection = ko.observableArray([new Artist("5pKCCKE2ajJHZ9KAiaK11H", "Rihanna", "https://i.scdn.co/image/e8a018bfd60bf25519fd4dc8ca941263afa66651"), 
														new Artist("0oSGxfWSnnOXhD2fKuz2Gy", "David Bowie", "https://i.scdn.co/image/76e50c6493a4173e5294374ae88be0ce42ed091e"), 
														new Artist("3eqjTLE0HfPfh78zjh6TqT", "Bruce Springsteen", "https://i.scdn.co/image/c031183d09ec0708a2e782263877053ecb95f835")]);

	self.showNoArtistResultSection = ko.observable(false);
	self.showNoAlbumsResultSection = ko.observable(false);

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
				if(result[0] == undefined){
					self.showNoArtistResultSection(true);
				}
				self.searchResult(result);
			});
		},
		owner: self
	});
}

ko.applyBindings(new searchModel());