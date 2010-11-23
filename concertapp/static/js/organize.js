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
    /* This is probably going to be a different kind of button in the future */
    var audioSwitcherButton = new LargeIconButton({
        container: $('#audiolist_switcher_button')
    });
    
    var audioListPanel = new AudioListPanel({
        container: $('#audio_list_panel'), 
        fileWidgetTemplate: $('#file_widget_template'), 
        segmentWidgetTemplate: $('#segment_widget_template'), 
    });
    
    
    
    
    
}