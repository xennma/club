
/**
 * @description
 *  Fetch all songs from the SoundCloud
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {String} user
 * @config {String} type
 * @config {String} consumer_key
 * @return ArrayList of sogs
 */
exports.fetchSCSongs = function(param) {
	//List of albums
	var songs = [];

	//
	// XHR GET
	//
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() 
	{
		//alert(this.responseText);
		var jsonObject = JSON.parse(this.responseText);
		for(var i = 0; i < jsonObject.length; i++) 
		{
			one_song = jsonObject[i];
            songs.push({
            	
            	title:one_song.title,
            	desc:one_song.description,
            	icon:one_song.artwork_url,
            	id:one_song.permalink_url,
            	 //added by LUIS CALERO
            	
            });
		}

		param.listener(songs);

	};
	xhr.onerror = function() 
	{
	};
	xhr.open("GET", "https://api.soundcloud.com/users/"+param.user+"/"+param.type+".json?consumer_key="+param.consumer_key);
	xhr.send({});

}