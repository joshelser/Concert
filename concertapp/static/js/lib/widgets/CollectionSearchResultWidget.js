/**
 *  @file       CollectionSearchResultWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This widget is displayed for each collection in a collection search result.
 *  @class 
 *  @extend Widget
 **/
var CollectionSearchResultWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        
                
        _.bindAll(this, "render");
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    },
    events: {
        'click .collection_join_button': 'joinCollection', 
        'click .collection_info_button': 'showCollectionInfo', 
    }, 
    joinCollection: function() {
        console.log('joinCollection');
    }, 
    showCollectionInfo: function() {
        console.log('showCollectionInfo');
    }, 
});