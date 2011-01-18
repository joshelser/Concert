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
    
    /* Get data from the server for this page */
    var data = params.data;
    if(typeof(data) == 'undefined') {
        throw new Error('params.data is undefined');
    }
    else if(data.length == 0) {
        throw new Error('data not found');
    }
    this.data = data;
    
    /* Every page needs the collections that this user is a member of */
    var userMemberCollectionsData = data.memberCollections;
    if(typeof(userMemberCollectionsData) == 'undefined') {
        throw new Error('data.memberCollections is undefined');
    }
    this.userMemberCollectionsData = userMemberCollectionsData;
    
    /* Now lets create our Backbone collection of Concert Collections for which
        the current user is a member. */
    var userMemberCollections = new CollectionSet;
    this.userMemberCollections = userMemberCollections;
    
    /* Data for current user */
    var userData = data.user;
    if(typeof(userData) == 'undefined') {
        throw new Error('data.user is undefined');
    }
    this.userData = userData;

    /* Backbone object for current user */
    var user = new User;
    this.user = user;
        
    
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
 *  overridden if the page has any of its own datasets to initialize.
 **/
LoggedInPage.prototype.initData = function() {
    /* Populate the collections object with all of the data from the server */
    this.userMemberCollections.refresh(this.userMemberCollectionsData);
    
    this.user.set(this.userData);
};
