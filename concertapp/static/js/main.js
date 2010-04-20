/**
*  @file main.js
*  main.js contains all of the functionality associated with the main page interface.
**/

/**
*  Global variable for waveform player.
**/
var $waveformPlayer = null;

(function() {
    /**
    *  When segment row is clicked, load waveform into waveform viewer.
    **/
    $('.segment_row').click(function(event) {
        event.preventDefault();
        
        /* loading notification */
        loading();
        
        /* Get segment id */
        var segmentID = $(this).attr('id').split('-')[1];

        /* Load waveform, then audio element, then waveformPlayer object */
        load_waveform(segmentID);
        
        /* remove "selected" class from currently selected segment row */
        $('tr.segment_row.selected').removeClass('selected');

        /* Add "selected" class to row */
        $(this).addClass('selected');
        

    });


    /**
    *   Playback functionality
    *   Behavior for play and pause buttons
    **/
    $('#play_button').live('click', function(event) {
        event.preventDefault();
        /* If button is not disabled */
        if(!$(this).hasClass('disabled')) {
            /* play audio */
            play();
            /* Change to pause button */
            $(this).attr('id', 'pause_button').attr('value', 'Pause');
        }
    });
    
    $('#pause_button').live('click', function(event) {
        event.preventDefault();
        /* if button is not disabled */
        if(!$(this).hasClass('disabled')) {
            /* pause audio */
            pause();
            /* Change to play button */
            $(this).attr('id', 'play_button').attr('value', 'Play');
        }
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
    if(typeof($('#waveform_viewer').attr('data-audioid')) != 'undefined'
    && $('#waveform_viewer').attr('data-audioid') == audioID) {
        /* Don't load image again */
        return;
    }

    /** Load waveform image **/
    $.ajax({
        url: '/audio/'+audioID+'/waveformsrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* replace image src with proper image */
                $('img#waveform_viewer_image').attr('src', data);                
                /* Set waveform viewer audioid attribute to proper audioID */
                $('#waveform_viewer').attr('data-audioid', audioID);
                /* Load audio element, then intialize waveformPlayer object */
                load_audio(audioID);
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
**/
function load_audio(audioID) {
    /* Load audio element into audio container */
    $.ajax({
        url: '/audio/'+audioID+'/audiosrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                var $audioElement = $('audio').html('').get(0);
                $('<source>').attr('src', data).appendTo($audioElement);
                var $audioElementID = $('audio').attr('id');
              
                /* Wait for all audio elements to become available */
                AudioLoader(function(){
                    /* Create waveform viewer object */
                    $waveformPlayer = new WaveformViewer('waveform_viewer', $audioElementID);
                    /* remove loading */
                    remove_loading();
                    /* Enable play button */
                    $('#play_button').removeClass('disabled');
                    /* Enable edit button */
                    $('#edit_button').removeClass('disabled');
                    
                });                            
            }
            else {
                alert('An error has occurred.');
            }
        }


    });
}


/**
 *  play
 *  Plays the audio file, and also begins any associated waveform objects.
 **/
function play() {
    /* Get audio player */
    var $player = $('audio').addClass('playing').get(0);
    $player.play();
    $waveformPlayer.play();
    //auto_pause_audio();
}

/**
 *  pause
 *  Pauses the audio element.
 **/
function pause() {
    var $player = $('audio').removeClass('playing').get(0);
    $player.pause();
}
