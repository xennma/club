/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content contact Module
* @version 2.0
*/

//Include Required modules
var VARS =require('common/globals');
var GUI =require('contact_lib/contactGUI');

/**
 * @description Creates window with contact
 * @param {Object} p, Parameters
 * @config {Window} win, the window to open the gallery in
 * @config {String} title, the window title
 * @config {String} image, the image to display
 * @config {String} imageTitle, the image title
 * @config {String} imageDescription, the image description
 * @config {String} infoText, the infoText to display [optional]
 * #config {sting} web, Web site to open
 * @config {String} tab, tab to open sub windows
 * @config {Object} additionalParameters,
 */
exports.createContact = function(p) 
{
	//Set up window
	p.win.title=p.title;
	p.win.backgroundColor=VARS.windowBackgroundColor;
	p.win.barColor=VARS.barColor;
	
	//Create The scroll holder
	var cw="100%";
	if(VARS._platform==VARS._android)
	{
		cw=GUI.DPUnitsToPixels(320);
		//alert(cw);
		Ti.API.info("CW"+VARS._platform)
	}
	var scrollHolder=Ti.UI.createScrollView({
		width:"100%",
		height:"100%",
		contentHeight:"auto",
		contentWidth:cw,
		showVerticalScrollIndicator:true,
	})
	
	//Create the image
	scrollHolder.add(GUI.creteContactImage({
		image:p.image,
		imageTitle:p.imageTitle,
		imageDescription:p.imageDescription}))
		
	//Create the info text if it exists	
	if(p.infoText!=null)
	{
		scrollHolder.add(GUI.creteInfoText({infoText:p.infoText}))
	}
	
	//Create the contact form
	var contactForm=GUI.createContactForm({
		top:(120+p.numLines*20)+"dp"
	});
	
	//Create the contact send button
	var sendButton=GUI.myButton({conf:{top:"255dp",right:"10dp",width:"80dp",height:"30dp"},text:L('send')});
	contactForm.add(sendButton);
	
	//Add contact form to the scroller
	scrollHolder.add(contactForm);
	
	//Add separator view
	var buttonsTop=(430+p.numLines*20)+"dp";
	var separatorView=Ti.UI.createView({
		top:buttonsTop,
		height:"60dp"
	})
	scrollHolder.add(separatorView);
	
	//Create the contact phone button
	var phoneButton=GUI.myButton({conf:{top:buttonsTop,left:"20dp",width:"135dp",height:"30dp"},text:L('callus')});
	scrollHolder.add(phoneButton);
	
	//Create the contact webbutton
	var webButton=GUI.myButton({conf:{top:buttonsTop,right:"20dp",width:"135dp",height:"30dp"},text:L('oursite')});
	scrollHolder.add(webButton);
	
	//Add scroller to view
	p.win.add(scrollHolder);
	
	//############### FUNTIONS #######################
	var sendMail=function(p)
	{
		var xhr = Titanium.Network.createHTTPClient();

		xhr.onerror = function(e)
		{
			Ti.UI.createAlertDialog({title:L('error_o'), message:L('error_failed_connection')}).show();			
		};
		//xhr.setTimeout(20000);
		xhr.onload = function(e)
		{
			Ti.API.info('Mail Send response ' + this.responseText);
			
			//Parse the json
			var registerResponse = JSON.parse(this.responseText);
			
			//See the response from the registration process
			if(registerResponse.send)
			{
				contactForm.email.value="";
				contactForm.name.value="";
				contactForm.phone.value="";
				contactForm.message.value="";
                Ti.UI.createAlertDialog({title:L('success'), message:L('send_mail')}).show();
			}
			else
			{
				//Display information about the problem
				Ti.UI.createAlertDialog({title:L('error_o'), message:L('error_send_mail')}).show();
			}
		};
		
		// open the client
		xhr.open('POST',VARS.contactPHPLocation);
		
		// send the data
		xhr.send(p);
	}
	
	//############### EVENT LISTNERS #################
	webButton.addEventListener('click',function(e){
		Ti.Platform.openURL(p.web);
	})
	phoneButton.addEventListener('click',function(e){
		Titanium.Platform.openURL("tel:+"+p.phoneNumber);
	})
	sendButton.addEventListener('click',function(e){
		sendParameter={
			emailfrom:contactForm.email.value,
			emailto:p.email,
			name:contactForm.name.value,
			phone:contactForm.phone.value,
			message:contactForm.message.value,
                 }
        //Add Additional parameters
        for(var prop in p.additionalParameters) {
        	if(p.additionalParameters.hasOwnProperty(prop))
        	sendParameter[prop]=p.additionalParameters[prop];

    	}
   
		sendMail(sendParameter);
		
	})
	
}


