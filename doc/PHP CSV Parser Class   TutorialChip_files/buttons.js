var cookie = new function() {
	
	return {	
		setCookie : function(name, value, days) {
		  if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
		  } else {
				var expires = "";
		  }
		  var cookie_string = name + "=" + escape(value) + expires;
		  var str = document.domain.split(/\./);
		  var domain="";
		  if(str.length>1){
		      domain="."+str[str.length-2]+"."+str[str.length-1];
		  }
		  cookie_string += "; domain=" + escape (domain)+";path=/";
		  document.cookie = cookie_string;
		},
		getCookie : function(cookie_name) {
		  var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		  if (results) {
			  return (unescape(results[2]));
		  } else {
			  return false;
		  }
		},
		deleteCookie : function(name) {
		  var path="/";
		  var str = document.domain.split(/\./);
		  var domain="";
		  if(str.length>1){
		      domain="."+str[str.length-2]+"."+str[str.length-1];
		  }
		  document.cookie = name + "=" +( ( path ) ? ";path=" + path : "") 
			  + ( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
	};
}();

var __stbrowser = new function() {
	iemode = null;
	if (window.navigator.appName == "Microsoft Internet Explorer")
	{
	   if (document.documentMode) // IE8 or later
		   iemode = document.documentMode;
	   else // IE 5-7
	   {
		   iemode = 5; // Assume quirks mode unless proven otherwise
	      if (document.compatMode)
	      {
	         if (document.compatMode == "CSS1Compat")
	        	 iemode = 7; // standards mode
	      }
	   }
	}
	return {
		getIEVersion : function() {
			return iemode;
		}
	};
}();

__stgetPubGA=function(){
	if(typeof(_gaq)!=="undefined" && typeof(__stPubGA)=="undefined"){
		//console.debug(__stPubGA);
		if(typeof(_gat)!=="undefined"){
			__stPubGA=_gat._getTrackerByName("~0")._getAccount();
		}
		if(typeof(__stPubGA)!=="undefined" && __stPubGA=="UA-XXXXX-X"){
			_gaq.push(function(){
				var temp=_gat._getTrackerByName();
				__stPubGA=temp._getAccount();
			});
		}
		
	}
	if(__stPubGA=="UA-XXXXX-X"){
		delete __stPubGA;
	}
};

if(typeof(stLight)=="undefined" && typeof(SHARETHIS)=="undefined"){ //make sure it isnt called over and over again
	var stRecentServices = false;
	var betaBlacklist = [
		'computerworld.com',
		'networkworld.com',
		'cio.com',
		'infoworld.com',
		'forbes.com',
		'perezhilton.com',
		'pgestore.com',
		'thepostgame.com'
	];
	if(typeof(switchTo5x)=="undefined")
	{
		switchTo5x = false;
		var rNumFor5x = cookie.getCookie('__switchTo5x');
		if(rNumFor5x==false){
			var rNumFor5x = 1 + Math.floor(Math.random() * 100);
			cookie.setCookie('__switchTo5x', rNumFor5x, '300');
		}
		var testLimitFor5x = 0;
		if(rNumFor5x <= testLimitFor5x){
			switchTo5x = true;
		}

		for(var i=0;i<betaBlacklist.length; i++)
		{
			if(document.domain.search(betaBlacklist[i])!='-1'){
				switchTo5x = false;
				break;
			}
		}
	}
	
	var esiLoaded = false, stIsLoggedIn = false, servicesLoggedIn={};
	var stFastShareObj={};

	if("https:" == document.location.protocol){
		var useFastShare = false;
	}
	if(typeof(useFastShare)=="undefined")
	{
		var useFastShare = true;
	}
	
	stLight=new function(){
		this.publisher=null;
		this.sessionID_time = (new Date()).getTime().toString();
		this.sessionID_rand = Number(Math.random().toPrecision(5).toString().substr(2)).toString();
		this.sessionID = this.sessionID_time + '.' + this.sessionID_rand;
		this.fpc=null;
		this.counter=0;
		this.readyRun=false;
		this.meta={
			hostname: document.location.host,
			location: document.location.pathname
		};	
		this.loadedFromBar=false;
		this.clickCallBack=false;
	};
    stLight.onReady=function(){
    	if(stLight.readyRun==true){
    		return false;
    	}
    	//console.log("stlight on ready");
    	stLight.processSTQ();
    	stLight.readyRun=true;
    	if(stLight.publisher==null){
    		if(typeof(window.console)!=="undefined"){try{console.debug("Please specify a ShareThis Publisher Key \nFor help, contact support@sharethis.com");}catch(err){}}
		}
		var source = stLight.getSource();
    	stLight.log('pview', source, "");
    	stWidget.options.sessionID=stLight.sessionID;
    	stWidget.options.fpc=stLight.fpc;
    	stLight.loadServicesLoggedIn(function(){
    		stButtons.onReady();
		});
    };

	stLight.getSource=function(){
		var source = 'share4x';
		if(switchTo5x){
			source = 'share5x';
		}
    	if (stLight.hasButtonOnPage()){
    		if (stLight.loadedFromBar){
				if(switchTo5x){
					source = 'bar_share5x';
				} else {
	    			source = 'bar_share4x';	
				}
    		}
    	}else if(stLight.loadedFromBar){
    		source = 'bar';
    	}
		return source;
	};

	stLight.log=function(event, source, type){
		//console.debug("in log function");
		var lurl = (("https:" == document.location.protocol) ? "https://l." : "http://l.")+"sharethis.com/log?event=";
		if(event=="pview"){
			lurl = (("https:" == document.location.protocol) ? "https://l." : "http://l.")+"sharethis.com/pview?event=";
		}
        var additional=stLight.dbrInfo();
        if(additional==false){
        	additional="";
        }
        lurl += event;
        lurl += "&source=" + source;
        if (type != ""){
        	lurl += "&type=" + type;
        }
        lurl+="&publisher=" + encodeURIComponent(stLight.publisher)
            + "&hostname=" + encodeURIComponent(stLight.meta.hostname)
            + "&location=" + encodeURIComponent(stLight.meta.location)
            + "&url=" + encodeURIComponent(document.location.href)
            + "&sessionID="+stLight.sessionID
            + "&fpc="+stLight.fpc
            + "&ts" + (new Date()).getTime() + "." + stLight.counter++
            +	additional;
        var logger = new Image(1,1);
        logger.src = lurl;
		// N.B. This onload function is required for IE.
        logger.onload = function(){return;};
        if(event=="pview"){
        	stLight.createSegmentFrame();
        }
		//console.debug('done with the log function');
    };

	stLight._stFpc=function(){
		if(!document.domain || document.domain.search(/\.gov/) >0){
			return false;
		}
		var cVal=stLight._stGetFpc("__unam");
		if(cVal==false){
			var bigRan=Math.round(Math.random() * 2147483647);
			bigRan=bigRan.toString(16);
			var time=(new Date()).getTime();
			time=time.toString(16);
			var guid="";
			var hashD=stLight._stGetD();
			hashD=hashD.split(/\./)[1];
			if(!hashD){
				return false;
			}
			guid=stLight._stdHash(hashD)+"-"+time+"-"+bigRan+"-1";
			cVal=guid;
			stLight._stSetFpc(cVal);
		}else{
			var cv=cVal;
			var cvArray = cv.split(/\-/);
			if(cvArray.length==4){
				var num=Number(cvArray[3]);
				num++;
				cv=cvArray[0]+"-"+cvArray[1]+"-"+cvArray[2]+"-"+num;
				cVal=cv;
				stLight._stSetFpc(cVal);
			}
		}			
		return cVal;
	};
	//sets fpc with value and exires in 9 months
	stLight._stSetFpc=function(value) {
		var name="__unam";
		var current_date = new Date;
		var exp_y = current_date.getFullYear();
		var exp_m = current_date.getMonth() + 9;// set cookie for 9 months into future
		var exp_d = current_date.getDate();
		var cookie_string = name + "=" + escape(value);
		if (exp_y) {
			var expires = new Date (exp_y,exp_m,exp_d);
			cookie_string += "; expires=" + expires.toGMTString();
		}
		var domain=stLight._stGetD();
		cookie_string += "; domain=" + escape (domain)+";path=/";
		document.cookie = cookie_string;
	};
	//resolves domain for use in cookie
	stLight._stGetD=function(){
		var str = document.domain.split(/\./);
		var domain="";
		if(str.length>1){
		    domain="."+str[str.length-2]+"."+str[str.length-1];
		}
		return domain;
	};
	//gets cookie value with name or returns false
	stLight._stGetFpc=function(cookie_name) {
		var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		if (results)
			return (unescape(results[2]));
		else
			return false;
	};
	//hashes dd and returns value
	stLight._stdHash=function(dd) {
		var hash=0,salt=0;
	 	for (var i=dd.length-1;i>=0;i--) {
		  var charCode=parseInt(dd.charCodeAt(i));
		  hash=((hash << 8) & 268435455) + charCode + (charCode << 12);
		  if ((salt=hash & 161119850)!=0){hash=(hash ^ (salt >> 20));};
		}
	 return hash.toString(16);
	};
	stLight._thisScript=null;
	stLight.getShareThisLightScript=function(){
		var _slist = document.getElementsByTagName('script');
		var rScript=null;
		for(var i=0;i<_slist.length;i++)
		{	
			var temp=_slist[i].src;
			if( temp.search(/.*sharethis.*\/button\/light.*/) >=0 ){	
				rScript=_slist[i];
			}
		}
		return rScript;			
	};
	stLight.dbrInfo=function(){
		var dbr=document.referrer;
		if(dbr && dbr.length>0){
			var domainReg=/\/\/.*?\//; //something between //something/
			var matches=dbr.match(domainReg);
			if(typeof(matches)!=="undefined" && typeof(matches[0])!=="undefined"){
				var reg=new RegExp(document.domain,'gi');
				if(reg.test(matches[0])==true){
					return false;
				}
			}
			var re1=/(http:\/\/)(.*?)\/.*/i;
			var re2=/(^.*\?)(.*)/ig;
			var retVal="";
			var domain=dbr.replace(re1, "$2");
			var reg=new RegExp(domain,'gi');
			if(domain.length>0){retVal+="&refDomain="+domain;}
			else{return false;}
			var query=dbr.replace(re2,"$2");
			if(query.length>0){retVal+="&refQuery="+encodeURIComponent(query);}
			return retVal;
		}
		else{
			return false;
		}
	};

	stLight.odjs=function(scriptSrc,callBack){
		this.head=document.getElementsByTagName('head')[0];
		this.scriptSrc=scriptSrc;
		this.script=document.createElement('script');
		this.script.setAttribute('type', 'text/javascript');
		this.script.setAttribute('src', this.scriptSrc);
		this.script.onload=callBack;
		this.script.onreadystatechange=function(){
			if(this.readyState == "complete" || (scriptSrc.indexOf("checkOAuth.esi") !=-1 && this.readyState == "loaded")){
				callBack();
			}
		};
		this.head.appendChild(this.script);
	};

	stLight.loadServicesLoggedIn=function(callback){
		if(useFastShare){
			try {
				stLight.odjs((("https:" == document.location.protocol) ? "https://wd-edge.sharethis.com/button/checkOAuth.esi" : "http://wd-edge.sharethis.com/button/checkOAuth.esi"),function(){
					if (typeof(userDetails) !== 'undefined') {
						stIsLoggedIn = true;
						if(userDetails!=='null'){
							servicesLoggedIn = userDetails;						
						}
						//alert('i am logged in');
					}
					esiLoaded = true;
					if (callback!=null)
						callback();
				});
			} catch(err){}
		} else{
			if (callback!=null)
				callback();
		}
	};
	
	if(window.document.readyState=="completed"){
		stLight.onReady();
	}else{
		if (typeof(window.addEventListener) != 'undefined') {
		    window.addEventListener("load", stLight.onReady, false);
		} else if (typeof(document.addEventListener) != 'undefined') {
		    document.addEventListener("load", stLight.onReady, false);
		} else if (typeof window.attachEvent != 'undefined') {
		    window.attachEvent("onload", stLight.onReady);
		}
	}
	
	stLight.createSegmentFrame=function(){
		try {
			stLight.segmentframe = document.createElement('<iframe name="stframe" allowTransparency="true" style="body{background:transparent;}" ></iframe>');
			//try is ie
		} catch(err) {
			//catch is ff and safari
			stLight.segmentframe = document.createElement('iframe');
		}
		stLight.segmentframe.id = 'stSegmentFrame';
		stLight.segmentframe.name = 'stSegmentFrame';
		var wrapper= document.body;
		var frameUrl=(("https:" == document.location.protocol) ? "https://seg." : "http://seg.")+"sharethis.com/getSegment.php?purl="+encodeURIComponent(document.location.href)+"&jsref="+encodeURIComponent(document.referrer)+"&rnd="+(new Date()).getTime();
		stLight.segmentframe.src=frameUrl;
		stLight.segmentframe.frameBorder = '0';
		stLight.segmentframe.scrolling = 'no';
		stLight.segmentframe.width = '0px';
		stLight.segmentframe.height = '0px';
		stLight.segmentframe.setAttribute('style', "display:none;");
		wrapper.appendChild(stLight.segmentframe);
	};

	stLight.fpc=stLight._stFpc();
	
	stLight.options=function(options){
		if(options && options.publisher){
			stLight.publisher=options.publisher;
		}
		if(options && options.loadedFromBar){
			stLight.loadedFromBar=options.loadedFromBar;
		}
		if(options && options.clickCallBack && typeof(options.clickCallBack) == "function"){
			stLight.clickCallBack=options.clickCallBack;
		}
		for(var opts in options){
			if(stWidget.options.hasOwnProperty(opts) && options[opts]!==null){
				stWidget.options[opts]=options[opts];
			}
		}
	};
	
	stLight.hasButtonOnPage=function(){
		var elem=document.getElementsByTagName("*");
		var reg = new RegExp(/^st_(.*?)$/); //st_service
		var len=elem.length;
		
		for ( var i = 0; i < len; i++) {
			if(typeof(elem[i].className)=='string' && elem[i].className!='')
			{
				if (elem[i].className.match(reg) && elem[i].className.match(reg).length >= 2 && elem[i].className.match(reg)[1]) {
					return true;
				}	
			}
		}
		return false;
	};
	
	
}

//END OF light.js 

//button.js
var stButtons={};
stButtons.smartifyButtons=function(response){
	if(typeof(response)!='undefined' && response!='undefined'){
		stRecentServices = response;
		for(var i in stRecentServices){
			stRecentServices[i].processed = false;
		}
	}
	stButtons.completeInit();
};

stButtons.makeButton=function(element){
	var service=element.service;
	var text=element.text;
	if(text==null && (element.type=='vcount' || element.type=='hcount') ){
		text="Share";
		if (service=="email")
			text="Mail";
	}
	
	if (service=="fb_like") { //fix for typo release :-(
		service = "fblike";
	} else if (service=="fblike_fbLong") { //its not one of our standard button types, so I didn't process it up with the reg. expressions.
		service = "fblike";
		element.type = "fbLong"; // It gets recognized as a chicklet, set it as fbLong instead
	}
	
	//console.debug(stWidget);
	var url = stWidget.ogurl ? stWidget.ogurl : document.location.href;
	url = element.url	?	element.url	:url;
	
	var title = stWidget.ogtitle ? stWidget.ogtitle : document.title;
	title = element.title	?	element.title:title;

	var image = (element.thumbnail && element.thumbnail!=null) ? element.thumbnail : stWidget.ogimg;
	
	var summary = stWidget.desc ? stWidget.desc : '';
	summary = stWidget.ogdesc ? stWidget.ogdesc : stWidget.desc;
	summary = (element.description && element.description!=null) ? element.description : summary;

	if(/(http|https):\/\//.test(url)==false){
		url=decodeURIComponent(url);
		title=decodeURIComponent(title);
	}if(/(http|https):\/\//.test(url)==false){
		url=decodeURIComponent(url);
		title=decodeURIComponent(title);
	}
	
	var a = document.createElement('span');
	//a.setAttribute('service', service);
	a.setAttribute('style', "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;");
	a.className='stButton';

	if(element.type=="custom" && service!='email' && service!='sharethis' && service!='wordpress'){
		element.element.onclick=function(){
			stLight.callSubscribers("click",service,url);
			var form = document.createElement("form");
		    form.setAttribute("method", "GET");
		    form.setAttribute("action", (("https:" == document.location.protocol) ? "https://ws" : "http://wd")+".sharethis.com/api/sharer.php");
			form.setAttribute("target", "_blank");
			form.setAttribute("accept-charset", "UTF-8");
			//destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source=buttons
			var params={url:url,title:title,destination:service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID};
			if(typeof(image)!='undefined' && image!=null){
				params.image=image;
			}if(typeof(summary)!='undefined' && summary!=null){
				params.desc=summary;
			}
			
			params.service = element.service;
			params.type = element.type;
			
		    for(var key in params) {
		        var hiddenField = document.createElement("input");
		        hiddenField.setAttribute("type", "hidden");
		        hiddenField.setAttribute("name", key);
		        hiddenField.setAttribute("value", params[key]);
		        form.appendChild(hiddenField);
		    }
		    document.body.appendChild(form); 
		    form.submit();	
		};
		return false;
	}
	if(!( (service=="email" || service=="sharethis" || service=="wordpress") || 
		( stIsLoggedIn && servicesLoggedIn && typeof(servicesLoggedIn[service])!='undefined' && ( (useFastShare || (!useFastShare && switchTo5x)) && (service=="facebook" || service=="twitter" || service=="yahoo" || service=="linkedin"))) ))
	{
		a.onclick=function(){
			stLight.callSubscribers("click",service,url);
			var children =this.getElementsByTagName('*');
			for(var i=0;i<children.length;i++){
				if(children[i].className=="stBubble_hcount" || children[i].className=="stBubble_count"){
					if(!isNaN(children[i].innerHTML)){
						children[i].innerHTML=Number(children[i].innerHTML)+1;
					}
				}
			}

			if (stWidget.options.tracking){
				shareLog(service);
			}
			var form = document.createElement("form");
		    form.setAttribute("method", "GET");
		    form.setAttribute("action", (("https:" == document.location.protocol) ? "https://ws" : "http://wd")+".sharethis.com/api/sharer.php");
			form.setAttribute("target", "_blank");
			form.setAttribute("accept-charset", "UTF-8");
			//destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source=buttons
			var params={url:url,title:title,destination:service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID};
			if(typeof(image)!='undefined' && image!=null){
				params.image=image;
			}if(typeof(summary)!='undefined' && summary!=null){
				params.desc=summary;
			}
			params.service = element.service;
			params.type = element.type;

		    for(var key in params) {
		        var hiddenField = document.createElement("input");
		        hiddenField.setAttribute("type", "hidden");
		        hiddenField.setAttribute("name", key);
		        hiddenField.setAttribute("value", params[key]);
		        form.appendChild(hiddenField);
		    }

		    document.body.appendChild(form); 
		    form.submit();	
		};
	}
	
	// Do not render if gbuzz
	if(service=="gbuzz")
		return a;
	
	if(service=="fblike"||service=="fbsend"||service=="fbrec"||service=="fbLong"){
		return stButtons.makeFBButton(service,element.type,url);
	}
	
	if(service=="plusone"){
		stButtons.loadPlusone = true;
		var plusOneDiv = document.createElement("div");
		plusOneDiv.innerHTML = "&nbsp;";
		iedocmode = __stbrowser.getIEVersion();
		var ie7 =(navigator.userAgent.indexOf("MSIE 7.0") !=-1);
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var standardCSS = "display:inline-block;overflow:hidden;line-height:0px;";
		var ie7CSS = "overflow:hidden;zoom:1;display:inline;vertical-align:bottom;";
		var iedocmodeCSS = "overflow:hidden;zoom:1;display:inline;line-height:0px;position:relative;";
		var plusOne = document.createElement("g:plusone");
		plusOne.setAttribute("href", url);
		if (element.type =="vcount"){
			plusOne.setAttribute("size", "tall");
			plusOneDiv.setAttribute("style", standardCSS + "vertical-align:bottom;width:55px; height:61px;")
			ie7 && plusOneDiv.style.setAttribute ? plusOneDiv.style.setAttribute('cssText', standardCSS + "vertical-align:bottom;width:55px; height:61px;", 0) : null;
			(iedocmode && (iedocmode==7) && plusOneDiv.style.setAttribute) ? plusOneDiv.style.setAttribute('cssText',iedocmodeCSS + "vertical-align:bottom;bottom:-8px;width:55px; height:80px;",0) : (null);
		}else if (element.type =="hcount"){
			plusOne.setAttribute("size", "medium");
			plusOne.setAttribute("count", "true");
			plusOneDiv.setAttribute("style", standardCSS + "position:relative;vertical-align:middle;bottom:0px;width:75px; height:21px;")
			ie7 && plusOneDiv.style.setAttribute ? plusOneDiv.style.setAttribute('cssText',standardCSS + "position:relative;vertical-align:middle;width:75px; height:21px;",0) : null;
			(iedocmode && (iedocmode==7) && plusOneDiv.style.setAttribute) ? plusOneDiv.style.setAttribute('cssText',iedocmodeCSS + "vertical-align:middle;bottom:2px;width:75px; height:21px;",0) : (null);
		}else if (element.type =="button"){
			plusOne.setAttribute("size", "medium");
			plusOne.setAttribute("count", "false");
			plusOneDiv.setAttribute("style", standardCSS + "position:relative;vertical-align:middle;bottom:0px;width:36px; height:21px;")
			ie7 && plusOneDiv.style.setAttribute ? plusOneDiv.style.setAttribute('cssText', standardCSS + "position:relative;vertical-align:middle;width:36px; height:21px;",0) : null;
			(iedocmode && (iedocmode==7) && plusOneDiv.style.setAttribute) ? plusOneDiv.style.setAttribute('cssText',iedocmodeCSS + "vertical-align:middle;bottom:-8px;width:36px; height:39px;",0) : (null);
		}else if (element.type =="large"){
			plusOne.setAttribute("size", "medium");
			plusOne.setAttribute("count", "false");
			plusOneDiv.setAttribute("style", standardCSS + "position:relative;vertical-align:middle;bottom:8px;width:36px; height:30px;");
			ie7 && plusOneDiv.style.setAttribute ? plusOneDiv.style.setAttribute('cssText', standardCSS + "position:relative;vertical-align:middle;bottom:8px;width:36px; height:30px;",0) : null;
			(iedocmode && (iedocmode==7) && plusOneDiv.style.setAttribute) ? plusOneDiv.style.setAttribute('cssText',iedocmodeCSS + "vertical-align:middle;bottom:-3px;width:36px; height:39px;",0) : (null);
		} else {
			plusOne.setAttribute("size", "small");
			plusOne.setAttribute("count", "false");
			plusOneDiv.setAttribute("style", standardCSS + "position:relative;vertical-align:middle;bottom:0px;width:36px; height:16px;")
			ie7 && plusOneDiv.style.setAttribute ? plusOneDiv.style.setAttribute('cssText', standardCSS + "position:relative;vertical-align:middle;width:36px; height:16px;",0) : null;
			(iedocmode && (iedocmode==7) && plusOneDiv.style.setAttribute) ? plusOneDiv.style.setAttribute('cssText',iedocmodeCSS + "vertical-align:middle;bottom:-12px;width:36px; height:36px;",0) : (null);
		}
		plusOneDiv.appendChild(plusOne);
		plusOne.setAttribute('callback', "plusoneCallback");
		return plusOneDiv;
	}
	
	var span_bg_url=("https:" == document.location.protocol) ? "https://ws.sharethis.com/images/" : "http://w.sharethis.com/images/";
	var checkImg = document.createElement('img');
	checkImg.src = span_bg_url + 'check-big.png';
	checkImg.style.position = 'absolute';
	checkImg.style.top = '-7px';
	checkImg.style.right = '-7px';
	checkImg.style.width = '19px';
	checkImg.style.height = '19px';
	checkImg.style.maxWidth = '19px';
	checkImg.style.maxHeight = '19px';
	var newService = service;
	
	function pauseProcessing(millSeconds) 
	{
		var date = new Date();
		var currentDate = null;
		var count = 0;
		do
		{ 
			currentDate = new Date(); 
			count++;
			if (count > millSeconds) { break; }
		} 
		while(( (currentDate - date) < millSeconds) || !esiLoaded);
	}
	
	if(!esiLoaded && (service=='facebook' || service=='twitter' || service=='linkedin' || service=='yahoo')){
		pauseProcessing(500);
	}
	
	if(!(useFastShare && servicesLoggedIn && typeof(servicesLoggedIn[service])!='undefined' && (service=='facebook' || service=='twitter' || service=='linkedin' || service=='yahoo') ))
	{
		checkImg.style.display = 'none';			
	}
	
	if(element.type=="chicklet"){
		var spanText=document.createElement('span');
		spanText.className='chicklets '+service;
		if(text==null){
			spanText.innerHTML="&nbsp;";
			a.style.paddingLeft='0px';
			a.style.paddingRight='0px';
			a.style.width='16px';
		}else{
			spanText.appendChild(document.createTextNode(text));
			checkImg.style.right='auto';
			checkImg.style.left='8px';
			checkImg.style.top='-5px';
		}
		//console.debug(spanText);
		a.appendChild(spanText);
		checkImg.src = span_bg_url + 'check-small.png';
		checkImg.style.top = '-6px';
		checkImg.style.width = '13px';
		checkImg.style.height = '13px';
		checkImg.style.maxWidth = '13px';
		checkImg.style.maxHeight = '13px';
		a.appendChild(checkImg);
		return a;
	}else if(element.type=="large"){
		var spanText=document.createElement('span');
		spanText.className='stLarge';
		a.appendChild(spanText);
		spanText.style.backgroundImage="url('"+span_bg_url+newService+"_32.png')";
		a.appendChild(checkImg);
		return a;
	}else if(element.type=="pcount" || element.type=="stbar" || element.type=="stsmbar"){
		var button=document.createElement('span');
		var spanText=document.createElement('span');
		if (element.type=="stsmbar"){
			spanText.className='stSmBar';
			var span_bg_url=("https:" == document.location.protocol) ? "https://ws.sharethis.com/images/" : "http://w.sharethis.com/images/";
			spanText.style.backgroundImage="url('"+span_bg_url+newService+"_16.png')";
			checkImg.src = span_bg_url + 'check-small.png';
		}else{
			spanText.className='stLarge';
			var span_bg_url=("https:" == document.location.protocol) ? "https://ws.sharethis.com/images/" : "http://w.sharethis.com/images/";
			spanText.style.backgroundImage="url('"+span_bg_url+newService+"_32.png')";		
		}
		spanText.appendChild(checkImg);
		button.appendChild(spanText);
		
		var parent=document.createElement('span');
		var b = document.createElement('div');
		if (element.type=="stsmbar"){
			b.className='stBubbleSmHoriz';
		}else{
			b.className='stBubbleSm';
		}
		b.setAttribute('id', 'stBubble_' + element.count);
		b.style.visibility = 'hidden';
		var count = document.createElement('div');
		count.className='stBubble_count_sm';
		b.appendChild(count);
		parent.appendChild(b);
		parent.appendChild(button);
		a.appendChild(parent);
		stButtons.getCount(url,service,count);
		//show/hide on hover
		button.onmouseover=function(){var bubble = document.getElementById('stBubble_' + element.count); bubble.style.visibility='visible';};
		button.onmouseout=function(){var bubble = document.getElementById('stBubble_' + element.count); bubble.style.visibility='hidden';};

		return a;
	}else if(element.type=="button" || element.type=="vcount" || element.type=="hcount"){
		var button=document.createElement('span');
		button.className='stButton_gradient';
		var divText=document.createElement('span');
		divText.className='chicklets '+service;
		if(text==null){
			divText.innerHTML="&nbsp;";
		}else{
			divText.appendChild(document.createTextNode(text));
		}
		button.appendChild(divText);
		
		if(service=='facebook' || service=='twitter' || service=='linkedin' || service=='yahoo')
		{
			var sp = document.createElement('span');
			sp.className = 'stMainServices' + ' st-' + service + '-counter';
			sp.innerHTML = '&nbsp';
			button=sp;
			sp.style.backgroundImage="url('"+span_bg_url+newService+"_counter.png')";
		}
		button.appendChild(checkImg);
		
		/*
		if(service=="twitter"){
			var twbutton=document.createElement('span');
			twbutton.className='stTwbutton';
			twbutton.innerHTML="&nbsp;";
			button=twbutton;
		}else if(service=="facebook"){
			var sp=document.createElement('span');	
			sp.className="stFb";
			sp.innerHTML="&nbsp;";
			button=sp;
		}*/
		if(element.type=="vcount"){
			var parent=document.createElement('div');
			var b = document.createElement('div');
			b.className='stBubble';
			var count = document.createElement('div');
			count.className='stBubble_count';
			b.appendChild(count);
			parent.appendChild(b);
			parent.appendChild(button);
			a.appendChild(parent);
			stButtons.getCount(url,service,count);
		}else if(element.type=="hcount"){
			
			var parent=document.createElement('span');
			var spanGradient=document.createElement('span');
			spanGradient.className='stButton_gradient stHBubble';
			var spanLeft=document.createElement('span');
			spanLeft.className='stButton_left';
			spanLeft.innerHTML="&nbsp;";
			var spanRight=document.createElement('span');
			spanRight.className='stButton_right';
			spanRight.innerHTML="&nbsp;";
			var count = document.createElement('span');
			count.className='stBubble_hcount';
			spanGradient.appendChild(count);
			parent.appendChild(button);
			var spanGradientDad=document.createElement('span');
			spanGradientDad.className='stArrow';
			spanGradientDad.appendChild(spanGradient);
			parent.appendChild(spanGradientDad);
			a.appendChild(parent);
			stButtons.getCount(url,service,count);
			
		}else{
			a.appendChild(button);
		}
		
		// Replace with native counters
		if (element.type=='vcount' || element.type=='hcount'){
			if (element.ctype=='native') {
				// Add addition services as we transition to native counters
				if (service=='twitter') {
					var a2 = document.createElement('span');
					a2.className='stButton';
					
					var twWidth=55;
					var twHeight=20;
					var twTopInvDiv="";
					var twType="none";
					var twTopCSS=7;
					
					if(element.type=="vcount"){
						var twButtonDiv = document.createElement("div");
						twWidth=55;
						twHeight=62;
						twTopInvDiv="top:42px;";
						twType="vertical";
						checkImg.style.top = '34px';
					}else if(element.type=="hcount"){
						var twButtonDiv = document.createElement("span");
						twWidth=110;
						twHeight=20;
						twType="horizontal";
						checkImg.style.right = '44px';
					}
					
					iedocmode = __stbrowser.getIEVersion();
					
					var twButtonInvDiv = document.createElement("span");
					twButtonInvDiv.setAttribute("style", "vertical-align:bottom;line-height:0px;position:absolute;padding:0px !important;"+twTopInvDiv+"width:55px;height:20px;");
					(iedocmode && (iedocmode==7) && twButtonInvDiv.style.setAttribute) ? twButtonInvDiv.style.setAttribute('cssText', "vertical-align:bottom;line-height:0px;position:absolute;padding:0px !important;"+twTopInvDiv+"width:55px;height:20px;",0) : null;
					
					try {
						var twbutton = document.createElement('<iframe name="stframe" allowTransparency="true" scrolling="no" frameBorder="0"></iframe>');
						//try is ie
					} catch(err) {
						//catch is ff and safari
						twbutton=document.createElement('iframe');
						twbutton.setAttribute("allowTransparency", "true");
						twbutton.setAttribute("frameborder", "0");
						twbutton.setAttribute("scrolling", "no");
					}
					var rdurl="http://wd.sharethis.com/api/sharer.php?destination=twitter&url="+encodeURIComponent(url);
					twbutton.setAttribute("src", "http://platform.twitter.com/widgets/tweet_button.html?count="+twType+"&url="+rdurl);
					twbutton.setAttribute("style", "width:"+twWidth+"px;height:"+twHeight+"px;");
					(iedocmode && (iedocmode==7) && twbutton.style.setAttribute) ? twbutton.style.setAttribute('cssText', "width:"+twWidth+"px;height:"+twHeight+"px;",0) : null;
					
					if((useFastShare && servicesLoggedIn && typeof(servicesLoggedIn[service])!='undefined'))
					{
						twButtonDiv.appendChild(twButtonInvDiv);
					}
					twButtonDiv.appendChild(twbutton);
					button=twButtonDiv;
					button.appendChild(checkImg);
					a2.appendChild(button);
					a2.setAttribute('style', "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;vertical-align:bottom;margin-top:6px;width:"+twWidth+"px;height:"+twHeight+"px;");
					(iedocmode && (iedocmode==7) && a2.style.setAttribute) ? a2.style.setAttribute('cssText', "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;vertical-align:bottom;width:"+twWidth+"px;height:"+twHeight+"px;",0) : null;
					a=a2;
				} else if (service=='facebook') { // like button
					stButtons.getXFBMLFromFB();
					return stButtons.makeFBButton("fblike",element.type,url);
				} else if (service=='linkedin') {
				}
			} // end of native test
		} // end of vcount/hcount test
	} else if(element.type=="css") {
		var button=document.createElement('div');
		button.className='stCSSButton';
		
		if (element.cssType == "cssV") {
			var cssVBubble=document.createElement('div');
			cssVBubble.className='stCSSVBubble';
			var bubbleText = document.createElement('div');
			bubbleText.className='stCSSVBubble_count';
			cssVBubble.appendChild(bubbleText);
			var cssVArrow=document.createElement('div');
			cssVArrow.className='stCSSVArrow';
			var cssVArrowBorder=document.createElement('div');
			cssVArrowBorder.className='stCSSVArrowBorder';
			cssVArrowBorder.appendChild(cssVArrow);
			a.appendChild(cssVBubble);
			a.appendChild(cssVArrowBorder);
			stButtons.getCount(url,service,bubbleText);
		}		
		var divSprite=document.createElement('div');
		divSprite.className='stCSSSprite ' + service;
		divSprite.innerHTML="&nbsp;";
		var spanText=document.createElement('span');
		spanText.className='stCSSText';
		button.appendChild(divSprite);
		if(text==null || text ==""){
			//spanText.innerHTML="&nbsp;";
		}else{
			spanText.appendChild(document.createTextNode(text));
			button.appendChild(spanText);
		}
		button.appendChild(checkImg);
		a.appendChild(button);
		if (element.cssType == "cssH") {
			var cssHBubble=document.createElement('div');
			cssHBubble.className='stCSSHBubble';
			var bubbleText = document.createElement('div');
			bubbleText.className='stCSSHBubble_count';
			cssHBubble.appendChild(bubbleText);
			var cssHArrow=document.createElement('div');
			cssHArrow.className='stCSSHArrow';
			var cssHArrowBorder=document.createElement('div');
			cssHArrowBorder.className='stCSSHArrowBorder';
			cssHArrowBorder.appendChild(cssHArrow);
			a.appendChild(cssHArrowBorder);
			a.appendChild(cssHBubble);
			stButtons.getCount(url,service,bubbleText);
		}
	}
	return a;
};

stButtons.makeFBButton=function(service,type,url){
	try {
		var fbframe = document.createElement('<div></div>');
	}catch(err) {
	//catch is ff and safari
		fbframe = document.createElement('div');
	}
//	var rdurl="http://wd.sharethis.com/api/sharer.php?destination="+service+"&url="+encodeURIComponent(url);
	var rdurl=url; // Change back to previous
	var layout = "button_count";
	var fbclass = "fb-send";
	var recommend = "";
	iedocmode = __stbrowser.getIEVersion();
	var position="";
	if (type =="vcount"){
		layout = "box_count";
	} else if (type =="hcount"){
	} else if (type =="large"){
		position= (iedocmode && (iedocmode==7)) ? "vertical-align:bottom;bottom:3px;" : "bottom:7px;margin-top:9px;";
	} else if (type =="button"){
	} else {
		position="top:1px;margin-top:0px;";
	}
	
	if (service=="fbLong"){
		layout = "standard";
	} 
	(service=="fbrec") ? recommend = "recommend" : null;
	if (service!="fbsend") {
		fbclass = "fb-like";
		fbframe.setAttribute("data-action",recommend);
		fbframe.setAttribute("data-send","false");
		fbframe.setAttribute("data-layout",layout);
		fbframe.setAttribute("data-show-faces","false");
	}
	fbframe.setAttribute("class",fbclass);
	fbframe.setAttribute("data-href",rdurl);
	
	if (iedocmode && (iedocmode==7)) {
		if (service!="fbsend")
			fbframe = document.createElement("<div class='"+fbclass+"' data-action='"+recommend+"' data-send='false' data-layout='"+layout+"' data-show-faces='false' data-href='"+rdurl+"'></div>");
		else
			fbframe = document.createElement("<div class='"+fbclass+"' data-href='"+rdurl+"'></div>");
	}
	
	var a2 = document.createElement('span');
	a2.setAttribute('style', "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;position:relative;margin:3px 3px 0;padding:0px;font-size:11px;line-height:16px;vertical-align:bottom;overflow:visible;"+position);
	(iedocmode && (iedocmode==7) && a2.style.setAttribute) ? a2.style.setAttribute('cssText',"text-decoration:none;color:#000000;display:inline-block;cursor:pointer;position:relative;margin:3px 3px 0;font-size:11px;line-height:0px;"+position,0) : (null);
	var fbDiv = document.createElement("div");
	fbDiv.setAttribute("id", "fb-root");
	a2.appendChild(fbDiv);
	a2.appendChild(fbframe);
	return a2;
}

//(url,service,count)
stButtons.getCount=function(url,service,element){
	var flag=false;
	
	if(element && element!==null){
		while (element.childNodes.length >= 1 )
	    {
			try{element.removeChild(element.firstChild );}catch(err){} //empty out old ones...       
	    }
	}
	//console.debug("adding to queue");
	stButtons.cbQueue.push({"url":url,"service":service,"element":element});
	stButtons.getCountsFromService(url,service,element);
};

stButtons.processCB=function(response){
	if (typeof(response) != "undefined" && typeof(response.ourl) != "undefined")
		stButtons.countsResp[response.ourl]=response;
	stButtons.processCount(response);
};

stButtons.processCount=function(response){
	if(!(response)) {return;}
	stButtons.storedCountResponse = response;
	var flag=false;
	for(var i=0;i<stButtons.cbQueue.length;i++){
		var tempItem=stButtons.cbQueue[i];//get one item from queue
		if(response.ourl==tempItem.url){
			var text="";
			try{
				if(tempItem.service=="sharethis"){
					if(stWidget.options.newOrZero=='zero')
					{
						text=(response['total']>0)?stButtons.human(response['total']) :"0";	
					}
					else
					{
						text=(response['total']>0)?stButtons.human(response['total']) :"New";
					}
				}else if(tempItem.service=="facebook" && typeof(response['facebook2'])!="undefined"){
					text=stButtons.human(response['facebook2']);
				}else if(typeof(response[tempItem.service])!="undefined"){
					text=(response[tempItem.service]>0)?stButtons.human(response[tempItem.service]) :'0'; 
				}else{
					text="0";
				}
				//element.appendChild(document.createTextNode(text));
				if(/stHBubble/.test(tempItem.element.parentNode.className)==true){
					tempItem.element.parentNode.style.display = 'inline-block';
				}else if(/stBubble/.test(tempItem.element.parentNode.className)==true){
					tempItem.element.parentNode.style.display = 'block';
				}
				tempItem.element.innerHTML=text;
			}catch(err){
				// Didn't set innerHTML (IE8)
				if (!tempItem.element.hasChildNodes()){
					var newdiv = document.createElement("div");
					newdiv.innerHTML=text;
					tempItem.element.appendChild(newdiv);
				}
			}
		//	console.debug("*******item found");
			flag=true;
		}
	}
};


stButtons.human=function(val){
	if (val>=100000) {
	    val = val/1000;
	    val=Math.round(val);
	    val=val+"K";
	}
	else if(val>=10000){
	    val = val/100;
	    val=Math.round(val);
		val=val/10;
	    val=val+"K";
	}
	return val;
};


stButtons.locateElements=function(clearChildren){
	
	var elem=document.getElementsByTagName("*");
	var fillArray=[];
	var reg1 = new RegExp(/st_(.*?)_custom/); //st_service_vcount
	var reg2 = new RegExp(/st_(.*?)_vcount/); //st_service_vcount
	var reg2n = new RegExp(/st_(.*?)_vcount_native/); //st_service_vcount_native
	var reg3 = new RegExp(/st_(.*?)_hcount/); //st_service_hcount
	var reg3n = new RegExp(/st_(.*?)_hcount_native/); //st_service_hcount_native
	var reg4 = new RegExp(/st_(.*?)_button/); //st_service_button
	var reg5 = new RegExp(/st_(.*?)_large/); //st_service_button
	var reg6 = new RegExp(/st_(.*?)_pcount/); //st_service_button
	var reg7 = new RegExp(/st_(.*?)_stbar/); //st_service_button
	var reg8 = new RegExp(/st_(.*?)_stsmbar/); //st_service_button
	var reg9 = new RegExp(/st_(.*?)_css/); //st_service_css
	var reg10 = new RegExp(/^st_(.*?)$/); //st_service
	var len=elem.length;
	
	var k=0, serviceName, serviceFound, elementValid, serviceList=[], anyRecentService=false;
	
	if(typeof(stRecentServices)!='undefined' && stRecentServices!='undefined' && stRecentServices!='false' && stRecentServices)
	{
		anyRecentService = true;
	}
	
	for ( var i = 0; i < len; i++) {
		serviceName = '';
		serviceFound = false;
		elementValid = false;
		
		if(typeof(elem[i].className)=='string' && elem[i].className!=''){
			if (elem[i].className.match(reg1) && elem[i].className.match(reg1).length >= 2 && elem[i].className.match(reg1)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg1)[1];
					//stButtons.elemArr.push(elem[i]);
					typeName = 'custom';
					if (serviceName=='plusone' || serviceName=='fblike' || serviceName=='fbrec' || serviceName=='fbsend')
						typeName = 'chicklet';
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : typeName
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg2) && elem[i].className.match(reg2).length >= 2 && elem[i].className.match(reg2)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg2)[1];
					//stButtons.elemArr.push(elem[i]);
					var ctype='';
					if (elem[i].className.match(reg2n) && elem[i].className.match(reg2n).length >= 2 && elem[i].className.match(reg2n)[1])
						ctype='native';
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'vcount',
						'ctype' : ctype
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg3) && elem[i].className.match(reg3).length >= 2 && elem[i].className.match(reg3)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg3)[1];
				//	stButtons.elemArr.push(elem[i]);
					var ctype='';
					if (elem[i].className.match(reg3n) && elem[i].className.match(reg3n).length >= 2 && elem[i].className.match(reg3n)[1])
						ctype='native';
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'hcount',
						'ctype' : ctype
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg4) && elem[i].className.match(reg4).length >= 2 && elem[i].className.match(reg4)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg4)[1];
				//	stButtons.elemArr.push(elem[i]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'button'
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg5) && elem[i].className.match(reg5).length >= 2 && elem[i].className.match(reg5)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg5)[1];
				//	stButtons.elemArr.push(elem[i]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'large'
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg6) && elem[i].className.match(reg6).length >= 2 && elem[i].className.match(reg6)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg6)[1];
				//	stButtons.elemArr.push(elem[i]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'pcount',
						'count': i
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg7) && elem[i].className.match(reg7).length >= 2 && elem[i].className.match(reg7)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg7)[1];
				//	stButtons.elemArr.push(elem[i]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'stbar',
						'count': i
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg8) && elem[i].className.match(reg8).length >= 2 && elem[i].className.match(reg8)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg8)[1];
				//	stButtons.elemArr.push(elem[i]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'stsmbar',
						'count': i
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg9) && elem[i].className.match(reg9).length >= 2 && elem[i].className.match(reg9)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg9)[1];
					//stButtons.elemArr.push(elem[i]);
					var info = elem[i].className.split("_");
					//console.debug(info[info.length-1]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'css',
						'cssType' : info[info.length-1]
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}else if (elem[i].className.match(reg10) && elem[i].className.match(reg10).length >= 2 && elem[i].className.match(reg10)[1]) {
				if(stButtons.testElem(elem[i])==false){
					elementValid = true;
					serviceName = elem[i].className.match(reg10)[1];
					//stButtons.elemArr.push(elem[i]);
					fillArray.push( {
						'service' : serviceName,
						'element' : elem[i],
						'url' : elem[i].getAttribute('st_url'),
						'title' : elem[i].getAttribute('st_title'),
						'image' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
						'summary' : elem[i].getAttribute('st_summary'),
						'text' : elem[i].getAttribute('displayText'),
						'type' : 'chicklet'
					});
					elem[i].setAttribute('st_processed',"yes");
				}
			}

			if(anyRecentService)
			{
				if(elementValid)
				{	
					//stButtons.elemArr.push(elem[i]);
					for(k=0;k<serviceList.length;k++)
					{
						if(serviceList[k].service==serviceName)
						{
							serviceList[k].count++;
							serviceFound = true;
						}
					}
					if(!serviceFound)
					{
						serviceList.push({
							'service' : serviceName,
							'count' : 1,
							'doNotReplace' : false,
							'processed' : false
						});
					}
				}			
			}
		}
	}
	
	//console.debug(serviceList);
	//console.debug(fillArray);
	if(anyRecentService)
	{
		var replaceList=[];
		for(var x=serviceList.length-1; x>=0; x--)
		{
			if(serviceList[x].service=='sharethis' || serviceList[x].doNotReplace)
			{
				serviceList[x].processed = true;
				continue;
			} 
			else
			{
				/*add to replace list*/
				for(var y in stRecentServices)
				{
					var foundDup = false;
					if(!stRecentServices[y].processed)
					{
						for(var dup=0; dup<serviceList.length; dup++)
						{
							if(y==serviceList[dup].service && !serviceList[dup].processed)
							{
								foundDup = true;
								serviceList[dup].doNotReplace = true;
								stRecentServices[y].processed = true;
								break;
							}
						}
						
						if(foundDup)
						{
							serviceList[x].processed = true;
						}
						else
						{
							replaceList.push({'oldService': serviceList[x].service, 'newService': y});
							for(var z=0; z<fillArray.length; z++)
							{
								if(fillArray[z].service == serviceList[x].service)
								{
									fillArray[z].service = y;
									fillArray[z].text = stRecentServices[y].title;
									fillArray[z].element.setAttribute('displayText',stRecentServices[y].title);
									fillArray[z].element.className = fillArray[z].element.className.replace(serviceList[x].service, y);
								}
							}
							
							stRecentServices[y].processed = true;
							serviceList[x].processed = true;
							break;
						}	
					}
				}
			}
		}		
	}

	//console.debug(serviceList);
	//console.debug(fillArray);
	for(var i=0;i<fillArray.length;i++){
		//console.debug(fillArray[i]);
		stWidget.addEntry(fillArray[i]);
	}

};

