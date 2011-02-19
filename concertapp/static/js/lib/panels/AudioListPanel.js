/**
 *  @file       AudioListPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Displays the segments and files within the audio organize page.
 *	@class
 *  @extends    Panel
 **/
var AudioListPanel = Panel.extend({
    /**
     *  @constructor
     **/
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        /**
         *  The set of files we're watching for this panel
         **/
        var files = params.files;
        if(typeof(files) == 'undefined') {
            throw new Error('params.files is undefined');
        }
        this.files = files;

        /**
         *  The set of segments we're watching for this panel
         **/
        var segments = params.segments;
        if(typeof(segments) == 'undefined') {
            throw new Error('params.segments is undefined');
        }
        this.segments = segments;

        
        /**
         *  The template for each file in the list
         **/
        this.fileWidgetTemplate = $('#file_widget_template');
        
        
        /**
         *  The template for each segment in the list
         **/
        this.segmentWidgetTemplate = $('#segment_widget_template');
        
        _.bindAll(this, "render");
        segments.bind('refresh', this.render);
        segments.bind('add', this.render);
        segments.bind('remove', this.render);
        files.bind('refresh', this.render);
        files.bind('add', this.render);
        files.bind('remove', this.render);
    }, 
    /**
     *  Called when segments or file list is changed.
     **/
    render: function() {
        
        /* temporary frag for dom additions */
        var frag = document.createDocumentFragment();
        
                
        this.files.each(function(fileWidgetTemplate, panel, frag) {
            return function(obj) {
                /* Create a file widget */
                var widget = new FileWidget({
                    template: fileWidgetTemplate, 
                    model: obj, 
                    panel: panel 
                });
                
                frag.appendChild(widget.el);
            };
        }(this.fileWidgetTemplate, this, frag));
        
        /* update panel */
        this.contents.empty().append(frag);
        
        
    }, 
});