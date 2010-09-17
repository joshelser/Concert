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
var WaveformViewer = function(containerID, audioID, tags) {
    
    if(typeof(containerID) != 'undefined' && typeof(audioID) != 'undefined') {
        this.initialize(containerID, audioID, tags);
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
 **/
WaveformViewer.prototype.initialize = function(containerID, audioID, tags) {
    /* Set container members */
    this.set_container(containerID);
    /* Set audio members */
    this.set_audio(audioID);
    
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
    
    /* The highlight element */
    var highlightElement = $(this.container).children('#viewer_highlight').get(0);
    if(typeof(highlightElement) == 'undefined') {
        throw new Error('WaveformViewer: Unable to set highlightElement.');
    }
    
    /** Static highlight element must be watched for highlighting behavior **/
    var staticHighlightElement = $('#viewer_highlight_static').get(0);
    if(typeof(staticHighlightElement) == 'undefined') {
        throw new Error('WaveformViewer: Could not get static highlight element.');
    }
    
    
    /* container width */
    this.waveformWidth = 800;
    
    /* Highlighter on viewer */
    this.highlighter = new Highlighter({
        highlightElement: highlightElement, 
        container: this.container, 
        waveformElement: $(this.container).children('#viewer_image'),
        waveformWidth: this.waveformWidth,
        audioElement: this.audioElement,
        staticHighlightElement: staticHighlightElement
    });

    /* Static highlighter on viewer */
    this.set_highlight_viewer({
        highlightElement: $(this.container).children('#viewer_highlight_static'), 
        waveformElement : $(this.container).children('#viewer_image'), 
        tags: tags,
        eventElement: highlightElement
    });
    
    
    /* Behavior when audio element is played and paused */
    this.watch_audio_behavior(); 
    
    
    /* Behavior when container is clicked */
    $(this.container).click(function(obj){ return function(event) { obj.clicked(event); } }(this));
    
    /* Highlight behavior */
    this.initialize_highlight_behavior();
}


/**
 *  draw_animation
 *  Where one step of the animation occurs.  This should be called from the animate 
 *  function every 200ms or whatever the set animation speed is.
 **/
WaveformViewer.prototype.draw_animation = function(){
    
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
}

/**
 *  clicked
 *  Behavior for a WaveformViewer whenever the container is clicked.
 *  This seeks to the time in the audio file relative to the click.
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
}
