/**
 *  @file       SegmentWidget.js
 *  This is the widget associated with an audio segment on the organize page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
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