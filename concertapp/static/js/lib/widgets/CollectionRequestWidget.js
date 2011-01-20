/**
 *  @file       CollectionRequestWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the widget that is displayed within a "ManageCollectionWidget" when there
 *  is a user request for that collection.  It contains a UserWidget and approve/
 *  deny buttons.
 *  @class
 *  @extends    Widget
 **/
var CollectionRequestWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        
        /* Store a reference to the user widget */
        this.userWidget = null;

        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        var container = $(this.el);
        
        /* User widget */
        var userWidget = new UserWidget({
            container: container.children('.user_widget')
        });
        this.userWidget = userWidget;
        
        
        return this;
    },
    events: {
        'click .approve_request': 'approveRequestConfirm',
        'click .deny_request': 'denyRequestConfirm'
    }, 
    /**
     *  This is called when the user clicks the deny request button.
     **/
    denyRequestConfirm: function() {
        /* Show a confirm dialog */
        /*
        com.concertsoundorganizer.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to deny: "+this.userWidget.container.html()+" from this collection?", 
            confirmCallback: function(me){
                return function() {
                    me.denyRequest();
                }
            }(this)
        });*/
        
        console.log('Deny: '+this.model.get('username'));
    },
    /**
     *  This is when the user confirms that he/she wants to deny a request.
     **/
    denyRequest: function() {
        $.getJSON('deny/'+this.collection_id+'/'+this.user_id+'/', 
            function(me){
                return function(data, status) {
                    if(status == 'success' && data.status == 'success') {
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
    },
    /**
     *  This is called when the user clicks the accept request button.
     **/
    approveRequestConfirm: function() {
        /* Show a confirm dialog */
        /*
        com.concertsoundorganizer.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to allow: "+this.userWidget.container.html()+" to organize this collection?", 
            confirmCallback: function(me) {
                return function() {
                    me.approveRequest();
                }
            }(this), 
        });
        */
        console.log('Approve: '+this.model.get('username'));
    },
    /**
     *  This should be called when the actual request is to be approved.
     **/
    approveRequest: function() {
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

    }
    
    
});

