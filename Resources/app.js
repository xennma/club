var VARS =require('common/globals'); //Here we store all global variables / settings
var Gallery=require('galleries_lib/galleryModule'); //Here are the functions to create the gallery
var Events=require('events_lib/eventsModule'); //Here are the functions to create the events
var Maps=require('maps_lib/mapsModule'); //Here are the functions to create the maos
var Music=require('music_lib/musicModule'); //Here are the functions to create the music
var Contact=require('contact_lib/contactModule'); //Here are the functions to create the contacts


// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//Indicator to see if script is initialized
var galleryInitialized=false;
var eventsInitialized=false;
var mapInitialized=false;
var musicInitialized=false;
var fbInitialized=false;
var ytInitialized=false;
var twInitialized=false;
var contactInitialized=false;



//
// create base UI tab and root window
//

var eventsWindow = Ti.UI.createWindow({
        title:L('events'),
        backgroundColor : VARS.windowBackgroundColor,
        navBarHidden : false,
        barColor : VARS.barColor,
        orientationModes : [Titanium.UI.PORTRAIT]
})
var tabEvents = Titanium.UI.createTab({  
    icon:'/images/tab/agenda.png',
    title:L('events'),
    window:eventsWindow
});
eventsWindow.containingTab=tabEvents;

var galleryWindow = Ti.UI.createWindow({
	    title:L('gallery'),
		backgroundColor : VARS.windowBackgroundColor,
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
})

var tabGallery = Titanium.UI.createTab({  
    icon:'/images/tab/camera.png',
    title:L('gallery'),
    window:galleryWindow
});
galleryWindow.containingTab=tabGallery;



var mapWindow = Ti.UI.createWindow({
	    title:L('map'),
		backgroundColor : VARS.windowBackgroundColor,
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
})
var tabMap = Titanium.UI.createTab({  
    icon:'/images/tab/map.png',
    title:L('map'),
    window:mapWindow
});
var musicWindow = Ti.UI.createWindow({
	    title:L('music'),
		backgroundColor : VARS.windowBackgroundColor,
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
})
var tabMusic = Titanium.UI.createTab({  
    icon:'/images/tab/music.png',
    title:'Music',
    window:musicWindow
});
var facebookWindow = Ti.UI.createWindow({
	    title:L('facebook'),
		backgroundColor : VARS.windowBackgroundColor,
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
})
var tabFacebook = Titanium.UI.createTab({  
    icon:'/images/tab/facebook.png',
    title:L('facebook'),
    window:facebookWindow
});
var youtubeWindow = Ti.UI.createWindow({
	    title:L('youtube'),
		backgroundColor : VARS.windowBackgroundColor,
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
})
var tabYouTube = Titanium.UI.createTab({  
    icon:'/images/tab/youtube.png',
    title:L('youtube'),
    window:youtubeWindow
});
var twitterWindow = Ti.UI.createWindow({
	    title:L('twitter'),
		backgroundColor : VARS.windowBackgroundColor,
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
})
var tabTwitter = Titanium.UI.createTab({  
    icon:'/images/tab/twitter.png',
    title:L('twitter'),
    window:twitterWindow
});

//
// create base UI tab and root window
//
var contactWin= Titanium.UI.createWindow({  
   // tabBarHidden:true,
    title:L('contact'),
	backgroundColor : VARS.windowBackgroundColor,
	navBarHidden : false,
	barColor : VARS.barColor,
	orientationModes : [Titanium.UI.PORTRAIT]
});
var tabContact = Titanium.UI.createTab({  
    icon:'/images/tab/contact.png',
    title:L('contact'),
    window:contactWin
});


