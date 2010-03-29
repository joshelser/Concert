/**
 *  @file WaveformViewer.js
 *  WaveformViewer.js contains all of the functionality associated with the WaveformViewer class.
 **/

/**
 *  WaveformViewer is the constructor for a WaveformViewer object.
 *  
 *  @param              containerID             The id of the container element.
 *  @param              audioID                 The id of the associated audio element.
 **/
var WaveformViewer = function(containerID, audioID) {
    
    /* Set container members */
    this.set_container(containerID);
    /* Set audio members */
    this.set_audio(audioID);
    
    /* The object to animate is the playhead */
    this.playheadElement = $('#'+this.id+' > div.playhead').get(0)
    
    /* also save timecode element */
    this.timecodeElement = $('#'+this.id+' > div.timecode').get(0);
    
    /* container width */
    this.waveformWidth = 800;
    
    /* Behavior when container is clicked */
    $(this.container).click(function(obj){ return function(event) { obj.clicked(event); } }(this));
}
/**
 *  WaveformViewer objects inherit from the Waveform class
 **/
WaveformViewer.prototype = new Waveform();

/**
 *  animate
 *  Begins the animation for a WaveformViewer object.  Should be called
 *  when animation is to start.
 **/
WaveformViewer.prototype.animate = function() {
    
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
    if($(audioElement).hasClass('playing')) {
        /* if so, go again in animation.speed ms */
        setTimeout(function(obj){ return function(){ obj.animate(); } }(thisLocal), com.concertsoundorganizer.animation.speed);
    }
    else {
        thisLocal.set_paused();
    }               
}

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
    var newTime = (clickPerc*audioElement.duration);
    /* move current time of audio file to clicked location */
    audioElement.currentTime = newTime;
    
    /* If song is not playing */
    if(!$(audioElement).hasClass('playing'))
    {
        /* manually move playhead and change timecode. */
        $(container).children('div.playhead').css('margin-left', (clickX)+'px');                
        $(container).children('div.timecode').html(sec_to_timecode(newTime));
        
        /* Manually update waveform_editor */
        $waveformPlayers['waveform_editor'].animate({once: true});
    }
}
