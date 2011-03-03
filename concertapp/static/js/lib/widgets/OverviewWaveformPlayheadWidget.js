/**
 *  @file       OverviewWaveformPlayheadWidget.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The subclass for OverviewWaveformPlayheadWidget.
 *  @class
 *  @extends    WaveformPlayheadWidget
 **/
var OverviewWaveformPlayheadWidget = WaveformPlayheadWidget.extend({
    initialize: function() {
        WaveformPlayheadWidget.prototype.initialize.call(this);
    },
    
    audio_file_selected: function(selectedAudioFile) {
        WaveformPlayheadWidget.prototype.audio_file_selected.call(this, selectedAudioFile);
        this.pxPerSecond = this.el.parent().width() / this.fileDuration;
        console.log(this.el.parent().width());
        console.log(this.fileDuration);
    },
});
