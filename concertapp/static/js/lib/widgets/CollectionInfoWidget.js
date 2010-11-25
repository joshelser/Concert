/**
 *  @file       CollectionInfoWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is a widget that shows the information about a collection.
 *	@class
 **/
function CollectionInfoWidget(params) {
    if(params) {
        this.init(params);
    }
}
CollectionInfoWidget.prototype = new Widget();

CollectionInfoWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    
}