/**
 *  @file       CollectionsPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Initialize all stuff needed on the collections page.
 *	@class
 *  @extends LoggedInPage
 **/
function CollectionsPage(params) {
    if(params) {
        this.init(params);
    }
}
CollectionsPage.prototype = new LoggedInPage();

CollectionsPage.prototype.init = function(params) {
    LoggedInPage.prototype.init.call(this, params);

    var userCollections = this.userCollections;
    
    /**
     *  Create "create/join collection panel"
     **/
    var createJoinCollectionPanel = new CreateJoinCollectionPanel({
        page: this, 
        el: $('#create_join_panel')
    });
    this.createJoinCollectionPanel = createJoinCollectionPanel;
    
    
    /**
     *  "ManageCollectionsPanel"
     *
    var manageCollectionsPanel = new ManageCollectionsPanel({
        page: this, 
        container: $('#manage_collections_panel'), 
        collectionTemplate: $('#collection_template'),
    });
    this.manageCollectionsPanel = manageCollectionsPanel;
    
    /** Connect panels *
    createJoinCollectionPanel.manageCollectionsPanel = manageCollectionsPanel;
    manageCollectionsPanel.globalOptionsPanel = this.globalOptionsPanel;
    
    /* Retrieve collections to manage 
    manageCollectionsPanel.retrieveAndUpdateCollections();
    */
    
    this.refreshUserCollections();
};