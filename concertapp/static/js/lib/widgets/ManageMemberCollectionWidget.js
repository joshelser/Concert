/**
 *  @file       ManageMemberCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This class is for displaying the manage collection widget for a Concert
 *  Collection that the user is a member of.
 *  @class
 *  @extends    Widget
 **/
var ManageMemberCollectionWidget = Widget.extend({
    
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
