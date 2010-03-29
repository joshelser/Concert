/**
 *  @file Waveform.js
 *  Waveform.js contains all of the functionality associated with the Waveform class.
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

Waveform.prototype.loop_audio = function(params) {
    /* Move audio to start time */
    this.audioElement.currentTime = params.start;
    
    /* animate once */
    this.animate({once: true});
}
