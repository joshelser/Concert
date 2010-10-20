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

        /* If a button, or select was clicked */
        if(event.target != '[object HTMLTableCellElement]') {
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
        'sDom': '<"above_table"filp>t',
        "bAutoWidth": false,

    });

    /*  since the search plugin above (datatables for jquery) doesn't have very good
        style options, we hack it by hiding the vendor provided search bar, providing 
        our own, and transfering any data entered to our search bar into vender provided one*/
    $("#search>input").bind("keyup",function() {
        $(".dataTables_filter>input").val($(this).val());
        $(".dataTables_filter>input").trigger("keyup"); 
    });
    

    
    initialize_audio_player_behavior();
    
    /* Behavior for delete segment buttons */
    $('.segmentDeleteButton').bind('click', function(){
        var segmentID = get_object_id(this);
        var groupID = $(this).attr('id').split('-')[2];
        delete_segment(segmentID,groupID);
    });
    
    /* Behavior for share segment button */
    $('.segmentShareButton').bind('click', function(){
        var segmentID = get_object_id(this);
        share_segment_initiate(segmentID);
    });
    /* Behavior for group pulldown when share segment button is pushed */
    $('.segment_group_select').live('change', function(){
        var segmentID = get_object_id($(this).parent());
        var selectedGroupID = $(this).val();
        var selectedGroupName = $(this).children('[value='+selectedGroupID+']').html();
        share_segment_finalize(segmentID, selectedGroupID, selectedGroupName);
    });
    
    
    

})();

/**
 *  Called when "share segment" button is pressed.
 *
 *  @param          segmentID           the ID of the AudioSegment object
 **/
function share_segment_initiate(segmentID) {
    
    /*  Make ajax call to retrieve select box with group to share with.  
        Load this into the table cell */
    $.ajax({
        url: '/users/1/groupselect/',
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* Put select box next to share button */
                $('#segmentShareButton-'+segmentID).before(data);
                /* Hide share button */
                $('#segmentShareButton-'+segmentID).hide();
            }
        }
    });   
}

/**
 *  Called after the share segment button is pressed, and a group
 *  with which to share the segment is selected.
 *
 *  @param              segmentID           The ID of the AudioSegment object.
 *  @param              groupID             The ID of the Group object.
 *  @param              groupName           The Name of the Group object (used for notifications)
 **/
function share_segment_finalize(segmentID, groupID, groupName) {
    
    /* Validate input */
    if(groupID < 0) {
        alert('Please select a group to share this segment with.');
        return;
    }
    
    /*  Confirm  */
    var answer = confirm('Are you sure you want to share this segment with group:\n\n"'+groupName+'"');
    
    /* If they declined, do nothing */
    if(!answer) {
        return;
    }
    
    /* Continue */
    $.ajax({
        url: '/audio/addsegmenttogroup/'+segmentID+'/'+groupID+'/',
        success: function(data, textStatus) {
            if(textStatus == 'success' && data == 'success') {
                /* Notify user */
                alert('Your segment was shared with\n\n"'+groupName+'"\n\nsuccessfully.');
                /* Remove group select box */
                $('td#segment_share-'+segmentID).find('.segment_group_select').remove();
                /* Show 'share' button */
                $('#segmentShareButton-'+segmentID).show();
            }
            else {
                alert(data);
            }
        }
    });
    
}

/**
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
*   Takes an Audio object id, removes the old <audio> element, and adds a new one to the page with 
*   the new source.
*
*   @param              audioID             the Audio object id
*   @param              segmentID           the AudioSegment object id
*   @param              callBackFunction    the function to be executed after the audio has been loaded
**/
function load_audio(audioID, segmentID, callBackFunction) {
    
    var audiotype = com.concertsoundorganizer.compatibility.audiotype;
    /* Load audio element into audio container */
    $.ajax({
        url: '/audio/'+audioID+'/audiosrc/'+audiotype,
        success: function(data, textStatus) {
            if(textStatus == 'success') {
                /* Clear audio loop */
                $('audio').trigger('clear_loop');                    

                /* Remove audio element from page */
                $('audio').remove();
                
                var $audioElementID = 'audio_element';
                
                /* Create new audio element */
                var audioElement = $('<audio>').attr('id', $audioElementID).attr({'class': 'audio_element', 'preload' : 'auto'});
                /* Add source to audio element */
                $('<source>').attr('src', data).appendTo(audioElement);
                /* Add audio element to page */
                $('#audio_container').append(audioElement);
                
              
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
 *  Deletes a specified segment.
 *
 *  @param              segmentID           The ID of the segment object to delete.
 **/
function delete_segment(segmentID, groupID) {
    
    /* Show confirm alert */
    var answer = confirm('Are you sure you want to delete this segment?');
    
    /* If they answered true */
    if(answer == true) {
        loading();
        /* Ajax call to delete segment */
        $.ajax({
            url: '/delete_segment/'+segmentID +'/'+groupID,
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
