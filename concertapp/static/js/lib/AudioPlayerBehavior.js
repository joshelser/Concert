/**
 *  @file AudioPlayerBehavior.js
 *  AudioPlayerBehavior.js contains all of the functionality associated with the audio player.
 **/
 

 /**
 *  Global variable for volume slider.
 **/
 var $volumeSlider = null;
 /**
  * Global variable for current loop interval
  **/
 var $loopInterval = null;
 


/**
 *  initialize_audio_player_behavior
 *  Binds all interface events to the functions to be run when those events occur.
 *
 *  @param              callback                The function to execute when initialization is over.
 **/
function initialize_audio_player_behavior(callback) {
    
    /**
     *  When change_volume event is triggered on audio element,
     *  Change the volume on the audio element.
     **/
    $('audio').live('change_volume', function(event, data){
        $(this).get(0).volume = data.volume;
    });
    
    /**
     *  When looping events are triggered on an audio element.
     **/
    $('audio').live('loop', function(event, data){ return start_audio_loop(event, data); });
    $('audio').live('clear_loop', function(event, data){ return clear_audio_loop(event, data); });
    
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
/*    $(document).bind('keypress', function(event){
        if(event.keyCode == 32) {
            /* If the space bar was pressed inside an input element, don't handle event 
            if(event.target == '[object HTMLInputElement]' || event.target == '[object HTMLTextAreaElement]') {
                /* Do nothing 
            }
            else {
                event.preventDefault();
                if($('#play_button').length) {
                    $('#play_button').click();                
                }
                else {                
                    $('#pause_button').click();
                }                
            }
        }
    });*/
    
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
    
    if(typeof(callback) != 'undefined') {
        callback();
    }
    
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

/**
 *  start_audio_loop
 *  Begins the requested audio loop.  This means that the audio starts at the given start time,
 *  and when it reaches the end time, it goes back to the start time.  This should
 *  be called whenever a section of the waveform is highlighted.
 *
 *  @param          event                This is an event handler
 *  @param          data              {start, end} (times in seconds)
 **/
function start_audio_loop(event, data) {
    /* Get audio element */
    var audioElement = $('audio').get(0);

    /* if loop is already running */
    if($loopInterval != null) {
        /* stop loop, and then come back */
        clear_audio_loop(event, data);
    }
    else {
        /* Move audio to start time */
        audioElement.currentTime = data.start;

        /* Check again in animation speed ms */
        $loopInterval = setInterval(function(timedata){ return function(){ continue_audio_loop(timedata); }}(data), com.concertsoundorganizer.animation.speed);

        /* trigger highlight event */
        $(audioElement).trigger('highlight', data);
    }    
}

/**
 *  continue_audio_loop
 *  Continues the requested audio loop.  This will get called every animation.speed seconds, to make sure that the audio doesn't
 *  go past the requested time.
 *
 *  @param          data              {start, end} (times in seconds)
 **/
function continue_audio_loop(data) {
    /* Get audio element */
    var audioElement = $('audio').get(0);
    
    /* If we are still looping */
    if($loopInterval != null) { 
        /* If we should restart the loop */
        if(audioElement.currentTime >= data.end) {
            /* restart */
            audioElement.currentTime = data.start;
        }
        
    }
}

/**
 *  clear_audio_loop
 *  This will clear the loop interval that is running every animation.speed seconds.  This should be called
 *  whenever the highlighted area is cleared.
 **/
function clear_audio_loop(event, data) {
    
    if($loopInterval != null) {
        /* Clear interval */
        clearInterval($loopInterval);
        $loopInterval = null;      
    }
    
    /* Set as no longer looping */
    $('audio').attr('data-looping', '0');
    
    /* If data was sent in, we are supposed to start another loop after clearing */
    if(typeof(data) != 'undefined') {
        start_audio_loop(event, data);
    }
}
