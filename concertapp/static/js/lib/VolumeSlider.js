/**
 *  @file VolumeSlider.js
 *  VolumeSlider.js contains all of the functionality associated with the VolumeSlider class.
 **/

/**
 *  VolumeSlider is the constructor for a VolumeSlider object.
 *  
 *  @return             this                    Constructor
 **/

var VolumeSlider = function(params) {
    
    /** Initialize Members **/
    this.sliderElement = $('#'+params.sliderID).get(0);
    if(typeof(this.sliderElement) == 'undefined') {
        throw new Error('VolumeSlider: Unable to initialize sliderElement.');
    }
    
    this.handleElement = $('#'+params.handleID).get(0);
    if(typeof(this.handleElement) == 'undefined') {
        throw new Error('VolumeSlider: Unable to initialize handlElement.');
    }
    
    /** Boolean for when dragging */
    this.dragging = 0;
    
    /**
     *  Interface behavior
     **/
    $(this.sliderElement).bind('mousedown', slider_mouse_down_behavior(this));
    $(this.handleElement).bind('mousedown', slider_mouse_down_behavior(this));
    /** Mouse move and up behaviors are bound to document so you can drag off the slider */
    $(document).bind('mousemove', slider_mouse_move_behavior(this));
    $(document).bind('mouseup', slider_mouse_up_behavior(this));
    
    
    
    
    return this;
}

/**
 *  slider_mouse_down_behavior
 *  This is what happens when the slider (or handle) is initially clicked.  The dragging
 *  member variable is set.
 *
 *  @param              volumeSliderObject              The VolumeSlider object.
 **/
var slider_mouse_down_behavior = function(volumeSliderObject) { return function(event){
    event.preventDefault();
    volumeSliderObject.dragging = 1;
    
}}

/**
 *  slider_mouse_move_behavior
 *  This is the behavior when the slider or handle is being dragged.
 *
 *  @param              volumeSliderObject              The VolumeSlider object.
 **/
var slider_mouse_move_behavior = function(volumeSliderObject){ return function(event){
    
    /* If we are dragging the slider */
    if(volumeSliderObject.dragging) {
        event.preventDefault();
        
        /* Get width of slider */
        var maxX = $(volumeSliderObject.sliderElement).css('width').match(/[\d]+/)*1;
        
        /* get x coordinate of event relative to slider */
        var x = get_event_x(volumeSliderObject.sliderElement, event);
        
        /* Make sure handle doesn't slide off left of slider */
        if(x < 0) {
            x = 0;
        }
        /* Make sure handle doesn't slide off right of slider */
        if(x > maxX) {
            x = maxX;
        }
        
        /* Change margin-left of handle to new value */
        $(volumeSliderObject.handleElement).css('margin-left', x);
    }
}}

/**
 *  slider_mouse_up_behavior
 *  This is the behavior when the slider or handle is "let go" by the mouse.
 *
 *  @param              volumeSliderObject              The VolumeSlider object.
 **/
var slider_mouse_up_behavior = function(volumeSliderObject){ return function(event){
    /* if we have been dragging */
    if(volumeSliderObject.dragging) {
        event.preventDefault();
        volumeSliderObject.dragging = 0;
    }
}}