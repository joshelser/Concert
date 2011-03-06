/**
 *  @file       AudioSegment.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Audio segment object.
 *  @class
 *  @extends    ConcertBackboneModel
 **/
var AudioSegment = ConcertBackboneModel.extend({
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'audioFile', 
                model: AudioFile
            },
            {
                attr: 'creator', 
                model: User 
            },
            {
                attr: 'collection', 
                model: Collection 
            }
        ];
    }, 
    base_url: '/api/1/audiosegment/', 
    name: 'AudioSegment'
    apiName: 'audiosegment', 
});

/**
 *  A set of audio segment objects.
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var AudioSegmentSet = ConcertBackboneCollection.extend({
    model: AudioSegment 
});