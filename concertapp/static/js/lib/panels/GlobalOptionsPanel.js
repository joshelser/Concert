/**
 *  @file       GlobalOptionsPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panel on the top of every page.
 *	@class
 **/
function GlobalOptionsPanel(params) {
    if(params) {
        this.init(params);
    }
}
GlobalOptionsPanel.prototype = new Panel();

/**
 *  Initialize panel
 *
 *  @param  params.collectionSelector        jQuery HTMLSelectElement object - The
 *                                          select which chooses which collection to
 *                                          organize.
 *  @param  params.uploadButton             An UploadLinkLargeIconButton object.      
 *
 **/
GlobalOptionsPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    var contents = this.contents;
    
    /* Make sure parameter was passed in */
    var collectionSelector = contents.find('.collection_selector');
    if(typeof(collectionSelector) == 'undefined' || collectionSelector.length == 0) {
        throw new Error('collectionSelector not found');
    }
    /* Save as member */
    this.collectionSelector = collectionSelector;
    

    /* Get upload button */
    var uploadButtonContainer = contents.find('#upload_button');
    /* If this page has an upload button */
    if(uploadButtonContainer.length) {
        /* Create UploadLinkLargeIconButton object */
        this.uploadButton = new UploadLinkLargeIconButton({
            container: uploadButtonContainer, 
        });        
    }
    
    /* Get dashboard button */
    var dashboardButtonContainer = contents.find('#dashboard_button');
    /* If this page has a dashboard button */
    if(dashboardButtonContainer.length) {
        /* Create dashboard button */
        this.dashboardButton = new DashboardLinkLargeIconButton({
            container: dashboardButtonContainer,
        });        
    }
    
    /* get settings button */
    var settingsButtonContainer = contents.find('#settings_button');
    /* if this page has a settings button */
    if(settingsButtonContainer.length) {
        /* Create settings Button */
        this.settingsButton = new SettingsLinkLargeIconButton({
            container: settingsButtonContainer, 
        });
    }
    
    
    //this.retrieveAndUpdateCollectionSelector();
    
    /** INitialize behavior for collection selector */
    collectionSelector.bind('change', function(e) {
        var collection_id = $(this).val();
        
        window.location = '/organize/collection/'+collection_id;
    });

    /* The Backbone view object for the collection selector */
    var userCollectionSelectView = new UserCollectionSelectView({
        id: 'collection_selector', 
        collection: this.page.collections,
        collectionSelectorOptionsTemplate: $('#collection_selector_options_template'), 
        collectionSelector: collectionSelector, 
    });
    
    userCollectionSelectView.render();
    this.userCollectionSelectView = userCollectionSelectView;
}