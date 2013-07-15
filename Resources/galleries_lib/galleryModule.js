/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content Gallery Module
* @version 2.0
* @change log 
* ---- 2.0 ----------
* put gridCreator in public interface
*/

//Include Required modules
var VARS =require('common/globals');
var API_GALLERY=require('galleries_lib/galleryAPI');
var GUI =require('galleries_lib/gui');
var Facebook = require('facebook');

//############### PRIVATE DATA ################
//Spinerr
var nativespinner = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.SPINNER
});


//The window for the detail image, shoul be public available within the gallery
var _imageWin = null;

/**
 * @description Creates window with gallery list retreived from remote server
 * @param {Object} p, Parameters
 * @config {Window} win, the window to open the gallery in
 * @config {String} title, the window title
 * @config {String} type, Gallery Type [_NEXT_GEN,_FB_GALLERY,_PICASA,_FLICKR]
 * ------- _NEXT_GEN -----------------
 * @config {Int} id, Id of the Gallery
 * @config {String} url, Url of the blog
 * ------- _FB_GALLERY ---------------
 * @config {String} page, page id
 * ------- _PICASA -------------------
 * @config {String} userID, the user id to retreive images for
 * --------- _FLICKR -----------------
 * @config {String} appKEY, the flicker app key
 * @config {String} userID, the user to retreive photo sets
 * --------- OPEN PARAMETERS ---------
 * @config {String} openType [1-open in tab, open in window]
 * @config {Tab} tab, the tab for the detail window to open in
 * @return {Ti.UI.TableView}
 */
exports.createGalleryList = function(p) 
{
	//################### DATA ######################
	//The data holder
	var dataGals = [];

	//The galleries returned
	var gals = [];
	
	//The refresh button
	var refreshButton=Ti.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	})

	//################### VIEWS #####################
	//AD
	galleryListHeight="100%";
	galleryListBottom="0dp";
	galleryListTop=null;
	
	
	var galleryTableView = Titanium.UI.createTableView({
		top:"0dp",
		bottom:galleryListBottom,
		backgroundColor : VARS.rowColor,
		rowHeight:VARS.rowHeight,
		separatorColor : VARS.separatoColor,
		width : '100%',
		height:galleryListHeight
	});

	//################## FUNCTIONS ##############
	function setGalleries(galleries) 
	{
		if(VARS._platform!=VARS._android)
		{
			//Set refresg button
			p.win.setRightNavButton(refreshButton);
		}
		
		
		//Clear the data
		dataGals = [];
		gals = galleries;


		//Fill rows with albums data
		for(var j = 0; j < galleries.length; j++) {
			//Create one row, add to to table, Create album add to rows
			dataGals.push(GUI.creteSimpleRow({
				index:j,
				title:galleries[j].title,
				icon:galleries[j].icon,
				id:galleries[j].id}));
		}

		//Set the data to table
		galleryTableView.setData(dataGals);
		
	}

	
	//################## EVENT LISTENERS ############

	galleryTableView.addEventListener('click', function(e) 
	{
		gridCreator({
			openType:p.openType,
			tab:p.win.containingTab,
			type:p.type,
			url:p.url, //For next gen
			userID:p.userID, //For picasa
			appKEY:p.appKEY, //For Flickr
			album:gals[e.index]});
	});
	
	refreshButton.addEventListener('click',function(e)
	{
		fetchAlbums();
	});

	//#############################################
	//Setup Galleries
	function fetchAlbums()
	{
		if(VARS._platform!=VARS._android)
		{
			//Set activity indicator in iphone
			p.win.setRightNavButton(nativespinner);
		}
		
		
		if(p.type==VARS._NEXT_GEN)
		{
			//RETREIVE NEXTGEN DATA
			API_GALLERY.fetchGalleriesNextGen({
				listener : setGalleries,
				id : p.id,
				url: p.url,
			});
		}
		else if(p.type==VARS._FB_GALLERY)
		{
			//RETREIVE FACEBOOK   DATA
			API_GALLERY.fetchGalleriesFB({
				listener : setGalleries,
				page:p.page,
			});
		}
		else if(p.type==VARS._PICASA)
		{
			//RETREIVE PICASA DATA
			API_GALLERY.fetchGalleriesPicasa({
				listener : setGalleries,
				userID:p.userID
			});
		}
		else if(p.type==VARS._FLICKR)
		{
			//RETREIVE PICASA DATA
			API_GALLERY.fetchGalleriesFlickr({
				listener : setGalleries,
				userID:p.userID,
				appKEY:p.appKEY,
			});
		}		
	}
	
	
	//Add the table to the window
	p.win.add(galleryTableView);
	
	
	//Fetch albums
	fetchAlbums();
	
	//In android display toast
	if(VARS._platform==VARS._android)
	{
			Titanium.UI.createNotification({
    			duration: Ti.UI.NOTIFICATION_DURATION_LONG,
    			message: L('loading_albums')
			}).show();

	}
	
	
}
/**
 * Creates the window for the grid
 * @param {Objec} p,
 * @config {Album} album, the complete album
 * @config {String} type, Gallery Type [_NEXT_GEN,_FB_GALLERY,_PICASA,_FLICKR]
 * ------- _NEXT_GEN -----------------
 * @config {String} url, Url of the blog
 * ------- _PICASA -------------------
 * @config {String} userID, the user id to retreive images for
 * --------- _FLICKR -----------------
 * @config {String} appKEY, the flicker app key
 * 
 */
