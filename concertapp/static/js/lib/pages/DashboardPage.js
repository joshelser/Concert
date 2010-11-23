/**
 *  @file       DashboardPage.js
 *  Functionality associated with the dashboard page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
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