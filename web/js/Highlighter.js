/**
 *  @file   Highlighter.js
 *  Highlighter.js contains all the functionality associated with the Highlighter class.
 **/

/**
 *  Highlighter
 *  The constructor for a highlighter object.
 *
 *  @param          WaveformEditorObj           The WaveformEditor object from which this highlighter object was instantiated.
 *  @return         this                        Constructor.
 **/
var Highlighter = function(WaveformEditorObj) {
    
    /* Initialize members. */
    
    /* highlightElement is the element that is the actual highlight */
    this.highlightElement = WaveformEditorObj.highlightElement;
    if(typeof(this.highlightElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize highlightElement.');
    }
    
    /* Container of the entire waveform editor */
    this.container = WaveformEditorObj.container;
    if(typeof(this.container) == 'undefined') {
        throw new Error('Highlighter: Could not initialize container.');
    }
    
    /* waveform image element */
    this.waveformElement = WaveformEditorObj.waveformElement;
    if(typeof(this.waveformElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize waveformElement.');
    }
    
    /* waveform image width */
    this.waveformWidth = WaveformEditorObj.waveformWidth;
    if(typeof(this.waveformWidth) == 'undefined') {
        throw new Error('Highlighter: Could not initialize waveformWidth');
    }
    
    /* duration of associated audio */
    this.audioElementDuration = WaveformEditorObj.audioElement.duration;
    if(typeof(this.audioElementDuration) == 'undefined') {
        throw new Error('Highlighter: Could not initialize audioElementDuration.');
    }
    
    /* initialize highlight start and highlight end members */
    this.initialize_highlight();
    
    /* initialize waveformLeft */
    this.waveformLeft = this.set_waveform_left($(this.waveformElement).css('left').match(/[\d\.]+/));
    
    /* Highlighting behavior */
    /* start highlight on mousedown */
    $(this.waveformElement).mousedown(function(obj){ return function(event) { obj.start_drag(event); } }(this));
    /* continue highlight on mousemove */
    $(this.waveformElement).mousemove(function(obj){return function(event) { obj.continue_drag(event); } }(this));
    /* end highlight on mouseup (use entire container for this incase they drag off the image) */
    $(this.container).mouseup(function(obj){return function(event) { obj.end_drag(event); } }(this));
    
    
    return this;    
}

/**
 *  start_drag
 *  Begins the dragging process.  Should be called on mousedown over the waveform to be highlighted.
 *  
 *  @param          event           The mousedown event.
 **/
Highlighter.prototype.start_drag = function(event) {    
    /* Clear old highlight */
    this.initialize_highlight();
                
    /* X coordinate of click relative to element */
    this.highlightStart = get_event_x(this.waveformElement, event);
    
    /* Set variable to denote dragging is in progress */
    this.dragging = 1;
}

/**
 *  continue_drag
 *  Continues the highlighting process.  Should be called on mousemove over the highlighted waveform.
 *
 *  @param          event           The mousemove event.
 **/
Highlighter.prototype.continue_drag = function(event) {
    /* if mouse is down */
    if(this.dragging){
        /* Get x location of mouse relative to element */
        this.highlightEnd = get_event_x(this.waveformElement, event);
        /* continue drawing highlight */
        this.draw_highlight();
    }    
}

/**
 *  end_drag
 *  Ends the highlighting process.  Should be called on mouseup over the highlighted waveform.
 *
 *  @param          event           The mouseup event.
 *  @event          highlight       Thrown on successful highlight, from waveform editor container.
 **/
Highlighter.prototype.end_drag = function(event) {
    /* Dragging has stopped */
    this.dragging = 0;
    
    /* get highlight values in proper order */
    if(this.highlightStart < this.highlightEnd) {
       var highlightStartPx = this.highlightStart;
       var highlightEndPx = this.highlightEnd;
    }
    else {
       var highlightStartPx = this.highlightEnd;
       var highlightEndPx = this.highlightStart;
    }

    if(highlightStartPx != -1 && highlightEndPx != -1) {
       var startTimePerc = highlightStartPx/this.waveformWidth;
       var endTimePerc = highlightEndPx/this.waveformWidth;

       var highlightData = {
           start: startTimePerc*this.audioElementDuration,
           end: endTimePerc*this.audioElementDuration
       };

       /* Trigger highlight event */
       $(this.container).trigger('highlight', highlightData);
    }
            
}

/**
 *  initialize_highlight
 *  Initializes the highlight variables, and removes any previously drawn highlight.  Should
 *  be called whenever highlight is to go away.
 **/
Highlighter.prototype.initialize_highlight = function() {
    this.highlightStart = -1;
    this.highlightEnd = -1;
    this.draw_highlight();
}

/**
 *  draw_highlight
 *  Actually draws the highlight on the DOM based on the member highlight variables.  If the
 *  member variables were set to -1, we remove the highlight.  This should be called whenever
 *  the highlight variables change.
 **/
Highlighter.prototype.draw_highlight = function() {
    
    if(this.highlightStart == -1 || this.highlightEnd == -1) {
        /* Clear highlight */
        $(this.highlightElement).css('margin-left', '0px').css('width', '0px');
    }
    else {
        /* Forward highlight */
        if(this.highlightStart < this.highlightEnd) {
            /* Set highlight */
            $(this.highlightElement).css('margin-left', (this.highlightStart+this.waveformLeft)+'px').css('width', (this.highlightEnd-this.highlightStart)+'px');
        }
        else {
            /* set backwards highlight */
            $(this.highlightElement).css('margin-left', (this.highlightEnd+this.waveformLeft)+'px').css('width', (this.highlightStart-this.highlightEnd)+'px');            
        }
    }
}

/**
 *  set_waveform_left
 *  A set function for the waveformLeft member variable.  This should be called whenver the waveform's position is 
 *  changed.
 **/
Highlighter.prototype.set_waveform_left = function(left) {
    /* *1 just to make sure we are treating as number, not string */
    this.waveformLeft = left*1;
}
