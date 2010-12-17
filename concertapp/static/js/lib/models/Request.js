/**
 *  @file       Request.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  A Request that represents a Request resource on the server.
 **/ 
var Request = Backbone.Model.extend({
    
});

/**
 *  A set of Request objects.
 **/
var RequestSet = Backbone.Collection.extend({
    model: Request, 
});