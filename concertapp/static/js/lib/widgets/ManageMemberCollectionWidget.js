/**
 *  @file       ManageMemberCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This class is for displaying the manage collection widget for a Concert
 *  Collection that the user is a member of.  If they are an administrator,
 *  this will be handled in the template.
 *  @class
 *  @extends    Widget
 **/
var ManageMemberCollectionWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        _.bindAll(this, "render");
        /* Render when users has changed */
        this.model.get('users').bind('add', this.render);
        this.model.get('users').bind('remove', this.render);
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);

        return this;
    },
    events: {
        'click button.leave_collection': 'leave_collection_confirm'
    }, 
    leave_collection_confirm: function() {
        com.concertsoundorganizer.notifier.confirm({
            title: 'Are you sure?', 
            content: 'Are you sure you want to leave '+this.model.get('name')+'?<br />You will no longer be able to work on this collection\'s assets.', 
            confirmCallback: function(me) {
                return function() {
                    me.leave_collection();
                };
            }(this)
        });
    },
    leave_collection: function() {
        this.model.leave();
    }, 
});
