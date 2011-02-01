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
    
    var seenInstances = com.concertsoundorganizer.datasetManager.seenInstances['Collection'];
    
    
    var userAdminCollections = this.userAdminCollections;
    var userAdminCollectionsData = dataToLoad.userAdminCollectionsData;
    for(var i = 0, il = userAdminCollectionsData.length; i < il; i++) {
        /* The current user is an administrator of this collection, this is info
            that might come in handy later */
        userAdminCollectionsData[i]['user_is_admin'] = true;
    }
    userAdminCollections.refresh(userAdminCollectionsData);
    /* We're done with the admin collections data */
    dataToLoad.userAdminCollectionsData = null;
        
    var seenRequests = this.seenInstances['Request'];
    this.userRequests.refresh(dataToLoad.requestData);
    dataToLoad.requestData = null;
};
