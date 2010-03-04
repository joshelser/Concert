var $animation_speed = 200;

/**
*  Constructor for a waveform player object.
*
*  @param      $type       Type of waveform player (editor, viewer)
*  @param      $id         id of container element
*  @param      $audio_id   id of associated audio element
**/
function WaveformPlayer($type, $id, $audio_id)
{
    /* Error check type */
    if($type != 'viewer' && $type != 'editor')
    {
        throw 'Invalid type.';
    }
    else
    {
        this.type = $type;    
    }

    /* id */
    this.id = $id;
    /* The waveform container (div) */
    this.container = $('#'+$id).get(0);
    
    if(this.type == 'editor')
    {
        /* The object to animate is actual waveform image */
        this.animate_object = $('#'+$id+' > img.waveform_image');
        /* waveform image width */
        this.width = $(this.animate_object).attr('src').split('_')[1].match(/[\d]+/)*1;
        if(!this.width)
        {
            throw 'Could not get waveform image width.';
        }        
    }
    else if(this.type == 'viewer')
    {
        /* container width */
        this.width = 800;
        /* object to animate is playhead */
        this.animate_object = $('#'+$id+' > div.playhead');
    }

    /* audio element */
    this.audio_id = $audio_id;
    this.audio_element = $('#'+$audio_id).get(0);
    if(!this.audio_element)
    {
        throw 'Invalid audio_id.';
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
    setTimeout(function(audio_element, width, container, animate_object, type){ return function(){ play_animation(audio_element, width, container, animate_object, type); }}(this.audio_element, this.width, this.container, this.animate_object, this.type), $animation_speed);

}

/**
 *  play_animation
 *  If the type is a editor, moves waveform to the left based on the elapsed time of playing
 *  audio file.  If viewer, moves the playhead to the right.  meant to be called every $animation_speed ms.
 *
 *  @param          $audio                  The audio element associated with this waveform
 *  @param          $width                  The length in pixels of the waveform width/waveform container width
 *  @param          $waveform_container     The div of the waveform container
 *  @param          $animate_object         The object to animate
 *  @param          $type                   The type of waveform container (viewer, editor)
 **/
function play_animation($audio, $width, $waveform_container, $animate_object, $type)
{
    /* Percentage of song we are currently on */
    var $actualPercent = $audio.currentTime/$audio.duration;
    /* new position */
    var $newPos = $actualPercent*$width;
    
    if($type == 'editor')
    {
        /* new left value (because waveform actually moves backwards and starts at 400) */
        var $newLeft = ($newPos-400)*-1;
        /* Set new waveform position */
        $($animate_object).css('left', $newLeft+'px');
    }
    else if($type == 'viewer')
    {
        $($animate_object).css('margin-left', $newPos+'px');
    }

    /* make sure audio element is still playing */
    if($($audio).hasClass('playing'))
    {
        /* if so, go again in $animation_speed ms */
        setTimeout(function(audio_element, width, container, object, type){ return function(){ play_animation(audio_element, width, container, object, type); }}($audio, $width, $waveform_container, $animate_object, $type), $animation_speed);
    }
    else
    {
        /* Remove container 'playing' class */
        $($waveform_container).removeClass('playing');
    }
}

