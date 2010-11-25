/**
 *  @file       DashboardPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Functionality associated with the dashboard page.
 *	@class
 **/
function DashboardPage(params) {
    if(params) {
        this.init(params);
    }
}
DashboardPage.prototype = new LoggedInPage();

DashboardPage.prototype.init = function(params) {
    LoggedInPage.prototype.init.call(this, params);

    console.log('Dashboard page initialized.');
    
}