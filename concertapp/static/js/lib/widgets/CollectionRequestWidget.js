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
        com.concertsoundorganizer.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to deny "+this.model.get('user').get('username')+" from this collection?", 
            confirmCallback: function(me){
                return function() {
                    me.denyRequest();
                }
            }(this)
        });
    },
    /**
     *  This is when the user confirms that he/she wants to deny a request.
     **/
    denyRequest: function() {
        this.model.deny();
    },
    /**
     *  This is called when the user clicks the accept request button.
     **/
    approveRequestConfirm: function() {
        /* Show a confirm dialog */
        com.concertsoundorganizer.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to allow "+this.model.get('user').get('username')+" to organize this collection?", 
            confirmCallback: function(me) {
                return function() {
                    me.approveRequest();
                }
            }(this), 
        });
    },
    /**
     *  This should be called when the actual request is to be approved.
     **/
    approveRequest: function() {
        this.model.approve();
    }
});

