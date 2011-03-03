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
        
        

        _.bindAll(this, "render");
    },
    
    /**
     *  When this highlight is being used.  Make sure it is visible on UI.
     **/
    enable: function() {
        this.disabled = false;
        el.removeClass('disabled');
    }, 
    
    /**
     *  When this highlight is not being used.  It will not be shown on the screen.
     **/
    disable: function() {
        this.disabled = true;
        el.addClass('disabled');            
    }, 

});
