/**
 *  @file       OverviewWaveformPlayheadComponent.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The subclass for OverviewWaveformPlayheadComponent.
 *  @class
 *  @extends    WaveformPlayheadComponent
 **/
var OverviewWaveformPlayheadComponent = WaveformPlayheadComponent.extend(
	/**
	 *	@scope	OverviewWaveformPlayheadComponent.prototype
	 **/
{
    initialize: function() {
        WaveformPlayheadComponent.prototype.initialize.call(this);
    },
    
    audio_file_selected: function(selectedAudioFile) {
        WaveformPlayheadComponent.prototype.audio_file_selected.call(this, selectedAudioFile);
        this.pxPerSecond = this.el.parent().width() / this.fileDuration;
    },
});
