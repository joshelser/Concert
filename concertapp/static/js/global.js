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
     *  Create global widgets and buttons for the globalOptionsPanel
     **/
    var globalOptionsParams = {
        container: $('#page_header'), 
        collectionSelector: $('#collection_selector')
    }; 
    
    /* Get upload button */
    var uploadButtonContainer = $('#upload_button_container');
    /* If this page has an upload button */
    if(uploadButtonContainer.length) {
        /* Create UploadLinkLargeIconButton object */
        globalOptionsParams.uploadButton = new UploadLinkLargeIconButton({
            container: uploadButtonContainer, 
            icon: $('#upload_button_icon'), 
            label: $('#upload_button_label')
        });        
    }
    
    /* Get dashboard button */
    var dashboardButtonContainer = $('#dashboard_button_container');
    /* If this page has a dashboard button */
    if(dashboardButtonContainer.length) {
        /* Create dashboard button */
        globalOptionsParams.dashboardButton = new DashboardLinkLargeIconButton({
            container: dashboardButtonContainer,
            icon: $('#dashboard_button_icon'),
            label: $('#dashboard_button_label')
        });        
    }
    
    /* get settings button */
    var settingsButtonContainer = $('#settings_button_container');
    /* if this page has a settings button */
    if(settingsButtonContainer.length) {
        /* Create settings Button */
        globalOptionsParams.settingsButton = new SettingsLinkLargeIconButton({
            container: settingsButtonContainer, 
            icon: $('#settings_button_icon'), 
            label: $('#settings_button_label'),
        });
    }
    
    /**
     *  Create globalOptionsPanel
     **/
    var globalOptionsPanel = new GlobalOptionsPanel(globalOptionsParams);

    
    
    /* For each page, run JS corresponding to that page */
    var pageInitializers = {
        '/users/login/': initializeLoginPage,
        '/dashboard/': initializeDashboardPage,
        '/collections/': initializeCollectionsPage,
        '/audio/upload/': initializeAudioUploadPage
    };
    
    /* Get URL of page (relative to server address) */
    var pagePath = window.location.pathname;
    
    /* Initialize proper page function */
    try {
        pageInitializers[pagePath]();
    }
    catch(err) {
        if(err.name == 'TypeError') {
            throw new Error('Page is not initialized:\n'+err);
        }
        else {
            throw err;
        }
    }


});