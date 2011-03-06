/**
 *  @file       DetailWaveformPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Panel that displays larger waveform on organize page.
 *  @class
 *  @extends    WaveformPanel
 **/
var DetailWaveformPanel = WaveformPanel.extend({    
    initialize: function() {
        WaveformPanel.prototype.initialize.call(this);

        var params = this.options;
        
        
        /* The template for the top of the panel when a file is selected */
        var topFileTemplate = $('#detail_waveform_top_file_template');
        if(typeof(topFileTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_top_file_template\') is undefined');
        }
        else if(topFileTemplate.length == 0) {
            throw new Error('topFileTemplate not found');
        }
        this.topFileTemplate = topFileTemplate;
        
        /* Template for top of panel when segment is selected */
        var topSegmentTemplate = $('#detail_waveform_top_segment_template');
        if(typeof(topSegmentTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_top_segment_template\') is undefined');
        }
        else if(topSegmentTemplate.length == 0) {
            throw new Error('topSegmentTemplate not found');
        }
        this.topSegmentTemplate = topSegmentTemplate;
        
        /* The container for the top of the panel */
        var topContainer = $('#detail_waveform_panel_top');
        if(typeof(topContainer) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_top\') is undefined');
        }
        else if(topContainer.length == 0) {
            throw new Error('topContainer not found');
        }
        this.topContainer = topContainer;
        
        
        var timecodeContainerElement = $('#detail_waveform_panel_timecode');
        if(typeof(timecodeContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_timecode\') is undefined');
        }
        else if(timecodeContainerElement.length == 0) {
            throw new Error('timecodeContainerElement not found');
        }
        this.timecodeContainerElement = timecodeContainerElement;
        
        /* Instantiate widget for timecode */
        var timecodeWidget = new DetailWaveformTimecodeComponent({
            el: timecodeContainerElement, 
            panel: this, 
            audio: this.page.audio
        });
        this.timecodeWidget = timecodeWidget;
        
        /* Instantiate component for playhead */
        var playheadComponent = new DetailWaveformPlayheadComponent({
            el: this.playheadContainerElement,
            panel: this,
            audio: this.page.audio
        });
        this.playheadComponent = playheadComponent;
        
        
        var highlightContainerElement = $('#detail_waveform_panel_highlight_container');
        if(typeof(highlightContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_highlight_container\') is undefined');
        }
        else if(highlightContainerElement.length == 0) {
            throw new Error('highlightContainerElement not found');
        }
        this.highlightContainerElement = highlightContainerElement;
        
        /* a highlighter component so we can highlight things */
        var highlighter = new DetailWaveformHighlighterComponent({
            el: highlightContainerElement, 
            panel: this, 
        });
        this.highlighter = highlighter;
        
        var waveformView = $('#detail_waveform_panel_view');
        if(typeof(waveformView) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_view) is undefined');
        }
        else if(waveformView.length == 0) {
            throw new Error('waveformView not found');
        }
        this.waveformView = waveformView;
        
        var autoscrollBool = true;
        this.autoscrollBool = autoscrollBool;
        
        this.waveformView.bind('scrollstart', function(me) {
            return function() {
                me.handle_scroll();
            };
        }(this));
        
        this.waveformView.bind('scrollstop', function(me) {
            return function() {
                me.handle_scroll_stop();
            }
        }(this));
            
    },
    /**
     *  Called from page when an audio file has been selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The selected file.
     **/
    audio_file_selected: function(selectedAudioFile) {
        WaveformPanel.prototype.audio_file_selected.call(this, selectedAudioFile);
        
        /* Load top content with audio file information */
        this.topContainer.html(
            this.topFileTemplate.tmpl(selectedAudioFile.toJSON())
        );
        
        var waveformImageElement = this.waveformImageElement;
        
        /* When waveform image has loaded */
        waveformImageElement.imagesLoaded(function(me, selectedAudioFile) {
            return function() {
                /* Draw timecode */
                me.timecodeWidget.render();
                
                /* Set up highlighter */
                me.highlighter.audio_file_selected(selectedAudioFile);
            };            
        }(this, selectedAudioFile));
        
        /* Load the waveform viewer with the audio files' waveform image */
        this.waveformImageElement.attr('src', selectedAudioFile.get('detailWaveform'));        
    }, 
    
    /**
     *  Called from page when audio segment has been selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment.
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        WaveformPanel.prototype.audio_segment_selected.call(this, selectedAudioSegment);
        
        /* Load top of panel with audio segment information */
        this.topContainer.html(
            this.topSegmentTemplate.tmpl(selectedAudioSegment.toJSON())
        );
    }, 
    
    /**
     *  Called from highlight when an area of the waveform is highlighted.
     *
     *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
     *  @param  {Number}    endTime    -    The time of the highlight end.
     **/
    waveform_highlighted: function(startTime, endTime) {
        if (this.playhead_in_view()) {
            this.autoscrollBool = true;
        }
        
        this.page.waveform_highlighted(startTime, endTime);
    }, 
    
    /**
     *  Called from highlight when it has been cleared.
     **/
    waveform_highlight_cleared: function() {
        this.page.waveform_highlight_cleared();
    }, 
    
    /**
     *  Determines if the playhead is in the current waveform view
     **/
    playhead_in_view: function() {
        if (((this.waveformView.scrollLeft()) <= this.playheadComponent.position()) && 
        ((this.waveformView.scrollLeft() + 815) >= this.playheadComponent.position())) {
            return true;
        }
        else {
            return false;
        }
    },
    
    /**
     *  if the playhead is at the end of the view && AUTOSCROLLING ON 
     *  scroll to position of playhead
     **/
    playhead_moved: function(leftPx) {            
        if (this.autoscrollBool && leftPx >= (815 + this.waveformView.scrollLeft()) ) {
            this.autoscroll(leftPx);
        }

    }, 
    
    /**
     *  Handles playhead behavior on scroll
     **/
    handle_scroll: function() {
        this.autoscrollBool = false;
    }, 

    /**
    *  Handles playhead behavior on a scroll stop
    **/    
    handle_scroll_stop: function() {
        if (!this.autoscrollBool && this.playhead_in_view()) {
            this.autoscrollBool = true;
        }
        else {
            this.autoscrollBool = false;
        }
    }, 
        
    /**
     *  moves the waveform view to leftPx
     **/
    autoscroll: function(leftPx) {
        this.waveformView.animate({scrollLeft: leftPx}, 600, "easeOutExpo");
    }
});