function gridCreator(p)
{
	//The Grid window
	var galleryGridWindow = Titanium.UI.createWindow({
		title : p.album.title,
		barColor : VARS.barColor,
		translucent:true,
		backgroundColor:VARS.rowColor,
	});
	
	//The refresh button
	var refreshButtonDetail=Ti.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	})
	
	//Calls grid creator to create the thumbnails
	setThumbnails = function(imagesArray) 
	{
		if(VARS._platform!=VARS._android)
		{
			//Set refresh button as right nav 
			galleryGridWindow.setRightNavButton(refreshButtonDetail);
		}
		
		
		// Initialize the Image Gallery
		var imageGallery = createGallery({
			photos : imagesArray,
			openType:p.openType,
			tab:p.tab,
			albumTitle:p.album.title,
			albumType:"gallery_"+p.type,
		});
		// Add it to the current window
		galleryGridWindow.add(imageGallery);
	}
	
	function fetchPhotos()
	{
		if(VARS._platform!=VARS._android)
		{
			//Set activity indicator
			galleryGridWindow.setRightNavButton(nativespinner);
		}
		
		
		//Retreive images specific for the type
		if(p.type==VARS._NEXT_GEN)
		{
			//Retreie images from NextGen
			API_GALLERY.fetchPhotosNextGen({
				listener : setThumbnails,
				id : p.album.id,
				url: p.url,
			});
			
		}
		else if(p.type==VARS._FB_GALLERY)
		{
			//Retreie images from Facebook
			API_GALLERY.fetchPhotosFB({
				listener : setThumbnails,
				id : p.album.id,
				limit:VARS._PhotoLimitFacebook,
			});
			
		}
		else if(p.type==VARS._PICASA)
		{
			//Retreie images from Picasa
			API_GALLERY.fetchPhotosPicasa({
				listener : setThumbnails,
				id : p.album.id,
				userID:p.userID,
			});
			
		}
		else if(p.type==VARS._FLICKR)
		{
			//Retreie images from Flickr
			API_GALLERY.fetchPhotosFlickr({
				listener : setThumbnails,
				id : p.album.id,
				appKEY:p.appKEY,
			});
			
		}		
	}
	
	//################ EVENT LISTENER ######################
	refreshButtonDetail.addEventListener('click',function(e){
		//Fetch the photos
		fetchPhotos();
	})
	
	//Open in tab or in window
	if(p.openType==1)
	{
		//Open in tab
		p.tab.open(galleryGridWindow);
	}
	else
	{
		//Open as window
		galleryGridWindow.open();
	}
	
	
	//In android display toast
	if(VARS._platform==VARS._android)
	{
		Titanium.UI.createNotification({
    		duration: Ti.UI.NOTIFICATION_DURATION_LONG,
    		message: L('loading_images')
		}).show();

	}
	
	//Fetch the photos
	fetchPhotos();
}


/*##################################################################
 
                        GALERY CREATOR 
                        
#####################################################################*/       

/**
 * @description
 * 		The Gallery, creates both gridview and scrollerview
 * @author Daniel Dimov
 * @memberOf Gallery
 * @param {Disctionary} param, Parameters to this method
 * @config {String} albumTitle
 *  @config {String} albumType
 * @config {Photo[]} photos, Array of Photos to be displayed Local or Remote
 * @return {Titanium.UI.ScrollView} Returns a Ti.UI.ScrollView
 */
