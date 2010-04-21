/**
 *  @file WaveformViewer.js
 *  WaveformViewer.js contains all of the functionality associated with the WaveformViewer class.
 **/

/**
 *  WaveformViewer is the constructor for a WaveformViewer object.
 *  
 *  @param              containerID             The id of the container element.
 *  @param              audioID                 The id of the associated audio element.
 *  @return             this                    Constructor
 **/
var WaveformViewer = function(containerID, audioID) {
    
    if(typeof(containerID) != 'undefined' && typeof(audioID) != 'undefined') {
        this.initialize(containerID, audioID);
    }    
    
    
    return this;
}
/**
 *  WaveformViewer objects inherit from the Waveform class
 **/
WaveformViewer.prototype = new Waveform();

/**
 *  initialize
 *  Function that runs initially, called by constructor.  Initializes all members
 *  and checks all elements being retrieved from DOM for errors.
 *
 *  @param          containerID             The id of the container element.
 *  @param          audioID                 The id of the associated audio element.
 *  @param          waveformEditor          The waveformEditor object.
 **/
WaveformViewer.prototype.initialize = function(containerID, audioID, waveformEditor) {
    /* Set container members */
    this.set_container(containerID);
    /* Set audio members */
    this.set_audio(audioID);
    /* set reference to waveformEditor object */
    this.waveformEditor = waveformEditor;
    if(typeof(this.waveformEditor) == 'undefined') {
        throw new Error('WaveformViewer: Unable to get waveformEditor object.');
    }
    
    /* The object to animate is the playhead */
    this.playheadElement = $('#'+this.id+' > div.playhead').get(0);
    if(!this.playheadElement) {
      throw new Error('WaveformViewer: Unable to set playhead element.');
    }
    
    /* also save timecode element */
    this.timecodeElement = $('#'+this.id+' > div.timecode').get(0);
    if(!this.timecodeElement) {
      throw new Error('WaveformViewer: Unable to set timecode element.');
    }
    
    /* container width */
    this.waveformWidth = 800;
    
    /* Highlighter on viewer */
    this.highlighter = new Highlighter({
        highlightElement: $(this.container).children('#viewer_highlight'), 
        container: this.container, 
        waveformElement: $(this.container).children('#viewer_image'),
        waveformWidth: this.waveformWidth,
        audioElementDuration: this.audioElement.duration
    });
    
    /* Behavior when container is clicked */
    $(this.container).click(function(obj){ return function(event) { obj.clicked(event); } }(this));
    
    /* behavior if highlight is drawn on waveform editor */
    $('#waveform_editor').bind('highlight', function(obj){ return function(e, data){ obj.highlighter.set_highlight_time(data); } }(this));
    /* behavior if waveform editor highlight is cleared */
    $('#waveform_editor').bind('clear_highlight', function(obj){ return function(e){ obj.highlighter.initialize_highlight(); obj.clear_loop(); } }(this));
    /* behavior if highlight occurs on viewer */
    $(this.container).bind('highlight', function(obj){ return function(e, data){ obj.start_loop(data); $waveformPlayers['waveform_editor'].animate({once: true}); } }(this));
    /* behavior if highlight clear occurs on self */
    $(this.container).bind('clear_highlight', function(obj){ return function(e){ obj.clear_loop(); }}(this));
}

/**
 *  animate
 *  Begins the animation for a WaveformViewer object.  Should be called
 *  when animation is to start.
 *
 *  @param                  params              Parameters {once}
 **/
WaveformViewer.prototype.animate = function(params) {
    
    /* set default arguments */
    if(typeof(params) == 'undefined') {
        params = {
            once: false
        };
    }
        
    /* localize audioElement */
    var audioElement = this.audioElement;
    
    /* localize this */
    var thisLocal = this;
    
    /* Percentage of song we are currently on */
    var actualPercent = audioElement.currentTime/audioElement.duration;
    
    /* new position */
    var newPos = actualPercent*thisLocal.waveformWidth;
    
    var timecode = sec_to_timecode(audioElement.currentTime);
    
    /* Set timecode to new value */
    $(thisLocal.timecodeElement).html(timecode);
    
    /* Move playhead to new position */
    $(thisLocal.playheadElement).css('margin-left', newPos+'px');
    
    /* make sure audio element is still playing */
    if($(audioElement).hasClass('playing') && !params.once) {
        /* if so, go again in animation.speed ms */
        setTimeout(function(obj){ return function(){ obj.animate(); } }(thisLocal), com.concertsoundorganizer.animation.speed);
    }
    else {
        thisLocal.set_paused();
    }               
}

/**
 *  clicked
 *  Behavior for a WaveformViewer whenever the container is clicked.
 *  This seeks to the time in the audio file relative to the click, and updates
 *  the interface accordingly.
 *
 *  @param          event           The click event.
 **/
WaveformViewer.prototype.clicked = function(event) {
    
    /* make some vars local for quicker access */
    var $ = jQuery;
    var audioElement = this.audioElement;
    var container = this.container;
    
    /* X coordinate of click relative to element */
    var clickX = get_event_x(container, event);
    /* percent of width */
    var clickPerc = clickX/$(container).css('width').match(/[\d]+/);
    /* new time in audio file */
    var newTime = clickPerc*audioElement.duration;
    
    /* move current time of audio file to clicked location */
    audioElement.currentTime = newTime;
    
    /* If song is not playing */
    if(!$(audioElement).hasClass('playing'))
    {
        /* manually move playhead and change timecode. */
        $(container).children('div.playhead').css('margin-left', (clickX)+'px');                
        $(container).children('div.timecode').html(sec_to_timecode(newTime));
        
        /*  Manually update WaveformEditor object if one exists.
            One would not exist if this function is being used from a
            WaveformPlayer object because it was inherited. */
        if(typeof(this.waveformEditor) != 'undefined') {
            this.waveformEditor.animate({once: true});            
        }
    }
}
