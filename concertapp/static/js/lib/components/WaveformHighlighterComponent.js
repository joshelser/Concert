/**
 *  @file       WaveformHighlighterComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  The component that allows for highlighting functionality on a WaveformPanel.
 *  @class
 *  @extends    Component
 *  @throws     Highlight   -   When a section of the waveform is highlighted.
 **/
var WaveformHighlighterComponent = Component.extend({
    initialize: function() {
        Component.prototype.initialize.call(this);
        
        var params = this.options;
        
        var el = this.el;
        
        
        /* Determine if highlight is currently disabled (incase someone messes 
        with template) */
        if(el.hasClass('disabled')) {
            this.disabled = true;
        }
        else {
            this.disabled = false;
        }
        
        /* If we are currently dragging a highlight */
        this.dragging = false;
        
        /* Where the last drag started (x-coordinate) */
        this.lastDragStartX = null;
        
        /* Where the last drag point was (x-coordinate) */
        this.lastDragEndX = null;
        
        /* Cache the duration of the current audio file (we will need it each time
        we highlight) */
        this.audioFileDuration = null;
    }, 
    
    _initializeElements: function() {
        Component.prototype._initializeElements.call(this);
        
        
        /* Get highlight element inside this container */
        var highlight = this.el.children('.highlight');
        if(typeof(highlight) == 'undefined') {
            throw new Error('this.el.children(\'.highlight\') is undefined');
        }
        else if(highlight.length == 0) {
            throw new Error('highlight not found');
        }
        this.highlight = highlight;
        

    },
    
    _initializeEvents: function(){
        Component.prototype._initializeEvents.call(this);
        
        /* The element that we are receiving the drag events from (should be defined
        in child classes) */
        var el = this.el;
        
        el.bind('mousedown', function(me) {
            return function(e) {
                e.stopPropagation();
                
                me.startDrag(get_event_x(e));
            };
        }(this));
        
        el.bind('mousemove', function(me) {
            return function(e) {
                e.stopPropagation();
                
                if(me.dragging) {
                    me.continueDrag(get_event_x(e));
                }
            };
        }(this));
        
        el.bind('mouseup', function(me) {
            return function(e) {
                e.stopPropagation();
                
                me.endDrag(get_event_x(e));
            };
        }(this));
    }, 
    
    /**
     *  When a drag is started.
     *
     *  @param  {Number}    x    -  The x-coordinate where the drag began.
     **/
    startDrag: function(x) {
        /* Reset any old highlight */
        this.reset();
        /* Make highlight visible */
        this.enable();
        /* Save new starting point */
        this.lastDragStartX = x;
        /* We are now dragging */
        this.dragging = true;
    }, 
    
    /**
     *  When a drag is continuing.  Called on every mousemove event.
     *
     *  @param  {Number}    x   -   The x-coordinate where the drag is currently.
     **/
    continueDrag: function(x) {
        this.lastDragEndX = x;
        
        this.draw_highlight();
    }, 
    
    /**
     *  When a drag has stopped.
     *
     *  @param  {Number}    x    -  The x-coordinate where the drag has stopped.
     **/
    endDrag: function(x) {
        this.lastDragEndX = x;
        
        this.dragging = false;
        
        /* Now determine what the time of the highlight was relative to the audio
        file */
        var dragStartX = this.lastDragStartX;
        var dragEndX = x;
        /* If this was just a click */
        if(dragStartX == dragEndX) {
            /* Don't do anything */
            return;
        }
        var startTime = Math.min(dragStartX, dragEndX)/10;
        var endTime = Math.max(dragStartX, dragEndX)/10;
        
        /* Tell panel about highlight */
        this.panel.new_waveform_highlight(startTime, endTime);
        
    }, 
    
    draw_highlight: function() {
        var start = this.lastDragStartX;
        var end = this.lastDragEndX;
        
        /* If the drag is left to right */
        if(start < end) {
            this.highlight.css({
                left: start+'px', 
                width: (end-start)+'px' 
            });
        }
        /* If the drag is from right to left */
        else if(start > end) {
            this.highlight.css({
                left: end+'px', 
                width: (start-end)+'px'
            });
        }
    }, 
    
    /**
     *  When an audio file has been selected.  Called from panel.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The audio file object.
     **/
    audio_file_selected: function(selectedAudioFile) {
        
        var audioFileDuration = selectedAudioFile.get('duration');
        this.audioFileDuration = audioFileDuration;
        
        /* Set width of highlight container element properly */
        this.el.css('width', audioFileDuration*10+'px');
    }, 
    
    /**
     *  When this highlight is being used.  Make sure it is visible on UI.
     **/
    enable: function() {
        this.disabled = false;
        this.highlight.removeClass('disabled');
    }, 
    
    /**
     *  When this highlight is not being used.  It will not be shown on the screen.
     **/
    disable: function() {
        this.disabled = true;
        this.highlight.addClass('disabled');            
    }, 
    
    /**
     *  When the highlight is to be reset.  This will reset the width to 0.
     **/
    reset: function() {
        this.highlight.css({
            width: '0px'
        });
    }

});
