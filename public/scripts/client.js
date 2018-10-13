// client-side js
// run by the browser each time your view template is loaded

$(function() {
		
		
	
        $.get('spotify/get-album-data-for-artist?artist=0oSGxfWSnnOXhD2fKuz2Gy', function(data) {
        // "Data" is the object we get from the API. See server.js for the function that returns it.
        console.group('%cResponse from /spotify/get-album-data-for-artist', 'color: #F037A5; font-size: large');
        console.log(data);
        console.groupEnd();
        });
	  
});