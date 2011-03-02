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
        
        
        var timecodeContainerElement = $('#detail_waveform_panel_timecode');
        if(typeof(timecodeContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_timecode\') is undefined');
        }
        else if(timecodeContainerElement.length == 0) {
            throw new Error('timecodeContainerElement not found');
        }
        this.timecodeContainerElement = timecodeContainerElement;
        
        /* Instantiate widget for timecode */
        var timecodeWidget = new DetailWaveformTimecodeWidget({
            el: timecodeContainerElement, 
            panel: this, 
            audio: this.page.audio
        });
        this.timecodeWidget = timecodeWidget;
        
        /* The container for the playhead widget */
        var playheadContainerElement = $('#detail_waveform_panel_playhead');
        if(typeof(playheadContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_playhead\') is undefined');
        }
        else if(playheadContainerElement.length == 0) {
            throw new Error('playheadContainerElement not found');
        }
        this.playheadContainerElement = playheadContainerElement;
        
        var playheadWidget = new DetailWaveformPlayheadWidget({
            el: playheadContainerElement,
            panel: this,
            audio: this.page.audio
        });
        this.playheadWidget = playheadWidget;
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
        
        var waveformImageElement = this.waveformImageElement;
        
        var whenImageHasLoadedCallback = function(me) {
            return function() {
                /* Draw timecode */
                me.timecodeWidget.render();                
            };
        }(this);
        
        /* When waveform image has loaded */
        waveformImageElement.imagesLoaded(whenImageHasLoadedCallback);
        
        /* Load the waveform viewer with the audio files' waveform image */
        this.waveformImageElement.attr('src', selectedAudioFile.get('detailWaveform'));

        this.playheadWidget.audio_file_selected(selectedAudioFile);
        
    }, 
});
