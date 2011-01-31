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

    
    
    var datasetManager = this.datasetManager;
        

    /**
     *  Create "create/join collection panel"
     **/
    var createJoinCollectionPanel = new CreateJoinCollectionPanel({
        page: this, 
        el: $('#create_join_panel')
    });
    this.createJoinCollectionPanel = createJoinCollectionPanel;
    
    
    /**
     *  This panel will allow the user to manage the collections they are an 
     *  administrator of.
     **/
    var manageAdminCollectionsPanel = new ManageAdminCollectionsPanel({
        page: this,
        el: $('#manage_admin_collections_panel'),
        set: datasetManager.userAdminCollections
    });
    this.manageAdminCollectionsPanel = manageAdminCollectionsPanel;
    
    /**
     *  This panel will allow the user to manage the collectionsuser they are a 
     *  member of (excluding the ones they are an administrator of)
     **/
    var manageMemberCollectionsPanel = new ManageMemberCollectionsPanel({
        page: this, 
        el: $('#manage_member_collections_panel'), 
        set: datasetManager.userMemberCollections
    });
    this.manageMemberCollectionsPanel = manageMemberCollectionsPanel;
    
    /**
     *  This panel will allow the user to manage the join requests they have
     *  sent out.
     **/
    var manageRequestsPanel = new ManageRequestsPanel({
        page: this, 
        el: $('#manage_request_collections_panel'), 
        set: datasetManager.userRequests
    });
    this.manageRequestsPanel = manageRequestsPanel;
    
    this.datasetManager.loadData();
};

CollectionsPage.prototype.createDatasetManager = function(params) {
    return new CollectionsPageDatasetManager(params);
};