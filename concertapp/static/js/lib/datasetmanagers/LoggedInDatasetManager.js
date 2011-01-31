/**
 *  @file       LoggedInDatasetManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the manager for datasets when there is a user logged in.  The stuff
 *  below will be necessary on any logged in page.
 *  @class
 **/
function LoggedInDatasetManager(params) {
    if(params) {
        this.init(params);
    }
}
LoggedInDatasetManager.prototype = new DatasetManager();

LoggedInDatasetManager.prototype.init = function(params) {
    DatasetManager.prototype.init.call(this, params);
    
    var dataToLoad = this._dataToLoad;
    
    /* Get data for user */
    var userData = params.userData;
    if(typeof(userData) == 'undefined') {
        throw new Error('params.userData is undefined');
    }
    dataToLoad['userData'] = userData;
    
    /* Every page needs the collections that this user is a member of */
    var userMemberCollectionsData = params.memberCollectionsData;
    if(typeof(userMemberCollectionsData) == 'undefined') {
        throw new Error('params.memberCollectionsData is undefined');
    }
    dataToLoad['userMemberCollectionsData'] = userMemberCollectionsData;
    
    /* Now lets create our Backbone collection of Concert Collections for which
        the current user is a member. */
    this.userMemberCollections = new CollectionSet;
    
    /* Any page that has collections represented will require a master list of collections we have seen */
    this.seenCollections = new CollectionSet;

    /* Master list of requests */
    this.seenRequests = new RequestSet;


    /* We will need to maintain a list of users that we have seen */
    this.seenUsers = new UserSet;
    
    /* We will keep a reference to the current user */
    this.user = new User;
    
};

/**
 *  Here we will create all of the Backbone objects that are needed from data that
 *  was loaded initially.
 **/
LoggedInDatasetManager.prototype.loadData = function() {
    
    var dataToLoad = this._dataToLoad;
    
    /**
     *  Load user info
     **/
    var user = this.user;
    user.set(dataToLoad['userData']);
    this.seenUsers.add(user);
    /* done with user data */
    dataToLoad['userData'] = null;
    
    /**
     *  Load collection info
     **/
    var userMemberCollections = this.userMemberCollections;
    userMemberCollections.refresh(dataToLoad['userMemberCollectionsData']);
    this.seenCollections.add(userMemberCollections.models)
    
};
