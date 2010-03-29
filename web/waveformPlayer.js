
/**
*  Constructor for a waveform player object.
*
*  @param      $type       Type of waveform player (editor, viewer)
*  @param      $id         id of container element
*  @param      $audio_id   id of associated audio element
**/
function WaveformPlayer($type, $id, $audio_id)
{

    
    if(this.type == 'editor')
    {
        
        /**
         * Behavior for highlighting a section of the waveform
         **/
        $(this.container).mousedown(function(waveformPlayerObject){return function(event){
            /* Prevent default click behavior */
            event.preventDefault();
            
            /* Clear old highlight */
            waveformPlayerObject.highlightStart = -1;
            waveformPlayerObject.highlightEnd = -1;
            waveformPlayerObject.highlight();
                        
            /* X coordinate of click relative to element */
            waveformPlayerObject.highlightStart = get_event_x(this, event);
                        
            /* Set variable to denote dragging is in progress */
            waveformPlayerObject.dragging = 1;
            
            waveformPlayerObject.highlight();
            
            
        }}(this));
        
        $(this.container).mousemove(function(waveformPlayerObject){return function(event){
            /* if mouse is down */
            if(waveformPlayerObject.dragging){
                
                /* Get x location of mouse relative to element */
                waveformPlayerObject.highlightEnd = get_event_x(this, event);
                
                waveformPlayerObject.highlight();
                
            }
        }}(this));
        
        $(this.container).mouseup(function(waveformPlayerObject){return function(event){
            /* Prevent default mouseup behavior */
            event.preventDefault();            
            
            var audioDuration = waveformPlayerObject.audio_element.duration;
            
            /* get proper highlight values */
            if(waveformPlayerObject.highlightStart < waveformPlayerObject.highlightEnd)
            {
                var highlightStartPx = waveformPlayerObject.highlightStart;
                var highlightEndPx = waveformPlayerObject.highlightEnd;
            }
            else
            {
                var highlightStartPx = waveformPlayerObject.highlightEnd;
                var highlightEndPx = waveformPlayerObject.highlightStart;
            }
            
            if(highlightStartPx != -1 && highlightEndPx != -1)
            {
                /* Get actual waveform left value to determine offset from beginning of song */
                var left = $('#'+waveformPlayerObject.id+' > img#waveform_editor_image').css('left').match(/[\d]+/)*1;
                /* Get actual waveform image width */
                var width = $('#'+waveformPlayerObject.id+' > img#waveform_editor_image').css('width').match(/[\d]+/);

                var timeOffsetPx = 400-left;

                var startTimePx = (timeOffsetPx+highlightStartPx)-400;
                var endTimePx = (timeOffsetPx+highlightEndPx)-400;
                var startTimePerc = startTimePx/width;
                var endTimePerc = endTimePx/width;

                var highlightData = {
                    start: startTimePerc*audioDuration,
                    end: endTimePerc*audioDuration  
                };
                
                /* Trigger highlight event */
                $('#'+this.id).trigger('highlight', highlightData);
            }
            
            
            /* Mark object as not being dragged anymore */
            waveformPlayerObject.dragging = 0;
        }}(this));
    }
    else if(this.type == 'viewer')
    {
        /* container width */
        this.width = 800;
        /* object to animate is playhead */
        this.animate_object = $('#'+$id+' > div.playhead').get(0);
        /* timecode object */
        this.timecode_container = $('#'+$id+' > div.timecode').get(0);
        
        /* behavior for clicking in viewer and changing time code */
        $(this.container).click(function(waveformPlayerObject){ return function(event){
            /* prevent default click behavior */
            event.preventDefault();
            /* make some vars local for quicker access */
            var $ = jQuery;
            var audio_element = waveformPlayerObject.audio_element;
            
            /* X coordinate of click relative to element */
            var clickX = get_event_x(this, event);
            /* percent of width */
            var clickPerc = clickX/$(this).css('width').match(/[\d]+/);
            /* new time in audio file */
            var newTime = (clickPerc*audio_element.duration);
            /* move current time of audio file to clicked location */
            audio_element.currentTime = newTime;
            
            /* If song is not playing */
            if(!$(audio_element).hasClass('playing'))
            {
                /* manually move playhead and change timecode. */
                $(waveformPlayerObject.container).children('div.playhead').css('margin-left', (clickX)+'px');                
                $(waveformPlayerObject.container).children('div.timecode').html(sec_to_timecode(newTime));
                
                /* Manually update waveform_editor */
                $waveformPlayers['waveform_editor'].animateOnce();
            }
            
        }}(this));
    }

}


/**
*  toString function for a waveform player object
*  helpful for debugging.
**/
WaveformPlayer.prototype.toString = function()
{
    return this.id+': '+this.type+', '+this.audio_id+', '+this.width;
}

WaveformPlayer.prototype.play = function()
{
    /* Set container class to 'playing' */
    $(this.container).addClass('playing');
    /* play animation */
    setTimeout(function(audio_element, width, container, animate_object, type, timecode_container){ return function(){ play_animation(audio_element, width, container, animate_object, type, timecode_container); }}(this.audio_element, this.width, this.container, this.animate_object, this.type, this.timecode_container), $animation_speed);        

}

WaveformPlayer.prototype.animateOnce = function()
{
    play_animation(this.audio_element, this.width, this.container, this.animate_object, this.type, this.timecode_container);
}

/**
 *  highlight member function uses the highlightStart and highlightEnd member variables to draw the 
 *  appropriate highlight in the interface.
 **/
WaveformPlayer.prototype.highlight = function()
{
    if(this.type != 'editor'){
        return null;
    }
    
    if(this.highlightStart == -1 || this.highlightEnd == -1)
    {
        /* Clear highlight */
        $('#'+this.id+' > div#highlight').css('margin-left', '0px').css('width', '0px');
    }
    else
    {
        /* Forward highlight */
        if(this.highlightStart < this.highlightEnd)
        {
            /* Set highlight */
            $('#'+this.id+' > div#highlight').css('margin-left', this.highlightStart+'px').css('width', (this.highlightEnd-this.highlightStart)+'px');
        }
        else
        {
            /* set backwards highlight */
            $('#'+this.id+' > div#highlight').css('margin-left', this.highlightEnd+'px').css('width', (this.highlightStart-this.highlightEnd)+'px');            
        }
    }
    
}


