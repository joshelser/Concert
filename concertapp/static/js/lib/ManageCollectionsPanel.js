/**
 *  @file       ManageCollectionsPanel.js
 *  Panel that lists collections for the user to manage.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
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
    this.collectionTemplate = collectionTemplate;
    
    
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
    /* Retrieve JSON data for manage collections list */
    $.getJSON('user/', function(me) {
        return function(data, status) {
            me.updateCollections(data);
        };
    }(this));
}

/**
 *  Updates the collection list.
 **/
ManageCollectionsPanel.prototype.updateCollections = function(data) {
    
    var collectionTemplate = this.collectionTemplate;
    var container = this.container;
    
    var collections = [];
    
    /* Temporary fragment for all DOM additions */
    var frag = document.createDocumentFragment();

    for(i = 0, il = data.length; i < il; i++) {
        var col = data[i];
        
        var widget = new CollectionWidget({
            template: collectionTemplate, 
            context: col,
            manageCollectionsPanel: this
        });
        
        collections[col.id] = widget;
        
        frag.appendChild(widget.container.get(0));
    
    }
    
    /* Update manage collections list */
    container.empty().append(frag);
    
    this.collections = collections;
    
    /* Update dropdown */
    this.globalOptionsPanel.updateCollectionSelector(data);
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

