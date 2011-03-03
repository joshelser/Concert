/**
 *  @file       Component.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Things that each component will need
 *  @class
 *  @extends    Backbone.View
 **/
var Component = Backbone.View.extend({
    initialize: function() {
        Backbone.View.prototype.initialize.call(this);

        var params = this.options;
        
        var panel = params.panel;
        if(typeof(panel) == 'undefined') {
            throw new Error('params.panel is undefined');
        }
        this.panel = panel;

        _.bindAll(this, "render");
    },

    render: function() {
        Backbone.View.prototype.render.call(this);
        
        return this;
    }
});
