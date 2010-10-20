/**
 *  @file       global.js
 *  Contains the functionality that all pages must have.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
 
/**
 *  Global variables are in a namespace data structure.
 **/
if(!com) var com = {};
if(!com.concertsoundorganizer) com.concertsoundorganizer = {};
if(!com.concertsoundorganizer.animation) {
    com.concertsoundorganizer.animation = {};
}
if(!com.concertsoundorganizer.compatibility) {
    com.concertsoundorganizer.compatibility = {};
}


$(document).ready(function(){
    
    initializeAutoClearFieldBehavior();
    
    /**
    *    Preload certain images
    *
    var images = [];
    images.push($('<img />').attr('src', '/graphics/button_press.png'));
    images.push($('<img />').attr('src', '/graphics/ajax-loader.gif'));
    */

    /**
    *    Set default animation speed.
    **/
    com.concertsoundorganizer.animation = {
        speed: 200,
    }

    /**
     *  Detect audio compatibility
     **/
    if(Modernizr.audio) {
        if(Modernizr.audio.ogg) {
            com.concertsoundorganizer.compatibility.audiotype = 'ogg';
        }
        else if(Modernizer.audio.mp3) {
            com.concertsoundorganizer.compatibility.audiotype = 'mp3';
        }
        else {
            /* TODO: Handle this case */
            alert('Site will not work.  Your browser says it doesn\'t support ogg or mp3 files, but that it supports the <audio> element.');
        }
    }
    else {
        /* TODO: Handle old browsers here */
        alert('Site will not work.  Your browser does not support the HTML5 audio element.');
    }


});

/**
*  loading
*  Global function for turning on the loading notification on the entire page.
**/
function loading() {
    /* Turn on global loading notification */
    $('#viewer_image').append('<img id="loader" src="/graphics/ajax-loader.gif" />');
}

/**
*  loading
*  Global function for turning off the loading notification on the entire page.
**/
function remove_loading() {
    /* Remove loading notification */
    $('#loader').remove();
}
