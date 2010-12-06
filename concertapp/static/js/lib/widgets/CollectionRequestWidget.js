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
    console.log('deny request');
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
    console.log('allow request');
};



