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
    
    /** The raw collection data for the collections that the current user has
        requested to join **/
    var userRequestsData = params.data.requestCollections;
    if(typeof(userRequestsData) == 'undefined') {
        throw new Error('params.data.requestCollections is undefined');
    }
    this.userRequestsData = userRequestsData;
    
    /*  Backbone collection that will hold the Concert Collection objects
        that the user has requested to join */
    var userRequests = new CollectionSet;
    this.userRequests = userRequests;
    
    
    var userAdminCollectionData = params.data.adminCollections;
    if(typeof(userAdminCollectionData) == 'undefined') {
        throw new Error('params.data.adminCollections is undefined');
    }
    this.userAdminCollectionData = userAdminCollectionData;
    
    console.log('userAdminCollectionData:');
    console.log(userAdminCollectionData);

    
    
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
     *  "ManageCollectionsPanel"
     **/
    var manageCollectionsPanel = new ManageCollectionsPanel({
        page: this, 
        el: $('#manage_collections_panel'),
        userCollections: userCollections, 
        userRequests: userRequests
    });
    this.manageCollectionsPanel = manageCollectionsPanel;
    
    
    this.initData();
};

/**
 *  This is called from init.  We override because we have user Requests as well.
 **/
CollectionsPage.prototype.initData = function() {
    LoggedInPage.prototype.initData.call(this);
    
    this.userRequests.refresh(this.userRequestsData);
};
