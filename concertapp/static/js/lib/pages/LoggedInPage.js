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
    
    /* Every page needs the collection data */
    var userCollectionData = data.collections;
    if(typeof(userCollectionData) == 'undefined') {
        throw new Error('data.collections is undefined');
    }
    this.userCollectionData = userCollectionData;
    
    /* Now lets create our Backbone collection */
    var userCollections = new Collections;
        
    /* Save Backbone collection of Concert Collections */
    this.userCollections = userCollections;
    
    /*  Create the globalOptionsPanel (the buttons and menus at the top of every 
        page) */
    this.globalOptionsPanel = new GlobalOptionsPanel({
        page: this, 
        el: $('#global_options_panel'),
        userCollections: userCollections
    });
    
};

/**
 *  This should be called from init of the child classes.
 **/
LoggedInPage.prototype.refreshUserCollections = function() {
    /* Populate the collections object with all of the data from the server */
    this.userCollections.refresh(this.userCollectionData);
};
