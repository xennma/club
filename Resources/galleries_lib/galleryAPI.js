/**
 * @author Daniel Daniel
 * @email dimovdaniel@yahoo.com
 * @content Galleries Retrival 
 */
var VARS =require('common/globals');
var Facebook = require('facebook');

//Listener for the resulr 
var listener=null;
/**
 * @description
 *  Fetch all albums from the NextGen Gallery
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {Int} id, the id of the album
 * @config {String} url, the url of the wordpress blog
 * @return {Album[]} ArrayList of albums
 */
exports.fetchGalleriesNextGen=function(param)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		var albumsJSON=JSON.parse(this.responseText);
		var albums=[];
		for(var j = 0; j < albumsJSON.length; j++) 
		{
			//Create the albums
			albums.push(new Album(albumsJSON[j].value,null,albumsJSON[j].tumb.imageURL,albumsJSON[j].id));
		}
		param.listener(albums);
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	//http://www.vincenzoleli.it/wp-content/gallery/album/?callback=json&method=autocomplete&format=json&type=gallery&api_key=true
	var galleryRetreive=param.url+"/wp-content/gallery/album/?method=autocomplete&type=gallery&callback=json&api_key=true&format=json"
	galleryRetreive=galleryRetreive.replace("//wp-content","/wp-content");//If we use address with  "/"
	Ti.API.info(galleryRetreive);
	xhr.open("GET",galleryRetreive);
	xhr.send({});
}

/**
 * @description
 *  Fetch all albums from the Picasa Gallery
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {Int} userID, the id of the album
 * @return {Album[]} ArrayList of albums
 */
exports.fetchGalleriesPicasa=function(param)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		Ti.API.info("PICASA API RESPONSE:"+this.responseText);
		var albumsJSON=(JSON.parse(this.responseText)).feed.entry;
		var albums=[];
		for(var j = 0; j < albumsJSON.length; j++) 
		{		
			var from=albumsJSON[j].id.$t.indexOf("albumid/")+8; 
			var to=albumsJSON[j].id.$t.indexOf("?alt");
			var id=albumsJSON[j].id.$t.substring(from, to);
			//Create the albums
			albums.push(new Album(
				albumsJSON[j].title.$t,
				null,
				albumsJSON[j].media$group.media$thumbnail[0].url,
				id));
		}
		param.listener(albums);
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	var galleryRetreive="http://picasaweb.google.com/data/feed/base/user/"+param.userID+"?alt=json&kind=album&hl=en_US&imgmax=1600"
	Ti.API.info("PICASA URL API:"+galleryRetreive);
	xhr.open("GET",galleryRetreive);
	xhr.send({});
}

/**
 * @description
 *  Fetch all albums from the Flicker
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {String} appKEY, the app key
 * @config {String} userID, the id of the user to retreive photo sets
 * @return {Album[]} ArrayList of albums
 */
exports.fetchGalleriesFlickr=function(param)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		Ti.API.info("FLICKR SETS API RESPONSE:"+this.responseText);
		var to=this.responseText.length-1;
		var response=this.responseText.substring(14, to);
		Ti.API.info("FLICKR SETS API RESPONSE CUT OFF:"+response);
		var albumsJSON=(JSON.parse(response)).photosets.photoset;
		var albums=[];
		for(var j = 0; j < albumsJSON.length; j++) 
		{
			var item=albumsJSON[j];
			var squareUrl = 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.primary + '_' + item.secret + '_s.jpg';

			//Create the albums
			albums.push(new Album(
				item.title._content,
				item.photos,
				squareUrl,
				item.id));
		}
		param.listener(albums);
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	var galleryRetreive="http://api.flickr.com/services/rest/?api_key="+param.appKEY+"&format=json&user_id="+param.userID+"&method=flickr.photosets.getlist"
	xhr.open("GET",galleryRetreive);
	xhr.send({});
}

/**
 * @description
 *  Fetch all albums from Facebook
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {Int} page, the fb page id
 * @memberOf API_GALLERY
 * @return {Album[]} ArrayList of albums
 */
