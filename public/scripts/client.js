// client-side js
// run by the browser each time your view template is loaded

$(function() {
		
		
        //Make a new call 
        $.get('spotify/get-artists-from-name?artistName=metallica', function(data) {
                // "Data" is the object we get from the API. See server.js for the function that returns it.
                //console.group('%cResponse from /spotify/get-artists-from-name', 'color: #F037A5; font-size: large');
                //console.log(data);
                //console.groupEnd();
                });
                  


  
});