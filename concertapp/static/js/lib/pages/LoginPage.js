/**
 *  @file       LoginPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is the functionality that runs on the login page.
 *	@class
 **/
function LoginPage(params) {
    if(params) {
        this.init(params);
    }
}
LoginPage.prototype = new Page();

LoginPage.prototype.init = function(params) {
    Page.prototype.init.call(this, params);

    /* This will throw a modal window to the user 
        if there is a compatibility problem. */
    detectBrowserCompatibility();
    
}