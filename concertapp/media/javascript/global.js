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
   *  When segment row is clicked, load waveform into waveform viewer.
   **/
  $('.segment_row').click(function(event) {
    event.preventDefault();
    /* Get segment id */
    var $id = $(this).attr('id').split('-')[1];
    /* replace viewer image div with waveform image for this segment's audio file */
    $('div#viewer_image').load('/audio/'+$id+'/waveform/');
    
    /* remove "selected" class from currently selected segment row */
    $('tr.segment_row.selected').removeClass('selected');
    
    /* Add "selected" class to row */
    $(this).addClass('selected');
  });

})();
