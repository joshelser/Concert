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

    /*  Create the globalOptionsPanel (the buttons and menus at the top of every 
        page) */
    this.globalOptionsPanel = new GlobalOptionsPanel({
        container: $('#global_options_panel'), 
        collectionSelector: $('#collection_selector'),
        collectionSelectorOptionsTemplate: $('#collection_dropdown_options')
    });
}