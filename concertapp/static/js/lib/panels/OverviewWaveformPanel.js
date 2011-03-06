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
        
        /* Instantiate widget for playhead */
        var playheadComponent = new OverviewWaveformPlayheadComponent({
            el: this.playheadContainerElement,
            panel: this,
            audio: this.page.audio
        });
        this.playheadComponent = playheadComponent;
    }, 
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The audio file instance
     **/
    audio_file_selected: function(selectedAudioFile) {
        WaveformPanel.prototype.audio_file_selected.call(this, selectedAudioFile);
        this.waveformImageElement.attr('src', selectedAudioFile.get('overviewWaveform'));
    }, 
    
    /**
     *  Called from page when audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The audio segment
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        WaveformPanel.prototype.audio_segment_selected.call(this, selectedAudioSegment);
        
        this.waveformImageElement.attr('src', selectedAudioSegment.get('audioFile').get('overviewWaveform'));
    }, 
})