/**
 *  @file       AudioListPanel.js
 *  Displays the segment or clip list within
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function AudioListPanel(params) {
    if(params) {
        this.init(params);
    }
}
AudioListPanel.prototype = new Panel();

/**
 *  @param  params.fileWidgetTemplate   The jquery tmpl script for a file widget  
 *  @param  params.mode                 String (optional) 'files' or 'segments' will
 *                                      be the initial mode of this panel.
 **/
AudioListPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    
    var fileWidgetTemplate = params.fileWidgetTemplate;
    if(typeof(fileWidgetTemplate) == 'undefined') {
        throw new Error('params.fileWidgetTemplate is undefined');
    }
    else if(fileWidgetTemplate.length == 0) {
        throw new Error('fileWidgetTemplate not found');
    }
    this.fileWidgetTemplate = fileWidgetTemplate;

    
    
    /*  Mode is either 'files' or 'segments', as is reflected on the UI */
    var mode = params.mode;
    if(typeof(mode) == 'undefined') {
        mode = 'files';
    }
    this.mode = mode;

    
    
    
    /* All of our file widgets */
    this.fileWidgets = null;
    
    /* All of our file widget DOM nodes */
    this.fileWidgetNodes = null;
    
    /*  The audio and segment data objects (retrieved from server) */
    this.audioData = null;
    this.segmentData = null;
    

    this.retrieveData();
}

/**
 *  Get all audio data from the server for the current collection.
 **/
AudioListPanel.prototype.retrieveData = function() {
    $.getJSON(
        /* window.location here has the collection id encoded in it */
        window.location+'/audio', 
        function(me) {
            return function(data, status, xhr){
                me.processData(data);
            };
        }(this)
    );
};

/**
 *  After we have retrieved all of the audio data from the server,
 *  process it.  Here is where all of the widgets are created.
 *
 *  @param  data        Object  raw data received from server
 **/
AudioListPanel.prototype.processData = function(data) {
    var audioData = data.audio_objects;
    var segmentData = data.segment_objects;
    
    /* We will store our fileWidgets here indexed by audio id */
    var fileWidgets = [];
    
    /* We will store all of our fileWidget nodes here indexed by their order on 
        the DOM */
    var fileWidgetNodes = [];
    
    /* Stuff we will need */
    var fileWidgetTemplate = this.fileWidgetTemplate;
    
    /* For each audio data object */
    for(i = 0, il = audioData.length; i < il; i++) {
        var audio = audioData[i];
        
        /* Create file widget */
        var fileWidget = new FileWidget({
            template: fileWidgetTemplate, 
            context: audio, 
            panel: this, 
        });
        
        /* Put widget html in document fragment so we can add it to our panel. */
        fileWidgetNodes.push(fileWidget.container.get(0));
    }
    
    this.fileWidgets = fileWidgets;
    this.fileWidgetNodes = fileWidgetNodes;
    
    this.audioData = audioData;
    this.segmentData = segmentData;
    
    
    /* Loop through all of the nodes, and add them to a fragment 
        (This will soon be done in another function) */
    var frag = document.createDocumentFragment();
    for(i = 0, il = fileWidgetNodes.length; i < il; i++) {
        frag.appendChild(fileWidgetNodes[i]);
    }
    this.container.append(frag);
};

