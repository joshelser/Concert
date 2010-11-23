/**
 *  @file       global.js
 *  Contains the functionality that all pages must have.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
 
/**
 *  Global variables are in a namespace data structure.
 **/
if(!com) var com = {};
if(!com.concertsoundorganizer) com.concertsoundorganizer = {};
if(!com.concertsoundorganizer.animation) {
    com.concertsoundorganizer.animation = {};
}
if(!com.concertsoundorganizer.compatibility) {
    com.concertsoundorganizer.compatibility = {};
}
if(!com.concertsoundorganizer.ajax) {
    com.concertsoundorganizer.ajax = {};
}


$(document).ready(function(){
    
    /* Make $ a local variable for performance */
    var $ = jQuery;
    
    /* Make all fields in the future that have the "autoClear" class on them    
        autoclear */
    initializeAutoClearFieldBehavior();
    
    /* Make global notifier object that we can use anywhere to notify the user */
    com.concertsoundorganizer.notifier = new Notifier({});
    
    /* image urls put here will be loaded 
    preloadImages([
        '/graphics/ajax-loader.gif',
        '/graphics/somethingelse.jpg'
    ]);
    */

    /**
    *    Set default animation speed.
    **/
    com.concertsoundorganizer.animation = {
        speed: 200,
    }
    
    /**
     *  This parameter will be sent to the page controller
     **/
    var params = {};
    
    /**
     *  Create global widgets and buttons for the globalOptionsPanel
     **/
    var globalOptionsParams = {
        container: $('#global_options_panel'), 
        collectionSelector: $('#collection_selector'),
        collectionSelectorOptionsTemplate: $('#collection_dropdown_options')
    }; 
    
    /* Get upload button */
    var uploadButtonContainer = $('#upload_button');
    /* If this page has an upload button */
    if(uploadButtonContainer.length) {
        /* Create UploadLinkLargeIconButton object */
        globalOptionsParams.uploadButton = new UploadLinkLargeIconButton({
            container: uploadButtonContainer, 
        });        
    }
    
    /* Get dashboard button */
    var dashboardButtonContainer = $('#dashboard_button');
    /* If this page has a dashboard button */
    if(dashboardButtonContainer.length) {
        /* Create dashboard button */
        globalOptionsParams.dashboardButton = new DashboardLinkLargeIconButton({
            container: dashboardButtonContainer,
        });        
    }
    
    /* get settings button */
    var settingsButtonContainer = $('#settings_button');
    /* if this page has a settings button */
    if(settingsButtonContainer.length) {
        /* Create settings Button */
        globalOptionsParams.settingsButton = new SettingsLinkLargeIconButton({
            container: settingsButtonContainer, 
        });
    }
    
    /**
     *  Create globalOptionsPanel
     **/
    params.globalOptionsPanel = new GlobalOptionsPanel(globalOptionsParams);

    
    
    /* For each page, run JS corresponding to that page */
    var pageInitializers = {
        '/login/': initializeLoginPage,
        '/dashboard/': initializeDashboardPage,
        '/collections/': initializeCollectionsPage,
        '/audio/upload/': initializeUploadPage,
        '/organize/collection/': initializeOrganizePage
    };
    
    /* This pagePath variable is being set in the global base_site.html template */
    pageInitializers[pagePath](params);


});