exports.fetchGalleriesFB=function(p)
{
	listener=p.listener
	
	var query = '{"photos":"SELECT src_big  FROM photo WHERE pid IN ( SELECT cover_pid FROM album WHERE owner='+p.page+')","albums":"SELECT object_id,name,photo_count FROM album WHERE owner='+p.page+'"}';
		//Ti.API.info('user id ' + Titanium.Facebook.uid);
		//Titanium.Facebook.request('fql.query', {query: query},  function(r) {
			
	//Get Albums
	//Titanium.Facebook.request('fql.query', {query: query}, showAlbumsResult);
	Facebook.requestWithGraphPath("fql", {q:query}, 'GET', showAlbumsResult);
}

//Display result from facebook album fetch
function showAlbumsResult(r) 
{
       Ti.API.info(r);
       if (!r.success) {
			if (r.error) {
				Ti.UI.createAlertDialog({title:L('error'),message:r.error}).show();
			} else {
				Ti.UI.createAlertDialog({title:L('error'),message:L('uns')}).show();
			}
			return;
		}

		//Convert the result to json
		albumsJSON = JSON.parse(r.result).data[0].fql_result_set;
		Ti.API.info("ALBUMS:");
		Ti.API.info(albumsJSON);
		photosJSON = JSON.parse(r.result).data[1].fql_result_set;
		var albums=[];
		var timthumbLink="";
		if(VARS._TIMTHUMB_FACEBOOK_ENABLED&&VARS._TIMTHUMB_FOR_GALLERY.length>2&&VARS._platform!=VARS._android)
		{
			timthumbLink=VARS._TIMTHUMB_FOR_GALLERY+"&q="+VARS._IMAGE_QUALITY+"&w=130&h=130&src=";
		}
		
		for(var j = 0; j < albumsJSON.length; j++) 
		{
			//Check if there is images in this album
			
				albums.push(new Album(
					albumsJSON[j].name,
					albumsJSON[j].photo_count,
					timthumbLink+photosJSON[j].src_big.replace("720x720","320x320"),
					albumsJSON[j].object_id));
					Ti.API.info(albums[j])
		}
		
		//Return the resuls
		listener(albums);
}


/**
 * @description
 *  Fetch all photos from the single NextGenGallery
 *  Search the gallery
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {int} id, The Id of the gallery
 * @memberOf API_GALLERY
 * @return {Photo[]} ArrayList of photos
 */
exports.fetchPhotosNextGen=function(param)
{
	//List of photos
	var pictures=[]; 
	
	//
	// XHR GET
	//
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		//alert(this.responseText);
		var jsonObject=JSON.parse(this.responseText);
		//alert(jsonObject.images.length);
		for(var i=0;i<jsonObject.images.length;i++)
		{
			one_photo=jsonObject.images[i];
			var p=new Picture(
				                one_photo.filename,
				                one_photo.description,
				                one_photo.imageURL,
				                one_photo.thumbURL,
				                one_photo.pid,
				                one_photo.meta_data.width,
				                one_photo.meta_data.height);
			pictures.push(p);
			
		}
		param.listener(pictures);
		
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	
	
	if(param.id)
	{
		var theUrl=param.url+"/wp-content/gallery/album/?callback=json&method=gallery&format=json&api_key=true&id="+param.id
		theUrl=theUrl.replace("//wp-content","/wp-content");
		xhr.open("GET",theUrl);
	}
	xhr.send({});
 
}

/**
 * @description
 *  Fetch all photos from the single PicasaGallery
 *  Search the gallery
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {int} id, The Id of the gallery
 * @memberOf API_GALLERY
 * @return {Photo[]} ArrayList of photos
 */
exports.fetchPhotosPicasa=function(param)
{
	//List of photos
	var pictures=[]; 
	
	//
	// XHR GET
	//
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
	    var jsonObject=(JSON.parse(this.responseText)).feed.entry;
		Ti.API.info("Picasa Images:"+this.responseText);
		for(var i=0;i<jsonObject.length;i++)
		{
			one_photo=jsonObject[i];
			var p=new Picture(
				                one_photo.title.$t,
				                one_photo.summary.$t,
				                one_photo.media$group.media$thumbnail[1].url,
				                one_photo.media$group.media$thumbnail[0].url,
				                one_photo.id.$t,
				                one_photo.media$group.media$thumbnail[1].width,
				                one_photo.media$group.media$thumbnail[1].height);
			pictures.push(p);
			
		}
		param.listener(pictures);
		
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	
	
	if(param.id)
	{
		//Because in the id field the json retreive url is stored
		var url="http://picasaweb.google.com/data/feed/api/user/"+param.userID+"/albumid/"+param.id+"?kind=photo&access=public&alt=json"
		url+="&thumbsize=75c,320u";
		xhr.open("GET",url);
	}
	
	xhr.send({});
 
}

