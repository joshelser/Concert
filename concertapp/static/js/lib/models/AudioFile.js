/**
 *  @file       AudioFile.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  An audio file object.
 *  @class
 *  @extends    ConcertBackboneModel
 **/
var AudioFile = ConcertBackboneModel.extend({
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'uploader', 
                model: User 
            },
            {
                attr: 'collection', 
                model: Collection 
            }
        ];
    }, 
    base_url: '/api/1/audiofile/', 
    name: 'AudioFile', 
    apiName: 'audiofile', 
});

/**
 *  A set of audio file objects
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var AudioFileSet = ConcertBackboneCollection.extend({
    model: AudioFile
});