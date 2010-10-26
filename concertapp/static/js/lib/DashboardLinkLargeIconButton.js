/**
 *  @file       DashboardLinkLargeIconButton.js
 *  This is the button to navigate to the dashboard.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function DashboardLinkLargeIconButton(params) {
    if(params) {
        this.init(params);
    }
}
DashboardLinkLargeIconButton.prototype = new LinkLargeIconButton();

DashboardLinkLargeIconButton.prototype.init = function(params) {
    LinkLargeIconButton.prototype.init.call(this, params);

    /* No new params */
    

}