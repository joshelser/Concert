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
function ManageCollectionWidget(params) {
    if(params) {
        this.init(params);
    }
}
ManageCollectionWidget.prototype = new Widget();

/**
 **/
ManageCollectionWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

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
    
    
};

/**
 *  This will be called when the user is revoking his/her request to join a
 *  collection.
 **/
ManageCollectionWidget.prototype.revokeRequest = function() {
    var collection_id = this.collection_id;
    this.panel.toggleLoadingNotification();
    
    $.getJSON('revoke/'+collection_id, 
        function(me){ 
            return function(data, status){
                if(status == 'success' && data.status == 'success') {
                    me.panel.toggleLoadingNotification();
                    me.panel.retrieveAndUpdateCollections();
                }
                else {
                    com.concertsoundorganizer.notifier.alert({
                        title: "Error", 
                        content: "An error occurred: "+data.notification, 
                    });
                }
            }; }(this));
};



/**
 *  This should be called when user presses the delete button for a collection.
 *  Just prompts them "Are you sure?" about deleting the collection.
 **/
ManageCollectionWidget.prototype.deleteCollectionConfirm = function() {
    /* Confirm with user */
    com.concertsoundorganizer.notifier.confirm({
        'title': 'Are you sure?',
        'content': 'Are you sure you want to delete collection "'+this.nameElement.html()+'"?<br />All related content will be removed from Concert.',
        'confirmCallback': function(me) {
            return function() {
                me.deleteCollection();
            };
        }(this)/*,
        'cancelCallback': function(collection_id) {
            return function() {

            };
        }(collection_id)*/
    });
}

/**
 *  Should be called when collection is actually to be deleted.  This is serious 
 *  stuff, and will error on backend if user doesn't have proper permissions.
 **/
ManageCollectionWidget.prototype.deleteCollection = function() {
    /* we are serious about deleting this collection. */
    $.ajax({
        url: 'delete/',
        data: { id: this.collection_id },
        type: 'POST',
        success: function(me) {
            return function(data, status, xhr) {
                if(data == 'success') {
                    com.concertsoundorganizer.notifier.alert({
                        title: 'Success!',
                        content: 'The collection has been deleted.'
                    });

                    /* Remove me from panel */
                    me.panel.deleteCollection(me.collection_id);
                }
                else {
                    com.concertsoundorganizer.notifier.alert({
                        title: 'Error', 
                        content: 'An error has occurred.'
                    });
                }
            };
        }(this)
    });
}