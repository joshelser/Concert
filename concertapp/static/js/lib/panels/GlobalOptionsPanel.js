/**
 *  @file       GlobalOptionsPanel.js
 *  The panel on the top of every page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
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
    var collectionSelector = params.collectionSelector;
    if(typeof(collectionSelector) == 'undefined') {
        throw new Error('params.collectionSelector is undefined');
    }
    /* Save as member */
    this.collectionSelector = collectionSelector;
    
    var collectionSelectorOptionsTemplate = params.collectionSelectorOptionsTemplate;
    if(typeof(collectionSelectorOptionsTemplate) == 'undefined') {
        throw new Error('params.collectionSelectorOptionsTemplate is undefined');
    }
    this.collectionSelectorOptionsTemplate = collectionSelectorOptionsTemplate;
    

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
    
    
    this.retrieveAndUpdateCollectionSelector();
    
    /** INitialize behavior for collection selector */
    collectionSelector.bind('change', function(e) {
        var collection_id = $(this).val();
        
        window.location = '/organize/collection/'+collection_id;
    });
}

/**
 *  This will update the collectionSelector dropdown.  If params.collections is 
 *  defined, we will update the dropdown with those objects.  If not, we will
 *  retrieve the collections first.
 *
 *  @param  data        Array  -    response data from backend (collection objs)
 **/
GlobalOptionsPanel.prototype.updateCollectionSelector = function(data) {
    
    if(typeof(data) == 'undefined') {
        this.retrieveAndUpdateCollectionSelector();
    }
    
    /* Populate dropdown */
    this.collectionSelector.html(
        this.collectionSelectorOptionsTemplate.tmpl({
            collections: data, 
        })
    );
    
    
}

/**
 *  This will retrieve the collections from the backend, then update the collection
 *  dropdown.
 **/
GlobalOptionsPanel.prototype.retrieveAndUpdateCollectionSelector = function() {
    this.toggleLoadingNotification();
    
    /* retrieve the collections */
    $.getJSON(
        '/collections/user/', 
        function(me) {
            return function(data, status, xhr) {
                me.updateCollectionSelector(data);
                me.toggleLoadingNotification();
            };
        }(this)
    );
}

/**
 *  This will remove a collection from the collection selector.
 *
 *  @param  collection_id        Number  -  The id of the collection
 **/
GlobalOptionsPanel.prototype.removeCollectionFromSelector = function(collection_id) {
    $('#collection_option-'+collection_id).remove();
}

