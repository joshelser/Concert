/**
 *  @file       UploadPage.js
 *  All of the panels associated with the Upload Page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
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
        container: $('#upload_audio_panel'), 
        fileChooserContainer: $('#choose_file_container'), 
        fileChooserTemplate: $('#file_chooser_template'), 
        uploadFormElement: $('#server_upload_form'),
        uploadFileWidgetTemplate: $('#uploadfilewidget_template'), 
        filesTable: $('#files_table'),
        uploadButtonElement: $('#upload_submit_button'), 
        fileChooserLabel: $('#file_uploader_label'), 
        statusContainer: $('#status_container'),
        statusDots: $('#status_animated_dots')
    });
    
}