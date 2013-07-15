/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content events Module
*/

//Include Required modules
var VARS =require('common/globals');
var API_events=require('events_lib/eventsApi');
var GUI =require('events_lib/eventsGUI');

//############### PRIVATE DATA ################
//Spinerr
var nativespinner = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.SPINNER
});

//In some case ex. in WordPress events we have tab bar, this is the height of it
var tabBarHeight=0;

/**
 * @description Creates window with gallery list retreived from remote server
 * @param {Object} p, Parameters
 * @config {Window} win, the window to open the gallery in
 * @config {String} title, the window title
 * @config {String} type, events Type [_WORD_PRESS,_FB]
 * @config {String} tab, tab to open sub windows
 * ---------- WORD PRESS -----------------
 * @config {String} url, Url of the blog
 * ---------- FACEBOOK -----------------
 * @config {String} page, Page id
 */
exports.createEventsList = function(p)
{
	//################### DATA ######################
	//The data holder
	var dataevents = [];

	//The galleries returned
	var events = [];
	
	//The refresh button
	var refreshButton=Ti.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	})
	
	//################### VIEWS #####################
	var eventsTableView = Titanium.UI.createTableView({
		backgroundColor : VARS.rowColor,
		rowHeight:VARS.rowHeight,
		separatorColor : VARS.separatoColor,
		width : '100%',
	});
	//################## FUNCTIONS ##############
	function setEvents(eventsp) 
	{
		if(VARS._platform!=VARS._android)
		{
			//Set refresg button
			p.win.setRightNavButton(refreshButton);
		}
		
		
		//Clear the data
		dataevents = [];
		events = eventsp;


		//Fill rows with albums data
		for(var j = 0; j < events.length; j++) {
			//Create one row, add to to table, Create album add to rows
			dataevents.push(GUI.creteSimpleRow({
				index:j,
				title:events[j].title,
				icon:events[j].icon,
				id:events[j].id}));
		}

		//Set the data to table
		eventsTableView.setData(dataevents);		
	}

	
	//################## EVENT LISTENERS ############

	eventsTableView.addEventListener('click', function(e) 
	{
		createEventDetail({
			event:events[e.index],
			tab:p.tab,
		})
	});
	
	refreshButton.addEventListener('click',function(e)
	{
		fetchEvents();
	});
	//##################FUNCTIONS ###########################
	//Start fetching facebook events
	fetchFacebookEvents=function()
	{
		//RETREIVE FACEBOOK DATA
		API_events.fetchEventsFB({
				listener : setEvents,
				page: p.page,
			});
	}
	
	//Specific Facebook login Functions
	openFacebook=function()
	{
		Titanium.Facebook.permissions = ['rsvp_event'];
   		Titanium.Facebook.addEventListener('login', fetchFacebookEvents);
    	Titanium.Facebook.forceDialogAuth=true; //Use web dialog to login
    	Titanium.Facebook.authorize(); //Authorize the user
	}
	
	

	//Setup Galleries
	function fetchEvents()
	{
		if(VARS._platform!=VARS._android)
		{
			//Set activity indicator in iphone
			p.win.setRightNavButton(nativespinner);
		}
		
		
		if(p.type==VARS._WORD_PRESS)
		{
			//RETREIVE WORDPRESS DATA
			API_events.fetchEventsWordPress({
				listener : setEvents,
				url: p.url,
			});
		}
		else if(p.type==VARS._FB)
		{
			//If user is  logged in
			if(Titanium.Facebook.loggedIn) 
			{
				//Fetch events
				fetchFacebookEvents();
				
			}
			else
			{
				//Log in
				openFacebook();
				/*p.win.addEventListener('open', function() 
				{
					
					
				});*/
				
			}
			
			
		}
	}
	
	//Add the table to the window
	p.win.add(eventsTableView);
	
	//Set window name
	p.win.title=p.title;
	
	//Fetch events
	fetchEvents();
	
	//In android display toast
	if(VARS._platform==VARS._android)
	{
			Titanium.UI.createNotification({
    			duration: Ti.UI.NOTIFICATION_DURATION_LONG,
    			message: L('loading_events')
			}).show();

	}
	
}



/**
 * Creates single event detail window and opens it in the tab send as parameter
 * @param {Object} p
 * @config {Tab} tab, the tab the event to be oppened in
 * @config {Enent} event, the event to be displayed
 */

