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

/**
 *  start_loop
 *  Begins the requested audio loop.  This means that the audio starts at the given start time,
 *  and when it reaches the end time, it goes back to the start time.  This should
 *  be called whenever a section of the waveform is highlighted.
 *
 *  @param          params              {start, end} (times in seconds)
 **/
Waveform.prototype.start_loop = function(params) {
    /* Move audio to start time */
    this.audioElement.currentTime = params.start;
    
    /* animate once to update interface */
    this.animate({once: true});
    
    /* Send interval out to keep checking on loop */
    this.loopInterval = setInterval(function(obj, params){ return function(){ obj.continue_loop(params); } }(this, params), com.concertsoundorganizer.animation.speed);
}

/**
 *  continue_loop
 *  Continues the requested audio loop.  This will get called every animation.speed seconds, to make sure that the audio doesn't
 *  go past the requested time.
 *
 *  @param          params              {start, end} (times in seconds)
 **/
Waveform.prototype.continue_loop = function(params) {
    /* If we should restart the loop */
    if(this.audioElement.currentTime >= params.end) {
        /* restart */
        this.audioElement.currentTime = params.start;
    }
}

/**
 *  clear_loop
 *  This will clear the loop interval that is running every animation.speed seconds.  This should be called
 *  whenever the highlighted area is cleared.
 **/
Waveform.prototype.clear_loop = function() {
    clearInterval(this.loopInterval);
    this.loopInterval = null;
}
