/**
 *  @file       Widget.js
 *  This contains general stuff that needs to take place for any widget on the UI.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

function Widget(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  @param  container        jQuery HTMLDivElement  -   The container for this widget
 **/
Widget.prototype.init = function(params) {

    var container = params.container;
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    this.container = container;
    
}