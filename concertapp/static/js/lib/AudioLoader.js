/**
 *  @file AudioLoader.js
 *  AudioLoader.js contains all of the functionality associated with the AudioLoader.
 **/

/**
 *  Global variable for audio objects on page.
 **/
var $audios = new Array(); 
/**
 *  Global variable for callback at end of initialization
 **/
var $callback = null;

/**
 *  AudioLoader is the initializer for the AudioLoader functionality.
 *  The goal of AudioLoader is to delay any javascript until the audio elements have loaded.
 *  This does not mean that the audio files have buffered, but merely means that the attributes
 *  of the actual audio element being loaded can be accessed before moving on.
 **/
function AudioLoader(callback) {
  /* Continuously check if audio element is accessable before issuing callback */
  
  /* Clear audios variable */
  $audios = new Array();
  $callback = callback;
  
  /* Compile list of audio element names */
  $.each($('audio'), function(index, data){
      var $audioObj = new Object();
      $audioObj.id = data.id;
      $audioObj.status = 0;
      $audios.push($audioObj);
  });
  
  /* Begin to initialize elements */
  initialize_audio_durations($audios);
}


/**
 * initialize_audio_durations
 * Loops through the $audios array, checking to see if the element is accessable.
 * If so, sets the status of the element and moves on.  If all were accessable, or previously
 * marked as such, the initialize_waveform_speeds() is called.  If any were found inaccesable, the function
 * is run again in 100ms.
 *
 * @param          $audios             the array of 'audio' objects which are defined above.
 **/
function initialize_audio_durations($audios)
{
    var $all = 1;
    $.each($audios, function(index, value){
        /* if this audio element is not loaded yet */
        if(!value.status)
        {
            var $result = check_audio_duration(value.id);
            if($result == false)
            {
                setTimeout('initialize_audio_durations($audios)', 100);
                $all = 0;
            }
            else
            {
                $audios[index].status = 1;
            }                         
        }
    });
    
    if($all)
    {
        /* If all audio objects were able to be accessed, move on */
        $callback();                   
    }
    
}

/**
 * check_audio_duration
 * Given an id of an audio object, will return true if the duration attribute
 * is accessable.
 *
 * @param          $audio_id           id of the audio object
 **/
function check_audio_duration($audio_id)
{
    if($('#'+$audio_id).attr('duration'))
    {
        return true;
    }
    else
    {
        return false;
    }
}
