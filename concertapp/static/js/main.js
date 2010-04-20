/**
 *  @file main.js
 *  main.js contains all of the functionality associated with the main page interface.
 **/

(function() {
    /**
     *  When segment row is clicked, load waveform into waveform viewer.
     **/
    $('.segment_row').click(function(event) {
      event.preventDefault();
      
      /* Get segment id */
      var segmentID = $(this).attr('id').split('-')[1];
      
      /* Load waveform */
      load_waveform(segmentID);
      
      /* Load audio element, then intialize waveformPlayer object */
    });
})();

function load_waveform(segmentID) {
    $.ajax({
        url: '/audio/'+segmentID+'/waveformsrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* replace image src with proper image */
                $('img#waveform_viewer_image').attr('src', data);
                
            }
            else {
                alert('An error has occurred.');
            }
        }
    });
}
