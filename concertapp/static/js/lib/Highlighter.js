/**
*  @file   Highlighter.js
*  Highlighter.js contains all the functionality associated with the Highlighter class.
**/

/**
*  Highlighter
*  The constructor for a highlighter object.
*
*  @param          params                      Params list. {highlightElement, container, waveformElement, waveformWidth, audioElementDuration}
*  @return         this                        Constructor.
**/
var Highlighter = function(params) {

    if(typeof(params) != 'undefined') {
        this.initialize(params);            
    }
    return this;    
}

Highlighter.prototype.initialize = function(params) { 
    /* Initialize members. */

    /* highlightElement is the element that is the actual highlight */
    this.highlightElement = params.highlightElement;
    if(typeof(this.highlightElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize highlightElement.');
    }

    /* Container of the entire waveform editor */
    this.container = params.container;
    if(typeof(this.container) == 'undefined') {
        throw new Error('Highlighter: Could not initialize container.');
    }

    /* waveform image element */
    this.waveformElement = params.waveformElement;
    if(typeof(this.waveformElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize waveformElement.');
    }

    /* waveform image width */
    this.waveformWidth = params.waveformWidth;
    if(typeof(this.waveformWidth) == 'undefined') {
        throw new Error('Highlighter: Could not initialize waveformWidth');
    }

    /* associated audioElement */
    this.audioElement = params.audioElement;
    if(typeof(this.audioElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize audioElement.');
    }

    /* Static highlight element, on which events must be watched if it is in the same location */
    this.staticHighlightElement = params.staticHighlightElement;
    if(typeof(this.staticHighlightElement) == 'undefined'){
        this.staticHighlightElement = null;
    }

    /** image container element is watched for highlighting as well **/
    this.imageContainerElement = params.imageContainerElement;
    if(typeof(this.imageContainerElement) == 'undefined') {
        this.imageContainerElement = null;
    }

    /* duration of associated audio */
    this.audioElementDuration = this.audioElement.duration;


    /* initialize highlight start and highlight end members */
    this.initialize_highlight();

    /* initialize waveformLeft */
    this.set_waveform_left($(this.waveformElement).css('left').match(/[\d\.]+/));

    /* Highlighting behavior */
    /* start highlight on mousedown */
    $(this.waveformElement).mousedown(function(obj){ return function(event) { obj.start_drag(event); } }(this));
    $(this.highlightElement).mousedown(function(obj){ return function(event){ obj.start_drag(event); }}(this));
    if(this.staticHighlightElement != null) {
        /* Also watch mouse events on static highlight element */
        $(this.staticHighlightElement).mousedown(function(obj){ return function(event){ obj.start_drag(event); }}(this));
        $(this.staticHighlightElement).mousemove(function(obj){ return function(event){ obj.continue_drag(event); }}(this));
    }
    if(this.imageContainerElement != null){
        $(this.imageContainerElement).mousedown(function(obj){ return function(event){ obj.start_drag(event); }}(this));
        $(this.imageContainerElement).mousemove(function(obj){return function(event) { obj.continue_drag(event); } }(this));
    }
    /* continue highlight on mousemove */
    $(this.waveformElement).mousemove(function(obj){return function(event) { obj.continue_drag(event); } }(this));
    $(this.highlightElement).mousemove(function(obj){ return function(event){ obj.continue_drag(event); }}(this));
    /* end highlight on mouseup (use body for this incase they drag off the image) */
    $(document).mouseup(function(obj){return function(event) { obj.end_drag(event); } }(this));
}

/**
*  start_drag
*  Begins the dragging process.  Should be called on mousedown over the waveform to be highlighted.
*  
*  @param          event           The mousedown event.
**/
Highlighter.prototype.start_drag = function(event) {
    event.preventDefault();
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
    event.preventDefault();
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
    event.preventDefault();
    if(this.dragging) {
        /* Dragging has stopped */
        this.dragging = 0;

        this.trigger_highlight();                    
    }
}

/**
*  trigger_highlight
*  Triggers a loop or clear_loop event on the audio element, setting the audio loop.
**/
Highlighter.prototype.trigger_highlight = function() {

    /* put highlight values in proper order */
    if(this.highlightStart < this.highlightEnd) {
        var highlightStartPx = this.highlightStart;
        var highlightEndPx = this.highlightEnd;
    }
    else {
        var highlightStartPx = this.highlightEnd;
        var highlightEndPx = this.highlightStart;
    }

    /* if we just ended a highlight */
    if(highlightStartPx != -1 && highlightEndPx != -1) {
        
        /* Get start and end times in terms of percent of song */
        var startTimePerc = highlightStartPx/this.waveformWidth;
        var endTimePerc = highlightEndPx/this.waveformWidth;
        
        /* Calculate start and end times in seconds */
        var startTime = startTimePerc*this.audioElementDuration;
        var endTime = endTimePerc*this.audioElementDuration;
        
        /* Normalize, in case the highlight started beyond the beginning or end */
        if(startTime < 0) {
            startTime = 0;
        }
        if(endTime < 0) {
            endTime = 0;
        }
        if(endTime > this.audioElementDuration) {
            endTime = this.audioElementDuration;
        }
        if(startTime > this.audioElementDuration) {
            startTime = this.audioElementDuration;
        }
        
        /* If highlight isn't even in the audio file */
        if(startTime == endTime) {            
            /* Trigger clear loop event */
            $(this.audioElement).trigger('clear_loop');
        }
        else {
            var highlightData = {
                start: startTime,
                end: endTime
            };

            /* Trigger clear loop event */
            $(this.audioElement).trigger('clear_loop');
            /* Trigger loop event on audio element */
            $(this.audioElement).trigger('loop', highlightData);
            
        }

    }
    /* If we just cleared a highlight */
    else {
        /* Trigger clear loop event */
        $(this.audioElement).trigger('clear_loop');
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

/**
*  set_highlight_time
*  Sets the highlight based on time values sent as parameters.
*
*  @param          data        {start, end, [noTrigger]}
**/
Highlighter.prototype.set_highlight_time = function(data) {

    /* default value for noTrigger */
    if(typeof(data.noTrigger) == 'undefined') {
        data.noTrigger = false;
    }
    var startTimePerc = data.start/this.audioElementDuration;
    var endTimePerc = data.end/this.audioElementDuration;

    this.highlightStart = startTimePerc*this.waveformWidth;
    this.highlightEnd = endTimePerc*this.waveformWidth;

    this.draw_highlight();
    if(!data.noTrigger) {
        this.trigger_highlight();        
    }
}

