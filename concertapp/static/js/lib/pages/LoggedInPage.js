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
    var collectionData = data.collections;
    if(typeof(collectionData) == 'undefined') {
        throw new Error('data.collections is undefined');
    }
    
    /* Now lets create our Backbone collection */
    var collections = new Collections;
    
    /* And populate it with all of the data from the server */
    collections.refresh(collectionData);
    
    /* Save Backbone collection of Concert Collections */
    this.collections = collections;
    
    

    /*  Create the globalOptionsPanel (the buttons and menus at the top of every 
        page) */
    this.globalOptionsPanel = new GlobalOptionsPanel({
        page: this, 
        container: $('#global_options_panel')
    });
}