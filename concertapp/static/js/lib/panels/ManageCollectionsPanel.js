/**
 *  @file       ManageCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A class for managing the user's collections on the manage collections page.
 *  @class
 **/
var ManageCollectionsPanel = Backbone.View.extend({
    
    initialize: function() {
        var params = this.options;
        
        
        
        this.collectionTemplate = $('#collection_template');
        
        this.collectionsTable = $(this.contents).children('#manage_collections_table');
    },
    render: function() {
        var collectionTemplate = this.collectionTemplate;
        var collectionsTable = this.collectionsTable;

        var collections = [];

        /* Temporary fragment for all DOM additions */
        var frag = document.createDocumentFragment();

        /* The header will always be first in the table */
        frag.appendChild(this.collectionsTableHeader.get(0))

        for(i = 0, il = data.length; i < il; i++) {
            var col = data[i];

            var widget = new ManageCollectionWidget({
                template: collectionTemplate, 
                context: col,
                panel: this
            });

            collections[col.id] = widget;

            frag.appendChild(widget.container.get(0));

        }

        /* Update manage collections list */
        collectionsTable.empty().append(frag);

        this.collections = collections;
        
        return this;
    }
});