createGallery = function(param) 
{
	//The photos to be displayed, local or remote
	var photos = param.photos;
	
	//Position of single image on the X axis, changed in the process
	var x = 2;

	//Position of single image on the y axis, changed in the process
	var y = 50;
	
	var _imagesPerCol=4;

	//The first positio  of teh image in the new row
	var defaultX = 2;

	//Number of rows, changed in the process
	var numRows = 0;

	//Number of columns in the current window, changed in the process
	var numCol = 0;
	
	//Link to share
	var _linkToShare="";

	//The thumbnail padding
	var defaultPadding = 5;

	//The width of the the thumbnails
	var defaultWidth = 75;

	//The height of the the thumbnails
	var defaultHeight = 75;
	
	//Set default dimmesnios for screen
	var defaultPortraitWidth=VARS._dpiWidth;
	var defaultPortraitHeight=VARS._dpiHeight;
	var defaultLandScapeWidth=VARS._dpiHeight;
	var defaultLandScapeHeight=VARS._dpiWidth;
	
	//THIS IS FOR iPAD
	if(VARS._platform==VARS._iPad)
	{
		x=10;
		defaultX=10;
		_imagesPerCol=5;
		defaultHeight=140;
		defaultWidth=140;
		defaultPadding=10;
		
		//Set default dimmesnios for screen
	    defaultPortraitWidth=768;
	    defaultPortraitHeight=1024;
	    defaultLandScapeWidth=1024;
	    defaultLandScapeHeight=760;
		
	}
	
	//THIS IS FOR ANDROID
	if(VARS._platform==VARS._android)
	{
		var ldp=Ti.Platform.displayCaps.logicalDensityFactor;
		y=10;
		x*=ldp;
		defaultX*=ldp;
		_imagesPerCol=4;
		defaultHeight*=ldp;
		defaultWidth*=ldp;
		defaultPadding*=ldp;
		
		//Set default dimmesnios for screen
	    defaultPortraitWidth= Ti.Platform.displayCaps.platformWidth;
	    defaultPortraitHeight= Ti.Platform.displayCaps.platformHeight;
	    defaultLandScapeWidth= Ti.Platform.displayCaps.platformHeight;
	    defaultLandScapeHeight=Ti.Platform.displayCaps.platformWidth;
	    
	    //Padding
	    defaultPadding = (Ti.Platform.displayCaps.platformWidth-(_imagesPerCol*defaultWidth))/4;
		
	}

    //Photos view
	var photosView;

    //Indicator for screen state
	var _isFullscreen=false;
	var _isLandscape=false;
    var _isGesture=true;

    //Arrays containg the images for different screen orientataions
	var _viewArray = [];

   

	/**
	 * Update the view to represent the current state
	 */
	var changeState = function() 
	{

		if(!_isFullscreen && !_isLandscape)//Normal, Not in FullScreen, Not in Landscape
		{
			photosView.setWidth(defaultPortraitWidth);
		    photosView.setHeight(defaultPortraitHeight);
			Ti.API.info("Views => " + "Normal, Not in FullScreen, Not in Landscape");
		} else if(_isFullscreen && !_isLandscape)//Vertical, In FullScreen, Not in Landscape
		{
			photosView.setWidth(defaultPortraitWidth);
		    photosView.setHeight(defaultPortraitHeight);
			Ti.API.info("Views => " + "Vertical, In FullScreen, Not in Landscape");
		} else if(!_isFullscreen && _isLandscape)//Horisontal, Not In FullScreen, In Landscape
		{
			photosView.setWidth(defaultLandScapeWidth);
		    photosView.setHeight(defaultLandScapeHeight);
			Ti.API.info("Views => " + "Horisontal, Not In FullScreen, In Landscape");
		} else if(_isFullscreen && _isLandscape)//Horisontal, In FullScreen, In Landscape
		{
			photosView.setWidth(defaultLandScapeWidth);
		    photosView.setHeight(defaultLandScapeHeight);
			Ti.API.info("Views => " + "Horisontal, In FullScreen, In Landscape");
		}

	}
	
	/**
	 * Scroll image, if in not in fullscreen, turn it into full screen
	 * @param {Number} side -1 left, 1 right
	 */
	var scrollImage=function(side)
	{
		if(side==-1)
		{
			var index = (photosView.currentPage - 1 < 0) ? 0 : photosView.currentPage - 1;	
		}
		else if(side==1)
		{
			var index = (photosView.currentPage + 1 >= photosView.views.length) ? photosView.currentPage : photosView.currentPage + 1;
		}
		var view = photosView.views[index];
		_isGesture = false;
		photosView.scrollToView(view);
	}
	
	 var startFBShare=function()
        {
        	if(Facebook.loggedIn) 
				{
					//User is loged in, just share the image
					updateStatus(_linkToShare);

				} 
				else 
				{
					//We need to login the user for firs time
					Facebook.addEventListener('login', logedin);
					Facebook.authorize();
				}
        }
         //After sucessful login, call the action to share the image
		var logedin = function() {
			updateStatus(_linkToShare);
		}
		
	
	/**
	 * Add elements to image window
	 * @param {Number}  index, The image index to start
	 */
	var createImageWin = function(index) 
	{
		//In android display toast
		if(VARS._platform==VARS._android)
		{
			Titanium.UI.createNotification({
    			duration: Ti.UI.NOTIFICATION_DURATION_LONG,
    			message: L('loading_photo')
			}).show();

		}
	
		//Create the elements first as nulls
		var flexSpace = null;
		var leftButton = null;
		var rightButton = null;
		var toolbar = null;

		//Set starting w,h
		var startW=defaultPortraitWidth;
		var startH=defaultPortraitHeight;
		if(_isLandscape)
		{
			startW=defaultLandScapeWidth;
			startH=defaultLandScapeHeight;
		}
		
		//The photo view
		var topPV=0;
		if(VARS._platform==VARS._android)
		{
			topPV="-40dp";
		}
		photosView = Ti.UI.createScrollableView({
			width : startW,
			height : startH,
			top : topPV,
			showPagingControl : VARS._platform==VARS._android,
			pagingControlColor : '#fff',
			maxZoomScale : 2.0,
			currentPage : 0,
			backgroundColor : VARS.rowColor,
		});

        //Go throught all images and create the views
		for(var i = 0, b = photos.length; i < b; i++) 
		{
			//Create the image
			var theImage = Ti.UI.createImageView({
				backgroundColor : VARS.rowColor,
				image : photos[i].image,
				//width : '100%',
				//height : '100%',
			});
			
			
			//Change size in android
			if(VARS._platform==VARS._android)
			{
				top:0;
				theImage.width='auto';
				theImage.height='auto';
			}

			//Assign the image to the array
			_viewArray[i] = theImage;
		}

		//Assign the image views array
		photosView.views = _viewArray;

		//Set visible image
		photosView.currentPage = index;

		//Add the photos view to the image win
		_imageWin.add(photosView);

		//Hide the botom tabs if any
		if(VARS._platform!=VARS._android)
		{
			_imageWin.hideTabBar();
		}
		

		//Creta flexible space
		flexSpace = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		//Create Left button
		leftButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.REWIND
		});
		leftButton.addEventListener('click', function() {
			scrollImage(-1)
		});

		//Create Right button
		rightButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.FAST_FORWARD
		});
		rightButton.addEventListener('click', function() {
			scrollImage(1)
		});

        //Actions / Share Dialog
		var optionsDialogOpts = {
			options : [L('fb'),L('Download'), L('cancel')],
			cancel : 2,
			title : L('share')+" & "+L('Download'),
		};
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
        
        
       
        
		//Add event listener for Share Dialog
		dialog.addEventListener('click', function(e) 
		{
			if(e.index == 0)//Facebook Share
			{
				startFBShare();
			}else if(e.index==1){
				//Download current image
				savetogal(photos[photosView.currentPage].image);
			}
		});

      
		
		//Create the description
		var theDescriptionHolder = Ti.UI.createView({
			width : "100%",
			height : "100dp",
			bottom : 0,
			backgroundColor : "#000000",
			opacity : 0.8
		})
		var theDescription = Ti.UI.createLabel({
			top : "10dp",
			left : "10dp",
			right : "10dp",
			text : photos[index].desc,
			color : "#ffffff"
		})
		theDescriptionHolder.add(theDescription);
		if(photos[index].desc!=""&&photos[index].desc!="undefined"&&photos[index].desc!=null)
			{
				//SHow it
				theDescriptionHolder.opacity=0.8;
				
			}
			else{
				theDescriptionHolder.opacity=0;
			}
			
	
		if (VARS._DisplayDescription) {
			_imageWin.add(theDescriptionHolder);
		}

		
		
			
		if(VARS._platform!=VARS._android)
		{
			theDescriptionHolder.bottom=45;
			// Share button - The action icon
			var share = Titanium.UI.createButton({
				systemButton : Titanium.UI.iPhone.SystemButton.ACTION
			});
			share.addEventListener('click', function() 
			{
				_linkToShare = photos[photosView.currentPage].image;
				dialog.show();
			});
		
		
			//Create download to gal button
			var download = Titanium.UI.createButton({
				systemButton : Titanium.UI.iPhone.SystemButton.ORGANIZE
			});
			download.addEventListener('click', function() {
				savetogal(photos[photosView.currentPage].image);
			});
			
			

			//Crete the bottom toolbar
			toolbar = Ti.UI.iOS.createToolbar({
				items : [share, flexSpace, leftButton, flexSpace, rightButton, flexSpace],
				bottom : 0,
				borderTop : true,
				borderBottom : true,
				barColor : VARS.barColor
			});

			
			
			
			
			//Add the toolbar
			_imageWin.add(toolbar);
		
		
		

		//User clicks on imege -> Go to Fullscreen -> Go Back to normal, in iOS only
		photosView.addEventListener('singletap', function() {
				// If the view is fullscreen the exit fullscreen
				if(_isFullscreen) {
					// Exit fullscreen
					Ti.UI.iPhone.showStatusBar();
					_imageWin.showNavBar();
					toolbar.show();
					_isFullscreen = !_isFullscreen;
					theDescriptionHolder.bottom=45;
					changeState();
				} else {
					// Go fullscreen
					Ti.UI.iPhone.hideStatusBar();
					_imageWin.hideNavBar();
					toolbar.hide();
					_isFullscreen = !_isFullscreen;
					theDescriptionHolder.bottom=0;
					changeState();
				}

			});
		} //END if iOS
    
			
			

		//Users scrolls the image, Go to fullscreen
		photosView.addEventListener('scroll', function(e) {
			if(_isGesture&&VARS._platform!=VARS._android) 
			{
				Ti.UI.iPhone.hideStatusBar();
				_imageWin.hideNavBar();
				toolbar.hide();
				
			    theDescriptionHolder.bottom=0;
				
				if(!_isFullscreen) {
					_isFullscreen = true;
					changeState();
				}

			} else {
				_isGesture = true;
			}

			//Change Window title
			if(photos[e.currentPage].desc!=""&&photos[e.currentPage].desc!="undefined"&&photos[e.currentPage].desc!=null)
			{
				//SHow it
				theDescriptionHolder.opacity=0.8;
				
			}
			else{
				theDescriptionHolder.opacity=0;
			}
			theDescription.text=photos[e.currentPage].desc;
			_imageWin.title = e.currentPage + 1 + ' of ' + photos.length;
		});

	}; 

	
	
	// Create the Grid view
	GridView = Ti.UI.createScrollView({
		contentWidth : defaultPortraitWidth,
		contentHeight : 'auto',
		top : 0,
		backgroundColor : VARS.rowColor,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
	});

	//Itterate all the photos and create thumbnails for them
	for(var i = 0; i < photos.length; i++)
	 {
		// Calculate if new y position is required, new row
		if(numCol == _imagesPerCol && numRows !== 0) {
			y += defaultHeight + defaultPadding;
			x = defaultX;
			numCol = 0;
		}

		// Create a single thumb that is ImageView with this properties
		var thumb = Ti.UI.createImageView({
			image : photos[i].icon,
			width : defaultWidth,
			height : defaultHeight,
			borderColor:VARS.rowOddColor,
			borderWidth:2,
			id : i,
			left : x,
			top : y,
			preventDefaultImage:true,
		});

		// Attach click listener to each thumb
		thumb.addEventListener('click', function(e) 
		{
			// Create a new window and show the image selected
			_imageWin = Ti.UI.createWindow({
				backgroundColor : VARS.rowColor,
				translucent:true,
				barColor : VARS.barColor,
				title : e.source.id + 1 + ' of ' + photos.length,
			});
			_imageWin.orientationModes = [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT, Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT];
			
			
			//In android add menu items
			if(VARS._platform==VARS._android)
			{
				_imageWin.activity.onCreateOptionsMenu = function(e){
  					var menu = e.menu;
  					var menuItemFB = menu.add({ title: L('share_fb') });
  					var menuItemDownload = menu.add({ title: L('download') });
  					menuItemFB.addEventListener("click", function(e) 
  					 {
  					 	_linkToShare = photos[photosView.currentPage].image;
  					 	startFBShare();
    					
  					});
  					menuItemDownload.addEventListener("click", function(e) 
  					 {
  					 	savetogal(photos[photosView.currentPage].image);
  					 	
  					 	
  					});
				};
			}
			// Add elements to the window
			createImageWin(e.source.id);

			// Push the window in the tabbar controller
			Ti.Gesture.addEventListener('orientationchange', function(e) 
			{
				if(e.orientation == Titanium.UI.LANDSCAPE_LEFT || e.orientation == Titanium.UI.LANDSCAPE_RIGHT) 
				{
					//In Horisontal mode
					_isLandscape = true;
					changeState();
				} 
				else 
				{
					//Back to portrait mode
					_isLandscape = false;
					Titanium.UI.orientation = Titanium.UI.PORTRAIT;
					changeState();

				}
			});
			//Open in tab or as window
            if(param.openType==1)
            {
            	param.tab.open(_imageWin);
            }
            else
            {
            	_imageWin.open();
            }
            
            
            
			
		});
		
		//Add thumb to the grid
		GridView.add(thumb);

		//Update the informations about the positions and number of items
		numCol += 1;
		numRows += 1;
		x += defaultWidth + defaultPadding;
	}

    //Return the grid of images
	return GridView;
};


