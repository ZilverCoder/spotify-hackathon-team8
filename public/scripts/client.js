// client-side js
// run by the browser each time your view template is loaded

$(function() {
<<<<<<< HEAD
		
		
        //Make a new call 
        $.get('spotify/get-artists-from-name?artistName=metallica', function(data) {
                // "Data" is the object we get from the API. See server.js for the function that returns it.
                console.group('%cResponse from /spotify/get-artists-from-name', 'color: #F037A5; font-size: large');
                console.log(data);
                console.groupEnd();
                });
                  


  
=======
        $.get('spotify/get-album-data-for-artist?artistId=1E05B8q4mGKUB0n8Ag0Q7c', function(data) {
        // "Data" is the object we get from the API. See server.js for the function that returns it.
        console.group('%cResponse from /spotify/get-album-data-for-artist', 'color: #F037A5; font-size: large');
        console.log(data);
        console.groupEnd();
        });
	  
>>>>>>> abf9f3cc4e69059843481a93b0fff11b06f2cac6
});