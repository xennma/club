/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content Contains GUI creators and default styles
*/

var VARS =require('common/globals');

//######################### COLORS ##################
var textColor="white";
var tableBackgroundColor="black";

//######################## SIZES ####################
var rowHeight="65dp";
var imageHeight="55dp";
var imageWidth="55dp";

//############# FLEX SPACE ##########################
exports.flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

//############# Simple box creators ##################
exports.createContactForm=function(p)
{
	var form_holder=Ti.UI.createView({
		borderRadius:5,
		width:"95%",
		top:p.top,
		backgroundColor:VARS.rowColor,
		height:"300dp",
	})
	
	//Create Name elements
	var nameLabel=Ti.UI.createLabel({
		color:VARS.formTextColor,
		text:L('name'),
		width:"70dp",
		left:"10dp",
		top:"10dp",
		textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT
	})
	form_holder.add(nameLabel);
	
	var nameField=Ti.UI.createTextField({
		width:"200dp",
		left:"90dp",
		top:"10dp",
		backgroundColor:VARS.formBgColor,
		//borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	})
	if(VARS._platform==VARS._android)
	{
		nameField.top="8dp";
		nameField.font={size:"7dp"};
		nameField.borderRadius=5;
	}
	form_holder.add(nameField);
	form_holder.name=nameField;
	
	//Create Email elements
	var emailLabel=Ti.UI.createLabel({
		color:VARS.formTextColor,
		text:L('email'),
		width:"70dp",
		left:"10dp",
		top:"45dp",
		textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT
	})
	
	
	var emailField=Ti.UI.createTextField({
		width:"200dp",
		left:"90dp",
		top:"45dp",
		backgroundColor:VARS.formBgColor,
		//borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	})
	if(VARS._platform==VARS._android)
	{
		emailField.top="48dp";
		emailLabel.top="50dp";
		emailField.font={size:"7dp"};
		emailField.borderRadius=5;
	}
	form_holder.add(emailLabel);
	form_holder.add(emailField);
	form_holder.email=emailField;
	
	
	//Create Phone elements
	var phoneLabel=Ti.UI.createLabel({
		color:VARS.formTextColor,
		text:L('phone'),
		width:"70dp",
		left:"10dp",
		top:"80dp",
		textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT
	})
	
	
	var phoneField=Ti.UI.createTextField({
		width:"200dp",
		left:"90dp",
		top:"80dp",
		backgroundColor:VARS.formBgColor,
		//borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	})
	if(VARS._platform==VARS._android)
	{
		phoneField.top="88dp";
		phoneLabel.top="90dp";
		phoneField.font={size:"7dp"};
		phoneField.borderRadius=5;
	}
	form_holder.add(phoneLabel);
	form_holder.add(phoneField);
	form_holder.phone=phoneField;
	
	//Create Message elements
	var messageLabel=Ti.UI.createLabel({
		color:VARS.formTextColor,
		text:L('message'),
		width:"73dp",
		left:"10dp",
		top:"115dp",
		textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT
	})
	
	
	var messageField=Ti.UI.createTextArea({
		width:"96%",
		height:"100dp",
		top:"142dp",
		editable: true,
		color:'black',
		textAlign:'left',
	    borderWidth:1,
		borderColor:'#black',
		borderRadius:5,
		backgroundColor:"white"
	})
	if(VARS._platform==VARS._android)
	{
		messageField.top="152dp";
		messageField.height="90dp";
		messageLabel.top="125dp";
	}
	form_holder.add(messageLabel);
	form_holder.add(messageField);
	form_holder.message=messageField;
	
	return form_holder;
}

exports.creteContactImage=function(p)
{
	var image_holder=Ti.UI.createView({
		borderRadius:5,
		width:"95%",
		top:"10dp",
		backgroundColor:VARS.rowColor,
		height:"100dp",
	})
	
	var image_sub_holder=Ti.UI.createView({
		width:"90dp",
		top:"5dp",
		backgroundColor:VARS.imageFrameColor,
		height:"90dp",
		left:"5dp",
	})
	
	var image=Ti.UI.createImageView({
		image:p.image,
		width:"86dp",
		top:"2dp",
		backgroundColor:VARS.imageFrameColor,
		height:"86dp",
		left:"2dp",
	})
	image_holder.add(image_sub_holder);
	image_sub_holder.add(image);
	
	//Create the image text
	var imageTitle=Ti.UI.createLabel({
		text:p.imageTitle,
		color:"white",
		top:"10dp",
		width:"200dp",
		left:"100dp",
		height:"20dp"
	})
	image_holder.add(imageTitle);
	
	//Create Image descriptiom
	var imageDescription=Ti.UI.createLabel({
		text:p.imageDescription,
		color:"white",
		top:"30dp",
		font:{size:11},
		width:"200dp",
		height:"60dp",
		left:"100dp"
	})
	image_holder.add(imageDescription);
	
	return image_holder;
}

exports.creteInfoText=function(p)
{
	//Create the  text
	var infoText=Ti.UI.createLabel({
		text:p.infoText,
		font:{size:11},
		color:"white",
		top:"115dp",
		bottom:"10dp",
		width:"95%",
		//left:"10dp",
		height:"auto"
	})

	return infoText;
}


/**
 * Construct the pink button
 * @param p
 * @config {Object} conf, all parameters for the view
 * @confis {String} text
 */
exports.myButton=function(p)
{
	var theButtonBg=Ti.UI.createView(p.conf);
	theButtonBg.backgroundColor=VARS.buttonColor;
	theButtonBg.borderRadius=3;
	
	if(p.image==null)
	{
		var theLblInside=Ti.UI.createLabel({textAlign:'center',text:p.text,color:"white",width:p.conf.width});
		theButtonBg.add(theLblInside);
	}
	else
	{
		var theLblInside=Ti.UI.createLabel({textAlign:'right',right:"5dp",text:p.text,color:"white",width:p.conf.width});
		theButtonBg.add(theLblInside);
		
		//Add the image
		var theimage=Ti.UI.createImageView({
			image:p.image,
			left:"2dp",
			top:"0dp",
			height:p.conf.height,
			width:p.conf.height,
		})
		theButtonBg.add(theimage);
	}
	
	return theButtonBg;
	
}


exports.PixelsToDPUnits=function(ThePixels)
{
  return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
}
 
 
exports.DPUnitsToPixels=function(TheDPUnits)
{
  return (TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160));
}