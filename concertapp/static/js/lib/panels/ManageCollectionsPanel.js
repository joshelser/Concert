/**
 *  @file       ManageCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A class for managing the user's collections on the manage collections page.  
 *  This is subclassed for the various types of collections that the user can manage.
 *  @class
 *  @extends Panel
 **/
var ManageCollectionsPanel = Panel.extend({
    
    /**
     *  @constructor
     **/
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        var contents = this.contents;
        
        var $ = jQuery;
        
        /**
         *  The Concert Collection objects.  Not to be confused with the Backbone.js
         *  "collection" convention - although they are basically the same thing.
         **/
        var collections = params.collections;
        if(typeof(collections) == 'undefined') {
            throw new Error('params.collections is undefined');
        }
        this.collections = collections;
        
        var table = $(contents).children('.table');
        if(typeof(table) == 'undefined') {
            throw new Error('table is undefined');
        }
        else if(table.length == 0) {
            throw new Error('table not found');
        }
        this.table = table;
        
        var tableHeader = $(table).children('.table-header');
        if(typeof(tableHeader) == 'undefined') {
            throw new Error('tableHeader is undefined');
        }
        else if(tableHeader.length == 0) {
            throw new Error('tableHeader not found');
        }
        this.tableHeader = tableHeader;        
        
        
        _.bindAll(this, "render");
        collections.bind('refresh', this.render);
        collections.bind('add', this.render);
        collections.bind('remove', this.render);
    },
    render: function() {

        /* Temporary fragment for all DOM additions */
        var frag = document.createDocumentFragment();

        /* The header will always be first in the table */
        frag.appendChild(this.tableHeader.get(0))
        
        
        this.collections.each(function(panel, template, widgetClass, frag) {
            return function(collection){
                /* Create a ManageCollectionWidget */
                var widget = new widgetClass({
                    template: template, 
                    model: collection, 
                    panel: panel
                });
            
                frag.appendChild(widget.render().el);
            };
        }(this, this.widgetTemplate, this.widgetClass, frag));
        
        /* Update manage collections list */
        this.table.empty().append(frag);

        return this;
    }
});
