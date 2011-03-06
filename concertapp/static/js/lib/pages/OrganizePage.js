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
    
    var modelManager = this.modelManager;
    
    /*  Create waveform overview panel 
    this.viewerPanel = new OverviewWaveformPanel({
        page: this, 
        container: $('#waveform_viewer_panel'), 
    });*/
    
    /* Create waveform detail panel */
    this.detailPanel = new DetailWaveformPanel({
        page: this, 
        el: $('#detail_waveform_panel'),
        selectedAudioSegments: modelManager.selectedAudioSegments,
        selectedAudioFiles: modelManager.selectedAudioFiles 
    });
    
    
    /* Create the audio list panel */    
    this.audioListPanel = new AudioListPanel({
        page: this, 
        el: $('#audio_list_panel'),
        files: modelManager.collectionAudioFiles,
        segments: modelManager.collectionAudioSegments
    });

    
    
    this.modelManager.loadData();
}

OrganizePage.prototype.createModelManager = function(params) {
    return new OrganizePageModelManager(params);
};