/**
 *  @file       organize.js
 *  All basic functionality associated with the organize page originates from here
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

function initializeOrganizePage() {
    
    
    /*  Create waveform viewer panel */
    var viewerPanel = new WaveformViewerPanel({
        container: $('#waveform_viewer_panel'), 
    });
    
    /* Create the audio list panel */
    var audioListPanel = new AudioListPanel({
        container: $('#audio_list_panel'), 
    });
    
    
    
    
    
}