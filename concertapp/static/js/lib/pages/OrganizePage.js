/**
 *  @file       OrganizePage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panels and widgets for the organize page.
 *	@class
 **/
function OrganizePage(params) {
    if(params) {
        this.init(params);
    }
}
OrganizePage.prototype = new LoggedInPage();

OrganizePage.prototype.init = function(params) {
    LoggedInPage.prototype.init.call(this, params);

    /*  Create waveform viewer panel */
    this.viewerPanel = new WaveformViewerPanel({
        page: this, 
        container: $('#waveform_viewer_panel'), 
    });
    
    
    /* Create the audio list panel */    
    this.audioListPanel = new AudioListPanel({
        page: this, 
        container: $('#audio_list_panel'), 
        fileWidgetTemplate: $('#file_widget_template'), 
        segmentWidgetTemplate: $('#segment_widget_template')
    });
    
}