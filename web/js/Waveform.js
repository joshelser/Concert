/**
 *  @file Waveform.js
 *  Waveform.js contains all of the functionality associated with the Waveform class, and all subclasses.
 **/
 
/**
 *  Waveform is the constructor for a Waveform object.  Right now it does nothing
 *  because I don't need an instance of a Waveform object, only instances of the sub
 *  classes.
 *
 **/
var Waveform = function() {
}

/**
 *  setPlaying
 *  Adds the "playing" class to the waveform container.  Should be called
 *  before waveform animation starts.
 **/
Waveform.prototype.set_playing = function() {
    /* Set container class to 'playing' */
    $(this.container).addClass('playing');    
}

/**
 *  setPaused
 *  Removes the "playing" class from the waveform container.  Should be called
 *  when animation completes.
 **/
Waveform.prototype.set_paused = function() {
    $(this.container).removeClass('playing');
}

/**
 *  set_container
 *  Sets the Waveform object's id property, container property, and checks for errors.
 *
 *  @param          containerID             The id of the waveform container.
 **/
Waveform.prototype.set_container = function(containerID) {
    /* Set id to waveform container */
    this.id = containerID;
    
    /* Get container from DOM and set member variable */
    this.container = $('#'+containerID).get(0);
    if(!this.container) {
        throw new Error('set_container: Invalid containerID.');
    }    
}

/**
 *  set_audio
 *  Sets the Waveform object's audio element properties.  Checks for errors.
 *
 *  @param          audioID         the ID of the audio element on the DOM
 **/
Waveform.prototype.set_audio = function(audioID) {
    
    /* get audio element from DOM, and set member */
    this.audioID = audioID;
    this.audioElement = $('#'+audioID).get(0);
    if(!this.audioElement) {
        throw new Error('set_audio: Invalid audioID');
    }
}

/**
 *  play
 *  General behavior for the animation of the waveform.  Should be called when 
 *  associated audio element begins to play.
 **/
Waveform.prototype.play = function() {
    this.set_playing();
    
    this.animate();
}

/**
 *  WaveformEditor is the constructor for a WaveformEditor object.
 *
 *  @param          containerID         The ID of the container element on the DOM.
 *  @param          audioID             The id of the audio element on the DOM.
 **/
var WaveformEditor = function(containerID, audioID) {
    
    /* Set container members */
    this.set_container(containerID);
    /* Set audio members */
    this.set_audio(audioID);
    
    /* The object to animate is actual waveform image */
    this.waveformElement = $('#'+this.id+' > img.waveform_image').get(0);
    if(!this.waveformElement) {
        throw new Error('WaveformEditor: Could not get waveformElement.');
    }
    
    /* The highlight element on the page */
    this.highlightElement = $('#'+this.id+' > div#highlight').get(0);
    if(!this.highlightElement) {
        throw new Error('WaveformEditor: Could not get highlightElement.');
    }
    
    /* get waveform image width from end of waveform image file name */
    this.waveformWidth = $(this.waveformElement).attr('src').split('_')[1].match(/[\d]+/)*1;
    if(!this.waveformWidth || typeof this.waveformWidth != 'number')
    {
        throw new Error('WaveformEditor: Could not get waveform image width.');
    }
    
    return this;
    
}
/**
 *  WaveformEditor objects inherit from the Waveform class
 **/
WaveformEditor.prototype = new Waveform();

/**
 *  animate
 *  Begins the animation for a waveform editor object.  Should be called
 *  when animation is to start.
 **/
WaveformEditor.prototype.animate = function() {

    /* Percentage of song we are currently on */
    var actualPercent = this.audioElement.currentTime/this.audioElement.duration;
    
    /* new position */
    var newPos = actualPercent*this.waveformWidth;
    
    /* new left value (because waveform actually moves backwards and starts at 400) */
    var newLeft = (newPos-400)*-1;
    /* Set new waveform position */
    $(this.waveformElement).css('left', newLeft+'px');
    
    /* make sure audio element is still playing */
    if($(this.audioElement).hasClass('playing')) {
        /* if so, go again in animation.speed ms */
        setTimeout(function(obj){ return function(){ obj.animate(); } }(this), com.concertsoundorganizer.animation.speed);
    }
    else {
        this.set_paused();
    }
}

