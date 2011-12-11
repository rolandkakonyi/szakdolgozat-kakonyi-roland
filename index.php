<?php ?>


<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <title>Kákonyi Roland Szakdolgozat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" href="/css/reset.css" type="text/css" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />

        <script type="text/javascript" src="/js/jquery-1.7.js"></script>
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

    </head> 
    <body>
        <div id="main">
            <h1>GMaps Heatmap Overlay</h1>
            <a href="http://www.patrick-wied.at/static/heatmapjs/" title="heatmap.js">Back to the project page</a><br /><br />
            <div id="heatmapArea">

            </div>
            <div id="configArea">
                <h2>Sidenotes</h2>
                This is a demonstration of a canvas heatmap gmaps overlay<br /><br />
                <strong>Note: this is an early release of the heatmap layer. Please feel free to <a href="https://github.com/pa7/heatmap.js" target="_blank">contribute patches</a>. (e.g: correct datapoint pixels after dragrelease (in draw))</strong>
                <div id="tog" class="btn">Toggle HeatmapOverlay</div>
                <div id="gen" class="btn">Add 5 random lat/lng coordinates</div>
            </div>
        </div>
        <script type="text/javascript" src="/js/heatmap.js"></script>
        <script type="text/javascript" src="/js/heatmap-gmaps.js"></script>
        <script type="text/javascript" src="/js/HeatmapController.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                HeatmapController.init();
            });
            
            
            
        </script>
    </body>
</html>