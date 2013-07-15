/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content maps Module
* @version 2.0
*/

//Include Required modules
var VARS =require('common/globals');
var GUI =require('maps_lib/mapGUI');    

/**
 * @description Creates window with map
 * @param {Object} p, Parameters
 * @config {Window} win, the window to open the gallery in
 * @config {String} title, the window title
 * @config {Int} type, type of the distance [0-In kilometers , 1 - in Milles ]
 * @config {Int} mapType, type of the map [0-In kilometers , 1 - in Milles ]
 * @config {String} tab, tab to open sub windows
 * @config {String} locations, Location Object
 */
exports.createMap = function(p) 
{

//################ DATA ###################
	//Change the name of the window
	p.win.title = p.title;
	var MapModule = Titanium.Map;
	if(VARS._platform==VARS._android){
	    MapModule = require('ti.map');
	}

	//Array for the locations
	var locations = [];

	for( i = 0; i < p.locations.length; i++) 
	{
		if(Ti.Platform.osname=="ipad"||Ti.Platform.osname=="iphone")
		{ 
			//Remove "../" in ios
			p.locations[i].icon=p.locations[i].icon.replace("../","");
			p.locations[i].icon_small=p.locations[i].icon_small.replace("../","");
		}
		
		var l = MapModule.createAnnotation({
			latitude : p.locations[i].latlon.split(',')[0],
			longitude : p.locations[i].latlon.split(',')[1],
			title : p.locations[i].title,
			subtitle : p.locations[i].subTitle,
			pincolor : Titanium.Map.ANNOTATION_RED,
			animate : true,
			rightButton : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
			leftButton:p.locations[i].icon_small,
			myid : i // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
		});
		locations.push(l);
	}

	//############### VIEWS #####################
	var mapview = MapModule.createView({
		mapType : p.mapType,
		region : {
			latitude : p.locations[0].latlon.split(',')[0],
			longitude : p.locations[0].latlon.split(',')[1],
			latitudeDelta : 0.5,
			longitudeDelta : 0.5
		},
		animate : true,
		regionFit : true,
		userLocation : true,
	});
	
	//The List window
	var listWindow=Ti.UI.createWindow({
		title:"List of locations",
		barColor:p.win.barColor,
	});
	
	//Fill rows with map list data
	dataLocations = [];
		for(var j = 0; j < p.locations.length; j++) {
			//Create one row, add to to table, Create album add to rows
			dataLocations.push(GUI.creteSimpleRow({
				index:j,
				title:p.locations[j].title,
				icon:p.locations[j].icon,
				id:j}));
		}
	
	
	//Location list
	var locationsTableView = Titanium.UI.createTableView({
				backgroundColor : VARS.rowColor,
				rowHeight:VARS.rowHeight,
				separatorColor : VARS.separatoColor,
				width : '100%',
			});
	//Set the data to table
	locationsTableView.setData(dataLocations);	
	listWindow.add(locationsTableView)
	
	if(Ti.Platform.osname=="ipad"||Ti.Platform.osname=="iphone")
	{
		var options=Ti.UI.createButton({
			style:Ti.UI.iPhone.SystemButtonStyle.BORDERED,
			title:"List",
		});
		options.addEventListener('click',function(e)
		{
			p.tab.open(listWindow);
		});
		p.win.setRightNavButton(options);
		
	}
	else{
		//In android add menu items
		p.win.activity.onCreateOptionsMenu = function(e){
  					var menu = e.menu;
  					var menuItemList = menu.add({ title: "List" });
  					menuItemList.addEventListener("click", function(e) 
  					 {
    					listWindow.open();
  					});
				};
		
	}
	
	

	//#################### FUNCTIONS ###################

	function toRad(Value) {
		/** Converts numeric degrees to radians */
		return Value * Math.PI / 180;
	}

	getDistance = function(lat1, lon1, lat2, lon2) {

		var R = 6371;

		// km
		var dLat = toRad(lat2 - lat1);
		var dLon = toRad(lon2 - lon1);
		var lat1 = toRad(lat1);
		var lat2 = toRad(lat2);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		d = Math.round(d * 1000);
		if(p.type == 0) {
			if(d > 999) {
				return Math.round(d / 1000) + " km";
			} else {
				return d + " meters";
			}
		} else if(p.type == 1) {
			//Miles
			return Math.round(d * 0.000621371192) + " miles";
		}
	}
	
	
	//
	// GET CURRENT POSITION - THIS FIRES ONCE
	//
	if (Titanium.Geolocation.locationServicesEnabled === false)
	{
		Titanium.UI.createAlertDialog({title:'Error occured', message:'Your device has geo turned off - turn it on.'}).show();
	}
	else
	{
		//in iPhone and iPad
		Titanium.Geolocation.getCurrentPosition(function(e) {
				if(!e.success || e.error) {
					alert('error ' + JSON.stringify(e.error));
					
				}
				else{
					var longitude = e.coords.longitude;
					var latitude = e.coords.latitude;
					for( i = 0; i < locations.length; i++) {
						var l1 = (getDistance(latitude, longitude, locations[i].latitude, locations[i].longitude));
						locations[i].subtitle += " - " + l1;
					}
				}

				
		
				
				mapview.addAnnotations(locations);
			});
		
	}
	
	

	//#################### EVENT LISTENRS ##############
    locationsTableView.addEventListener('click',function(e)
    {
    	mapview.selectAnnotation(locations[e.index])
    	listWindow.close();
    })
    
	mapview.addEventListener('click', function(e) 
	{
		
		if(e.clicksource == 'rightButton'||e.clicksource == 'leftPane') {
			if(VARS._platform!=VARS._android)
			{
				Ti.Platform.openURL("http://maps.google.com/maps?q=" + e.annotation.latitude+","+e.annotation.longitude);
			}
			else{
				Ti.Platform.openURL("http://maps.google.com/maps?q=" + e.latitude+","+e.longitude);
			}
			
		}
	})

	p.win.add(mapview);

}


