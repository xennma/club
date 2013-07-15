/*
* @author DANIEL DIMOV
* @email dimovdaniel@yahoo.com
* @content GUI Module
* @version 1.0
*/
var VARS =require('common/globals');


/**
 * Calculate new color
 * @param {Object} param
 * @config {String} baseColor, hexadecimal reprezentation
 * @config {Number} r, integer value to be changed  red
 * @config {Number} g, integer value to be changed  green
 * @config {Number} b, integer value to be changed  blue
 * @return {String} color, hexadecimal reprezentation 
 */
var calculateColor=function(param){
    //First seprate the base color
    var base=param.baseColor.replace("#","");
    
    if(base.length!=6)
    {
        alert("Error in the color");
        return; 
    }else{
        
        var baseR=parseInt(base.substring(0,2),16)+param.r;
        if(baseR>254){baseR=255}
        var baseG=parseInt(base.substring(2,4),16)+param.g;
         if(baseG>254){baseG=255}
        var baseB=parseInt(base.substring(4,6),16)+param.b;
         if(baseB>254){baseB=255}
        return("#"+baseR.toString(16)+""+baseG.toString(16)+""+baseB.toString(16));
    }
}

/**
 * @config {Object} p
 * @config {String} text, button text
 * @config {Object} config, speccific configuration 
 * @config {Object} imageConf, configuration for image
 */
var smartButton=function(p)
{
    
     //var baseColor="#38aac7";
    var bottomTop=calculateColor({
        baseColor:VARS.buttonColor,
        r:30,
        g:33,
        b:33,
    });
    
    var theButtonBg=Ti.UI.createView(p.conf);
    theButtonBg.borderRadius=3;
    theButtonBg.borderColor="#50000000";
    theButtonBg.borderWidth="1dp";
    theButtonBg.backgroundGradient={
            type:'linear',
            colors:[{color:bottomTop,position:0.0},{color:bottomTop,position:0.5},{color:VARS.buttonColor,position:1.0}],
    };
    
   
      
   /* var bottomElement=Ti.UI.createView({
        width:"100%",
        height:"100%",
        bottom:"0dp",
        backgroundGradient:{
            type:'linear',
            colors:[{color:bottomTop,position:0.0},{color:bottomTop,position:0.5},{color:VARS.buttonColor,position:1.0}],
        },
    })*/
    //theButtonBg.add(bottomElement);
    var topElement=Ti.UI.createView({
        width:"100%",
        height:"50%",
        top:"0dp",
        touchEnabled:false,
        backgroundGradient:{
            type:'linear',
            colors:[{color:"#20FFFFFF",position:0.0},{color:"#40FFFFFF",position:1.0}],
        },
    })
    theButtonBg.add(topElement);
    
    
    var textWidth=p.conf.width;
    if(p.imageConf){
    	var imageWidth=parseInt(p.imageConf.width.replace("dp",""));
    	var buttonWidth=parseInt(p.conf.width.replace("dp",""));
        textWidth=(buttonWidth-imageWidth)+"dp";
        
        //Add the image
        var btnIcon=Ti.UI.createImageView(p.imageConf);
        btnIcon.touchEnabled=false;
        btnIcon.left="5dp";
        theButtonBg.add(btnIcon);
    }
    var theLblInside = Ti.UI.createLabel({
        textAlign : 'center',
        text : p.text,
        color : "white",
        width : textWidth,
        right : "0dp",
        font:{fontSize:"13dp"},
        shadowColor:'#40000000',
        shadowOffset:{x:0,y:-1},
        touchEnabled:false,
    }); 
    theButtonBg.add(theLblInside);
    //theButtonBg.label=theLblInside;
    
    if(p.displayIndicator&&VARS._iOS)
    {
        var actIndLoading=Ti.UI.createActivityIndicator({
            left:"10dp",
            //style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
            width:"30dp",
            height:"30dp",
        })
        theButtonBg.add(actIndLoading);
        actIndLoading.show();
    }
    
    
    return theButtonBg;
    
}

/**
 * @config {Object} p
 * @config {String} text, button text
 * @config {Object} config, speccific configuration 
 */
var smartButtonOldWay=function(p)
{
	var theButtonBg=Ti.UI.createView(p.conf);
	theButtonBg.borderRadius=3;
	theButtonBg.borderColor="#50000000";
	theButtonBg.borderWidth="1dp";
	
	var baseColor="#38aac7";
	baseColor="#000000";
	var bottomTop=calculateColor({
	    baseColor:baseColor,
	    r:30,
	    g:33,
	    b:33,
	});
	
	//"#6ed6f0"
	var topBottom=calculateColor({
        baseColor:baseColor,
        r:54,
        g:44,
        b:41,
    })
    
    //"#8be6fc"
    var topBottom=calculateColor({
        baseColor:baseColor,
        r:83,
        g:60,
        b:53,
    })
	
	var bottomElement=Ti.UI.createView({
	    width:"100%",
	    height:"50%",
	    bottom:"0dp",
	    backgroundGradient:{
	        type:'linear',
	        colors:[{color:bottomTop,position:0.0},{color:baseColor,position:1.0}],
	    },
	})
	theButtonBg.add(bottomElement);
	var topElement=Ti.UI.createView({
        width:"100%",
        height:"50%",
        top:"0dp",
        backgroundGradient:{
            type:'linear',
            colors:[{color:topBottom,position:0.0},{color:topBottom,position:1.0}],
        },
    })
    theButtonBg.add(topElement);
	
	
	
	
	var theLblInside = Ti.UI.createLabel({
		textAlign : 'center',
		text : p.text,
		color : VARS.textColor,
		width : p.conf.width,
		font:{fontSize:"13dp"},
		shadowColor:'#40000000',
        shadowOffset:{x:0,y:-1},
		touchEnabled:false,
	}); 
	theButtonBg.add(theLblInside);
	
	if(p.displayIndicator&&VARS._iOS)
	{
		var actIndLoading=Ti.UI.createActivityIndicator({
			left:"10dp",
			//style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
			width:"30dp",
			height:"30dp",
		})
		theButtonBg.add(actIndLoading);
		actIndLoading.show();
	}
	
	return theButtonBg;
	
}

