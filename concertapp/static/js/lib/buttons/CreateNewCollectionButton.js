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
    
    var panel = params.panel;
    if(typeof(panel) == 'undefined') {
        throw new Error('params.panel is undefined');
    }
    this.panel = panel;
    
    var userAdminCollections = params.userAdminCollections;
    if(typeof(userAdminCollections) == 'undefined') {
        throw new Error('params.userAdminCollections is undefined');
    }
    this.userAdminCollections = userAdminCollections;
    
    var userMemberCollections = params.userMemberCollections;
    if(typeof(userMemberCollections) == 'undefined') {
        throw new Error('params.userMemberCollections is undefined');
    }
    this.userMemberCollections = userMemberCollections;

    var newCollectionName = params.newCollectionName;
    if(typeof(newCollectionName) == 'undefined') {
        throw new Error('params.newCollectionName is undefined');
    }
    this.newCollectionName = newCollectionName;
    
    
};

CreateNewCollectionButton.prototype.click = function() {
    
    var newCollection = new Collection({
        name: this.newCollectionName
    });
    
    newCollection.save({}, {
        success: function(userMemberCollections, userAdminCollections, panel) {
            return function(model, response) {
                userMemberCollections.add(model);
                userAdminCollections.add(model);
                panel.resetForm();
            };
        }(this.userMemberCollections, this.userAdminCollections, this.panel)
    });
    
    
};
