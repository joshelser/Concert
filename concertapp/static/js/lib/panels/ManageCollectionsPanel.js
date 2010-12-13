/**
 *  @file       ManageCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A class for managing the user's collections on the manage collections page.
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
        
        var collectionTemplate = $('#collection_template');
        if(typeof(collectionTemplate) == 'undefined' || collectionTemplate.length == 0) {
            throw new Error('collectionTemplate not found');
        }
        this.collectionTemplate = collectionTemplate;
        
        var collectionsTable = $(contents).children('#manage_collections_table');
        if(typeof(collectionsTable) == 'undefined' || collectionsTable.length == 0) {
            throw new Error('collectionsTable not found');
        }
        this.collectionsTable = collectionsTable;
        
        var collectionsTableHeader = $(contents).find('#manage_collections_table_header');
        if(typeof(collectionsTableHeader) == 'undefined' || collectionsTableHeader.length == 0) {
            throw new Error('collectionsTableHeader not found');
        }
        this.collectionsTableHeader = collectionsTableHeader;
        
        var userCollections = params.userCollections;
        if(typeof(userCollections) == 'undefined') {
            throw new Error('params.userCollections is undefined');
        }
        this.userCollections = userCollections;

        
        
        
        
        _.bindAll(this, "render");
        /* Bind collection events to render */
        userCollections.bind('refresh', this.render);
        userCollections.bind('add', this.render);
        userCollections.bind('remove', this.render);
    },
    render: function() {

        /* Temporary fragment for all DOM additions */
        var frag = document.createDocumentFragment();

        /* The header will always be first in the table */
        frag.appendChild(this.collectionsTableHeader.get(0))

        
        /* For each collection object */
        var collections = this.userCollections;
        collections.each(function(panel) {
            return function(collection){
                /* Create a ManageCollectionWidget */
                var widget = new ManageCollectionWidget({
                    template: panel.collectionTemplate, 
                    model: collection, 
                    panel: panel
                });
            
                frag.appendChild(widget.render().el);
            };
        }(this));
        

        /* Update manage collections list */
        this.collectionsTable.empty().append(frag);

        return this;
    }
});
