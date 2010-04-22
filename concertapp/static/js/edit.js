/**
*  @file edit.js
*  edit.js contains all of the functionality associated with the main page interface.
**/

/**
 * Globals for waveform viewer and editor
 **/
var $waveformViewer = null;
var $waveformEditor = null;


(function() {
    
    /* Initialize audio player */
    initialize_audio_player_behavior();
    
    
    /* Create audio viewers and editors when audio element is ready. */
    $('audio').one('canplaythrough', function(){
        
        /* Create waveform viewer object */
        $waveformViewer = new WaveformViewer('waveform_viewer', 'audio_element');
        /* Create waveform editor object */
        //$waveformEditor = new WaveformEditor('waveform_editor', 'audio_element');
        
        /* Initialize volume slider */
        initialize_volume_slider({sliderID: 'slider', handleID: 'handle', audioID: 'audio_element'});
        
        /* Change volume to .8 by default */
        $volumeSlider.change_volume(0.8);
        
        
        /* Activate player controls */
        activate_controls();
        
        
        
    });

    /* Bind highlight event on viewer or editor to handler */
    $('.waveform').bind('highlight', function(event, data){ return edit_highlight_handler(event, data); });
    
    
    /* Bind submit button for a new segment */
    $('#submit_button').bind('click', function(event, data){ return edit_submit_handler(event, data); });

})();

/**
 *  edit_highlight_handler
 *  Handles highlight behavior.  This is called whenever a highlight occurs on either
 *  waveform elements.
 *
 *  @param          event           This is an event handler.
 *  @param          data            The data associated with this event {start(float), end(float)}
 **/
function edit_highlight_handler(event, data) {
    /* Put start and end times into form fields */
    $('#id_beginning').attr('value', data.start);
    $('#id_end').attr('value', data.end);    
}

function edit_submit_handler(event, data) {
    /* Get data from form */
    var label = $('#id_label_field').attr('value');
    var tag = $('#id_tag_field').attr('value');
    var beginning = $('#id_beginning').attr('value');
    var end = $('#id_end').attr('value');
    var audioID = $('#id_audio_id').attr('value');
    var groupID = $('#id_group_id').attr('value');
    
    /* Handle errors */
    
    /* Submit form via ajax */
    $.ajax({
        url: '/edit/submit',
        type: 'POST',
        data: {     label_field: label, 
                    tag_field: tag, 
                    beginning: beginning, 
                    end: end,
                    audio_id: audioID,
                    group_id: groupID
                    },
        success: function(data, textStatus) {
            alert(textStatus);
        }
    });
}