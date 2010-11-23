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
    
    /* Create the button to switch the audio panel. */
    /* This is probably going to be a different kind of button in the future */
    var audioSwitcherSegmentsButton = new LargeIconButton({
        container: $('#audiolist_switcher_segments_button')
    });
    var audioSwitcherFilesButton = new LargeIconButton({
        container: $('#audiolist_switcher_files_button')
    });
    
    /* Create the audio list panel */    
    var audioListPanel = new AudioListPanel({
        container: $('#audio_list_panel'), 
        fileWidgetTemplate: $('#file_widget_template'), 
        segmentWidgetTemplate: $('#segment_widget_template'), 
        audioSwitcherSegmentsButton: audioSwitcherSegmentsButton,
        audioSwitcherFilesButton: audioSwitcherFilesButton, 
    });
    
    
    
    
    
}