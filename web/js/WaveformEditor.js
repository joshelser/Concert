/**
 *  @file WaveformEditor.js
 *  WaveformEditor.js contains all of the functionality associated with the WaveformEditor class.
 **/


/**
 *  WaveformEditor is the constructor for a WaveformEditor object.
 *
 *  @param          containerID         The ID of the container element on the DOM.
 *  @param          audioID             The id of the audio element on the DOM.
 *  @return         this                Constructor.
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
    
    /* The highlight object */
    this.highlighter = new Highlighter({
        highlightElement: this.highlightElement, 
        container: this.container, 
        waveformElement: this.waveformElement,
        waveformWidth: this.waveformWidth,
        audioElementDuration: this.audioElement.duration
    });
    
    
    
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
WaveformEditor.prototype.animate = function(params) {

    /* set default arguments */
    if(typeof(params) == 'undefined') {
        params = {
            once: false
        };
    }
    
    /* Percentage of song we are currently on */
    var actualPercent = this.audioElement.currentTime/this.audioElement.duration;
    
    /* new position */
    var newPos = actualPercent*this.waveformWidth;
    
    /* new left value (because waveform actually moves backwards and starts at 400) */
    var newLeft = (newPos-400)*-1;
    /* Set new waveform position */
    $(this.waveformElement).css('left', newLeft+'px');
    /* update highlighter left value */
    this.highlighter.set_waveform_left(newLeft);
    
    /* make sure audio element is still playing, and we weren't just supposed to animate once */
    if($(this.audioElement).hasClass('playing') && !params.once ) {
        /* if so, go again in animation.speed ms  */
        setTimeout(function(obj){ return function(){ obj.animate(); } }(this), com.concertsoundorganizer.animation.speed);
    }
    else {
        this.set_paused();
    }
}