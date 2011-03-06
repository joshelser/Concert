/**
 *  @file       DetailWaveformHighlighterComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Highlighter component for the detail waveform panel.
 *  @class
 *  @extends    WaveformHighlighterComponent
 **/
var DetailWaveformHighlighterComponent = WaveformHighlighterComponent.extend({
    get_resolution: function() {
        return 10;
    }, 
});
