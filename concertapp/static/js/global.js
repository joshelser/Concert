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

  var $waveformViewer = null;
  

  
  /**
   *    Playback functionality
   **/
  $('#play_button').click(function(event) {
      event.preventDefault();
      
      play();
  });

})();

/**
 *  play
 *  Plays the audio file, and also begins any associated waveform objects.
 **/
function play() {
    /* Get audio player */
    var $player = $('audio').addClass('playing').get(0);
    $player.play();
    $waveformViewer.play();
    //auto_pause_audio();
}
