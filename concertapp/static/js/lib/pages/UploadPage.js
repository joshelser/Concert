/**
 *  @file       UploadPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  All of the panels associated with the Upload Page.
 *	@class
 *  @extends    LoggedInPage
 **/
var UploadPage = LoggedInPage.extend({
    _initializeModelManager: function(params) {
        return new LoggedInModelManager(params);
    }, 
    _initializeViews: function() {
        LoggedInPage.prototype._initializeViews.call(this);
        /**
         *  Create UploadPanel
         **/
        this.uploadPanel = new UploadPanel({
            page: this, 
            el: $('#upload_audio_panel')
        });
        
    }, 
});
