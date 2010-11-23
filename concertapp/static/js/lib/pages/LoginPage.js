/**
 *  @file       LoginPage.js
 *  This is the functionality that runs on the login page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function LoginPage(params) {
    if(params) {
        this.init(params);
    }
}
LoginPage.prototype = new Page();

LoginPage.prototype.init = function(params) {
    Page.prototype.init.call(this, params);

    
}