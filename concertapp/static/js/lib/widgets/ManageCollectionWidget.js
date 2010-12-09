/**
 *  @file       ManageCollectionWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  A collection widget is a widget that is displayed in a collections list.  It
 *  has information about the collection, as well as options to delete or leave
 *  the collection.
 *	@class
 **/
var ManageCollectionWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);
        
        var params = this.options;
        
        var container = $(this.el);
        
        /* Collection id is easier to understand here */
        var collection_id = this.model.id;
        this.collection_id = this.model.id;
        

        var nameElement = container.find('#user_collection_name-'+collection_id);
        if(nameElement.length == 0) {
            throw new Error('Element #user_collection_name-'+collection_id+' does not exist!');
        }
        this.nameElement = nameElement;


        var membersElement = container.find('#user_collection_members-'+collection_id)
        if(membersElement.length == 0) {
            throw new Error('Element #user_collection_members-'+collection_id+' does not exist!');
        }
        this.membersElement = membersElement;


        /* For all of the user collection requests, create a CollectionRequestWidget*/
        var collectionRequestWidgets = [];


        var collectionRequestContainers = container.children('.user_collection_requests').children();

        for(var i = 0, il = collectionRequestContainers.length; i < il; i++) {
            collectionRequestWidgets.push(new CollectionRequestWidget({
                container: $(collectionRequestContainers[i]),
                panel: this.panel, 
            }));
        }
        

        _.bindAll(this, "render");
    },
    
    render: function() {
        Widget.prototype.render.call(this);
        
        
        
        return this;
    },
    
    events: {
        'click button.delete_collection': 'delete_collection', 
        'click button.leave_collection': 'leave_collection',
        'click button.revoke_request': 'revoke_request',
        
    },
    
    /**
     *  This will be executed when the delete button is pressed on a collection
     **/
    delete_collection: function() {
        console.log('delete_collection');
    },
    
    /**
     *  This will be executed when the "leave" button is pressed on a collection
     **/
    leave_collection: function() {
        console.log('leave_collection');
    },
    
    /**
     *  This will be executed when the "revoke" button is pressed on a collection
     *  that the user has requested to join.
     **/
    revoke_request: function() {
        console.log('revoke_request');
    }
    
});
