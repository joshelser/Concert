/**
 *  @file       FileWidget.js
 *  This is a widget that is found in the Audio list panel (when it is on file mode)
 *  it contains the functionality associated with an audio file on the organize
 *  page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

function FileWidget(params) {
    if(params) {
        this.init(params);
    }
}
FileWidget.prototype = new Widget();

FileWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    
}