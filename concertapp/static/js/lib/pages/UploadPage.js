/**
 *  @file       UploadPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  All of the panels associated with the Upload Page.
 *	@class
 **/
function UploadPage(params) {
    if(params) {
        this.init(params);
    }
}
UploadPage.prototype = new LoggedInPage();

UploadPage.prototype.init = function(params) {
    LoggedInPage.prototype.init.call(this, params);
    
    /**
     *  Create UploadPanel
     **/
    this.uploadPanel = new UploadPanel({
        page: this, 
        el: $('#upload_audio_panel')
    });
    
    
    this.modelManager.loadData();
    
    
}