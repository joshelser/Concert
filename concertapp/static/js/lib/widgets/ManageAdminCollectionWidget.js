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
    /**
     *  This is called when the user first clicks the delete button.
     **/
    delete_collection: function() {
        /* First confirm with the user that this is what they would like to do */
        /* TODO: Remove this text */
        com.concertsoundorganizer.notifier.confirm({
            title: 'Are you sure?', 
            content: 'Are you sure you want to delete '+this.model.get('name')+'<br />All associated audio will be removed from Concert.',
            confirmCallback: function(me) {
                return function() {
                    me.really_delete_collection();
                }
            }(this)
        })
    }, 
    /**
     *  This is called when the user confirms the deletion.
     **/
    really_delete_collection: function() {
        this.model.destroy({
            success: function(model, response) {
                console.log('model:');
                console.log(model);
                
                console.log('response:');
                console.log(response);
            },
            error: function(model, response) {
                com.concertsoundorganizer.notifier.alert({
                    title: 'Error', 
                    content: 'An Error occurred: '+response.responseText, 
                })
            }, 
        });
    }, 
});
