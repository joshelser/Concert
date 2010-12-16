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
        

        _.bindAll(this, "render");
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        
        
        return this;
    }
});
