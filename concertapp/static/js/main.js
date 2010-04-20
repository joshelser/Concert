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

/**
 *  load_waveform
 *  Takes a segmentID, checks to see if this waveform is already loaded.
 *  Retrieves the waveform and loads it into the viewer.
 *
 *  @param              segmentID           The ID of the AudioSegment object.
 **/
function load_waveform(segmentID) {
    
    /* Get waveform viewer image element */
    var img = $('img#waveform_viewer_image').get(0);
    
    /* Get the audioID associated with this segment */
    var audioID = $('tr#segment_row-'+segmentID).attr('data-audioid');
    
    /* If waveform image is already this audio file */
    if(typeof($(img).data('audioID')) != 'undefined'
    && $(img).data('audioID') == audioID) {
        /* Don't load image again */
        return;
    }
    
    /** Load waveform image **/
    $.ajax({
        url: '/audio/'+audioID+'/waveformsrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* replace image src with proper image */
                $('img#waveform_viewer_image').attr('src', data).data('audioID', audioID);                
            }
            else {
                alert('An error has occurred.');
            }
        }
    });
}

function load_audio(segmentID){}
