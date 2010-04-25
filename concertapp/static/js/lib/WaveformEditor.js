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
    this.waveformElement = $('#'+this.id+' > div#editor_image').children('img.waveform_image').get(0);
    if(typeof(this.waveformElement) == 'undefined') {
        throw new Error('WaveformEditor: Could not get waveformElement.');
    }
    
    /* The highlight element on the page */
    this.highlightElement = $('#'+this.id+' > div#editor_highlight').get(0);
    if(typeof(this.highlightElement) == 'undefined') {
        throw new Error('WaveformEditor: Could not get highlightElement.');
    }
    
    /* get waveform image width from end of waveform image file name */
    this.waveformWidth = $(this.waveformElement).attr('src').match(/_[\d]+.png$/)[0].match(/[\d]+/)*1;
    if(typeof(this.waveformWidth) != 'number')
    {
        throw new Error('WaveformEditor: Could not get waveform image width.');
    }
    
    /* The highlight object */
    this.highlighter = new Highlighter({
        highlightElement: this.highlightElement, 
        container: this.container, 
        waveformElement: this.waveformElement,
        waveformWidth: this.waveformWidth,
        audioElement: this.audioElement
    });
    
    /* Static highlighter on viewer */
    this.highlightViewer = new HighlightViewer({
        highlightElement: $(this.container).children('#editor_highlight_static'), 
        container: this.container, 
        waveformElement: this.waveformElement,
        waveformWidth: this.waveformWidth,
        audioElement: this.audioElement
    });
    
    
    /* Highlight behavior */
    this.initialize_highlight_behavior();
    
    /* Watch audio element for playback */
    this.watch_audio_behavior();
    
    return this;
    
}
/**
 *  WaveformEditor objects inherit from the Waveform class
 **/
WaveformEditor.prototype = new Waveform();


/**
 *  draw_animation
 *  Draws one step of animation for a waveform editor object.  Should be called
 *  every animationspeed ms if we are animating.
 **/
WaveformEditor.prototype.draw_animation = function() {    
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
    /* Move highlight to proper position */
    this.highlighter.draw_highlight();
    /* Same for highlight viewer */
    this.highlightViewer.set_waveform_left(newLeft);
    this.highlightViewer.draw_highlight();
    
}
