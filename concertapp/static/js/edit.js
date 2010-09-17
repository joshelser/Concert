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
    
    
    
    /* Create audio viewers and editors when audio element is ready. */
    $('audio').one('canplaythrough', function(){
        /* Get tags for this audio segment which have been placed on DOM */
        var jsonTags = eval('('+$('#jsonTags').val()+')');

        /* Create waveform viewer object */
        $waveformViewer = new WaveformViewer('waveform_viewer', 'audio_element', jsonTags);
        /* Create waveform editor object */
        $waveformEditor = new WaveformEditor('waveform_editor', 'audio_element', jsonTags);
        
        
        /* Initialize volume slider */
        initialize_volume_slider({sliderID: 'slider', handleID: 'handle', audioID: 'audio_element'});
        
        /* Change volume to .8 by default */
        $volumeSlider.change_volume(0.8);
        
        
        
        /* Initialize audio player */
        initialize_audio_player_behavior(function(){
            /* Set static highlight for this segment of the audio */
            $waveformViewer.highlightViewer.set_highlight_time({start: $('#segment_start').val(), end: $('#segment_end').val(), noTrigger: true });
            /* Same for editor */
            $waveformEditor.highlightViewer.set_highlight_time({start: $('#segment_start').val(), end: $('#segment_end').val() });
        });

        
        /* Activate player controls */
        activate_controls();
        
    });

    /* Bind highlight event on viewer or editor to handler */
    $('audio').bind('loop', function(event, data){ return edit_highlight_handler(event, data); });
    $('audio').bind('clear_loop', function(){ edit_clear_beginning_end_fields(); });
    
    /* Bind submit button for a new segment */
    $('#new_submit_button').bind('click', function(event, data){ return edit_new_submit_handler(event, data); });
    
    /* Bind submit button for renaming a segment */
    $('#rename_submit_button').bind('click', function(event, data){ return edit_rename_submit_handler(event, data); });
    
    /* Add tag button for adding a tag to current segment */
    $('.addTagButton').bind('click', function(){
        var segmentID = get_object_id(this);
        add_tag(segmentID);
    });

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
    $('#id_beginning').attr('value', Math.round(data.start*100)/100);
    $('#id_end').attr('value', Math.round(data.end*100)/100);    
}

/**
 *  clear_beginning_end_fields
 *  This function should be called whenever a highlight is cleared, so the values
 *  in the form clear as well.
 **/
function edit_clear_beginning_end_fields() {
    $('#id_beginning').attr('value', '');
    $('#id_end').attr('value', '');        
}

/**
 *  edit_submit_handler
 *  This handles the event when the submit button is pressed on the new segment form
 *
 *  @param          event           This is an event handler.
 *  @param          data            The data associated with this event {}
 **/
function edit_new_submit_handler(event, data) {
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
            if(textStatus == 'success' && data == 'success') {
                alert('Your tag was saved successfully');
                window.location = '/';
            }
            else {
                alert('Error: '+data);
            }
        }
    });
}

/**
 *  edit_rename_submit_handler
 *  This is to be called whenever the submit button is pressed on the rename
 *  segment form.
 *
 *  @param          event           this is an event handler
 *  @param          data
 **/
function edit_rename_submit_handler(event, data) {

    var action = $("#rename_segment").attr("action");
    var label = $("#id_name").val();
    /* Submit form via ajax */
    $.ajax({
        url: action,
        type: 'POST',
        data: {'name': label,},
        success: function(data, textStatus) {
            if(textStatus == 'success' && data == 'success') {
                alert('Your segment was renamed successfully');
                window.location = '/';
            }
            else {
                alert('Error: '+data);
            }
        }
    });
    
}

/**
 *  add_tag
 *  This is to be called whenever a tag is to be added to the current segment.
 *
 *  @param              segmentID               the id of the AudioSegment object.
 ***/
function add_tag(segmentID) {
    var answer = prompt('Enter the tag name');
    var groupID = $('#id_group_id').val();
    
    if(answer.match(/[/]/)) {
        alert('Error: Tag cannot include any slashes.');
    }
    else if(answer != '') {
        $.ajax({
            url: '/tags/addTagToSegment/'+groupID+'/'+segmentID+'/'+answer+'/',
            success: function(data, textStatus) {
                if(textStatus == 'success' && data == 'success') {
                    /* Add tag to tag list */
                    $('#editor_highlight_static_tag_text').append(', '+answer);
                }
                else {
                    alert('Error: '+data);
                }
            }
        });
    }
    else {
        alert('Error: You must enter a tag');
    }
    
}
