  // Closure for the main app.
(function() {
  // Handle placeholder text for input fields.  
  // Add focus and blur events to handle showing/hiding the placeholder.
  $("input:text, input:password").bind('focus blur', function(event) {
    if (event.type == 'focus') {
      // Do we have a placeholder yet?
      if (!$(this).data('placeholder')) {
        $(this).data('placeholder', $(this).val());
      }
    
      if ($(this).val() == $(this).data('placeholder')) {
        $(this).val('');
      }
    } else {
      if ($.trim($(this).val()) == '') {
        $(this).val($(this).data('placeholder'));
      }
    }
  });
  
  /**
   *    Preload images
   **/
  var images = [];
  images.push($('<img />').attr('src', '/graphics/button_press.png'));
  images.push($('<img />').attr('src', '/graphics/ajax-loader.gif'));

  
  

})();

/**
 *  loading
 *  Global function for turning on the loading notification on the entire page.
 **/
function loading() {
    /* Turn on global loading notification */
    $('body').prepend('<img id="loader" src="/graphics/ajax-loader.gif" />');
}

/**
 *  loading
 *  Global function for turning off the loading notification on the entire page.
 **/
function remove_loading() {
    /* Remove loading notification */
    $('#loader').remove();
}