/**
 * @param {Object} p
 * @config {Number} size, size of the elements, optional
 * @config {Number} backgroundColor, row backgroundColor, optional 
 * 
 */
var createLoadMoreButton=function(p)
{
	var bgColor=p.backgroundColor||VARS.rowColor;
	if(p.size&&p.size%2==1){bgColor=VARS.rowOddColor}
	var row = Ti.UI.createTableViewRow({
		height:"60dp",
		backgroundColor:bgColor,
		});
	row.rowtype = 'load_more_button';
	
	row.add(smartButton({
		text:L('load_more'),
		conf:{
			width:"100dp",
			touchEnabled:false,
			height:"40dp",
			},
	}))
	
	
	row.addEventListener('click', function(e) {
		e.source.add(smartButton({
			text : L('updating'),
			displayIndicator:true,
			conf : {
				width : "200dp",
				touchEnabled : false,
				height : "40dp",
			},
		}))
	})

	return row;
}

var createLoadingPop=function(p)
{
    var loadingHolder=Ti.UI.createView({
        width:"120dp",
        height:"30dp",
        borderRadius:"4dp",
        backgroundColor:VARS.setAlpha({color:VARS.rowColor}),
    })
     var loader=Ti.UI.createActivityIndicator({
        width:Ti.UI.SIZE,
        height:Ti.UI.SIZE,
        message:L('loading'),
        color:VARS.textColor,
    })
    loadingHolder.add(loader);
    loadingHolder.loader=loader;
    loader.show();
    return loadingHolder;
}
exports.createLoadingPop=createLoadingPop;

/**
 * 
 * @param {Object} p
 * @config {Number} width, optional
 * @config {Number} top
 * @config {String} hint
 * @config {Boolean} passwordMask, optional
 * @config {STATIC} keyboardType, optional
 * @config {String} left, optional
 */
var createInputField=function(p)
{
	var defaultWidth=VARS._dpiWidth-40;
	if(VARS._platform==VARS._iPad){defaultWidth=300}
	var width=p.width||defaultWidth;  //Take paramter or calculate default width
	var inputFieldHolder=Ti.UI.createView({
		borderWidth:"1dp",
		borderColor:"#b4b4b4",
		borderRadius:"2",
		backgroundColor:"white",
		top:p.top,
		width:width+"dp",
		height:"30dp",
		left:p.left
	})
	
	var inputText=Ti.UI.createTextField({
		color:"black",
		hintText:p.hint,
		width:(width-10)+"dp",
		font:VARS.normal,
		backgroundColor:"#00ffffff",
		backgroundFocusedColor:"#00ffffff",
		borderColor:"#00ffffff",
		keyboardType:p.keyboardType,
		passwordMask:p.passwordMask,
		height:"30dp",
	})
	inputFieldHolder.add(inputText);
	inputFieldHolder.textField=inputText;
	
	return inputFieldHolder;
}

/**
 * Create social link
 * @param {Object} p
 * @config {String} color
 * @config {String} title
 * @config {String} subTitle
 * @config {String} value
 * @config {String} link
 * @config {String} top
 */
createSocialListRow=function(p)
{
   //The row
    var row = Ti.UI.createView({
        height:"80dp",
        top:p.top,
        backgroundColor:p.color});
    row.index = p.index;
    row.data=p;
    
    //Title
    var titleLabel=Ti.UI.createLabel({
        color:"white",
        font:VARS.h1,
        height:"20dp",
        top:"20dp",
        left:"90dp",
        text:p.title,
        touchEnabled:false,
    })
    row.add(titleLabel)
    
    //SubTitle
    var subTitleLabel=Ti.UI.createLabel({
        color:"white",
        font:VARS.h3,
        height:"20dp",
        bottom:"20dp",
        left:"90dp",
        text:p.subTitle,
        touchEnabled:false,
    })
    row.add(subTitleLabel);
    
    //Icon holder
    var iconHolder=Ti.UI.createView({
        top:"0dp",
        height:"80dp",
        width:"80dp",
        left:"0dp",
        touchEnabled:false,
    })
    var iconCover=Ti.UI.createImageView({
        image:"/images/linkIconBg.png",
        top:"0dp",
        height:"80dp",
        width:"80dp",
        left:"0dp",
        touchEnabled:false,
    })
    iconHolder.add(iconCover);
    var iconImage=Ti.UI.createImageView({
        image:"/images/"+(p.value).toLowerCase()+".png",
        width:"24dp",
    })
    
    //Set up event listener
    row.addEventListener('click',function(e)
    {
        Ti.Platform.openURL(p.link);
    })
    
    
    iconHolder.add(iconImage);
    row.add(iconHolder);

    return row;
}

//####################### INTERFACE #################
exports.createSocialListRow=createSocialListRow;
exports.createInputField=createInputField;
exports.smartButton=smartButton;
exports.createLoadMoreButton=createLoadMoreButton;