/**
 *  @file       User.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  User represents a django User object.
 *  @class
 *  @extends    Backbone.Model
 **/ 
var User = ConcertBackboneModel.extend({
    /**
     *  @constructor
     **/
    initialize: function() {
        
    }, 
    
    url: function() {
        var id = this.get('id');
        var base = '/api/1/user/';
        if(id) {
            return base+id+'/';
        }
        else {
            return base;
        }
    }, 
});

/**
 *  Users represents a collection of django User objects.
 *  @class
 **/
var UserSet = ConcertBackboneCollection.extend({
    model: User,
    getSeenInstances: function() {
        return com.concertsoundorganizer.datasetManager.seenUsers;
    }, 
});

