/**
 * @author Daniel Daniel
 * @email dimovdaniel@yahoo.com
 * @content events Retrival 
 */
//Include the date object 
//Ti.include('common/date.js')
var VARS =require('common/globals');
var Facebook = require('facebook');
require('common/date');
//Listener for the resulr 
var listener=null;

/**
 * @description
 *  Fetch all posts from the WordPress
 * @param {Object} param, Default Null
 * @config {Function} listener Listener for the result
 * @config {String} url, the url of the wordpress blog
 * @return {Event[]} ArrayList of events
 */
exports.fetchEventsWordPress=function(param)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		var eventsJSON=(JSON.parse(this.responseText)).posts;
		var events=[];
		for(var j = 0; j < eventsJSON.length; j++) 
		{
			var start=eventsJSON[j].custom_fields._event_start_date[0]+" "+eventsJSON[j].custom_fields._event_start_time[0];
            var end=eventsJSON[j].custom_fields._event_end_date[0]+" "+eventsJSON[j].custom_fields._event_end_time[0];
            if(VARS._platform!=VARS._android)
            {
                start=Date.parse(start).toString(VARS._DateFormat);
                end=Date.parse(end).toString(VARS._DateFormat);
            }
	
			var thumbail=eventsJSON[j].thumbnail;
			if(typeof eventsJSON[j].attachments[0]!="undefined")
			{
				
				thumbail=eventsJSON[j].attachments[0].images.thumbnail.url;
			}
			Ti.API.info("Thumbnail ok:"+thumbail);
			
			var eventToAdd={
				id:eventsJSON[j].id,
				title:eventsJSON[j].title,
				desc:eventsJSON[j].excerpt.replace(/<\/?[^>]+(>|$)/g, ""),
				icon:thumbail,
				link:eventsJSON[j].url,
				type:VARS._WP,
				start_date:start,
				end_date:end,
			}
			
			events.push(eventToAdd);
		}
		param.listener(events);
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	var recentRetreive=param.url+"?json=get_recent_posts&post_type=event&custom_fields=_event_start_date,_event_start_time,_event_end_date,_event_end_time"
	Ti.API.info(recentRetreive);
	xhr.open("GET",recentRetreive);
	xhr.send({});
}


exports.fetchEventsFB=function(p)
{
	//Get events
	var query='SELECT eid, name, pic_small,ticket_uri,description, start_time,end_time, location FROM event WHERE  eid IN (SELECT eid FROM event_member WHERE uid = '+p.page+' )';
    Ti.API.info(query);
    Facebook.requestWithGraphPath("fql", {q:query,access_token:Facebook.appid+"|"+VARS.fbappsecret}, 'GET', showEventsResult);

	//Parse the results
	function showEventsResult(r) {
       if (!r.success) {
			if (r.error) {
				Ti.UI.createAlertDialog({title:L('error'),message:r.error}).show();
			} else {
				Ti.UI.createAlertDialog({title:L('error'),message:L('uns')}).show();
			}
			return;
		}
		Ti.API.info(r.result)
		
		var eventsJSON=JSON.parse(r.result);
		eventsJSON=eventsJSON.data;
		var events=[];
		
		
		
		
		for(var j = 0; j < eventsJSON.length; j++) 
		{
			//Create the albums
			var eventToAdd={
				id:eventsJSON[j].eid,
				title:eventsJSON[j].name,
				desc:eventsJSON[j].description,
				icon:eventsJSON[j].pic_small,
				cover:eventsJSON[j].pic_cover,
				link:eventsJSON[j].ticket_uri||"http://m.facebook.com/events/"+eventsJSON[j].eid+"/",
				type:VARS._FB
			}
			if(eventsJSON[j].start_time&&eventsJSON[j].start_time.length>10){
				var st=eventsJSON[j].start_time;
				start=new Date(parseInt(st.substring(0,4)),parseInt(st.substring(5,7))-1,parseInt(st.substring(8,10)),parseInt(st.substring(11,13)),parseInt(st.substring(14,16)),0);
				eventToAdd.start_date=start.toString(VARS._DateFormat);
				if(VARS.isAndroid){
					eventToAdd.start_date=start.getDayName()+" "+start.getMonthName()+" "+start.getDay()+" "+start.getFullYear()+" "+start.getHours()+":"+start.getMinutes();
				}
			}else
			{
				eventToAdd.start_date="";
			}
			if(eventsJSON[j].end_time&&eventsJSON[j].end_time.length>10){
				var st=eventsJSON[j].end_time;
				end=new Date(parseInt(st.substring(0,4)),parseInt(st.substring(5,7))-1,parseInt(st.substring(8,10)),parseInt(st.substring(11,13)),parseInt(st.substring(14,16)),0);
				eventToAdd.end_date=end.toString(VARS._DateFormat);
				if(VARS.isAndroid){
					eventToAdd.end_date=end.getDayName()+" "+end.getMonthName()+" "+end.getDay()+" "+end.getFullYear()+" "+end.getHours()+":"+end.getMinutes();
				}
			}else
			{
				eventToAdd.end_date="";
			}
			events.push(eventToAdd);
				/*eventsJSON[j].name,
				eventsJSON[j].description,
				 eventsJSON[j].pic_small,
				eventsJSON[j].eid,
				(new Date(eventsJSON[j].start_time)),
				(new Date(eventsJSON[j].end_time)),
				"http://m.facebook.com/events/"+eventsJSON[j].eid+"/",
				VARS._FB));*/
		}
		p.listener(events);
	}
}

/**
 * Fetch Event Brite events
 * @param {Object} param
 * @config {String} appKey
 * @config {String} userName
 * @config {Function} listener
 */
var fetchEventBriteEvents=function(param){
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function()
    {
        var eventsJSON=(JSON.parse(this.responseText)).events;
        var events=[];
        for(var j = 0; j < eventsJSON.length; j++) 
        {
            var currentEvent=eventsJSON[j].event;
            var start=currentEvent.start_date;
            var end=currentEvent.end_date;
            if(VARS._platform!=VARS._android)
            {
                start=Date.parse(start).toString(VARS._DateFormat);
                end=Date.parse(end).toString(VARS._DateFormat);
            }
    
            var thumbail=currentEvent.logo;
                      
            var eventToAdd={
                id:currentEvent.id,
                title:currentEvent.title,
                desc:currentEvent.description.replace(/<\/?[^>]+(>|$)/g, ""),
                icon:thumbail,
                link:currentEvent.url,
                type:VARS._EB,
                start_date:start,
                end_date:end,
            }
            
            events.push(eventToAdd);
        }
        param.listener(events);
    };
    xhr.onerror = function(e){
        alert(L('error'));
        param.listener([]);//Send empty result set
    };
    var recentRetreive="https://www.eventbrite.com/json/user_list_events?app_key="+param.appKey+"&user="+param.userName
    Ti.API.info(recentRetreive);
    xhr.open("GET",recentRetreive);
    xhr.send({});
}
exports.fetchEventBriteEvents=fetchEventBriteEvents;
//###################### CLASSES #######################
var Event=function(title, desc, icon,id,start_date,end_date,link,type)
{
	this.id=id;
	this.title=title;
	this.desc=desc;
	this.icon=icon;
	this.start_date=start_date;
	this.end_date=end_date;
	this.link=link;
	this.type=type; //Type of the ecent[_WORD_PRESS,_FB]
}