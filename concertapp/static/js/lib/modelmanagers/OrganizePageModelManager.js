/**
 *  @file       OrganizePageModelManager.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Model manager for the organize page.
 *  @class
 *  @extends    LoggedInModelManager
 **/
function OrganizePageModelManager(params) {
    if(params) {
        this.init(params);
    }
}
OrganizePageModelManager.prototype = new LoggedInModelManager();

/**
 *  @constructor
 **/
OrganizePageModelManager.prototype.init = function(params) {
    LoggedInModelManager.prototype.init.call(this, params);

    var dataToLoad = this._dataToLoad;
    
    /**
     *  The raw audio file data
     **/
    var fileData = params.files;
    if(typeof(fileData) == 'undefined') {
        throw new Error('params.files is undefined');
    }
    dataToLoad.fileData = fileData;
    
    /* Here we will hold the audio files for this collection (just in case others
    are seen) */
    this.collectionAudioFiles = new AudioFileSet;
    
    /**
     *  The raw audio segment data
     **/
    var segmentData = params.segments;
    if(typeof(segmentData) == 'undefined') {
        throw new Error('params.segments is undefined');
    }
    dataToLoad.segmentData = segmentData;
    
    /* Here we will hold all of the audio segments for this collection for the
    same reason as above */
    this.collectionAudioSegments = new AudioSegmentSet;
    
};

OrganizePageModelManager.prototype.loadData = function() {
    LoggedInModelManager.prototype.loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    this.collectionAudioFiles.refresh(dataToLoad.fileData);
    dataToLoad.fileData = null;
    
    this.collectionAudioSegments.refresh(dataToLoad.segmentData);
    dataToLoad.segmentData = null;
};