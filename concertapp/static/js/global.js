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

  
  

  

})();

function loading() {
    /* Turn on global loading notification */
    $('body').prepend('<img id="loader" src="/media/graphics/ajax-loader.gif" />');
}

function remove_loading() {
    /* Remove loading notification */
    $('#loader').remove();
}