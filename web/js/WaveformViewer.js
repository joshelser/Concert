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
