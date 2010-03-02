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
  
  /* waveform image width */
  this.imageWidth = $('#'+$id+' > img.waveform_image').attr('src').split('_')[1].match(/[\d]+/)*1;
  if(!this.imageWidth)
  {
    throw 'Could not get waveform image width.';
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
  return this.id+': '+this.type+', '+this.audio_id+', '+this.imageWidth;
}