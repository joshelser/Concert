/**
 *  @file       CreateNewCollectionButton.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  The button that will allow the user to create a new collection.
 *  @class
 **/
function CreateNewCollectionButton(params) {
    if(params) {
        this.init(params);
    }
}
CreateNewCollectionButton.prototype = new Button();

CreateNewCollectionButton.prototype.init = function(params) {
    Button.prototype.init.call(this, params);

    
};

CreateNewCollectionButton.prototype.click = function() {
    console.log('Create new collection');
};
