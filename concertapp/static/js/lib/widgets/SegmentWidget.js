/**
 *  @file       SegmentWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the widget associated with an audio segment on the organize page.
 *	@class
 **/
function SegmentWidget(params) {
    if(params) {
        this.init(params);
    }
}
SegmentWidget.prototype = new Widget();

SegmentWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    
}