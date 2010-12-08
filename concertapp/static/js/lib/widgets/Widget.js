/**
 *  @file       Widget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This contains general stuff that needs to take place for any widget on the UI.
 *	@class
 **/
function Widget(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  Create the DOM elements associated with this widget using a template.  The
 *  container member variable is then set automatically for the widget.  The widget
 *  is not inserted into the DOM.
 *
 *  @param  params.template        jQuery tmpl object   -   THe template.
 *  @param  params.context        Object     - the context to send to template.
 *  @param  params.panel        Panel object that we belong to.  
 **/
Widget.prototype.init = function(params) {
    var template = params.template;
    if(typeof(template) == 'undefined') {
        throw new Error('params.template is undefined');
    }
    else if(template.length == 0) {
        throw new Error('template not found');
    }
    
    var context = params.context;
    if(typeof(context) == 'undefined') {
        throw new Error('params.context is undefined');
    }
    this.context = context;
    
    var panel = params.panel;
    if(typeof(panel) == 'undefined') {
        throw new Error('params.panel is undefined');
    }
    this.panel = panel;
    
    this.id = context.id; 
    
    this.container = template.tmpl(context);
}