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

/**
 *  @constructor
 **/
LoggedInPage.prototype.init = function(params) {
    Page.prototype.init.call(this, params);
    
    /*  Create the globalOptionsPanel (the buttons and menus at the top of every 
        page) */
    this.globalOptionsPanel = new GlobalOptionsPanel({
        page: this, 
        el: $('#global_options_panel'),
        userMemberCollections: this.modelManager.userMemberCollections
    });
    
};

/**
 *  Our dataset manager is this one.
 **/
LoggedInPage.prototype.createModelManager = function(params) {
    return new LoggedInModelManager(params);
};