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
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    }
});