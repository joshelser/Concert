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
    
    /* Here we will store the audio segments and files that are selected (from the
    audio list panel).  Currently only one segment/file can be selected at once, so 
    the total cardinality of these sets will be 1. */
    this.selectedAudioSegments = new AudioSegmentSet;
    this.selectedAudioFiles = new AudioFileSet;
    
};

OrganizePageModelManager.prototype._loadData = function() {
    LoggedInModelManager.prototype._loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    this.collectionAudioFiles.refresh(dataToLoad.fileData, {silent: true});
    dataToLoad.fileData = null;
    
    this.collectionAudioSegments.refresh(dataToLoad.segmentData);
    dataToLoad.segmentData = null;
};

/**
 *  Use this when files are to be selected on the user interface
 **/
OrganizePageModelManager.prototype.select_audio = function(params) {
    var files = params.files;
    if(typeof(files) == 'undefined') {
        files = [];
    }
    
    var segments = params.segments;
    if(typeof(segments) == 'undefined') {
        segments = [];
    }
    
    /* remove previously selected segments and select new ones */
    this.selectedAudioSegments.refresh(segments, {silent: true});
    /* Remove previously selected files and select new ones */
    this.selectedAudioFiles.refresh(files);
};
