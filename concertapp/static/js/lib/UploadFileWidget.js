/**
 *  @file       UploadFileWidget.js
 *  The widget that represents a file in the list of files the user has selected for
 *  uploading.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function UploadFileWidget(params) {
    if(params) {
        this.init(params);
    }
}
UploadFileWidget.prototype = new Widget();

/**
 *  @param  fileChooser         jQuery HTMLInputElement - that was used to select
 *                                  this file.
 **/
UploadFileWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    var fileChooser = params.fileChooser;
    if(typeof(fileChooser) == 'undefined') {
        throw new Error('params.fileChooser is undefined');
    }
    else if(fileChooser.length == 0) {
        throw new Error('fileChooser not found');
    }
    this.fileChooser = fileChooser;
    
    

    
}

/**
 *  This should be called when the file associated with this widget is to be
 *  uploaded.
 **/
UploadFileWidget.prototype.startUpload = function() {
    /* Get actual upload form that we must inject our fileChooser <input> element
        into */
    var actualUploadForm = this.panel.uploadFormElement;
    
    /* Put our file chooser into this form */
    actualUploadForm.html(this.fileChooser);
    
    /* Options for ajaxSubmit plugin */
    var options = {
        dataType: 'json',
        beforeSubmit: function(arr, form, options) {
            console.log('beforeSubmit');
        },
        success: function(data, status, xhr) {
            if(typeof(data.status) != 'undefined' && data.status == 'success') {
                /* File started uploading successfully, now we can track progress. */
                
            }
            else {
                com.concertsoundorganizer.notifier.alert({
                    'title': 'Error', 
                    'content': 'An error occurred while uploading.  Please try again.'
                });
            }
        }
    };

    actualUploadForm.ajaxSubmit(options);
};

UploadFileWidget.prototype.startProgressTracking = function() {
    
};
