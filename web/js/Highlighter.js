/**
 *  @file   Highlighter.js
 *  Highlighter.js contains all the functionality associated with the Highlighter class.
 **/
 
var Highlighter = function(WaveformEditorObj) {
    
    /* Set container element member and highlight element member.  */
    this.highlightElement = WaveformEditorObj.highlightElement;
    if(typeof(this.highlightElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize highlightElement.');
    }
    this.container = WaveformEditorObj.container;
    if(typeof(this.container) == 'undefined') {
        throw new Error('Highlighter: Could not initialize container.');
    }
    this.waveformElement = WaveformEditorObj.waveformElement;
    if(typeof(this.waveformElement) == 'undefined') {
        throw new Error('Highlighter: Could not initialize waveformElement.');
    }
    this.waveformWidth = WaveformEditorObj.waveformWidth;
    if(typeof(this.waveformWidth) == 'undefined') {
        throw new Error('Highlighter: Could not initialize waveformWidth');
    }
    this.audioElementDuration = WaveformEditorObj.audioElement.duration;
    if(typeof(this.audioElementDuration) == 'undefined') {
        throw new Error('Highlighter: Could not initialize audioElementDuration.');
    }
    
    /* initialize highlight start and highlight end members */
    this.initialize_highlight();

    /* Highlighting behavior */
    $(this.waveformElement).mousedown(function(obj){ return function(event) { obj.start_drag(event); } }(this));
    $(this.waveformElement).mousemove(function(obj){return function(event) { obj.continue_drag(event); } }(this));
    $(this.container).mouseup(function(obj){return function(event) { obj.end_drag(event); } }(this));
    
    
    return this;    
}

Highlighter.prototype.start_drag = function(event) {    
    /* Clear old highlight */
    this.initialize_highlight();
                
    /* X coordinate of click relative to element */
    this.highlightStart = get_event_x(this.waveformElement, event);
    
    /* Set variable to denote dragging is in progress */
    this.dragging = 1;
}

Highlighter.prototype.continue_drag = function(event) {
    /* if mouse is down */
    if(this.dragging){
        /* Get x location of mouse relative to element */
        this.highlightEnd = get_event_x(this.waveformElement, event);
        /* continue drawing highlight */
        this.draw_highlight();
    }    
}

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
    
Highlighter.prototype.initialize_highlight = function() {
    this.highlightStart = -1;
    this.highlightEnd = -1;
    this.draw_highlight();
}

Highlighter.prototype.draw_highlight = function() {
    
    if(this.highlightStart == -1 || this.highlightEnd == -1)
    {
        /* Clear highlight */
        $(this.highlightElement).css('margin-left', '0px').css('width', '0px');
    }
    else
    {
        /* Forward highlight */
        if(this.highlightStart < this.highlightEnd)
        {
            /* Set highlight */
            $(this.highlightElement).css('margin-left', (this.highlightStart+400)+'px').css('width', (this.highlightEnd-this.highlightStart)+'px');
        }
        else
        {
            /* set backwards highlight */
            $(this.highlightElement).css('margin-left', (this.highlightEnd+400)+'px').css('width', (this.highlightStart-this.highlightEnd)+'px');            
        }
    }
}