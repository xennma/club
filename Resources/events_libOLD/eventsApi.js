/**
 * @author Daniel Daniel
 * @email dimovdaniel@yahoo.com
 * @content events Retrival 
 */
//Include the date object 
Ti.include('common/date.js')
var VARS =require('common/globals');

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
			//Create the albums
			events.push(new Event(
				eventsJSON[j].title,
				eventsJSON[j].post_content,
				eventsJSON[j].thumbnail,
				eventsJSON[j].id,
				start,
				end,
				eventsJSON[j].url,
				VARS._WORD_PRESS));
		}
		param.listener(events);
	};
	xhr.onerror = function(e){
		alert(L('error'));
		param.listener([]);//Send empty result set
	};
	var recentRetreive=param.url+"?json=get_recent_posts&post_type=event&custom_fields=_event_start_date,_event_start_time,_event_end_date,_event_end_time"
	xhr.open("GET",recentRetreive);
	xhr.send({});
}


exports.fetchEventsFB=function(p)
{
	//Get events
	var query='SELECT eid, name, pic_small, description, start_time,end_time, location'
       query+=' FROM event WHERE creator = '+p.page+' AND eid IN (SELECT eid'
       query+=' FROM event_member WHERE uid = '+p.page+' );'
	Titanium.Facebook.request('fql.query', {query: query},  showEventsResult);

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
		var events=[];
		for(var j = 0; j < eventsJSON.length; j++) 
		{
			//Create the albums
			events.push(new Event(
				eventsJSON[j].name,
				eventsJSON[j].description,
				 eventsJSON[j].pic_small,
				eventsJSON[j].eid,
				(new Date(eventsJSON[j].start_time*1000)).toString(VARS._DateFormat),
				(new Date(eventsJSON[j].end_time*1000)).toString(VARS._DateFormat),
				"http://m.facebook.com/events/"+eventsJSON[j].eid+"/",
				VARS._FB));
		}
		p.listener(events);
	}
}

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