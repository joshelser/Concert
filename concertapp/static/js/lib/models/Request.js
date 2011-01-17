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
        var userData = this.get('user');

        /* If a user was sent in as a JSON object, make sure we treat it as a
            User object */
        if(userData && typeof(userData) == 'object') {
            var newUser = new User;
            newUser.set(userData);
            this.set({'user': newUser});
            
            var user = this.get('user');
        }
        
    },
});

/**
 *  A set of Request objects.
 **/
var RequestSet = Backbone.Collection.extend({
    model: Request, 
});