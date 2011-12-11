<?php ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kákonyi Roland Szakdolgozat</title>
        <meta name="description" content="Ez az alkalmazás a szakdolgozatom keretében készült.">
        <META NAME="Author" CONTENT="Kákonyi Roland, rolandkakonyi@gmail.com">
        
        
        <link rel="stylesheet" href="/css/reset.css" type="text/css" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />

        <script type="text/javascript" src="/js/jquery-1.7.js"></script>
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
        <script type="text/javascript" src="/js/heatmap.js"></script>
        <script type="text/javascript" src="/js/heatmap-gmaps.js"></script>
        <script type="text/javascript" src="/js/HeatmapController.js"></script>
    </head> 
    <body>
        <div id="main">
            <h1>GMaps Heatmap Overlay</h1>
            
            <div id="heatmapArea">

            </div>
            <div id="configArea">
                <div id="tog" class="btn">Toggle HeatmapOverlay</div>
                <div id="gen" class="btn">Add 5 random lat/lng coordinates</div>
            </div>
        </div>
        
        <script type="text/javascript">
            $(document).ready(function(){
                HeatmapController.init();
            });
        </script>
    </body>
</html>