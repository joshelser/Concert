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
        
        var container = this.container;

        /* Collection id is easier to understand here */
        var collection_id = this.id;
        this.collection_id = this.id;

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


        /* The deleteButton on the widget */
        var deleteButton = container.find('#delete_collection-'+collection_id);
        if(deleteButton.length) {
            this.deleteButton = deleteButton;

            /* Initialize delete behavior here, because this will not change 
                dynamically */
            deleteButton.click(function(me){
                return function() {
                    me.deleteCollectionConfirm();
                };
            }(this));
        }

        /* The leave button on the widget */
        var leaveButton = container.find('#leave_collection-'+collection_id);
        if(leaveButton.length) {
            this.leaveButton = leaveButton;

            /* Initialize leave behavior here, because this will not change */
            leaveButton.click(function(me){
                return function() {
                    me.leaveCollection();
                };
            }(this));
        }

        /* The revoke request button on the widget */
        var revokeButton = container.find('#revoke_request-'+collection_id);
        if(revokeButton.length) {
            this.revokeButton = revokeButton;

            /* When revoke button is clicked, revoke join request */
            revokeButton.click(function(me) {
                return function() {
                    me.revokeRequest();
                };
            }(this));
        }

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
        
        return this;
    }
});
