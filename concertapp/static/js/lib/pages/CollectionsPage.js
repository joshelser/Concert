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
    var requestData = params.requests;
    if(typeof(requestData) == 'undefined') {
        throw new Error('params.requests is undefined');
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
    var userAdminCollectionsData = params.adminCollections;
    if(typeof(userAdminCollectionsData) == 'undefined') {
        throw new Error('params.adminCollections is undefined');
    }
    this.userAdminCollectionsData = userAdminCollectionsData;    
    
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
    
    var seenCollections = this.seenCollections;
    
    /* We must merge these collections into our list of seen collections, so we 
        don't have duplicate instances of any collection */
    var userAdminCollections = this.userAdminCollections;
    var userAdminCollectionsData = this.userAdminCollectionsData;
    for(var i = 0, il = userAdminCollectionsData.length; i < il; i++) {
        var collectionData = userAdminCollectionsData[i];
        
        /* Grab this collection from our seen collections */
        var collection = seenCollections.get(collectionData.id);
        if(!collection) {
            /* The collection has not been seen or instantiated yet, so we'll
                create it now. */
            collection = new Collection(collectionData);
            seenCollections.add(collection);
        }
        /* Add the collection silently so views aren't updated right away */
        userAdminCollections.add(collection, {silent: true});
    }
    /* Trigger a refresh event so views are updated */
    userAdminCollections.trigger('refresh');
        
    this.userRequests.refresh(this.requestData);
};
