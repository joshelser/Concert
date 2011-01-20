/**
 *  @file       LoggedInPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This class will run certain functionality that must be run on every page where
 *  a user is logged in.
 *	@class
 **/
function LoggedInPage(params) {
    if(params) {
        this.init(params);
    }
}
LoggedInPage.prototype = new Page();

LoggedInPage.prototype.init = function(params) {
    Page.prototype.init.call(this, params);

    /* Data for current user will probably be needed on pages */
    var userData = params.userData;
    if(typeof(userData) == 'undefined') {
        throw new Error('params.userData is undefined');
    }
    this.userData = userData;

    /* Backbone object for current user */
    var user = new User;
    this.user = user;
    
    /* Collection of users we have seen */
    this.seenUsers = new UserSet;

    
    /* Every page needs the collections that this user is a member of */
    var userMemberCollectionsData = params.memberCollectionsData;
    if(typeof(userMemberCollectionsData) == 'undefined') {
        throw new Error('params.memberCollectionsData is undefined');
    }
    this.userMemberCollectionsData = userMemberCollectionsData;
    
    /* Now lets create our Backbone collection of Concert Collections for which
        the current user is a member. */
    var userMemberCollections = new CollectionSet;
    this.userMemberCollections = userMemberCollections;
    
    /* Any page that has collections represented will require a master list of collections we have seen */
    var seenCollections = new CollectionSet;
    this.seenCollections = seenCollections;
    
        
    
    /*  Create the globalOptionsPanel (the buttons and menus at the top of every 
        page) */
    this.globalOptionsPanel = new GlobalOptionsPanel({
        page: this, 
        el: $('#global_options_panel'),
        userMemberCollections: userMemberCollections
    });
    
};

/**
 *  This should be called from the bottom of init of the child classes.  Should be
 *  extended if the page has any of its own datasets to initialize.
 **/
LoggedInPage.prototype.initData = function() {
    var user = this.user;
    /* parse user data */
    user.set(this.userData);
    
    /* We have now seen our user */
    this.seenUsers.add(user);

    /* Populate the collections object with all of the data from the server */
    this.userMemberCollections.refresh(this.userMemberCollectionsData);
    
    /* We have now seen all of the above collections */
    this.seenCollections.add(this.userMemberCollections.models);
    
};
