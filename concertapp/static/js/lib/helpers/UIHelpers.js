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
    var notifier = com.concertsoundorganizer.notifier;
    
    /**
     *  Detect audio compatibility, and throw notifications to the user if necessary.
     **/
    if(Modernizr.audio) {
        if(Modernizr.audio.ogg) {
            com.concertsoundorganizer.compatibility.audiotype = 'ogg';
        }
        else if(Modernizr.audio.mp3) {
            com.concertsoundorganizer.compatibility.audiotype = 'mp3';
        }
        else {
            /* TODO: Handle this case */
            notifier.alert({content: 'Site will not work.  Your browser says it doesn\'t support ogg or mp3 files, but that it supports the "audio" element.<br />Try upgrading your browser, or try installing one of these free modern browsers:<br /><a href="http://www.google.com/chromeframe">Chrome Frame for IE</a><br /><a href="http://www.google.com/chrome">Google Chrome</a><br /><a href="http://www.mozilla.com/firefox/upgrade.html">Mozilla Firefox</a>'});
        }
    }
    else {
        /* TODO: Handle old browsers here */
        notifier.alert({content: 'Site will not work.  Your browser does not support the HTML5 audio element.<br />Try upgrading your browser, or try installing one of these free modern browsers:<br /><a href="http://www.google.com/chromeframe">Chrome Frame for IE</a><br /><a href="http://www.google.com/chrome">Google Chrome</a><br /><a href="http://www.mozilla.com/firefox/upgrade.html">Mozilla Firefox</a>'});
    }
}

/**
 *  Takes an array of DOM nodes, and a container.  It will replace all of the nodes
 *  in the container with the given.
 *
 *  @param  nodes        Array  -   of DOM nodes to add to container
 *  @param  container        jQuery DOM element  
 **/
function domElementsReplace(nodes, container) {
    /* Empty container */
    container.empty();
    
    /* Loop through all of the nodes, and add them to a fragment */
    var frag = document.createDocumentFragment();
    for(i = 0, il = nodes.length; i < il; i++) {
        frag.appendChild(nodes[i]);
    }
    container.append(frag);    
}
