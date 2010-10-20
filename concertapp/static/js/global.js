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


$(document).ready(function(){
    
    
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

    
    
    /* For each page, run JS corresponding to that page */
    var pageInitializers = {
        '/users/login/': initializeLoginPage,
        '/dashboard/': initializeDashboardPage,
        '/collections/manage/': initializeCollectionsPage
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