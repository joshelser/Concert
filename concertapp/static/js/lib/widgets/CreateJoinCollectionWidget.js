/**
 *  @file       CreateJoinCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The widget that is in charge of the collection search and join.
 *  @class
 **/
var CreateJoinCollectionWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);
        
        var params = this.options;
        
        var container = $(this.el);
        
        
        var resultsElement = container.children('.create_join_results');
        if(typeof(resultsElement) == 'undefined' || resultsElement.length == 0) {
            throw new Error('resultsElement not found');
        }
        this.resultsElement = resultsElement;
        
        
        var createNewTemplate = $('#create_join_create_new_template');
        if(typeof(createNewTemplate) == 'undefined' || createNewTemplate.length == 0) {
            throw new Error('createNewTemplate not found');
        }
        this.createNewTemplate = createNewTemplate;
        


        /* When "create new collection" button is pressed */
        $('#create_new_collection').live('click', function(me) {
            return function() {
                me.createNewCollection({
                    collection_name: $(this).attr('data-collection_name'), 
                });
            };
        }(this));

        /* This is a list of the widgets for search results */
        this.resultWidgets = null;
        
        
        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        
        return this;
    },
    

});
