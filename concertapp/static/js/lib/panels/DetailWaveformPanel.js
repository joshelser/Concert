/**
 *  @file       DetailWaveformPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Panel that displays larger waveform on organize page.
 *  @class
 *  @extends    Panel
 **/
var DetailWaveformPanel = Panel.extend({
    
    /**
     *  @constructor
     **/
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
        
        /* The template for the top left of the panel */
        var topLeftFileTemplate = $('#detail_waveform_top_left_file_template');
        if(typeof(topLeftFileTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_top_left_file_template\') is undefined');
        }
        else if(topLeftFileTemplate.length == 0) {
            throw new Error('topLeftFileTemplate not found');
        }
        this.topLeftFileTemplate = topLeftFileTemplate;
        
        /* The container for the top left content */
        var topLeftContainer = $('#detail_waveform_panel_top_left');
        if(typeof(topLeftContainer) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_top_left\') is undefined');
        }
        else if(topLeftContainer.length == 0) {
            throw new Error('topLeftContainer not found');
        }
        this.topLeftContainer = topLeftContainer;
        
        /* The template for the top right of the panel */
        var topRightFileTemplate = $('#detail_waveform_top_right_file_template');
        if(typeof(topRightFileTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_top_right_file_template\') is undefined');
        }
        else if(topRightFileTemplate.length == 0) {
            throw new Error('topRightFileTemplate not found');
        }
        this.topRightFileTemplate = topRightFileTemplate;
        
        /* The container for the top right content */
        var topRightContainer = $('#detail_waveform_panel_top_right');
        if(typeof(topRightContainer) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_top_right\') is undefined');
        }
        else if(topRightContainer.length == 0) {
            throw new Error('topRightContainer not found');
        }
        this.topRightContainer = topRightContainer;
        
        var imageContainerElement = $('#detail_waveform_panel_view');
        if(typeof(imageContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_view\') is undefined');
        }
        else if(imageContainerElement.length == 0) {
            throw new Error('imageContainerElement not found');
        }
        this.imageContainerElement = imageContainerElement;
        
        var waveformImageTemplate = $('#detail_waveform_image_template');
        if(typeof(waveformImageTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_image_template\') is undefined');
        }
        else if(waveformImageTemplate.length == 0) {
            throw new Error('waveformImageTemplate not found');
        }
        this.waveformImageTemplate = waveformImageTemplate;
        
        /* The model manager's selected files */
        var selectedAudioFiles = params.selectedAudioFiles;
        if(typeof(selectedAudioFiles) == 'undefined') {
            throw new Error('params.selectedAudioFiles is undefined');
        }
        this.selectedAudioFiles = selectedAudioFiles;
        
        /* The model manager's selected audio segments */
        var selectedAudioSegments = params.selectedAudioSegments;
        if(typeof(selectedAudioSegments) == 'undefined') {
            throw new Error('params.selectedAudioSegments is undefined');
        }
        this.selectedAudioSegments = selectedAudioSegments;
        

        _.bindAll(this, "render");
        selectedAudioSegments.bind('refresh', this.render);
        selectedAudioSegments.bind('add', this.render);
        selectedAudioSegments.bind('remove', this.render);
        selectedAudioFiles.bind('refresh', this.render);
        selectedAudioFiles.bind('add', this.render);
        selectedAudioFiles.bind('remove', this.render);
    },

    render: function() {
        Panel.prototype.render.call(this);
        
        var selectedAudioFiles = this.selectedAudioFiles;
        var selectedAudioSegments = this.selectedAudioSegments;
        
        /* If there was an audio segment selected */
        if(selectedAudioSegments.length == 1 && selectedAudioFiles.length == 0) {
            throw new Error('Not yet implemented selecting audio segment');
        }
        else if(selectedAudioFiles.length == 1 && selectedAudioSegments.length == 0) {
            var selectedAudioFile = selectedAudioFiles.first().toJSON();
            /* Load the top left content with our audio file */
            this.topLeftContainer.html(
                this.topLeftFileTemplate.tmpl(selectedAudioFile)
            );
            
            /* Load the top right content with our audio file */
            this.topRightContainer.html(
                this.topRightFileTemplate.tmpl(selectedAudioFile)
            );
            
            /* Load the waveform viewer with the audio files' waveform image */
            var waveformImageElement = this.waveformImageTemplate.tmpl(selectedAudioFile)
            
            this.imageContainerElement.html(waveformImageElement);
        }
        else if(selectedAudioFiles.length && selectedAudioSegments.length){
            throw Error('Not yet implemented multiple selection')            
        }
        else {
            throw Error('Not yet implemented when nothing is selected')
        }
        
        return this;
    }
});
