/**
 *  @file       OverviewWaveformPlayheadComponent.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The subclass for DetailWaveformPlayheadComponent.
 *  @class
 *  @extends    WaveformPlayheadComponent
 **/
var DetailWaveformPlayheadComponent = WaveformPlayheadComponent.extend({
    initialize: function() {
        WaveformPlayheadComponent.prototype.initialize.call(this);
    },

    /**
     *  Notify panel that we'ved moved the playhead
     **/
    animate: function() {
        var leftPx = WaveformPlayheadComponent.prototype.animate.call(this);

        this.panel.playhead_moved(leftPx);
    },
});
