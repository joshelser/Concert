/**
 *  @file       CollectionSearchResultWidget.js
 *  This widget is displayed for each collection in a collection search result.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function CollectionSearchResultWidget(params) {
    if(params) {
        this.init(params);
    }
}
CollectionSearchResultWidget.prototype = new Widget();

CollectionSearchResultWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    var collectionInfoWidgetContainer = $('#collection_info_widget_container');
    if(collectionInfoWidgetContainer.length == 0) {
        throw new Error('collectionInfoWidgetContainer not found at: '+collectionInfoWidgetContainer.selector);
    }
    this.collectionInfoWidgetContainer = collectionInfoWidgetContainer;

    
    
    /* When the 'info' button is clicked, create a new Collection info widget */
    this.container.children('.collection_info_button').click(function(me){
        return function() {
            me.showCollectionInfo();
        };
    }(this));
}

CollectionSearchResultWidget.prototype.showCollectionInfo = function() {
    
    
    
};
