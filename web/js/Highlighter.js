/**
 *  @file   Highlighter.js
 *  Highlighter.js contains all the functionality associated with the Highlighter class.
 **/
 
var Highlighter = function(highlightElement, container) {
    
    /* Set container element member and highlight element member.  */
    this.highlightElement = highlightElement;
    this.container = container;
    
    /* initialize highlight start and highlight end members */
    this.initialize_highlight();

    /* Highlighting behavior */
    $(this.container).mousedown(function(obj){ return function(event) { obj.start_drag(event); } }(this));
    $(this.container).mousemove(function(obj){return function(event) { obj.continue_drag(event); } }(this));
    $(this.container).mouseup(function(obj){return function(event) { obj.end_drag(event); } }(this));
    
}

Highlighter.prototype.start_drag = function(event) {    
    /* Clear old highlight */
    this.initialize_highlight();
                
    /* X coordinate of click relative to element */
    this.highlightStart = get_event_x(this.container, event);
    
    /* Set variable to denote dragging is in progress */
    this.dragging = 1;
}

Highlighter.prototype.continue_drag = function(event) {
    /* if mouse is down */
    if(this.dragging){
        /* Get x location of mouse relative to element */
        this.highlightEnd = get_event_x(this.container, event);
        /* continue drawing highlight */
        this.draw_highlight();
    }    
}

Highlighter.prototype.end_drag = function(event) {
    /* Dragging has stopped */
    this.dragging = 0;
           
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
            $(this.highlightElement).css('margin-left', this.highlightStart+'px').css('width', (this.highlightEnd-this.highlightStart)+'px');
        }
        else
        {
            /* set backwards highlight */
            $(this.highlightElement).css('margin-left', this.highlightEnd+'px').css('width', (this.highlightStart-this.highlightEnd)+'px');            
        }
    }
}