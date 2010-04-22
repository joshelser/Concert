/**
*  @file edit.js
*  edit.js contains all of the functionality associated with the main page interface.
**/

/**
 * Globals for waveform viewer and editor
 **/
var $waveformViewer = null;
var $waveformEditor = null;


(function() {
    
    /* Initialize audio player */
    initialize_audio_player_behavior();
    
    
    /* Create audio viewers and editors when audio element is ready. */
    $('audio').one('canplaythrough', function(){
        
        /* Create waveform viewer object */
        $waveformViewer = new WaveformViewer('waveform_viewer', 'audio_element');
        
        /* Initialize volume slider */
        initialize_volume_slider({sliderID: 'slider', handleID: 'handle', audioID: 'audio_element'});
        /* Change volume to .8 by default */
        $volumeSlider.change_volume(0.8);
        
        
        /* Activate player controls */
        activate_controls();
        
        
    });
    

})();