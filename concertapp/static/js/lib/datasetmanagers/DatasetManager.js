/**
 *  @file       DatasetManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the base class for a group of data sets.  A single DatasetManager
 *  (or subclass) object will be instantiated on each page.  The functionality
 *  contained below is required on any page.
 *  @class
 **/
function DatasetManager(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  @constructor
 **/
DatasetManager.prototype.init = function(params) {
    /* Here we will store the temporary data that we will load later */
    this._dataToLoad = {};
    

    
};