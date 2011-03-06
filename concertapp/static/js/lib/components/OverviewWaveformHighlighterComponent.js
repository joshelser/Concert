/**
 *  @file       OverviewWaveformHighlighterComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Highlighter component for the detail waveform panel.
 *  @class
 *  @extends    WaveformHighlighterComponent
 **/
var OverviewWaveformHighlighterComponent = WaveformHighlighterComponent.extend({
    get_resolution: function() {
        /* Width of image is currently always 898 */
        var width = 898;
        
        /* current duration of audio file */
        var duration = this.audioFileDuration;
        
        return width/duration;
    }, 
});
