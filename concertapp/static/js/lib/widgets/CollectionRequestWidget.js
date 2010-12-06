/**
 *  @file       CollectionRequestWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the widget that is displayed within a "ManageCollectionWidget" when there
 *  is a user request for that collection.  It contains a UserWidget and approve/
 *  deny buttons.
 *  @class
 **/
function CollectionRequestWidget(params) {
    if(params) {
        this.init(params);
    }
}
//CollectionRequestWidget.prototype = new Widget();

CollectionRequestWidget.prototype.init = function(params) {
    //Widget.prototype.init.call(this, params);
    
    var container = params.container;
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    else if(container.length == 0) {
        throw new Error('container not found');
    }
    this.container = container;
    
    var panel = params.panel;
    if(typeof(panel) == 'undefined') {
        throw new Error('params.panel is undefined');
    }
    else if(panel.length == 0) {
        throw new Error('panel not found');
    }
    this.panel = panel;

    
    
    /* This grabs the user_id from the container's 'data-user_id' attribute */
    var user_id = container.data('user_id');
    if(typeof(user_id) == 'undefined' || user_id == null || user_id == '') {
        throw new Error('user_id was not found');
    }
    this.user_id = user_id;
    
    var collection_id = container.data('collection_id');
    if(typeof(collection_id) == 'undefined' || collection_id == null || collection_id == '') {
        throw new Error('collection_id was not found');
    }
    this.collection_id = collection_id;
    

    /* Approve button */
    var approveButton = container.children('.approve_request');
    if(typeof(approveButton) == 'undefined') {
        throw new Error('approveButton is undefined');
    }
    else if(approveButton.length == 0) {
        throw new Error('malformed HTML: approveButton not found');
    }
    this.approveButton = approveButton;

    /* Deny button */
    var denyButton = container.children('.deny_request');
    if(typeof(denyButton) == 'undefined') {
        throw new Error('denyButton is undefined');
    }
    else if(denyButton.length == 0) {
        throw new Error('malformed HTML: denyButton not found');
    }
    this.denyButton = denyButton;


    /* User widget */
    var userWidget = new UserWidget({
        container: container.children('.user_widget')
    });
    this.userWidget = userWidget;
    

    /* When deny button is pressed, deny request */
    denyButton.click(function(me){
        return function(){
            me.denyRequestConfirm();
        };
    }(this));
    
    approveButton.click(function(me){
        return function() {
            me.approveRequestConfirm();
        };
    }(this));
    
}

/**
 *  This is called when the user clicks the deny request button.
 **/
CollectionRequestWidget.prototype.denyRequestConfirm = function() {
    /* Show a confirm dialog */
    com.concertsoundorganizer.notifier.confirm({
        title: "Are you sure?", 
        content: "Are you sure you want to deny: "+this.userWidget.container.html()+" from this collection?", 
        confirmCallback: function(me){
            return function() {
                me.denyRequest();
            }
        }(this)
    });
};

/**
 *  This is when the user confirms that he/she wants to deny a request.
 **/
CollectionRequestWidget.prototype.denyRequest = function() {
    this.panel.toggleLoadingNotification();

    $.getJSON('deny/'+this.collection_id+'/'+this.user_id+'/', 
        function(me){
            return function(data, status) {
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
            };
        }(this)
    );
};

/**
 *  This is called when the user clicks the accept request button.
 **/
CollectionRequestWidget.prototype.approveRequestConfirm = function() {
    /* Show a confirm dialog */
    com.concertsoundorganizer.notifier.confirm({
        title: "Are you sure?", 
        content: "Are you sure you want to allow: "+this.userWidget.container.html()+" to organize this collection?", 
        confirmCallback: function(me) {
            return function() {
                me.approveRequest();
            }
        }(this), 
    });
};

/**
 *  This should be called when the actual request is to be approved.
 **/
CollectionRequestWidget.prototype.approveRequest = function() {
    this.panel.toggleLoadingNotification();

    $.getJSON('approve/'+this.collection_id+'/'+this.user_id+'/', 
        function(me){
            return function(data, status) {
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
            };
        }(this)
    );
    
};



