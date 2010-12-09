/**
 *  @file       GlobalOptionsPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panel on the top of every page.
 *	@class
 *  @param  params.collectionSelector        jQuery HTMLSelectElement object - The
 *                                          select which chooses which collection to
 *                                          organize.
 *  @param  params.uploadButton             An UploadLinkLargeIconButton object.      
 *
 **/
var GlobalOptionsPanel = Panel.extend({
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;

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

        /* This is the template for the collection dropdown */
        var collectionSelectorOptionsTemplate = $('#collection_selector_options_template');
        if(typeof(collectionSelectorOptionsTemplate) == 'undefined' || collectionSelectorOptionsTemplate.length == 0) {
            throw new Error('collectionSelectorOptionsTemplate not found');
        }
        this.collectionSelectorOptionsTemplate = collectionSelectorOptionsTemplate;


        this.render();
    },
    
    /* To render this panel, just populate the dropdown */
    render: function() {

        /* Populate dropdown */
        this.collectionSelector.html(
            this.collectionSelectorOptionsTemplate.tmpl({
                collections: this.page.collections.toJSON(), 
            })
        );


        return this;

    }

});


