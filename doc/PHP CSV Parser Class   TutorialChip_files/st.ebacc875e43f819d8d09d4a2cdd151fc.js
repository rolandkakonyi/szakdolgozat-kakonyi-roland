/******************CONSOLE*********************/
if (!window.console || !console.firebug) {
	var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd",
				 "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	window.console = {};
	for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {};
}

/***************JSON ENCODE/DECODE***************/

$JSON = new function(){
	this.encode = function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = $[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = $JSON.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', d(self.getMonth() + 1), '-', d(self.getDate()), 'T', d(self.getHours()), ':', d(self.getMinutes()), ':', d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(rs, s).replace(ru, u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = $JSON.encode(self[key])))
							result[i++] = '"'.concat(key.replace(rs, s).replace(ru, u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	};
	this.decode=function(input){
		if(typeof(input)=='string')
		{
			var data=null;
			try{if ( /^[\],:{}\s]*$/.test(input.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			 .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
			 .replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
			 	data=window.JSON && window.JSON.parse ? window.JSON.parse(input) : (new Function("return " + input))();
			 	return data;
			 }else{
			 	return null;
			 }}catch(err){}	
		}
	};
	
	var	c = {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
		d = function(n){return n<10?"0".concat(n):n},
		e = function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
		i = function(e,p,l){return 1*e.substr(p,l)},
		p = ["","000","00","0",""],
		rc = null,
		rd = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
		rs = /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
		rt = /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
		ru = /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
		s = function(i,d){return "\\".concat(c[d])},
		u = function(i,d){
			var	n=d.charCodeAt(0).toString(16);
			return "\\u".concat(p[n.length],n)
		},
		v = function(k,v){return $[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
		$ = {
			"boolean":function(){return Boolean},
			"function":function(){return Function},
			"number":function(){return Number},
			"object":function(o){return o instanceof o.constructor?o.constructor:null},
			"string":function(){return String},
			"undefined":function(){return null}
		},
		$$ = function(m){
			function $(c,t){t=c[m];delete c[m];try{e(c)}catch(z){c[m]=t;return 1}};
			return $(Array)&&$(Object)
		};
	try{rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
	catch(z){rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
};

/*****************************FRAGMENT PUMP*********************/
//frag pump start	
fragmentPump=new function(){
	//Extends: Events,
	this.fragTimer="";
	this.oldQS="";
	this.callBuffer=[];
	this.initRun=false;
	this.initialize= function() {
		this.fragTimer=setInterval("fragmentPump.checkFragment()",5);
	};
	this.startint=function(){
		setInterval(this.checkFragment.bind(this), 250);
	};
	this.checkFragment=function() {
		var hash = document.location.hash.substring(1);
		if (hash.length > 0 && hash!==this.oldQS) {
			var args = hash.split("/");
			this.oldQS=hash;
			//console.log(args);
			//console.log(hash); 
			var cmd = args.shift();
			cmd="fragmentPump."+cmd;
			var temp="";
			if(true==/page=send/gi.test(hash) || true==/page-=-send/gi.test(hash)){
				showLoadingBox();
			}
			for(var i=0;i<args.length;i++){
				temp=temp+'"'+args[i]+'"';
				if(i<(args.length-1)){
					temp=temp+",";
				}					
			}
			var evStr=cmd+"("+temp+")";
			//console.log(evStr);
			//alert(evStr);
			if(cmd=="fragmentPump.init" || cmd=="fragmentPump.test" || cmd=="fragmentPump.data" || cmd=="fragmentPump.show" || cmd=="fragmentPump.popup" || cmd=="fragmentPump.widget" || cmd=="fragmentPump.light"){
				var tempFun=eval("window."+cmd);
				if(tempFun){
					var tempFucn = new Function(evStr);
					tempFucn();
				}else{
					//alert("does not exists");
				}
				
			}
							
		}
	};
	this.init=function(){
		if(this.initRun===false){
			this.initRun=true;
			//console.log("init run");
			for(var i=0;i<arguments.length;i++) {
				var num=i+1;
				//console.log(arguments[i]);
				if(arguments[i]!="" && arguments[i]!=" "){addToOptionsBuffer(arguments[i]);}
			}
			if(widget.domReady===true){
				processBuffer();
			}
			this.initRun=true;
		}
	};
	this.test=function() {
		readyTest();
	};
	this.data=function() {
		for (var i=0; i < arguments.length; i++) {
			addToOptions2(arguments[i]);
		}
	};
	this.show=function(){
		//console.log("show");
		//console.log(arguments);
		//console.log(this.initRun);
		showLoadingBox();
		if(widget.chicklet_loaded==false){
			replaceClass('closeX_replace','closeX');
			initWidget();
			checkLogin();
			widget.chicklet_loaded=true;
		} 
		if(this.initRun==false){
			return false;
		}
		for(var i=0; i < arguments.length; i++) {
			addToOptions(arguments[i]);
		}
		initialPageTurn();
		return true;
	};
	this.popup=function(){
		//console.log("popup");
		//console.log(arguments);
		initialPageTurn();
		widget.popup=true;
		if(widget.chicklet_loaded==false){
			initWidget();
			checkLogin();
			widget.chicklet_loaded=true;
		}
		replaceClass('closeX_replace','closeX');
		clearInterval(fragmentPump.fragTimer);
		glo_options_popup=true;  
		displayNum=24;
		for(var i=0;i<arguments.length;i++) {
			var num=i+1;
			//console.log(arguments[i]);
			addToOptionsBuffer2(arguments[i]);
		}
		if(widget.domReady===true){
			processBuffer();
		}
		this.initRun=true;
		//replaceStyles();
	};
	this.widget=function() {
		//alert("widget");
		moveServices(0);
		//console.log(arguments);
		if (arguments.length) {
			var kvPairs = arguments[0].split('=');
			for (var i = 0; i < kvPairs.length; i += 2) {
				switch (kvPairs[i]) {
				case 'screen':
				//	console.log(kvPairs[i + 1]);
					
					if(kvPairs[i + 1]=="home"){
						//console.log("widget home");
						if (widget.page != "send") {
							showHome();
						} 
					}else if(kvPairs[i + 1]=="send"){
						//console.log("send home");
						showHome();
					}
					break;
				case 'publisherGA':
					setGlobals("publisherGA",kvPairs[i + 1]);
					break;
				}
			}
		}
	};
	this.light=function(){
		//console.log("light");
		//console.log(arguments);
		//console.log(this.initRun);
		if(widget.chicklet_loaded==false){
			replaceClass('closeX_replace','closeX');
			initWidget();
			checkLogin();
			widget.chicklet_loaded=true;
		}
		if(this.initRun==false){
			return false;
		}
		for(var i=0; i < arguments.length; i++) {
			addToOptionsLight(arguments[i]);
		}
		addServiceLinks();
		//replaceStyles();
		initialPageTurn();
		return true;
	};

	if( (("onhashchange" in window)==true) && typeof(document.documentMode)=="undefined"){
		window.onhashchange=function(){
	 		fragmentPump.checkFragment();
	 	};
	}else {
		//alert("not supported");
		this.initialize(); //this is the old method if onhashchange is not around...
	}
};

function initialPageTurn() {
	//console.log(widget.page);
	//console.log(widget.service);
	if(widget.service == "email") {
		turnPage("email");
		return;
	} else if (widget.service == "sharethis") {
		turnPage("main");
		return;
	} else if (widget.service == "wordpress") {
		createPoster("wordpress");
		return;
	}
	switch (widget.page) {
		case 'send':
			turnPage("email");
			break;
		case 'home': 
			turnPage("main");
			break;
		default:
			turnPage("main");
			break;
	}
}

function addToOptionsBuffer(a){
	var temp=[];
	temp=a.split("=");	
	temp[0]=decodeURIComponent(temp[0]);
	temp[1]=decodeURIComponent(temp[1]);
	try{
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
	}
	catch(err){
		//noop
	}
	tstArray.push(new fragObj(temp[0],temp[1]));
	bufferArgs.push(temp[0]);
	bufferValue.push(temp[1]);
}

function addToOptionsBuffer2(a){
	var temp=[];
	temp=a.split("-=-");	
	temp[0]=decodeURIComponent(temp[0]);
	temp[1]=decodeURIComponent(temp[1]);
	try{
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
	}
	catch(err){
		//noop
	}
	tstArray.push(new fragObj(temp[0],temp[1]));
	bufferArgs.push(temp[0]);
	bufferValue.push(temp[1]);
}

function checkBufferArg(testStr){
	var returnVal=false;
	for(var i=0;i<bufferRunArgs.length;i++){
		if(bufferRunArgs[i]==testStr){
			returnVal=true;
		}
	}
	return returnVal;
}

function processBuffer(){
	//console.log(bufferArgs);
	bufferArgs.reverse();
	bufferValue.reverse();		
	for(var i=0;i<bufferArgs.length;i++){
		if( checkBufferArg(bufferArgs[i])===false ){
			bufferRunArgs.push(bufferArgs[i]);
			setGlobals(bufferArgs[i],bufferValue[i]);
		}
	}
	//createSwList();
	addServiceLinks();
}

//test frag object
function fragObj(inFrag,query){
	this.frag=inFrag;
	this.qs=query;
}

function readyTest(){
	for(var i=0;i<tstArray.length;i++){
		var tmp=tstArray[i].frag+" = \n"+tstArray[i].qs;
		alert(tmp);
	}		
}

function addToOptions(a){
	var temp=[];
	temp=a.split("=");	
	temp[0]=decodeURIComponent(temp[0]);
	temp[1]=decodeURIComponent(temp[1]);
	try{
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
	}
	catch(err){
		//noop
	}
	tstArray.push(new fragObj(temp[0],temp[1]));
	setGlobals(temp[0],temp[1]);
}

function addToOptionsLight(a){
	var temp=[];
	//console.log(a);
	temp=a.split("-=-");	
	temp[0]=decodeURIComponent(temp[0]);
	temp[1]=decodeURIComponent(temp[1]);
	try{
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
	}catch(err){}
	tstArray.push(new fragObj(temp[0],temp[1]));
	setGlobals(temp[0],temp[1]);
}

function addToOptions2(a){
	var temp=[];
	temp=a.split("=");	
	temp[0]=decodeURIComponent(temp[0]);
	try{
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
	}
	catch(err){
		//noop
	}
	if(temp[0]=="pageHost"){
		setGlobals("hostname",temp[1]);
	}
	else if(temp[0]=="pagePath"){
		setGlobals("location",temp[1]);
	}
	else if(temp[0]=="pageTitle"){
		setGlobals("title",temp[1]);
	}
	else if(temp[0]=="pageURL"){
		setGlobals("url",temp[1]);
	}
	else if(temp[0]=="pageImage"){
		setGlobals("image",temp[1]);
	}
	else if(temp[0]=="pageSummary"){
		setGlobals("summary",temp[1]);
	}
	
	tstArray.push(new fragObj(temp[0],temp[1]));
	if(temp[1]=="done"){
		if(fragmentPump.initRun===false){document.location.hash=glo_initFrag;}
		glo_jsonStr=glo_jsonArray.join('');
		glo_jsonArray=[];
		processFrag();
	}
	else if(temp[0]=="jsonData"){
		glo_jsonArray.push(temp[1]);
	}
}

function processFrag(){
	try{glo_jsonStr=decodeURIComponent(glo_jsonStr);}catch(err){}
	var tmp=glo_jsonStr;
	var newResp=[];
	try{
		newResp=$JSON.decode(tmp);
		if(newResp==null){
			tmp=decodeURIComponent(tmp);
			newResp=$JSON.decode(tmp);
		}
	}catch(err){
			tmp=decodeURIComponent(tmp);
			newResp=$JSON.decode(tmp);
	}
	//console.log(newResp);
	if(newResp && newResp.length){
		for(var i=0;i<newResp.length;i++){
			setGlobals("title",newResp[i].title);
			setGlobals("type",newResp[i].type);
			setGlobals("summary",newResp[i].summary);
			setGlobals("content",newResp[i].content);
			setGlobals("url",newResp[i].url);
			setGlobals("icon",newResp[i].icon);
			setGlobals("category",newResp[i].category);
			setGlobals("updated",newResp[i].updated);
			setGlobals("published",newResp[i].published);
			setGlobals("author",newResp[i].author);
			setGlobals("thumb",newResp[i].icon);
			if(newResp[i].tags){setGlobals("glo_tags_array",newResp[i].tags);}
			if(newResp[i].description){setGlobals("glo_description_array",newResp[i].description);}
		}
	}
	//setValues();
	//console.log("processFrag");
	addServiceLinks();
}

var tstArray=[]; //test array from frag object;
var domReady=false;
var bufferArgs=[];
var bufferValue=[];
var bufferRunArgs=[];
var glo_jsonArray=[];
var glo_jsonStr="";

function setGlobals(key,value){
	//console.log("Key: "+key+"  Value: "+value);
	try{value=decodeURIComponent(value);}catch(err){}
	try{value=decodeURIComponent(value);}catch(err){}
	if(value=="true"){
		value=true;
	}else if(value=="false"){
		value=false;
	}
	switch(key){
		case 'url':
		//	alert(value);
			widget.URL=value; 
			if(widget.popup==true){
				initWidget();
			}
			var hostDomain = extractDomainFromURL(value);
			if(hostDomain==null)
			{
				hostDomain=widget.URL;	
			}else{
				if(widget.hostname==null){
					widget.hostname=hostDomain;
				}
			}
			//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
			widget.sharURL=value;
		break;
		case 'title':
			widget.title=value;
		break;
		case 'pUrl':
			if(widget.popup!=true || widget.URL==null){
				widget.URL=value;
				var hostDomain = extractDomainFromURL(value);
				if(hostDomain==null)
				{
					hostDomain=value;	
				}else{
					if(widget.hostname==null){
						widget.hostname=hostDomain;
					}
				}
				//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
			}
		break;
		case 'fpc':
			widget.fpc=value;
		break;
		case 'sessionID':
			widget.sessionID=value;
		break;
		case 'publisher':
			widget.publisher=value;
		break;
		case 'summary':
			widget.summary=value;
		break;
		case 'content':
			widget.content=value;
		break;
		case 'icon':
			widget.icon=value;
		break;
		case 'image':
			widget.thumb=value;
		break;
		case 'category':
			widget.category=value;
		break;
		case 'updated':
			widget.updated=value;
		break;
		case 'author':
			widget.author=value;
		break;
		case 'published':
			widget.published=value;
		break;
		case 'thumb':
			widget.thumb=value;
		break;
		case 'hostname':
			widget.hostname=value;
		break;
		case 'location':
			widget.location=value;
		break;
		case 'guid_index':
			widget.guid_index=value;
		break;
		case 'page':
			widget.page=value;
			if(value && value=="send"){
				getEmailService();
			}else if(value && value=="home"){
				showHome();
			}
		break;
		case 'toolbar':
			widget.toolbar=value;
		break;
		case 'services':
			widget.services=value;
		break;
		case 'headerTitle':
			if(value.length>0){
				//var element=document.getElementById('header_div');
				//var element2=document.getElementById('header_title').innerHTML=value;
				//element.style.display="block";
				document.getElementById('popular').innerHTML=value;
			}
		break;
		case 'headerfg':
			//var element=document.getElementById('header_div');
			//element.style.color=value;			
			document.getElementById('popular').style.color=value;
			document.getElementById('doNotTrack').style.color=value;
			document.getElementById('trackPrivacySeperator').style.color=value;
			document.getElementById('privacy').style.color=value;
			document.getElementById('outercontainer').style.color=value;		
		break;
		case 'headerbg':
			//var element=document.getElementById('header_div');
			//element.style.backgroundColor=value;
			document.getElementById('popular').style.background=value;
			document.getElementById('outercontainer').style.filter=null;
			document.getElementById('outercontainer').style.background=value;
			document.getElementById('footer').style.background=value;
		break;
		case "tracking":
			widget.tracking=true;
			if(widget.domReady==true){
				//getPubGA();
			}
		break;
		case "linkfg":
			widget.linkfg=value;
			break;
		case 'tabs':
			var a=new RegExp(/email|send/);
			if(a.test(value)==false){widget.email_service=false;}
			if(a.test(value)==false){widget.sms_service=false;}
			break;
		case 'send_services':
			var a=new RegExp(/email/);
			if(a.test(value)==false){widget.email_service=false;}
			a=new RegExp(/sms/);
			if(a.test(value)==false){widget.sms_service=false;}
			break;
		case "exclusive_services":
			//console.log(value);
			widget.showAllServices=false;
			break;
		case "post_services":
			//console.log(value);
			//widget.showAllServices=false;
			if(widget.services==null){
				widget.services=value;
			}else{
				widget.services+= "," + value;
			}
			break;
		case "stLight":
			widget.stLight=true;
			break;
		case 'doneScreen':
			widget.doneScreen=value;
			break;
		case 'jsref':
			widget.jsref=value;
			break;
		case 'type':
			widget.type=value;
			break;
		case 'service':
			//console.log("service set: " + value);
			widget.service=value;
			break;
		case "publisherGA":
			widget.publisherGA=value;
			if(widget.domReady==true){
				initGA();
			}
			break;
		case 'relatedDomain':
			widget.relatedDomain = value;
			break;
		case "embeds":
		case "button":
		case "type":
		case "inactivefg":
		case "inactivebf":
		case "headerbg":
		case "style":
		case "charset":
		case "hash_flag":
		case "onmouseover":
		case "inactivebg":
		case "send_services":
		case "buttonText":
		case "offsetLeft":
		case "offsetTop":
		case "buttonText":
			//legacy stuff some of them
		break;
		
		default:
		//	console.log("******Not Found Key:"+key+" Value:"+value);
			//alert("******Not Found Key:"+key+" Value:"+value);
		break;
	}
}

/*********************WIDGET OBJECT**************************/
//holds all global variables for widget
var widget=new function(){
	this.URL=null;
	this.title=null;
	this.sessionID=null;
	this.fpc=null;
	this.publisher=null;
	this.browser=null;
	this.services=[];
	this.publisher=null;
	this.icon;
	this.content;
	this.guid;
	this.guid_index;
	this.published;
	this.author;
	this.updated;
	this.summary;
	this.thumb;
	this.tags;
	this.hostname;
	this.location;
	this.headerTitle;
	this.headerfg;
	this.page;
	this.purl;

	this.all_services= {
		seven_live_seven : {title : '7Live7'},
		a1_webmarks: {title: 'A1 Webmarks'},
		adfty: {title: 'Adfty'},
		allvoices: {title:'Allvoices'},
		amazon_wishlist: {title:'Amazon Wishlist'},
		arto: {title:'Arto'}, 
		baidu: {title: 'Baidu'},
		bebo : {title : 'Bebo'},
		blinklist : {title : 'Blinklist'},
		blip: {title: 'Blip'},
		blogmarks : {title : 'Blogmarks'},
		blogged:  {title: 'Blogged'},
		blogger : {title : 'Blogger',type : 'post'},
		brainify: {title:"Brainify"},
		buddymarks: {title: 'BuddyMarks'},
		bus_exchange : {title : 'Add to BX',aTitle : 'Business Exchange'},
		care2 : {title : 'Care2'},
		citeulike : {title : 'CiteULike'},
		chiq : {title : 'chiq'},
		connotea: {title: 'Connotea'},
		corank: {title: 'coRank'},
		corkboard: {title: 'Corkboard'},
		current : {title : 'Current'},
		dealsplus : {title : 'Dealspl.us'},
		delicious : {title : 'Delicious'},
		digg : {title : 'Digg'},
		diigo : {title : 'Diigo'},
		dotnetshoutout: {title:'.net Shoutout'},
		dzone: {title: 'DZone'},
		edmodo : {title : 'Edmodo'},
		email: {title: 'Email'},
		evernote: {title:'Evernote'},
		facebook : {title : 'Facebook'},
		fark : {title : 'Fark'},
		fashiolista: {title:'Fashiolista'},
		faves : {title : 'Faves'},
		folkd:{title:'folkd.com'},
		formspring : {title : 'Formspring'},
		fresqui : {title : 'Fresqui'},
		friendfeed : {title : 'FriendFeed'},
		friendster: {title:'Friendster'},
		funp : {title : 'Funp'},
		fwisp: {title:'fwisp'},
		google: {title: 'Google'},
		google_bmarks : {title : 'Google Bookmarks'},
		google_reader: {title: 'Google Reader'},
		google_translate: {title: 'Google Translate'},
		hadash_hot: {title: "Hadash Hot"},
		hatena: {title:'Hatena'},
		hyves: {title:"Hyves"},
		identi: {title: 'identi.ca'},
		instapaper : {title : 'Instapaper'},
		jumptags: {title:'Jumptags'},
		kaboodle:{title:'Kaboodle'},
		kirtsy : {title : 'Kirtsy'},
		linkagogo:{title:'linkaGoGo'},
		linkedin : {title : 'LinkedIn'},
		livejournal : {title : 'LiveJournal',type : 'post'},
		meneame : {title : 'Meneame'},
		messenger : {title : 'Messenger'},
		mister_wong : {title : 'Mr Wong'},
		mixx : {title : 'Mixx'},
		myspace : {title : 'MySpace'},
		n4g : {title : 'N4G'},
		netlog: {title: 'Netlog'},
		netvibes: {title:'Netvibes'},
		netvouz:{title:'Netvouz'},
		newsvine : {title : 'Newsvine'},
		nujij:{title:'NUjij'},
		odnoklassniki : {title : 'Odnoklassniki'},
		oknotizie : {title : 'Oknotizie'},
		orkut : {title : 'Orkut'},
		plaxo:{title:'Plaxo'},
		reddit : {title : 'Reddit'},
		segnalo : {title : 'Segnalo'},
		sina: {title:'Sina'},
		slashdot : {title : 'Slashdot'},
		sonico : {title : 'Sonico'},
		speedtile:{title:'Speedtile'},
		sphinn : {title : 'Sphinn'},
		squidoo:{title:'Squidoo'},
		startaid:{title:'Startaid'},
		startlap:{title:'Startlap'},
		stumbleupon : {title : 'StumbleUpon'},
		stumpedia:{title:'Stumpedia'},
		technorati : {title : 'Technorati',dontUseEncodedURL : 'Encoded URLs are not allowed'},
		twackle : {title : 'Twackle'},
		typepad : {title : 'TypePad',type : 'post'},
		tumblr : {title : 'Tumblr'},
		twitter : {title : 'Twitter'},
		viadeo:{title:'Viadeo'},
		virb:{title:'Virb'},
		vkontakte : {title : 'Vkontakte'},
		voxopolis:{title: 'VOXopolis'},
		wordpress : {title : 'WordPress',type : 'post'},
		xanga : {title : 'Xanga'},
		xerpi:{title:"Xerpi"},
		xing: {title:'Xing'},
		yammer : {title : 'Yammer'},
		yigg : {title : 'Yigg'}
	};
//	this.default_services='myspace,digg,sms,windows_live,delicious,stumbleupon,reddit,google_bmarks,linkedin,bebo,ybuzz,blogger,mixx,technorati,friendfeed,propeller,wordpress,newsvine,xanga,blinklist,twine,twackle,diigo,fark,faves,mister_wong,current,livejournal,kirtsy,slashdot,oknotizie,care2,aim,meneame,simpy,blogmarks,n4g,bus_exchange,funp,sphinn,fresqui,dealsplus,typepad,yigg';
	this.top_services = 'email,facebook,twitter,digg,linkedin,stumbleupon,reddit,blogger,tumblr,delicious';
	this.top_services_sprite_list = 'email,facebook,twitter,digg,linkedin,stumbleupon,reddit,blogger,tumblr,delicious';
	this.exclusive_services=null;
	this.services=""; //this is from publisher and for default ordering
	this.sharebox={title: 'Save',type: 'sharebox' };
	this.chickletNumber=6;
	this.domReady=false;
	this.guid_index=0;
	this.page="home";
	this.toolbar=false;
	this.loginPoller=null;
	this.fsPoller=null;
	this.importPoller=null;
	this.metaInfo=null;
	this.mainCssLoaded=false;
	this.toolbar=false;
	this.pageTracker=null;
	this.pubTracker=null;
	this.tracking=false;
	this.lastURL=null; //indicates last url shortned, prevents re-calling of creatShar ajax call
	this.sharURL=null; 
	this.poster=null; //indicates which poster service is in use
	this.linkfg=null;
	this.email_service=true;
	this.sms_service=true;
	this.showAllServices=true; ///merge all services into list by default
	this.chicklet_loaded=false;
	this.segmentframe=null;
	this.segmentRun=false;
	this.ga=null;
	this.popup=false;
	this.cssInterval=null;
	this.stLight=false;
	this.optout=false;
	this.doneScreen=true;
	this.jsref="";
	this.type=null;
	this.service=null;
	this.publisherGA=null;
};

var user=new function(){
	this.name=null;
	this.email=null;
	this.nickname=null;
	this.recents=null;
	this.chicklets=null;
	this.display=null;
	this.type=null;
	this.token=null;
	this.contacts=[];
	this.loggedIn=false;
	this.user_services=null;
	this.currentUserType=null;
	this.ThirdPartyUsers=null;
};

/***************************************FUNCTIONS***************************/

function getServiceLink(service){
	if( (widget.all_services[service]==undefined && service!=="sharebox") || (widget.email_service==false && service=="email") ){
		var a = document.createElement('a');
		var li = document.createElement('li');
		li.appendChild(a);
		return null;
	}
	
	var otherClass=" rpChicklet";
	
	if(service=="email"){
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('title', widget.all_services[service].title);
		a.setAttribute('id', "post_"+service+"_link");
		if(a.attachEvent){
			a.attachEvent('onclick',function(){getEmailService();});
		}else{
			a.setAttribute('onclick','getEmailService();');
		}
		a.setAttribute('href', 'javascript:void(0);');
		a.appendChild(document.createTextNode(widget.all_services[service].title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}else if(service=="sharebox"){
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('title', widget.sharebox.title);
		a.setAttribute('id', "post_"+service+"_link");
		//a.setAttribute('onclick', 'getEmailService()');
		a.setAttribute('href', 'javascript:void(0);');
		a.appendChild(document.createTextNode(widget.sharebox.title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}else if(service=="twitter" && user.ThirdPartyUsers && user.ThirdPartyUsers['twitter']){
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('title', widget.all_services[service].title);
		a.setAttribute('id', "post_"+service+"_link");
		if(a.attachEvent){
			a.attachEvent('onclick',function(){createPoster("twitter");});
		}else{
			a.setAttribute('onclick', 'createPoster("twitter")');
		}
		a.setAttribute('href', 'javascript:void(0);');
		a.appendChild(document.createTextNode(widget.all_services[service].title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}else if(service=="wordpress"){
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('title', widget.all_services[service].title);
		a.setAttribute('id', "post_"+service+"_link");
		if(a.attachEvent){
			a.attachEvent('onclick',function(){createPoster("wordpress");});
		}else{
			a.setAttribute('onclick', 'createPoster("wordpress")');
		}
		a.setAttribute('href', 'javascript:void(0);');
		a.appendChild(document.createTextNode(widget.all_services[service].title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}
	else{
		var source="chicklet";
		if(widget.service==null){
			widget.service = 'legacy';
		}
		var url=(("https:" == document.location.protocol) ? "https://ws." : "http://wd.")+"sharethis.com/api/sharer.php?destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source="+source+"&service={service}&type={type}&image={image}";
		url=url.replace("{destination}",service);
		url=url.replace("{url}",encodeURIComponent(widget.URL));
		url=url.replace("{title}",encodeURIComponent(widget.title));
		url=url.replace("{publisher}",widget.publisher);
		url=url.replace("{fpc}",widget.fpc);
		url=url.replace("{sessionID}",widget.sessionID);
		url=url.replace("{service}",widget.service);
		url=url.replace("{type}",widget.type);
		url= (typeof(widget.thumb)!='undefined') ? url.replace("{image}",widget.thumb) : url.replace("{image}","");
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('href', url);
		a.setAttribute('title', widget.all_services[service].title);
		a.setAttribute('id', "post_"+service+"_link");
		a.setAttribute('target', '_blank');
		a.setAttribute('stservice', service);
		//a.setAttribute('onclick','serviceClicked(this);');
		if(a.attachEvent){
			a.attachEvent('onclick',function(){serviceClicked(a);});
		}else{
			a.setAttribute('onclick', 'serviceClicked(this);');
		}
		a.appendChild(document.createTextNode(widget.all_services[service].title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}
}

function turnPage(pageType) { //Could be "email", "poster", "main", or "done", "loading"
	//console.log("Page:" + pageType);
	document.getElementById("mainPage").style.display = "none";
	document.getElementById("emailPage").style.display = "none";
	document.getElementById("posterPage").style.display = "none";
	document.getElementById("donePage").style.display = "none";
	document.getElementById("loadingPage").style.display = "none";
	document.getElementById("captchaPage").style.display = "none";
	document.getElementById(pageType+"Page").style.display = "block";
	if (pageType == "main") {
		replaceStyles();
	}
}

function getEmailService(type){
	gaLog("Chicklet","Email");
	shareLog('Email');
	widget.poster=null;
	updateServiceCount("email", 'Email');
	
	if(typeof(email)=="undefined"){
		odjs((("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure/js/email.7eda015a612245de66611577aec88cf8.js" : "http://w.sharethis.com/share4x/js/email.7eda015a612245de66611577aec88cf8.js"),function(){});
		turnPage("email");
		//showLoadingBox();
	}else{
		turnPage("email");
		email.reClicked();
		document.getElementById('heading_div').firstChild.innerHTML=lang.strings['msg_email'];
	}
}

function emailServiceCallback(){
	//console.log("EmailServiceCallback");
	
	document.getElementById('heading_div').firstChild.innerHTML=lang.strings['msg_email'];
	
	//hide spinner
	if(widget.metaInfo) {
		if(widget.metaInfo.require_captcha) {
			//will have been at the captcha page already if true
		} else {
			turnPage("email");
		}
	} else {
		turnPage("email");
	}
	document.getElementById('email_main').style.display="block";
	try {
		document.getElementById('txtYourAddr').focus();
	} catch (err) {}
	if(user.email==null){
		document.getElementById('from_div').style.display="block";
	}else if(user.email.length<2){
		document.getElementById('from_div').style.display="block";
	}else{
		document.getElementById('from_div').style.display="none";
	}
}

function showLoadingBox(msg){
	if(msg){
		document.getElementById('loading').innerHTML=msg;
	}
	document.getElementById('loading_img').innerHTML='<img src="/images/spinner.gif" alt="' + lang.strings['msg_loading'] +'">';
	turnPage("loading");
}

function hideLoadingBox(){
	document.getElementById('loadingPage').style.display="none";
}

function addServiceLinks(){
	user.user_services=extractServicesFromCookie();
	
	//console.log("##########################################");
	//console.log("...publisher defined services:" + widget.services);
	//alert("...user_services:" + user.user_services);
	//console.log("...does the publisher want you to show all services:" + widget.showAllServices);
	//console.log("...default top choices:" + widget.top_services);
	
	var newServiceLink; // A container for service links before they are added to the DOM
	var element=document.getElementById('top_chicklets'); // The div to add service links to
	this.services={'abc':false};  // This keeps track of which services have already been added
	
	function addServiceLink(service) {
		//console.log(service);
		if(typeof(service)=="undefined" || service=="") { return; }
		var newServiceLink = getServiceLink(service);
		if(newServiceLink != null) {
			imageDiv = document.createElement('div');
			imageDiv.className = "largeChicklet lc_" + service;
			newServiceLink.getElementsByTagName('a')[0].appendChild(imageDiv);
			element.appendChild(newServiceLink);
			return true;
		}
		return false;
	}
	// First, remove all the elements inside the top_chicklets div
	while (element.childNodes.length >= 1 )
    {
        element.removeChild(element.firstChild ); 
    } 	
	
	var count=0;
	var publisherDefinedServices = widget.services.split(',');
	var imageDiv;
	
	// Add all of the publisher defined services next
	for(var i=0;i<publisherDefinedServices.length;i++){
		if(typeof(this.services[publisherDefinedServices[i]])=="undefined"){
			if (addServiceLink(publisherDefinedServices[i])) {
				count++;
				this.services[publisherDefinedServices[i]]=true;
			}
		} 
	}
	
	// If the publisher only wants certain sharing destinations, stop here.
	if (!widget.showAllServices) {
		return;
	}
		
	// Add all the user's recently shared to destinations first.
	if(user.user_services!==null){  
		var user_services_array=user.user_services.split(',');
		for(var i=0;i<user_services_array.length;i++){
			if(count<10){
				if(typeof(this.services[user_services_array[i]])=="undefined"){
					if (addServiceLink(user_services_array[i])) {
						count++;
						this.services[user_services_array[i]]=true;
					}
				}
			}
		}
	}
	
	// Add the top services that people share to (up to 10).  If the publisher defined a lot there might already be more than that.
	var top_services_array = widget.top_services.split(",");
	for(var i=0;i<top_services_array.length;i++){
		if(count<10){
			if(typeof(this.services[top_services_array[i]])=="undefined"){
				if (addServiceLink(top_services_array[i])) {
					count++;
					this.services[publisherDefinedServices[i]]=true;
				}
			} 
		}
	}
	
	// Penultimately, add an alphabetical list of all supported services.
	for(var i in widget.all_services){
		addServiceLink(i);
	}
	
	// Finally, replace the styles of each service link so as to load the sprites when the widget opens.
	replaceStyles();
}

function searchFocus(){
	var element=document.getElementById('chicklet_search_field');
	if(element.value==lang.strings['msg_search_services']){
		element.value="";
	}
	gaLog("Search","focus");
}
function searchBlur(){
	var element=document.getElementById('chicklet_search_field');
	if(element.value==""){
		element.value=lang.strings['msg_search_services'];
	}
}

function searchAndDisplay(searchTerm){
	replaceStyles(true);
	var element=document.getElementById('chicklets');
	if(searchTerm == "") { 
		//console.log("blank");
		var chix = document.getElementById("top_chicklets");
		
		for(i=0;i<chix.childNodes.length;i++) {
			var currentLi = chix.childNodes[i];
			var currentA = currentLi.childNodes[0];
		
			currentA.innerHTML = currentA.innerHTML.replace("<span>", "");
			currentA.innerHTML = currentA.innerHTML.replace("</span>", "");
			currentA.className = currentA.className.replace(" searchedLi", "");
		}
		return;
	}
	
	try{var pReg = new RegExp("^" + searchTerm, "gi");}catch(err){return false;}
	try{var reg = new RegExp(searchTerm, "gi");}catch(err){return false;}
	//console.log("reg:"+reg);
	//preMatches 
	var pMatches = [];
	var matches = [];
	//search for all matches in case you want to do something with them later (Legacy, left for future use)
	for(var i in widget.all_services){
		var text=widget.all_services[i].title;
	//console.log(text);
		if(reg.test(text)==true && i!="sharebox"){
			matches.push(i);
		}else{
			if(reg.test(text)==true){
				//console.log("not match:"+i);
			}
		}
		if(pReg.test(text)==true && i!="sharebox"){
			pMatches.push(i);
		}
	}
	var toIndexA = document.getElementById("post_"+pMatches[0]+"_link");
    toIndexA = toIndexA ? toIndexA : document.getElementById("post_"+matches[0]+"_link");
	
	if (toIndexA) {
		var row = 0;
		//for each li in top_chicklets:
		for(i=0;i<toIndexA.parentNode.parentNode.childNodes.length;i++) {
			var currentLi = toIndexA.parentNode.parentNode.childNodes[i];
			var currentA = currentLi.childNodes[0];
			var currentName = currentA.childNodes[0].data;
			if (currentLi == toIndexA.parentNode) {
				row = Math.floor(i/2);
				//HighlightRelevantText
				currentA.innerHTML = currentA.innerHTML.replace("<span>", "");
				currentA.innerHTML = currentA.innerHTML.replace("</span>", "");
				
				try{var mReg = new RegExp(searchTerm + "(?=.*<di)","i");}catch(err){return false;}
				
				currentA.innerHTML = currentA.innerHTML.replace(mReg, "<span>"+mReg.exec(currentA.innerHTML)+"</span>");
				
				currentA.className = currentA.className.replace(" searchedLi", "");
				currentA.className = currentA.className + " searchedLi";
			} else {
				currentA.innerHTML = currentA.innerHTML.replace("<span>", "");
				currentA.innerHTML = currentA.innerHTML.replace("</span>", "");
				currentA.className = currentA.className.replace(" searchedLi", "");
			}
		}
		moveServices(row, true);	
	}
	widget.lastSearchTerm=searchTerm;
	return true;
}

function extractServicesFromCookie(){
	var usrSvc=$JSON.decode(cookie.getCookie('ServiceHistory'));
	//alert(usrSvc);
	var array=[];
	var svc=null;
	for(o in usrSvc){
		array.push(usrSvc[o]);
	}
	array.sort(serviceSort);
	if(array.length>0){
		svc="";
	}
	for(var i=0;i<array.length;i++){
		//console.log(array[i].service+":"+array[i].count);
		if(i<array.length-1){
			svc+=array[i].service+",";
		}else{
			svc+=array[i].service;
		}
	}
	//console.log(svc);
	return svc;
}

function serviceClicked(elem){
	var service=elem.getAttribute('stservice');
	var serviceTitle = elem.getAttribute('title');
	updateServiceCount(service, serviceTitle);
	gaLog("Share",service);
	showDoneScreen();
	shareLog(service);
	//document.getElementById("msg_share_success").style.visibility="hidden";
}

function updateServiceCount(service, serviceTitle){
	if(widget.all_services[service]==undefined || service=="sharebox"){
		return false;
	}
	var usrSvc=$JSON.decode(cookie.getCookie('ServiceHistory'));
	if(usrSvc==false || usrSvc==null || usrSvc.length<1){
		usrSvc={};
		usrSvc[service]={};
		usrSvc[service].service=service;
		usrSvc[service].title = serviceTitle;
		usrSvc[service].count=1;
		cookie.setCookie('ServiceHistory',$JSON.encode(usrSvc));
		//cookie.setCookie('ServiceHistory', "A");
		return true;
	}
	var obj={};
	var svc=null;
	var flag=false;
	var sortable=[];
	for(o in usrSvc){
		if(usrSvc[o].service==service){
			usrSvc[o].count++;
			usrSvc[o].title = serviceTitle;
			flag=true;
		}
		sortable.push(usrSvc[o]);
	}
	if(flag==false){
		usrSvc[service]={};
		usrSvc[service].service=service;
		usrSvc[service].title = serviceTitle;
		usrSvc[service].count=1;
	}
	else
	{
		sortable.sort(function(a,b){
			return b.count - a.count;
		});
		usrSvc={};
		for(var i=0;i<sortable.length;i++){
			usrSvc[sortable[i].service]= sortable[i];
		}
	}
	cookie.setCookie('ServiceHistory',$JSON.encode(usrSvc));
	return true;
}


function serviceSort(a,b){
	if(a.count==b.count){
		return 0;
	}else if(a.count>b.count){
		return -1;
	}else{
		return 1;
	}
}


function signIn(){
	window.open( "http://sharethis.com/account/signin-widget", "LoginWindow","status=1, height=450, width=970, resizable=0" );
	clearInterval(widget.loginPoller);
	widget.loginPoller=setInterval(function(){checkForLoginCookie();},1000);
	gaLog("SignIn","Click");
}

function signOut(){
	if (typeof (window.localStorage) !== "undefined") {
		window.localStorage.clear();
	}
	gaLog("SignOut","Click");
	cookie.deleteCookie("ShareUT");
	cookie.deleteCookie('recents');
	cookie.deleteCookie('stOAuth');
	//user.contacts=[];
	forgetUser();
	if(typeof(email)!=="undefined"){
		email.display=[];
		email.selected=[];
		document.getElementById("recents").style.display="none"; //hide recents
	}
	document.getElementById('signIn').style.display="block";
	document.getElementById('footer_info').style.display="none";
	document.getElementById('popular').innerHTML = lang.strings['msg_share'];
	document.getElementById('notYou').innerHTML = "";
	//console.log("signout");
	addServiceLinks();
	//replaceStyles();
}


function forgetUser(){
	user.name=null;
	user.email=null;
	user.nickname=null;
	user.recents=null;
	user.chicklets=null;
	user.display=null;
	user.type=null;
	user.token=null;
	user.contacts=[];
	user.loggedIn=false;
	user.user_services=null;
	user.currentUserType=null;
	user.ThirdPartyUsers=null;
	if(user.email==null && typeof(email)!=="undefined"){
		document.getElementById('from_div').style.display="block";
	}
}

function checkLogin(){
	if (cookie.getCookie('ShareUT') !== false) {
		var data=["return=json","cb=loginOnSuccess","service=getUserInfo"];
		data=data.join('&');
		jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws.sharethis.com/" : "http://wd.sharethis.com/")+"api/getApi.php?"+data);
	}
}

function loginOnSuccess(response){
	gaLog("SignIn","Complete");
	if(response && response.status=="SUCCESS"){
		user.email=response.data.email;
		user.name=response.data.name;
		user.nickname=response.data.nickname;
		user.recents=response.data.recipients;
		if(user.recents!==null){
			cookie.setCookie('recents',$JSON.encode(user.recents));
		}
	//	user.chicklets=response.data.socialShares;
		user.display=user.email;
		user.currentUserType=response.data.CurrentUserType;
		user.ThirdPartyUsers=response.data.ThirdPartyUsers;
		if (user.ThirdPartyUsers!=null && user.ThirdPartyUsers["facebook"]!=null) {
			user.ThirdPartyUsers["facebook"]=user.email;
			if(user.name!=null)
				user.ThirdPartyUsers["facebook"]=user.name;
		}
		if (user.ThirdPartyUsers!=null && user.ThirdPartyUsers["linkedin"]!=null) {
			user.ThirdPartyUsers["linkedin"]=user.email;
			if(user.name!=null)
				user.ThirdPartyUsers["linkedin"]=user.name;
		}
		cookie.setCookie('stOAuth',$JSON.encode(user.ThirdPartyUsers), 365);
		if(response.data.CurrentUserType && response.data.ThirdPartyUsers){
			if(user.name!==null)
			{
				//user.display="<span class='"+response.data.CurrentUserType+" ckimg'>"+user.name+"</span>";
				user.display="<span>"+user.name+"</span>";
			} 
			else
			{
				//user.display="<span class='"+response.data.CurrentUserType+" ckimg'>"+response.data.ThirdPartyUsers[response.data.CurrentUserType]+"</span>";
				user.display="<span>"+response.data.ThirdPartyUsers[response.data.CurrentUserType]+"</span>";
			}
			//addServiceLinks();
		}
		//Update HTML5 localstorage
		if (typeof(window.localStorage) !== "undefined") {
			var sut = cookie.getCookie('ShareUT');
			var storage = window.localStorage;
			if (user.email!=null){storage.email=user.email;}
			if (user.name!=null){storage.name=user.name;}
			if (user.nickname!=null){storage.nickname=user.nickname;}
			if (user.currentUserType!=null){storage.currentUserType=user.currentUserType;}
			if (user.ThirdPartyUsers!=null){
				if (user.ThirdPartyUsers["facebook"]!=null) {
					user.ThirdPartyUsers["facebook"]=user.email;
					if(user.name!=null)
						user.ThirdPartyUsers["facebook"]=user.name;
				}
				if (user.ThirdPartyUsers["linkedin"]!=null) {
					user.ThirdPartyUsers["linkedin"]=user.email;
					if(user.name!=null)
						user.ThirdPartyUsers["linkedin"]=user.name;
				}
				storage.ThirdPartyUsers=user.ThirdPartyUsers;
			}
			var disp=user.display;
			if (disp!=null){
				disp=disp.replace(/ckimg/gi,"rpChicklet");
				storage.display=disp;
			}
		}
		
		if(typeof(email)!=="undefined"){
			document.getElementById('from_div').style.display="none";
			email.getContacts(); //this gets contacts if you are sign in and are on email page.
			email.showRecents();
		}
		
	}
	document.getElementById('signIn').style.display="none";		
	//alert(response); //mm??
	if(user.display!==null){
		var userName = user.name;
		userName = userName ? userName : user.email;
		userName = userName ? userName : user.nickname;
		userName = userName.length > 25 ? userName.substring(0, 23) + "..." : userName;
		userName = "<span>" + userName + "</span>";
		document.getElementById('popular').innerHTML= "<a id='header_email' target='_blank' href='http://sharethis.com/account' >Hi "+ userName + ",</a> ";
		document.getElementById('notYou').innerHTML = "Not You?";
	}
	//document.getElementById('footer_email').style.display="block";
	document.getElementById('footer_info').style.display="block";
}

function checkForLoginCookie(){
	var authCookie = cookie.getCookie("ShareUT");
	if (authCookie) {
		clearInterval(widget.loginPoller);
		checkLogin();
		clearInterval(widget.loginPoller);
	}
}

function checkForImportCookie(){
	var importCookie = cookie.getCookie("StImported");
	var authCookie = cookie.getCookie("ShareUT");
	if (authCookie && importCookie) {
		cookie.deleteCookie('StImported');
		clearInterval(widget.importPoller);
		//widget.user.acquireAuth(authCookie);//??
		checkLogin();
		if(email){
			email.getContacts();
		}
		clearInterval(widget.importPoller);
	}
}

function getMainCss(){
	if(widget.mainCssLoaded==false){
		odcss((("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure/css/share.475759c7f9879ed08f39a762160a24df.css" : "http://w.sharethis.com/share4x/css/share.475759c7f9879ed08f39a762160a24df.css"),function(){},true);
		widget.mainCssLoaded=true;
	}else{
		return false;
	}
}


function showModal(msg){
	document.getElementById('modalPage').style.display="block";
	document.getElementById('modal_text').innerHTML=msg;
}

function clearModal(){
	document.getElementById('modalPage').style.display="none";
}

function extractDomainFromURL(url, keepWWW) {
  try{var domain = url.replace(/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/, '$2');
	  if (!keepWWW && domain.toLowerCase().indexOf('www.') == 0) {
		  domain = domain.substring(4);
	  }
	  domain=domain.replace(/#.*?$/,''); //replace #onwards
	  return domain;
  }catch(err){
	  return null;
  }
}


function initWidget(){
	if(widget.URL==null){
		return true;
	}else{
		var data=['return=json',"url="+encodeURIComponent(widget.URL),"fpc="+widget.fpc,"cb=initWidgetOnSuccess","service=initWidget"];
		data=data.join('&');
		jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws.sharethis.com/" : "http://wd.sharethis.com/")+"api/getApi.php?"+data);
		return true;
	}
}

function initWidgetOnSuccess(response){
	if(response && response.data){
		widget.metaInfo=response.data;		
	}
	//replaceStyles();
	replaceClass('closeX_replace','closeX');
	if(response && response.data && response.data.ga && response.data.ga==true){
		initGA();
		if(typeof(email)!="undefined"){// this is if email loads before initWidget example from the toolbar or chicklet outside the widget
			email.reClicked();
		}
	}
}

function replaceStyles() {
	//try{plus+=1;}catch(err){alert(err.stack);}
	var chickNode = document.getElementById("top_chicklets");
	var chicklets = chickNode.getElementsByTagName('div');
	//console.log(chicklets);
	if (arguments.length > 0) {
		for (i = 10; i<chicklets.length;i++) {
			var service = chicklets[i].className.substring(17);

			if (widget.top_services_sprite_list.indexOf(service) != -1) {
				chicklets[i].style.backgroundImage=(("https:" == document.location.protocol)?"url(https://ws.sharethis.com/images/sprite_32_small.png)":"url(http://w.sharethis.com/images/sprite_32_small.png)");
			} else {
				chicklets[i].style.backgroundImage=(("https:" == document.location.protocol)?"url(https://ws.sharethis.com/images/sprite_32.png)":"url(http://w.sharethis.com/images/sprite_32.png)");
				//chicklets[i].style.backgroundImage ="url(http://w.sharethis.com/images/"+service+"_32.png)";
			}
		}		
	} else if (chicklets.length > 0){
		var smaller = chicklets.length > 10 ? 10 : chicklets.length;
		for (i = 0; i<smaller;i++) {
			var service = chicklets[i].className.substring(17);

			if (widget.top_services_sprite_list.indexOf(service) != -1) {
				chicklets[i].style.backgroundImage=(("https:" == document.location.protocol)?"url(https://ws.sharethis.com/images/sprite_32_small.png)":"url(http://w.sharethis.com/images/sprite_32_small.png)");
			} else {
				//chicklets[i].style.backgroundImage ="url(http://w.sharethis.com/images/sprite_32.png)";
				chicklets[i].style.backgroundImage=(("https:" == document.location.protocol)?"url(https://ws.sharethis.com/images/"+service+"_32.png)":"url(http://w.sharethis.com/images/"+service+"_32.png)");
				chicklets[i].style.backgroundPosition = "0px";
			}
		}
	}
}

/***************************JSONP********************/

var jsonp={};

jsonp.makeRequest=function(url){
	odjs(url,function(){});
};

/***************************AJAX********************/
var ajax={
	request:null,
	defaultResponse:{
		status:"FAILURE"
	}

};

ajax.makeRequest=function(method,url,data,onSuccess,onFailure){
	try {
	  var request = new XMLHttpRequest();
	} catch (trymicrosoft) {
	  try {
		  request = new ActiveXObject("Msxml2.XMLHTTP");
	  } catch (othermicrosoft) {
	    try {
	    	request = new ActiveXObject("Microsoft.XMLHTTP");
	    } catch (failed) {
	    	request = false;
	    }
	  }
	}
	try{
		request.open(method,url,true);
		//Send the proper header information along with the request
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
		request.setRequestHeader("Content-length", data.length);
		request.setRequestHeader("Connection", "close");
	
		request.onreadystatechange=function(){
			if(request.readyState==4){
				if(request.status!=200){
					onSuccess(ajax.defaultResponse);
					return true;
				}
				if(request.responseText.length==0){
					onSuccess(ajax.defaultResponse);
					return true;
				}
				var data=null;
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( /^[\],:{}\s]*$/.test(request.responseText.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
						.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
					data= window.JSON && window.JSON.parse ? window.JSON.parse(request.responseText) : (new Function("return " + request.responseText))();
				}else{
					//console.log("Invalid JSON:"+request.responseText);
				}
				/*
				if(typeof(window.JSON) != 'undefined'){
					try{data=JSON.parse(request.responseText);}catch(err){}
					//data=JSON.parse(request.responseText);
				}
				else{
					try{data=eval(request.responseText);}catch(err){alert(request.responseText);}
					//data=eval(request.responseText);
				}*/
			onSuccess(data);
			}
		};
		request.send(data);
	}catch(err){console.log(err);}
};

var jsUtilities = function() {
	return {
		trimString : function(str){
			return str.replace(/^\s+|\s+$/g,"");
		}
	};
}();	

/***************************COOKIE********************/

var cookie=new function(){
	this.setCookie =function(name, value, days) {
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);
		
		if (safari || ie) {
			  var expiration = (days) ? days*24*60*60 : 0;
				
			  var _div = document.createElement('div');
			  _div.setAttribute("id", name);
			  _div.setAttribute("type", "hidden");
			  document.body.appendChild(_div);
			  
			  var
			  div = document.getElementById(name),
			  form = document.createElement('form');

			  try {
				  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
					//try is ie
				} catch(err) {
					//catch is ff and safari
					iframe = document.createElement('iframe');
				}
				
			  iframe.name = name;
			  iframe.src = 'javascript:false';
			  iframe.style.display="none";
			  div.appendChild(iframe);

			  form.action = (("https:" == document.location.protocol) ? "https://sharethis.com/" : "http://sharethis.com/")+"account/setCookie.php";
			  form.method = 'POST';

			  var hiddenField = document.createElement("input");
			  hiddenField.setAttribute("type", "hidden");
			  hiddenField.setAttribute("name", "name");
			  hiddenField.setAttribute("value", name);
			  form.appendChild(hiddenField);

			  var hiddenField2 = document.createElement("input");
			  hiddenField2.setAttribute("type", "hidden");
			  hiddenField2.setAttribute("name", "value");
			  hiddenField2.setAttribute("value", value);
			  form.appendChild(hiddenField2);

			  var hiddenField3 = document.createElement("input");
			  hiddenField3.setAttribute("type", "hidden");
			  hiddenField3.setAttribute("name", "time");
			  hiddenField3.setAttribute("value", expiration);
			  form.appendChild(hiddenField3);

			  form.target = name;
			  div.appendChild(form);

			  form.submit();
		}
		else {
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
			cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
			document.cookie = cookie_string;
		}
	};
	this.getCookie=function(cookie_name) {
		var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		if (results) {
			return (unescape(results[2]));
		} else {
			return false;
		}
	};
	this.deleteCookie=function(name) {
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);
		
		if (safari || ie) {
			var _div = document.createElement('div');
			_div.setAttribute("id", name);
			_div.setAttribute("type", "hidden");
			document.body.appendChild(_div);

			var
			div = document.getElementById(name),
			form = document.createElement('form');

			try {
			  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
				//try is ie
			} catch(err) {
				//catch is ff and safari
				iframe = document.createElement('iframe');
			}
				
			iframe.name = name;
			iframe.src = 'javascript:false';
			iframe.style.display="none";
			div.appendChild(iframe);

			form.action = (("https:" == document.location.protocol) ? "https://sharethis.com/" : "http://sharethis.com/")+"account/deleteCookie.php";
			form.method = 'POST';

			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "name");
			hiddenField.setAttribute("value", name);
			form.appendChild(hiddenField);

			form.target = name;
			div.appendChild(form);

			form.submit();
		}
		else {
			var path="/";
			var domain=".sharethis.com";
			document.cookie = jsUtilities.trimString(name) + "=" +( ( path ) ? ";path=" + path : "") 
				  + ( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
	};
};

/***************************ODJS********************/

function odjs(scriptSrc,callBack){
	this.head=document.getElementsByTagName('head')[0];
	this.scriptSrc=scriptSrc;
	this.script=document.createElement('script');
	this.script.setAttribute('type', 'text/javascript');
	this.script.setAttribute('src', this.scriptSrc);
	this.script.async = true;
	this.script.onload=callBack;
	this.script.onreadystatechange=function(){
		if(this.readyState=='complete'){
			callBack();
		}
	};
	this.s = document.getElementsByTagName('script')[0]; 
	this.s.parentNode.insertBefore(this.script, this.s);
	//this.head.appendChild(this.script);
}

function odcss(scriptSrc,callBack){
	this.head=document.getElementsByTagName('head')[0];
	this.scriptSrc=scriptSrc;
	this.css=document.createElement('link');
	this.css.setAttribute('rel', 'stylesheet');
	this.css.setAttribute('type', 'text/css');
	this.css.setAttribute('href', scriptSrc);
	this.css.setAttribute('id', scriptSrc);
	setTimeout(function(){callBack();},500);
	this.head.appendChild(this.css);
	clearInterval(widget.cssInterval);
	widget.cssInterval=setInterval(function(){if(document.getElementById(scriptSrc)){clearInterval(widget.cssInterval);callBack();document.getElementsByTagName('body')[0].style.display="block";}},100);
	
}

/***************************DOM READY CALLBACK********************/

function initialize(){
	fragmentPump.checkFragment();
	var isBot=false;
	var nv=navigator.userAgent;
	var nvPat=/bot|gomez|keynote/gi;
	if(nv && nv!==null && nv.length>4){
		var tempMatch=nv.match(nvPat);
		if(tempMatch && tempMatch!==null && tempMatch.length>0){
			isBot=true;
		}
	}else{
		isBot=true;
	}
	
	if(fragmentPump.initRun==true){
		processBuffer();
	}
	
	getMainCss();
	widget.domReady=true;
	if(widget.publisherGA!==null){
		initGA();
	}

	document.getElementById('chicklet_search_field').value=lang.strings['msg_search_services'];
	document.getElementById('chicklet_search_field').onfocus=function(){searchFocus();};
	document.getElementById('chicklet_search_field').onblur=function(){searchBlur();};
	document.getElementById('signIn_text').onclick=function(){signIn();};
	document.getElementById('signOut').onclick=function(){signOut();};
	document.getElementById('notYou').onclick=function(){signOut();signIn();};
	document.getElementById('modal_button').onclick=function(){clearModal();};		
	document.getElementById('popular').innerHTML=lang.strings['msg_share'];
	document.getElementById('msg_share_success').innerHTML=lang.strings['msg_share_success'];
	document.getElementById('btnShareAgain').innerHTML=lang.strings['msg_share_again']; //msgstr_btn_send
	document.getElementById('btnFastShare').innerHTML=lang.strings['msg_fast_share']; //msgstr_btn_send
	document.getElementById('relatedText').innerHTML=lang.strings['msg_related_shares'];//relatedText
	document.getElementById('msg_post_to').innerHTML=lang.strings['msg_post_to'];//msg_post_to
	document.getElementById('poster_message').innerHTML=lang.strings['msg_message'];//poster_message
	document.getElementById('poster_message2').innerHTML=lang.strings['msg_blog_url'];//poster_message2
	document.getElementById('posterSubmit').innerHTML=lang.strings['msg_submit'];//msg_submit	
	//document.getElementById('footer_link_a').innerHTML=lang.strings['msg_friends'];//footer_link_a
	//document.getElementById('msg_my_acct').innerHTML=lang.strings['msg_my_acct'];
	document.getElementById('signIn_text').innerHTML=lang.strings['msg_signin'];//signIn_text
	document.getElementById('signOut').innerHTML=lang.strings['msg_signout'];//signOut
	
	//get value from HTML5 localStorage for userinfo
	if (cookie.getCookie('ShareUT') !== false) {
		if (typeof(window.localStorage) !== "undefined") {
			var sut = cookie.getCookie('ShareUT');
			var storage = window.localStorage;
			if (typeof (storage.email) != "undefined"){user.email = storage.email;}
			if (typeof (storage.name) != "undefined"){user.name = storage.name;}
			if (typeof (storage.nickname) != "undefined"){user.nickname = storage.nickname;}//storage[sut].display
			if (typeof (storage.display) != "undefined"){user.display = storage.display;}//storage[sut].display
			if (typeof (storage.currentUserType) != "undefined"){user.currentUserType = storage.currentUserType;}
			if (typeof (storage.ThirdPartyUsers) != "undefined"){user.ThirdPartyUsers = storage.ThirdPartyUsers;}
			document.getElementById('signIn').style.display="none";		
			if(user.display!==null){
				var userName = user.name;
				userName = userName ? userName : user.email;
				userName = userName ? userName : user.nickname;
				document.getElementById('popular').innerHTML = "<a id='header_email' target='_blank' href='http://sharethis.com/account' >Hi "+ userName + ",</a> ";
				document.getElementById('notYou').innerHTML = "Not You?";
			}
			//document.getElementById('footer_email').style.display="block";
			document.getElementById('footer_info').style.display="block";
		}
	}
	
	//delete cookies if opt out
	if(cookie.getCookie('st_optout')!==false){
		var a=document.cookie;
		widget.optout=true;
		widget.fpc="optout";
	}
}

//Adds initialize to be called when dom ready
if (typeof(window.addEventListener) != 'undefined') {
    window.addEventListener("load",initialize, false);
} else if (typeof(document.addEventListener) != 'undefined') {
    document.addEventListener("load",initialize, false);
} else if (typeof window.attachEvent != 'undefined') {
    window.attachEvent("onload",initialize );
}

/**************VISUAL FUNCTIONS ********/

function removeClass(elementName,cname){
	var element=document.getElementById(elementName);
	element.className=element.className.replace(cname,"");
}

function addClass(elementName,cname){
	var element=document.getElementById(elementName);
	element.className+=" "+cname;
}

function replaceClass(oldClass,newClass){
	var elements=document.getElementsByTagName('*');
	var reg=new RegExp(oldClass,'ig');
	for(var i=0;i<elements.length;i++){
		if(reg.test(elements[i].className)){
			elements[i].className=elements[i].className.replace(reg,newClass);
		}else if(reg.test(elements[i].className)){
			elements[i].className=elements[i].className.replace(reg,newClass);
		}else if(reg.test(elements[i].className)){
			elements[i].className=elements[i].className.replace(reg,newClass);
		}  
	}
}

/**************DONE SCREEN ************************/

function getRelatedShares(url){
	
	if(widget.doneScreen==false || url==null){
		document.getElementById('doneScreenContent').style.display="none";//msg_share_success
		document.getElementById('msg_share_success').setAttribute('style',"margin-top:40px;");
		return false;
	}
	var str="";
	if(typeof(widget.relatedDomain)!='undefined' && widget.relateDomain!='')
	{
		str = widget.relatedDomain;
	}
	else
	{
		try{
			if(/(.*:\/\/)(.*?)(\/.*$)/.test(url)==true){
				var reg=new RegExp(/(.*:\/\/)(.*?)(\/.*$)/);
				str=url.replace(reg,"$2");
				str=encodeURIComponent(str);
			}else{
				var reg=new RegExp(/(.*:\/\/)(.*?)/);
				str=url.replace(reg,"$2");
				str=encodeURIComponent(str);
			}

		}catch(err){}
	
	}
	var data=["domain="+str,"return=json","url_limit=2","cb=getRelateShares_onSuccess","service=getLiveStream"];
	data=data.join('&');
	jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws.sharethis.com/" : "http://wd.sharethis.com/")+"api/getApi.php?"+data);
}

function getRelateShares_onSuccess(response){
	//console.log(response);
	var element=document.getElementById('relatedShares');
	while (element.childNodes.length >= 1 )
    {
        element.removeChild(element.firstChild ); //clear out email box first       
    }
	var clear=document.createElement('div');
	clear.className="clear";
	if (response && response.urls && response.url_count > 0) {
		for(var i=0;i<response.urls.length && i<3;i++){
			var relatedShare=document.createElement('div');
			if (response.urls[i].img != ""){
				relatedShare.className="relatedShare hasImage";
		        var imgSrc = (("https:" == document.location.protocol) ? "https://ws" : "http://w")+'.sharethis.com/share5x/images/no-image.png';
				if(typeof(response.urls[i].imagehash)!=="undefined"){
			          imgSrc = "http://img.sharethis.com.s3.amazonaws.com/" + response.urls[i].imagehash + "/100_100.jpg";
				}
		        var imageDiv=document.createElement('div');
		        	imageDiv.className="relatedImg";
		        var image=document.createElement('img');
		        	image.setAttribute('stlink',response.urls[i].url);
		        	//image.onclick=function(){window.open(response.urls[i].url,'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1'); return false;};
		        	if(image.attachEvent){
		        		image.onclick=function(){gaLog('DoneScreen','ImgLinkClick');window.open(this.getAttribute('stlink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
					}else{
						image.setAttribute('onclick',"gaLog('DoneScreen','ImgLinkClick');window.open('"+response.urls[i].url+"','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
					}
		        	image.setAttribute('src',imgSrc);
		        imageDiv.appendChild(image);	
		        relatedShare.appendChild(imageDiv);
		    }else{
		    	relatedShare.className="relatedShare";
		    }
			var relatedDetails=document.createElement('div');
				relatedDetails.className="relatedDetails";
			var relatedTitle=document.createElement('span');
				relatedTitle.className="relatedTitle link";
				relatedTitle.setAttribute('stlink',response.urls[i].url);
				if(relatedTitle.attachEvent){
					relatedTitle.onclick=function(){gaLog('DoneScreen','TitleLinkClick');window.open(this.getAttribute('stlink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
				}else{
					relatedTitle.setAttribute('onclick',"gaLog('DoneScreen','TitleLinkClick');window.open('"+response.urls[i].url+"','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
				}
				//relatedTitle.onclick=function(){window.open(response.urls[i].url,'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1'); return false;};
				relatedTitle.setAttribute('title',response.urls[i].title);
				//relatedTitle.appendChild(document.createTextNode(response.urls[i].title));
				relatedTitle.innerHTML= response.urls[i].title.length > 50 ? response.urls[i].title.substring(0,50) + "..." : response.urls[i].title ;
			relatedDetails.appendChild(relatedTitle);
			var relatedSource=document.createElement('span');
				relatedSource.className="relatedSource";
				relatedSource.appendChild(document.createTextNode(response.urls[i].domain.length > 15 ? response.urls[i].domain.substring(0,15) + "..." : response.urls[i].domain));
			relatedDetails.appendChild(relatedSource);
			var relatedShareCount=document.createElement('span');
				relatedShareCount.className="relatedShareCount";
				relatedShareCount.appendChild(document.createTextNode(response.urls[i].shares + " share" + ( (response.urls[i].shares == 1) ? "" : "s" )));
			relatedDetails.appendChild(relatedShareCount);
			relatedShare.appendChild(relatedDetails);
			var clear=document.createElement('div');
				clear.className="clear";
			relatedShare.appendChild(clear);
			element.appendChild(relatedShare);
		}
	}else{//ShareThis items
		var relatedShare=document.createElement('div');
		document.getElementById('relatedText').style.display="none";
	        var imgSrc = (("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure/images/bullet_2.gif" : "http://w.sharethis.com/share4x/images/bullet_2.gif");
	        var imageDiv=document.createElement('div');
	        	imageDiv.className="relatedImg";
	        var image=document.createElement('img');
	        	image.setAttribute('stlink',"http://sharethis.com/publishers/getbutton/");
	        	if(image.attachEvent){
	        		image.onclick=function(){gaLog('DoneScreen','ImgLinkClick');window.open(this.getAttribute('stlink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
				}else{
					image.setAttribute('onclick',"gaLog('DoneScreen','ImgLinkClick');window.open('http://sharethis.com/publishers/getbutton/','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
				}
	        	image.setAttribute('src',imgSrc);
	        imageDiv.appendChild(image);	
	        relatedShare.appendChild(imageDiv);
	        relatedShare.className="relatedShare hasImage";
	        relatedShare.setAttribute('style','margin-top:35px');
		var relatedDetails=document.createElement('div');
			relatedDetails.className="relatedDetails";
		var relatedTitle=document.createElement('span');
			relatedTitle.className="relatedTitle link";
			relatedTitle.setAttribute('stlink',"http://sharethis.com/publishers/getbutton/");
			if(relatedTitle.attachEvent){
				relatedTitle.onclick=function(){gaLog('DoneScreen','TitleLinkClick');window.open(this.getAttribute('stlink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
			}else{
				relatedTitle.setAttribute('onclick',"gaLog('DoneScreen','TitleLinkClick');window.open('http://sharethis.com/publishers/getbutton/','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
			}
			//relatedTitle.appendChild(document.createTextNode(lang.strings['msg_get_button']));
			relatedTitle.innerHTML=lang.strings['msg_get_button'];
		relatedDetails.appendChild(relatedTitle);
		var relatedSource=document.createElement('span');
			relatedSource.className="relatedSource";
			relatedSource.appendChild(document.createTextNode(lang.strings['msg_put_sharethis']));
		relatedDetails.appendChild(relatedSource);
		var relatedShareCount=document.createElement('span');
			relatedShareCount.className="relatedShareCount";
			
		relatedDetails.appendChild(relatedShareCount);
		relatedShare.appendChild(relatedDetails);
		var clear=document.createElement('div');
			clear.className="clear";
		relatedShare.appendChild(clear);
		element.appendChild(relatedShare);
	}
}

function hideDoneScreen(){
	turnPage("main");
	//replaceStyles();
}

function showDoneScreen(){
	document.getElementById("msg_share_success").style.visibility="visible";
	getRelatedShares(widget.URL);
	turnPage("done");
	if (cookie.getCookie('ShareUT')){
		document.getElementById('btnShareAgain').onclick=function(){addServiceLinks();moveServices(0);hideDoneScreen();gaLog("DoneScreen","ShareAgain");};
		document.getElementById('btnShareAgain').style.display='block';
		document.getElementById('btnFastShare').style.display='none';
		document.getElementById('msg_share_success').innerHTML=lang.strings['msg_share_success'];
	} else {
		gaLog("DoneScreen","SeenFastShare");
		document.getElementById('btnFastShare').onclick=function(){showFastShareInfo();};
		document.getElementById('btnShareAgain').style.display='none';
		document.getElementById('btnFastShare').style.display='block';
		document.getElementById('msg_share_success').innerHTML=lang.strings['msg_share_success_fs'];
	}
}

function showFastShareInfo()
{
	window.open( "http://sharethis.com/account/signin-widget", "LoginWindow","status=1, height=450, width=970, resizable=1" );
	clearInterval(widget.fsPoller);
	widget.fsPoller=setInterval(function(){
		var authCookie = cookie.getCookie("ShareUT");
		if (authCookie) {
			clearInterval(widget.fsPoller);
			showFastShareDone();
			clearInterval(widget.fsPoller);
		}
	},1000);
	gaLog("DoneScreen","FastShare");
}

function showFastShareDone()
{
	clearInterval(widget.fsPoller);
	document.getElementById('successBox').style.display='none';
	document.getElementById('done_screen').style.display='none';
	document.getElementById('fsDoneBox').style.display='block';
	document.getElementById('fsExampleImg').src="images/fs-example.jpg";
	checkLogin();
	gaLog("DoneScreen", "FastShareDone");
	/*document.getElementById('btnTryFastShare').onclick=function(){
		gaLog("DoneScreen","Refreshing for FastShare");
		window.parent.location.href=document.referrer;
	};*/
}

function showHome(){
	turnPage("main");
}

/********************LOGGING***********************/

function logEvent(destination1,eventType) {
	var source = "";
	if (widget.toolbar==true) {
		source = "toolbar";
	}else if (widget.page != "home" && widget.page != "") {
		source = "chicklet";
	} else {
		source = "button";
	}
	if(widget.service==null){
		widget.service = 'legacy';
	}
	var url33 = ( ("https:" == document.location.protocol)?"https://":"http://");
	url33+= "l.sharethis.com/log?event="+eventType;
	url33+= "&source=" + source;
	url33+= "&publisher="+ encodeURIComponent(widget.publisher);
	url33+= "&hostname="+ encodeURIComponent(widget.hostname);
	url33+= "&location="+ encodeURIComponent(widget.location);
	url33+= "&destinations="+destination1;
	url33+= "&ts=" + (new Date()).getTime();
	url33+= "&title="+encodeURIComponent(widget.title);
	url33+= "&url="+encodeURIComponent(widget.URL);
	url33+= "&sessionID="+widget.sessionID;
	url33+= "&fpc="+widget.fpc;
	url33+= "&type=" + widget.service + "_" + widget.type;

	var logger33 = new Image(1,1);
	logger33.src = url33;
	logger33.onload = function(){return;};
}

/********************GOOGLE ANALYTICS / OMNITURE**********/

function shareLog(service){
	if (widget.pubTracker != null) {
		widget.pubTracker._trackEvent("ShareThis",service,widget.URL);
	}
	
	if(typeof(window.postMessage)!=="undefined" && document.referrer!==""){
		parent.postMessage("ShareThis|click|"+service+"|"+widget.URL,document.referrer);
	}


}

/********************Posters**********/
var poster={};

//creates poster screen based on service
function createPoster(service){ 
	if(widget.title==null){	widget.title=widget.URL;}
//	console.log("createPoster");
	if(service=="twitter"){
		updateServiceCount(service, 'Tweet');
		gaLog("Twitter","poster_clicked");
		widget.poster="twitter";
		document.getElementById('poster_heading_service').innerHTML="Twitter";  //this is the post to service message
		document.getElementById('poster_textArea').style.display="block";
		document.getElementById('poster_textArea').value="";
		createShar();
		document.getElementById('poster_main').style.display="block";
		document.getElementById('comment_box').style.display="block";
		document.getElementById('poster_input_div').style.display="none";
		document.getElementById('mainPage').style.display="none";
		document.getElementById('poster_textArea').onkeypress=poster.updateCounter;
		document.getElementById('poster_message_counter').style.display="block";
		turnPage("poster");
	}else if(service=="wordpress"){
		updateServiceCount(service, 'Wordpress');
		widget.poster="wordpress";
		gaLog("Wordpress","poster_clicked");
		//alert(document.getElementById('poster_textArea'));
		document.getElementById('poster_heading_service').innerHTML="Wordpress";  //this is the post to service message
		document.getElementById('poster_textArea').style.display="none";
		document.getElementById('comment_box').style.display="none";
		document.getElementById('poster_input_div').style.display="block";
		document.getElementById('poster_main').style.display="block";
		document.getElementById('mainPage').style.display="none";
		document.getElementById('poster_message_counter').style.display="none";
		document.getElementById('poster_message_counter').style.display="none";
		turnPage("poster");
	}
}

//poster.hide=function(){}
poster.cancel=function(service){
	turnPage("main");
	widget.poster=null;
};

poster.getCount=function(){
	var element=document.getElementById('poster_textArea');
	var text=element.value;
	if(text.length>=140){
		return false;
	}else{
		return 140-text.length;
	}
};

poster.updateCounter=function(e){
	try{var KeyID = (window.event) ? event.keyCode : e.keyCode;}catch(err){KeyID=0;}
	var val=poster.getCount();
	var ctr=element=document.getElementById('counter');
	if(val===false){
		ctr.innerHTML=0;
		if(KeyID!==0){
			return true;
		}else{
			return false;
		}
	}else{
		if(val<11){
			ctr.style.color="red";
		}else{
			ctr.style.color="#666666";
		}
		ctr.innerHTML=val;
	}
};

poster.post=function(service){
	//console.log("function poster.post");
	//console.log(widget.serivce);
	if(widget.poster=="twitter"){
		showLoadingBox(lang.strings['msg_posting_t']);
		var data=["return=json","cb=poster.post_onSuccess","service=postTwitter","status="+encodeURIComponent(document.getElementById('poster_textArea').value),"url="+encodeURIComponent(widget.URL),"sessionID="+widget.sessionID];
		data=data.join('&');
		jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws.sharethis.com/" : "http://wd.sharethis.com/")+"api/getApi.php?"+data);
	}else if(widget.poster=="wordpress"){
	//	console.log("post to wordpress");
		if(document.getElementById('poster_inputBox').value.length<1){
			showModal(lang.strings['msg_valid_blog']);
			return false;
		}else{
			if(widget.service==null){
				widget.service = 'legacy';
			}
			var wpurl=document.getElementById('poster_inputBox').value;
			var url=(("https:" == document.location.protocol) ? "https://ws." : "http://wd.")+"sharethis.com/api/sharer.php?destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&wpurl={wpurl}&source=button&service={service}&type={type}";
			url=url.replace("{destination}","wordpress");
			url=url.replace("{url}",encodeURIComponent(widget.URL));
			url=url.replace("{title}",encodeURIComponent(widget.title));
			url=url.replace("{wpurl}",encodeURIComponent(wpurl));
			url=url.replace("{publisher}",widget.publisher);
			url=url.replace("{fpc}",widget.fpc);
			url=url.replace("{sessionID}",widget.sessionID);
			url=url.replace("{service}",widget.service);
			url=url.replace("{type}",widget.type);
			window.open(url,"post_wordpress" ,"status=1, height=700, width=970, resizable=1" );
			widget.poster=null;
			showDoneScreen();
			return true;
		}
	}
	return true;
};

poster.post_onSuccess=function(response){
	//console.log(response);
	widget.poster=null;
	showDoneScreen();
};

/***************SHAR URL******************/

function createShar(){
	var url=widget.URL;
	if(url==widget.lastURL){
		var temp=( (widget.title!=null) ? widget.title+' - ' : "" )+widget.sharURL;
		document.getElementById('poster_textArea').value=temp;
		poster.updateCounter();
	}else if(url!=="" && url!==" " && url!==null){
    	document.getElementById('poster_textArea').value = lang.strings['msg_loading'];
    	widget.lastURL=url;
		var data=["return=json","cb=createShar_onSuccess","service=createSharURL","url="+encodeURIComponent(url),"sessionID="+widget.sessionID,"fpc="+widget.fpc];
		data=data.join('&');
		jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws.sharethis.com/" : "http://wd.sharethis.com/")+"api/getApi.php?"+data);
	}
}

function createShar_onSuccess(response){	
	if(response.status=="SUCCESS"){
		widget.sharURL=response.data.sharURL;
	}
	//console.log(widget.title);
	var temp=( (widget.title!=null) ? widget.title+' - ' : "" )+widget.sharURL;
	document.getElementById('poster_textArea').value=temp;
	poster.updateCounter();
}

/*******************GA Logging***************************/

//this will initialize the Widget GA and log a page view..
function initGA(){
	if(typeof(_gat)=="undefined"){
		var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
		var headID = document.getElementsByTagName("head")[0];         
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = gaJsHost + "google-analytics.com/ga.js";
		odjs(newScript.src,function(){
			try{
				widget.ga = _gat._getTracker("UA-1645146-9");
				widget.ga._trackPageview();
				if(widget.tracking && widget.publisherGA!==null){
					widget.pubTracker=_gat._getTracker(widget.publisherGA);
					widget.ga._trackEvent("PublisherGA-"+widget.tracking,widget.publisherGA,widget.publisher);
				}else if(widget.publisherGA!==null){
					widget.pubTracker=_gat._getTracker(widget.publisherGA);
					widget.ga._trackEvent("PublisherGA-"+widget.tracking,widget.publisherGA,widget.publisher);
				}					
			}catch(err) {}
		});
	}else if(widget.publisherGA!==null && widget.pubTracker==null){//publisher tracker not initialized
		widget.pubTracker=_gat._getTracker(widget.publisherGA);
		widget.ga._trackEvent("PublisherGA-"+widget.tracking,widget.publisherGA,widget.publisher);

	}
}

function gaLog(category, action, label, value) {
	if( typeof(widget.ga) != "undefined" && widget.ga!==null ) {
		widget.ga._trackEvent(category, action, label, value);
	}
}


/***************I18N******************/
if(typeof(lang)=="undefined"){
	var lang={};
	lang.strings=new Object;
	lang.strings['msg_loading'] = 'Loading';
	lang.strings['msg_posting_t'] = 'Posting to Twitter';
	lang.strings['msg_text'] = 'Text to a Friend:';
	lang.strings['msg_email'] = 'Email to a Friend:';
	lang.strings['msg_sendign_inProgress'] = 'Sharing Message';
	lang.strings['msg_search_services'] = 'Search for services';
	lang.strings['msg_get_button'] = 'Get the Button!';
	lang.strings['msg_put_sharethis'] = 'Put ShareThis on your website or blog in minutes!';
	lang.strings['msg_valid_blog'] = 'Sorry, there was something wrong with that URL, please try again.';
	lang.strings['msg_post_wordpress'] = 'Post to Wordpress';
	lang.strings['msg_email_to'] = 'To:';
	lang.strings['msg_email_from'] = 'From:';
	lang.strings['msg_email_send'] = 'Send';
	lang.strings['msg_email_cancel'] = 'Cancel';
	lang.strings['msg_email_preview'] = 'Preview';
	lang.strings['msg_email_close_preview'] = 'Close Preview';
	lang.strings['msg_email_char_limit'] = '2000 characters left';
	lang.strings['email_message'] = 'Message:';
	lang.strings['msg_email_privacy'] = 'Privacy Policy';
	lang.strings['msg_email_load_cont'] = 'Loading Contacts...';
	lang.strings['msg_import_serv'] = 'Import Contacts From';
	lang.strings['msg_email_captcha_info'] = 'Please type the words below:';
	lang.strings['msg_valid_email_add'] = 'Please enter a valid email address.';
	lang.strings['msg_valid_email_add_from'] = 'Please enter a valid email address in the "From" field.';
	lang.strings['msg_valid_recipients'] = 'Please enter a valid recipient';
	lang.strings['msg_captcha'] = 'Please enter the Captcha response.';
	lang.strings['msg_share']="Share this with friends!";
	lang.strings['msg_view_all']="View All";
	lang.strings['msg_hide_all']="Hide All";
	lang.strings['msg_share_success']="Your message was successfully shared!";
	lang.strings['msg_share_success_fs']="Your message was successfully shared! Log-in with FastShare to share with just one click next time.";
	lang.strings['msg_share_again']="Share Again";
	lang.strings['msg_fast_share']='Enable FastShare';
	lang.strings['msg_related_shares']="Popular Shares:";
	lang.strings['msg_post_to']="Post to";
	lang.strings['msg_message']="Message:";
	lang.strings['msg_blog_url']="Blog URL";
	lang.strings['msg_submit']="Submit"; 
	lang.strings['msg_friends']="What are your friends sharing?";
	lang.strings['msg_my_acct']="My Account";
	lang.strings['msg_signin']="Sign In";
	lang.strings['msg_signout']="Sign Out";
}

//******************************slider*************************************//
var stlib_slider = {};
stlib_slider.getValue;
stlib_slider.createSlider = function(El, minValue, startValue, maxValue, callback, totalHeight,scrollerHeight) {
	El.style.top = ((startValue-minValue)/(maxValue-minValue))*totalHeight-1 + "px";
	El.style.backgroundImage=(("https:" == document.location.protocol)?"url(https://ws.sharethis.com/images/scroll.png)":"url(http://w.sharethis.com/images/scroll.png)");
	var moving;
	
	stlib_slider.setValue = function(ratio) {
		var cssTop = (totalHeight-scrollerHeight)*ratio;
		El.style.top = (cssTop-1) + "px";
	};
	
	addEvent(El, 'mousedown', function(e) {
		replaceStyles(true);
		if(e.preventDefault) {
			e.preventDefault();
		}
		var sliderOptions = [];
		sliderOptions["El"] = El;
		sliderOptions["starty"] = e.pageY ? e.pageY : e.clientY + document.documentElement.scrollTop;
		sliderOptions["parent"] = El.parentNode;
		sliderOptions["startTop"] = (El.style.top == "auto")||(El.style.top == "") ? startValue : parseInt(El.style.top.replace(/px/i, ""));	
				
		moving = function(e) {
			var s = sliderOptions;
			var y = e.pageY ? e.pageY : e.clientY + document.documentElement.scrollTop;
			//console.log(y);
			var moved = y - s.starty;
			//console.log(moved);
			var cssTop = s.startTop + moved;
			//console.log(cssTop + ":" + totalHeight);
			cssTop = cssTop > totalHeight - scrollerHeight ? totalHeight- scrollerHeight: cssTop;
			cssTop = cssTop < 0 ? 0 : cssTop;
			//console.log(cssTop); //This is where the error is !!!!
			El.style.top = (cssTop-1) + "px";
			stlib_slider.getValue = function() {return cssTop/(totalHeight-scrollerHeight);};
			if (callback) {
				callback();
			}
		};		
		
		function detectOut(e) {
			var El = e.relatedTarget || e.toElement;
			if(El) {
				if(El.tagName.toLowerCase() == "html") {
					removeEvent(document,'mouseout',detectOut, false);
					removeEvent(document,'mousemove',moving, false);
				}
			} else {
				removeEvent(document,'mouseout',detectOut, false);
				removeEvent(document,'mousemove',moving, false);
			}
		}
		
		addEvent(document,'mousemove',moving, false);
		addEvent(document,'mouseup', function() {
			removeEvent(document,'mouseout',detectOut, false);
			removeEvent(document,'mousemove',moving, false);
		}, false);
		addEvent(document,'mouseout', detectOut, false);
	}, false);	
	function addEvent(obj, eventType, func, useCapture){
		  if (obj.addEventListener){
			obj.addEventListener(eventType, func, useCapture);
			return true;
		  } else if (obj.attachEvent){
			var r = obj.attachEvent("on"+eventType, func);
			return r;
		  } 
		}
	function removeEvent(obj, eventType, func, useCapture){
	  if (obj.removeEventListener){
		obj.removeEventListener(eventType, func, useCapture);
		return true;
	  } else if (obj.detachEvent){
		var r = obj.detachEvent("on"+eventType, func);
		return r;
	  } 
	} 
};

stlib_slider.createSlider(document.getElementById("sts_sliderKnob"), 0, 0, 100, repositionServices, 228, 58);

//If IE7 or IE8, disabled select for the scrollbar (ONLY), otherwise the highlight breaks the events.
//This could be improved because we are simply turning it off for those browsers.  A proper implementation would
//check if we are in textboxes/input elements and allow selection in that case.
document.onselectstart = function() {
	var user = navigator.userAgent;
	var shouldDisable = user.indexOf("IE 7") != -1;
	shouldDisable = user.indexOf("IE 8") != -1 ? true : shouldDisable;
	if (shouldDisable) {
		var elem = document.getElementById("sts_sliderKnob");
		elem.unselectable="on";
//		return false;
	};
};

function repositionServices() {
	var user = navigator.userAgent;
	var shouldDisable = user.indexOf("IE 9") != -1;
	shouldDisable = user.indexOf("Firefox") != -1 ? true : shouldDisable;
	
	var ratio = stlib_slider.getValue();
	var chix = document.getElementById("top_chicklets");
	var rows = Math.floor((chix.childNodes.length + 1)/2);
	if (rows < 6) {
		chix.style.top = "0px;";
	} else {
		var scrollMax = shouldDisable ? -46*(rows-5)-15 : -46*(rows-5);
		var calculatedScroll = -(rows*42.2)*ratio;
		calculatedScroll = calculatedScroll < scrollMax ? scrollMax : calculatedScroll;
		chix.style.top = calculatedScroll + "px";
	}
}

function moveServices(row, search) {
	var chix = document.getElementById("top_chicklets");
	if (row == 0) {
		chix.style.top = "0px";
		stlib_slider.setValue(0);
		var element=document.getElementById('chicklet_search_field');
		if(element!=null && typeof(search)=="undefined" && !search){
			element.value=lang.strings['msg_search_services'];
		}
		return;
	}
	var rows = Math.floor(chix.childNodes.length/2);
	var maxRow = rows-5;
	var ratio = stlib_slider.setValue((row+1)/(rows-5) > 1 ? 1 : (row+1)/(rows-5));
	chix.style.top = row > maxRow ? -((rows-5)*46) + "px" : -(row*46) + "px";
}
