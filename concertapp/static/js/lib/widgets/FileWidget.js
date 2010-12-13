/**
 *  @file       FileWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a widget that is found in the Audio list panel (when it is on file mode)
 *  it contains the functionality associated with an audio file on the organize
 *  page.
 *  @class
 *  @extends    Widget
 **/
var FileWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        
        return this;
    }
});

