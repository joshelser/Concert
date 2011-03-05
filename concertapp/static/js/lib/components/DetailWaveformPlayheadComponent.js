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
     *  animate is called from the page every 200 milliseconds
     *  moves the playhead to the left the currentTime * 10
     **/
    animate: function() {
        var leftPx = this.audio.currentTime * this.pxPerSecond
        console.log(this.panel);
        if ((leftPx % 815) <= 5) {
            this.panel.scroll_to_time(leftPx);
        }
        this.el.css('left', leftPx);
    },
});
