/**
 *  @file       Widget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This contains general stuff that needs to take place for any widget on the UI.
 *	@class
 **/
var Widget = Backbone.View.extend({


    /**
     *  Create the DOM elements associated with this widget using a template.  The
     *  container member variable is then set automatically for the widget.  The widget
     *  is not inserted into the DOM.
     *
     *  @constructor
     *  @param  params.template        jQuery tmpl object   -   THe template.
     *  @param  params.panel        Panel object that we belong to.  
     **/    
    initialize: function() {
        var params = this.options;
        
        var template = params.template;
        if(typeof(template) == 'undefined' && typeof(params.el) == 'undefined') {
            throw new Error('params.template or params.el must be undefined');
        }
        else if(typeof(template) != 'undefined' && template.length == 0) {
            throw new Error('template not found');
        }
        this.template = template;

        var panel = params.panel;
        if(typeof(panel) == 'undefined') {
            throw new Error('params.panel is undefined');
        }
        this.panel = panel;

        _.bindAll(this, "render");
        
        this.render();
    },
    render: function() {
        this.el = this.template.tmpl(this.model.toJSON()).get(0);
        
        this.delegateEvents();
                
        return this;
    }
});