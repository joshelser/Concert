/**
 *  @file   HighlightViewer.js
 *  HighlightViewer.js contains all the functionality associated with the HighlightViewer class.
 **/

/**
 *  HighlightViewer
 *  The constructor for a HighlightViewer object.
 *
 *  @param          params                      Params list. {highlightElement, container, waveformElement, waveformWidth, audioElementDuration, tags}
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
    
    /* associated audioElement */
    this.audioElement = params.audioElement;
    if(typeof(this.audioElement) == 'undefined') {
        throw new Error('HighlightViewer: Could not initialize audioElement.');
    }
        
    /* JSON list of tag objects for this highlighted section */
    this.tags = params.tags;
    if(typeof(this.tags) != 'undefined') {
        /* initialize display */
        this.display_tags();
    }

    /* duration of associated audio */
    this.audioElementDuration = this.audioElement.duration;
    
    /* initialize highlight start and highlight end members */
    this.initialize_highlight();
    
    /* initialize waveformLeft */
    this.set_waveform_left($(this.waveformElement).css('left').match(/[\d\.]+/));
    
    

}

HighlightViewer.prototype.display_tags = function() {

    
    /* String to ultimately inject into tag display */
    var out = this.tags[0]['fields']['tag'];
    /* For each tag */
    for(var i = 1; i < this.tags.length; i++) {
        /* Format output for this tag */
        out += ', '+this.tags[i]['fields']['tag'];
    }
    
    /* Display output in tag area above highlight */
    $(this.highlightElement).find('#editor_highlight_static_tag_text').html(out);
}

