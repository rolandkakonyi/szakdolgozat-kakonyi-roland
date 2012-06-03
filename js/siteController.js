var siteController={
	pr: null,
	list:{
		page:1
	},
	init: function(){
		var me=this;
                    
		this.initGmaps();
		this.initHeatMap();
	
		$("#tog").click(function(){
			me.heatmapOverlay.toggle();
		});
	
		$('#upload').click(function(){
			me.showUploadForm();
		});
		
		$('#load').click(function(){
			me.showDatasetListWindow();
		});

		$('#param').click(function(){
			me.showParamGenWindow();
		});
        
	},
	initGmaps: function(){
		this.map = new google.maps.Map(document.getElementById("heatmapArea"), {
			zoom: 14,
			center: new google.maps.LatLng(46.072349,18.217741),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: false,
			scrollwheel: true,
			draggable: true,
			navigationControl: true,
			mapTypeControl: false,
			scaleControl: true,
			disableDoubleClickZoom: false,
			minZoom: 2
		});
	},
	initHeatMap: function(){
		this.heatmapOverlay = new HeatmapOverlay(this.map, {
			"radius":12,
			"visible":true, 
			"opacity":60,
			"gradient":{
				0.45: "rgb(0,0,255)",
				0.50: "rgb(0,128,255)",
				0.55: "rgb(0,255,255)",
				0.60: "rgb(0,255,128)",
				0.65: "rgb(0,255,196)",
				0.70: "rgb(0,255,0)",
				0.75: "rgb(64,255,0)",
				0.85: "rgb(128,255,0)",
				0.95: "rgb(255,255,0)",
				1.0: "rgb(255,0,0)"
			}
		});
	},
	showParamGenWindow: function(){
		var paramForm='<div class="paramForm"><h2>Paraméterfájl generálás</h2>'+
		'<label for="samplingTime" class="left">Mintavételezési idő:</label>'+
		'<input class="left" type="text" id="samplingTime" name="samplingTime" value="1,00"/><span class="left">mp</span>'+
		'<div class="clbo"></div></div>';

		var pr=$.prompt(paramForm,{
			buttons:{
				'Mégsem': false,
				'Generál': true
			},
			loaded: function(){
				$("#samplingTime").numeric({
					decimal : "." , 
					negative : false
				});
			},
			submit: function(v){
				if(v){
					var hasblanks=false;
					var values={};
					$.each($('div.jqimessage input'),function(k,val){
						if(!$(val).val()){
							hasblanks=true;
							return;
						}
						else{
							values[$(val).attr('name')]=$(val).val();
						}
					});
					if(hasblanks){
						$.prompt('Hibás űrlap kitöltés!');
						return false;
					}
					
					$.ajax({
						url: appconf.ajax_url,
						type:'POST',
						async: true,
						cache: false,
						dataType: 'json',
						data: {
							method: 'generateParam',
							values: values
						},
						success:function(processRet){
							if(processRet.success){
								pr.remove();
								window.location.href=processRet.url;
							}
							else{
								$.prompt('Sikertelen paraméterfájl generálás!');
							}
						}
					});
					return false;
				}
				else{
					return true;
				}
				
			}
		});
	},
	showDatasetListWindow:function(){
		var listHtml='<h2>Adatok betöltése</h2><div id="listWrapper"><img class="loader" src="img/ajax-loader.gif"  alt="Töltés..."/><table id="list"></table><div class="page_status"></div></div>';
		siteController.pr=$.prompt(listHtml,{
			classes:'wide',
			buttons:{
				'Előző oldal':-2,
				'Következő oldal':-1,
				'Bezárás':false
			},
			submit:function(v){
				switch(v){
					case -2:
						siteController.setDatasetListHtml(siteController.list.page-1);
						return false;
						break;
					case -1:
						siteController.setDatasetListHtml(siteController.list.page+1);
						return false;
						break
					default:
						return true;
				}
			}
		});
		siteController.setDatasetListHtml();
	},
	getDataset:function(id){
		$.ajax({
			url: appconf.ajax_url,
			type:'POST',
			async: true,
			cache: false,
			dataType: 'json',
			data: {
				method: 'loadDataset',
				id: id
			},
			success:function(ret){
				if(ret.success){

					if(siteController.hasOwnProperty('center')){
						siteController.center.setVisible(false);
					}
					if(siteController.hasOwnProperty('circle')){
						siteController.circle.setVisible(false);
					}
					var dataset={
						max:ret.max,
						data:ret.points
					};
					var html='Betöltött adatsor adatai: Adatsor neve: <span>'+ret.dataset.name+'</span>  Mentés ideje: <span>'+ret.dataset.creation_date+'</span>';
					$('.loadedDataset').html(html).show();
					siteController.heatmapOverlay.setDataSet(dataset);
					siteController.processDataset(id,ret.dataset.param,new google.maps.LatLngBounds(new google.maps.LatLng(parseFloat(ret.sw.lat),parseFloat(ret.sw.lng)),new google.maps.LatLng(parseFloat(ret.ne.lat),parseFloat(ret.ne.lng))));
					
					if(siteController.pr){
						siteController.pr.remove();
					}
				}
				else{
					$.prompt(ret.error);
				}
			}
		});
	},
	setDatasetListHtml:function(page){
		$('#listWrapper .loader').show();
		$('#listWrapper #list').hide();
		page=parseInt(page);
		if(!page){
			page=1;
		}
		siteController.list.page=page;
		$.ajax({
			url: appconf.ajax_url,
			type:'POST',
			async: true,
			cache: false,
			dataType: 'json',
			data: {
				method: 'getDatasetList',
				page: page
			},
			success:function(ret){
				$('#listWrapper .loader').hide();
				if(ret.success){
					var data=ret.datasets;
					var html='<tr><th>Azon.</th><th>Név</th><th>Létrehozva</th><th>Pontok száma</th><th class="noborder"></th></tr>';
					for(var i=0;i<data.length;i++){
						html+='<tr class="row'+(data.length-1==i?' noborder':'')+'">';
						html+='<td>'+data[i].id+'</td>';
						html+='<td>'+data[i].name+'</td>';
						html+='<td>'+data[i].creation_date+'</td>';
						html+='<td>'+data[i].count+'</td>';
						html+='<td class="noborder button"><span onclick="siteController.getDataset('+data[i].id+');return false;">Betöltés</span></td>';
						html+='</tr>';
					}
					$('#listWrapper #list').html(html);
					$('#listWrapper .page_status').html(page+'. oldal ('+(ret.offset+1)+'-'+((page*5<ret.count)?(page*5):ret.count)+'/'+ret.count+')');
					if(page==1){
						$('button[id^=jqi_state0_buttonElőző]').hide();
					}
					else{
						$('button[id^=jqi_state0_buttonElőző]').show();
					}
					if(page*5>ret.count){
						$('button[id^=jqi_state0_buttonKövetkező]').hide();
					}
					else{
						$('button[id^=jqi_state0_buttonKövetkező]').show();
					}
				}
				else{
					$('#listWrapper #list').html(ret.error);	
				}
				$('#listWrapper #list').show();
			}
		}).error(function(){
			console.log('error')
		});
		return true;
	},
	showUploadForm: function(){
		var uploadForm='<form id="uploadForm" action="" method="POST" enctype="multipart/form-data">'+
		'<h2>Adatok feltöltése</h2>'+
		'<label for="datasetName">Adatsor neve:</label>'+
		'<input type="hidden" name="method" value="uploadDataset"/>'+
		'<input type="text" id="datasetName" name="datasetName" maxlength="32"/>'+
		'<span class="disno">Kiválasztott fájl: <span name="filename"></span></span>'+
		'<input class="disno" type="file" name="uploadData"/>'+
		'<div class="clbo"></div>'+
		'</form>';

		siteController.pr=$.prompt({
			state0:{
				html:uploadForm,
				buttons:{
					'Mégsem':-1,
					'Tallóz':0,
					'Feltöltés':1
				},
				submit: function(v){
					switch(v){
						case -1:
							return true;
							break;
						case 0:
							$('#uploadForm input[type=file]').click();
							return false;
							break;
						case 1:
						default:
							var errorMsg=siteController.validateForm();
							if(errorMsg){
								$.prompt(errorMsg);
							}
							else{
								$('#uploadForm').submit();
								$.prompt.goToState('state1');
							}
							return false;
					}
				}
			},
			state1:{
				html:'<div>A feltöltés folyamatban...<br /><img src="img/ajax-loader.gif" alt="Feltöltés..."/></div>',
				buttons:{}
			},
			state2:{
				html:'<div>A feldolgozás folyamatban...<br /><img src="img/ajax-loader.gif" alt="Feldolgozás..."/></div>'
			}
		});
        
		$('#uploadForm input[type=file]').change(function(){
			$("#uploadForm span[name=filename]").html($(this).val()).parent().fadeIn('slow');
		});
        
		$('#uploadForm').submit(function(){
			$(this).attr('action',appconf.ajax_url);
			$(this).attr('method','POST');
			return AIM.submit(this, {
				'onStart' : function(){},
				'onComplete' : function(ret){
					var uploadObj=eval('('+ret+')');
					if(uploadObj.success){

						siteController.getDataset(uploadObj.datasetId);
						
						var uploadMsg=('$rowNum sor feldolgozva,<br />ebből $importedRowNum sor sikeresen bekerült az adatbázisba.').replace('$rowNum',uploadObj.nums.rowNum).replace('$importedRowNum',uploadObj.nums.importedRowNum);
						$('#jqi_state_state2 .jqimessage').prepend(uploadMsg);
						$('#jqi_state_state2 .jqibuttons').hide();
						$.prompt.goToState('state2');
					}
					else{
						$.prompt(uploadObj.error);
					}
				}
			})
		});
	},
	processDataset: function(datasetId,param,bounds){
		var Html='Maximálisan megengedett érték eltérés:<input type="text" class="number" name="param" value="'+parseFloat(param?param:0).toString()+'"/>';
		var pr=$.prompt(Html,{
			loaded:function(){
				$('input[name=param]').numeric({
					decimal : "." ,
					negative : false
				});
			},
			submit:function(v){
				if(v){
					if(!parseFloat($('input[name=param]').val())){
						$.prompt('HIBA!<br/>Nem adhat meg 0 értéket!',{
							callback:function(){
								$('input[name=param]').focus();
							}
						});
						return false;
					}
					$.ajax({
						url: appconf.ajax_url,
						type:'POST',
						async: true,
						cache: false,
						dataType: 'json',
						data: {
							method: 'processDataset',
							datasetId: datasetId,
							param: param,
							newParam: parseFloat($('input[name=param]').val())
						},
						success:function(ret){
							if(ret.success){
								$('#jqi_state_state2 .jqimessage div').hide();
								$('#jqi_state_state2 .jqimessage').append('<br /><br />'+ret.msg);
								$('#jqi_state_state2 .jqibuttons').show();
								
								siteController.center = new google.maps.Marker({
									position: new google.maps.LatLng(ret.center.lat,ret.center.lng),
									map: siteController.heatmapOverlay.map,
									title:'Becsült forrás helye',
									"clickable": true
								});

								siteController.circle=new google.maps.Circle({
									animation: google.maps.Animation.BOUNCE,
									center: siteController.center.getPosition(),
									clickable: true,
									fillColor: '#f00',
									fillOpacity: 0.05,
									map: siteController.heatmapOverlay.map,
									radius: ret.radius,
									strokeColor: '#f00',
									strokeWeight: 1,
									strokeOpacity: 1.0,
									visible:false
								});
								siteController.heatmapOverlay.map.fitBounds(siteController.circle.getBounds());
								
								$.prompt(ret.msg,{
									callback:function(){
										pr.remove();
									}
								});
							}
							else{
								$.prompt(ret.error);
							}
						}
					});
					return false;
				}
				else{
					siteController.heatmapOverlay.map.fitBounds(bounds);
					return true;
				}
				
			},
			buttons:{
				'Feldolgozás és mentés':true,
				'Nem kérem a súlypont számítását':false
			}
		});
		
	},
	validateForm:function(){
		var errors=['Hibásan töltötte ki az \u0171rlapot!'];
		if($.trim($('#uploadForm input[name=datasetName]').val()).length==0){
			errors.push('Adatsor nevének megadása kötelez\u0151!');
		}
		if($.trim($('#uploadForm input[name=uploadData]').val()).length==0){
			errors.push('Az adatsor feltöltéséhez fájl kiválasztása kötelez\u0151!');
		}
		return (errors.length>1)?errors.join('<br /> - '):'';
	},
	/*
	 * a megadott értékek adják a dél-nyugati és az észak-keleti határokat 
	 *
	var bounds=new google.maps.LatLngBounds(new google.maps.LatLng(40.111689, -113.913575),new google.maps.LatLng(40.5207,-91.325684));
siteController.heatmapOverlay.map.fitBounds(bounds);
	 */
	generate: function(x,offset){
		offset=offset?offset:0.001;
		var currentBounds = siteController.heatmapOverlay.map.getBounds();
		var ne = currentBounds.getNorthEast();
		var sw = currentBounds.getSouthWest();
		var minLat=sw.lat()+offset;
		var minLng=sw.lng()+offset;
		var maxLat=ne.lat()-offset;
		var maxLng=ne.lng()-offset;		

		var d=[];
		var count=0;
		while(x-->0){
			count = Math.floor(Math.random()*70)+20;
                
			var lat = Math.random()*(maxLat-minLat)+minLat;
			var lng = Math.random()*(maxLng-minLng)+minLng;
			d.push({
				x:lat,
				y:lng
			});
			siteController.heatmapOverlay.addDataPoint(lat,lng,count);
		/*
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat,lng),
				map: this.heatmapOverlay.map,
				title:count+""
			});			*/
		//console.log(lat,lng,count);
		//console.log((new Date()));
		}
	
	//siteController.stuff(d);
	//console.log((new Date()));
	}
}