// Create More window, used only in Android
var moreWindow=null;
var tabMore=null;
if(VARS._platform==VARS._android)
{
	var moreWindow = Ti.UI.createWindow({
	    title:L('more'),
		backgroundColor : "white",
		navBarHidden : false,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT]
	})
	var tabMore = Titanium.UI.createTab({  
    	icon:'/images/tab/more.png',
    	title:L('more'),
    	window:moreWindow
	});
	
	//Create the table
	var moreTable=Titanium.UI.createTableView({});
	var moreRows=[];
	
	//Add facebook row
	moreRows.push(
		Ti.UI.createTableViewRow({
			title:L('facebook'),
			leftImage:"/images/tab/facebook.png",
			win:facebookWindow,
		})
	);
	
	//Add youtube row
	moreRows.push(
		Ti.UI.createTableViewRow({
			title:L('youtube'),
			leftImage:"/images/tab/youtube.png",
			win:youtubeWindow,
		})
	);
	
	//Add twitter row
	moreRows.push(
		Ti.UI.createTableViewRow({
			title:L('twitter'),
			leftImage:"/images/tab/twitter.png",
			win:twitterWindow,
		})
	);
	
	
	//Add contact row
	moreRows.push(
		Ti.UI.createTableViewRow({
			title:L('contact'),
			leftImage:"/images/tab/contact.png",
			win:contactWin,
		})
	);
	
	moreTable.setData(moreRows);
	moreWindow.add(moreTable);
}


//############### FUNCTIONS ##################
createContact=function()
{
	Contact.createContact({
		win:contactWin,
		title:VARS.contactTitle,
		image:VARS.contactImage,
		imageTitle:VARS.contactImageTitle,
		imageDescription:VARS.contactImageDesc,
		infoText:VARS.contactInfoText,
		numLines:2, //Number of lines for the above text
		phoneNumber:VARS.contactNumber,
		web:VARS.contactSite,
		email:VARS.contactEmail,
		additionalParameters:{
			platform:"iPhone",
			version:"1.1",
		},
		tab:tabContact});
}

createWordPressEvents=function()
{
	Events.createEventsList({
		win:eventsWindow,
		title:"WordPress events",
		url:VARS._WordPress_Address,
		type:VARS._WORD_PRESS,
		openType:1,
		tab:tabEvents});
	//tab1.open(eventsWindow);
}

createFBEvents=function()
{
	Events.createEventsList({
		win:eventsWindow,
		title:L('events'),
		page:VARS._FBPageID,
		type:VARS._FB,
		openType:1,
		tab:tabEvents});
	//tab1.open(eventsWindow);
}

createEBEvents=function()
{
    Events.createEventsList({
        win:eventsWindow,
        title:L('events'),
        appKey:VARS.ebAppKey,
        userName:VARS.ebUserName,
        type:VARS._EB,
        openType:1,
        tab:tabEvents});
    //tab1.open(eventsWindow);
}

//  -------- EXAMPLES HOW TO USE THE GALERIES --------------
	
//Function to create NextGen Gallery
createNextGen=function()
{
	
	Gallery.createGalleryList({
		win:galleryWindow,
		title:L('gallery'),
		id:1,
		url:VARS._NextGen_Address,
		type:VARS._NEXT_GEN,
		openType:1,
		tab:tabGallery});
}

//Function to create Facebook Gallery
createFB=function()
{

		Gallery.createGalleryList({
			win:galleryWindow,
			title:L('gallery'),
			page:VARS._FBPageID,
			type:VARS._FB_GALLERY,
			openType:1,
			tab:tabGallery
		});
}

//Function to create Facebook Gallery
createPicasa=function()
{
	
		Gallery.createGalleryList({
			win:galleryWindow,
			title:L('gallery'),
			userID:VARS._PicasaUserId,
			type:VARS._PICASA,
			openType:1,
			tab:tabGallery
		});
}

