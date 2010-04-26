/**
*  @file main.js
*  main.js contains all of the functionality associated with the main page interface.
**/

/**
 *  Global variable for WaveformPlayer object.
 **/
var $waveformPlayer = null;


(function() {
    /**
    *  When segment row is clicked, load waveform into waveform viewer.
    **/
    $('.segment_row').click(function(event) {
        
        /* If a delete button was clicked */
        if($(event.target).hasClass('segmentDeleteButton') || $(event.target).hasClass('temp_edit_button')) {
            /* Do nothing */
            return;
        }
        
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

    /*  Make main table sortable and searchable.  There are some options
        that can go here to modify the look and properties of the DOM 
        elements that are generated, I haven't looked into it too much. */
    $('table.segments_table').dataTable({
        'sDom': '<"above_table"f>t<"below_table"ilp>', 
    });

    
    initialize_audio_player_behavior();
    
    /* Behavior for delete segment buttons */
    $('.segmentDeleteButton').bind('click', function(){
        var segmentID = get_object_id(this);
        delete_segment(segmentID);
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
        /* Don't load image again, but change highlight */
        main_draw_highlight(segmentID);
        return;
    }
    
    loading();
    $('#viewer_highlight').css('width','0');
    
    $('img#waveform_viewer_image').fadeOut('slow');

    /** Load waveform image **/
    $.ajax({
        url: '/audio/'+audioID+'/waveformsrc/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* Load audio element, then intialize waveformPlayer object */
                load_audio(audioID, segmentID, function() {
                    main_draw_highlight(segmentID);
                    
                    /* replace image src with proper image */
                    $('img#waveform_viewer_image').attr('src', data);
                    /* show image */                
                    $('img#waveform_viewer_image').fadeIn('slow');

                    /* Set waveform viewer audioid attribute to proper audioID */
                    $('#waveform_viewer').attr('data-audioid', audioID);

                    /* remove loading */
                    remove_loading();
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
                /* Clear audio loop */
                $('audio').trigger('clear_loop');                    

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
                    /* Create waveform player object */
                    $waveformPlayer = new WaveformPlayer('waveform_viewer', $audioElementID);
                                        
                    /* If volume slider has not yet been defined */
                    if($volumeSlider == null) {
                        /* Enable control buttons */
                        activate_controls();
                        
                        /* initialize volume slider */
                        initialize_volume_slider({sliderID: 'slider', handleID: 'handle', audioID: 'audio_element'});
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

/**
 *  main_draw_highlight
 *  Draws a highlight on the waveform viewer using the times from the segment whose ID
 *  is sent as an argument.
 *
 *  @param          segmentID           The id of the AudioSegment object.
 **/
function main_draw_highlight(segmentID) {
    /* Get start and end times */
    times = {
        start: $('#segment_start-'+segmentID).html(),
        end: $('#segment_end-'+segmentID).html()
    };
    
    
    /*  Draw highlight on waveformPlayer based on start and end times.  
        This creates an audio loop, and a highlight drawn on the interface. */
    $('audio').trigger('loop', times);
}

/**
 *  delete_segment
 *  Deletes a specified segment.
 *
 *  @param              segmentID           The ID of the segment object to delete.
 **/
function delete_segment(segmentID) {
    
    /* Show confirm alert */
    var answer = confirm('Are you sure you want to delete this segment?');
    
    /* If they answered true */
    if(answer == true) {
        loading();
        /* Ajax call to delete segment */
        $.ajax({
            url: '/delete_segment/'+segmentID,
            success: function(data, textStatus){
                /* If request was successful */
                if(textStatus == 'success' && data == 'success') {
                    
                    /* If the segment that was deleted was the currently selected */
                    if($('tr#segment_row-'+segmentID).hasClass('selected')) {
                        /*  Should do some fancy stuff here to handle this case, but instead 
                            Im just going to refresh the page. */
                        location.reload();

                    }
                    /* Remove segment from list */
                    $('tr#segment_row-'+segmentID).remove();
                    remove_loading();
                }
                else {
                    alert('Error: '+data);
                }
            }
        });
    }
}