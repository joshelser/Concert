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

    if(this.type == 'editor')
    {
        /* waveform image width */
        this.width = $('#'+$id+' > img.waveform_image').attr('src').split('_')[1].match(/[\d]+/)*1;
        if(!this.width)
        {
            throw 'Could not get waveform image width.';
        }        
    }
    else if(this.type == 'viewer')
    {
        /* container width */
        this.width = 800;
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
    $('#'+this.id).addClass('playing');
    /* play animation */
    setTimeout('play_animation("'+this.audio_id+'", "'+this.width+'", "'+this.id+'", "'+this.type+'")', 100);    

}

/**
 *  play_animation
 *  If the type is a editor, moves waveform to the left based on the elapsed time of playing
 *  audio file.  If viewer, moves the playhead to the right.  meant to be called every 100 ms.
 *
 *  @param          $audio_id               The id of the audio element associated with this waveform
 *  @param          $width                  The length in pixels of the waveform width/waveform container width
 *  @param          $waveform_div_id        The div id of the waveform container
 *  @param          $type                   The type of waveform container (viewer, editor)
 **/
function play_animation($audio_id, $width, $waveform_div_id, $type)
{
    /* get audio element */
    var $audio = $('#'+$audio_id).get(0);
    /* Get actual time of audio */
    var $actualTime = $audio.currentTime;
    /* Percentage of song we are currently on */
    var $actualPercent = $actualTime/$audio.duration;
    /* new position */
    var $newPos = $actualPercent*$width;
    
    if($type == 'editor')
    {
        /* new left value (because waveform actually moves backwards and starts at 400) */
        var $newLeft = ($newPos-400)*-1;
        /* Set new waveform position */
        $('#'+$waveform_div_id+' > img.waveform_image').css('left', $newLeft+'px');
    }
    else if($type == 'viewer')
    {
        $('#'+$waveform_div_id+' > div.playhead').css('margin-left', $newPos+'px');
    }

    /* make sure audio element is still playing */
    if($('#'+$audio_id).hasClass('playing'))
    {
        /* if so, go again in 100 ms */
        setTimeout('play_animation("'+$audio_id+'", "'+$width+'", "'+$waveform_div_id+'", "'+$type+'")', 100);
    }
    else
    {
        /* Remove container 'playing' class */
        $('#'+$waveform_div_id).removeClass('playing');
    }
}