//Function to create Flickr Gallery
createFlickr=function()
{

		Gallery.createGalleryList({
			win:galleryWindow,
			title:L('gallery'),
			type:VARS._FLICKR,
			openType:1,
			tab:tabGallery,
			appKEY:VARS._FlickrAppKEY,
			userID:VARS._FlickrUserID,
		});
}
createSingleMap=function()
{
	Maps.createMap({
		win:mapWindow,
		title:VARS._MapWindowTitle,
		locations:VARS._MapLocations,
		openType:1,
		type:VARS._DistanceType,
		mapType:VARS._MapType,
		tab:tabMap});
}
createSoundCloudMusic=function()
{
	Music.createMusicList({
		win:musicWindow,
		title:L('music'),
		user:VARS.SOUND_CLOUD_USER,
		api:VARS.SOUND_CLOUD_API,
		consumer_key:VARS.SOUND_CLOUD_KEY,
		openType:1,
		tab:tabMusic});
}
createYouTubeWeb=function()
{
	if(VARS._plarform!=VARS._android)
	{
		var webviewyt = Titanium.UI.createWebView({
			url : VARS._YT_URL,
		});
		youtubeWindow.add(webviewyt);
	}
	else{
		//In android
		Ti.Platform.openURL(VARS._YT_URL);
	}
	
	
}
createTwitterWeb=function()
{
	var webviewtw = Titanium.UI.createWebView({
		url : VARS._TW_URL,
	});
	twitterWindow.add(webviewtw);
}
createFacebookWeb=function()
{
	var webviewfb = Titanium.UI.createWebView({
		url : VARS._FB_URL,
	});
	facebookWindow.add(webviewfb);
	if(VARS._platform!=VARS._android)
	{
		//This is in iOS
		
		//Create Refresh button
		var refreshFbButton=Ti.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
		})
		facebookWindow.setRightNavButton(refreshFbButton);
		refreshFbButton.addEventListener('click',function(e){
			webviewfb.setUrl(VARS._FB_URL);
		})
		
	}
}


//######################### EVENT LISTENERS #####################
galleryWindow.addEventListener('focus',function(e)
{
	if(!galleryInitialized)
	{
		createFlickr();
		
		galleryInitialized=true;
	}
})
eventsWindow.addEventListener('focus',function(e)
{
	if(!eventsInitialized)
	{
		createEBEvents();
		eventsInitialized=true;
	}
})
mapWindow.addEventListener('focus',function(e)
{
	if(!mapInitialized)
	{
		createSingleMap();
		mapInitialized=true;
	}
})
musicWindow.addEventListener('focus',function(e)
{
	if(!musicInitialized)
	{
		createSoundCloudMusic();
		musicInitialized=true;
	}
})
facebookWindow.addEventListener('focus',function(e)
{
	if(!fbInitialized)
	{
		createFacebookWeb();
		fbInitialized=true;
	}
})
youtubeWindow.addEventListener('focus',function(e)
{
	if(!ytInitialized)
	{
		createYouTubeWeb();
		ytInitialized=true;
	}
})
twitterWindow.addEventListener('focus',function(e)
{
	if(!twInitialized)
	{
		createTwitterWeb();
		twInitialized=true;
	}
})
contactWin.addEventListener('focus',function(e)
{
	if(!contactInitialized)
	{
		createContact();
		contactInitialized=true;
	}
})

//Click listener for Android More table moreTable
if(VARS._platform==VARS._android)
{
	moreTable.addEventListener('click',function(e)
	{
		e.source.win.open();
	});
}




//
//  add tabs
//
tabGroup.addTab(tabMusic);
tabGroup.addTab(tabEvents);  
tabGroup.addTab(tabGallery); 
tabGroup.addTab(tabFacebook);

if(VARS._platform!=VARS._android)
{
	tabGroup.addTab(tabMap); 
	tabGroup.addTab(tabTwitter); 
	tabGroup.addTab(tabYouTube); 
	tabGroup.addTab(tabContact); 
}
else
{
	//In android add the more tab manualy
	tabGroup.addTab(tabMore);  
	
}

 


// open tab group
tabGroup.open();