/**
 * @description
 *  Fetch all photos from the single FlickrGallery
 *  Search the gallery
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {int} id, The Id of the set
 * @config {String} appKEY, the api key
 * @memberOf API_GALLERY
 * @return {Photo[]} ArrayList of photos
 */
exports.fetchPhotosFlickr=function(param)
{
	//List of photos
	var pictures=[]; 
	
	//
	// XHR GET
	//
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		var to=this.responseText.length-1;
		var response=this.responseText.substring(14, to);
	    var jsonObject=(JSON.parse(response)).photoset.photo;
		Ti.API.info("Flickr Images:"+this.responseText);
		for(var i=0;i<jsonObject.length;i++)
		{
			one_photo=jsonObject[i];
			var p=new Picture(
				                one_photo.title,
				                "",
				                one_photo.url_m,
				                one_photo.url_sq,
				                one_photo.id,
				                one_photo.width_m,
				                one_photo.height_m);
			pictures.push(p);
			
		}
		param.listener(pictures);
		
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	
	
	if(param.id)
	{
		//Because in the id field the json retreive url is stored
		var url="http://api.flickr.com/services/rest/?api_key="+param.appKEY+"&format=json&photoset_id="+param.id+"&extras=media,path_alias,url_sq,url_t,url_s,url_m,url_o&method=flickr.photosets.getphotos"
		xhr.open("GET",url);
	}
	
	xhr.send({});
 
}

/**
	 * StartLoadinImages
	 */
	exports.fetchPhotosFB = function(p) 
	{
		listener=p.listener;
		//Get Albums
		Ti.API.info(p.id+"/photos?access_token="+Facebook.appid+"|"+VARS.fbappsecret);
		Facebook.requestWithGraphPath(p.id+"/photos", {limit:p.limit,access_token:Facebook.appid+"|"+VARS.fbappsecret}, 'GET', showGalleryResult);
	}
	//Parse the results
	function showGalleryResult(r) {
       if (!r.success) {
			if (r.error) {
				Ti.UI.createAlertDialog({title:L('error'),message:r.error}).show();
			} else {
				Ti.UI.createAlertDialog({title:L('error'),message:L('uns')}).show();
			}
			return;
		}
		var result = JSON.parse(r.result);
		var photos=result.data;
		var pictures=[];
		
		var timthumbLink="";
		if(VARS._TIMTHUMB_FACEBOOK_ENABLED&&VARS._TIMTHUMB_FOR_GALLERY.length>2&&VARS._platform!=VARS._android)
		{
			timthumbLink=VARS._TIMTHUMB_FOR_GALLERY+"&q="+VARS._IMAGE_QUALITY+"&w=130&h=130&src=";
		}
		
		//Itterate all the photos
	for(var i = 0; i < photos.length; i++) 
	{
        var selectedId=0;
        var selectedIdBig=0;
        var found=false;
        var foundBig=false;
        for(var j=photos[i].images.length-1;selectedId>=0&&!found&&j>=0;j--)
        {
        	if(photos[i].images[j].width>150&&photos[i].images[j].height>150)
        	{
        		found=true;
        		selectedId=j
        	}
        }
        for(var j=photos[i].images.length-1;selectedIdBig>=0&&!foundBig&&j>=0;j--)
        {
        	if(photos[i].images[j].width>=640)
        	{
        		foundBig=true;
        		selectedIdBig=j;
        	}
        }
        
        var p=new Picture(
				                "",
				                photos[i].name,
				                photos[i].images[selectedIdBig].source,
				                timthumbLink+photos[i].images[selectedId].source,
				                photos[i].id,
				                photos[i].images[selectedIdBig].width,
				                photos[i].images[selectedIdBig].height);
		pictures.push(p);
		}
		
		// Create a single thumb that is ImageView with this properties
		listener(pictures);
	}
	



//###################### CLASSES #######################
var Album=function(title, photo_count, icon,id)
{
	this.id=id;
	this.title=title;
	this.photo_count=photo_count;
	this.icon=icon;
}

var Picture=function(name,desc,image,icon,id,h,w)
{
	this.name=name;
	this.desc=desc;
	this.image=image;
	this.icon=icon;
	this.id=id;
	this.h=h;
	this.w=w;
	this.landscape=this.w>this.h;
}
