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

/**
 *  @constructor
 **/
CreateNewCollectionButton.prototype.init = function(params) {
    Button.prototype.init.call(this, params);
    
    /* The panel we are on.  Need to access this to reset the form (for now this is
        good enough, but TODO: in the future, the CreateJoinCollectionPanel should
        be watching the results collection and calling the resetForm method 
        automatically when the collection changes.)
        */
    var panel = params.panel;
    if(typeof(panel) == 'undefined') {
        throw new Error('params.panel is undefined');
    }
    this.panel = panel;
    
    var modelManager = com.concersoundorganizer.modelManager;
    
    /* A reference to the collection sets that we will need to add the new 
        collection to if the user decides to create it */
    var userAdminCollections = null;
    if(typeof(userAdminCollections) == 'undefined') {
        throw new Error('params.userAdminCollections is undefined');
    }
    this.userAdminCollections = userAdminCollections;
    
    var userMemberCollections = params.userMemberCollections;
    if(typeof(userMemberCollections) == 'undefined') {
        throw new Error('params.userMemberCollections is undefined');
    }
    this.userMemberCollections = userMemberCollections;

    /* The name that the user has entered for the new collection */
    var newCollectionName = params.newCollectionName;
    if(typeof(newCollectionName) == 'undefined') {
        throw new Error('params.newCollectionName is undefined');
    }
    this.newCollectionName = newCollectionName;
    
    this.user = panel.page.user;
    
};

/**
 *  This is what will be executed when the user clicks the button, deciding to 
 *  create a new collection.
 **/
CreateNewCollectionButton.prototype.click = function() {
    
    /* Create new collection */
    var newCollection = new Collection({
        name: this.newCollectionName,
        users: [], 
        admin: this.user.url()
    });
    
    /* Save to server */
    newCollection.save({}, {
        /* On successful save */
        success: function(userMemberCollections, userAdminCollections, panel) {
            return function(model, response) {
                model.set({'user_is_admin': true});
                Collection.prototype.seenInstances.add(model);
                userAdminCollections.add(model);
                userMemberCollections.add(model);
                /* Reset the search field */
                panel.resetForm();
            };
        }(this.userMemberCollections, this.userAdminCollections, this.panel)
    });
};
