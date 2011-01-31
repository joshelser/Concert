/**
 *  @file       CollectionsPageDatasetManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  
 *  @class
 **/
function CollectionsPageDatasetManager(params) {
    if(params) {
        this.init(params);
    }
}
CollectionsPageDatasetManager.prototype = new LoggedInDatasetManager();

/**
 *  @constructor
 **/
CollectionsPageDatasetManager.prototype.init = function(params) {
    LoggedInDatasetManager.prototype.init.call(this, params);

    var dataToLoad = this._dataToLoad;
    
    /**
     *  The raw collection data for collections that the current user is an
     *  administrator of.
     **/
    var userAdminCollectionsData = params.adminCollections;
    if(typeof(userAdminCollectionsData) == 'undefined') {
        throw new Error('params.adminCollections is undefined');
    }
    dataToLoad.userAdminCollectionsData = userAdminCollectionsData;    
    
    /*  Backbone set that will hold Concert Collection objects that the
        user is an administrator of */
    this.userAdminCollections = new CollectionSet;
    
    /** The raw collection data for the collections that the current user has
        requested to join **/
    var requestData = params.requests;
    if(typeof(requestData) == 'undefined') {
        throw new Error('params.requests is undefined');
    }
    dataToLoad.requestData = requestData;
    
    /*  Backbone set that will hold the Concert Collection objects
        that the user has requested to join */
    this.userRequests = new RequestSet;
    
    
};

CollectionsPageDatasetManager.prototype.loadData = function() {
    LoggedInDatasetManager.prototype.loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    var seenCollections = this.seenCollections;
    
    var seenRequests = this.seenRequests;
    
    /* We must merge these collections into our list of seen collections, so we 
        don't have duplicate instances of any collection */
    var userAdminCollections = this.userAdminCollections;
    var userAdminCollectionsData = dataToLoad.userAdminCollectionsData;
    /* So, for each data object */
    for(var i = 0, il = userAdminCollectionsData.length; i < il; i++) {
        var collectionData = userAdminCollectionsData[i];

        /* The current user is an administrator of this collection, this is info
            that might come in handy later */
        collectionData['user_is_admin'] = true;
        
        
        /* Grab this collection from our seen collections 
        var collection = seenCollections.get(collectionData.id);
        if(!collection) {
            /* The collection has not been seen or instantiated yet, so we'll
                create it now. 
            collection = new Collection(collectionData);
            seenCollections.add(collection);
        }
        
        /* Update this object with any new information that may be available 
        collection.set(collectionData);
        
        /* Add the collection silently so views aren't updated right away 
        userAdminCollections.add(collection, {silent: true});*/
    }
    /* Trigger a refresh event so views are updated. */
/*    userAdminCollections.trigger('refresh');*/
    userAdminCollections.refresh(userAdminCollectionsData);

    /* We're done with the admin collections data */
    dataToLoad.userAdminCollectionsData = null;
        
    //this.userRequests.refresh(this.requestData);
};
