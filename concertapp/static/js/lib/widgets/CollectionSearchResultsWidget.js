/**
 *  @file       CollectionSearchResultsWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the widget that displays the search results when searching for a
 *  collection.
 *  @class
 *  @extends Widget
 **/
var CollectionSearchResultsWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        var resultTemplate = $('#create_join_result_template');
        if(typeof(resultTemplate) == 'undefined' || resultTemplate.length == 0) {
            throw new Error('resultTemplate not found');
        }
        this.resultTemplate = resultTemplate;
        
        var exactResult = params.exactResult;
        if(typeof(exactResult) == 'undefined') {
            throw new Error('exactResult is undefined');
        }
        this.exactResult = exactResult;
        

        _.bindAll(this, 'render');
        /* Bind collection events to render */
        var collections = this.collection;
        collections.bind('refresh', this.render);
        collections.bind('add', this.render);
        collections.bind('remove', this.render);
    },
    render: function() {
        
        var resultTemplate = this.resultTemplate;
        
        /* For each element in the collection */
        var collections = this.collection;
        collections.each(function(collection){
            /* Create a CollectionSearchResult widget */
            
        });
        
        return this;
    }
});
