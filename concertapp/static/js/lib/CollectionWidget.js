/**
 *  @file       CollectionWidget.js
 *  A collection widget is a widget that is displayed in a collections list.  It
 *  has information about the collection, as well as options to delete or leave
 *  the collection.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function CollectionWidget(params) {
    if(params) {
        this.init(params);
    }
}
CollectionWidget.prototype = new Widget();

/**
 *  @param  nameElement         jQuery HTMLDivElement - the element that holds the 
 *                              name of the collection
 *  @param  membersElement      jQuery HTMLDivElement - the element that holds
 *                              the link for the number of members
 *  @param  deleteButton        jQuery HTMLButtonElement  - The button that will 
 *                              delete the group.  THis is OPTIONAL because the user
 *                              might not have permissions to delete the group.
 *  @param  leaveButton         jQuery HTMLButtonElement - the button that will allow
 *                              the user to leave the group.  This is OPTIONAL 
 *                              because if the user is an admin they can't leave.
 *  @param  params.collectionTemplate        jQuery tmpl - for the collection row.  
 **/
CollectionWidget.prototype.init = function(params) {
    Widget.prototype.init.call(this, params);

    var nameElement = params.nameElement;
    if(typeof(nameElement) == 'undefined') {
        throw new Error('params.nameElement is undefined');
    }
    this.nameElement = nameElement;
    
    var membersElement = params.membersElement;
    if(typeof(membersElement) == 'undefined') {
        throw new Error('params.membersElement is undefined');
    }
    this.membersElement = membersElement;
    
    var deleteButton = params.deleteButton;
    if(typeof(deleteButton) != 'undefined') {
        this.deleteButton = deleteButton;
        
        /* Initialize delete behavior here, because this will not change 
            dynamically */
        deleteButton.click(function(me){
            return function() {
                me.deleteCollection();
            };
        }(this));
    }
    
    var leaveButton = params.leaveButton;
    if(typeof(leaveButton) != 'undefined') {
        this.leaveButton = leaveButton;
        
        /* Initialize leave behavior here, because this will not change */
        leaveButton.click(function(me){
            return function() {
                me.leaveCollection();
            };
        }(this));
    }
    
    var collectionTemplate = params.collectionTemplate;
    if(typeof(collectionTemplate) == 'undefined') {
        throw new Error('params.collectionTemplate is undefined');
    }
    this.collectionTemplate = collectionTemplate;
    
    
}