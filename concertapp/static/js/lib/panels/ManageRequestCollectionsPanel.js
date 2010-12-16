/**
 *  @file       ManageRequestCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the panel where the user can manage the collections he/she has requested
 *  to join.
 *  @class
 *  @extends    ManageCollectionsPanel
 **/
var ManageRequestCollectionsPanel = ManageCollectionsPanel.extend({
    
    initialize: function() {
        ManageCollectionsPanel.prototype.initialize.call(this);

        /* The manage admin collection widget template */
        var widgetTemplate = $('#manage_request_collection_template');
        if(typeof(widgetTemplate) == 'undefined' || widgetTemplate.length == 0) {
            throw new Error('widgetTemplate not found.');
        }
        this.widgetTemplate = widgetTemplate;
        
        /* The ManageAdminCollectionWidget class */
        this.widgetClass = ManageRequestCollectionWidget;
        
    }
});
