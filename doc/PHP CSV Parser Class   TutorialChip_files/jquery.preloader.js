/**
 * Image Preloader
 *
 * Copyright (c) 2011 Qamar Ashraf (tutorialchip.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
(function($){

	$.fn.preloader = function(options){
		
		var root = $(this);
		var images = root.find( '.chip-life-image-target img' );
		
		$(images).parent().addClass( 'preloader' );		
		$(images).css({ 'visibility':'hidden', opacity:0 });
		
		$(images).each( function( index ) {
			//$(this).delay(400*index).fadeIn(500);			
			$(this).css( 'visibility','visible' ).delay(400*index).animate({ opacity:1 },
			
				function() {
					$(this).parent().removeClass( 'preloader' );
				}
			
			);					
		});		
	
	}	

})(jQuery);	