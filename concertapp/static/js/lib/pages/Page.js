/**
 *  @file       Page.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is the class that contains the functionality that needs to be run on
 *  every page.
 *	@class
 **/
function Page(params) {
    if(params) {
        this.init(params);
    }
}

Page.prototype.init = function(params) {
    /* Create dataset manager */
    var datasetManager = this.createDatasetManager(params);
    this.datasetManager = datasetManager;
    com.concertsoundorganizer.datasetManager = datasetManager;
    
};

/**
 *  This method just defines which dataset manager to use.  Should be overridden
 *  in child classes for appropriate type.
 *
 *  @param  {Object}    params    - The parameters that were sent to init.
 **/
Page.prototype.createDatasetManager = function(params) {
    return new DatasetManager(params);
};
