/**
 *  @file       UserCollectionSelect.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
var UserCollectionSelectView = Backbone.View.extend({
    tagName: 'select',
    className: 'collection_selector', 
    
    initialize: function() {
        
        var params = this.options;
        
        var collectionSelectorOptionsTemplate = params.collectionSelectorOptionsTemplate;
        if(typeof(collectionSelectorOptionsTemplate) == 'undefined') {
            throw new Error('params.collectionSelectorOptionsTemplate is undefined');
        }
        else if(collectionSelectorOptionsTemplate.length == 0) {
            throw new Error('collectionSelectorOptionsTemplate not found');
        }
        this.collectionSelectorOptionsTemplate = collectionSelectorOptionsTemplate;
        
        this.collectionSelector = params.collectionSelector;
        
        _.bindAll(this, "render");
    },
    
    render: function() {

        /* Populate dropdown */
        this.collectionSelector.html(
            this.collectionSelectorOptionsTemplate.tmpl({
                collections: this.collection.toJSON(), 
            })
        );
        
        
        return this;
    }
});