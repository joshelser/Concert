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
        container: $('#upload_panel_container'), 
        fileChooserContainer: $('#choose_file_container'), 
        fileChooserTemplate: $('#file_chooser_template'), 
        uploadFormElement: $('#server_upload_form'),
        fileCount: 0, 
    });
    
}

/**
 *  This is what happens when files are selected in the upload form.
 **/
function uploadFileBehavior() {
    /* When files are selected */
    $('#file_uploader').bind('change', function(){
        /* get the files that have been selected */
        var files = this.files;
        
        /* Document fragment that we will temporarily store the file rows in */
        var out = document.createDocumentFragment();
        /* This is the template for each file row */
        var fileRowTemplate = $('#selected_file');
        
        /* For each file chosen, create row in table */
        for(i = 0, il = files.length; i < il; i++) {
            var file = files[i];
            
            out.appendChild(fileRowTemplate.tmpl({
                filename: file.fileName,
                jsid: i, 
            }).get(0));
        }
        
        /* Clear table, and display the file rows */
        $('#files_table').html('').append(out);
    });
    
    $('#upload_submit_button').click(function() {
        /* Put first chosen file in hidden form */
        var files = $('#file_uploader').attr('files');
        
        var serverFiles = $('#server_upload_file').attr('files');
        serverFiles.push(files[0]);
        
        files = $('#server_upload_file').attr('files');
        console.log('files:');
        console.log(files);
        
        var options = {
            dataType: 'xml',
            beforeSubmit: function(arr, form, options) {
                console.log('beforeSubmit');
            },
            success: function(data, status, xhr) {
                console.log('success');
            }
        };

        $('#server_upload_form').ajaxSubmit(options);
    });    
    
    
}