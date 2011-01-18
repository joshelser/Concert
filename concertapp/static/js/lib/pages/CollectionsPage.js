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

    var userMemberCollections = this.userMemberCollections;
    
    var data = params.data;
    
    /** The raw collection data for the collections that the current user has
        requested to join **/
    var requestData = data.requests;
    if(typeof(requestData) == 'undefined') {
        throw new Error('params.data.requests is undefined');
    }
    this.requestData = requestData;
    
    /*  Backbone collection that will hold the Concert Collection objects
        that the user has requested to join */
    var userRequests = new RequestSet;
    this.userRequests = userRequests;
    
    
    /**
     *  The raw collection data for collections that the current user is an
     *  administrator of.
     **/
    var userAdminCollectionData = data.adminCollections;
    if(typeof(userAdminCollectionData) == 'undefined') {
        throw new Error('params.data.adminCollections is undefined');
    }
    this.userAdminCollectionData = userAdminCollectionData;    
    
    /*  Backbone collection that will hold Concert Collection objects that the
        user is an administrator of */
    var userAdminCollections = new CollectionSet;
    this.userAdminCollections = userAdminCollections;
    

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
        set: userAdminCollections
    });
    this.manageAdminCollectionsPanel = manageAdminCollectionsPanel;
    
    /**
     *  This panel will allow the user to manage the collectiosn they are a 
     *  member of (excluding the ones they are an administrator of)
     **/
    var manageMemberCollectionsPanel = new ManageMemberCollectionsPanel({
        page: this, 
        el: $('#manage_member_collections_panel'), 
        set: userMemberCollections
    });
    this.manageMemberCollectionsPanel = manageMemberCollectionsPanel;
    
    /**
     *  This panel will allow the user to manage the join requests they have
     *  sent out.
     **/
    var manageRequestsPanel = new ManageRequestsPanel({
        page: this, 
        el: $('#manage_request_collections_panel'), 
        set: userRequests
    });
    this.manageRequestsPanel = manageRequestsPanel;
    
    this.initData();
};

/**
 *  This is called from init.  We override because we have user Requests as well.
 **/
CollectionsPage.prototype.initData = function() {
    LoggedInPage.prototype.initData.call(this);
    
    this.userAdminCollections.refresh(this.userAdminCollectionData);
    this.userRequests.refresh(this.requestData)
};
