/**
 *  @file       OrganizePage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panels and widgets for the organize page.
 *	@class
 *  @extends    LoggedInPage
 **/
var OrganizePage = LoggedInPage.extend({
    _initializeModelManager: function(params) {
        return new OrganizePageModelManager(params);
    }, 
    _initializeViews: function() {
        LoggedInPage.prototype._initializeViews.call(this);
        /*  Create waveform overview panel */
        this.overviewPanel = new OverviewWaveformPanel({
            page: this, 
            el: $('#overview_waveform_panel'),
            selectedAudioSegments: modelManager.selectedAudioSegments,
            selectedAudioFiles: modelManager.selectedAudioFiles
        });

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
        
    }, 
});
