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
 *  set_partner
 *  Initializes the associated WaveformViewer object with this WaveformEditor object. (or vice versa)
 *  Should be called after both objects are instantiated.
 *
 *  @param              partner             The partner object.
 **/
Waveform.prototype.set_partner = function(partner){
    /* set reference to partner object */
    this.partner = partner;
    if(typeof(this.partner) == 'undefined') {
        throw new Error('Waveform.prototype.set_partner: Unable to get partner object.');
    }
    
    /* Initialize partner behavior */
    /* if highlight is drawn on partner, draw highlight on self and animate */
    $(this.partner.container).bind('highlight', function(obj){ return function(e, data){ data.noTrigger = true; obj.highlighter.set_highlight_time(data); obj.animate(); } }(this));
    /* if partner highlight is cleared, clear highlight on self */
    $(this.partner.container).bind('clear_highlight', function(obj){ return function(e){ obj.highlighter.initialize_highlight(); obj.clear_loop(); } }(this));
}

Waveform.prototype.initialize_highlight_behavior = function(){
    /* if highlight occurs on self, start audio loop and draw animation */
    $(this.container).bind('highlight', function(obj){ return function(e, data){ obj.start_loop(data); } }(this));
    /* if highlight clear occurs on self, clear audio loop */
    $(this.container).bind('clear_highlight', function(obj){ return function(e){ obj.clear_loop(); }}(this));
}

/**
 *  watch_audio_behavior
 *  Watches the audio element, and runs the play or pause method when audio element
 *  is played or paused, respectively.
 **/
Waveform.prototype.watch_audio_behavior = function(){
    /* Run play method when audio element fires 'play' event. */
    $(this.audioElement).bind('play', function(waveformObject){ return function(){ waveformObject.play(); } }(this));
    /* Same for pause */
    $(this.audioElement).bind('pause', function(waveformObject){ return function(){ waveformObject.pause(); } }(this));
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
    if(typeof(this.container) == 'undefined') {
        throw new Error('Waveform.prototype.set_container: Invalid containerID.');
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
    if(typeof(this.audioElement) == 'undefined') {
        throw new Error('Waveform.prototype.set_audio: Invalid audioID');
    }
}

/**
 *  play
 *  General behavior for the animation of the waveform.  Should be called when 
 *  associated audio element begins to play.
 **/
Waveform.prototype.play = function() {
    
    this.animate();
}

/**
 *  pause
 *  Removes the "playing" class from the waveform container.  Should be called
 *  when animation completes.
 **/
Waveform.prototype.pause = function() {
    /* Does nothing right now */
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
    
    /* if loop is already running */
    if(this.loopInterval != null) {
        /* stop loop */
        this.clear_loop();
    }
    
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

/**
 *  animate
 *  Begins the animation for a Waveform object.  Should be called
 *  when animation is to start or occur.  The child class will have to 
 *  have implemented the draw_animation function, where one step
 *  of the animation actually takes place.
 **/
Waveform.prototype.animate = function() {
    
    /* Draw the animation once */
    this.draw_animation();
    
    /* make sure audio element is still playing */
    if(!this.audioElement.paused) {
        /* if so, go again in animation.speed ms */
        setTimeout(function(obj){ return function(){ obj.animate(); } }(this), com.concertsoundorganizer.animation.speed);
    }
}