/**
 *  @file AudioPlayerBehavior.js
 *  AudioPlayerBehavior.js contains all of the functionality associated with the audio player.
 **/
 

function initialize_audio_player_behavior() {
    
    $('audio').live('change_volume', function(event, data){
        $(this).get(0).volume = data.volume;
    });
}
