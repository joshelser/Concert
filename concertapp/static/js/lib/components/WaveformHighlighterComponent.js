/**
 *  @file       WaveformHighlighterComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  The component that allows for highlighting functionality on a WaveformPanel.
 *  @class
 *  @extends    Component
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
                
                me.startDrag(e.offsetX);
            };
        }(this));
        
        el.bind('mousemove', function(me) {
            return function(e) {
                e.stopPropagation();
                
                if(me.dragging) {
                    me.continueDrag(e.offsetX);
                }
            };
        }(this));
        
        el.bind('mouseup', function(me) {
            return function(e) {
                e.stopPropagation();
                
                me.endDrag(e.offsetX);
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
        /* Start highlight here */
        this.highlight.css('left', x+'px');
    }, 
    
    /**
     *  When a drag is continuing.
     *
     *  @param  {Number}    x   -   The x-coordinate where the drag is currently.
     **/
    continueDrag: function(x) {
        this.highlight.css('width', (x-this.lastDragStartX)+'px');
    }, 
    
    /**
     *  When a drag has stopped.
     *
     *  @param  {Number}    x    -  The x-coordinate where the drag has stopped.
     **/
    endDrag: function(x) {
        this.continueDrag(x);
        
        this.dragging = false;
        
    }, 
    
    /**
     *  When an audio file has been selected.  Called from panel.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The audio file object.
     **/
    audio_file_selected: function(selectedAudioFile) {
        /* Set width of highlight container element properly */
        this.el.css('width', selectedAudioFile.get('duration')*10+'px');
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
