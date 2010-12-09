/**
 *  @file       ManageCollectionsPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  Panel that lists collections for the user to manage.
 *	@class
 **/
function ManageCollectionsPanel(params) {
    if(params) {
        this.init(params);
    }
}
ManageCollectionsPanel.prototype = new Panel();

/**
 *  @param  params.collectionTemplate        jQuery tmpl - for the collection row.  
 **/
ManageCollectionsPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    /* Template for each collection in the list */
    var collectionTemplate = params.collectionTemplate;
    if(typeof(collectionTemplate) == 'undefined') {
        throw new Error('params.collectionTemplate is undefined');
    }
    else if(collectionTemplate.length == 0) {
        throw new Error('collectionTemplate not found');
    }
    this.collectionTemplate = collectionTemplate;

    /* get the "table" where we will display the collections */
    var collectionsTable = $(this.contents).children('#manage_collections_table');
    if(typeof(collectionsTable) == 'undefined') {
        throw new Error('collectionsTable is undefined');
    }
    else if(collectionsTable.length == 0) {
        throw new Error('malformed HTML: collectionsTable not found');
    }
    this.collectionsTable = collectionsTable;
    
    var collectionsTableHeader = $(this.contents).find('#manage_collections_table_header');
    if(typeof(collectionsTableHeader) == 'undefined') {
        throw new Error('collectionsTableHeader is undefined');
    }
    else if(collectionsTableHeader.length == 0) {
        throw new Error('malformed HTML: collectionsTableHeader not found');
    }
    this.collectionsTableHeader = collectionsTableHeader;

    

    
    
    
    /* reference to globalOptionsPanel so we can call methods on there */
    this.globalOptionsPanel = null;    
    
    /* Keep all the collection widgets in case we need them for something.  Will be
        indexed by collection_id */
    this.collections = [];
    
}

/**
 *  Retrieves collections from backend, then updates the list.
 **/
ManageCollectionsPanel.prototype.retrieveAndUpdateCollections = function() {
    /* Loading */
    this.toggleLoadingNotification();
    
    /* Retrieve JSON data for manage collections list */
    $.getJSON('user/', function(me) {
        return function(data, status) {
            me.updateCollections(data);
            /* un loading */
            me.toggleLoadingNotification();
        };
    }(this));
}

/**
 *  Updates the collection list.
 **/
ManageCollectionsPanel.prototype.updateCollections = function(data) {
    
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
    
    /* Update dropdown */
//    this.globalOptionsPanel.updateCollectionSelector(data);
}

/**
 *  This method deletes a collection from the manage collections panel, then
 *  informs the global options panel that we should remove the collection from there.
 *
 *  @param  collection_id        Number  -  The id of the collection to delete.
 **/
ManageCollectionsPanel.prototype.deleteCollection = function(collection_id) {
    var collection = this.collections[collection_id];
    
    /* Remove row from manage table */
    collection.container.remove();
    /* Remove reference to self from manageCollectionsPanel */
    delete this.collections[collection_id];
    
    /* Tell global options panel to delete collection */
    this.globalOptionsPanel.removeCollectionFromSelector(collection_id);
};

