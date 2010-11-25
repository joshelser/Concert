/**
 *  @file       UploadFileWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The widget that represents a file in the list of files the user has selected for
 *  uploading.
 *	@class
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
    
    
    
    var container = this.container;
    var id = this.id;
    
    /* Get the file loading progress element */
    this.progressElement = container.find('#uploadfilewidget_progress-'+id);
    
    /* The collection select element */
    this.collectionSelectElement = container.find('#uploadfilewidget_collection_selector-'+id);
    
    
    /* We will save the unique upload_id for our file */
    this.upload_id = null;
    
    /* Are we currently tracking our progress? */
    this.progressTracking = false;
    
    /* The delay between progress tracking requests */
    this.progressTrackingDelay = 400;
    
}

/**
 *  What we should do in the event of an upload error.
 **/
UploadFileWidget.prototype.handleUploadError = function(data) {
    com.concertsoundorganizer.notifier.alert({
        'title': 'Error', 
        'content': 'An error occurred while uploading.  Sorry!\n\n'+data
    });
    
    
    this.stopProgressTracking();
    
    this.panel.handleUploadError();
};


/**
 *  This should be called when the file associated with this widget is to be
 *  uploaded.
 **/
UploadFileWidget.prototype.startUpload = function() {
    /* Reserve upload_id, then start uploading file */
    this.reserveUploadId();
} 

/**
 *  Reserves an upload_id in the server's cache, so we can keep track of 
 *  the progress of our upload.  Once this is complete, we move on to actually
 *  uploading the file.
 **/
UploadFileWidget.prototype.reserveUploadId = function() {
    /* Get actual upload form that we must inject our fileChooser <input> element
        into */
    var actualUploadForm = this.panel.uploadFormElement;
    
    /* Put our file chooser into this form */
    actualUploadForm.html(this.fileChooser);
    
    /* Get unique upload id */
    $.ajax({
        dataType: 'json',
        url: 'get_id/', 
        success: function(me) {
            return function(data, status, xhr) {
                if(typeof(data.status) != 'undefined' && data.status == 'success') {
                    /* We have a unique upload_id now. */
                    me.upload_id = data.upload_id;
                
                    /* Move forward */
                    me.uploadFile();
                }
                else {
                    me.handleUploadError(data);
                }
            };
        }(this)
    });
};

/**
 *  Actually upload the file.  This can only occur after we have received an
 *  upload_id from the server.
 **/
UploadFileWidget.prototype.uploadFile = function() {
    
    /* Make sure we have an upload_id */
    if(this.upload_id == null) {
        throw new Error('this.upload_id has not been set.  Please reserve an upload_id before uploading the file.');
    }
    
    /* Get actual upload form that we must inject our fileChooser <input> element
        into */
    var actualUploadForm = this.panel.uploadFormElement;
    
    /* Put our file chooser into this form */
    actualUploadForm.html(this.fileChooser);
    
    /* Put our upload_id into this form as well*/
    actualUploadForm.append($('<input />').attr({
        type: 'hidden', 
        name: 'upload_id', 
        id: 'upload_id',         
        value: this.upload_id, 
    }));
    
    /* Put our collection select element into the form */
    actualUploadForm.append(this.collectionSelectElement);
    
    /* Get unique upload id */
    actualUploadForm.ajaxSubmit({
        /* This will return an XML document (since we are psuedo-hacking a form) */
        dataType: 'text',
        url: '/audio/upload/?upload_id='+this.upload_id,
        beforeSubmit: function(arr, form, options) {
        },
        success: function(me) {
            return function(data, status, xhr) {
                if(data.match('<pre style="word-wrap: break-word; white-space: pre-wrap;">success</pre>')) {
                    
                    /* The file was hopefully uploaded */
                    me.encodingWaiting = false;
                    
                    com.concertsoundorganizer.notifier.alert({
                        title: 'Success!', 
                        content: 'Your file uploaded successfully.', 
                    });
                    
                }
                else {
                    me.handleUploadError(data);
                }
            };
        }(this)
    });
    
    this.startProgressTracking();
    
};


/**
 *  This should be called initially when the file is starting to upload.  It will
 *  start the checking of upload progress.
 **/
UploadFileWidget.prototype.startProgressTracking = function() {
    this.progressTracking = true;
    
    this.checkOnProgress();
};

/**
 *  send a request to the server with our upload_id to receive file upload progress
 *  back.
 **/
UploadFileWidget.prototype.checkOnProgress = function() {
    /* We will send a request to the server with our upload_id */
    $.ajax({
        url: 'progress/'+this.upload_id,
        dataType: 'json',
        success: function(me) {
            return function(data, status, xhr) {
                me.updateProgress(data);

                /* In progressTrackingDelay ms, check on progress again */
                if(me.progressTracking) {
                    setTimeout(function(me){
                        return function() {
                            me.checkOnProgress();
                        };
                    }(me), me.progressTrackingDelay);        
                }
                else if(me.encodingWaiting) {
                    me.encodingWaitingNotification();
                }
            };
        }(this)
    });
};


/**
 *  Should be called whenever the progress slider is to be updated.
 **/
UploadFileWidget.prototype.updateProgress = function(data) {
    
    var progress = null;
    if(data == null) {
        /* Complete! */
        progress = 1;
        /* Stop progress tracking */
        this.progressTracking = false;
        /* We are waiting for encoding to finish */
        this.encodingWaiting = true;
    }
    else {
        var uploaded = data.uploaded;
        var length = data.length;
        
        if(uploaded == 0 && length == 0) {
            progress = 0;
        }
        else {
            progress = uploaded/length;
        }
        
    }
    
    /* Update progress slider */
    this.progressElement.attr('value', progress);
};

/**
 *  This should be called when the file has finished uploading, and we are
 *  just waiting for it to encode.  This displays the "inifinite" progress bar.
 **/
UploadFileWidget.prototype.encodingWaitingNotification = function() {
    this.progressElement.removeAttr('value');
    
};





/**
 *  This should be called when the upload is complete.
 **/
UploadFileWidget.prototype.stopProgressTracking = function() {
    this.progressTracking = false;
};



