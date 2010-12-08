/**
 *  @file       AudioListPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Displays the segment or clip list within the audio organize page.
 *	@class
 **/
function AudioListPanel(params) {
    if(params) {
        this.init(params);
    }
}
AudioListPanel.prototype = new Panel();

/**
 *  @param  params.fileWidgetTemplate           The jquery tmpl script for a file 
 *                                              widget  
 *  @param  params.segmentWidgetTemplate        the jQuery tmpl script for a segment
 *                                              widget.
 *  @param  params.mode                         String (optional) 'files' or
 *                                              'segments' will be the initial mode
 *                                              of this panel.
 **/
AudioListPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    var container = this.container;
    var header = this.header;
    
    /* Get the two different headers */
    var segmentsHeader = header.children('#segments_header');
    var filesHeader = header.children('#files_header');
    
    if(typeof(segmentsHeader) == 'undefined' || segmentsHeader.length == 0) {
        throw new Error('segmentsHeader not found: '+segmentsHeader.selector);
    }
    if(typeof(filesHeader) == 'undefined' || filesHeader.length == 0) {
        throw new Error('filesHeader not found: '+filesHeader.selector);
    }
    this.segmentsHeader = segmentsHeader;
    this.filesHeader = filesHeader;
    
    var fileWidgetTemplate = params.fileWidgetTemplate;
    if(typeof(fileWidgetTemplate) == 'undefined') {
        throw new Error('params.fileWidgetTemplate is undefined');
    }
    else if(fileWidgetTemplate.length == 0) {
        throw new Error('fileWidgetTemplate not found');
    }
    this.fileWidgetTemplate = fileWidgetTemplate;
    
    
    var segmentWidgetTemplate = params.segmentWidgetTemplate;
    if(typeof(segmentWidgetTemplate) == 'undefined') {
        throw new Error('params.segmentWidgetTemplate is undefined');
    }
    else if(segmentWidgetTemplate.length == 0) {
        throw new Error('segmentWidgetTemplate not found');
    }
    this.segmentWidgetTemplate = segmentWidgetTemplate;
    
    /** Audio panel mode switcher buttons **/
    /* These are probably going to be a different kind of button in the future */
    var audioSwitcherSegmentsButton = new LargeIconButton({
        container: header.children('#audiolist_switcher_segments_button')
    });
    var audioSwitcherFilesButton = new LargeIconButton({
        container: header.children('#audiolist_switcher_files_button')
    });
    
    this.audioSwitcherSegmentsButton = audioSwitcherSegmentsButton;
    this.audioSwitcherFilesButton = audioSwitcherFilesButton;

    
    

    
    /*  Mode is either 'files' or 'segments', as is reflected on the UI */
    var mode = params.mode;
    if(typeof(mode) == 'undefined') {
        mode = 'segments';
    }
    this.mode = mode;
    
    /* Initialize button behavior to switch mode */
    audioSwitcherFilesButton.click = function(me) {
        return function() {
            me.showFiles();            
        };
    }(this);
    audioSwitcherSegmentsButton.click = function(me) {
        return function() {
            me.showSegments();            
        };
    }(this);

    
    
    
    /* All of our file widgets */
    this.fileWidgets = null;
    /* All of our file widget DOM nodes */
    this.fileWidgetNodes = null;
    
    /* Our segment widgetes */
    this.segmentWidgets = null;
    /* And their respective nodes */
    this.segmentWidgetNodes = null;
    
    /*  The audio and segment data objects (retrieved from server) */
    this.audioData = null;
    this.segmentData = null;
    

    this.retrieveData();
}

/**
 *  Get all audio data from the server for the current collection.
 **/
AudioListPanel.prototype.retrieveData = function() {
    this.toggleLoadingNotification();
    
    $.getJSON(
        /* window.location here has the collection id encoded in it */
        window.location+'/audio', 
        function(me) {
            return function(data, status, xhr){
                me.processData(data);
                me.toggleLoadingNotification();
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
    var audioDataServer = data.audio_objects;
    var segmentDataServer = data.segment_objects;
    
    
    /* Stuff we will need */
    var fileWidgetTemplate = this.fileWidgetTemplate;
    var segmentWidgetTemplate = this.segmentWidgetTemplate;
    
    /* Where we'll store the audio and segment objects indexed by id */
    var audioData = [];
    var segmentData = [];
    
    /*  First we need to make our own audioData and segmentData arrays that are 
        indexed by the object's id.
    */
    for(i = 0, il = audioDataServer.length; i < il; i++) {
        var audio = audioDataServer[i];
        
        audioData[audio.id] = audio;
    }
    for(i = 0, il = segmentDataServer.length; i < il; i++) {
        var segment = segmentDataServer[i];
        
        segmentData[segment.id] = segment;
    }
    
    
    var segmentWidgets = [];
    var segmentWidgetNodes = [];
    
    
    /* For each segment data object */
    for(i = 0, il = segmentDataServer.length; i < il; i++) {
        var segment = segmentData[segmentDataServer[i].id];
        
        /* Connect with actual audio object */
        var segment_audio_id = segment.audio;
        var segment_audio_object = audioData[segment_audio_id];
        /* Tell audio object about this segment */
        segment_audio_object.segments.push(segment);
        /* Now audio attribute will point to actual audioData object instead of
            just the id */
        segment.audio = segment_audio_object;
        
        
        /* Create segment widget */
        var segmentWidget = new SegmentWidget({
            template: segmentWidgetTemplate,
            context: segment,
            panel: this
        });
        
        /* Save actual widget */
        segmentWidgets[segment.id] = segmentWidget;
        /* Save node for this widget */
        segmentWidgetNodes.push(segmentWidget.container.get(0));
        
    }
    this.segmentWidgets = segmentWidgets;
    this.segmentWidgetNodes = segmentWidgetNodes;
    
    
    /* We will store our fileWidgets here indexed by audio id */
    var fileWidgets = [];
    
    /* We will store all of our fileWidget nodes here indexed by their order on 
        the DOM */
    var fileWidgetNodes = [];
    
    
    /* For each audio data object */
    for(i = 0, il = audioDataServer.length; i < il; i++) {
        var audio = audioData[audioDataServer[i].id];
        
        /* Create file widget */
        var fileWidget = new FileWidget({
            template: fileWidgetTemplate, 
            context: audio, 
            panel: this, 
        });
        
        /* Save widget by audio_id */
        fileWidget[audio.id] = fileWidget;
        
        /* Save node for this widget in list */
        fileWidgetNodes.push(fileWidget.container.get(0));
    }
    
    this.fileWidgets = fileWidgets;
    this.fileWidgetNodes = fileWidgetNodes;
    
    
    this.audioData = audioData;
    this.segmentData = segmentData;
    
    /* Default is segments */
    this.showSegments();
};

/**
 *  Replace all nodes in contents container with fileWidgetNodes.
 **/
AudioListPanel.prototype.showFiles = function() {
    domElementsReplace(this.fileWidgetNodes, this.contents);
    this.mode = 'files';
    this.audioSwitcherFilesButton.container.hide();
    this.audioSwitcherSegmentsButton.container.show();
    this.segmentsHeader.hide();
    this.filesHeader.show();
};

/**
 *  Replace all nodes in contents container with segmentWidgetNodes.
 **/
AudioListPanel.prototype.showSegments = function() {
    domElementsReplace(this.segmentWidgetNodes, this.contents);
    this.mode = 'segments';
    this.audioSwitcherSegmentsButton.container.hide();
    this.audioSwitcherFilesButton.container.show();
    this.segmentsHeader.show();
    this.filesHeader.hide();
};



