/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content music Module
*/

//Include Required modules
var VARS =require('common/globals');
var API_music=require('music_lib/musicAPI');
var GUI =require('music_lib/musicGUI');

//############### PRIVATE DATA ################
//Spinerr
var nativespinner = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.SPINNER
});

//In some case ex. in WordPress music we have tab bar, this is the height of it
var tabBarHeight=0;

/**
 * @description Creates window with gallery list retreived from remote server
 * @param {Object} p, Parameters
 * @config {Window} win, the window to open the gallery in
 * @config {String} title, the window title
 * @config {String} tab, tab to open sub windows
 * ---------- SOUND CLOUD -----------------
 * @config {String} user
 * @config {String} api
 * @config {String} consumer_key
 */
exports.createMusicList = function(p)
{
	//################### DATA ######################
	//The data holder
	var datamusic = [];

	//The galleries returned
	var music = [];
	
	//The refresh button
	var refreshButton=Ti.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	})
	
	//################### VIEWS #####################
	var musicTableView = Titanium.UI.createTableView({
		backgroundColor : VARS.rowColor,
		rowHeight:VARS.rowHeight,
		separatorColor : VARS.separatoColor,
		width : '100%',
	});
	//################## FUNCTIONS ##############
	function setmusic(musicp) 
	{
		if(VARS._platform!=VARS._android)
		{
			//Set refresg button
			p.win.setRightNavButton(refreshButton);
		}
		
		
		//Clear the data
		datamusic = [];
		music = musicp;


		//Fill rows with albums data
		for(var j = 0; j < music.length; j++) {
			//Create one row, add to to table, Create album add to rows
			datamusic.push(GUI.creteSimpleRow({
				index:j,
				title:music[j].title,
				icon:music[j].icon,
				id:music[j].id}));
		}

		//Set the data to table
		musicTableView.setData(datamusic);		
	}

	
	//################## EVENT LISTENERS ############

	
	musicTableView.addEventListener('click', function(e) {
		//Get transaction id
		songId = (music[e.index]).id;
		songTitle = (music[e.index]).title;

		if(VARS._platform != VARS._android) {
			var webview = Titanium.UI.createWebView({
				url : songId,
				autoPlay:true
			});
			var webWin = Titanium.UI.createWindow({
				title : songTitle,
				backgroundColor : '#2e2e2e',
				tabBarHidden : false,
				navBarHidden : false,
				barColor : '#3e3e3c',
				autoPlay: true
			});
			webWin.add(webview);
			Ti.Gesture.addEventListener('orientationchange', function(e) {

				webWin.orientationModes = [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT, Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT];
				if(e.orientation == Titanium.UI.LANDSCAPE_LEFT || e.orientation == Titanium.UI.LANDSCAPE_RIGHT) {
					// Do anything you wanna do when user changes the orientation to LandScape
					webWin.orientation = Titanium.UI.LANDSCAPE_RIGHT;

				} else {
					// Revert the changes you made, the user is back to portrait mode
					webWin.orientation = Titanium.UI.PORTRAIT;

				}
			});

			//webWin.hideTabBar();
			p.tab.open(webWin);
		} else {
			Ti.Platform.openURL(songId);
		}

	}); 

	
	refreshButton.addEventListener('click',function(e)
	{
		fetchmusic();
	});
	//##################FUNCTIONS ###########################
	//Setup Music
	function fetchmusic()
	{
		if(VARS._platform!=VARS._android)
		{
			//Set activity indicator in iphone
			p.win.setRightNavButton(nativespinner);
		}
		
		
		API_music.fetchSCSongs({
				listener : setmusic,
				user:p.user,
				type:p.api,
				consumer_key:p.consumer_key,
			});
	}
	
	//Add the table to the window
	p.win.add(musicTableView);
	
	//Set window name
	p.win.title=p.title;
	
	//Fetch music
	fetchmusic();
	
	//In android display toast
	if(VARS._platform==VARS._android)
	{
			Titanium.UI.createNotification({
    			duration: Ti.UI.NOTIFICATION_DURATION_LONG,
    			message: L('loading_music')
			}).show();

	}
	
}