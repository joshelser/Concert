/**
 *  @file       DetailWaveformPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Panel that displays larger waveform on organize page.
 *  @class
 *  @extends    WaveformPanel
 **/
var DetailWaveformPanel = WaveformPanel.extend({    
    initialize: function() {
        WaveformPanel.prototype.initialize.call(this);

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
        
        var imageContainerElement = $('#detail_waveform_panel_waveform_container');
        if(typeof(imageContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_waveform_container\') is undefined');
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
        
    },
    /**
     *  Called from parent class when an audio file has been selected on the UI.
     **/
    audio_file_selected: function(selectedAudioFile) {
        var selectedAudioFileJSON = selectedAudioFile.toJSON();
        /* Load the top left content with our audio file */
        this.topLeftContainer.html(
            this.topLeftFileTemplate.tmpl(selectedAudioFileJSON)
        );
        
        /* Load the top right content with our audio file */
        this.topRightContainer.html(
            this.topRightFileTemplate.tmpl(selectedAudioFileJSON)
        );
        
        /* Load the waveform viewer with the audio files' waveform image */
        var waveformImageElement = this.waveformImageTemplate.tmpl(selectedAudioFileJSON)
        
        this.imageContainerElement.html(waveformImageElement);
    }, 
});
