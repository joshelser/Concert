/**
*  @file main.js
*  main.js contains all of the functionality associated with the main page interface.
**/

/**
*  Global variable for waveform player and volume slider.
**/
var $waveformPlayer = null;
var $volumeSlider = null;

(function() {
    /**
    *  When segment row is clicked, load waveform into waveform viewer.
    **/
    $('.segment_row').click(function(event) {
        event.preventDefault();
        
        /* If audio is currently playing, stop it */
        if(!$('audio').get(0).paused) {
            pause();
        }
        
        /* Get segment id */
        var segmentID = $(this).attr('id').split('-')[1];

        /* Load waveform, then audio element, then waveformPlayer object */
        load_waveform(segmentID);
        
        /* remove "selected" class from currently selected segment row */
        $('tr.segment_row.selected').removeClass('selected');

        /* Add "selected" class to row */
        $(this).addClass('selected');
        

    });


    
    initialize_audio_player_behavior();

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
    if(typeof($('#waveform_viewer').attr('data-audioid')) != 'undefined'
    && $('#waveform_viewer').attr('data-audioid') == audioID) {     
        /* Don't load image again */
        return;
    }
    
    $('#viewer_highlight').css('width','0');
    
    $('img#waveform_viewer_image').fadeOut('slow', loading());

    /** Load waveform image **/
    $.ajax({
        url: '/audio/'+audioID+'/waveformsrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* Load audio element, then intialize waveformPlayer object */
                load_audio(audioID, segmentID, function() {
                    /* remove loading */
                    remove_loading();
                    /* replace image src with proper image */
                    $('img#waveform_viewer_image').attr('src', data);
                    /* show image */                
                    $('img#waveform_viewer_image').fadeIn('slow');
                    /* Set waveform viewer audioid attribute to proper audioID */
                    $('#waveform_viewer').attr('data-audioid', audioID);
                });
            }
            else {
                alert('An error has occurred.');
            }
        }
    });
}

/**
*  load_audio
*   Takes an Audio object id, and changes the <audio> element's src to that audio
*   objects audio file.
*
*   @param              audioID             the Audio object id
*   @param              segmentID           the AudioSegment object id
*   @param              callBackFunction    the function to be executed after the audio has been loaded
**/
function load_audio(audioID, segmentID, callBackFunction) {
    /* Load audio element into audio container */
    $.ajax({
        url: '/audio/'+audioID+'/audiosrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* Remove audio element from page */
                $('audio').remove();
                /* Create new audio element */
                var audioElement = $('<audio>').attr('id', 'audio_element').attr('class', 'audio_element');
                /* Add source to audio element */
                $('<source>').attr('src', data).appendTo(audioElement);
                /* Add audio element to page */
                $('#audio_container').append(audioElement);
                
                var $audioElementID = $('audio').attr('id');
              
                /* Wait for audio element to become available before finishing load */
                $(audioElement).one('canplaythrough', function(){
                    /* Create waveform viewer object */
                    $waveformPlayer = new WaveformPlayer('waveform_viewer', $audioElementID);
                    
                    /* Get start and end times */
                    times = {
                        start: $('#segment_start-'+segmentID).html(),
                        end: $('#segment_end-'+segmentID).html()
                    };
                    
                    /*  Draw highlight on waveformPlayer based on start and end times.  
                        This creates an audio loop, and a highlight drawn on the interface. */
                    $waveformPlayer.highlighter.set_highlight_time(times);


                    
                    /* If play button is disabled */
                    if($('#play_button').hasClass('disabled')) {
                        /* Enable play button */
                        $('#play_button').removeClass('disabled');
                        /* Enable edit button */
                        $('#edit_button').removeClass('disabled');
                        /* Enable volume slider */
                        $('.volume_slider').removeClass('disabled');
                        /* Create new volume slider object */
                        $volumeSlider = new VolumeSlider({
                            sliderID: 'slider',
                            handleID: 'handle',
                            audioID: 'audio_element'
                        });
                                                
                    }
                    else {
                        /* Update volumeSlider's audio element */
                        $volumeSlider.set_audio_element('audio_element');
                    }
                    /* Set volume to 0.8 initially */
                    $volumeSlider.change_volume(0.8);
                    
                    callBackFunction();
                    
                });                            
            }
            else {
                alert('An error has occurred.');
            }
        }


    });
}
