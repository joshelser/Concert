/**
 *  @file       DetailWaveformPlayheadWidget.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The widget that displays the playhead superimposed on the detail waveform.
 *  @class
 *  @extends    Widget
 **/
var DetailWaveformPlayheadWidget = Widget.extend({
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /* The HTML5 audio element that we will watch */
        var audio = params.audio;
        if(typeof(audio) == 'undefined') {
            throw new Error('params.audio is undefined');
        }
        this.audio = audio;
        
        this.parentElement = this.el.parent();
        
        _.bindAll(this, "render");
    },

    render: function() {
        return this;
    },
    
    audio_file_selected: function(selectedAudioFile) {
        var duration = selectedAudioFile.get('duration');
        this.fileDuration = duration;
    },
    
    animate: function() {
        console.log("hello");
        var pxPerSecond = 10;
        var leftPx = this.audio.currentTime * pxPerSecond
        this.el.css('left', leftPx);
    }
});
