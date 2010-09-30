
/**
*  Global variables are in a namespace data structure.  A feature that will soon be 
*  implemented in the Javascript language natively.
**/
if(!com) var com = {};
if(!com.concertsoundorganizer) com.concertsoundorganizer = {};
if(!com.concertsoundorganizer.animation) {
    com.concertsoundorganizer.animation = {};
}
if(!com.concertsoundorganizer.compatibility) {
    com.concertsoundorganizer.compatibility = {};
}


// Closure for the main app.
(function() {
    // Handle placeholder text for input fields.  
    // Add focus and blur events to handle showing/hiding the placeholder.
    $("input:text, input:password").bind('focus blur', function(event) {
        if (event.type == 'focus') {
            // Do we have a placeholder yet?
            if (!$(this).data('placeholder')) {
                $(this).data('placeholder', $(this).val());
            }

            if ($(this).val() == $(this).data('placeholder')) {
                $(this).val('');
            }
        } else {
            if ($.trim($(this).val()) == '') {
                $(this).val($(this).data('placeholder'));
            }
        }
    });

    /**
    *    Preload images
    **/
    var images = [];
    images.push($('<img />').attr('src', '/graphics/button_press.png'));
    images.push($('<img />').attr('src', '/graphics/ajax-loader.gif'));


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


    })();

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
