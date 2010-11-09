/**
 *  @file       IconButton.js
 *  This is a class for a button with an icon.  This is subclassed into 
 *  SmallIconButton and LargeIconButton.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function IconButton(params) {
    if(params) {
        this.init(params);
    }
}
IconButton.prototype = new Button();

/**
 *  Initialize button behaviors and such.
 **/
IconButton.prototype.init = function(params) {
    Button.prototype.init.call(this, params);

    /* A label for the button is optional */
    var label = params.label;
    if(typeof(label) != 'undefined' && label.length) {
        /* If there is a label */
        this.label = label;
    }
    
    /* There will always be an icon */
    var icon = params.icon;
    if(typeof(icon) == 'undefined') {
        throw new Error('params.icon is undefined');
    }
    else if(icon.length == 0) {
        throw new Error('icon not found');
    }
    this.icon = icon;

    
}