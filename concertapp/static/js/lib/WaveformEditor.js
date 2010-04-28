/**
 *  @file WaveformEditor.js
 *  WaveformEditor.js contains all of the functionality associated with the WaveformEditor class.
 **/


/**
 *  WaveformEditor is the constructor for a WaveformEditor object.
 *
 *  @param          containerID         The ID of the container element on the DOM.
 *  @param          audioID             The id of the audio element on the DOM.
 *  @param          tags                The list of JSON Tag objects.
 *  @return         this                Constructor.
 **/
var WaveformEditor = function(containerID, audioID, tags) {
    
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
    
    /** Static highlight element must be watched for highlighting behavior **/
    var staticHighlightElement = $('#editor_highlight_static').get(0);
    if(typeof(staticHighlightElement) == 'undefined') {
        throw new Error('WaveformEditor: Could not get static highlight element.');
    }
    
    /** image container must also be watched for highlighting **/
    var imageContainerElement = $('#editor_image').get(0);
    if(typeof(imageContainerElement) == 'undefined') {
        throw new Error('WaveformEditor: Could not get image container element.')
    }
    
    /* The highlight object */
    this.highlighter = new Highlighter({
        highlightElement: this.highlightElement, 
        container: this.container, 
        waveformElement: this.waveformElement,
        waveformWidth: this.waveformWidth,
        audioElement: this.audioElement,
        staticHighlightElement: staticHighlightElement,
        imageContainerElement: imageContainerElement
    });
    
    /* Static highlighter on viewer */
    this.set_highlight_viewer({
        highlightElement: staticHighlightElement,
        waveformElement: this.waveformElement,
        tags: tags,
    });
    
    /* Highlight behavior */
    this.initialize_highlight_behavior();
    
    /* Watch audio element for playback */
    this.watch_audio_behavior();
    
    /* Behavior when container is clicked */
    $(this.container).click(function(obj){ return function(event) { obj.clicked(event); } }(this));
    
    
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

/**
 *  clicked
 *  Behavior for a WaveformEditor whenever the container is clicked.
 *  This seeks to the time in the audio file relative to the click.
 *
 *  @param          event           The click event.
 **/
WaveformEditor.prototype.clicked = function(event) {
    
    /* make some vars local for quicker access */
    var $ = jQuery;
    var audioElement = this.audioElement;
    var container = this.container;
    
    /* X coordinate of click relative to element */
    var clickX = get_event_x(container, event);
    /* subtract left offset */
    clickX -= $(this.waveformElement).css('left').match(/[-]{0,1}[\d]+/)*1;
    /* percent of waveform image width width */
    var clickPerc = clickX/this.waveformWidth;
    /* new time in audio file */
    var newTime = clickPerc*audioElement.duration;
    
    /* Normalize in case out of bounds area was clicked. */
    if(newTime < 0) {
        newTime = 0;
    }
    if(newTime > audioElement.duration) {
        newTime = audioElement.duration;
    }
    
    /* move current time of audio file to clicked location */
    audioElement.currentTime = newTime;
}
