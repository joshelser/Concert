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
        
        
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);

        return this;
    }
});
