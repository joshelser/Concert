/**
 *  @file       UploadPanel.js
 *  The panel that contains the upload form for the user to upload multiple files.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function UploadPanel(params) {
    if(params) {
        this.init(params);
    }
}
UploadPanel.prototype = new Panel();

/**
 *  @param  uploadFormElement        jQuery HTMLFormElement - the actual form that
 *                                      will be used to send to the server.
 *  @param  fileChooserContainer    jQuery HTMLDivElement - the container for
 *                                  the file chooser <input> element.  
 *  @param  fileChooserTemplate        jQuery tmpl script object for creating the
 *                                  file chooser <input> element.
 **/
UploadPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    /* We will keep the filewidgets here, indexed by their order */
    this.files = [];
    
    /* We will also keep the filewidgets here, but remove them when they start
        uploading */
    this.filesToUpload = [];
    
    /* The form we will change each time we upload a file */
    var uploadFormElement = params.uploadFormElement;
    if(typeof(uploadFormElement) == 'undefined') {
        throw new Error('params.uploadFormElement is undefined');
    }
    this.uploadFormElement = uploadFormElement;
    
    var fileChooserContainer = params.fileChooserContainer;
    if(typeof(fileChooserContainer) == 'undefined') {
        throw new Error('params.fileChooserContainer is undefined');
    }
    this.fileChooserContainer = fileChooserContainer;
    
    var fileChooserTemplate = params.fileChooserTemplate;
    if(typeof(fileChooserTemplate) == 'undefined') {
        throw new Error('params.fileChooserTemplate is undefined');
    }
    this.fileChooserTemplate = fileChooserTemplate;
    
    
    /* The current file chooser that the user can see */
    this.currentFileChooser = null;
    
    
    this.createNewFileChooser();
}

/**
 *  Increment this.count member variable, and create the new "file chooser".  Then
 *  put this in the appropriate location in the DOM.
 **/
UploadPanel.prototype.createNewFileChooser = function() {
    var chooser = this.fileChooserTemplate.tmpl({
        id: ++this.count, 
    });
    
    this.fileChooserContainer.append(chooser);
};


/**
 *  This should be called when the user selects a file.  It will add the file to 
 *  the queue, as well as to the 'file_list' in the DOM.  This will be done by
 *  creating a new UploadingFileWidget, and moving the inputElement into the
 *  widget.
 *
 *  @param  inputElement        jQuery HTMLInputElement - the <input> element that 
 *                              the user used to select this file.
 **/
UploadPanel.prototype.addFile = function(inputElement) {
    
};
