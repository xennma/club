//################# USER DATA ######################
//Settings for facebook
var fb = require('facebook');
fb.appid = '< YOUR FACEBOOK APP ID >';
fb.permissions = ['publish_stream', 'read_stream'];;
fb.forceDialogAuth = true;
exports.fbappsecret="< YOUR FACEBOOK APP SECRET >";  // Can be found in https://developers.facebook.com/apps,, Without this FB gallery will not work


//Gallery Settings
exports._NextGen_Address="http://nextwebart.com/clients/lucy/wp-content/";  //This is the structure of the url. for more info read the docs
exports._PicasaUserId="107364038100454040000";   //FIND your picasa user id and enter it here
exports._FlickrAppKEY="1e41628a60f96bec1d00c9c6453f9ebf"; // REGISTER for your own Flick APP ID, This will be functional for short period of time
exports._FlickrUserID="52617155@N08" //FIND YOUR FLICKR USER ID ---> http://idgettr.com/

exports._DisplayDescription=true;  //true / false  to display description in the image if it exists 
exports._PhotoLimitFacebook=30; //Change the value here how many photos you want to fetch

//Events Settings
exports._WordPress_Address="http://nextwebart.net/demo/wordpress/";  //This is the structure of the url. for more info read the docs
exports._FBPageID="222129001144639";
exports.ebAppKey="CYB6GTPNII3VZNDMCV"; //Settings if you user Event brite API
exports.ebUserName="calero.luis@gmail.com";

//Map Settings
exports._MapWindowTitle="Our Discotheques";
Ti.Geolocation.purpose = "We will use your location for XXXX...";
exports._DistanceType=0; // [0-In kilometers , 1 - in Milles ]
exports._MapType=Titanium.Map.STANDARD_TYPE; //[STANDARD_TYPE,HYBRID_TYPE,SATELLITE_TYPE,TERRAIN_TYPE]
exports._MapLocations=[
	{
		title:"Ministry of Sound NY",
		latlon:"40.7142,-74.0064",
		subTitle:"5th Avenue",
		icon:"../images/liberty-icon.png",
		icon_small:"../images/liberty-icons.png",
	},
	{
		title:"Paris",
		latlon:"48.8742,2.3470",
		subTitle:"Rue di travaile",
		icon:"../images/eiffel-icon.png",
		icon_small:"../images/eiffel-icons.png",
	},
	{
		title:"London",
		latlon:"51.5171,0.1062",
		subTitle:"Underground Metro",
		icon:"../images/bigben-icon.png",
		icon_small:"../images/bigben-icons.png",
	},
	{
		title:"Rome",
		latlon:"41.9,12.5",
		subTitle:"Main streat in Rome",
		icon:"../images/colosseum-icon.png",
		icon_small:"../images/colosseum-icons.png",
	},
	{
		title:"Cairo",
		latlon:"30.0566,31.2262",
		subTitle:"Cairo Main Streat",
		icon:"../images/egypt-icon.png",
		icon_small:"../images/egypt-icons.png",
	}]

//MUSIC SETTINGS
exports.SOUND_CLOUD_USER="ministryofsound",
exports.SOUND_CLOUD_API='tracks', //['favorites,tracks']
exports.SOUND_CLOUD_KEY='50eb94efd1ac722c9428af41360571fe',

//Web View settings
exports._YT_URL="http://www.youtube.com/ministryofsound";
exports._FB_URL="http://www.facebook.com/ministryofsoundclub";
exports._TW_URL="https://twitter.com/#!/ministryofsound";


//Contact Data
exports.contactTitle="Contact";
exports.contactImage="images/contactphoto.jpg";
exports.contactImageTitle="Hotel Central Palace";
exports.contactImageDesc="5th Avenue 25/11 \nNew York City ";
exports.contactNumber="38978203673";
exports.contactEmail="dimovdaniel@yahoo.com";
exports.contactSite="http://www.nextwebart.com";
exports.contactInfoText="We will respond to eny mail within 24h.\nThanks for understanding";
exports.contactPHPLocation="http://nextwebart.com/clients/sendmail.php"

//The format that date us displayed in
exports._DateFormat="yyyy-MMM-d HH:mm";

//################# GLOBAL COLORS ###################
exports.separatoColor="black";
exports.rowColor="#1f1f1f";
exports.rowOddColor="#2a2a2a";
exports.windowBackgroundColor="#2a2a2a";
exports.barColor="#3e3e3c";
exports.fontColor="#ffffff";
exports.imageFrameColor="black";
exports.formTextColor="white";
exports.formBgColor="white";
exports.buttonColor="#010101";

//################# STATIC DATA #####################
exports._NEXT_GEN="nextgen";
exports._FB_GALLERY="fb";
exports._PICASA="pic";
exports._FLICKR="flic";
exports._FB="fb";
exports._SINGLE_MAP="sm";
exports._WP="wp";
exports._EB="eventbrite";

exports._iPad="ipad";
exports._iPhone="iphone";
exports._android="android";

exports._platform=Ti.Platform.osname;


exports._platform=Ti.Platform.osname;
exports._iOS=(Ti.Platform.osname=="ipad"||Ti.Platform.osname=="iphone");
var isAndroid=Ti.Platform.osname=="android";
exports.isAndroid=isAndroid;


//Android fix
if(Ti.Platform.osname=="android")
{
	exports.contactImage="../"+exports.contactImage;
}

//################# TEXT FORMATS ###################
exports.h1={fontSize:"18dp", fontStyle:'bold', fontWeight:'bold'}
exports.h2={fontSize:"15dp", fontStyle:'bold', fontWeight:'bold'}
exports.h3={fontSize:"12dp", fontStyle:'bold', fontWeight:'bold'}
exports.normal={fontSize:"11dp"}
exports.empahasys={fontSize:"10dp", fontStyle:'italic'}