/**
 * Download image and Share
 * @param {String} url The url of the picture to be shared
 * @param {Ti.UI.View} imv The acrion caller
 */
var get_remote_file = function(url) {
	if(VARS._platform!=VARS._android)
	{
		//Set share spiner
   		_imageWin.setRightNavButton(nativespinner);
	}
   
    
	if(Titanium.Network.online) {
		var c = Titanium.Network.createHTTPClient();

		c.setTimeout(10000);
		c.onload = function() {

			if(c.status == 200) 
			{
				var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "toshare.png");
				f.write(this.responseData);
				var image = f.read.blob;
				
				var data = {picture: image};
			    Facebook.requestWithGraphPath('me/photos', data, "POST", showRequestResult);
			}

		};
		c.ondatastream = function(e) {
		};
		c.error = function(e) {
		};
		c.open('GET', url);
		c.send();
	} else {
		alert(L('nc'));
	}

};

//Update facebook status
var updateStatus = function(link) 
{
	//Check once again if logged in, and download and upload the image to Facebook
	if(Facebook.loggedIn) 
	{
		get_remote_file(link);
	}

}


//Call after image is uploaded
function showRequestResult(e) 
{
	if(VARS._platform!=VARS._android)
	{
		_imageWin.setRightNavButton(null);
	}
	var s = '';
	if (e.success) {
		Ti.UI.createAlertDialog({title:L('succ'),message:L('sharedimg')}).show();
	} else if (e.cancelled) {
	} else {
		Ti.UI.createAlertDialog({title:L('error'),message:L('ce')}).show();
	}
}


/**
 * Save image to phone gallery
 */
var savetogal = function(url) 
{
	if(VARS._platform!=VARS._android)
	{
		//Set share spiner
    	_imageWin.setRightNavButton(nativespinner);
	}
	
    
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() {
		if(VARS._platform!=VARS._android)
		{
			//In iphone
			Titanium.Media.saveToPhotoGallery(this.responseData);
			_imageWin.setRightNavButton(null);
		}
		else
		{
			//In Android
			var from=url.lastIndexOf("/");
			var name=url.substring(from,url.length);
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory,name);
            f.write(this.responseData);
            var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory);
            dir.rename(L('tiGallery'));
		}
		
		Titanium.UI.createAlertDialog({
			title : L('pg'),
			message : L('image_doownloaded'),
		}).show();
		
	};
	// open the client
	xhr.open('GET', url);

	// send the data
	xhr.send();

}                


exports.gridCreator=gridCreator;                    

