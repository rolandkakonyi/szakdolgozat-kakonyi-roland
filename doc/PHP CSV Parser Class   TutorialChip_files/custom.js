(function($){
	
	/** Chip Life Child Image Hover */
	function chipLifeChildImageHover() {
		
		$( '.chip-life-image-hover-grid' ).hover(function () {
			$(this).children( '.chip-life-image-hover' ).fadeIn( 200 );
		},function () {
			$(this).children( '.chip-life-image-hover' ).fadeOut( 200 );
		});	
	
	}
	
	/** Chip Life Child Light Boox */
	function chipLifeChildLightBox() {	
		$( "a[rel^='prettyPhoto']" ).prettyPhoto( { animationSpeed: '700', theme: 'dark_square' } );		
	}
	
	/** Chip Life Child Toogles */
	function chipLifeChildToggles() {	
		
		$( '.toggle-title' ).click( function() {
			var options = {};	  
			$( this ).toggleClass( 'toggle-active' );
			$( this ).next( '.toggle-content' ).toggle( 'fast' );
		});			
	
	}
	
	/** Chip Life Child Tabs */
	function chipLifeChildTabs() {			
		$( '.tabs' ).tabs();	
	}
	
	/** Chip Life Child Accordions */
	function chipLifeChildAccordions() {			
		$( '.accordions' ).accordion({
			autoHeight: false,
			navigation: true
		});	
	}
	
	/** Chip Life Child Image Preloader */
	function chipLifeChildImagePreloader() {			
		$( '.chip-life-image-hover-grid' ).preloader();	
	}
	
	/** Chip Life Child List Last Child */
	function chipLifeChildListLast() {			
		
		$.each( $( '#sidebar ul' ), function() {
			$(this) .find( 'li:last' ) .css({ 'border': 'none', 'marginBottom': '0px' });
		});
		
	}
	
	/** Chip Life Browser Fixes */
	function chipLifeBrowserFixes() {
		
		var is_chrome = /chrome/.test( navigator.userAgent.toLowerCase() );
		if( $.browser.safari && (!is_chrome)  ) {
			$( 'h1,h2,h3,h4,h5,h6' ).css( 'font-weight','500' );
		}
	
	}
	
	/** jQuery Document Ready */
	$(document).ready(function(){
		chipLifeChildImageHover();
		chipLifeChildLightBox();
		chipLifeChildToggles();
		chipLifeChildTabs();
		chipLifeChildAccordions();		
		chipLifeChildListLast();
		//chipLifeBrowserFixes();
	});

	/** jQuery Windows Load */
	$(window).load(function(){
		chipLifeChildImagePreloader();
	});

})(jQuery);

<!-- start MGID -->
var MarketGidDate = new Date();
document.write('<scr'+'ipt type="text/javascript" '
+'src="http://jsn.dt07.net/t/u/tutorialchip.com.4374.js?t='+MarketGidDate.getYear()+MarketGidDate.getMonth()
+ '" charset="utf-8" ></scr'+'ipt>');
<!-- end MGID -->