/**
 *  @file       upload.js
 *  Includes all functionality associated with pages that are specific to the audio 
 *  upload page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeUploadPage() {
    
    /**
     *  Create UploadPanel
     **/
    var uploadPanel = new UploadPanel({
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