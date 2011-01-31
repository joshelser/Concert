/**
 *  @file       Request.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  A Request that represents a Request resource on the server.
 **/ 
var Request = Backbone.Model.extend({
    
    /**
     *  @constructor
     **/
    initialize: function() {
        
        /**
         *  TODO: Generalize this for each model type
         **/
        var user = this.get('user');
        if(!(user instanceof Backbone.Model)) {
            if(typeof(user) == 'string') {
                user_id = user.split('/');
                user_id = user_id[user_id.length-2];
            }
            else {
                user_id = user.id;
            }
            
            var seenUsers = com.concertsoundorganizer.datasetManager.seenUsers;
            /* If we've seen this user object before, it will be defined here */
            var seenUser = seenUsers.get(user_id);
            if(seenUser) {
                user = seenUser;
            }
            else {
                user = new User(user);
                seenUsers.add(user);
            }
            
            this.set({user: user});
        }
        
        var collection = this.get('collection');
        if(!(collection instanceof Backbone.Model)) {
            var seenCollections = com.concertsoundorganizer.datasetManager.seenCollections;
            
            /* If we've seen this collection before, use that one */
            var seenCollection = seenCollections.get(collection.id);
            if(seenCollection) {
                collection = seenCollection;
            }
            else {
                collection = new Collection(collection);
                seenCollections.add(collection);
            }
            this.set({collection: collection});
        }
        
    },/*
    collectionType function(attrs, options) {
        var userData = attrs['user'];
        /* If a user was sent in as a JSON object, make sure we treat it as a
            User object 
        if(userData && typeof(userData) == 'object') {
            var newUser = new User(userData);
            attrs['user'] = newUser;
        }
        
        var collectionData = attrs['collection'];
        /**
         *  If the collection was sent in as JSON, do the same.
         *
         if(collectionData && typeof(collectionData) == 'object') {
             var newCollection = new Collection(collectionData);
            attrs['collection'] = newCollection;
         }
         
         return Backbone.Model.prototype.set.call(this, attrs, options);
        
    }, */
    url: function() {
        var base = '/api/1/request/';
        var id = this.get('id');
        if(id) {
            return base+id+'/';
        }
        else {
            return base;
        }
    }
});

/**
 *  A set of Request objects.
 **/
var RequestSet = ConcertBackboneCollection.extend({
    model: Request, 
    getSeenInstances: function() {
        return com.concertsoundorganizer.datasetManager.seenRequests;
    }, 
});