/**
 *  @file       WaveformPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Abstract class for housing functionality relating to both waveform panels
 *  @class
 *  @extends    Panel
 **/
var WaveformPanel = Panel.extend(
	/**
	 *	@scope	WaveformPanel.prototype
	 **/
{
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
                                
        /* The image element */
        var waveformImageElement = this.el.find('.waveform_image');
        if(typeof(waveformImageElement) == 'undefined') {
            throw new Error('this.el.find(\'.waveform_image\') is undefined');
        }
        else if(waveformImageElement.length == 0) {
            throw new Error('waveformImageElement not found');
        }
        this.waveformImageElement = waveformImageElement;
        
        /* The container for the playhead widget */
        var playheadContainerElement = this.el.find('.playhead');
        if(typeof(playheadContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_playhead\') is undefined');
        }
        else if(playheadContainerElement.length == 0) {
            throw new Error('playheadContainerElement not found');
        }
        this.playheadContainerElement = playheadContainerElement;
        
        /* The duration of the last selected audio file (or segment parent) */
        this.audioFileDuration = null;
        
    },
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The selected file
     **/
    audio_file_selected: function(selectedAudioFile) {
        this.audioFileDuration = selectedAudioFile.get('duration');
        this.playheadComponent.audio_file_selected(selectedAudioFile);
        this.playheadComponent.reset();
    },
    
    /**
     *  Called from page when an audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        this.audioFileDuration = selectedAudioSegment.get('audioFile').get('duration');
        this.playheadComponent.audio_segment_selected(selectedAudioSegment);
        this.playheadComponent.reset();
    }, 
    
    /**
     *  Called from page when waveform highlight should be cleared.
     **/
    clear_waveform_highlight: function() {
        this.highlighter.disable();
    }, 
    
    /**
     *  Called from page when waveform should highlight
     **/
    highlight_waveform: function(startTime, endTime) {
        /* Draw highlight */
        this.highlighter.draw_highlight_sec(startTime, endTime);
        this.highlighter.enable();
    },
    
    /**
     *  Called from internal when waveform image is to be loaded.
     *
     *  @param  {String}    src    -    The url of the waveform image.
     *  @param  {Function}    callback  -   to be executed after waveform loads.
     **/
    _load_waveform_image: function(src, callback) {
        var waveformImageElement = this.waveformImageElement;
        
        /* When waveform image has loaded, execute callback */
        waveformImageElement.imagesLoaded(callback);
        
        /* Load the waveform viewer with the audio files' waveform image */
        waveformImageElement.attr('src', src);
        
    }, 
    
    /**
     *  Called from highlight when it has been cleared.
     **/
    waveform_highlight_cleared: function() {
        this.page.waveform_highlight_cleared(this);
    }, 
    
    /**
     *  Called from highlight when an area of the waveform is highlighted.
     *
     *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
     *  @param  {Number}    endTime    -    The time of the highlight end.
     **/
    waveform_highlighted: function(startTime, endTime) {
        /* Tell page about our highlight */
        this.page.waveform_highlighted(startTime, endTime, this);
    }, 
    
    
});
