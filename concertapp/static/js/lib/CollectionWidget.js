/**
 *  @file       CollectionWidget.js
 *  A collection widget is a widget that is displayed in a collections list.  It
 *  has information about the collection, as well as options to delete or leave
 *  the collection.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function CollectionWidget(params) {
    if(params) {
        this.init(params);
    }
}
CollectionWidget.prototype = new Widget();

/**
 *  @param  manageCollectionsPanel        ManageCollectionsPanel - that we are a
 *                                          member of.
 **/
CollectionWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    var container = this.container;
    
    var collection_id = params.context.id;
    this.collection_id = collection_id;
    
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
    
    if(leaveButton.length == 0 && deleteButton.length == 0) {
        throw new Error('leaveButton or deleteButton must be defined');
    }    
    
    /* We need a reference to the manageCollectionsPanel object that we are a
        part of */
    var manageCollectionsPanel = params.manageCollectionsPanel;
    if(typeof(manageCollectionsPanel) == 'undefined') {
        throw new Error('params.manageCollectionsPanel is undefined');
    }
    this.manageCollectionsPanel = manageCollectionsPanel;
    
}

/**
 *  This should be called when user presses the delete button for a collection.
 *  Just prompts them "Are you sure?" about deleting the collection.
 **/
CollectionWidget.prototype.deleteCollectionConfirm = function() {
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
CollectionWidget.prototype.deleteCollection = function() {
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

                    /* Remove row from manage table */
                    me.container.remove();
                    /* Remove reference to self from manageCollectionsPanel */
                    delete manageCollectionsPanel.collections[me.id];
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