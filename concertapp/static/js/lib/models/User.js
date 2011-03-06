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
    name: 'User', 
    apiName: 'user' 
});

/**
 *  Users represents a collection of django User objects.
 *  @class
 **/
var UserSet = ConcertBackboneCollection.extend({
    model: User
});


/**
 *  A set of user objects for a specific collection.
 *  @class
 *  @extends    UserSet
 **/
var CollectionUserSet = UserSet.extend({
    url: 'value', 
});

