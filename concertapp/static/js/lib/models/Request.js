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

        
    },
    set: function(attrs, options) {
        var userData = attrs['user'];
        /* If a user was sent in as a JSON object, make sure we treat it as a
            User object */
        if(userData && typeof(userData) == 'object') {
            var newUser = new User(userData);
            attrs['user'] = newUser;
        }
        
        var collectionData = attrs['collection'];
        /**
         *  If the collection was sent in as JSON, do the same.
         **/
         if(collectionData && typeof(collectionData) == 'object') {
             var newCollection = new Collection(collectionData);
            attrs['collection'] = newCollection;
         }
         
         return Backbone.Model.prototype.set.call(this, attrs, options);
        
    }, 
    url: function() {
        var base = '/api/1/request/';
        var id = this.get('id');
        if(id) {
            return base+id+'/';
        }
        else {
            return base;
        }
    }, 
});

/**
 *  A set of Request objects.
 **/
var RequestSet = Backbone.Collection.extend({
    model: Request, 
});