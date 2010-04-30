/**
 *  @file helpers.js
 *  This file contains helper functions that may be used throughout the client-side code.
 **/



/**
 *  sec_to_timecode
 *  This function will convert between an amount of seconds, and a timecode value.
 *
 *  @param          $seconds            The amount of seconds to convert.
 *  @return         hh:mm:ss            Formatted timecode string.
 **/
function sec_to_timecode($seconds)
{
    if($seconds < 0) {
        throw new Error('sec_to_timecode: Error: Seconds cannot be negative.');
    }
    
    var $hours = Math.floor($seconds/3600);
    var $rem = $seconds % 3600;
    var $minutes = Math.floor($rem/60);
    var $seconds = Math.floor($rem%60);
    /* pad zeros */
    if($hours < 10)
    {
        $hours = '0'+$hours;
    }
    if($minutes < 10)
    {
        $minutes = '0'+$minutes;
    }
    if($seconds < 10)
    {
        /* pad to beginning */
        $seconds = '0'+$seconds;
    }
    
    return $hours+':'+$minutes+':'+$seconds;
}

/**
 *  get_event_x
 *  Takes an event, and an element, and returns the X coordinate of that event relative to the element.
 *
 *  @param          $element            The element that the event occurred on.
 *  @param          $e                  The event object.
 *  @return         number              The x-coordinate of the event
 **/
function get_event_x($element, $e){
    /* Get x coordinate of click relative to page */
    var pageX = $e.pageX;
    /* x offset of element from page */
    var elementLeftOffset = $($element).offset().left;
    /* X coordinate of click relative to element */
    var clickX = pageX-elementLeftOffset;
    return clickX;
}

/**
 *  get_object_id
 *  Given an element, retrieves the number at the end of the id attribute
 *  (of that element) after the '-' character.
 *
 *  @param          element             The DOM (jQuery) object.
 **/
function get_object_id(element) {
    return $(element).attr('id').split('-')[1]*1;
}
