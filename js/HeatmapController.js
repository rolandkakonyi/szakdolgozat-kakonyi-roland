HeatmapController={
    init: function(){
        var me=this;
        var zoomRelativeRates={
            1:1,
            2:2,
            3:2,
            4:2,
            5:2,
            6:2,
            7:2,
            8:2,
            9:2,
            10:2,
            11:2,
            12:2,
            13:2,
            14:2,
            15:2,
            16:2,
            17:2,
            18:2
        };
                    
        var myLatlng = new google.maps.LatLng(46.072349,18.217741);
                    
        // sorry - this demo is a beta
        // there is lots of work todo
        // but I don't have enough time for eg redrawing on dragrelease right now
        var myOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
            scrollwheel: true,
            draggable: true,
            navigationControl: true,
            mapTypeControl: false,
            scaleControl: true,
            disableDoubleClickZoom: false,
            minZoom: 2
        };
        this.map = new google.maps.Map(document.getElementById("heatmapArea"), myOptions);
	
        this.heatmapOverlay = new HeatmapOverlay(this.map, {
            "radius":2,
            "visible":true, 
            "opacity":60
        });

        $("#gen").click(function(){
            var currentBounds = HeatmapController.heatmapOverlay.map.getBounds();
            var ne = currentBounds.getNorthEast();
            var sw = currentBounds.getSouthWest();
            var minLat=sw.Qa-50;
            var minLng=sw.Ra-50;
            var maxLat=ne.Qa+50;
            var maxLng=ne.Ra+50;

            //            var latOffset=180;
            //            var lngOffset=180;
            var latOffset=(maxLat-minLat);
            var lngOffset=(maxLng-minLng);
            var x = 1;
            while(x--){
		
                var lat = Math.random()*latOffset+minLat;
                var lng = Math.random()*lngOffset+minLng;
                var count = Math.floor(Math.random()*30)+16;
                HeatmapController.heatmapOverlay.addDataPoint(lat,lng,count);
            }
	
        });
	
        $("#tog").click(function(){
            HeatmapController.heatmapOverlay.toggle();
        });
	
        // this is important, because if you set the data set too early, the latlng/pixel projection doesn't work
        google.maps.event.addListenerOnce(this.map, "idle", function(){
            HeatmapController.heatmapOverlay.setDataSet(HeatmapController.testData);
        });
        /*google.maps.event.addListener(this.map, "center_changed", function(){
            console.log('center_changed');
        });*/
        $('#heatmapArea').mouseup(function(e){
            
            console.log(e);
        });

        $('.fieldset').click(function(){
            $(this).parent().toggleClass('uncollapsed');
            $(this).find('input').val(null);
            $(this).siblings().first().toggle('slow');
            return false;
        });

        $('.fieldset').siblings('form').each(function(k,v){
            $(this).attr('action',appconf.ajax_url);
            $(this).attr('method',"POST");
            $(this).submit(function(){
                return AIM.submit(this, {
                    'onStart' : function(){},
                    'onComplete' : function(ret){
                        var obj=eval('('+ret+')');
                        console.log(obj);
                    }
                })
            });

        });

        var emptyCls="empty";
        var emptyStr="Adatsor neve";
        var emptyController=function(){
            if($(this).hasClass(emptyCls)){
                $(this).removeClass(emptyCls);
                $(this).val("");
            }else if($(this).val().length==0){
                $(this).addClass(emptyCls);
                $(this).val(emptyStr);
            }
        };

        $('[name=datasetName]').blur(emptyController).focus(emptyController).val(function(v){
            return v==emptyStr?'':v;
        });

        $('[name=upload]').parent().submit(function(){
            var error=!me.isValid();
            if(error){
                $.prompt('Hibásan töltötte ki az űrlapot!');
                return false;
            }
            else{
                return true;
            }
        });

        $('[name=browse]').click(function(){
            $(this).siblings('[type=file]').click();
        });

        $('[name=upload]').click(function(){
            $(this).parent().submit();
        });
    },
    isValid:function(){
        var ret=true;
        $('form').children('input').each(function(k,v){
            if($(v).val().trim().length==0){
                ret=false;
            }
        });
        return ret;
    },
    testData:{
        max: 46,
        data: [{
            lat: 33.5363, 
            lng:-117.044, 
            count: 1
        },{
            lat: 33.5608, 
            lng:-117.24, 
            count: 1
        },{
            lat: 38, 
            lng:-97, 
            count: 4
        },{
            lat: 38.9358, 
            lng:-77.1621, 
            count: 3
        },{
            lat: 38, 
            lng:-97, 
            count: 2.4
        },{
            lat: 54, 
            lng:-2, 
            count: 1.9
        },{
            lat: 51.5167, 
            lng:-0.7, 
            count: 2
        },{
            lat: 51.5167, 
            lng:-0.7, 
            count: 6
        },{
            lat: 60.3911, 
            lng:5.3247, 
            count: 1
        },{
            lat: 50.8333, 
            lng:12.9167, 
            count: 9
        },{
            lat: 50.8333, 
            lng:12.9167, 
            count: 1
        },{
            lat: 52.0833, 
            lng:4.3, 
            count: 3
        },{
            lat: 52.0833, 
            lng:4.3, 
            count: 1
        },{
            lat: 51.8, 
            lng:4.4667, 
            count: 16
        },{
            lat: 51.8, 
            lng:4.4667, 
            count: 9
        },{
            lat: 51.8, 
            lng:4.4667, 
            count: 2
        },{
            lat: 51.1, 
            lng:6.95, 
            count: 1
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 1
        },{
            lat: 18.975, 
            lng:72.8258, 
            count: 1
        },{
            lat: 2.5, 
            lng:112.5, 
            count: 2
        },{
            lat: 25.0389, 
            lng:102.718, 
            count: 1
        },{
            lat: -27.6167, 
            lng:152.733, 
            count: 1
        },{
            lat: -33.7667, 
            lng:150.833, 
            count: 1
        },{
            lat: -33.8833, 
            lng:151.217, 
            count: 2
        },{
            lat: 9.4333, 
            lng:99.9667, 
            count: 1
        },{
            lat: 33.7, 
            lng:73.1667, 
            count: 1
        },{
            lat: 33.7, 
            lng:73.1667, 
            count: 2
        },{
            lat: 22.3333, 
            lng:114.2, 
            count: 1
        },{
            lat: 37.4382, 
            lng:-84.051, 
            count: 1
        },{
            lat: 34.6667, 
            lng:135.5, 
            count: 1
        },{
            lat: 37.9167, 
            lng:139.05, 
            count: 1
        },{
            lat: 36.3214, 
            lng:127.42, 
            count: 1
        },{
            lat: -33.8, 
            lng:151.283, 
            count: 2
        },{
            lat: -33.8667, 
            lng:151.225, 
            count: 1
        },{
            lat: -37.65, 
            lng:144.933, 
            count: 2
        },{
            lat: -37.7333, 
            lng:145.267, 
            count: 1
        },{
            lat: -34.95, 
            lng:138.6, 
            count: 1
        },{
            lat: -27.5, 
            lng:153.017, 
            count: 1
        },{
            lat: -27.5833, 
            lng:152.867, 
            count: 3
        },{
            lat: -35.2833, 
            lng:138.55, 
            count: 1
        },{
            lat: 13.4443, 
            lng:144.786, 
            count: 2
        },{
            lat: -37.8833, 
            lng:145.167, 
            count: 1
        },{
            lat: -37.86, 
            lng:144.972, 
            count: 1
        },{
            lat: -27.5, 
            lng:153.05, 
            count: 1
        },{
            lat: 35.685, 
            lng:139.751, 
            count: 2
        },{
            lat: -34.4333, 
            lng:150.883, 
            count: 2
        },{
            lat: 14.0167, 
            lng:100.733, 
            count: 2
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 5
        },{
            lat: -31.9333, 
            lng:115.833, 
            count: 1
        },{
            lat: -33.8167, 
            lng:151.167, 
            count: 1
        },{
            lat: -37.9667, 
            lng:145.117, 
            count: 1
        },{
            lat: -37.8333, 
            lng:145.033, 
            count: 1
        },{
            lat: -37.6417, 
            lng:176.186, 
            count: 2
        },{
            lat: -37.6861, 
            lng:176.167, 
            count: 1
        },{
            lat: -41.2167, 
            lng:174.917, 
            count: 1
        },{
            lat: 39.0521, 
            lng:-77.015, 
            count: 3
        },{
            lat: 24.8667, 
            lng:67.05, 
            count: 1
        },{
            lat: 24.9869, 
            lng:121.306, 
            count: 1
        },{
            lat: 53.2, 
            lng:-105.75, 
            count: 4
        },{
            lat: 44.65, 
            lng:-63.6, 
            count: 1
        },{
            lat: 53.9667, 
            lng:-1.0833, 
            count: 1
        },{
            lat: 40.7, 
            lng:14.9833, 
            count: 1
        },{
            lat: 37.5331, 
            lng:-122.247, 
            count: 1
        },{
            lat: 39.6597, 
            lng:-86.8663, 
            count: 2
        },{
            lat: 33.0247, 
            lng:-83.2296, 
            count: 1
        },{
            lat: 34.2038, 
            lng:-80.9955, 
            count: 1
        },{
            lat: 28.0087, 
            lng:-82.7454, 
            count: 1
        },{
            lat: 44.6741, 
            lng:-93.4103, 
            count: 1
        },{
            lat: 31.4507, 
            lng:-97.1909, 
            count: 1
        },{
            lat: 45.61, 
            lng:-73.84, 
            count: 1
        },{
            lat: 49.25, 
            lng:-122.95, 
            count: 1
        },{
            lat: 49.9, 
            lng:-119.483, 
            count: 2
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 6
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 7
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 4
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 41
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 11
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 3
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 10
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 5
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 14
        },{
            lat: 41.4201, 
            lng:-75.6485, 
            count: 4
        },{
            lat: 31.1999, 
            lng:-92.3508, 
            count: 1
        },{
            lat: 41.9874, 
            lng:-91.6838, 
            count: 1
        },{
            lat: 30.1955, 
            lng:-85.6377, 
            count: 1
        },{
            lat: 42.4266, 
            lng:-92.358, 
            count: 1
        },{
            lat: 41.6559, 
            lng:-91.5228, 
            count: 1
        },{
            lat: 33.9269, 
            lng:-117.861, 
            count: 3
        },{
            lat: 41.8825, 
            lng:-87.6441, 
            count: 6
        },{
            lat: 42.3998, 
            lng:-88.8271, 
            count: 1
        },{
            lat: 33.1464, 
            lng:-97.0902, 
            count: 1
        },{
            lat: 47.2432, 
            lng:-93.5119, 
            count: 1
        },{
            lat: 41.6472, 
            lng:-93.46, 
            count: 1
        },{
            lat: 36.1213, 
            lng:-76.6414, 
            count: 1
        },{
            lat: 41.649, 
            lng:-93.6275, 
            count: 1
        },{
            lat: 44.8547, 
            lng:-93.7854, 
            count: 1
        },{
            lat: 43.6833, 
            lng:-79.7667, 
            count: 1
        },{
            lat: 40.6955, 
            lng:-89.4293, 
            count: 1
        },{
            lat: 37.6211, 
            lng:-77.6515, 
            count: 1
        },{
            lat: 37.6273, 
            lng:-77.5437, 
            count: 3
        },{
            lat: 33.9457, 
            lng:-118.039, 
            count: 1
        },{
            lat: 33.8408, 
            lng:-118.079, 
            count: 1
        },{
            lat: 40.3933, 
            lng:-74.7855, 
            count: 1
        },{
            lat: 40.9233, 
            lng:-73.9984, 
            count: 1
        },{
            lat: 39.0735, 
            lng:-76.5654, 
            count: 1
        },{
            lat: 40.5966, 
            lng:-74.0775, 
            count: 1
        },{
            lat: 40.2944, 
            lng:-73.9932, 
            count: 2
        },{
            lat: 38.9827, 
            lng:-77.004, 
            count: 1
        },{
            lat: 38.3633, 
            lng:-81.8089, 
            count: 1
        },{
            lat: 36.0755, 
            lng:-79.0741, 
            count: 1
        },{
            lat: 51.0833, 
            lng:-114.083, 
            count: 2
        },{
            lat: 49.1364, 
            lng:-122.821, 
            count: 1
        },{
            lat: 39.425, 
            lng:-84.4982, 
            count: 3
        },{
            lat: 38.7915, 
            lng:-82.9217, 
            count: 1
        },{
            lat: 39.0131, 
            lng:-84.2049, 
            count: 1
        },{
            lat: 29.7523, 
            lng:-95.367, 
            count: 7
        },{
            lat: 29.7523, 
            lng:-95.367, 
            count: 4
        },{
            lat: 41.5171, 
            lng:-71.2789, 
            count: 1
        },{
            lat: 29.7523, 
            lng:-95.367, 
            count: 2
        },{
            lat: 32.8148, 
            lng:-96.8705, 
            count: 1
        },{
            lat: 45.5, 
            lng:-73.5833, 
            count: 1
        },{
            lat: 40.7529, 
            lng:-73.9761, 
            count: 6
        },{
            lat: 33.6534, 
            lng:-112.246, 
            count: 1
        },{
            lat: 40.7421, 
            lng:-74.0018, 
            count: 1
        },{
            lat: 38.3928, 
            lng:-121.368, 
            count: 1
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 1
        },{
            lat: 39.7968, 
            lng:-76.993, 
            count: 2
        },{
            lat: 40.5607, 
            lng:-111.724, 
            count: 1
        },{
            lat: 41.2863, 
            lng:-75.8953, 
            count: 1
        },{
            lat: 26.3484, 
            lng:-80.2187, 
            count: 1
        },{
            lat: 32.711, 
            lng:-117.053, 
            count: 2
        },{
            lat: 32.5814, 
            lng:-83.6286, 
            count: 3
        },{
            lat: 35.0508, 
            lng:-80.8186, 
            count: 3
        },{
            lat: 35.0508, 
            lng:-80.8186, 
            count: 1
        },{
            lat: -22.2667, 
            lng:166.45, 
            count: 5
        },{
            lat: 50.1167, 
            lng:8.6833, 
            count: 1
        },{
            lat: 51.9167, 
            lng:4.5, 
            count: 2
        },{
            lat: 54, 
            lng:-2, 
            count: 6
        },{
            lat: 52.25, 
            lng:21, 
            count: 1
        },{
            lat: 49.1, 
            lng:10.75, 
            count: 3
        },{
            lat: 51.65, 
            lng:6.1833, 
            count: 1
        },{
            lat: 1.3667, 
            lng:103.8, 
            count: 1
        },{
            lat: 29.4889, 
            lng:-98.3987, 
            count: 11
        },{
            lat: 29.3884, 
            lng:-98.5311, 
            count: 1
        },{
            lat: 41.8825, 
            lng:-87.6441, 
            count: 2
        },{
            lat: 41.8825, 
            lng:-87.6441, 
            count: 1
        },{
            lat: 33.9203, 
            lng:-84.618, 
            count: 4
        },{
            lat: 40.1242, 
            lng:-82.3828, 
            count: 1
        },{
            lat: 40.1241, 
            lng:-82.3828, 
            count: 1
        },{
            lat: 43.0434, 
            lng:-87.8945, 
            count: 1
        },{
            lat: 43.7371, 
            lng:-74.3419, 
            count: 1
        },{
            lat: 42.3626, 
            lng:-71.0843, 
            count: 1
        },{
            lat: 4.6, 
            lng:-74.0833, 
            count: 1
        },{
            lat: 19.7, 
            lng:-101.117, 
            count: 1
        },{
            lat: 25.6667, 
            lng:-100.317, 
            count: 1
        },{
            lat: 53.8167, 
            lng:10.3833, 
            count: 1
        },{
            lat: 50.8667, 
            lng:6.8667, 
            count: 3
        },{
            lat: 55.7167, 
            lng:12.45, 
            count: 2
        },{
            lat: 44.4333, 
            lng:26.1, 
            count: 4
        },{
            lat: 50.1167, 
            lng:8.6833, 
            count: 2
        },{
            lat: 52.5, 
            lng:5.75, 
            count: 4
        },{
            lat: 48.8833, 
            lng:8.7, 
            count: 1
        },{
            lat: 17.05, 
            lng:-96.7167, 
            count: 3
        },{
            lat: 23, 
            lng:-102, 
            count: 1
        },{
            lat: 20.6167, 
            lng:-105.25, 
            count: 1
        },{
            lat: 23, 
            lng:-102, 
            count: 2
        },{
            lat: 20.6667, 
            lng:-103.333, 
            count: 1
        },{
            lat: 21.1167, 
            lng:-101.667, 
            count: 1
        },{
            lat: 17.9833, 
            lng:-92.9167, 
            count: 1
        },{
            lat: 20.9667, 
            lng:-89.6167, 
            count: 2
        },{
            lat: 21.1667, 
            lng:-86.8333, 
            count: 1
        },{
            lat: 17.9833, 
            lng:-94.5167, 
            count: 1
        },{
            lat: 18.6, 
            lng:-98.85, 
            count: 1
        },{
            lat: 16.75, 
            lng:-93.1167, 
            count: 1
        },{
            lat: 19.4342, 
            lng:-99.1386, 
            count: 1
        },{
            lat: -10, 
            lng:-55, 
            count: 1
        },{
            lat: -22.9, 
            lng:-43.2333, 
            count: 1
        },{
            lat: 15.7833, 
            lng:-86.8, 
            count: 1
        },{
            lat: 10.4667, 
            lng:-64.1667, 
            count: 1
        },{
            lat: 7.1297, 
            lng:-73.1258, 
            count: 1
        },{
            lat: 4, 
            lng:-72, 
            count: 2
        },{
            lat: 4, 
            lng:-72, 
            count: 1
        },{
            lat: 6.8, 
            lng:-58.1667, 
            count: 1
        },{
            lat: 0, 
            lng:0, 
            count: 1
        },{
            lat: 48.15, 
            lng:11.5833, 
            count: 2
        },{
            lat: 45.8, 
            lng:16, 
            count: 15
        },{
            lat: 59.9167, 
            lng:10.75, 
            count: 1
        },{
            lat: 51.5002, 
            lng:-0.1262, 
            count: 1
        },{
            lat: 55, 
            lng:73.4, 
            count: 1
        },{
            lat: 52.5, 
            lng:5.75, 
            count: 1
        },{
            lat: 52.2, 
            lng:0.1167, 
            count: 1
        },{
            lat: 48.8833, 
            lng:8.3333, 
            count: 1
        },{
            lat: -33.9167, 
            lng:18.4167, 
            count: 1
        },{
            lat: 40.9157, 
            lng:-81.133, 
            count: 2
        },{
            lat: 43.8667, 
            lng:-79.4333, 
            count: 1
        },{
            lat: 54, 
            lng:-2, 
            count: 2
        },{
            lat: 39, 
            lng:22, 
            count: 1
        },{
            lat: 54, 
            lng:-2, 
            count: 11
        },{
            lat: 54, 
            lng:-2, 
            count: 4
        },{
            lat: 54, 
            lng:-2, 
            count: 3
        },{
            lat: 9.0833, 
            lng:-79.3833, 
            count: 2
        },{
            lat: 21.5, 
            lng:-104.9, 
            count: 1
        },{
            lat: 19.5333, 
            lng:-96.9167, 
            count: 1
        },{
            lat: 32.5333, 
            lng:-117.017, 
            count: 1
        },{
            lat: 19.4342, 
            lng:-99.1386, 
            count: 3
        },{
            lat: 18.15, 
            lng:-94.4167, 
            count: 1
        },{
            lat: 20.7167, 
            lng:-103.4, 
            count: 1
        },{
            lat: 23.2167, 
            lng:-106.417, 
            count: 2
        },{
            lat: 10.9639, 
            lng:-74.7964, 
            count: 1
        },{
            lat: 24.8667, 
            lng:67.05, 
            count: 2
        },{
            lat: 1.2931, 
            lng:103.856, 
            count: 1
        },{
            lat: -41, 
            lng:174, 
            count: 1
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 2
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 46
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 9
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 8
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 7
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 16
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 4
        },{
            lat: 13.75, 
            lng:100.517, 
            count: 6
        },{
            lat: 55.75, 
            lng:-97.8667, 
            count: 5
        },{
            lat: 34.0438, 
            lng:-118.251, 
            count: 2
        },{
            lat: 44.2997, 
            lng:-70.3698, 
            count: 1
        },{
            lat: 46.9402, 
            lng:-113.85, 
            count: 14
        },{
            lat: 45.6167, 
            lng:-61.9667, 
            count: 1
        },{
            lat: 45.3833, 
            lng:-66, 
            count: 2
        },{
            lat: 54.9167, 
            lng:-98.6333, 
            count: 1
        },{
            lat: 40.8393, 
            lng:-73.2797, 
            count: 1
        },{
            lat: 41.6929, 
            lng:-111.815, 
            count: 1
        },{
            lat: 49.8833, 
            lng:-97.1667, 
            count: 1
        },{
            lat: 32.5576, 
            lng:-81.9395, 
            count: 1
        },{
            lat: 49.9667, 
            lng:-98.3, 
            count: 2
        },{
            lat: 40.0842, 
            lng:-82.9378, 
            count: 2
        },{
            lat: 49.25, 
            lng:-123.133, 
            count: 5
        },{
            lat: 35.2268, 
            lng:-78.9561, 
            count: 1
        },{
            lat: 43.9817, 
            lng:-121.272, 
            count: 1
        },{
            lat: 43.9647, 
            lng:-121.341, 
            count: 1
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 13
        },{
            lat: 33.4357, 
            lng:-111.917, 
            count: 2
        },{
            lat: 36.0707, 
            lng:-97.9077, 
            count: 1
        },{
            lat: 32.7791, 
            lng:-96.8028, 
            count: 1
        },{
            lat: 34.053, 
            lng:-118.264, 
            count: 1
        },{
            lat: 30.726, 
            lng:-95.55, 
            count: 1
        },{
            lat: 45.4508, 
            lng:-93.5855, 
            count: 1
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 8
        },{
            lat: 36.8463, 
            lng:-76.0979, 
            count: 3
        },{
            lat: 36.8463, 
            lng:-76.0979, 
            count: 1
        },{
            lat: 34.0533, 
            lng:-118.255, 
            count: 1
        },{
            lat: 35.7217, 
            lng:-81.3603, 
            count: 1
        },{
            lat: 40.6888, 
            lng:-74.0203, 
            count: 4
        },{
            lat: 47.5036, 
            lng:-94.685, 
            count: 2
        },{
            lat: 32.3304, 
            lng:-81.6011, 
            count: 1
        },{
            lat: 39.0165, 
            lng:-77.5062, 
            count: 2
        },{
            lat: 38.6312, 
            lng:-90.1922, 
            count: 1
        },{
            lat: 32.445, 
            lng:-81.7758, 
            count: 1
        },{
            lat: -37.9667, 
            lng:145.15, 
            count: 1
        },{
            lat: -33.9833, 
            lng:151.117, 
            count: 1
        },{
            lat: 49.6769, 
            lng:6.1239, 
            count: 2
        },{
            lat: 53.8167, 
            lng:-1.2167, 
            count: 1
        },{
            lat: 52.4667, 
            lng:-1.9167, 
            count: 3
        },{
            lat: 52.5, 
            lng:5.75, 
            count: 2
        },{
            lat: 33.5717, 
            lng:-117.729, 
            count: 4
        },{
            lat: 31.5551, 
            lng:-97.1604, 
            count: 1
        },{
            lat: 42.2865, 
            lng:-71.7147, 
            count: 1
        },{
            lat: 48.4, 
            lng:-89.2333, 
            count: 1
        },{
            lat: 42.9864, 
            lng:-78.7279, 
            count: 1
        },{
            lat: 41.8471, 
            lng:-87.6248, 
            count: 1
        },{
            lat: 34.5139, 
            lng:-114.293, 
            count: 1
        },{
            lat: 51.9167, 
            lng:4.4, 
            count: 1
        },{
            lat: 51.9167, 
            lng:4.4, 
            count: 4
        },{
            lat: 51.55, 
            lng:5.1167, 
            count: 38
        },{
            lat: 51.8, 
            lng:4.4667, 
            count: 8
        },{
            lat: 54.5, 
            lng:-3.6167, 
            count: 1
        },{
            lat: -34.9333, 
            lng:138.6, 
            count: 1
        },{
            lat: -33.95, 
            lng:151.133, 
            count: 1
        },{
            lat: 15, 
            lng:100, 
            count: 4
        },{
            lat: 15, 
            lng:100, 
            count: 1
        },{
            lat: 15, 
            lng:100, 
            count: 3
        },{
            lat: 15, 
            lng:100, 
            count: 2
        },{
            lat: 41.5381, 
            lng:-87.6842, 
            count: 1
        },{
            lat: 40.9588, 
            lng:-75.3006, 
            count: 1
        },{
            lat: 46.7921, 
            lng:-96.8827, 
            count: 1
        },{
            lat: 41.9474, 
            lng:-87.7037, 
            count: 1
        },{
            lat: 41.6162, 
            lng:-87.0489, 
            count: 1
        },{
            lat: 37.5023, 
            lng:-77.5693, 
            count: 1
        },{
            lat: 38.4336, 
            lng:-77.3887, 
            count: 1
        },{
            lat: 41.759, 
            lng:-88.2615, 
            count: 1
        },{
            lat: 42.0158, 
            lng:-87.8423, 
            count: 1
        },{
            lat: 46.5833, 
            lng:-81.2, 
            count: 1
        },{
            lat: 45.3667, 
            lng:-63.3, 
            count: 1
        },{
            lat: 18.0239, 
            lng:-66.6366, 
            count: 2
        },{
            lat: 43.2667, 
            lng:-79.9333, 
            count: 1
        },{
            lat: 45.0667, 
            lng:-64.5, 
            count: 1
        },{
            lat: 39.6351, 
            lng:-78.7665, 
            count: 1
        },{
            lat: 33.4483, 
            lng:-81.6921, 
            count: 2
        },{
            lat: 41.5583, 
            lng:-87.6612, 
            count: 1
        },{
            lat: 30.5315, 
            lng:-90.4628, 
            count: 1
        },{
            lat: 34.7664, 
            lng:-82.2202, 
            count: 2
        },{
            lat: 47.6779, 
            lng:-117.379, 
            count: 2
        },{
            lat: 47.6201, 
            lng:-122.141, 
            count: 1
        },{
            lat: 45.0901, 
            lng:-87.7101, 
            count: 1
        },{
            lat: 38.3119, 
            lng:-90.1535, 
            count: 3
        },{
            lat: 34.7681, 
            lng:-84.9569, 
            count: 4
        },{
            lat: 47.4061, 
            lng:-121.995, 
            count: 1
        },{
            lat: 40.6009, 
            lng:-73.9397, 
            count: 1
        },{
            lat: 40.6278, 
            lng:-73.365, 
            count: 1
        },{
            lat: 40.61, 
            lng:-73.9108, 
            count: 1
        },{
            lat: 34.3776, 
            lng:-83.7605, 
            count: 2
        },{
            lat: 38.7031, 
            lng:-94.4737, 
            count: 1
        },{
            lat: 39.3031, 
            lng:-82.0828, 
            count: 1
        },{
            lat: 42.5746, 
            lng:-88.3946, 
            count: 1
        },{
            lat: 45.4804, 
            lng:-122.836, 
            count: 1
        },{
            lat: 44.5577, 
            lng:-123.298, 
            count: 1
        },{
            lat: 40.1574, 
            lng:-76.7978, 
            count: 1
        },{
            lat: 34.8983, 
            lng:-120.382, 
            count: 1
        },{
            lat: 40.018, 
            lng:-89.8623, 
            count: 1
        },{
            lat: 37.3637, 
            lng:-79.9549, 
            count: 1
        },{
            lat: 37.2141, 
            lng:-80.0625, 
            count: 1
        },{
            lat: 37.2655, 
            lng:-79.923, 
            count: 1
        },{
            lat: 39.0613, 
            lng:-95.7293, 
            count: 1
        },{
            lat: 41.2314, 
            lng:-80.7567, 
            count: 1
        },{
            lat: 40.3377, 
            lng:-79.8428, 
            count: 1
        },{
            lat: 42.0796, 
            lng:-71.0382, 
            count: 1
        },{
            lat: 43.25, 
            lng:-79.8333, 
            count: 1
        },{
            lat: 40.7948, 
            lng:-72.8797, 
            count: 2
        },{
            lat: 40.6766, 
            lng:-73.7038, 
            count: 4
        },{
            lat: 37.979, 
            lng:-121.788, 
            count: 1
        },{
            lat: 43.1669, 
            lng:-76.0558, 
            count: 1
        },{
            lat: 37.5353, 
            lng:-121.979, 
            count: 1
        },{
            lat: 43.2345, 
            lng:-71.5227, 
            count: 1
        },{
            lat: 42.6179, 
            lng:-70.7154, 
            count: 3
        },{
            lat: 42.0765, 
            lng:-71.472, 
            count: 2
        },{
            lat: 35.2298, 
            lng:-81.2428, 
            count: 1
        },{
            lat: 39.961, 
            lng:-104.817, 
            count: 1
        },{
            lat: 44.6667, 
            lng:-63.5667, 
            count: 1
        },{
            lat: 38.4473, 
            lng:-104.632, 
            count: 3
        },{
            lat: 40.7148, 
            lng:-73.7939, 
            count: 1
        },{
            lat: 40.6763, 
            lng:-73.7752, 
            count: 1
        },{
            lat: 41.3846, 
            lng:-73.0943, 
            count: 2
        },{
            lat: 43.1871, 
            lng:-70.91, 
            count: 1
        },{
            lat: 33.3758, 
            lng:-84.4657, 
            count: 1
        },{
            lat: 15, 
            lng:100, 
            count: 12
        },{
            lat: 36.8924, 
            lng:-80.076, 
            count: 2
        },{
            lat: 25, 
            lng:17, 
            count: 1
        },{
            lat: 27, 
            lng:30, 
            count: 1
        },{
            lat: 49.1, 
            lng:10.75, 
            count: 2
        },{
            lat: 49.1, 
            lng:10.75, 
            count: 4
        },{
            lat: 47.6727, 
            lng:-122.187, 
            count: 1
        },{
            lat: -27.6167, 
            lng:152.767, 
            count: 1
        },{
            lat: -33.8833, 
            lng:151.217, 
            count: 1
        },{
            lat: 31.5497, 
            lng:74.3436, 
            count: 4
        },{
            lat: 13.65, 
            lng:100.267, 
            count: 2
        },{
            lat: -37.8167, 
            lng:144.967, 
            count: 1
        },{
            lat: 47.85, 
            lng:12.1333, 
            count: 3
        },{
            lat: 47, 
            lng:8, 
            count: 3
        },{
            lat: 52.1667, 
            lng:10.55, 
            count: 1
        },{
            lat: 50.8667, 
            lng:6.8667, 
            count: 2
        },{
            lat: 40.8333, 
            lng:14.25, 
            count: 2
        },{
            lat: 47.5304, 
            lng:-122.008, 
            count: 1
        },{
            lat: 47.5304, 
            lng:-122.008, 
            count: 3
        },{
            lat: 34.0119, 
            lng:-118.468, 
            count: 1
        },{
            lat: 38.9734, 
            lng:-119.908, 
            count: 1
        },{
            lat: 52.1333, 
            lng:-106.667, 
            count: 1
        },{
            lat: 41.4201, 
            lng:-75.6485, 
            count: 3
        },{
            lat: 45.6393, 
            lng:-94.2237, 
            count: 1
        },{
            lat: 33.7516, 
            lng:-84.3915, 
            count: 1
        },{
            lat: 26.0098, 
            lng:-80.2592, 
            count: 1
        },{
            lat: 34.5714, 
            lng:-78.7566, 
            count: 1
        },{
            lat: 40.7235, 
            lng:-73.8612, 
            count: 1
        },{
            lat: 39.1637, 
            lng:-94.5215, 
            count: 5
        },{
            lat: 28.0573, 
            lng:-81.5687, 
            count: 2
        },{
            lat: 26.8498, 
            lng:-80.14, 
            count: 1
        },{
            lat: 47.6027, 
            lng:-122.156, 
            count: 11
        },{
            lat: 47.6027, 
            lng:-122.156, 
            count: 1
        },{
            lat: 25.7541, 
            lng:-80.271, 
            count: 1
        },{
            lat: 32.7597, 
            lng:-97.147, 
            count: 1
        },{
            lat: 40.9083, 
            lng:-73.8346, 
            count: 2
        },{
            lat: 47.6573, 
            lng:-111.381, 
            count: 1
        },{
            lat: 32.3729, 
            lng:-81.8443, 
            count: 1
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 2
        },{
            lat: 41.5074, 
            lng:-81.6053, 
            count: 1
        },{
            lat: 32.4954, 
            lng:-86.5, 
            count: 1
        },{
            lat: 30.3043, 
            lng:-81.7306, 
            count: 1
        },{
            lat: 45.9667, 
            lng:-81.9333, 
            count: 1
        },{
            lat: 42.2903, 
            lng:-72.6404, 
            count: 5
        },{
            lat: 40.7553, 
            lng:-73.9924, 
            count: 1
        },{
            lat: 55.1667, 
            lng:-118.8, 
            count: 1
        },{
            lat: 37.8113, 
            lng:-122.301, 
            count: 1
        },{
            lat: 40.2968, 
            lng:-111.676, 
            count: 1
        },{
            lat: 42.0643, 
            lng:-87.9921, 
            count: 1
        },{
            lat: 42.3908, 
            lng:-71.0925, 
            count: 1
        },{
            lat: 44.2935, 
            lng:-94.7601, 
            count: 1
        },{
            lat: 40.4619, 
            lng:-74.3561, 
            count: 2
        },{
            lat: 32.738, 
            lng:-96.4463, 
            count: 1
        },{
            lat: 35.7821, 
            lng:-78.8177, 
            count: 1
        },{
            lat: 40.7449, 
            lng:-73.9782, 
            count: 1
        },{
            lat: 40.7449, 
            lng:-73.9782, 
            count: 2
        },{
            lat: 28.5445, 
            lng:-81.3706, 
            count: 1
        },{
            lat: 41.4201, 
            lng:-75.6485, 
            count: 1
        },{
            lat: 38.6075, 
            lng:-83.7928, 
            count: 1
        },{
            lat: 42.2061, 
            lng:-83.206, 
            count: 1
        },{
            lat: 42.3222, 
            lng:-88.4671, 
            count: 1
        },{
            lat: 42.3222, 
            lng:-88.4671, 
            count: 3
        },{
            lat: 37.7035, 
            lng:-122.148, 
            count: 1
        },{
            lat: 37.5147, 
            lng:-122.042, 
            count: 1
        },{
            lat: 40.6053, 
            lng:-111.988, 
            count: 1
        },{
            lat: 38.5145, 
            lng:-81.7814, 
            count: 1
        },{
            lat: 42.1287, 
            lng:-88.2654, 
            count: 1
        },{
            lat: 36.9127, 
            lng:-120.196, 
            count: 1
        },{
            lat: 36.3769, 
            lng:-119.184, 
            count: 1
        },{
            lat: 36.84, 
            lng:-119.828, 
            count: 1
        },{
            lat: 48.0585, 
            lng:-122.148, 
            count: 1
        },{
            lat: 42.1197, 
            lng:-87.8445, 
            count: 1
        },{
            lat: 40.7002, 
            lng:-111.943, 
            count: 2
        },{
            lat: 37.5488, 
            lng:-122.312, 
            count: 1
        },{
            lat: 41.3807, 
            lng:-73.3915, 
            count: 1
        },{
            lat: 45.5, 
            lng:-73.5833, 
            count: 3
        },{
            lat: 34.0115, 
            lng:-117.854, 
            count: 3
        },{
            lat: 43.0738, 
            lng:-83.8608, 
            count: 11
        },{
            lat: 33.9944, 
            lng:-118.464, 
            count: 3
        },{
            lat: 42.7257, 
            lng:-84.636, 
            count: 1
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 22
        },{
            lat: 40.7805, 
            lng:-73.9512, 
            count: 1
        },{
            lat: 42.1794, 
            lng:-75.9491, 
            count: 1
        },{
            lat: 43.3453, 
            lng:-75.1285, 
            count: 1
        },{
            lat: 42.195, 
            lng:-83.165, 
            count: 1
        },{
            lat: 33.9289, 
            lng:-116.488, 
            count: 5
        },{
            lat: 29.4717, 
            lng:-98.514, 
            count: 1
        },{
            lat: 28.6653, 
            lng:-81.4188, 
            count: 1
        },{
            lat: 40.8217, 
            lng:-74.1574, 
            count: 1
        },{
            lat: 41.2094, 
            lng:-73.2116, 
            count: 2
        },{
            lat: 41.0917, 
            lng:-73.4316, 
            count: 1
        },{
            lat: 30.4564, 
            lng:-97.6938, 
            count: 1
        },{
            lat: 36.1352, 
            lng:-95.9364, 
            count: 1
        },{
            lat: 33.3202, 
            lng:-111.761, 
            count: 1
        },{
            lat: 38.9841, 
            lng:-77.3827, 
            count: 1
        },{
            lat: 29.1654, 
            lng:-82.0967, 
            count: 1
        },{
            lat: 37.691, 
            lng:-97.3292, 
            count: 1
        },{
            lat: 33.5222, 
            lng:-112.084, 
            count: 1
        },{
            lat: 41.9701, 
            lng:-71.7217, 
            count: 1
        },{
            lat: 35.6165, 
            lng:-97.4789, 
            count: 3
        },{
            lat: 35.4715, 
            lng:-97.519, 
            count: 1
        },{
            lat: 41.2307, 
            lng:-96.1178, 
            count: 1
        },{
            lat: 53.55, 
            lng:-113.5, 
            count: 2
        },{
            lat: 36.0844, 
            lng:-79.8209, 
            count: 1
        },{
            lat: 40.5865, 
            lng:-74.1497, 
            count: 1
        },{
            lat: 41.9389, 
            lng:-73.9901, 
            count: 1
        },{
            lat: 40.8596, 
            lng:-73.9314, 
            count: 1
        },{
            lat: 33.6119, 
            lng:-111.891, 
            count: 2
        },{
            lat: 38.8021, 
            lng:-90.627, 
            count: 1
        },{
            lat: 38.8289, 
            lng:-91.9744, 
            count: 1
        },{
            lat: 42.8526, 
            lng:-86.1263, 
            count: 2
        },{
            lat: 40.781, 
            lng:-73.2522, 
            count: 1
        },{
            lat: 41.1181, 
            lng:-74.0833, 
            count: 2
        },{
            lat: 40.8533, 
            lng:-74.6522, 
            count: 2
        },{
            lat: 41.3246, 
            lng:-73.6976, 
            count: 1
        },{
            lat: 40.9796, 
            lng:-73.7231, 
            count: 1
        },{
            lat: 28.4517, 
            lng:-81.4653, 
            count: 1
        },{
            lat: 36.0328, 
            lng:-115.025, 
            count: 2
        },{
            lat: 32.5814, 
            lng:-83.6286, 
            count: 1
        },{
            lat: 33.6117, 
            lng:-117.549, 
            count: 1
        },{
            lat: 40.4619, 
            lng:-74.3561, 
            count: 4
        },{
            lat: 40.4619, 
            lng:-74.3561, 
            count: 1
        },{
            lat: 44.1747, 
            lng:-94.0492, 
            count: 3
        },{
            lat: 43.0522, 
            lng:-87.965, 
            count: 1
        },{
            lat: 40.0688, 
            lng:-74.5956, 
            count: 2
        },{
            lat: 33.6053, 
            lng:-117.717, 
            count: 1
        },{
            lat: 39.95, 
            lng:-74.9929, 
            count: 1
        },{
            lat: 38.678, 
            lng:-77.3197, 
            count: 2
        },{
            lat: 34.9184, 
            lng:-92.1362, 
            count: 2
        },{
            lat: 35.9298, 
            lng:-86.4605, 
            count: 1
        },{
            lat: 35.8896, 
            lng:-86.3166, 
            count: 1
        },{
            lat: 39.1252, 
            lng:-76.5116, 
            count: 1
        },{
            lat: 26.976, 
            lng:-82.1391, 
            count: 1
        },{
            lat: 34.5022, 
            lng:-120.129, 
            count: 1
        },{
            lat: 39.9571, 
            lng:-76.7055, 
            count: 2
        },{
            lat: 34.7018, 
            lng:-86.6108, 
            count: 1
        },{
            lat: 54.1297, 
            lng:-108.435, 
            count: 1
        },{
            lat: 32.805, 
            lng:-116.902, 
            count: 1
        },{
            lat: 45.6, 
            lng:-73.7333, 
            count: 1
        },{
            lat: 32.8405, 
            lng:-116.88, 
            count: 1
        },{
            lat: 33.2007, 
            lng:-117.226, 
            count: 1
        },{
            lat: 40.1246, 
            lng:-75.5385, 
            count: 1
        },{
            lat: 40.2605, 
            lng:-75.6155, 
            count: 1
        },{
            lat: 40.7912, 
            lng:-77.8746, 
            count: 1
        },{
            lat: 40.168, 
            lng:-76.6094, 
            count: 1
        },{
            lat: 40.3039, 
            lng:-74.0703, 
            count: 2
        },{
            lat: 39.3914, 
            lng:-74.5182, 
            count: 1
        },{
            lat: 40.1442, 
            lng:-74.8483, 
            count: 1
        },{
            lat: 28.312, 
            lng:-81.589, 
            count: 1
        },{
            lat: 34.0416, 
            lng:-118.299, 
            count: 1
        },{
            lat: 50.45, 
            lng:-104.617, 
            count: 1
        },{
            lat: 41.2305, 
            lng:-73.1257, 
            count: 3
        },{
            lat: 40.6538, 
            lng:-73.6082, 
            count: 1
        },{
            lat: 40.9513, 
            lng:-73.8773, 
            count: 2
        },{
            lat: 41.078, 
            lng:-74.1764, 
            count: 1
        },{
            lat: 32.7492, 
            lng:-97.2205, 
            count: 1
        },{
            lat: 39.5407, 
            lng:-84.2212, 
            count: 1
        },{
            lat: 40.7136, 
            lng:-82.8012, 
            count: 3
        },{
            lat: 36.2652, 
            lng:-82.834, 
            count: 8
        },{
            lat: 40.2955, 
            lng:-75.3254, 
            count: 2
        },{
            lat: 29.7755, 
            lng:-95.4152, 
            count: 2
        },{
            lat: 32.7791, 
            lng:-96.8028, 
            count: 3
        },{
            lat: 32.7791, 
            lng:-96.8028, 
            count: 2
        },{
            lat: 36.4642, 
            lng:-87.3797, 
            count: 2
        },{
            lat: 41.6005, 
            lng:-72.8764, 
            count: 1
        },{
            lat: 35.708, 
            lng:-97.5749, 
            count: 1
        },{
            lat: 40.8399, 
            lng:-73.9422, 
            count: 1
        },{
            lat: 41.9223, 
            lng:-87.7555, 
            count: 1
        },{
            lat: 42.9156, 
            lng:-85.8464, 
            count: 1
        },{
            lat: 41.8824, 
            lng:-87.6376, 
            count: 1
        },{
            lat: 30.6586, 
            lng:-88.3535, 
            count: 1
        },{
            lat: 42.6619, 
            lng:-82.9211, 
            count: 1
        },{
            lat: 35.0481, 
            lng:-85.2833, 
            count: 1
        },{
            lat: 32.3938, 
            lng:-92.2329, 
            count: 1
        },{
            lat: 39.402, 
            lng:-76.6329, 
            count: 1
        },{
            lat: 39.9968, 
            lng:-75.1485, 
            count: 1
        },{
            lat: 38.8518, 
            lng:-94.7786, 
            count: 1
        },{
            lat: 33.4357, 
            lng:-111.917, 
            count: 1
        },{
            lat: 35.8278, 
            lng:-78.6421, 
            count: 2
        },{
            lat: 22.3167, 
            lng:114.183, 
            count: 12
        },{
            lat: 34.0438, 
            lng:-118.251, 
            count: 1
        },{
            lat: 41.724, 
            lng:-88.1127, 
            count: 1
        },{
            lat: 37.4429, 
            lng:-122.151, 
            count: 1
        },{
            lat: 51.25, 
            lng:-80.6, 
            count: 1
        },{
            lat: 39.209, 
            lng:-94.7305, 
            count: 1
        },{
            lat: 40.7214, 
            lng:-74.0052, 
            count: 1
        },{
            lat: 33.92, 
            lng:-117.208, 
            count: 1
        },{
            lat: 29.926, 
            lng:-97.5644, 
            count: 1
        },{
            lat: 30.4, 
            lng:-97.7528, 
            count: 1
        },{
            lat: 26.937, 
            lng:-80.135, 
            count: 1
        },{
            lat: 32.8345, 
            lng:-111.731, 
            count: 1
        },{
            lat: 29.6694, 
            lng:-82.3572, 
            count: 13
        },{
            lat: 36.2729, 
            lng:-115.133, 
            count: 1
        },{
            lat: 33.2819, 
            lng:-111.88, 
            count: 3
        },{
            lat: 32.5694, 
            lng:-117.016, 
            count: 1
        },{
            lat: 38.8381, 
            lng:-77.2121, 
            count: 1
        },{
            lat: 41.6856, 
            lng:-72.7312, 
            count: 1
        },{
            lat: 33.2581, 
            lng:-116.982, 
            count: 1
        },{
            lat: 38.6385, 
            lng:-90.3026, 
            count: 1
        },{
            lat: 43.15, 
            lng:-79.5, 
            count: 2
        },{
            lat: 43.85, 
            lng:-79.0167, 
            count: 1
        },{
            lat: 44.8833, 
            lng:-76.2333, 
            count: 1
        },{
            lat: 45.4833, 
            lng:-75.65, 
            count: 1
        },{
            lat: 53.2, 
            lng:-105.75, 
            count: 1
        },{
            lat: 51.0833, 
            lng:-114.083, 
            count: 1
        },{
            lat: 29.7523, 
            lng:-95.367, 
            count: 1
        },{
            lat: 38.692, 
            lng:-92.2929, 
            count: 1
        },{
            lat: 34.1362, 
            lng:-117.298, 
            count: 2
        },{
            lat: 28.2337, 
            lng:-82.179, 
            count: 1
        },{
            lat: 40.9521, 
            lng:-73.7382, 
            count: 1
        },{
            lat: 38.9186, 
            lng:-76.7862, 
            count: 2
        },{
            lat: 42.2647, 
            lng:-71.8089, 
            count: 1
        },{
            lat: 42.6706, 
            lng:-73.7791, 
            count: 1
        },{
            lat: 39.5925, 
            lng:-78.5901, 
            count: 1
        },{
            lat: 52.1333, 
            lng:-106.667, 
            count: 2
        },{
            lat: 40.2964, 
            lng:-75.2053, 
            count: 1
        },{
            lat: 34.1066, 
            lng:-117.815, 
            count: 1
        },{
            lat: 40.8294, 
            lng:-73.5052, 
            count: 1
        },{
            lat: 42.1298, 
            lng:-72.5687, 
            count: 1
        },{
            lat: 25.6615, 
            lng:-80.412, 
            count: 2
        },{
            lat: 37.8983, 
            lng:-122.049, 
            count: 1
        },{
            lat: 37.0101, 
            lng:-122.032, 
            count: 2
        },{
            lat: 40.2843, 
            lng:-76.8446, 
            count: 1
        },{
            lat: 39.4036, 
            lng:-104.56, 
            count: 1
        },{
            lat: 34.8397, 
            lng:-106.688, 
            count: 1
        },{
            lat: 40.1879, 
            lng:-75.4254, 
            count: 2
        },{
            lat: 35.0212, 
            lng:-85.2729, 
            count: 2
        },{
            lat: 40.214, 
            lng:-75.073, 
            count: 1
        },{
            lat: 39.9407, 
            lng:-75.2281, 
            count: 1
        },{
            lat: 47.2098, 
            lng:-122.409, 
            count: 1
        },{
            lat: 41.3433, 
            lng:-73.0654, 
            count: 2
        },{
            lat: 41.7814, 
            lng:-72.7544, 
            count: 1
        },{
            lat: 41.3094, 
            lng:-72.924, 
            count: 1
        },{
            lat: 45.3218, 
            lng:-122.523, 
            count: 1
        },{
            lat: 45.4104, 
            lng:-122.702, 
            count: 3
        },{
            lat: 45.6741, 
            lng:-122.471, 
            count: 2
        },{
            lat: 32.9342, 
            lng:-97.2515, 
            count: 1
        },{
            lat: 40.8775, 
            lng:-74.1105, 
            count: 1
        },{
            lat: 40.82, 
            lng:-96.6806, 
            count: 1
        },{
            lat: 45.5184, 
            lng:-122.655, 
            count: 1
        },{
            lat: 41.0544, 
            lng:-74.6171, 
            count: 1
        },{
            lat: 35.3874, 
            lng:-78.8686, 
            count: 1
        },{
            lat: 39.961, 
            lng:-85.9837, 
            count: 1
        },{
            lat: 34.0918, 
            lng:-84.2209, 
            count: 2
        },{
            lat: 39.1492, 
            lng:-78.278, 
            count: 1
        },{
            lat: 38.7257, 
            lng:-77.7982, 
            count: 1
        },{
            lat: 45.0059, 
            lng:-93.4305, 
            count: 1
        },{
            lat: 35.0748, 
            lng:-80.6774, 
            count: 1
        },{
            lat: 35.8059, 
            lng:-78.7997, 
            count: 1
        },{
            lat: 35.8572, 
            lng:-84.0177, 
            count: 1
        },{
            lat: 38.7665, 
            lng:-89.6533, 
            count: 1
        },{
            lat: 43.7098, 
            lng:-87.7478, 
            count: 2
        },{
            lat: 33.3961, 
            lng:-84.7821, 
            count: 1
        },{
            lat: 32.7881, 
            lng:-96.9431, 
            count: 1
        },{
            lat: 43.1946, 
            lng:-89.2025, 
            count: 1
        },{
            lat: 43.0745, 
            lng:-87.9078, 
            count: 1
        },{
            lat: 34.0817, 
            lng:-84.2553, 
            count: 1
        },{
            lat: 37.9689, 
            lng:-103.749, 
            count: 1
        },{
            lat: 31.7969, 
            lng:-106.387, 
            count: 1
        },{
            lat: 31.7435, 
            lng:-106.297, 
            count: 1
        },{
            lat: 29.6569, 
            lng:-98.5107, 
            count: 1
        },{
            lat: 28.4837, 
            lng:-82.5496, 
            count: 1
        },{
            lat: 29.1137, 
            lng:-81.0285, 
            count: 1
        },{
            lat: 29.6195, 
            lng:-100.809, 
            count: 1
        },{
            lat: 35.4568, 
            lng:-97.2652, 
            count: 1
        },{
            lat: 33.8682, 
            lng:-117.929, 
            count: 1
        },{
            lat: 32.7977, 
            lng:-117.132, 
            count: 1
        },{
            lat: 33.3776, 
            lng:-112.387, 
            count: 1
        },{
            lat: 43.1031, 
            lng:-79.0092, 
            count: 1
        },{
            lat: 40.7731, 
            lng:-80.1137, 
            count: 2
        },{
            lat: 40.7082, 
            lng:-74.0132, 
            count: 1
        },{
            lat: 39.7187, 
            lng:-75.6216, 
            count: 1
        },{
            lat: 29.8729, 
            lng:-98.014, 
            count: 1
        },{
            lat: 42.5324, 
            lng:-70.9737, 
            count: 1
        },{
            lat: 41.6623, 
            lng:-71.0107, 
            count: 1
        },{
            lat: 41.1158, 
            lng:-78.9098, 
            count: 1
        },{
            lat: 39.2694, 
            lng:-76.7447, 
            count: 1
        },{
            lat: 39.9, 
            lng:-75.3075, 
            count: 1
        },{
            lat: 41.2137, 
            lng:-85.0996, 
            count: 1
        },{
            lat: 32.8148, 
            lng:-96.8705, 
            count: 2
        },{
            lat: 39.8041, 
            lng:-75.4559, 
            count: 4
        },{
            lat: 40.0684, 
            lng:-75.0065, 
            count: 1
        },{
            lat: 44.8791, 
            lng:-68.733, 
            count: 1
        },{
            lat: 40.1879, 
            lng:-75.4254, 
            count: 1
        },{
            lat: 41.8195, 
            lng:-71.4107, 
            count: 1
        },{
            lat: 38.9879, 
            lng:-76.5454, 
            count: 3
        },{
            lat: 42.5908, 
            lng:-71.8055, 
            count: 6
        },{
            lat: 40.7842, 
            lng:-73.8422, 
            count: 2
        },{
            lat: 0, 
            lng:0, 
            count: 2
        },{
            lat: 33.336, 
            lng:-96.7491, 
            count: 5
        },{
            lat: 33.336, 
            lng:-96.7491, 
            count: 6
        },{
            lat: 37.4192, 
            lng:-122.057, 
            count: 1
        },{
            lat: 33.7694, 
            lng:-83.3897, 
            count: 1
        },{
            lat: 37.7609, 
            lng:-87.1513, 
            count: 1
        },{
            lat: 33.8651, 
            lng:-84.8948, 
            count: 1
        },{
            lat: 28.5153, 
            lng:-82.2856, 
            count: 1
        },{
            lat: 35.1575, 
            lng:-89.7646, 
            count: 1
        },{
            lat: 32.318, 
            lng:-95.2921, 
            count: 1
        },{
            lat: 35.4479, 
            lng:-91.9977, 
            count: 1
        },{
            lat: 36.6696, 
            lng:-93.2615, 
            count: 1
        },{
            lat: 34.0946, 
            lng:-101.683, 
            count: 1
        },{
            lat: 31.9776, 
            lng:-102.08, 
            count: 1
        },{
            lat: 39.0335, 
            lng:-77.4838, 
            count: 1
        },{
            lat: 40.0548, 
            lng:-75.4083, 
            count: 8
        },{
            lat: 38.9604, 
            lng:-94.8049, 
            count: 2
        },{
            lat: 33.8138, 
            lng:-117.799, 
            count: 3
        },{
            lat: 33.8138, 
            lng:-117.799, 
            count: 1
        },{
            lat: 33.8138, 
            lng:-117.799, 
            count: 2
        },{
            lat: 38.2085, 
            lng:-85.6918, 
            count: 3
        },{
            lat: 37.7904, 
            lng:-85.4848, 
            count: 1
        },{
            lat: 42.4488, 
            lng:-94.2254, 
            count: 1
        },{
            lat: 43.179, 
            lng:-77.555, 
            count: 1
        },{
            lat: 29.7523, 
            lng:-95.367, 
            count: 3
        },{
            lat: 40.665, 
            lng:-73.7502, 
            count: 1
        },{
            lat: 40.6983, 
            lng:-73.888, 
            count: 1
        },{
            lat: 43.1693, 
            lng:-77.6189, 
            count: 1
        },{
            lat: 43.7516, 
            lng:-70.2793, 
            count: 1
        },{
            lat: 37.3501, 
            lng:-121.985, 
            count: 1
        },{
            lat: 32.7825, 
            lng:-96.8207, 
            count: 19
        },{
            lat: 35.1145, 
            lng:-101.771, 
            count: 1
        },{
            lat: 31.7038, 
            lng:-83.6753, 
            count: 2
        },{
            lat: 34.6222, 
            lng:-83.7901, 
            count: 1
        },{
            lat: 35.7102, 
            lng:-84.3743, 
            count: 1
        },{
            lat: 42.0707, 
            lng:-72.044, 
            count: 1
        },{
            lat: 34.7776, 
            lng:-82.3051, 
            count: 2
        },{
            lat: 34.9965, 
            lng:-82.3287, 
            count: 1
        },{
            lat: 32.5329, 
            lng:-85.5078, 
            count: 1
        },{
            lat: 41.5468, 
            lng:-93.6209, 
            count: 1
        },{
            lat: 41.2587, 
            lng:-80.8298, 
            count: 1
        },{
            lat: 35.2062, 
            lng:-81.1384, 
            count: 1
        },{
            lat: 39.9741, 
            lng:-86.1272, 
            count: 1
        },{
            lat: 33.7976, 
            lng:-118.162, 
            count: 1
        },{
            lat: 41.8675, 
            lng:-87.6744, 
            count: 1
        },{
            lat: 42.8526, 
            lng:-86.1263, 
            count: 1
        },{
            lat: 39.9968, 
            lng:-82.9882, 
            count: 1
        },{
            lat: 35.1108, 
            lng:-89.9483, 
            count: 1
        },{
            lat: 35.1359, 
            lng:-90.0027, 
            count: 1
        },{
            lat: 32.3654, 
            lng:-90.1118, 
            count: 1
        },{
            lat: 42.1663, 
            lng:-71.3611, 
            count: 1
        },{
            lat: 39.5076, 
            lng:-104.677, 
            count: 2
        },{
            lat: 39.378, 
            lng:-104.858, 
            count: 1
        },{
            lat: 44.84, 
            lng:-93.0365, 
            count: 1
        },{
            lat: 31.2002, 
            lng:-97.9921, 
            count: 1
        },{
            lat: 26.1783, 
            lng:-81.7145, 
            count: 2
        },{
            lat: 47.9469, 
            lng:-122.197, 
            count: 1
        },{
            lat: 32.2366, 
            lng:-90.1688, 
            count: 1
        },{
            lat: 25.7341, 
            lng:-80.3594, 
            count: 13
        },{
            lat: 26.9467, 
            lng:-80.217, 
            count: 2
        },{
            lat: 44.9487, 
            lng:-93.1002, 
            count: 1
        },{
            lat: 38.6485, 
            lng:-77.3108, 
            count: 1
        },{
            lat: 45.6676, 
            lng:-122.606, 
            count: 1
        },{
            lat: 40.1435, 
            lng:-75.3567, 
            count: 1
        },{
            lat: 43.0139, 
            lng:-71.4352, 
            count: 1
        },{
            lat: 41.9395, 
            lng:-71.2943, 
            count: 2
        },{
            lat: 37.6134, 
            lng:-77.2564, 
            count: 1
        },{
            lat: 42.5626, 
            lng:-83.6099, 
            count: 1
        },{
            lat: 41.55, 
            lng:-88.1248, 
            count: 1
        },{
            lat: 34.0311, 
            lng:-118.49, 
            count: 1
        },{
            lat: 33.7352, 
            lng:-118.315, 
            count: 1
        },{
            lat: 34.0872, 
            lng:-117.882, 
            count: 1
        },{
            lat: 33.8161, 
            lng:-117.979, 
            count: 2
        },{
            lat: 47.6609, 
            lng:-116.834, 
            count: 15
        },{
            lat: 40.2594, 
            lng:-81.9641, 
            count: 2
        },{
            lat: 35.9925, 
            lng:-78.9017, 
            count: 1
        },{
            lat: 32.8098, 
            lng:-96.7993, 
            count: 5
        },{
            lat: 32.6988, 
            lng:-97.1237, 
            count: 1
        },{
            lat: 32.9722, 
            lng:-96.7376, 
            count: 3
        },{
            lat: 32.9513, 
            lng:-96.7154, 
            count: 1
        },{
            lat: 32.9716, 
            lng:-96.7058, 
            count: 2
        },{
            lat: 41.4796, 
            lng:-81.511, 
            count: 2
        },{
            lat: 36.7695, 
            lng:-119.795, 
            count: 1
        },{
            lat: 36.2082, 
            lng:-86.879, 
            count: 2
        },{
            lat: 41.3846, 
            lng:-73.0943, 
            count: 1
        },{
            lat: 37.795, 
            lng:-122.219, 
            count: 1
        },{
            lat: 41.4231, 
            lng:-73.4771, 
            count: 1
        },{
            lat: 38.0322, 
            lng:-78.4873, 
            count: 1
        },{
            lat: 43.6667, 
            lng:-79.4167, 
            count: 1
        },{
            lat: 42.3222, 
            lng:-88.4671, 
            count: 7
        },{
            lat: 40.7336, 
            lng:-96.6394, 
            count: 2
        },{
            lat: 33.7401, 
            lng:-117.82, 
            count: 2
        },{
            lat: 33.7621, 
            lng:-84.3982, 
            count: 1
        },{
            lat: 39.7796, 
            lng:-75.0505, 
            count: 1
        },{
            lat: 39.4553, 
            lng:-74.9608, 
            count: 1
        },{
            lat: 39.7351, 
            lng:-75.6684, 
            count: 1
        },{
            lat: 51.3833, 
            lng:0.5167, 
            count: 1
        },{
            lat: 45.9833, 
            lng:6.05, 
            count: 1
        },{
            lat: 51.1833, 
            lng:14.4333, 
            count: 1
        },{
            lat: 41.9167, 
            lng:8.7333, 
            count: 1
        },{
            lat: 45.4, 
            lng:5.45, 
            count: 2
        },{
            lat: 51.9, 
            lng:6.1167, 
            count: 1
        },{
            lat: 50.4333, 
            lng:30.5167, 
            count: 1
        },{
            lat: 24.6408, 
            lng:46.7728, 
            count: 1
        },{
            lat: 54.9878, 
            lng:-1.4214, 
            count: 5
        },{
            lat: 51.45, 
            lng:-2.5833, 
            count: 2
        },{
            lat: 46, 
            lng:2, 
            count: 2
        },{
            lat: 51.5167, 
            lng:-0.7, 
            count: 1
        },{
            lat: 35.94, 
            lng:14.3533, 
            count: 1
        },{
            lat: 53.55, 
            lng:10, 
            count: 1
        },{
            lat: 53.6, 
            lng:7.2, 
            count: 1
        },{
            lat: 53.8333, 
            lng:-1.7667, 
            count: 1
        },{
            lat: 53.7833, 
            lng:-1.75, 
            count: 2
        },{
            lat: 52.6333, 
            lng:-1.1333, 
            count: 1
        },{
            lat: 53.5333, 
            lng:-1.1167, 
            count: 2
        },{
            lat: 51.0167, 
            lng:-0.45, 
            count: 2
        },{
            lat: 50.7833, 
            lng:-0.65, 
            count: 1
        },{
            lat: 50.9, 
            lng:-1.4, 
            count: 1
        },{
            lat: 50.9, 
            lng:-1.4, 
            count: 5
        },{
            lat: 52.2, 
            lng:-2.2, 
            count: 8
        },{
            lat: 50.1167, 
            lng:8.6833, 
            count: 3
        },{
            lat: 49.0047, 
            lng:8.3858, 
            count: 1
        },{
            lat: 49.1, 
            lng:10.75, 
            count: 7
        },{
            lat: 37.9833, 
            lng:23.7333, 
            count: 1
        },{
            lat: 41.9, 
            lng:12.4833, 
            count: 19
        },{
            lat: 51.8833, 
            lng:10.5667, 
            count: 3
        },{
            lat: 50.0333, 
            lng:12.0167, 
            count: 1
        },{
            lat: 49.8667, 
            lng:10.8333, 
            count: 14
        },{
            lat: 51, 
            lng:9, 
            count: 1
        },{
            lat: 53.3667, 
            lng:-1.5, 
            count: 1
        },{
            lat: 52.9333, 
            lng:-1.5, 
            count: 1
        },{
            lat: 52.9667, 
            lng:-1.1667, 
            count: 1
        },{
            lat: 52.9667, 
            lng:-1.3, 
            count: 1
        },{
            lat: 51.9, 
            lng:-2.0833, 
            count: 2
        },{
            lat: 50.3, 
            lng:3.9167, 
            count: 1
        },{
            lat: 45.45, 
            lng:-73.75, 
            count: 4
        },{
            lat: 53.7, 
            lng:-2.2833, 
            count: 1
        },{
            lat: 53.9833, 
            lng:-1.5333, 
            count: 1
        },{
            lat: 50.8167, 
            lng:7.1667, 
            count: 1
        },{
            lat: 56.5, 
            lng:-2.9667, 
            count: 1
        },{
            lat: 51.4667, 
            lng:-0.35, 
            count: 1
        },{
            lat: 43.3667, 
            lng:-5.8333, 
            count: 1
        },{
            lat: 47, 
            lng:8, 
            count: 4
        },{
            lat: 47, 
            lng:8, 
            count: 1
        },{
            lat: 47, 
            lng:8, 
            count: 2
        },{
            lat: 50.7333, 
            lng:-1.7667, 
            count: 2
        },{
            lat: 52.35, 
            lng:4.9167, 
            count: 1
        },{
            lat: 48.8833, 
            lng:8.3333, 
            count: 2
        },{
            lat: 53.5333, 
            lng:-0.05, 
            count: 1
        },{
            lat: 55.95, 
            lng:-3.2, 
            count: 2
        },{
            lat: 55.8333, 
            lng:-4.25, 
            count: 4
        },{
            lat: 54.6861, 
            lng:-1.2125, 
            count: 2
        },{
            lat: 52.5833, 
            lng:-0.25, 
            count: 2
        },{
            lat: 53.55, 
            lng:-2.5167, 
            count: 2
        },{
            lat: 52.7667, 
            lng:-1.2, 
            count: 1
        },{
            lat: 52.6333, 
            lng:-1.8333, 
            count: 2
        },{
            lat: 55.0047, 
            lng:-1.4728, 
            count: 2
        },{
            lat: 50.9, 
            lng:-1.4, 
            count: 2
        },{
            lat: 52.6333, 
            lng:1.3, 
            count: 5
        },{
            lat: 52.25, 
            lng:-1.1667, 
            count: 1
        },{
            lat: 54.9167, 
            lng:-1.7333, 
            count: 1
        },{
            lat: 53.5667, 
            lng:-2.9, 
            count: 3
        },{
            lat: 55.8833, 
            lng:-3.5333, 
            count: 1
        },{
            lat: 53.0667, 
            lng:6.4667, 
            count: 1
        },{
            lat: 48.3333, 
            lng:16.35, 
            count: 37
        },{
            lat: 58.35, 
            lng:15.2833, 
            count: 1
        },{
            lat: 50.6167, 
            lng:3.0167, 
            count: 1
        },{
            lat: 53.3833, 
            lng:-2.6, 
            count: 1
        },{
            lat: 53.3833, 
            lng:-2.6, 
            count: 2
        },{
            lat: 54.5333, 
            lng:-1.15, 
            count: 5
        },{
            lat: 51.55, 
            lng:0.05, 
            count: 2
        },{
            lat: 51.55, 
            lng:0.05, 
            count: 1
        },{
            lat: 50.8, 
            lng:-0.3667, 
            count: 2
        },{
            lat: 49.0533, 
            lng:11.7822, 
            count: 1
        },{
            lat: 52.2333, 
            lng:4.8333, 
            count: 1
        },{
            lat: 54.5833, 
            lng:-1.4167, 
            count: 3
        },{
            lat: 54.5833, 
            lng:-5.9333, 
            count: 1
        },{
            lat: 43.1167, 
            lng:5.9333, 
            count: 2
        },{
            lat: 51.8333, 
            lng:-2.25, 
            count: 1
        },{
            lat: 50.3964, 
            lng:-4.1386, 
            count: 2
        },{
            lat: 51.45, 
            lng:-2.5833, 
            count: 4
        },{
            lat: 54.9881, 
            lng:-1.6194, 
            count: 1
        },{
            lat: 55.9833, 
            lng:-4.6, 
            count: 4
        },{
            lat: 53.4167, 
            lng:-3, 
            count: 1
        },{
            lat: 51.5002, 
            lng:-0.1262, 
            count: 2
        },{
            lat: 50.3964, 
            lng:-4.1386, 
            count: 8
        },{
            lat: 51.3742, 
            lng:-2.1364, 
            count: 1
        },{
            lat: 52.4833, 
            lng:-2.1167, 
            count: 1
        },{
            lat: 54.5728, 
            lng:-1.1628, 
            count: 1
        },{
            lat: 54.5333, 
            lng:-1.15, 
            count: 1
        },{
            lat: 47.7833, 
            lng:7.3, 
            count: 1
        },{
            lat: 46.95, 
            lng:4.8333, 
            count: 1
        },{
            lat: 60.1756, 
            lng:24.9342, 
            count: 2
        },{
            lat: 58.2, 
            lng:16, 
            count: 2
        },{
            lat: 57.7167, 
            lng:11.9667, 
            count: 1
        },{
            lat: 60.0667, 
            lng:15.9333, 
            count: 2
        },{
            lat: 41.2333, 
            lng:1.8167, 
            count: 2
        },{
            lat: 40.4833, 
            lng:-3.3667, 
            count: 1
        },{
            lat: 52.1333, 
            lng:4.6667, 
            count: 2
        },{
            lat: 51.4167, 
            lng:5.4167, 
            count: 1
        },{
            lat: 51.9667, 
            lng:4.6167, 
            count: 2
        },{
            lat: 51.8333, 
            lng:4.6833, 
            count: 1
        },{
            lat: 51.8333, 
            lng:4.6833, 
            count: 2
        },{
            lat: 48.2, 
            lng:16.3667, 
            count: 1
        },{
            lat: 54.6833, 
            lng:25.3167, 
            count: 2
        },{
            lat: 51.9333, 
            lng:4.5833, 
            count: 2
        },{
            lat: 50.9, 
            lng:5.9833, 
            count: 1
        },{
            lat: 51.4333, 
            lng:-1, 
            count: 1
        },{
            lat: 49.4478, 
            lng:11.0683, 
            count: 1
        },{
            lat: 61.1333, 
            lng:21.5, 
            count: 1
        },{
            lat: 62.4667, 
            lng:6.15, 
            count: 1
        },{
            lat: 59.2167, 
            lng:10.95, 
            count: 1
        },{
            lat: 48.8667, 
            lng:2.3333, 
            count: 1
        },{
            lat: 52.35, 
            lng:4.9167, 
            count: 4
        },{
            lat: 52.35, 
            lng:4.9167, 
            count: 5
        },{
            lat: 52.35, 
            lng:4.9167, 
            count: 32
        },{
            lat: 54.0833, 
            lng:12.1333, 
            count: 1
        },{
            lat: 50.8, 
            lng:-0.5333, 
            count: 1
        },{
            lat: 50.8333, 
            lng:-0.15, 
            count: 1
        },{
            lat: 52.5167, 
            lng:13.4, 
            count: 2
        },{
            lat: 58.3167, 
            lng:15.1333, 
            count: 2
        },{
            lat: 59.3667, 
            lng:16.5, 
            count: 1
        },{
            lat: 55.8667, 
            lng:12.8333, 
            count: 2
        },{
            lat: 50.8667, 
            lng:6.8667, 
            count: 1
        },{
            lat: 52.5833, 
            lng:-0.25, 
            count: 1
        },{
            lat: 53.5833, 
            lng:-0.65, 
            count: 2
        },{
            lat: 44.4333, 
            lng:26.1, 
            count: 6
        },{
            lat: 44.4333, 
            lng:26.1, 
            count: 3
        },{
            lat: 51.7833, 
            lng:-3.0833, 
            count: 1
        },{
            lat: 50.85, 
            lng:-1.7833, 
            count: 1
        },{
            lat: 52.2333, 
            lng:-1.7333, 
            count: 1
        },{
            lat: 53.1333, 
            lng:-1.2, 
            count: 2
        },{
            lat: 51.4069, 
            lng:-2.5558, 
            count: 1
        },{
            lat: 51.3833, 
            lng:-0.1, 
            count: 1
        },{
            lat: 52.4667, 
            lng:-0.9167, 
            count: 1
        },{
            lat: 55.1667, 
            lng:-1.6833, 
            count: 1
        },{
            lat: 50.9667, 
            lng:-2.75, 
            count: 5
        },{
            lat: 53.25, 
            lng:-1.9167, 
            count: 4
        },{
            lat: 55.8333, 
            lng:-4.25, 
            count: 5
        },{
            lat: 50.7167, 
            lng:-2.4333, 
            count: 1
        },{
            lat: 51.2, 
            lng:-0.5667, 
            count: 2
        },{
            lat: 51.0667, 
            lng:-1.7833, 
            count: 2
        },{
            lat: 51.8167, 
            lng:-2.7167, 
            count: 2
        },{
            lat: 53.3833, 
            lng:-0.7667, 
            count: 1
        },{
            lat: 51.3667, 
            lng:1.45, 
            count: 6
        },{
            lat: 55.4333, 
            lng:-5.6333, 
            count: 1
        },{
            lat: 52.4167, 
            lng:-1.55, 
            count: 4
        },{
            lat: 51.5333, 
            lng:-0.3167, 
            count: 2
        },{
            lat: 50.45, 
            lng:-3.5, 
            count: 2
        },{
            lat: 53.0167, 
            lng:-1.6333, 
            count: 1
        },{
            lat: 51.7833, 
            lng:1.1667, 
            count: 3
        },{
            lat: 53.8833, 
            lng:-1.2667, 
            count: 1
        },{
            lat: 56.6667, 
            lng:-3, 
            count: 2
        },{
            lat: 51.4, 
            lng:-1.3167, 
            count: 5
        },{
            lat: 52.1333, 
            lng:-0.45, 
            count: 1
        },{
            lat: 52.4667, 
            lng:-1.9167, 
            count: 1
        },{
            lat: 52.05, 
            lng:-2.7167, 
            count: 1
        },{
            lat: 54.7, 
            lng:-5.8667, 
            count: 2
        },{
            lat: 52.4167, 
            lng:-1.55, 
            count: 1
        },{
            lat: 43.6, 
            lng:3.8833, 
            count: 1
        },{
            lat: 49.1833, 
            lng:-0.35, 
            count: 1
        },{
            lat: 52.6333, 
            lng:-1.1333, 
            count: 2
        },{
            lat: 52.4733, 
            lng:-8.1558, 
            count: 1
        },{
            lat: 53.3331, 
            lng:-6.2489, 
            count: 3
        },{
            lat: 53.3331, 
            lng:-6.2489, 
            count: 1
        },{
            lat: 52.3342, 
            lng:-6.4575, 
            count: 1
        },{
            lat: 52.2583, 
            lng:-7.1119, 
            count: 1
        },{
            lat: 54.25, 
            lng:-6.9667, 
            count: 1
        },{
            lat: 52.9667, 
            lng:-1.1667, 
            count: 2
        },{
            lat: 51.3742, 
            lng:-2.1364, 
            count: 2
        },{
            lat: 52.5667, 
            lng:-1.55, 
            count: 3
        },{
            lat: 49.9481, 
            lng:11.5783, 
            count: 1
        },{
            lat: 52.3833, 
            lng:9.9667, 
            count: 1
        },{
            lat: 47.8167, 
            lng:9.5, 
            count: 1
        },{
            lat: 50.0833, 
            lng:19.9167, 
            count: 1
        },{
            lat: 52.2167, 
            lng:5.2833, 
            count: 1
        },{
            lat: 42.4333, 
            lng:-8.6333, 
            count: 1
        },{
            lat: 42.8333, 
            lng:12.8333, 
            count: 1
        },{
            lat: 55.7167, 
            lng:12.45, 
            count: 1
        },{
            lat: 50.7, 
            lng:3.1667, 
            count: 1
        },{
            lat: 51.5833, 
            lng:-0.2833, 
            count: 1
        },{
            lat: 53.4333, 
            lng:-1.35, 
            count: 1
        },{
            lat: 62.8, 
            lng:30.15, 
            count: 1
        },{
            lat: 51.3, 
            lng:12.3333, 
            count: 2
        },{
            lat: 53.6528, 
            lng:-6.6814, 
            count: 1
        },{
            lat: 40.2333, 
            lng:-3.7667, 
            count: 1
        },{
            lat: 42.3741, 
            lng:-71.1072, 
            count: 1
        },{
            lat: 51.5002, 
            lng:-0.1262, 
            count: 5
        },{
            lat: 52.4667, 
            lng:-1.9167, 
            count: 2
        },{
            lat: 53.5, 
            lng:-2.2167, 
            count: 3
        },{
            lat: 54.0667, 
            lng:-2.8333, 
            count: 1
        },{
            lat: 52.5, 
            lng:-2, 
            count: 1
        },{
            lat: 48.0833, 
            lng:-1.6833, 
            count: 2
        },{
            lat: 43.6, 
            lng:1.4333, 
            count: 4
        },{
            lat: 52.6, 
            lng:-2, 
            count: 1
        },{
            lat: 56, 
            lng:-3.7667, 
            count: 1
        },{
            lat: 55.8333, 
            lng:-4.25, 
            count: 3
        },{
            lat: 55.8333, 
            lng:-4.25, 
            count: 1
        },{
            lat: 55.8333, 
            lng:-4.25, 
            count: 2
        },{
            lat: 53.8, 
            lng:-1.5833, 
            count: 1
        },{
            lat: 54.65, 
            lng:-2.7333, 
            count: 1
        },{
            lat: 51.5, 
            lng:-3.2, 
            count: 1
        },{
            lat: 54.35, 
            lng:-6.2833, 
            count: 1
        },{
            lat: 51.2, 
            lng:-0.8, 
            count: 1
        },{
            lat: 54.6861, 
            lng:-1.2125, 
            count: 1
        },{
            lat: 51.75, 
            lng:-0.3333, 
            count: 2
        },{
            lat: 52.3667, 
            lng:-1.25, 
            count: 1
        },{
            lat: 53.8, 
            lng:-1.5833, 
            count: 2
        },{
            lat: 52.6333, 
            lng:-2.5, 
            count: 2
        },{
            lat: 52.5167, 
            lng:-1.4667, 
            count: 1
        },{
            lat: 57.4833, 
            lng:12.0667, 
            count: 1
        },{
            lat: 59.3667, 
            lng:18.0167, 
            count: 1
        },{
            lat: 46, 
            lng:2, 
            count: 1
        },{
            lat: 51.0211, 
            lng:-3.1047, 
            count: 1
        },{
            lat: 53.4167, 
            lng:-3, 
            count: 4
        },{
            lat: 51.25, 
            lng:-0.7667, 
            count: 1
        },{
            lat: 49, 
            lng:2.3833, 
            count: 1
        },{
            lat: 50.8333, 
            lng:4, 
            count: 1
        },{
            lat: 48.7833, 
            lng:2.4667, 
            count: 1
        },{
            lat: 52, 
            lng:20, 
            count: 2
        },{
            lat: 55.7522, 
            lng:37.6156, 
            count: 1
        },{
            lat: 51.55, 
            lng:5.1167, 
            count: 1
        },{
            lat: 52, 
            lng:20, 
            count: 1
        },{
            lat: 49.9667, 
            lng:7.9, 
            count: 1
        },{
            lat: 46.25, 
            lng:20.1667, 
            count: 1
        },{
            lat: 49.3, 
            lng:-1.2333, 
            count: 1
        },{
            lat: 48.4333, 
            lng:8.6833, 
            count: 1
        },{
            lat: 51.65, 
            lng:-0.2667, 
            count: 1
        },{
            lat: 53.7, 
            lng:-1.4833, 
            count: 2
        },{
            lat: 51.5002, 
            lng:-0.1262, 
            count: 3
        },{
            lat: 51.5, 
            lng:-0.5833, 
            count: 1
        },{
            lat: 52.5833, 
            lng:-2.1333, 
            count: 2
        },{
            lat: 49.2833, 
            lng:1, 
            count: 3
        },{
            lat: 43.65, 
            lng:5.2667, 
            count: 2
        },{
            lat: 54.9881, 
            lng:-1.6194, 
            count: 2
        },{
            lat: 51.3458, 
            lng:-2.9678, 
            count: 2
        },{
            lat: 51.0833, 
            lng:-4.05, 
            count: 1
        },{
            lat: 50.8667, 
            lng:-2.9667, 
            count: 1
        },{
            lat: 50.3964, 
            lng:-4.1386, 
            count: 5
        },{
            lat: 53.5333, 
            lng:-1.1167, 
            count: 1
        },{
            lat: 54.9878, 
            lng:-1.4214, 
            count: 3
        },{
            lat: 51.4167, 
            lng:-0.2833, 
            count: 1
        },{
            lat: 54.9881, 
            lng:-1.6194, 
            count: 3
        },{
            lat: 52.4167, 
            lng:-1.55, 
            count: 3
        },{
            lat: 51.5002, 
            lng:-0.1262, 
            count: 4
        },{
            lat: 51.55, 
            lng:0.1667, 
            count: 1
        },{
            lat: 51.8333, 
            lng:-2.25, 
            count: 3
        },{
            lat: 53.65, 
            lng:-1.7833, 
            count: 2
        },{
            lat: 53.5833, 
            lng:-2.4333, 
            count: 2
        },{
            lat: 51.45, 
            lng:-2.5833, 
            count: 1
        },{
            lat: 59.9667, 
            lng:17.7, 
            count: 1
        },{
            lat: 54, 
            lng:-2, 
            count: 8
        },{
            lat: 52.7167, 
            lng:-2.7333, 
            count: 2
        },{
            lat: 51.0833, 
            lng:-0.7, 
            count: 1
        },{
            lat: 51.8, 
            lng:4.4667, 
            count: 1
        },{
            lat: 48.9, 
            lng:9.1167, 
            count: 1
        },{
            lat: 48.3167, 
            lng:2.5, 
            count: 2
        },{
            lat: 51.6667, 
            lng:-0.4, 
            count: 1
        },{
            lat: 51.75, 
            lng:-1.25, 
            count: 1
        },{
            lat: 52.6333, 
            lng:-2.5, 
            count: 1
        },{
            lat: 52.35, 
            lng:4.9167, 
            count: 3
        },{
            lat: 51.3458, 
            lng:-2.9678, 
            count: 1
        },{
            lat: 53.7167, 
            lng:-1.85, 
            count: 1
        },{
            lat: 53.4333, 
            lng:-1.35, 
            count: 4
        },{
            lat: 42.2, 
            lng:24.3333, 
            count: 2
        },{
            lat: 51.5333, 
            lng:0.7, 
            count: 1
        },{
            lat: 50.3964, 
            lng:-4.1386, 
            count: 1
        },{
            lat: 50.3964, 
            lng:-4.1386, 
            count: 12
        },{
            lat: 50.3964, 
            lng:-4.1386, 
            count: 20
        },{
            lat: 52.5833, 
            lng:-2.1333, 
            count: 1
        },{
            lat: 55.7667, 
            lng:-4.1667, 
            count: 7
        },{
            lat: 53.3167, 
            lng:-3.1, 
            count: 1
        },{
            lat: 51.9, 
            lng:-2.0833, 
            count: 1
        },{
            lat: 50.7167, 
            lng:-1.8833, 
            count: 1
        },{
            lat: 51.6, 
            lng:0.5167, 
            count: 2
        },{
            lat: 53.5, 
            lng:-2.2167, 
            count: 1
        },{
            lat: 53.1333, 
            lng:-1.2, 
            count: 1
        },{
            lat: 52.0167, 
            lng:4.3333, 
            count: 4
        },{
            lat: 50.7, 
            lng:3.1667, 
            count: 2
        },{
            lat: 49.6769, 
            lng:6.1239, 
            count: 13
        },{
            lat: 53.1, 
            lng:-2.4333, 
            count: 1
        },{
            lat: 51.3794, 
            lng:-2.3656, 
            count: 1
        },{
            lat: 24.6408, 
            lng:46.7728, 
            count: 2
        },{
            lat: 24.6408, 
            lng:46.7728, 
            count: 3
        },{
            lat: 50.75, 
            lng:-1.55, 
            count: 1
        },{
            lat: 52.6333, 
            lng:1.75, 
            count: 1
        },{
            lat: 48.15, 
            lng:9.4667, 
            count: 1
        },{
            lat: 52.35, 
            lng:4.9167, 
            count: 2
        },{
            lat: 60.8, 
            lng:11.1, 
            count: 1
        },{
            lat: 43.561, 
            lng:-116.214, 
            count: 1
        },{
            lat: 47.5036, 
            lng:-94.685, 
            count: 1
        },{
            lat: 42.1818, 
            lng:-71.1962, 
            count: 1
        },{
            lat: 42.0477, 
            lng:-74.1227, 
            count: 1
        },{
            lat: 40.0326, 
            lng:-75.719, 
            count: 1
        },{
            lat: 40.7128, 
            lng:-73.2962, 
            count: 2
        },{
            lat: 27.9003, 
            lng:-82.3024, 
            count: 1
        },{
            lat: 38.2085, 
            lng:-85.6918, 
            count: 1
        },{
            lat: 46.8159, 
            lng:-100.706, 
            count: 1
        },{
            lat: 30.5449, 
            lng:-90.8083, 
            count: 1
        },{
            lat: 44.735, 
            lng:-89.61, 
            count: 1
        },{
            lat: 41.4201, 
            lng:-75.6485, 
            count: 2
        },{
            lat: 39.4209, 
            lng:-74.4977, 
            count: 1
        },{
            lat: 39.7437, 
            lng:-104.979, 
            count: 1
        },{
            lat: 39.5593, 
            lng:-105.006, 
            count: 1
        },{
            lat: 45.2673, 
            lng:-93.0196, 
            count: 1
        },{
            lat: 41.1215, 
            lng:-89.4635, 
            count: 1
        },{
            lat: 43.4314, 
            lng:-83.9784, 
            count: 1
        },{
            lat: 43.7279, 
            lng:-86.284, 
            count: 1
        },{
            lat: 40.7168, 
            lng:-73.9861, 
            count: 1
        },{
            lat: 47.7294, 
            lng:-116.757, 
            count: 1
        },{
            lat: 47.7294, 
            lng:-116.757, 
            count: 2
        },{
            lat: 35.5498, 
            lng:-118.917, 
            count: 1
        },{
            lat: 34.1568, 
            lng:-118.523, 
            count: 1
        },{
            lat: 39.501, 
            lng:-87.3919, 
            count: 3
        },{
            lat: 33.5586, 
            lng:-112.095, 
            count: 1
        },{
            lat: 38.757, 
            lng:-77.1487, 
            count: 1
        },{
            lat: 33.223, 
            lng:-117.107, 
            count: 1
        },{
            lat: 30.2316, 
            lng:-85.502, 
            count: 1
        },{
            lat: 39.1703, 
            lng:-75.5456, 
            count: 8
        },{
            lat: 30.0041, 
            lng:-95.2984, 
            count: 2
        },{
            lat: 29.7755, 
            lng:-95.4152, 
            count: 1
        },{
            lat: 41.8014, 
            lng:-87.6005, 
            count: 1
        },{
            lat: 37.8754, 
            lng:-121.687, 
            count: 7
        },{
            lat: 38.4493, 
            lng:-122.709, 
            count: 1
        },{
            lat: 40.5494, 
            lng:-89.6252, 
            count: 1
        },{
            lat: 42.6105, 
            lng:-71.2306, 
            count: 1
        },{
            lat: 40.0973, 
            lng:-85.671, 
            count: 1
        },{
            lat: 40.3987, 
            lng:-86.8642, 
            count: 1
        },{
            lat: 40.4224, 
            lng:-86.8031, 
            count: 4
        },{
            lat: 47.2166, 
            lng:-122.451, 
            count: 1
        },{
            lat: 32.2369, 
            lng:-110.956, 
            count: 1
        },{
            lat: 41.3969, 
            lng:-87.3274, 
            count: 2
        },{
            lat: 41.7364, 
            lng:-89.7043, 
            count: 2
        },{
            lat: 42.3425, 
            lng:-71.0677, 
            count: 1
        },{
            lat: 33.8042, 
            lng:-83.8893, 
            count: 1
        },{
            lat: 36.6859, 
            lng:-121.629, 
            count: 2
        },{
            lat: 41.0957, 
            lng:-80.5052, 
            count: 1
        },{
            lat: 46.8841, 
            lng:-123.995, 
            count: 1
        },{
            lat: 40.2851, 
            lng:-75.9523, 
            count: 2
        },{
            lat: 42.4235, 
            lng:-85.3992, 
            count: 1
        },{
            lat: 39.7437, 
            lng:-104.979, 
            count: 2
        },{
            lat: 25.6586, 
            lng:-80.3568, 
            count: 7
        },{
            lat: 33.0975, 
            lng:-80.1753, 
            count: 1
        },{
            lat: 25.7615, 
            lng:-80.2939, 
            count: 1
        },{
            lat: 26.3739, 
            lng:-80.1468, 
            count: 1
        },{
            lat: 37.6454, 
            lng:-84.8171, 
            count: 1
        },{
            lat: 34.2321, 
            lng:-77.8835, 
            count: 1
        },{
            lat: 34.6774, 
            lng:-82.928, 
            count: 1
        },{
            lat: 39.9744, 
            lng:-86.0779, 
            count: 1
        },{
            lat: 35.6784, 
            lng:-97.4944, 
            count: 2
        },{
            lat: 33.5547, 
            lng:-84.1872, 
            count: 1
        },{
            lat: 27.2498, 
            lng:-80.3797, 
            count: 1
        },{
            lat: 41.4789, 
            lng:-81.6473, 
            count: 1
        },{
            lat: 41.813, 
            lng:-87.7134, 
            count: 1
        },{
            lat: 41.8917, 
            lng:-87.9359, 
            count: 1
        },{
            lat: 35.0911, 
            lng:-89.651, 
            count: 1
        },{
            lat: 32.6102, 
            lng:-117.03, 
            count: 1
        },{
            lat: 41.758, 
            lng:-72.7444, 
            count: 1
        },{
            lat: 39.8062, 
            lng:-86.1407, 
            count: 1
        },{
            lat: 41.872, 
            lng:-88.1662, 
            count: 1
        },{
            lat: 34.1404, 
            lng:-81.3369, 
            count: 1
        },{
            lat: 46.15, 
            lng:-60.1667, 
            count: 1
        },{
            lat: 36.0679, 
            lng:-86.7194, 
            count: 1
        },{
            lat: 43.45, 
            lng:-80.5, 
            count: 1
        },{
            lat: 44.3833, 
            lng:-79.7, 
            count: 1
        },{
            lat: 45.4167, 
            lng:-75.7, 
            count: 2
        },{
            lat: 43.75, 
            lng:-79.2, 
            count: 2
        },{
            lat: 45.2667, 
            lng:-66.0667, 
            count: 3
        },{
            lat: 42.9833, 
            lng:-81.25, 
            count: 2
        },{
            lat: 44.25, 
            lng:-79.4667, 
            count: 3
        },{
            lat: 45.2667, 
            lng:-66.0667, 
            count: 2
        },{
            lat: 34.3667, 
            lng:-118.478, 
            count: 3
        },{
            lat: 42.734, 
            lng:-87.8211, 
            count: 1
        },{
            lat: 39.9738, 
            lng:-86.1765, 
            count: 1
        },{
            lat: 33.7438, 
            lng:-117.866, 
            count: 1
        },{
            lat: 37.5741, 
            lng:-122.321, 
            count: 1
        },{
            lat: 42.2843, 
            lng:-85.2293, 
            count: 1
        },{
            lat: 34.6574, 
            lng:-92.5295, 
            count: 1
        },{
            lat: 41.4881, 
            lng:-87.4424, 
            count: 1
        },{
            lat: 25.72, 
            lng:-80.2707, 
            count: 1
        },{
            lat: 34.5873, 
            lng:-118.245, 
            count: 1
        },{
            lat: 35.8278, 
            lng:-78.6421, 
            count: 1
        }]
    }
}