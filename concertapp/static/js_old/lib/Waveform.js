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
}

/**
 *  initialize_highlight_behavior
 *  This is the behavior when a highlight or clear_loop event is triggered on the associated audio
 *  element.
 **/
Waveform.prototype.initialize_highlight_behavior = function(){
    
    /* If loop event is triggered on audio element, draw highlight and animate self */
    $(this.audioElement).bind('highlight', function(obj){ return function(e, data){
        data.noTrigger = true;
        /* Draw new highlight based on loop data */
        obj.highlighter.set_highlight_time(data);
        /* animate */
        obj.animate();
    }}(this));
    
    /* If clear loop event is triggered on audio element from somewhere else, clear highlight */
    $(this.audioElement).bind('clear_loop', function(obj){ return function(e, data){
        /* Clear highlight */
        obj.highlighter.initialize_highlight();
    }}(this));
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
    /* When current time of audio file changes */
    $(this.audioElement).bind('timeupdate', function(waveformObject){ return function(){ waveformObject.draw_animation(); }}(this));
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

/**
 *  set_highlight_viewer
 *  Sets the static highlight viewer for this Waveform object.  This is used
 *  if we are currently viewing a segment, and want to display the segment's
 *  location on the audio element at all times.
 *
 *  @param              params             {    highlightElement : The element to use for highlighting,
 *                                              waveformElement: The element that is the waveform image,
 *                                              tags:           The Tag JSON objects. }
 **/
Waveform.prototype.set_highlight_viewer = function(params) {
    /* Static highlighter on viewer */
    this.highlightViewer = new HighlightViewer({
        highlightElement: params.highlightElement, 
        container: this.container, 
        waveformElement: params.waveformElement,
        waveformWidth: this.waveformWidth,
        audioElement: this.audioElement,
        tags: params.tags
    });    
}