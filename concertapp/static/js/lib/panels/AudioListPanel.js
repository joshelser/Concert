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

    this.retrieveData();
}

AudioListPanel.prototype.retrieveData = function() {
    $.getJSON(
        window.location+'/audio', 
        function(me) {
            return function(data, status, xhr){
                me.processData(data);
            };
        }(this)
    );
};

AudioListPanel.prototype.processData = function(data) {
    console.log('data:');
    console.log(data);
};

