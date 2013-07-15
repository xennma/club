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

//############# SIMPLE ROW CREATOR ##################
exports.creteSimpleRow=function(p)
{
	//The Row
	var bgColor=VARS.rowColor;
	if(p.index%2==1){bgColor=VARS.rowOddColor}
	var row = Ti.UI.createTableViewRow({
		height:rowHeight,
		hasChild:VARS._platform!=VARS._android,
		backgroundColor:bgColor});
	row.className = 'datarow';
	row.clickName = 'row';
	row.index = p.index;
	
	//The icon
	var icon=Ti.UI.createImageView({
		image:p.icon,
		touchEnabled:false,
		height:imageHeight,
		width:imageWidth,
		left:"5dp",
		top:"5dp",
		borderRadius:5,
	})
	row.add(icon);
	
	//The title
	var textW="220dp";
	if(VARS._platform==VARS._iPad)
	{
		textW="668";
	}
	else if(VARS._platform==VARS._android)
	{
		textW="230dp";
	}
	var theTitle = Ti.UI.createLabel({
		text:p.title,
		left:"70dp",
		height:rowHeight,
		width:textW,
		color:textColor,
	})
	row.add(theTitle);
	
	return row;
}
