/**
 *  @file       UIHelpers.js
 *  Functions associated with general UI elements.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This will auto clear the fields that have a class "autoClear" on them.
 *  The placeholder text is from the "data-placeholder" attribute of the 
 *  element.
 **/
function initializeAutoClearFieldBehavior(){
    
    /* Make jQuery local for performance */
    var $ = jQuery;
    
    $('input.autoClear').live('focus', function(event) {
        /*  If the placeholder attribute hasn't been set yet */
        if (!$(this).data('placeholder')) {
            /* save what is in the field */
            $(this).data('placeholder', $(this).val());
        }
        
        /* If the text field was just focused and has the placeholder text */
        if ($(this).val() == $(this).data('placeholder')) {
            /* remove placeholder text */
            $(this).val('');
        }
    }).live('blur', function(event) {        
        /* When field is blurred, put placeholder text back */
        if ($.trim($(this).val()) == '') {
            $(this).val($(this).data('placeholder'));
        }
    });
    
}

/**
 *  Preloads all images via an image beacon to the server.
 *
 *  @param  urls        Array 
 **/
function preloadImages(urls) {
    var images = [];
    for(i = 0, il = urls.length; i < il; i++) {
        images.push($('<img />').attr('src', urls[i]));
    }
}

/**
 *  Detect browser compatibility problems, and notify user of any issues.  Should
 *  be called on intro page, and the user should not be allowed to go further if
 *  there are problems.
 **/
function detectBrowserCompatibility() {
    /**
     *  Detect audio compatibility, and throw notifications to the user if necessary.
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
}