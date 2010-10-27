/**
 *  @file       collections.js
 *  All functionality associated with collections page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeCollectionsPage(params) {
    
    
    /**
     *  Create "create/join collection panel"
     **/
    var createJoinCollectionPanel = new CreateJoinCollectionPanel({
        container: $('#create_join_container'), 
        inputElement: $('#create_join_input'), 
        resultsElement: $('#create_join_results'),
        resultTemplate: $('#create_join_result'),
        createNewTemplate: $('#create_join_create_new')
    });
    
    /**
     *  "ManageCollectionsPanel"
     **/
    var manageCollectionsPanel = new ManageCollectionsPanel({
        container: $('#manage_collections_container'), 
        collectionTemplate: $('#collection_template')
    });
    
    /** Connect panels **/
    createJoinCollectionPanel.manageCollectionsPanel = manageCollectionsPanel;
    manageCollectionsPanel.globalOptionsPanel = params.globalOptionsPanel;
    
    /* Retrieve collections to manage */
    manageCollectionsPanel.retrieveAndUpdateCollections();
    
        
}


