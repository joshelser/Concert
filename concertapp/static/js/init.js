/**
 *  @file       init.js
 *  This file contains the function that is called from the bottom of the template,
 *  to initialize all client side code.  It also contains the individual functions
 *  that are used to initialize each page on the UI.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Initialize all client side functionality by creating the applicable
 *  page object.
 *
 *  @param  pagePath        String  -   From the server, the string that we will
 *  use to determine what page we are on.  This variable is sent in on 
 *  base_site.html template.
 **/
function initializeUI(pagePath) {
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

        /* For each page, run JS corresponding to that page */
        var pageInitializers = {
            '/login/': function() {
                /* This will throw a modal window to the user 
                    if there is a compatibility problem. */
                detectBrowserCompatibility();
                return new LoginPage({});
            },
            '/dashboard/': function() {
                return new DashboardPage({});
            },
            '/collections/': function() {
                return new CollectionsPage({});
            },
            '/audio/upload/': function() {
                return new UploadPage({});
            },
            '/organize/collection/': function() {
                return new OrganizePage({});
            }
        };

        /* Run the initializer function for this page. */
        var page = pageInitializers[pagePath]();
    });
}