stButtons.odcss=function(scriptSrc,callBack){
	this.head=document.getElementsByTagName('head')[0];
	this.scriptSrc=scriptSrc;
	this.css=document.createElement('link');
	this.css.setAttribute('rel', 'stylesheet');
	this.css.setAttribute('type', 'text/css');
	this.css.setAttribute('href', this.scriptSrc);
	setTimeout(function(){callBack();},500);
	this.head.appendChild(this.css);	
};


stButtons.makeButtons=function(){
	if(typeof(stButtons.button_css_called)=="undefined"){
		var button_css_url=(("https:" == document.location.protocol) ? "https://ws.sharethis.com/button/css/buttons-secure.css" : "http://w.sharethis.com/button/css/buttons.c2ef6af30137dcaa4678de61c3787923.css");
		stButtons.odcss(button_css_url,function(){});
		stButtons.button_css_called=true;
	}
	stButtons.locateElements();
};

stButtons.getPlusOneFromGoogle=function(){
	if (stButtons.plusOneLoaded==false) {
		if (stButtons.plusOneLoading==false) {
			var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", "https://apis.google.com/js/plusone.js");
			fileref.onload=function(){gapi.plusone.go();stButtons.plusOneLoaded=true;stButtons.plusOneLoading=false;};
			fileref.onreadystatechange=function(){
				if(this.readyState=='complete'){
					gapi.plusone.go();
					stButtons.plusOneLoaded=true;
					stButtons.plusOneLoading=false;
				}
			};
			stButtons.plusOneLoading=true;
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	}else{
		gapi.plusone.go();
	}
};

stButtons.getXFBMLFromFB=function(){
	if (stButtons.xfbmlLoaded==false) {
		if (stButtons.xfbmlLoading==false) {
			stButtons.xfbmlLoading=true;
			var locale="en_US";
			var js, fjs = document.getElementsByTagName('script')[0];
			if (document.getElementById('facebook-jssdk')) {return;}
			js = document.createElement('script');
			js.id = 'facebook-jssdk';
			js.src = "//connect.facebook.net/"+locale+"/all.js#xfbml=1";
			js.async = stWidget.options.async;
			js.onload=function(){
				FB.init({ 
			       appId:'', xfbml:true 
			    });
				FB.XFBML.parse();
				stButtons.trackFB();
				stButtons.xfbmlLoaded=true;
				stButtons.xfbmlLoading=false;
			};
			js.onreadystatechange=function(){
				if(this.readyState=='complete' || this.readyState=='loaded'){
					FB.init({ 
					       appId:'', xfbml:true 
				    });
					FB.XFBML.parse();
					stButtons.trackFB();
					stButtons.xfbmlLoaded=true;
					stButtons.xfbmlLoading=false;
				}
			};
			fjs.parentNode.insertBefore(js, fjs);
		}
	} else{
		FB.XFBML.parse();
		stButtons.trackFB();
	}
};

stButtons.addCount=function(count){
	//console.debug("push to counts");
	stButtons.counts.push(count);
};

stButtons.getCountsFromService=function(url,service,element){//url,service,element
	if(stButtons.checkQueue(url)==false){

		var cb=cb+"-"+stButtons.cbVal;
		cb="stButtons.processCB";
		stButtons.cbVal++;
		var get_count_url=(("https:" == document.location.protocol) ? "https://ws.sharethis.com/api/getCount2.php?cb="+cb+"&url=" : "http://wd.sharethis.com/api/getCount2.php?cb="+cb+"&url=");
		//var get_count_url=(("https:" == document.location.protocol) ? "https://ws.sharethis.com/api/getCount.php?cb="+cb+"&url=" : "http://wd.sharethis.com/api/getCount.php?cb="+cb+"&url=");
		//console.debug(get_count_url);
		stLight.odjs(get_count_url+encodeURIComponent(url),function(){});
		stButtons.queue.push(url);
	}
	if (stButtons.countsResp[url]){
//		console.log("getCount resp for "+url+" already saved");
		stButtons.processCount(stButtons.countsResp[url]);
	}
};

stButtons.checkQueue=function(url){
	for(var i=0;i<stButtons.queue.length;i++){
		if(stButtons.queue[i]==url){
			return true;
		}
	}
	return false;
};

//stButtons.elemArr=[];

stButtons.testElem=function(elem){
	var flag=false;
	if(elem.getAttribute('st_processed')!=null){
		return true;
	}else{
		return false;
	}
	/*for(var i=0;i<stButtons.elemArr.length;i++){
		if(elem==stButtons.elemArr[i]){
			flag=true;
		}
	}
	if(flag==true){
		return true;
	}else{
		return false;
	}*/
};


function Shareable(opt){
	var _popupWidths = {};
	_popupWidths['facebook'] = '450';
	_popupWidths['twitter'] = '684';
	_popupWidths['yahoo'] = '500';
	_popupWidths['linkedin'] = '600';
	
	var _popupHeights = {};
	_popupHeights['facebook'] = '300';
	_popupHeights['twitter'] = '718';
	_popupHeights['yahoo'] = '460';
	_popupHeights['linkedin'] = '433';
	
	this.idx=-1;
	this.url=null;
	this.title=null;
	this.image=null;
	this.element=null;
	this.service=null;
	this.screen="home";
	this.summary=null;
	this.content=null;
	this.buttonText=null;
	this.frag=null;
	this.onhover=true;
	this.type=null;
	var that = this;
	var openWidget = false;
	
	this.attachButton=function(newbutton) {
		this.element = newbutton;
		if((this.onhover==true || this.onhover=='true') && !detectMobileDevice() && ( (!switchTo5x) || ( switchTo5x && (opt.service=='sharethis' || opt.service=='email' || opt.service=='wordpress') ) ) )
		{
			newbutton.onmouseover=this.mouseOn;
			//newbutton.onmouseover=this.popup;
			newbutton.onmouseout=this.mouseOut;
			
			/*if (!switchTo5x) {
				newbutton.onclick=function(){stWidget.stCancelClose();};
				newbutton.onmouseover=function(){stWidget.stCancelClose();stWidget.mouseTimer=setTimeout(this.popup,150);};
				newbutton.onmouseout=function(){clearInterval(stWidget.mouseTimer);};
			}*/
		}
		
		newbutton.onclick = function(e){
			//console.debug(opt.service, servicesLoggedIn[opt.service], stIsLoggedIn, this);
			
			that.decideFastShare();
		};
	};
	this.init=function(){
	//	alert("init mege");
		stWidget.merge(this,opt);
		stWidget.shareables.push(this);
		if(opt.element!==null){
			this.attachButton(opt.element);
		}
	};
	return this;
};

var stWidget=new function(){
	
	this.shareables=[];
	this.entries=0;
	this.widgetOpen=false;
	this.mouseOnTimer=null;
	this.mouseTimer=null;
	this.mouseOutTimer=null;
	this.frameReady=false;
	this.stopClosing=false;
	this.buttonClicked=false;
	
	this.frameUrl5x=(("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure5x/index.html" : "http://edge.sharethis.com/share5x/index.7a6f0fbfa42361d622be0188ce329980.html");
	this.frameUrl4x=(("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure/index.html" : "http://edge.sharethis.com/share4x/index.0c28e566093cdf4e61347be59e0cb17d.html");	
	
	this.secure=false;
	try {
		this.mainstframe = document.createElement('<iframe name="stLframe" allowTransparency="true" style="body{background:transparent;}" ></iframe>');
		this.mainstframe.onreadystatechange=function(){
			if(stWidget.mainstframe.readyState==="complete"){
				stWidget.frameReady=true; 
				if (stWidget.widgetOpen==true && typeof(stWidget.storedFrag) != "undefined") {
					if(switchTo5x){
						window.frames['stLframe'].location.replace(stWidget.frameUrl5x+stWidget.storedFrag);
					} else{
						window.frames['stLframe'].location.replace(stWidget.frameUrl4x+stWidget.storedFrag);
					}
				}
			}
		};
		//try is ie
	}catch(err) {
	//catch is ff and safari
		this.mainstframe = document.createElement('iframe');
		this.mainstframe.allowTransparency="true";	
		this.mainstframe.setAttribute("allowTransparency", "true");
		this.mainstframe.onload=function() {
			stWidget.frameReady=true;
			if (stWidget.widgetOpen==true && typeof(stWidget.storedFrag) != "undefined") {
				if(switchTo5x){
					window.frames['stLframe'].location.replace(stWidget.frameUrl5x+stWidget.storedFrag);
				} else{
					window.frames['stLframe'].location.replace(stWidget.frameUrl4x+stWidget.storedFrag);
				}
			}
		};
	}
	
	this.mainstframe.id = 'stLframe';
	this.mainstframe.className = 'stLframe';
	this.mainstframe.name = 'stLframe';
	this.mainstframe.frameBorder = '0';
	this.mainstframe.scrolling = 'no';
	this.mainstframe.width = '353px';
	this.mainstframe.height = '350px';
	this.mainstframe.style.top = '0px';
	this.mainstframe.style.left = '0px';
	this.mainstframe.src="";
	this.wrapper= document.createElement('div');
	this.wrapper.id = 'stwrapper';
	this.wrapper.className = 'stwrapper';
	this.wrapper.style.visibility = 'hidden';
	this.wrapper.style.top = "-999px";
	this.wrapper.style.left = "-999px";
	this.closewrapper= document.createElement('div');
	this.closewrapper.className = 'stclose';
	
	if(switchTo5x){
		this.mainstframe.width = '500px';
		this.mainstframe.height = '430px';
		this.wrapper.style.top = "-999px";
		this.wrapper.style.left = "-999px";
		this.wrapper.style.width = "500px";
		this.wrapper.style.zIndex = 89999999;
		
		this.overlay = document.createElement('div');
		this.overlay.style.height = '100%';
		this.overlay.style.width = '100%';
		this.overlay.style.backgroundColor = '#000';
		this.overlay.style.opacity = '0.6';
		this.overlay.style.filter= "Alpha(Opacity=60)"; //IE
		this.overlay.style.position = 'fixed';
		if( document.all &&  navigator.appVersion.indexOf('MSIE 6.')!=-1 ){
			this.overlay.style.position = 'absolute';
		}
		this.overlay.style.display = 'none';
		this.overlay.style.left = '0';
		this.overlay.style.top = '0';
		this.overlay.style.zIndex = 89999990;
		this.overlay.setAttribute('id', 'stOverlay');
		this.closewrapper.className = 'stCloseNew2';
	}
	
	this.closewrapper.onclick = function(){stWidget.closeWidget();};
	this.wrapper.appendChild(this.closewrapper);
	this.wrapper.appendChild(this.mainstframe);
	this.ogtitle=null;
	this.ogdesc=null;
	this.ogurl=null;
	this.ogimg=null;
	this.ogtype=null;
	this.desc=null;
	this.initFire=false;
	this.merge=function(o1,o2){
		for(var opts in o2){
			if(o1.hasOwnProperty(opts) && o2[opts]!==null){
				o1[opts]=o2[opts];
			}
		} 
	};
	this.oldScroll=0;
	//document.body.appendChild(this.wrapper);
	this.init=function(){
		if(stWidget.initFire==false){
			stWidget.initFire=true;
			if(switchTo5x){
				window.frames['stLframe'].location.replace(stWidget.frameUrl5x+stWidget.createFrag(null,'init'));
			} else {
				window.frames['stLframe'].location.replace(stWidget.frameUrl4x+stWidget.createFrag(null,'init'));
				//document.body.appendChild(stWidget.wrapper);
			}
		}
	};
};

stWidget.options=new function(){
	this.fpc=stLight.fpc;
	this.sessionID=null;
	this.publisher=null;
	this.tracking=true;
	this.send_services=null;
	this.exclusive_services=null;	/*4x*/
	this.headerTitle=null;
	this.headerfg=null;
	this.headerbg=null;
	this.offsetLeft=null;
	this.offsetTop=null;
	this.onhover=true;
	this.async=false;
	this.autoclose=true;
	this.autoPosition=true;
	this.embeds=false;
	this.doneScreen=true;
	this.minorServices=true;
	this.excludeServices=null;	/*5x*/
	this.theme=1;
	this.serviceBarColor=null;
	this.shareButtonColor=null;
	this.footerColor=null;
	this.headerTextColor=null;
	this.helpTextColor=null;
	this.mainWidgetColor=null;
	this.textBoxFontColor=null;
	this.textRightToLeft=false;
	this.shorten=true;
	this.popup=false;
	this.newOrZero='new';
	this.publisherGA=null;
	this.services="";
	this.relatedDomain=null;
};

/*
stButtons.addEntry=function(surl,stitle,selement,service){
		stWidget.addEntry({url:surl,title:stitle,element:selement,service:service});
};*/

stWidget.addEntry=function(options){
	/*
	 * 
	 *  {
					'service' : elem[i].className.match(reg5)[1],
					'element' : elem[i],
					'url' : elem[i].getAttribute('st_url'),
					'title' : elem[i].getAttribute('st_title'),
					'text' : elem[i].getAttribute('displayText'),
					'description' : elem[i].getAttribute('st_summary'),
					'thumbnail' : (elem[i].getAttribute('st_img')!=null) ? elem[i].getAttribute('st_img'): elem[i].getAttribute('st_image'),
					'type' : 'chicklet'
				}
	 * 
	 * */
	if(!options.element){
		return false;
	}
	
	if( options && options.service && ( 
		(options.service=="email" || options.service=="sharethis" || options.service=="wordpress") || (
			(stIsLoggedIn && servicesLoggedIn && typeof(servicesLoggedIn[options.service])!='undefined' && ( (useFastShare || (!useFastShare && switchTo5x)) && (options.service=="facebook" || options.service=="twitter" || options.service=="yahoo" || options.service=="linkedin"))) 
	)))
	{
		openWidget = true;
	}
	else
	{
		openWidget = false;
	}
	
	if(!openWidget){										//Create buttons where widget need not be opened
		if(options.type!=="custom"){													//Non Custom Buttons
			options.element.appendChild(stButtons.makeButton(options));
			if(options.service=="plusone"){
				stButtons.getPlusOneFromGoogle();
			}
			if(options.service=="fblike"||options.service=="fbsend"||options.service=="fbrec"||options.service=="fbLong"){
				stButtons.getXFBMLFromFB();
			}
		}else{																			//Custom Buttons
			stButtons.makeButton(options);
		}
		return true;
	}else{																			//Create buttons where widget needs to be opened
		if(options.type!="custom"){														//Non Custom
			options.element.appendChild(stButtons.makeButton(options));
			//console.debug(options.element, options.service);
			if(options.service=="plusone"){
				stButtons.getPlusOneFromGoogle();
			}
			if(options.service=="fblike"||options.service=="fbsend"||options.service=="fbrec"||options.service=="fbLong"){
				stButtons.getXFBMLFromFB();
			}
		}else{																			//Custom Buttons
			stButtons.makeButton(options);
			//console.debug(options.element, options.service);
		}

		var o=new Shareable(options);
		o.idx=stWidget.entries;
		stWidget.entries++;
		o.publisher=stLight.publisher;
		o.sessionID=stLight.sessionID;
		o.fpc=stLight.fpc;
		if(options.element.image==null && stWidget.ogimg!=null){
			o.image=stWidget.ogimg;
		}		
		if(options.element.summary==null && stWidget.ogdesc!=null){
			o.summary=stWidget.ogdesc;
		} else if(options.element.summary==null && stWidget.desc!=null){
			o.summary=stWidget.desc;
		}

		o.url = stWidget.ogurl ? stWidget.ogurl : document.location.href;
		o.url = options.url	?	options.url	: o.url;

		o.title = stWidget.ogtitle ? stWidget.ogtitle : document.title;
		o.title = options.title	? options.title: o.title;

		stWidget.merge(o,stWidget.options);

		if(typeof(stWidget.options.textRightToLeft)!='undefined' && stWidget.options.textRightToLeft!='null' && stWidget.options.textRightToLeft==true)
		{
			document.getElementById('stwrapper').style.top='auto';
			document.getElementById('stwrapper').style.left='auto';			
		}
		
		o.mouseOn=function(){stWidget.mouseOnTimer=setTimeout(o.decideFastShare,500);}; //TODO - verify timer
		o.mouseOut=function(){clearInterval(stWidget.mouseOnTimer);};
		
		o.decideFastShare=function(){
			if(!useFastShare || !stIsLoggedIn || options.service=='email' || options.service=='sharethis' || options.service=='wordpress' || (typeof(servicesLoggedIn[options.service])=='undefined' && (options.service=='facebook' || options.service=='twitter' || options.service=='linkedin' || options.service=='yahoo') ))
			{
				//check useragent
				if (detectMobileDevice()) {
					if(options.service=='sharethis'){
//						element.element.onclick=function(){

							var form = document.createElement("form");
						    form.setAttribute("method", "GET");
						    form.setAttribute("action", "http://edge.sharethis.com/share4x/mobile.html");
							form.setAttribute("target", "_blank");
							//destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source=buttons
							var params={url:o.url,title:o.title,destination:options.service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID};
							if(typeof(o.image)!='undefined' && o.image!=null){
								params.image=o.image;
							}if(typeof(o.summary)!='undefined' && o.summary!=null){
								params.desc=o.summary;
							}
							params.service = options.service;
							params.type = options.type;

						    for(var key in params) {
						        var hiddenField = document.createElement("input");
						        hiddenField.setAttribute("type", "hidden");
						        hiddenField.setAttribute("name", key);
						        hiddenField.setAttribute("value", params[key]);
						        form.appendChild(hiddenField);
						    }
						    document.body.appendChild(form); 
						    form.submit();
//						};
					}
					else if(options.service=='email'){
//						element.element.onclick=function(){
						
						var mailto_link = 'mailto:?subject='+encodeURIComponent(o.title)+'&body='+encodeURIComponent(o.url);

						var form = document.createElement("form");
						form.setAttribute("method", "POST");
						form.setAttribute("action", mailto_link);
						form.setAttribute("target", "_blank");
						form.setAttribute("accept-charset", "UTF-8");
						document.body.appendChild(form); 
						form.submit();

//						};
					}
				}
				else
					o.popup();
			}
			else
			{
				
				//create an object for fast share && open fastShare
				//e = e || window.event;
				//var target = e.target || e.srcElement;
				var source = stLight.getSource();
				stLight.log('fastShare', source, "");
				
				stFastShareObj.url = o.url;
				stFastShareObj.title = o.title;
				stFastShareObj.image = o.image;
				stFastShareObj.summary = o.summary;			
				stFastShareObj.element = options.element;
				stFastShareObj.service = options.service;
				stFastShareObj.publisher = stLight.publisher;
				stFastShareObj.fpc = stLight.fpc;
				stFastShareObj.sessionID = stLight.sessionID;
				stFastShareObj.hostname = stLight.meta.hostname;
				stFastShareObj.username = servicesLoggedIn[options.service];
				//console.debug('in buttons.js ', stFastShareObj);
				if(typeof(fastShare)=='undefined'){
					stLight.odjs((("https:" == document.location.protocol) ? "https://ws.sharethis.com/button/fastShare.js" : "http://w.sharethis.com/button/fastShare.js"),function(){
						fastShare.showWidget();
					});					
				} else {
					fastShare.showWidget();
				}
			}
		};
		
		o.popup=function(){
			if(stWidget.widgetOpen==false){
				if (!switchTo5x)
					stWidget.stCancelClose();
				var source = 'share4x';
				if(switchTo5x){
					source = 'share5x';
					try{
						if(stLight.clickCallBack != false){
							stLight.clickCallBack(options.service);
						}
					} catch (err) {
						
					}
				}
				if (options.type == 'stbar' || options.type == 'stsmbar'){
					source = 'bar';
				}
				stLight.log("widget", source, options.service + "_" + options.type);

				if(stWidget.options.popup && !switchTo5x) {
					window.open(stWidget.frameUrl4x+stWidget.createFrag(o), "newstframe","status=1,toolbar=0,width=345,height=375");
		        } 
				else if (stWidget.options.popup && switchTo5x){
					var openPageWidget = 'http://sharethis.com/share?' +
					'url=' + o.url +
					'&title=' + o.title +
					'&img=' + o.image +
					'&summary=' + o.summary;
//					var openPageWidget = 'http://sharethis.com/share?'+stWidget.createFrag(o);
					window.open(openPageWidget, "newstframe","status=1,toolbar=0,width=820,height=950");
					//window.open(stWidget.frameUrl5x+stWidget.createFrag(o), "newstframe","status=1,toolbar=0,width=455,height=445");
				}
				else {
					if (stWidget.frameReady==true) {
						if(switchTo5x && (options.service=='sharethis' || options.service=='email' || options.service=='wordpress'|| options.service=='facebook' || options.service=='twitter' || options.service=='linkedin' || options.service=='yahoo' )){
							window.frames['stLframe'].location.replace(stWidget.frameUrl5x+stWidget.createFrag(o));
						} else{
							window.frames['stLframe'].location.replace(stWidget.frameUrl4x+stWidget.createFrag(o));
						}
					} else {
						stWidget.storedFrag = stWidget.createFrag(o);
					}
					stWidget.positionWidget(o);
					if(stWidget.options.embeds==false){
						stWidget.hideEmbeds();
					}
					setTimeout(function(){stWidget.widgetOpen=true;st_showing=true;},200);
				}
			}else if(stWidget.widgetOpen==true && stWidget.options.onhover==false){//widget is open close it
				//close widget
			}
			return false;
		};
		o.init();
		return o;
	}
	//at the end
};

stWidget.createFrag=function(opt,initStr){
	//console.debug("Created a frag");
	var init="#light";
	init = stWidget.options.popup ? "#popup" : init;
	__stgetPubGA();
	if(initStr=="init"){
		init="#init";
		
		if ( stWidget.options.tracking && stWidget.options.publisherGA == null){
			//get publisherGA key
			if( typeof(pageTracker) != "undefined" && pageTracker!==null ) {
				stWidget.options.publisherGA = pageTracker._getAccount();
			}else if (stWidget.options.publisherGA == null && typeof(__stPubGA)!=="undefined"){
				stWidget.options.publisherGA = 	__stPubGA;
			}
		}
		//console.log(__stPubGA);
		
		for (var o in stWidget.options){
			if(stWidget.options.hasOwnProperty(o)==true && stWidget.options[o]!==null && typeof(stWidget.options[o])!="function" && typeof(stWidget.options[o])!="object"){
				var temp=stWidget.options[o];
				try{
					temp=decodeURIComponent(temp);
					temp=decodeURIComponent(temp);
				}catch(err){}
	    		init = init+"/"+o+"="+encodeURIComponent(temp);
	    	}
		}
		init=init+"/pUrl="+encodeURIComponent(encodeURIComponent(document.location.href))+((document.title!="")?"/title="+encodeURIComponent(encodeURIComponent(document.title)):"")+"/stLight=true";
	} else {
		for (var o in opt){
			if(opt.hasOwnProperty(o)==true && opt[o]!==null && typeof(opt[o])!="function" && typeof(opt[o])!="object" && o!=="idx"){
	    		init = init+"/"+o+"-=-"+encodeURIComponent(encodeURIComponent(opt[o]));
	    	}
		}
		//console.debug('so opt.service is ' + opt.service);
		if(opt.service=="email"){
			init=init+"/page-=-send";
		}
		
		if(switchTo5x){
			if(opt.service=='facebook') {
				init=init+"/page-=-fbhome";
			} else if(opt.service=='twitter') {
				init=init+"/page-=-twhome";
			} else if(opt.service=='yahoo') {
				init=init+"/page-=-ybhome";
			}else if(opt.service=='linkedin') {
				init=init+"/page-=-lihome";
			} else if(opt.service=='wordpress') {
				init=init+"/page-=-wphome";
            }

		}
	}
	return init;
};


stWidget.positionWidget=function(o){
	function getHW(elem) {
		var retH=0;
		var retW=0;
		var going = true;
		while( elem!=null ) {
			retW+= elem.offsetLeft;
			if (going) {
				retH+= elem.offsetTop;
			}
			if (window.getComputedStyle) {
				if (document.defaultView.getComputedStyle(elem,null).getPropertyValue("position") == "fixed") {
					retH += (document.documentElement.scrollTop || document.body.scrollTop);
					going = false;
				}
			} else if (elem.currentStyle) {
				if (elem.currentStyle["position"] == "fixed") {
					retH += (document.documentElement.scrollTop || document.body.scrollTop);
					going = false;
				}
			}
			elem= elem.offsetParent;
		}
		return {height:retH,width:retW};
	}
	if(!o){
		return false;
	}
	
	if(!switchTo5x){
		shareel=o.element;
		var curleft = curtop = 0;
		var mPos = getHW(shareel);
		curleft = mPos.width;
		curtop = mPos.height;
		shareel=o.element;
		var eltop = 0;
		var elleft = 0;
		var topVal = 0;
		var leftVal = 0;
		var elemH = 0;
		var elemW = 0;
		eltop = curtop + shareel.offsetHeight + 5;
		elleft = curleft + 5;
		topVal = (eltop + (stWidget.options.offsetTop?stWidget.options.offsetTop:0));
		topVal = eval(topVal);
		elemH = topVal;
		topVal += "px";
		leftVal = (elleft + (stWidget.options.offsetLeft?stWidget.options.offsetLeft:0));
		leftVal = eval(leftVal);
		elemW = leftVal;
		leftVal += "px";
		stWidget.wrapper.style.top = topVal;
		stWidget.wrapper.style.left = leftVal;
		if (stWidget.options.autoPosition == true) {
			stWidget.oldScroll = document.body.scrollTop;
			var pginfo = stWidget.pageSize();
			var effectiveH = pginfo.height + pginfo.scrY;
			var effectiveW = pginfo.width + pginfo.scrX;
			var widgetH = 330;
			var widgetW = 330;
			var needH = widgetH + elemH; 
			var needW = widgetW + elemW; 
			var diffH = needH - effectiveH;
			var diffW = needW - effectiveW;
			var newH = elemH - diffH;
			var newW = elemW - diffW;
			
			var buttonPos = getHW(shareel);
			var leftA, rightA, topA, bottomA = false;
			if (diffH > 0) {
				// bottom space is not available assume top is
				bottomA = false;
				topA = true;
				if ((buttonPos.height - widgetH) > 0) {
					newH = buttonPos.height - widgetH;
				}
				stWidget.wrapper.style.top = newH + "px";
			}
			if (diffW > 0) {
				// left is not available assume right is...
				leftA = false;
				rightA = true;
				if ((buttonPos.width - widgetW) > 0) {
					newW = buttonPos.width - widgetW;
				}
				stWidget.wrapper.style.left = newW + "px";
			}
		}
		if (stWidget.options.autoPosition == "center") {
			stWidget.wrapper.style.top = "15%";
			stWidget.wrapper.style.left = "35%";
			stWidget.wrapper.style.position = "fixed";
		}
	} else {
		document.getElementById('stOverlay').style.display = 'block';
		var topVal;
		if (stWidget.options.autoPosition == true) {
			if( document.all && navigator.appVersion.indexOf('MSIE 7.')!=-1){
				stWidget.wrapper.style.left = "500px";
			} else {
				stWidget.wrapper.style.left = "10%";
			}

			stWidget.wrapper.style.right = "10%";
			topVal = (document.documentElement.clientHeight - parseFloat(stWidget.wrapper.offsetHeight)/2)/2;
			if(topVal > 20){topVal = 20;} else if(topVal < 5){topVal=5;}
			stWidget.wrapper.style.top = topVal + 'px';			
			stWidget.wrapper.style.marginLeft = "auto";
			stWidget.wrapper.style.marginRight = "auto";
			stWidget.wrapper.style.textAlign = "left";
			stWidget.wrapper.style.position = "fixed";
			if( document.all &&  navigator.appVersion.indexOf('MSIE 6.')!=-1 ){
				stWidget.wrapper.style.left = "300px";
				stWidget.wrapper.style.position = 'absolute';
			}
		}
		if (stWidget.options.autoPosition == "center") {
			//stWidget.wrapper.style.top = "15%";
			if( document.all && navigator.appVersion.indexOf('MSIE 7.')!=-1){
				stWidget.wrapper.style.left = "500px";
			} else {
				stWidget.wrapper.style.left = "10%";
			}
			stWidget.wrapper.style.right = "10%";
			stWidget.wrapper.style.marginLeft = "auto";
			stWidget.wrapper.style.marginRight = "auto";
			stWidget.wrapper.style.position = "fixed";
			topVal = (document.documentElement.clientHeight - parseFloat(stWidget.wrapper.offsetHeight)/2)/2;
			if(topVal > 20){topVal = 20;} else if(topVal < 5){topVal=5;}
			stWidget.wrapper.style.top = topVal + 'px';
			if( document.all &&  navigator.appVersion.indexOf('MSIE 6.')!=-1 ){
				stWidget.wrapper.style.position = 'absolute';
			}
		}
	}
	
	stWidget.wrapper.style.visibility = "visible";
	stWidget.mainstframe.style.visibility = 'visible';
},

stWidget.hideWidget=function(){
	if(stWidget.wrapper.style.visibility !== 'hidden'){
		stWidget.wrapper.style.visibility = 'hidden';
	}
	if(stWidget.mainstframe.style.visibility !== 'hidden'){
		stWidget.mainstframe.style.visibility = 'hidden';
	}
	if(switchTo5x){
		document.getElementById('stOverlay').style.display = 'none';	
	}
};

stWidget.pageSize=function() {
    var pScroll = [0,0,0,0];
	var scX=0;
	var scY=0;
	var winX=0;
	var winY=0;
    if (typeof(window.pageYOffset) == 'number') {
        //Netscape compliant
        scX=window.pageXOffset;
		scY=window.pageYOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        //DOM compliant
		scX=document.body.scrollLeft;
		scY=document.body.scrollTop;
    } else if (document.documentElement
      && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        //IE6 standards compliant mode
		scX=document.documentElement.scrollLeft;
		scY=document.documentElement.scrollTop;
    }
	   if (window.innerWidth) {
   		winX=window.innerWidth;
      	winY=window.innerHeight;
   }
   else if (document.documentElement.offsetWidth) {
   		winX= document.documentElement.offsetWidth;
        winY=document.documentElement.offsetHeight;
   }
	pScroll={scrX:scX,scrY:scY,width:winX,height:winY};
    return pScroll;
};

stWidget.closetimeout=null;

stWidget.stClose=function(timer){
	if(!timer){
		timer=1000;
	}
	if(!switchTo5x && stWidget.options.autoclose!=null && (stWidget.options.autoclose==true || stWidget.options.autoclose=='true')){
		if(stWidget.openDuration<0.5 && stWidget.stopClosing==false){
			stWidget.closetimeout = setTimeout("stWidget.closeWidget()",timer);
		}else{
			stWidget.stopClosing=true;
		}
	}
}

stWidget.stCancelClose=function() {
	clearTimeout(stWidget.closetimeout);
	stWidget.buttonClicked=true;
	setTimeout(function(){stWidget.buttonClicked=false;},100);//manu
}

stWidget.closeWidget=function(){
	//console.debug('now in stWidget.closeWidget');
	if(st_showing==false){
		return false;
	}
	st_showing = false;
	stWidget.widgetOpen=false;
	stWidget.wrapper.style.visibility ='hidden' ;
	stWidget.mainstframe.style.visibility = 'hidden';
	stWidget.showEmbeds();
	stWidget.sendEvent("screen","home");
	if(switchTo5x){
		document.getElementById('stOverlay').style.display = 'none';
	} else {
		stWidget.wrapper.style.top = "-999px";
		stWidget.wrapper.style.left = "-999px";
	}
};


stWidget.hideEmbeds=function() {
    var embeds = document.getElementsByTagName('embed');
    for (var i=0; i< embeds.length; i++) {
        embeds[i].style.visibility = "hidden";
    }
};
stWidget.showEmbeds=function() {
	if(stWidget.options.embeds==true){
		return true;
	}
    var embeds = document.getElementsByTagName('embed');
    for (var i=0; i< embeds.length; i++){
        embeds[i].style.visibility = "visible";
    }
};
stWidget.sendEvent=function(name,value){
	var tmpSend="#widget/"+name+"="+value;
	try{
		if(switchTo5x){
			window.frames['stLframe'].location.replace(stWidget.frameUrl5x+tmpSend);
		} else {
			window.frames['stLframe'].location.replace(stWidget.frameUrl4x+tmpSend);
		}
	}catch(err){}
};


stWidget.getOGTags=function(){
	var meta=document.getElementsByTagName("meta");
	for(var i=0;i<meta.length;i++){
		if(meta[i].getAttribute('property')=="og:title"){
			stWidget.ogtitle=meta[i].getAttribute('content');
		}else if(meta[i].getAttribute('property')=="og:type"){
			stWidget.ogtype=meta[i].getAttribute('content');
		}else if(meta[i].getAttribute('property')=="og:url"){
			stWidget.ogurl=meta[i].getAttribute('content');
		}else if(meta[i].getAttribute('property')=="og:image"){
			stWidget.ogimg=meta[i].getAttribute('content');
		}else if(meta[i].getAttribute('property')=="og:description"){
			stWidget.ogdesc=meta[i].getAttribute('content');
		}else if(meta[i].getAttribute('name')=="description" || meta[i].getAttribute('name')=="Description"){
			stWidget.desc=meta[i].getAttribute('content');
		}
	}
};


/*****IOS/ANDROID DEVICE DETECTION *********/
var deviceIphone = "iphone";
var deviceIpod = "ipod";
var deviceIpad = "ipad";

//Initialize our user agent string to lower case.
var uagent = navigator.userAgent.toLowerCase();

//**************************
// Detects if the current device is an iPhone.
function detectIphone()
{
   if (uagent.search(deviceIphone) > -1)
      return true;
   else
      return false;
}

//**************************
// Detects if the current device is an iPod Touch.
function detectIpod()
{
   if (uagent.search(deviceIpod) > -1)
      return true;
   else
      return false;
}

//**************************
//Detects if the current device is an iPod Touch.
function detectIpad()
{
if (uagent.search(deviceIpad) > -1)
   return true;
else
   return false;
}

//**************************
// Detects if the current device is an iPhone or iPod Touch.
function detectIphoneOrIpod()
{
    if (detectIphone())
       return true;
    else if (detectIpod())
       return true;
    else
       return false;
}

//Detects if the current device is an android.
function detectAndroid()
{
	var isAndroid = uagent.indexOf("android") > -1; //&& ua.indexOf("mobile");
	if (isAndroid)
		return true;
	else
		return false;
}

//Detects if the current device is an android.
function detectBlackBerry()
{
	var isBB = uagent.indexOf("blackberry") > -1; //&& ua.indexOf("mobile");
	if (isBB)
		return true;
	else
		return false;
}

//Detects if its a mobile device.
function detectMobileDevice()
{
    if (detectIphone())
       return true;
    else if (detectIpad())
       return true;
    else if (detectIpod())
        return true;
    else if (detectAndroid())
        return true;
    else if (detectBlackBerry())
        return true;
    else
       return false;
}

/*******************GA Logging***************************/

function shareLog(service){
	//use ga on the publisher's page
	if( typeof(pageTracker) != "undefined" && pageTracker!==null ) {
		pageTracker._trackEvent('ShareThis', service);
	}else if( typeof(_gaq) != "undefined" && _gaq!==null ) {
		_gaq.push(['_trackEvent', 'ShareThis', service]);
	}else if (stButtons.publisherTracker!==null){
		stButtons.publisherTracker._trackEvent('ShareThis', service);
	}else if (typeof(_gat) != "undefined" && _gat!==null){
		if (typeof(stWidget.options.publisherGA) != 'undefined' && stWidget.options.publisherGA != null){
			stButtons.publisherTracker = _gat._getTracker(stWidget.options.publisherGA);
			stButtons.publisherTracker._trackEvent('ShareThis', service);
		}
	}
}

stButtons.completeInit=function(){

	if(!stButtons.goToInit){
		stButtons.goToInit = true;
		stWidget.getOGTags();
		document.body.appendChild(stWidget.wrapper);
		if(switchTo5x){
			document.body.appendChild(stWidget.overlay);
		}
		
		if (!switchTo5x) {
			try{
				var stfrm=document.getElementById("stLframe");
	        	stfrm.onmouseover=function(){stWidget.stCancelClose();stWidget.inTime=(new Date()).getTime();};
	        	stfrm.onmouseout=function(){stWidget.outTime=(new Date()).getTime();stWidget.openDuration=(stWidget.outTime-stWidget.inTime)/1000;stWidget.stClose();};
	        	try{
		        	if(document.body.attachEvent){
		        		document.body.attachEvent('onclick',function(){if(stWidget.buttonClicked==false){stWidget.stopClosing=false;stWidget.openDuration=0;stWidget.stClose(100);}});
		    		}else{
		    			document.body.setAttribute('onclick','if(stWidget.buttonClicked==false){stWidget.stopClosing=false;stWidget.openDuration=0;stWidget.stClose(100);}');
		    		}
	        	}catch(err){
	        		document.body.onclick=function(){if(stWidget.buttonClicked==false){stWidget.stopClosing=false;stWidget.openDuration=0;stWidget.stClose(100);}}; //close widget instantly on body click	
	        	}
			}catch(err){}
		}
		
		stButtons.makeButtons();
		stWidget.init();		
	}
};


plusoneCallback = function(obj) {
	if(obj.state=="on") {
		var url = (("https:" == document.location.protocol) ? "https://ws" : "http://wd")+".sharethis.com/api/sharer.php?destination=plusone&url="+encodeURIComponent(obj.href);
		url+= "&publisher="+ encodeURIComponent(stLight.publisher);
		url+= "&hostname="+ encodeURIComponent(stLight.meta.hostname);
		url+= "&location="+ encodeURIComponent(stLight.meta.location);
		url+= "&ts=" + (new Date()).getTime();
		url+= "&sessionID="+stLight.sessionID;
		url+= "&fpc="+stLight.fpc;	
		var mImage = new Image(1,1);
		mImage.src = url;
		mImage.onload = function(){return;};
	}
};

stButtons.trackFB=function(){
	try {
		if (!stButtons.fbTracked && typeof(FB)!="undefined" && typeof(FB.Event)!="undefined" && typeof(FB.Event.subscribe)!="undefined") {
	    	stButtons.fbTracked = true;
	      FB.Event.subscribe('edge.create', function(targetUrl) {
	    	  stButtons.trackShare("fblike_auto",targetUrl);
	    	  stLight.callSubscribers("click","fblike",targetUrl);
	      });
	      FB.Event.subscribe('edge.remove', function(targetUrl) {
	    	  stButtons.trackShare("fbunlike_auto",targetUrl);
	    	  stLight.callSubscribers("click","fbunlike",targetUrl);
	      });
	      FB.Event.subscribe('message.send', function(targetUrl) {
	    	  stButtons.trackShare("fbsend_auto",targetUrl);
	    	  stLight.callSubscribers("click","fbsend",targetUrl);
	      });
	    }
	  }catch(err){}
};

stButtons.trackTwitter=function(){
	//try {
		if (!stButtons.twitterTracked && typeof(twttr)!="undefined" && typeof(twttr.events)!="undefined" && typeof(twttr.events.bind)!="undefined") {
			stButtons.twitterTracked = true;
	    	twttr.events.bind('click',function(event){stButtons.trackTwitterEvent("click");stLight.callSubscribers("click","twitter")}); 
	        twttr.events.bind('tweet',function(){stButtons.trackTwitterEvent("tweet");}); 
	        twttr.events.bind('retweet',function(){stButtons.trackTwitterEvent("retweet");stLight.callSubscribers("click","retweet")}); 
	        twttr.events.bind('favorite',function(){stButtons.trackTwitterEvent("favorite");stLight.callSubscribers("click","favorite")}); 
	        twttr.events.bind('follow',function(){stButtons.trackTwitterEvent("follow");stLight.callSubscribers("click","follow")}); 
	    }
	// }catch(err){}
};

stButtons.trackTwitterEvent=function(name){
	stButtons.trackShare("twitter_"+name+"_auto");
};


stButtons.trackShare=function(destination,inUrl){
	if(typeof(inUrl)!=="undefined" && inUrl!==null){
		var outUrl=inUrl;
	}else{
		var outUrl=document.location.href;
	}
	var url = (("https:" == document.location.protocol) ? "https://ws" : "http://wd")+".sharethis.com/api/sharer.php?destination="+destination+"&url="+encodeURIComponent(outUrl);
	url+= "&publisher="+ encodeURIComponent(stLight.publisher);
	url+= "&hostname="+ encodeURIComponent(stLight.meta.hostname);
	url+= "&location="+ encodeURIComponent(stLight.meta.location);
	url+= "&ts=" + (new Date()).getTime();
	url+= "&sessionID="+stLight.sessionID;
	url+= "&fpc="+stLight.fpc;	
	var mImage = new Image(1,1);
	mImage.src = url;
	mImage.onload = function(){return;};
};

stLight.processSTQ=function(){
	if(typeof(_stq)!="undefined"){
		for(var i=0;i<_stq.length;i++){
			var item=_stq[i];
			stLight.options(item);
		}
	}else{
		return false;
	}
};

stLight.onDomContentLoaded=function(){
	//console.log("onDomContetnLoaded");
	//stButtons.locateElements();
	//stButtons.makeButtons();
	stLight.onReady();
	stButtons.trackTwitter();
	//alert("onDomContetnLoaded");
};

stLight.messageReceiver=function(event){
	if(event && (event.origin=="http://edge.sharethis.com" || event.origin=="https://ws.sharethis.com")){
		var data=event.data;
		data=data.split("|");
		if(data[0]=="ShareThis" && data.length>2){
			var url= (typeof(data[3])=="undefined") ? document.location.href : data[3];
			stLight.callSubscribers(data[1],data[2],url);
		}
			
	}
};

stLight.subscribe=function(evnt,fun){
	if(evnt=="click"){
		stLight.clickSubscribers.push(fun);
	}
};

stLight.callSubscribers=function(evnt,service,url){
	if(evnt=="click"){
		for(var i=0;i<stLight.clickSubscribers.length;i++){
			stLight.clickSubscribers[i]("click",service,url); //their function must accept event,service 
		}
	}
};

stLight.gaTS=function(type,service,url){
	if(service=="fblike"){
		network="ShareThis_facebook";
		action="Like";
	}else if(service=="fbunlike"){
		network="ShareThis_facebook";
		action="UnLike";
	}else if(service=="fbsend"){
		network="ShareThis_facebook";
		action="Send";
	}else if(service=="twitter"){
		network="ShareThis_twitter";
		action="Share";
	}else if(service=="retweet"){
		network="ShareThis_twitter";
		action="ReTweet";
	}else if(service=="favorite"){
		network="ShareThis_twitter";
		action="Favorite";
	}else if(service=="follow"){
		network="ShareThis_twitter";
		action="Follow";
	}else{
		network="ShareThis_"+service;
		action="Share";
	}
	if( typeof(_gaq) != "undefined") {
		_gaq.push(['_trackSocial', network,action,url]);
	}
};


stButtons.onReady=function(){
	var elemList=document.getElementsByTagName('*');
	var fillArray=[];
	var regexSmart = new RegExp(/sharethis_smartbuttons/);
	var smartFound = false;
	for(var s= 0; s<elemList.length; s++) 
	{
		if(typeof(elemList[s].className)=='string' && elemList[s].className!='')
		{
			if (elemList[s].className.match(regexSmart)) 
			{
				smartFound = true;
				break;
			}
		}
	}

	if(smartFound)
	{
		var docHead=document.getElementsByTagName('head')[0];
		var data=["return=json","cb=stButtons.smartifyButtons"];
		data=data.join('&');
		var docScriptSrc=(("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getRecentServices.php?"+data;
		var docScript=document.createElement('script');
		docScript.setAttribute('type', 'text/javascript');
		docScript.setAttribute('src', docScriptSrc);
		docHead.appendChild(docScript);
		setTimeout("stButtons.completeInit()",2000);
	}
	else
	{
		stButtons.completeInit();
	}
	stLight.subscribe("click",stLight.gaTS);
};


stLight.domReady=function(){
	stLight.onReady();
	stButtons.trackTwitter();
	__stgetPubGA();
	if(typeof(__stPubGA)!=="undefined" && stLight.readyRun==true && stWidget.frameReady==true){//ga is found but was not sent with init
		//send frag event
		stWidget.sendEvent("publisherGA",__stPubGA);
	}
};

stButtons.goToInit = false;
stButtons.widget=false;
stButtons.widgetArray=[];
stButtons.queue=[];
stButtons.cbQueue=[];
stButtons.cbVal=0;
stButtons.queuePos=0;
stButtons.counts=[];
st_showing=false;
stButtons.urlElements = [];
stButtons.publisherTracker = null;
stButtons.plusOneLoaded=false;
stButtons.plusOneLoading=false;
stButtons.xfbmlLoaded=false;
stButtons.xfbmlLoading=false;
stButtons.fbTracked=false;
stButtons.twitterTracked=false;
stButtons.countsResp=[];
stWidget.getOGTags();
stLight.loadServicesLoggedIn(function(){
	stButtons.locateElements();
	stButtons.makeButtons();
});
stLight.clickSubscribers=[];
var __stPubGA;

if(window.document.readyState=="completed"){
	stLight.domReady();//domReady
}else{
	if (typeof(window.addEventListener) != 'undefined') {
	    window.addEventListener("load", stLight.domReady, false);
	} else if (typeof(document.addEventListener) != 'undefined') {
	    document.addEventListener("load", stLight.domReady, false);
	} else if (typeof window.attachEvent != 'undefined') {
	    window.attachEvent("onload", stLight.domReady);
	}
}



if (typeof(window.addEventListener) != 'undefined') {
    window.addEventListener("click",function(){stWidget.closeWidget();}, false);
} else if (typeof(document.addEventListener) != 'undefined') {
    document.addEventListener("click", function(){stWidget.closeWidget();}, false);
} else if (typeof window.attachEvent != 'undefined') {
    window.attachEvent("onclick", function(){stWidget.closeWidget();});
}
//DOMContentLoaded
if(typeof(__st_loadLate)=="undefined"){
	if (typeof(window.addEventListener) != 'undefined') {
	    window.addEventListener("DOMContentLoaded", stLight.onDomContentLoaded, false);
	} else if (typeof(document.addEventListener) != 'undefined') {
	    document.addEventListener("DOMContentLoaded", stLight.onDomContentLoaded, false);
	}
}


//Message Receiver
if (typeof(window.addEventListener) != 'undefined') {
    window.addEventListener("message", stLight.messageReceiver, false);
} else if (typeof(document.addEventListener) != 'undefined') {
    document.addEventListener("message", stLight.messageReceiver, false);
}else if (typeof window.attachEvent != 'undefined') {
    window.attachEvent("onmessage", stLight.messageReceiver);
}

if(document.readyState == "complete" && stLight.readyRun==false){ //Keep at the end of the file
	//This is called after body is loaded so the domeready call would never get called, so call it here
	stLight.domReady();
}
