/**
 *  @file       AudioListPanel.js
 *  Displays the segment or clip list within
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function AudioListPanel(params) {
    if(params) {
        this.init(params);
    }
}
AudioListPanel.prototype = new Panel();

AudioListPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    
}