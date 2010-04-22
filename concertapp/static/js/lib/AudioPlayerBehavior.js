/**
 *  @file AudioPlayerBehavior.js
 *  AudioPlayerBehavior.js contains all of the functionality associated with the audio player.
 **/
 

 /**
 *  Global variable for waveform player and volume slider.
 **/
 var $waveformPlayer = null;
 var $volumeSlider = null;


/**
 *  initialize_audio_player_behavior
 *  Binds all interface events to the functions to be run when those events occur.
 **/
function initialize_audio_player_behavior() {
    
    /**
     *  When change_volume event is triggered on audio element,
     *  Change the volume on the audio element.
     **/
    $('audio').live('change_volume', function(event, data){
        $(this).get(0).volume = data.volume;
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
        }
    });
    
    /** Space bar plays and pauses **/
    $(document).bind('keypress', function(event){
        if(event.keyCode == 32) {
            event.preventDefault();
            if($('#play_button').length) {
                $('#play_button').click();                
            }
            else {                
                $('#pause_button').click();
            }
        }
    });
    
    $('#pause_button').live('click', function(event) {
        event.preventDefault();
        /* if button is not disabled */
        if(!$(this).hasClass('disabled')) {
            /* pause audio */
            pause();
        }
    });
    
    /**
     *  Behavior when edit button is clicked
     **/
    $('#edit_button').bind('click', function(event){
        event.preventDefault();
        
        /* If button is not disabled */
        if(!$(this).hasClass('disabled')) {
            /* Get ID of current audio segment */
            var segmentID = $('tr.segment_row.selected').attr('id').split('-')[1];
            /* Get ID of current group */
            var groupID = $('li.group.selected').attr('id').split('-')[1];
            /* redirect to edit page for selected segment */
            window.location = '/edit/'+segmentID+'/'+groupID+'/';            
        }
    });
    
    
}

/**
 *  play
 *  Plays the audio file, triggering any associated waveform objects to animate.
 **/
function play() {
    /* Get and play audio player */
    $('audio').get(0).play();
    toggle_play_pause_button();
}

/**
 *  pause
 *  Pauses the audio element.
 **/
function pause() {
    /* Pause audio player */
    $('audio').get(0).pause();
    toggle_play_pause_button();
}

/**
 *  toggle_play_pause_button
 *  This function changes the play button to a pause button, and vice versa.
 **/
function toggle_play_pause_button() {
    /* If there is a play button on the DOM */
    if($('#play_button').length) {
        /* Change play button to pause button */
        $('#play_button').attr('id', 'pause_button').attr('value', 'Pause');        
    }
    else {
        /* Change pause to play button */
        $('#pause_button').attr('id', 'play_button').attr('value', 'Play');        
    }
}

/**
 *  activate_controls
 *  Enables all playback controls if they are disabled.
 ***/
function activate_controls() {
    /* If play button is disabled */
    if($('#play_button').hasClass('disabled')) {
        /* Enable play button */
        $('#play_button').removeClass('disabled');
        /* Enable edit button */
        $('#edit_button').removeClass('disabled');
        /* Enable volume slider */
        $('.volume_slider').removeClass('disabled');                                
    }
}

/** 
 *  initialize_volume_slider
 *  Creates the volumeSlider object for the audio controls based on the given IDs
 *  of DOM elements.
 *
 *  @param              params          {   sliderID: The id of the slider element,
 *                                          handleID: The ID of the handle element,
 *                                          audioID: the ID of the audio element }
 **/
function initialize_volume_slider(params) {
    /* Create new volume slider object */
    $volumeSlider = new VolumeSlider({
        sliderID: params.sliderID,
        handleID: params.handleID,
        audioID: params.audioID
    });
}