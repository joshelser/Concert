/**
 *  @file   HighlightViewer.js
 *  HighlightViewer.js contains all the functionality associated with the HighlightViewer class.
 **/

/**
 *  HighlightViewer
 *  The constructor for a HighlightViewer object.
 *
 *  @param          params                      Params list. {highlightElement, container, waveformElement, waveformWidth, audioElementDuration}
 *  @return         this                        Constructor.
 **/
var HighlightViewer = function(params) {
    
    this.initialize(params);    
    return this;    
}
/**
 *  HighlightViewer inherits from a Highlight object
 **/
HighlightViewer.prototype = new Highlighter();

HighlightViewer.prototype.initialize = function(params) { 
    /* Initialize members. */
    
    /* highlightElement is the element that is the actual highlight */
    this.highlightElement = params.highlightElement;
    if(typeof(this.highlightElement) == 'undefined') {
        throw new Error('HighlightViewer: Could not initialize highlightElement.');
    }
    
    /* Container of the entire waveform editor */
    this.container = params.container;
    if(typeof(this.container) == 'undefined') {
        throw new Error('HighlightViewer: Could not initialize container.');
    }
    
    /* waveform image element */
    this.waveformElement = params.waveformElement;
    if(typeof(this.waveformElement) == 'undefined') {
        throw new Error('HighlightViewer: Could not initialize waveformElement.');
    }
    
    /* waveform image width */
    this.waveformWidth = params.waveformWidth;
    if(typeof(this.waveformWidth) == 'undefined') {
        throw new Error('HighlightViewer: Could not initialize waveformWidth');
    }
    
    /* duration of associated audio */
    this.audioElementDuration = params.audioElementDuration;
    if(typeof(this.audioElementDuration) == 'undefined') {
        throw new Error('HighlightViewer: Could not initialize audioElementDuration.');
    }
    
    /* initialize highlight start and highlight end members */
    this.initialize_highlight();
    
    /* initialize waveformLeft */
    this.set_waveform_left($(this.waveformElement).css('left').match(/[\d\.]+/));

}

