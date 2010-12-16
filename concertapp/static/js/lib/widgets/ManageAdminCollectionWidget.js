/**
 *  @file       ManageAdminCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Manage a collection that the user is an administrator of
 *  @class
 *  @extends    Widget
 **/
var ManageAdminCollectionWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /**
         *  The template for a collection request
         **/
        var collectionRequestWidgetTemplate = $('#collection_request_widget_template');
        if(typeof(collectionRequestWidgetTemplate) == 'undefined' || collectionRequestWidgetTemplate.length == 0) {
            throw new Error('collectionRequestWidgetTemplate not found');
        }
        this.collectionRequestWidgetTemplate = collectionRequestWidgetTemplate;
        
        
        /**
         *  The container for the collection requests
         **/
        this.requestContainer = null;
        
        

        _.bindAll(this, "render");
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        if(!this.requestContainer) {
            var requestContainer = $(this.el).children('.user_collection_requests');
            this.requestContainer = requestContainer;
        }
        else {
            var requestContainer = this.requestContainer;
        }
        
        var frag = document.createDocumentFragment();
        
        /*  We are now done rendering the collection information, but we need to 
            create a widget for every user who has requested to join the collection
            */
        this.model.get('requests').each(function(parentWidget, template, frag){
            return function(user) {
                var widget = new CollectionRequestWidget({
                    panel: parentWidget.panel, 
                    model: user, 
                    template: template
                });
                
                frag.appendChild(widget.render().el);
            };
        }(this, this.collectionRequestWidgetTemplate, frag));
        
        requestContainer.html(frag);
        
        return this;
    },
    events: {
        'click .delete_collection': 'delete_collection'
    },
    delete_collection: function() {
        console.log('Delete: '+this.model.get('name'));
    }, 
});
