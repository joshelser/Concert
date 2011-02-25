/**
 *  @file       OverviewWaveformPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the smaller waveform panel, which will be at the top underneath the 
 *  options bar on the "organization" page.
 *	@class
 *  @extends    WaveformPanel
 **/
var OverviewWaveformPanel = WaveformPanel.extend({
    initialize: function() {
        WaveformPanel.prototype.initialize.call(this)
        
        /* The template used for the waveform image */
        var waveformImageTemplate = $('#overview_waveform_image_template');
        if(typeof(waveformImageTemplate) == 'undefined') {
            throw new Error('$(\'#overview_waveform_image_template\') is undefined');
        }
        else if(waveformImageTemplate.length == 0) {
            throw new Error('waveformImageTemplate not found');
        }
        this.waveformImageTemplate = waveformImageTemplate;
        
        
        var imageContainerElement = $('#overview_waveform_panel_top');
        if(typeof(imageContainerElement) == 'undefined') {
            throw new Error('$(\'#overview_waveform_panel_top\') is undefined');
        }
        else if(imageContainerElement.length == 0) {
            throw new Error('imageContainerElement not found');
        }
        this.imageContainerElement = imageContainerElement;
        
        
        
    }, 
    
    audio_file_selected: function(selectedAudioFile) {
        var selectedAudioFileJSON = selectedAudioFile.toJSON();
        
        /* Load the waveform viewer with the audio files' waveform image */
        var waveformImageElement = this.waveformImageTemplate.tmpl(selectedAudioFileJSON)
        
        this.imageContainerElement.html(waveformImageElement);
        
    }, 
})