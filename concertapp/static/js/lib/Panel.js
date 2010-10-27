/**
 *  @file       Panel.js
 *  Any panel that distinguishes groups of functionality on the UI.  This could be
 *  the top "global options" bar, or the waveform playback panel.  Panels will
 *  contain widgets, which may be buttons or groups of buttons.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Panel is meant to be an abstract class.  It doesn't do much on its own.
 **/
function Panel(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  Initialize the UI Panel.  Should be called from child class.
 *
 *  @param  params.container        jQuery object - container for panel  
 **/
Panel.prototype.init = function(params) {
    
    var container = params.container;
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    this.container = container;
    
    
    
}