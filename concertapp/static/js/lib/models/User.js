/**
 *  @file       User.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  User represents a django User object.
 *  @class
 **/ 
var User = Backbone.Model.extend({
    
});

/**
 *  Users represents a collection of django User objects.
 *  @class
 **/
var Users = Backbone.Collection.extend({
    model: User
});

