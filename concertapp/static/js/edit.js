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
    
    /* Activate player controls */
    activate_controls();
    
    /* Create audio viewers and editors when audio element is ready. */
    $('audio').one('canplaythrough', function(){
        
        /* Create waveform viewer object */
        $waveformViewer = new WaveformViewer('waveform_viewer', 'audio_element');
        
        /* Create waveform editor object */
        $waveformEditor = new WaveformEditor('waveform')
    });

})();