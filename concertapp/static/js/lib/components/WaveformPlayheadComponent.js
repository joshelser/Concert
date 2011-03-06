/**
 *  @file       WaveformPlayheadComponent.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The widget that displays the playhead superimposed on the detail waveform.
 *  @class
 *  @extends    Component
 **/
var WaveformPlayheadComponent = Component.extend({
    initialize: function() {
        Component.prototype.initialize.call(this);

        var params = this.options;
        
        /* The HTML5 audio element that we will watch */
        var audio = params.audio;
        if(typeof(audio) == 'undefined') {
            throw new Error('params.audio is undefined');
        }
        this.audio = audio;
        
        _.bindAll(this, "render");
        
        var pxPerSecond = 10;
        this.pxPerSecond = pxPerSecond;
        
        this.fileDuration = null;
    },

    render: function() {
        return this;
    },
    
    /**
     *  audio_file_selected is called from the panel 
     *  when a new audio file is selected
     *  obtains duration from the selectedAudioFile
     *  @param  {AudioFile}    selectedAudioFile    -   audio file that was selected
     **/
    audio_file_selected: function(selectedAudioFile) {
        var duration = selectedAudioFile.get('duration');
        this.fileDuration = duration;
    },
    
    /**
     *  called from panel when new audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - audio segment selected
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        this.fileDuration = selectedAudioSegment.get('audioFile').get('duration');
    }, 

    /**
     *  animate is called from the page every 200 milliseconds
     *  moves the playhead to the left the currentTime * 10
     **/
    animate: function() {
        var leftPx = this.audio.currentTime * this.pxPerSecond
        this.el.css('left', leftPx);
    },
    
    reset: function() {
        this.el.css('left', '0px');
    }
});
