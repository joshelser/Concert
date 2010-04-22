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
        throw new Error('VolumeSlider: Unable to initialize handleElement.');
    }
    
    /** Boolean for when dragging */
    this.dragging = 0;
    
    this.set_audio_element(params.audioID);
    
    /* Slider width */
    this.sliderWidth = $(this.sliderElement).css('width').match(/[\d]+/)*1;
    /* handle position */
    this.handlePosition = $(this.handleElement).css('margin-left').match(/[\d]+/)*1;
    
    /**
     *  Interface behavior
     **/
    $(this.sliderElement).bind('mousedown', function(volumeSliderObject){ return function(event){ volumeSliderObject.slider_mouse_down_behavior(event); } }(this));
    $(this.sliderElement).bind('click', function(volumeSliderObject){ return function(event){ volumeSliderObject.slider_click_behavior(event); } }(this));
    $(this.handleElement).bind('mousedown', function(volumeSliderObject){ return function(event){ volumeSliderObject.slider_mouse_down_behavior(event); } }(this));
    /** Mouse move and up behaviors are bound to document so you can drag off the slider */
    $(document).bind('mousemove', function(volumeSliderObject){ return function(event){ volumeSliderObject.slider_mouse_move_behavior(event); } }(this));
    $(document).bind('mouseup', function(volumeSliderObject){ return function(event){ volumeSliderObject.slider_mouse_up_behavior(event); } }(this));
    
    
    
    
    return this;
}

/**
 *  set_audio_element
 *  Sets the VolumeSlider's audio element.  This should be called whenever the audio element on the page changes.
 *
 *  @param              audioID             the id of the audio element on the page.
 **/
VolumeSlider.prototype.set_audio_element = function(audioID) {
    this.audioElement = $('#'+audioID).get(0);
    if(typeof(this.audioElement) == 'undefined') {
        throw new Error('VolumeSlider: Unable to initialize audioElement');
    }
    
}

/**
 *  slider_mouse_down_behavior
 *  This is what happens when the slider (or handle) is initially clicked.  The dragging
 *  member variable is set.
 *
 **/
VolumeSlider.prototype.slider_mouse_down_behavior = function(event){
    event.preventDefault();
    this.dragging = 1;
    
}

/**
 *  slider_click_behavior
 *  This is what is called when the slider is clicked (as opposed to dragged).
 *  Handle instantly moves to location and volume is changed.
 **/
VolumeSlider.prototype.slider_click_behavior = function(event) {
    event.preventDefault();
    
    /* Get x coordinate of event relative to slider */
    var x = get_event_x(this.sliderElement, event);
    
    /* change handle position */
    this.handlePosition = x;
    /* animate and change volume */
    this.trigger_volume_change();
}

/**
 *  slider_mouse_move_behavior
 *  This is the behavior when the slider or handle is being dragged.
 *
 **/
VolumeSlider.prototype.slider_mouse_move_behavior = function(event){
    
    /* If we are dragging the slider */
    if(this.dragging) {
        event.preventDefault();
        
        /* Get width of slider */
        var maxX = this.sliderWidth;
        
        /* get x coordinate of event relative to slider */
        var x = get_event_x(this.sliderElement, event);
        
        /* Make sure handle doesn't slide off left of slider */
        if(x < 0) {
            x = 0;
        }
        /* Make sure handle doesn't slide off right of slider */
        if(x > maxX) {
            x = maxX;
        }
        
        this.handlePosition = x;
        this.trigger_volume_change();
    }
}

/**
 *  slider_mouse_up_behavior
 *  This is the behavior when the slider or handle is "let go" by the mouse.
 *
 **/
VolumeSlider.prototype.slider_mouse_up_behavior = function(event){
    /* if we have been dragging */
    if(this.dragging) {
        event.preventDefault();
        this.dragging = 0;
        
        /* Change volume */
        this.trigger_volume_change();
    }
}

/**
 *  trigger_volume_change
 *  Triggers the volume change event, sending out the volume level.  This should be
 *  called whenever the volume is changed, and the audio element associated with this
 *  volume bar should handle this event.
 *
 *  @event              change_volume           data = { volume: float for volume level }
 **/
VolumeSlider.prototype.trigger_volume_change = function(){
    var data = {
        volume : this.handlePosition/this.sliderWidth
    };

    /* Change margin-left of handle to new value */
    $(this.handleElement).css('margin-left', this.handlePosition+'px');
    
    /* trigger change volume event on associated audio element */
    $(this.audioElement).trigger('change_volume', data);
}

/**
 *  change_volume
 *  Used to change the run the volume change event based on an incoming volume value.
 *
 *  @param          volume          The float value of the volume (0.0 - 1.0)
 **/
VolumeSlider.prototype.change_volume = function(volume) {
    /* Get x value of handle */
    var x = volume*this.sliderWidth;
    /* Move handle to proper location */
    $(this.handleElement).css('margin-left', x+'px');
    /* Trigger volume change event */
    $(this.audioElement).trigger('change_volume', {volume: volume});
}

