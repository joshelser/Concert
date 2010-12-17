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
    
    /** The raw collection data for the collections that the current user has
        requested to join **/
    var userRequestCollectionData = params.data.requestCollections;
    if(typeof(userRequestCollectionData) == 'undefined') {
        throw new Error('params.data.requestCollections is undefined');
    }
    this.userRequestCollectionData = userRequestCollectionData;
    
    /*  Backbone collection that will hold the Concert Collection objects
        that the user has requested to join */
    var userRequestCollections = new CollectionSet;
    this.userRequestCollections = userRequestCollections;
    
    
    /**
     *  The raw collection data for collections that the current user is an
     *  administrator of.
     **/
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
     *  This panel will allow the user to manage the collections they are an 
     *  administrator of.
     **/
    var manageAdminCollectionsPanel = new ManageAdminCollectionsPanel({
        page: this,
        el: $('#manage_admin_collections_panel'),
        collections: userAdminCollections
    });
    this.manageAdminCollectionsPanel = manageAdminCollectionsPanel;
    
    /**
     *  This panel will allow the user to manage the collectiosn they are a 
     *  member of (excluding the ones they are an administrator of)
     **/
    var manageMemberCollectionsPanel = new ManageMemberCollectionsPanel({
        page: this, 
        el: $('#manage_member_collections_panel'), 
        collections: userMemberCollections
    });
    
    /**
     *  This panel will allow the user to manage the join requests they have
     *  sent out.
     **/
    var manageRequestCollectionsPanel = new ManageRequestCollectionsPanel({
        page: this, 
        el: $('#manage_request_collections_panel'), 
        collections: userRequestCollections
    });
    
    this.initData();
};

/**
 *  This is called from init.  We override because we have user Requests as well.
 **/
CollectionsPage.prototype.initData = function() {
    LoggedInPage.prototype.initData.call(this);
    
    this.userAdminCollections.refresh(this.userAdminCollectionData);
    this.userRequestCollections.refresh(this.userRequestCollectionData)
};
