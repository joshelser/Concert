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

    /**
     *  Create "create/join collection panel"
     **/

    var createJoinCollectionPanel = new CreateJoinCollectionPanel({
        page: this, 
        el: $('#create_join_panel'), 
        collection: this.collections, 
    });
    this.createJoinCollectionPanel = createJoinCollectionPanel;
    
    
    /**
     *  "ManageCollectionsPanel"
     **/
    var manageCollectionsPanel = new ManageCollectionsPanel({
        page: this, 
        el: $('#manage_collections_panel').get(0),
        collection: this.collections, 
    });
    this.manageCollectionsPanel = manageCollectionsPanel;
    
}