createEventDetail = function(p) 
{
	//################## DATA ###################
	var tableEDTop = "0dp" //Table top
	var tableEDBottom = "0dp"; //Table bottom

	//The event to be displayed
	var eventToDisplay = p.event;

	//################## VIEWS #######################
	var eventDetailWindow = Ti.UI.createWindow({
		title : L('event'),
		backgroundColor : VARS.windowBackgroundColor,
		barColor : VARS.barColor,
		orientationModes : [Titanium.UI.PORTRAIT,Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT],
	});

	var linkBtn = GUI.myButton({
		conf:{
			height : "32dp",
			width : "100dp",
		},
		text:L('link')
	});
	var joinBtn = GUI.myButton({
		conf:{
			height : "32dp",
			width : "100dp",
		},
		text:L('join')
	});

    //IN iPhone & iPad
	if(VARS._platform!=VARS._android) 
	{
		//Display all by default but if it is wordpress hide the join button
		items= [GUI.flexSpace, linkBtn, GUI.flexSpace, joinBtn, GUI.flexSpace];
		if(eventToDisplay.type==VARS._WORD_PRESS)
		{
			items= [GUI.flexSpace, linkBtn, GUI.flexSpace];
		}
		// create and add toolbar
		var eventsDetailToolbar = Titanium.UI.iOS.createToolbar({
			items : items,
			bottom : 0,
			borderTop : true,
			borderBottom : false,
			translucent : true,
			barColor : VARS.barColor,

		});
		eventDetailWindow.add(eventsDetailToolbar);
		tableEDBottom =50;
	} 
	//In android
	else 
	{
		//Create the bottom bar
		var bottomEDBar = Ti.UI.createView({
			width : "100%",
			height : "40dp",
			bottom : "0dp",
			backgroundColor : "#999"
		});
		tableEDBottom = bottomEDBar.height;
		linkBtn.left = "45dp";
		joinBtn.left = "175dp";
		
		if(eventToDisplay.type==VARS._FB)
		{
			bottomEDBar.add(joinBtn);
			bottomEDBar.add(linkBtn);
		}
		else
		{
			linkBtn.left = "110dp";
			bottomEDBar.add(linkBtn);
		}
		
		
		eventDetailWindow.add(bottomEDBar);

	}

	//Create image
	var image = Titanium.UI.createImageView({
		image : eventToDisplay.icon,
		preventDefaultImage : true,
		width : "65dp",
		height : "65dp",
		left : "15dp",
		top : "5dp",
	});

    //Title
	var title = Ti.UI.createLabel({
		font:{
			fontSize : 16,
			fontWeight : 'bold'
			},
		color : VARS.fontColor,
		left : "90dp",
		top : "24dp",
		height : 'auto',
		width : 'auto',
		clickName : title,
		text : eventToDisplay.title
	});

    //Top part of the table
	var topInfo = Ti.UI.createView({
		left : "15dp",
		top : "5dp",
		height : "85dp",
		width : 'auto'
	});
	//Add top elements
	topInfo.add(image);
	topInfo.add(title)
	
	

    //Table view elements
	var eventDetailData = [];

    //in iOS - Table setup
	if(VARS._platform!=VARS._android)
	 {
		eventDetailData[0] = Ti.UI.createTableViewSection({
			headerView : topInfo
		});
	} 
	//In android
	else 
	{
		eventDetailData[0] = Ti.UI.createTableViewSection({});
		eventDetailWindow.add(topInfo);
		tableEDTop = topInfo.height;
	}

    //Start + End data
	eventDetailData[0].add(Ti.UI.createTableViewRow({
		backgroundColor : VARS.rowColor,
		color : VARS.fontColor,
		title : L('start') + " " + eventToDisplay.start_date
	}));
	eventDetailData[0].add(Ti.UI.createTableViewRow({
		backgroundColor : VARS.rowColor,
		color : VARS.fontColor,
		title : L('end') + " " + eventToDisplay.end_date
	}));

   //Create header description
	var descHeaderView = Ti.UI.createView({
		height:"30dp",
	});

	var des = Ti.UI.createLabel({
		text : L('desc'),
		color : VARS.fontColor,
		left : "10dp",
		bottom : "5dp",

	});
	if(VARS._platform==VARS._iPad)
	{
		des.text="        "+ L('desc');
	}
	descHeaderView.add(des);
	eventDetailData[1] = Ti.UI.createTableViewSection({
		headerView : descHeaderView
	});

    //Create description row
	var desc = Ti.UI.createTableViewRow({
		backgroundColor : VARS.rowColor,
		color : VARS.fontColor,
		height : 'auto'
	});

    //Add the text fiels
    var descText=Ti.UI.createLabel({
		text : eventToDisplay.desc,
		height : 'auto',
		width : 'auto',
		left : "10dp",
		right : "10dp",
		top :"5dp",
		bottom : "5dp",
		color : VARS.fontColor,
	})
	desc.add(descText);
	eventDetailData[1].add(desc);
	
	

    //Create the table
	var eventItemstableView = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor : 'transparent',
		top : tableEDTop,
		bottom : tableEDBottom,
		data : eventDetailData
	});
	eventDetailWindow.add(eventItemstableView);
	//##################### FUNCTIONS ############################
	//Register user to facebook event
	attendingEvent=function(event_id)
	{
	//Attending events
	Titanium.Facebook.requestWithGraphPath(event_id+"/attending", {}, 'POST', showEventsAttendingResult);

	//Parse the results
	function showEventsAttendingResult(r) {
       if (!r.success) {
			if (r.error) {
				Ti.UI.createAlertDialog({title:L('error'),message:r.error}).show();
			} else {
				Ti.UI.createAlertDialog({title:L('error'),message:L('uns')}).show();
			}
			return;
		}
		else{
			Ti.UI.createAlertDialog({message:L('reserved')+" "+eventToDisplay.title,title:L('cong')}).show();
		}
		
		}
	}
	
	//##################### EVENT LISTENERS ######################
	linkBtn.addEventListener('click',function(e)
	{
		Ti.Platform.openURL(eventToDisplay.link);
	})
	
	joinBtn.addEventListener('click',function(e)
	{
        attendingEvent(eventToDisplay.id);
	})

	//Open the window into the tab
	p.tab.open(eventDetailWindow);
	
}

